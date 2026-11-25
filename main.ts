// make.fun entry: Make the AI Judge Feel Nostalgic — A Childhood Memory
// One sentence, 217 characters: a single frozen second in Grandma's kitchen.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Grandma's rice cooker clicked off and she lifted the lid with a dish towel, and the steam rolled up through the window light where dust hung like slow snow, and she packed it into the blue bowl still too hot to touch.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Guard: sealed gate is 1-280 characters, exactly ONE sentence, one line.
const text = LINE.trim();
if (text.length < 1 || text.length > 280) {
  fail(`entry must be 1-280 characters, got ${text.length}`);
}
if (/[\r\n]/.test(text)) fail("entry must be a single line");
if (/[\u0000-\u001f\u007f]/.test(text)) fail("entry must not contain control characters");
// Exactly one sentence: exactly one sentence-terminating mark, at the very end,
// and no ". " mid-text that would hide a second sentence.
const terminators = text.match(/[.!?]/g) ?? [];
if (terminators.length !== 1 || !/[.!?]$/.test(text)) {
  fail("entry must be exactly one sentence");
}
if (/[.!?]\s/.test(text)) fail("entry must not contain a sentence break mid-text");
// A memory needs substance: at least 5 words, no doubled spaces, no leading/trailing space.
if (text.split(/\s+/).length < 5) fail("entry is too short to be a memory");
if (/  /.test(text)) fail("entry must not contain doubled spaces");
if (text !== LINE) fail("entry text mismatch");

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text + "\n", "utf8");

// Read-back check: what landed on disk must be exactly the line + newline.
if (readFileSync(outPath, "utf8") !== text + "\n") {
  fail("read-back check failed: entry.txt does not match the line");
}
console.log(`wrote ${outPath}: ${text.length} characters, 1 sentence`);
