#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import puppeteer from "puppeteer-core";
import * as z from "zod/v4";

import type { Browser, KeyInput, Page, Target } from "puppeteer-core";

const server = new McpServer({
  name: "chrome-mcp",
  version: "0.0.0",
});

const CDP_BROWSER_URL = "http://127.0.0.1:9222";

type PageTargetInfo = {
  targetId: string;
  title: string;
  url: string;
};

let chromeBrowser: Browser | null = null;
let connectInFlight: Promise<Browser> | null = null;
let lastSelectedTargetId: string | null = null;

function getTargetId(target: Target): string {
  const targetId = (target as unknown as { _targetId?: string })._targetId;
  if (!targetId) {
    throw new Error("Unable to determine targetId (unsupported Puppeteer target)");
  }
  return targetId;
}

async function connectToChrome(): Promise<Browser> {
  if (chromeBrowser?.connected) {
    return chromeBrowser;
  }
  if (connectInFlight) {
    return connectInFlight;
  }

  connectInFlight = (async () => {
    const browser = await puppeteer.connect({ browserURL: CDP_BROWSER_URL });
    browser.once("disconnected", () => {
      chromeBrowser = null;
      lastSelectedTargetId = null;
    });
    chromeBrowser = browser;
    return browser;
  })();

  try {
    return await connectInFlight;
  } finally {
    connectInFlight = null;
  }
}

function requireConnectedChrome(): Browser {
  if (!chromeBrowser?.connected) {
    throw new Error(
      `Not connected to Chrome. Start Chrome with --remote-debugging-port=9222, then call chrome_connect (expects ${CDP_BROWSER_URL}).`,
    );
  }
  return chromeBrowser;
}

async function getPageByTargetId(targetId: string): Promise<Page> {
  const browser = requireConnectedChrome();
  const target = browser.targets().find((t) => {
    try {
      return getTargetId(t) === targetId;
    } catch {
      return false;
    }
  });
  if (!target) {
    throw new Error(`Unknown targetId: ${JSON.stringify(targetId)}`);
  }

  const page = await target.page();
  if (!page) {
    throw new Error(`Target is not a page: ${JSON.stringify(targetId)}`);
  }

  if (page.isClosed()) {
    throw new Error(`Page is closed: ${JSON.stringify(targetId)}`);
  }

  return page;
}

async function toPageTargetInfo(target: Target): Promise<PageTargetInfo> {
  const targetId = getTargetId(target);
  const url = target.url();

  let title = "";
  try {
    const page = await target.page();
    if (page) {
      title = await page.title();
    }
  } catch {
    // ignore
  }

  return { targetId, title, url };
}

async function listPageTargets(browser: Browser): Promise<PageTargetInfo[]> {
  const targets = browser.targets().filter((t) => t.type() === "page");
  const result: PageTargetInfo[] = [];
  for (const target of targets) {
    result.push(await toPageTargetInfo(target));
  }
  return result;
}

async function findActivePageTarget(browser: Browser): Promise<Target | null> {
  const pages = await browser.pages();
  for (const page of pages) {
    try {
      const focused = await page.evaluate(() => document.hasFocus());
      if (focused) {
        return page.target();
      }
    } catch {
      // ignore and continue
    }
  }
  return pages.at(-1)?.target() ?? null;
}

function pickUniqueMatch(targets: PageTargetInfo[], query: string): PageTargetInfo {
  const q = query.trim().toLowerCase();
  if (!q) {
    throw new Error("query must be a non-empty string");
  }

  const matches = targets.filter((t) => {
    const haystack = `${t.title}\n${t.url}`.toLowerCase();
    return haystack.includes(q);
  });

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length === 0) {
    throw new Error(`No targets match query: ${JSON.stringify(query)}`);
  }

  const preview = matches
    .slice(0, 8)
    .map((t) => `- ${t.targetId} | ${t.title || "<no title>"} | ${t.url}`)
    .join("\n");

  throw new Error(
    `Query matched ${matches.length} targets; please refine.\n${preview}`,
  );
}

server.registerTool(
  "ping",
  {
    description: "Health check. Returns pong.",
  },
  async () => ({
    content: [{ type: "text", text: "pong" }],
  }),
);

server.registerTool(
  "chrome_connect",
  {
    description:
      "Connect to a local Chrome started with --remote-debugging-port=9222 (expects http://127.0.0.1:9222).",
  },
  async () => {
    const browser = await connectToChrome();
    const info = {
      browserURL: CDP_BROWSER_URL,
      connected: browser.connected,
      version: await browser.version(),
      userAgent: await browser.userAgent(),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    };
  },
);

server.registerTool(
  "chrome_list_targets",
  {
    description: "List available page targets (tabs) from the connected Chrome.",
  },
  async () => {
    const browser = requireConnectedChrome();
    const targets = await listPageTargets(browser);
    return {
      content: [{ type: "text", text: JSON.stringify({ targets }, null, 2) }],
    };
  },
);

server.registerTool(
  "chrome_select_target",
  {
    description:
      "Select a target by best-effort active tab detection or fuzzy URL/title match.",
    inputSchema: {
      active: z.boolean().optional(),
      query: z.string().optional(),
    },
  },
  async ({ active, query }) => {
    const browser = requireConnectedChrome();

    let selected: PageTargetInfo | null = null;

    if (active) {
      const target = await findActivePageTarget(browser);
      if (!target) {
        throw new Error("No page targets found.");
      }
      selected = await toPageTargetInfo(target);
    } else if (query) {
      const targets = await listPageTargets(browser);
      selected = pickUniqueMatch(targets, query);
    } else if (lastSelectedTargetId) {
      const targets = await listPageTargets(browser);
      selected =
        targets.find((t) => t.targetId === lastSelectedTargetId) ?? null;
      if (!selected) {
        throw new Error(
          "No targetId provided and last selection is no longer available.",
        );
      }
    } else {
      throw new Error(
        "Provide { active: true } or { query: string } to select a target.",
      );
    }

    lastSelectedTargetId = selected.targetId;
    return {
      content: [{ type: "text", text: JSON.stringify(selected, null, 2) }],
    };
  },
);

server.registerTool(
  "chrome_eval",
  {
    description:
      "Evaluate JavaScript in the selected target (tab) and return the result.",
    inputSchema: {
      targetId: z.string(),
      expression: z.string(),
    },
  },
  async ({ targetId, expression }) => {
    const page = await getPageByTargetId(targetId);

    const value = await page.evaluate(
      async (expr) => await (0, eval)(expr),
      expression,
    );

    return {
      content: [
        {
          type: "text",
          text:
            typeof value === "string"
              ? value
              : JSON.stringify(value, null, 2) ?? String(value),
        },
      ],
    };
  },
);

server.registerTool(
  "chrome_wait_for_selector",
  {
    description: "Wait for a CSS selector to appear on the page.",
    inputSchema: {
      targetId: z.string(),
      selector: z.string(),
      timeoutMs: z.number().int().nonnegative().optional(),
    },
  },
  async ({ targetId, selector, timeoutMs }) => {
    const page = await getPageByTargetId(targetId);
    await page.waitForSelector(selector, {
      timeout: timeoutMs ?? 30_000,
    });
    return { content: [{ type: "text", text: "ok" }] };
  },
);

server.registerTool(
  "chrome_click",
  {
    description: "Click an element by CSS selector.",
    inputSchema: {
      targetId: z.string(),
      selector: z.string(),
    },
  },
  async ({ targetId, selector }) => {
    const page = await getPageByTargetId(targetId);
    await page.waitForSelector(selector, { timeout: 30_000 });
    await page.click(selector);
    return { content: [{ type: "text", text: "ok" }] };
  },
);

server.registerTool(
  "chrome_type",
  {
    description: "Type text into an element by CSS selector.",
    inputSchema: {
      targetId: z.string(),
      selector: z.string(),
      text: z.string(),
      clear: z.boolean().optional(),
    },
  },
  async ({ targetId, selector, text, clear }) => {
    const page = await getPageByTargetId(targetId);
    await page.waitForSelector(selector, { timeout: 30_000 });
    await page.focus(selector);

    if (clear) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) {
          return;
        }

        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          el.value = "";
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }

        if (el instanceof HTMLElement && el.isContentEditable) {
          el.textContent = "";
          el.dispatchEvent(new Event("input", { bubbles: true }));
          return;
        }
      }, selector);
    }

    await page.keyboard.type(text);
    return { content: [{ type: "text", text: "ok" }] };
  },
);

server.registerTool(
  "chrome_key_press",
  {
    description: "Press a key on the page (e.g. Enter).",
    inputSchema: {
      targetId: z.string(),
      key: z.string(),
    },
  },
  async ({ targetId, key }) => {
    const page = await getPageByTargetId(targetId);
    await page.keyboard.press(key as KeyInput);
    return { content: [{ type: "text", text: "ok" }] };
  },
);

server.registerTool(
  "chrome_get_html",
  {
    description:
      "Get page HTML (full document) or a selected element's outerHTML.",
    inputSchema: {
      targetId: z.string(),
      selector: z.string().optional(),
      maxChars: z.number().int().positive().optional(),
    },
  },
  async ({ targetId, selector, maxChars }) => {
    const page = await getPageByTargetId(targetId);
    const rawHtml =
      selector !== undefined
        ? await page.$eval(selector, (el) => (el as HTMLElement).outerHTML)
        : await page.content();

    const limit = Math.min(maxChars ?? 200_000, 1_000_000);
    const truncated = rawHtml.length > limit;
    const html = truncated
      ? `${rawHtml.slice(0, limit)}\n<!-- truncated: original_chars=${rawHtml.length} -->`
      : rawHtml;

    const info = {
      originalChars: rawHtml.length,
      returnedChars: html.length,
      truncated,
      limit,
      selector: selector ?? null,
    };

    return {
      content: [
        { type: "text", text: html },
        { type: "text", text: JSON.stringify(info, null, 2) },
      ],
    };
  },
);

server.registerTool(
  "chrome_screenshot",
  {
    description: "Capture a PNG screenshot (MCP image content).",
    inputSchema: {
      targetId: z.string(),
      fullPage: z.boolean().optional(),
    },
  },
  async ({ targetId, fullPage }) => {
    const page = await getPageByTargetId(targetId);
    const data = await page.screenshot({
      type: "png",
      encoding: "base64",
      fullPage: fullPage ?? false,
    });

    if (typeof data !== "string") {
      throw new Error("Unexpected screenshot result type");
    }

    const bytes = Buffer.from(data, "base64").byteLength;
    const info = { mimeType: "image/png", bytes, fullPage: fullPage ?? false };

    return {
      content: [
        { type: "image", data, mimeType: "image/png" },
        { type: "text", text: JSON.stringify(info, null, 2) },
      ],
    };
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("chrome-mcp MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
