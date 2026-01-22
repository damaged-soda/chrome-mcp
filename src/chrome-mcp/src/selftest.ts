import assert from "node:assert/strict";
import { ping } from "./index.js";

assert.equal(ping(), "pong");
process.stdout.write("selftest ok\n");

