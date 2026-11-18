import type { Question, Topic } from "./types";

export interface ExamResult {
  twkS: number;
  tiuS: number;
  tkpS: number;
  total: number;
  pts: number;
  lulus: boolean;
  weak: Topic;
  detail: {
    TWK: { b: number; t: number };
    TIU: { b: number; t: number };
    TKP: { p: number; m: number };
  };
}

// answers: selected option index per question (aligned by array position), or null.
export function scoreExam(
  questions: Question[],
  answers: (number | null)[],
): ExamResult {
  const r = {
    TWK: { b: 0, t: 0 },
    TIU: { b: 0, t: 0 },
    TKP: { p: 0, m: 0 },
  };
  let pts = 0;

  questions.forEach((q, i) => {
    const a = answers[i];
    if (q.type === "mcq") {
      const bucket = r[q.topic as "TWK" | "TIU"];
      bucket.t++;
      if (a != null && a === q.correct) {
        bucket.b++;
        pts += 15;
      }
    } else {
      r.TKP.m += 5;
      if (a != null) {
        const p = q.options[a]?.points ?? 0;
        pts += p * 3;
        r.TKP.p += p;
      }
    }
  });

  const twkP = r.TWK.t ? r.TWK.b / r.TWK.t : 0;
  const tiuP = r.TIU.t ? r.TIU.b / r.TIU.t : 0;
  const tkpP = r.TKP.m ? r.TKP.p / r.TKP.m : 0;

  const twkS = Math.round(twkP * 100);
  const tiuS = Math.round(tiuP * 100);
  const tkpS = Math.round(tkpP * 100);

  const lulus = twkP >= 0.5 && tiuP >= 0.5 && tkpP >= 0.6;
  const weak = (
    [
      ["TWK", twkP],
      ["TIU", tiuP],
      ["TKP", tkpP],
    ] as [Topic, number][]
  ).sort((a, b) => a[1] - b[1])[0][0];

  return { twkS, tiuS, tkpS, total: twkS + tiuS + tkpS, pts, lulus, weak, detail: r };
}
