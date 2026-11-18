"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { Hero } from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PracticeCard } from "@/components/practice-card";
import {
  buildSections,
  flatNodes,
  firstTodo,
  nextOpen,
  nodeDone,
  nodeLocked,
  type ProgressCtx,
} from "@/lib/path";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Pencil,
  Flag,
  Lock,
  Star,
  Compass,
  Check,
} from "lucide-react";

export default function MateriPage() {
  const d = useData();
  const router = useRouter();
  const [active, setActive] = useState<string>("");
  const [cp, setCp] = useState({ answered: 0, mcq: 0, correct: 0 });

  const ctx: ProgressCtx = useMemo(
    () => ({
      lessons: d.lessons,
      lessonsDone: d.lessonsDone,
      nodesDone: d.nodesDone,
      hasAttempt: d.attempts.length > 0,
    }),
    [d.lessons, d.lessonsDone, d.nodesDone, d.attempts.length],
  );

  const sections = useMemo(() => buildSections(d.lessons), [d.lessons]);
  const nodes = useMemo(() => flatNodes(sections), [sections]);
  const curTodo = useMemo(() => firstTodo(sections, ctx), [sections, ctx]);

  useEffect(() => {
    if (!nodes.length) return;
    if (!active || !nodes.find((n) => n.id === active)) setActive(curTodo);
  }, [nodes, active, curTodo]);

  useEffect(() => {
    setCp({ answered: 0, mcq: 0, correct: 0 });
  }, [active]);

  if (d.loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const done = nodes.filter((n) => nodeDone(n, ctx)).length;
  const node = nodes.find((n) => n.id === active) ?? nodes[0];
  const step = nodes.findIndex((n) => n.id === node?.id) + 1;

  const Icon = (t: string) =>
    t === "lesson" ? BookOpen : t === "quiz" ? Pencil : Flag;

  function openNode(id: string) {
    const n = nodes.find((x) => x.id === id)!;
    if (nodeLocked(n, ctx)) {
      toast.warning(
        n.type === "final"
          ? "Selesaikan semua checkpoint dulu"
          : `Selesaikan bab ${n.sub} dulu`,
      );
      return;
    }
    setActive(id);
  }

  async function completeLesson() {
    if (!node?.lessonId) return;
    await d.markLesson(node.lessonId, true);
    toast.success("Langkah selesai · +10 XP");
    const nx = nextOpen(sections, node.id, {
      ...ctx,
      lessonsDone: [...ctx.lessonsDone, node.lessonId],
    });
    if (nx) setActive(nx);
  }

  async function completeQuiz() {
    if (!node) return;
    const qs = d.questions.filter((q) => q.topic === node.sub);
    if (cp.answered < qs.length) {
      toast.warning("Jawab semua soal dulu");
      return;
    }
    if (node.type === "checkpoint") {
      const pass = cp.mcq === 0 ? true : cp.correct / cp.mcq >= 0.5;
      if (!pass) {
        toast.error(
          `Skor ${cp.correct}/${cp.mcq} benar — belum lulus (butuh ≥ 50%).`,
        );
        return;
      }
    }
    await d.markNode(node.id);
    toast.success(
      node.type === "checkpoint" ? "Checkpoint lulus!" : "Latihan selesai · +10 XP",
    );
    const nx = nextOpen(sections, node.id, {
      ...ctx,
      nodesDone: [...ctx.nodesDone, node.id],
    });
    if (nx) setActive(nx);
  }

  const lesson =
    node?.type === "lesson"
      ? d.lessons.find((l) => l.id === node.lessonId)
      : null;
  const nodeQs =
    node && (node.type === "quiz" || node.type === "checkpoint")
      ? d.questions.filter((q) => q.topic === node.sub)
      : [];

  return (
    <div className="flex flex-col gap-5">
      <Hero
        crumb="Materi › SKD CPNS › Jalur belajar"
        subtitle="Jalur belajar"
        title="Materi SKD CPNS 2026"
        icon={<Compass className="size-5" />}
        meta={
          <>
            <span>
              <b>{done}</b>/{nodes.length} langkah selesai
            </span>
            <span>
              <b>{sections.length - 1}</b> bab
            </span>
          </>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <Progress
            value={nodes.length ? Math.round((done / nodes.length) * 100) : 0}
            className="mb-5"
          />
          <div className="grid gap-5 md:grid-cols-[280px_1fr]">
            {/* Path */}
            <aside className="flex flex-col gap-1">
              {sections.map((s) => {
                const sd = s.nodes.filter((n) => nodeDone(n, ctx)).length;
                return (
                  <div key={s.sub} className="mb-2">
                    <div className="mb-1 flex items-center justify-between px-1 text-xs text-muted-foreground">
                      <span>
                        Bab {s.idx} · {s.sub}
                      </span>
                      <span>
                        {sd}/{s.nodes.length}
                      </span>
                    </div>
                    {s.nodes.map((n) => {
                      const nd = nodeDone(n, ctx);
                      const locked = nodeLocked(n, ctx);
                      const sel = n.id === active;
                      const I = Icon(n.type);
                      return (
                        <button
                          key={n.id}
                          onClick={() => openNode(n.id)}
                          className={cn(
                            "mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                            sel ? "bg-accent" : "hover:bg-secondary",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-7 shrink-0 place-items-center rounded-full",
                              nd
                                ? "bg-good text-white"
                                : locked
                                  ? "bg-secondary text-muted-foreground"
                                  : n.id === curTodo
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-foreground",
                            )}
                          >
                            {nd ? (
                              <Star className="size-3.5" />
                            ) : locked ? (
                              <Lock className="size-3.5" />
                            ) : (
                              <I className="size-3.5" />
                            )}
                          </span>
                          <span className="flex-1 truncate">
                            <span className="block truncate">{n.title}</span>
                            <span className="block text-xs text-muted-foreground">
                              {n.type === "lesson"
                                ? `${n.minutes} menit`
                                : n.type === "quiz"
                                  ? "latihan"
                                  : n.type === "checkpoint"
                                    ? "uji bab"
                                    : "ujian penuh"}
                              {nd
                                ? " · selesai"
                                : locked
                                  ? " · terkunci"
                                  : n.id === curTodo
                                    ? " · mulai di sini"
                                    : ""}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </aside>

            {/* Reader */}
            <section>
              {lesson ? (
                <div>
                  <div className="text-xs text-accent-foreground">{lesson.sub}</div>
                  <h2 className="mt-1 text-xl">{lesson.title}</h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Langkah {step}/{nodes.length} · {lesson.minutes} menit baca
                  </p>
                  <div
                    className="prose-sm flex flex-col gap-2 text-sm leading-relaxed [&_li]:ml-4 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&_.hl]:rounded [&_.hl]:bg-gold-soft [&_.hl]:px-1 [&_.hl]:text-gold-ink"
                    dangerouslySetInnerHTML={{ __html: lesson.body }}
                  />
                  <div className="mt-4 rounded-lg border-l-4 border-gold bg-gold-soft/50 p-3 text-sm">
                    <div className="mb-1 text-xs text-gold-ink">Ingat ini</div>
                    {lesson.ingat}
                  </div>
                  <Button onClick={completeLesson} className="mt-5">
                    {d.lessonsDone.includes(lesson.id) ? (
                      <>
                        <Check className="size-4" /> Selesai — lanjut
                      </>
                    ) : (
                      "Tandai selesai & lanjut"
                    )}
                  </Button>
                </div>
              ) : node?.type === "final" ? (
                <div>
                  <div className="text-xs text-accent-foreground">Ujian</div>
                  <h2 className="mt-1 text-xl">Simulasi CAT penuh</h2>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Terbuka setelah semua checkpoint lulus. Uji semua subtes
                    sekaligus dengan timer — skornya masuk peringkat & XP.
                  </p>
                  <Button onClick={() => router.push("/tryout")}>
                    Mulai Simulasi CAT
                  </Button>
                </div>
              ) : node ? (
                <div>
                  <div className="text-xs text-accent-foreground">
                    {node.sub}
                    {node.type === "checkpoint" ? " · checkpoint" : ""}
                  </div>
                  <h2 className="mt-1 text-xl">{node.title}</h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Langkah {step}/{nodes.length} ·{" "}
                    {node.type === "checkpoint"
                      ? "lulus ≥ 50% untuk membuka bab berikutnya"
                      : "jawab lalu selesaikan"}
                  </p>
                  <div className="flex flex-col gap-3">
                    {nodeQs.map((q, i) => (
                      <PracticeCard
                        key={q.id}
                        q={q}
                        index={i}
                        onAnswered={(correct, isMcq) =>
                          setCp((s) => ({
                            answered: s.answered + 1,
                            mcq: s.mcq + (isMcq ? 1 : 0),
                            correct: s.correct + (isMcq && correct ? 1 : 0),
                          }))
                        }
                      />
                    ))}
                  </div>
                  <Button onClick={completeQuiz} className="mt-5">
                    {node.type === "checkpoint"
                      ? "Selesai checkpoint"
                      : "Selesai & lanjut"}
                  </Button>
                </div>
              ) : null}
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
