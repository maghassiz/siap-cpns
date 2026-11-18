import type { Lesson, Topic } from "./types";

export type NodeType = "lesson" | "quiz" | "checkpoint" | "final";

export interface PathNode {
  type: NodeType;
  id: string;
  title: string;
  sub: string;
  lessonId?: string;
  minutes?: number;
}

export interface Section {
  sub: string;
  idx: number;
  nodes: PathNode[];
}

const SUB_ORDER: Topic[] = ["TWK", "TIU", "TKP"];

export function buildSections(lessons: Lesson[]): Section[] {
  const bySub = new Map<string, Lesson[]>();
  for (const s of SUB_ORDER) bySub.set(s, []);
  lessons
    .slice()
    .sort((a, b) => a.ord - b.ord)
    .forEach((l) => {
      if (!bySub.has(l.sub)) bySub.set(l.sub, []);
      bySub.get(l.sub)!.push(l);
    });

  const secs: Section[] = [];
  let idx = 1;
  for (const [sub, ls] of bySub) {
    if (!ls.length) continue;
    const nodes: PathNode[] = [];
    ls.forEach((l) =>
      nodes.push({
        type: "lesson",
        id: "L-" + l.id,
        title: l.title,
        sub,
        lessonId: l.id,
        minutes: l.minutes,
      }),
    );
    nodes.push({ type: "quiz", id: "Q-" + sub, title: "Latihan " + sub, sub });
    nodes.push({
      type: "checkpoint",
      id: "C-" + sub,
      title: "Checkpoint " + sub,
      sub,
    });
    secs.push({ sub, idx: idx++, nodes });
  }
  secs.push({
    sub: "Ujian",
    idx: idx,
    nodes: [{ type: "final", id: "FINAL", title: "Simulasi CAT", sub: "Ujian" }],
  });
  return secs;
}

export function flatNodes(sections: Section[]): PathNode[] {
  return sections.flatMap((s) => s.nodes);
}

export interface ProgressCtx {
  lessons: Lesson[];
  lessonsDone: string[];
  nodesDone: string[];
  hasAttempt: boolean;
}

export function nodeDone(n: PathNode, c: ProgressCtx): boolean {
  if (n.type === "lesson") return c.lessonsDone.includes(n.lessonId!);
  if (n.type === "quiz" || n.type === "checkpoint")
    return c.nodesDone.includes(n.id);
  if (n.type === "final") return c.hasAttempt;
  return false;
}

export function sectionPrereqDone(sub: string, c: ProgressCtx): boolean {
  const ls = c.lessons.filter((l) => l.sub === sub);
  return (
    ls.every((l) => c.lessonsDone.includes(l.id)) &&
    c.nodesDone.includes("Q-" + sub)
  );
}

export function allCheckpointsDone(c: ProgressCtx): boolean {
  const subs = [...new Set(c.lessons.map((l) => l.sub))];
  return subs.every((s) => c.nodesDone.includes("C-" + s));
}

export function nodeLocked(n: PathNode, c: ProgressCtx): boolean {
  if (n.type === "checkpoint") return !sectionPrereqDone(n.sub, c);
  if (n.type === "final") return !allCheckpointsDone(c);
  return false;
}

export function firstTodo(sections: Section[], c: ProgressCtx): string {
  const nodes = flatNodes(sections);
  const n = nodes.find((x) => !nodeDone(x, c) && !nodeLocked(x, c));
  return n ? n.id : nodes[0]?.id ?? "";
}

export function nextOpen(
  sections: Section[],
  id: string,
  c: ProgressCtx,
): string | null {
  const nodes = flatNodes(sections);
  let i = nodes.findIndex((n) => n.id === id);
  for (i = i + 1; i < nodes.length; i++) {
    if (!nodeLocked(nodes[i], c)) return nodes[i].id;
  }
  return null;
}
