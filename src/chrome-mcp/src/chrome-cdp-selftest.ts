import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const mcpServerPath = fileURLToPath(new URL("./mcp-server.js", import.meta.url));

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [mcpServerPath],
  stderr: "inherit",
});

const client = new Client(
  {
    name: "chrome-cdp-selftest",
    version: "0.0.0",
  },
  {
    capabilities: {},
  },
);

function getTextContent(result: unknown): string {
  const content = (result as { content: Array<{ type: string; text?: string }> })
    .content;
  return content
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
}

try {
  await client.connect(transport);

  await client.callTool({ name: "chrome_connect", arguments: {} });

  const selected = await client.callTool({
    name: "chrome_select_target",
    arguments: { active: true },
  });

  const selectedInfo = JSON.parse(getTextContent(selected)) as {
    targetId: string;
  };
  assert.ok(selectedInfo.targetId, "expected selected targetId");

  const evalResult = await client.callTool({
    name: "chrome_eval",
    arguments: {
      targetId: selectedInfo.targetId,
      expression: "typeof document.title",
    },
  });
  const ok = getTextContent(evalResult).trim();
  assert.equal(ok, "string");

  process.stdout.write("chrome cdp selftest ok\n");
} finally {
  await transport.close();
}
