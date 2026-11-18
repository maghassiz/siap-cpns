"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { Hero } from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { scoreExam, type ExamResult } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { Clock, Check, X, FileText } from "lucide-react";

const KEY = ["A", "B", "C", "D", "E"];

export default function TryoutPage() {
  const d = useData();
  const router = useRouter();

  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const started = useRef(false);

  const questions = d.questions;

  const reset = useCallback(() => {
    setAnswers(new Array(questions.length).fill(null));
    setIdx(0);
    setRemaining(questions.length * 60);
    setFinished(false);
    setResult(null);
    started.current = true;
  }, [questions.length]);

  useEffect(() => {
    if (!d.loading && questions.length && !started.current) reset();
  }, [d.loading, questions.length, reset]);

  const finish = useCallback(async () => {
    const res = scoreExam(questions, answers);
    setResult(res);
    setFinished(true);
    try {
      await d.submitAttempt(res, answers, questions);
    } catch {
      toast.error("Gagal menyimpan hasil (cek koneksi Supabase).");
    }
  }, [questions, answers, d]);

  useEffect(() => {
    if (finished || !started.current) return;
    if (remaining <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, finished, finish]);

  if (d.loading || !questions.length) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const answered = answers.filter((a) => a != null).length;

  if (finished && result) {
    const tiles: [string, number, number][] = [
      ["TWK", result.twkS, result.detail.TWK.b],
      ["TIU", result.tiuS, result.detail.TIU.b],
      ["TKP", result.tkpS, result.detail.TKP.p],
    ];
    return (
      <div className="flex flex-col gap-5">
        <Hero
          crumb="Tryout › Hasil"
          subtitle="Rekap Simulasi"
          title={`Total ${result.total}/300`}
          icon={<FileText className="size-5" />}
        />
        <Card>
          <CardContent className="flex flex-col gap-5 pt-6">
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm",
                result.lulus
                  ? "bg-good/15 text-good"
                  : "bg-bad/15 text-bad",
              )}
            >
              {result.lulus ? (
                <>
                  <Check className="size-4" /> Lolos ambang (simulasi)
                </>
              ) : (
                <>
                  <X className="size-4" /> Belum lolos ambang
                </>
              )}
            </span>
            <div className="grid grid-cols-3 gap-3">
              {tiles.map(([k, s]) => (
                <div key={k} className="rounded-xl bg-secondary p-3">
                  <div className="text-xs text-muted-foreground">{k}</div>
                  <div className="mb-2 text-2xl">{s}</div>
                  <Progress value={s} />
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-accent p-3 text-sm">
              Subtes terlemahmu: <b>{result.weak}</b>. Buka Materi untuk lesson &
              latihan topik ini.
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={reset}>Ulangi</Button>
              <Button variant="outline" onClick={() => router.push("/peringkat")}>
                Lihat peringkat
              </Button>
              <Button variant="ghost" onClick={() => router.push("/materi")}>
                Ke materi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Q = questions[idx];
  const a = answers[idx];
  const isDone = a != null;
  const bestIdx =
    Q.type === "tkp"
      ? Q.options.reduce(
          (bi, o, i) => ((o.points ?? 0) > (Q.options[bi].points ?? 0) ? i : bi),
          0,
        )
      : -1;

  return (
    <div className="flex flex-col gap-5">
      <Hero
        crumb="Tryout › SKD CPNS › Simulasi CAT"
        subtitle="Paket latihan"
        title="Simulasi SKD CPNS 2026"
        icon={<FileText className="size-5" />}
        meta={
          <>
            <span>
              <b>{questions.length}</b> soal
            </span>
            <span>Format mengikuti SKD</span>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        {/* Navigator */}
        <Card className="md:sticky md:top-20 md:self-start">
          <CardContent className="flex flex-col gap-3 pt-6">
            <div
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg py-2 text-lg tabular-nums",
                remaining < 120 ? "bg-bad/15 text-bad" : "bg-secondary",
              )}
            >
              <Clock className="size-4" />
              {mm}:{ss}
            </div>
            <div className="text-xs text-muted-foreground">
              Terjawab <b>{answered}</b>/{questions.length}
            </div>
            <Progress value={(answered / questions.length) * 100} />
            <div className="grid grid-cols-6 gap-1.5 md:grid-cols-5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={cn(
                    "aspect-square rounded-md border text-xs transition-colors",
                    i === idx
                      ? "border-primary ring-1 ring-primary"
                      : "border-border",
                    answers[i] != null
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-secondary",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button className="mt-1" onClick={finish}>
              Selesai & lihat hasil
            </Button>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                {Q.topic}
                {Q.type === "tkp" ? " · skala 1–5" : ""}
              </span>
              <span className="text-sm text-muted-foreground">
                Soal {idx + 1} dari {questions.length}
              </span>
            </div>
            <div className="text-[15px] leading-relaxed">{Q.q}</div>
            <div className="flex flex-col gap-2">
              {Q.options.map((o, i) => {
                const correct = Q.type === "mcq" && i === Q.correct;
                const wrongPick = isDone && i === a && i !== Q.correct;
                const best = Q.type === "tkp" && i === bestIdx;
                return (
                  <button
                    key={i}
                    disabled={isDone}
                    onClick={() =>
                      setAnswers((arr) => {
                        const n = arr.slice();
                        n[idx] = i;
                        return n;
                      })
                    }
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      !isDone && "hover:border-primary/40 hover:bg-accent/50",
                      isDone && correct && "border-good bg-good/10",
                      isDone && wrongPick && "border-bad bg-bad/10",
                      isDone && best && "border-good bg-good/10",
                    )}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs">
                      {KEY[i]}
                    </span>
                    <span className="flex-1">{o.text}</span>
                    {isDone && Q.type === "tkp" ? (
                      <span className="text-xs text-muted-foreground">
                        +{o.points}
                      </span>
                    ) : null}
                    {isDone && correct ? (
                      <Check className="size-4 text-good" />
                    ) : null}
                  </button>
                );
              })}
            </div>
            {isDone ? (
              <div className="rounded-lg bg-secondary p-3 text-sm">
                <span className="text-primary">Pembahasan. </span>
                <span dangerouslySetInnerHTML={{ __html: Q.why }} />
              </div>
            ) : null}
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                disabled={idx === 0}
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
              >
                ← Sebelumnya
              </Button>
              <Button
                size="sm"
                disabled={idx === questions.length - 1}
                onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}
              >
                Berikutnya →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
