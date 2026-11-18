"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const KEY = ["A", "B", "C", "D", "E"];

function Negated({ text }: { text: string }) {
  const parts = text.split(/(\bbukan\b|\btidak\b)/gi);
  return (
    <>
      {parts.map((p, i) =>
        /^(bukan|tidak)$/i.test(p) ? (
          <span key={i} className="text-bad underline underline-offset-2">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function PracticeCard({
  q,
  index,
  onAnswered,
}: {
  q: Question;
  index: number;
  onAnswered?: (correct: boolean, isMcq: boolean) => void;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const answered = choice !== null;
  const bestIdx =
    q.type === "tkp"
      ? q.options.reduce(
          (bi, o, i) => ((o.points ?? 0) > (q.options[bi].points ?? 0) ? i : bi),
          0,
        )
      : -1;

  function pick(i: number) {
    if (answered) return;
    setChoice(i);
    if (q.type === "mcq") onAnswered?.(i === q.correct, true);
    else onAnswered?.(true, false);
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 text-sm">
        <span className="text-muted-foreground">{index + 1}. </span>
        <Negated text={q.q} />
      </div>
      <div className="flex flex-col gap-2">
        {q.options.map((o, i) => {
          const isCorrect = q.type === "mcq" && i === q.correct;
          const isWrongPick = answered && i === choice && i !== q.correct;
          const isBest = q.type === "tkp" && i === bestIdx;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={answered}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                !answered && "hover:border-primary/40 hover:bg-accent/50",
                answered && q.type === "mcq" && isCorrect && "border-good bg-good/10",
                answered && isWrongPick && "border-bad bg-bad/10",
                answered && q.type === "tkp" && isBest && "border-good bg-good/10",
                answered && "cursor-default",
              )}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs">
                {KEY[i]}
              </span>
              <span className="flex-1">{o.text}</span>
              {answered && q.type === "tkp" ? (
                <span className="text-xs text-muted-foreground">+{o.points}</span>
              ) : null}
              {answered && q.type === "mcq" && isCorrect ? (
                <Check className="size-4 text-good" />
              ) : null}
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className="mt-3 rounded-lg bg-secondary p-3 text-sm">
          <span className="text-primary">Pembahasan. </span>
          <span dangerouslySetInnerHTML={{ __html: q.why }} />
        </div>
      ) : null}
    </div>
  );
}
