/** Derived views over the register for the /facts and /dashboard views. */
import { brand, facts, isActiveAt } from "@/lib/seed";
import { scalarOf } from "@/lib/normalize";
import type { Fact } from "@/lib/schemas";

export interface FactRow extends Fact {
  stale: boolean;
  conflict: boolean;
  productName: string;
}

function valueKey(f: Fact): string {
  const asList = f.unit.trim().toLowerCase() === "enum";
  const s = scalarOf(f.value, f.unit, { asList });
  if (s.kind === "list") return `l:${[...s.items].sort().join(",")}`;
  if (s.kind === "number") return `n:${Math.round(s.num * 1e6) / 1e6}`;
  if (s.kind === "boolean") return `b:${s.bool}`;
  return `t:${s.text}`;
}

/** (product, attribute) groups whose active approved facts disagree. */
export function findConflictGroups(
  reviewDate: string,
): Array<{ productId: string; attribute: string; factIds: string[] }> {
  const groups = new Map<string, Fact[]>();
  for (const f of facts) {
    if (f.status !== "approved") continue;
    if (!isActiveAt(f, reviewDate)) continue;
    const key = `${f.product_id} ${f.attribute}`;
    const list = groups.get(key) ?? [];
    list.push(f);
    groups.set(key, list);
  }
  const out: Array<{ productId: string; attribute: string; factIds: string[] }> = [];
  for (const [key, rows] of groups) {
    const distinct = new Set(rows.map(valueKey));
    if (rows.length >= 2 && distinct.size >= 2) {
      const [productId, attribute] = key.split(" ") as [string, string];
      out.push({ productId, attribute, factIds: rows.map((r) => `${r.fact_id} v${r.version}`) });
    }
  }
  return out.sort((a, b) => a.attribute.localeCompare(b.attribute));
}

/** Flat list of register rows annotated with stale/conflict flags. */
export function registerRows(reviewDate: string): FactRow[] {
  const conflicts = findConflictGroups(reviewDate);
  const conflictAttrs = new Set(conflicts.map((c) => `${c.productId} ${c.attribute}`));
  const productName = new Map(brand.products.map((p) => [p.product_id, p.name]));
  return facts
    .map((f) => ({
      ...f,
      stale: f.status === "superseded" || f.valid_until < reviewDate,
      conflict: conflictAttrs.has(`${f.product_id} ${f.attribute}`),
      productName: productName.get(f.product_id) ?? f.product_id,
    }))
    .sort(
      (a, b) =>
        a.fact_id.localeCompare(b.fact_id) ||
        b.version - a.version,
    );
}

export interface RegisterStats {
  rows: number;
  factIds: number;
  approvedCurrent: number;
  stale: number;
  conflictingGroups: number;
  conflictingRows: number;
  products: string[];
}

export function registerStats(reviewDate: string): RegisterStats {
  const rows = registerRows(reviewDate);
  const current = rows.filter((r) => r.status === "approved" && isActiveAt(r, reviewDate));
  const conflictingRows = rows.filter((r) => r.conflict);
  return {
    rows: rows.length,
    factIds: new Set(rows.map((r) => r.fact_id)).size,
    approvedCurrent: current.length,
    stale: rows.filter((r) => r.stale).length,
    conflictingGroups: findConflictGroups(reviewDate).length,
    conflictingRows: conflictingRows.length,
    products: brand.products.map((p) => p.name),
  };
}
