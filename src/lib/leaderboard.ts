import type { LeaderRow } from "./types";
import { leagueIdx } from "./gamification";

export type Scope = "nasional" | "instansi" | "formasi" | "provinsi";

export interface RankedRow extends LeaderRow {
  rank: number;
}

export function ranked(rows: LeaderRow[]): RankedRow[] {
  return rows
    .slice()
    .sort((a, b) => b.best_total - a.best_total)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function filterScope(
  rows: LeaderRow[],
  me: LeaderRow | undefined,
  scope: Scope,
): LeaderRow[] {
  if (!me || scope === "nasional") return rows;
  if (scope === "instansi")
    return rows.filter((r) => r.instansi_id && r.instansi_id === me.instansi_id);
  if (scope === "formasi")
    return rows.filter(
      (r) =>
        r.instansi_id &&
        r.instansi_id === me.instansi_id &&
        r.jabatan_id &&
        r.jabatan_id === me.jabatan_id,
    );
  if (scope === "provinsi")
    return rows.filter((r) => r.provinsi_id && r.provinsi_id === me.provinsi_id);
  return rows;
}

export function sameLeague(rows: LeaderRow[], myScore: number): LeaderRow[] {
  const mine = leagueIdx(myScore);
  return rows.filter((r) => leagueIdx(r.best_total) === mine);
}
