/** Stage 1 — split a draft into candidate claim spans with exact offsets.
 *
 *  Paragraphs (blank-line separated) are the unit of prose; a single newline
 *  inside a paragraph is a soft wrap and is collapsed to a space in place, so
 *  offsets in the original draft stay exact. Markdown headings are skipped.
 */

export interface Segment {
  text: string;
  charStart: number;
  charEnd: number;
}

const DELIM = /(?<!\d),(?!\d)|[.;!?]+/g;
const LIST_MARK = /^\s*(?:[-*•]|\d+[.)])\s+/;
const HEADING = /^\s*#{1,6}\s/;
const LEADING_CONJ = /^(and|but|so|or)\s+/i;

export function segmentDraft(draft: string): Segment[] {
  const out: Segment[] = [];
  const paragraphRe = /\n{2,}/g;
  let pStart = 0;
  for (const m of draft.matchAll(paragraphRe)) {
    const pEnd = m.index ?? pStart;
    pushParagraph(out, draft, pStart, pEnd);
    pStart = (m.index ?? pStart) + m[0].length;
  }
  pushParagraph(out, draft, pStart, draft.length);
  return out;
}

function pushParagraph(out: Segment[], draft: string, from: number, to: number): void {
  const raw = draft.slice(from, to);
  if (HEADING.test(raw)) return; // markdown heading — never a claim
  // Collapse soft wraps 1:1 so every index is unchanged.
  const collapsed = raw.replace(/\n/g, " ");
  let last = 0;
  for (const m of collapsed.matchAll(DELIM)) {
    pushClause(out, collapsed, from, last, m.index ?? last);
    last = (m.index ?? last) + m[0].length;
  }
  pushClause(out, collapsed, from, last, collapsed.length);
}

function pushClause(
  out: Segment[],
  text: string,
  base: number,
  from: number,
  to: number,
): void {
  let start = from;
  let end = to;
  while (start < end && /\s/.test(text[start]!)) start++;
  while (end > start && /\s/.test(text[end - 1]!)) end--;
  // Strip list markers like "- " or "1. " without moving the span of real content.
  const raw = text.slice(start, end);
  const mark = LIST_MARK.exec(raw);
  if (mark) start += mark[0].length;
  // Strip leading conjunction left over from a clause split (", and the best …").
  const lead = LEADING_CONJ.exec(text.slice(start, end));
  if (lead) start += lead[0].length;
  const trimmed = text.slice(start, end).trim();
  if (trimmed === "") return;
  const words = trimmed.split(/\s+/).length;
  const hasDigit = /\d/.test(trimmed);
  if (words < 2 && !hasDigit) return; // fragment, not a claim
  out.push({ text: trimmed, charStart: base + start, charEnd: base + end });
}
