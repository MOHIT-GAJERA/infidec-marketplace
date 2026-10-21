/**
 * Minimal Markdown → block tree parser for the product documentation (no runtime dependency).
 *
 * Supported syntax
 *   ---\nkey: value\n---           front matter (title, description, label)
 *   ## Heading / ### Heading       sections (h2 entries feed the "On this page" list)
 *   paragraphs                     inline **bold**, *italic*, `code`, [text](href), <kbd>Ctrl</kbd>
 *   - item / 1. item               lists (one level, continuation lines indented by 2+ spaces)
 *   ```lang title="file"           fenced code
 *   | a | b |                      tables (first row = header, second row = --- separator)
 *   :::note|tip|warning|danger Title  …  :::     callouts (body is Markdown)
 *   :::steps … :::                 numbered step cards; each "### Step title" starts a step
 *   :::cards … :::                 link cards: "- [Title](href) Description"
 *   ![alt](src "caption")          images; consecutive image lines form a gallery
 */

export type Inline = string; // inline Markdown, rendered by <InlineMd>

export type DocBlock =
  | { type: "h2"; id: string; text: Inline }
  | { type: "h3"; id: string; text: Inline }
  | { type: "p"; text: Inline }
  | { type: "list"; ordered: boolean; items: Inline[] }
  | { type: "code"; lang: string; title?: string; code: string }
  | { type: "table"; head: Inline[]; rows: Inline[][] }
  | { type: "callout"; tone: CalloutTone; title?: string; blocks: DocBlock[] }
  | { type: "steps"; steps: { title: Inline; blocks: DocBlock[] }[] }
  | { type: "cards"; cards: { title: string; href: string; text: Inline }[] }
  | { type: "images"; images: { src: string; alt: string; caption?: string }[] };

export type CalloutTone = "note" | "tip" | "warning" | "danger";

export type ParsedDoc = { meta: Record<string, string>; blocks: DocBlock[] };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_[\]()]/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const IMG = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;
const LIST = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const TONES = new Set(["note", "tip", "warning", "danger"]);

function splitRow(line: string): string[] {
  const t = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  // allow escaped pipes \| inside cells
  return t.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
}

export function parseMarkdown(src: string): ParsedDoc {
  let text = src.replace(/\r\n?/g, "\n");
  const meta: Record<string, string> = {};
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (fm) {
    for (const line of fm[1].split("\n")) {
      const m = /^(\w[\w-]*):\s*(.*)$/.exec(line);
      if (m) meta[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    text = text.slice(fm[0].length);
  }
  const ids = new Map<string, number>();
  const uniqueId = (s: string) => {
    const base = slugify(s) || "section";
    const n = ids.get(base) ?? 0;
    ids.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
  return { meta, blocks: parseBlocks(text.split("\n"), uniqueId) };
}

function parseBlocks(lines: string[], uniqueId: (s: string) => string): DocBlock[] {
  const out: DocBlock[] = [];
  let i = 0;
  const para: string[] = [];
  const flush = () => {
    if (para.length) out.push({ type: "p", text: para.join(" ").trim() });
    para.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      i++;
      continue;
    }

    // fenced code
    const fence = /^```(\S*)\s*(?:title="([^"]*)")?\s*$/.exec(trimmed);
    if (fence) {
      flush();
      const body: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "```") body.push(lines[i++]);
      i++;
      out.push({ type: "code", lang: fence[1] || "text", title: fence[2], code: body.join("\n") });
      continue;
    }

    // containers
    const box = /^:::(\w+)\s*(.*)$/.exec(trimmed);
    if (box && box[1] !== "") {
      flush();
      const kind = box[1];
      const body: string[] = [];
      let depth = 1;
      i++;
      while (i < lines.length) {
        const t = lines[i].trim();
        if (/^:::\w+/.test(t)) depth++;
        else if (t === ":::") {
          depth--;
          if (depth === 0) break;
        }
        body.push(lines[i]);
        i++;
      }
      i++;
      if (TONES.has(kind)) {
        out.push({ type: "callout", tone: kind as CalloutTone, title: box[2] || undefined, blocks: parseBlocks(body, uniqueId) });
      } else if (kind === "steps") {
        const steps: { title: string; body: string[] }[] = [];
        for (const l of body) {
          const h = /^###\s+(.*)$/.exec(l.trim());
          if (h) steps.push({ title: h[1], body: [] });
          else if (steps.length) steps[steps.length - 1].body.push(l);
        }
        out.push({ type: "steps", steps: steps.map((s) => ({ title: s.title, blocks: parseBlocks(s.body, uniqueId) })) });
      } else if (kind === "cards") {
        const cards = body
          .map((l) => /^\s*-\s+\[([^\]]+)\]\(([^)]+)\)\s*(.*)$/.exec(l))
          .filter((m): m is RegExpExecArray => !!m)
          .map((m) => ({ title: m[1], href: m[2], text: m[3] }));
        out.push({ type: "cards", cards });
      }
      continue;
    }

    // headings
    const h = /^(#{2,3})\s+(.*)$/.exec(trimmed);
    if (h) {
      flush();
      const t = h[2].trim();
      out.push({ type: h[1].length === 2 ? "h2" : "h3", id: uniqueId(t), text: t });
      i++;
      continue;
    }

    // images (gallery when consecutive)
    if (IMG.test(trimmed)) {
      flush();
      const images: { src: string; alt: string; caption?: string }[] = [];
      while (i < lines.length && IMG.test(lines[i].trim())) {
        const m = IMG.exec(lines[i].trim())!;
        images.push({ alt: m[1], src: m[2], caption: m[3] });
        i++;
      }
      out.push({ type: "images", images });
      continue;
    }

    // tables
    if (trimmed.startsWith("|") && i + 1 < lines.length && /^\|?\s*:?-{3,}/.test(lines[i + 1].trim())) {
      flush();
      const head = splitRow(trimmed);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(splitRow(lines[i++]));
      out.push({ type: "table", head, rows });
      continue;
    }

    // lists
    const li = LIST.exec(line);
    if (li && li[1].length < 2) {
      flush();
      const ordered = /\d/.test(li[2]);
      const items: string[] = [];
      while (i < lines.length) {
        const m = LIST.exec(lines[i]);
        if (m && m[1].length < 2 && /\d/.test(m[2]) === ordered) {
          items.push(m[3]);
          i++;
        } else if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length) {
          items[items.length - 1] += " " + lines[i].trim();
          i++;
        } else break;
      }
      out.push({ type: "list", ordered, items });
      continue;
    }

    para.push(trimmed);
    i++;
  }
  flush();
  return out;
}

/** Plain text of a block tree (search index, descriptions). */
export function blocksToText(blocks: DocBlock[]): string {
  const strip = (s: string) => s.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*`]|<\/?kbd>/g, "");
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === "p" || b.type === "h2" || b.type === "h3") parts.push(strip(b.text));
    else if (b.type === "list") parts.push(...b.items.map(strip));
    else if (b.type === "table") parts.push(...b.rows.flat().map(strip));
    else if (b.type === "callout") parts.push(blocksToText(b.blocks));
    else if (b.type === "steps") b.steps.forEach((s) => parts.push(strip(s.title), blocksToText(s.blocks)));
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}
