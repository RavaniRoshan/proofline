/** Stage 1 — split a draft into candidate claim spans with exact offsets. */

export interface Segment {
  text: string;
  charStart: number;
  charEnd: number;
}

const DELIM = /(?<!\d),(?!\d)|[.;!?]+/g;
const LIST_MARK = /^\s*(?:[-*•]|\d+[.)])\s+/;

export function segmentDraft(draft: string): Segment[] {
  const out: Segment[] = [];
  let offset = 0;
  for (const line of draft.split("\n")) {
    const lineStart = offset;
    offset += line.length + 1;
    if (/^\s*#{1,6}\s/.test(line)) continue; // markdown heading — never a claim
    let last = 0;
    for (const m of line.matchAll(DELIM)) {
      pushClause(out, line, lineStart, last, m.index ?? last);
      last = (m.index ?? last) + m[0].length;
    }
    pushClause(out, line, lineStart, last, line.length);
  }
  return out;
}

function pushClause(
  out: Segment[],
  line: string,
  lineStart: number,
  from: number,
  to: number,
): void {
  let start = from;
  let end = to;
  // Skip leading whitespace.
  while (start < end && /\s/.test(line[start]!)) start++;
  while (end > start && /\s/.test(line[end - 1]!)) end--;
  // Strip leading conjunction left over from a comma split (", and the best ...").
  const lead = /^(and|but|so|or)\s+/i.exec(line.slice(start, end));
  if (lead) start += lead[0].length;
  // Strip list markers like "- " or "1. " without shifting the span of real content.
  const raw = line.slice(start, end);
  const mark = LIST_MARK.exec(raw);
  if (mark) start += mark[0].length;
  const text = line.slice(start, end).trim();
  if (text === "") return;
  const words = text.split(/\s+/).length;
  const hasDigit = /\d/.test(text);
  if (words < 2 && !hasDigit) return; // fragment, not a claim
  out.push({ text, charStart: lineStart + start, charEnd: lineStart + end });
}
