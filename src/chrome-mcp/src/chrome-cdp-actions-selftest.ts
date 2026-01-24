import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import puppeteer from "puppeteer-core";

const CDP_BROWSER_URL = "http://127.0.0.1:9222";

const mcpServerPath = fileURLToPath(new URL("./mcp-server.js", import.meta.url));

function getTextContent(result: unknown): string {
  const content = (result as { content: Array<{ type: string; text?: string }> })
    .content;
  return content
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
}

function getImageContent(result: unknown): { mimeType: string; data: string } {
  const content = (
    result as { content: Array<{ type: string; mimeType?: string; data?: string }> }
  ).content;
  const img = content.find((item) => item.type === "image");
  if (!img || !img.mimeType || !img.data) {
    throw new Error("Expected image content in tool result");
  }
  return { mimeType: img.mimeType, data: img.data };
}

const browser = await puppeteer.connect({ browserURL: CDP_BROWSER_URL });
const page = await browser.newPage();

try {
  await page.setContent(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>chrome-cdp-actions-selftest</title>
  </head>
  <body>
    <input id="q" />
    <button id="btn">Click</button>
    <div id="status">init</div>
    <script>
      const status = document.getElementById('status');
      const input = document.getElementById('q');
      const btn = document.getElementById('btn');
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') status.textContent = 'entered:' + input.value;
      });
      btn.addEventListener('click', () => {
        status.textContent = 'clicked:' + input.value;
      });
      setTimeout(() => {
        const d = document.createElement('div');
        d.id = 'dynamic';
        d.textContent = 'ready';
        document.body.appendChild(d);
      }, 200);
    </script>
  </body>
</html>`);

  const targetId = (page.target() as unknown as { _targetId?: string })._targetId;
  assert.ok(targetId, "Expected targetId for new page");

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [mcpServerPath],
    stderr: "inherit",
  });
  const client = new Client(
    { name: "chrome-cdp-actions-selftest", version: "0.0.0" },
    { capabilities: {} },
  );

  try {
    await client.connect(transport);

    await client.callTool({ name: "chrome_connect", arguments: {} });

    await client.callTool({
      name: "chrome_wait_for_selector",
      arguments: { targetId, selector: "#dynamic", timeoutMs: 5_000 },
    });

    await client.callTool({
      name: "chrome_type",
      arguments: { targetId, selector: "#q", text: "hello", clear: true },
    });

    await client.callTool({
      name: "chrome_key_press",
      arguments: { targetId, key: "Enter" },
    });

    await client.callTool({
      name: "chrome_click",
      arguments: { targetId, selector: "#btn" },
    });

    const htmlResult = await client.callTool({
      name: "chrome_get_html",
      arguments: { targetId, selector: "#status", maxChars: 10_000 },
    });
    const html = getTextContent(htmlResult);
    assert.match(html, /clicked:hello/);

    const screenshotResult = await client.callTool({
      name: "chrome_screenshot",
      arguments: { targetId, fullPage: false },
    });
    const img = getImageContent(screenshotResult);
    assert.equal(img.mimeType, "image/png");
    assert.ok(img.data.length > 1000);

    process.stdout.write("chrome cdp actions selftest ok\n");
  } finally {
    await transport.close();
  }
} finally {
  await page.close();
  await browser.disconnect();
}

