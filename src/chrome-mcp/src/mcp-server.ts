#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "chrome-mcp",
  version: "0.0.0",
});

server.registerTool(
  "ping",
  {
    description: "Health check. Returns pong.",
  },
  async () => ({
    content: [{ type: "text", text: "pong" }],
  }),
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

