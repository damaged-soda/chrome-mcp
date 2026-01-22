#!/usr/bin/env node
import { ping } from "./index.js";

function printHelp(): void {
  process.stdout.write(
    [
      "chrome-mcp (skeleton)",
      "",
      "Usage:",
      "  chrome-mcp ping",
      "  chrome-mcp --help",
      "",
    ].join("\n"),
  );
}

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h") || args.length === 0) {
  printHelp();
  process.exit(0);
}

if (args[0] === "ping") {
  process.stdout.write(`${ping()}\n`);
  process.exit(0);
}

process.stderr.write(`Unknown command: ${args[0]}\n\n`);
printHelp();
process.exit(1);

