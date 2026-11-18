import type { Attempt } from "./types";

/* ===== XP & level ===== */
export const XP_PER_STEP = 10; // each completed lesson / node

export function totalXp(
  attempts: Attempt[],
  lessonsDone: number,
  nodesDone: number,
): number {
  const fromExam = attempts.reduce((s, a) => s + (a.pts || 0), 0);
  return fromExam + lessonsDone * XP_PER_STEP + nodesDone * XP_PER_STEP;
}

export interface LevelInfo {
  level: number;
  intoLevel: number; // xp accumulated inside current level
  need: number; // xp needed for this level span
  pct: number; // 0..100 progress to next level
}

const LEVEL_SPAN = 120;

export function levelInfo(xp: number): LevelInfo {
  const level = Math.floor(xp / LEVEL_SPAN) + 1;
  const intoLevel = xp % LEVEL_SPAN;
  return {
    level,
    intoLevel,
    need: LEVEL_SPAN,
    pct: Math.round((intoLevel / LEVEL_SPAN) * 100),
  };
}

/* ===== Streak ===== */
// days: array of "YYYY-MM-DD" strings. Returns the current consecutive streak
// counting back from today (or yesterday if today not yet logged).
export function streakCount(days: string[]): number {
  const set = new Set(days);
  let count = 0;
  const d = new Date();
  // allow the streak to still be "alive" if today isn't logged but yesterday is
  if (!set.has(fmt(d))) d.setDate(d.getDate() - 1);
  while (set.has(fmt(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

export function todayStr(): string {
  return fmt(new Date());
}

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/* ===== Leagues (based on best total score, 0..300) ===== */
export interface League {
  name: string;
  min: number;
  color: string;
}

export const LEAGUES: League[] = [
  { name: "Perunggu", min: 0, color: "#b87333" },
  { name: "Perak", min: 150, color: "#9aa3ad" },
  { name: "Emas", min: 200, color: "#e8a812" },
  { name: "Platinum", min: 240, color: "#39b6c7" },
  { name: "Berlian", min: 270, color: "#6f7bf0" },
];

export function leagueIdx(score: number): number {
  let i = 0;
  LEAGUES.forEach((l, k) => {
    if (score >= l.min) i = k;
  });
  return i;
}

export function bestTotal(attempts: Attempt[]): number {
  return attempts.reduce((m, a) => Math.max(m, a.total), 0);
}

export function bestAttempt(attempts: Attempt[]): Attempt | null {
  if (!attempts.length) return null;
  return attempts.reduce((b, a) => (a.total > b.total ? a : b), attempts[0]);
}
