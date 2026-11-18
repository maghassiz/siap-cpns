"use client";

import Link from "next/link";
import { useData } from "@/components/data-provider";
import { Hero } from "@/components/hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LEAGUES,
  bestAttempt,
  bestTotal,
  leagueIdx,
  levelInfo,
  streakCount,
  totalXp,
} from "@/lib/gamification";
import { ranked, sameLeague } from "@/lib/leaderboard";
import { Flame, Star, Trophy, Zap, ArrowUp, ArrowDown } from "lucide-react";

export default function OverviewPage() {
  const d = useData();

  if (d.loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const name = d.profile?.name || "Pengguna";
  const xp = totalXp(d.attempts, d.lessonsDone.length, d.nodesDone.length);
  const lvl = levelInfo(xp);
  const streak = streakCount(d.streakDays);
  const best = bestAttempt(d.attempts);
  const subCount = new Set(d.lessons.map((l) => l.sub)).size;
  const totalSteps = d.lessons.length + subCount * 2; // lessons + quiz + checkpoint per sub
  const stepsDone = d.lessonsDone.length + d.nodesDone.length;
  const materiPct = totalSteps ? Math.round((stepsDone / totalSteps) * 100) : 0;

  const myScore = bestTotal(d.attempts);
  const li = leagueIdx(myScore);
  const league = LEAGUES[li];
  const nextLeague = LEAGUES[li + 1];
  const rows = ranked(d.leaderboard);
  const myRank = rows.find((r) => r.user_id === d.user?.id);
  const ligaRows = ranked(sameLeague(d.leaderboard, myScore));

  return (
    <div className="flex flex-col gap-5">
      <Hero
        crumb="Overview › SKD CPNS 2026"
        subtitle="Halo, selamat datang kembali"
        title={name}
        icon={<Star className="size-5" />}
        meta={
          <>
            <span>
              Level <b>{lvl.level}</b>
            </span>
            <span>
              <b>{xp}</b> XP
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame className="size-4 text-gold" /> <b>{streak}</b> hari beruntun
            </span>
          </>
        }
      />

      {/* Level / XP banner */}
      <Card>
        <CardContent className="flex flex-col gap-3 pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-2">
              <Zap className="size-4 text-gold" /> Level {lvl.level}
            </span>
            <span className="text-muted-foreground">
              {lvl.intoLevel}/{lvl.need} XP ke level {lvl.level + 1}
            </span>
          </div>
          <Progress value={lvl.pct} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Left: scores + materi */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skor terbaikmu</CardTitle>
            </CardHeader>
            <CardContent>
              {best ? (
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    ["TWK", best.twk_score],
                    ["TIU", best.tiu_score],
                    ["TKP", best.tkp_score],
                    ["Total", best.total],
                  ].map(([k, v]) => (
                    <div key={k as string} className="rounded-lg bg-secondary p-2">
                      <div className="text-xs text-muted-foreground">{k}</div>
                      <div className="text-lg">{v}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-start gap-3">
                  <p className="text-sm text-muted-foreground">
                    Belum ada hasil tryout. Mulai simulasi untuk masuk peringkat & liga.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/tryout">Mulai Tryout</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress materi</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Progress value={materiPct} />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {d.lessonsDone.length}/{d.lessons.length} lesson selesai
                </span>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/materi">Lanjut belajar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: liga + ranking */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Liga mingguan</CardTitle>
              <Badge
                style={{ backgroundColor: league.color }}
                className="text-white"
              >
                {league.name}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {nextLeague ? (
                <>
                  <Progress
                    value={Math.min(
                      100,
                      Math.round((myScore / nextLeague.min) * 100),
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.max(0, nextLeague.min - myScore)} poin lagi menuju Liga{" "}
                    {nextLeague.name}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Liga tertinggi — pertahankan posisimu!
                </p>
              )}

              {ligaRows.length ? (
                <ul className="mt-1 flex flex-col gap-1">
                  {ligaRows.slice(0, 6).map((r, i) => {
                    const me = r.user_id === d.user?.id;
                    const promo = i < 3;
                    const releg = i >= ligaRows.length - 3 && ligaRows.length > 3;
                    return (
                      <li
                        key={r.user_id}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm ${
                          me ? "bg-accent" : ""
                        }`}
                      >
                        <span className="w-5 text-muted-foreground">{i + 1}</span>
                        <span className="flex-1 truncate">
                          {me ? "Kamu" : r.name}
                        </span>
                        {promo ? (
                          <ArrowUp className="size-3.5 text-good" />
                        ) : releg ? (
                          <ArrowDown className="size-3.5 text-bad" />
                        ) : null}
                        <span className="tabular-nums">{r.best_total}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Belum ada peserta di ligamu. Selesaikan tryout untuk bergabung.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Peringkat nasional</CardTitle>
              <Trophy className="size-4 text-gold" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {rows.length ? (
                <>
                  {rows.slice(0, 5).map((r) => (
                    <div
                      key={r.user_id}
                      className={`flex items-center gap-2 text-sm ${
                        r.user_id === d.user?.id ? "font-medium" : ""
                      }`}
                    >
                      <span className="w-5 text-muted-foreground">#{r.rank}</span>
                      <span className="flex-1 truncate">
                        {r.user_id === d.user?.id ? "Kamu" : r.name}
                      </span>
                      <span className="tabular-nums">{r.best_total}</span>
                    </div>
                  ))}
                  {myRank && myRank.rank > 5 ? (
                    <div className="mt-1 flex items-center gap-2 border-t pt-2 text-sm font-medium">
                      <span className="w-5 text-muted-foreground">
                        #{myRank.rank}
                      </span>
                      <span className="flex-1 truncate">Kamu</span>
                      <span className="tabular-nums">{myRank.best_total}</span>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Peringkat masih kosong. Jadilah yang pertama!
                </p>
              )}
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/peringkat">Lihat detail peringkat</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
