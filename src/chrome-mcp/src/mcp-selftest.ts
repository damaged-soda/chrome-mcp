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
    name: "chrome-mcp-selftest",
    version: "0.0.0",
  },
  {
    capabilities: {},
  },
);

try {
  await client.connect(transport);
  const result = await client.callTool({ name: "ping", arguments: {} });
  const content = (result as { content: Array<{ type: string; text?: string }> })
    .content;

  const text = content
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");

  assert.match(text, /\bpong\b/);
  process.stdout.write("mcp selftest ok\n");
} finally {
  await transport.close();
}
