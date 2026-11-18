"use client";

import { useMemo, useState } from "react";
import { useData } from "@/components/data-provider";
import { Hero } from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ranked, filterScope, type Scope, type RankedRow } from "@/lib/leaderboard";
import { LEAGUES, bestAttempt, leagueIdx } from "@/lib/gamification";
import { Trophy, ArrowUp, ArrowDown, Minus } from "lucide-react";

const SCOPES: { value: Scope; label: string }[] = [
  { value: "nasional", label: "Nasional" },
  { value: "instansi", label: "Instansi saya" },
  { value: "formasi", label: "Formasi saya" },
  { value: "provinsi", label: "Provinsi saya" },
];

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export default function PeringkatPage() {
  const d = useData();
  const [scope, setScope] = useState<Scope>("nasional");
  const [selected, setSelected] = useState<RankedRow | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const me = d.leaderboard.find((r) => r.user_id === d.user?.id);
  const rows = useMemo(
    () => ranked(filterScope(d.leaderboard, me, scope)),
    [d.leaderboard, me, scope],
  );

  const myBest = bestAttempt(d.attempts);

  if (d.loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  function openRow(r: RankedRow) {
    setSelected(r);
    setShowCompare(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <Hero
        crumb="Peringkat › SKD CPNS"
        subtitle="Papan peringkat"
        title="Peringkat peserta"
        icon={<Trophy className="size-5" />}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Klik baris untuk lihat detail & bandingkan.
            </p>
            <Select value={scope} onValueChange={(v) => setScope(v as Scope)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOPES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {rows.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-center">TWK</TableHead>
                  <TableHead className="text-center">TIU</TableHead>
                  <TableHead className="text-center">TKP</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const mine = r.user_id === d.user?.id;
                  return (
                    <TableRow
                      key={r.user_id}
                      onClick={() => openRow(r)}
                      className={mine ? "cursor-pointer bg-accent/50" : "cursor-pointer"}
                    >
                      <TableCell className="text-muted-foreground">
                        {r.rank}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Avatar className="size-7">
                            {r.photo_url ? (
                              <AvatarImage src={r.photo_url} alt={r.name} />
                            ) : null}
                            <AvatarFallback className="bg-secondary text-xs">
                              {initials(r.name)}
                            </AvatarFallback>
                          </Avatar>
                          {mine ? "Kamu" : r.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {r.best_twk}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {r.best_tiu}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {r.best_tkp}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.best_total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada data pada lingkup ini.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected ? (
            <CompetitorDetail
              row={selected}
              myBest={myBest}
              isMe={selected.user_id === d.user?.id}
              instansiName={d.instansiName(selected.instansi_id)}
              jabatanName={d.jabatanName(selected.jabatan_id)}
              provinsiName={d.provinsiName(selected.provinsi_id)}
              showCompare={showCompare}
              onCompare={() => setShowCompare(true)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CompetitorDetail({
  row,
  myBest,
  isMe,
  instansiName,
  jabatanName,
  provinsiName,
  showCompare,
  onCompare,
}: {
  row: RankedRow;
  myBest: ReturnType<typeof bestAttempt>;
  isMe: boolean;
  instansiName: string;
  jabatanName: string;
  provinsiName: string;
  showCompare: boolean;
  onCompare: () => void;
}) {
  const league = LEAGUES[leagueIdx(row.best_total)];
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="size-10">
            {row.photo_url ? <AvatarImage src={row.photo_url} alt={row.name} /> : null}
            <AvatarFallback className="bg-gold text-gold-ink">
              {initials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div>{isMe ? "Kamu" : row.name}</div>
            <div className="text-xs font-normal text-muted-foreground">
              Peringkat #{row.rank} · Liga {league.name}
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <Badge variant="secondary">{instansiName}</Badge>
          <Badge variant="secondary">{jabatanName}</Badge>
          <Badge variant="secondary">{provinsiName}</Badge>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            ["TWK", row.best_twk],
            ["TIU", row.best_tiu],
            ["TKP", row.best_tkp],
            ["Total", row.best_total],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-lg bg-secondary p-2">
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="text-lg tabular-nums">{v}</div>
            </div>
          ))}
        </div>

        {!isMe && myBest ? (
          showCompare ? (
            <Compare
              rows={[
                ["TWK", myBest.twk_score, row.best_twk],
                ["TIU", myBest.tiu_score, row.best_tiu],
                ["TKP", myBest.tkp_score, row.best_tkp],
                ["Total", myBest.total, row.best_total],
              ]}
            />
          ) : (
            <Button variant="outline" onClick={onCompare} className="w-full">
              Bandingkan dengan saya
            </Button>
          )
        ) : null}
        {!isMe && !myBest ? (
          <p className="text-center text-xs text-muted-foreground">
            Selesaikan tryout dulu untuk membandingkan skor.
          </p>
        ) : null}
      </div>
    </>
  );
}

function Compare({ rows }: { rows: [string, number, number][] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-4 bg-secondary px-3 py-2 text-xs text-muted-foreground">
        <span>Subtes</span>
        <span className="text-center">Kamu</span>
        <span className="text-center">Dia</span>
        <span className="text-right">Selisih</span>
      </div>
      {rows.map(([k, mine, theirs]) => {
        const diff = mine - theirs;
        return (
          <div
            key={k}
            className="grid grid-cols-4 items-center border-t px-3 py-2 text-sm"
          >
            <span>{k}</span>
            <span className="text-center tabular-nums">{mine}</span>
            <span className="text-center tabular-nums">{theirs}</span>
            <span
              className={`flex items-center justify-end gap-0.5 tabular-nums ${
                diff > 0 ? "text-good" : diff < 0 ? "text-bad" : "text-muted-foreground"
              }`}
            >
              {diff > 0 ? (
                <ArrowUp className="size-3.5" />
              ) : diff < 0 ? (
                <ArrowDown className="size-3.5" />
              ) : (
                <Minus className="size-3.5" />
              )}
              {Math.abs(diff)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
