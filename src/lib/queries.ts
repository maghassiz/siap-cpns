import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Attempt,
  Instansi,
  Jabatan,
  Lesson,
  LeaderRow,
  Profile,
  Provinsi,
  Question,
} from "./types";
import type { ExamResult } from "./scoring";
import { todayStr } from "./gamification";

type SB = SupabaseClient;

export async function fetchReference(sb: SB) {
  const [inst, jab, prov] = await Promise.all([
    sb.from("instansi").select("*").order("name"),
    sb.from("jabatan").select("*").order("name"),
    sb.from("provinsi").select("*").order("name"),
  ]);
  return {
    instansi: (inst.data ?? []) as Instansi[],
    jabatan: (jab.data ?? []) as Jabatan[],
    provinsi: (prov.data ?? []) as Provinsi[],
  };
}

export async function fetchLessons(sb: SB): Promise<Lesson[]> {
  const { data } = await sb.from("lessons").select("*").order("ord");
  return (data ?? []) as Lesson[];
}

export async function fetchQuestions(sb: SB): Promise<Question[]> {
  const { data } = await sb
    .from("questions")
    .select("id, topic, type, q, why, correct, ord, question_options(idx, text, points)")
    .order("ord");
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    topic: row.topic as Question["topic"],
    type: row.type as Question["type"],
    q: row.q as string,
    why: row.why as string,
    correct: row.correct as number | null,
    ord: row.ord as number,
    options: ((row.question_options ?? []) as Question["options"])
      .slice()
      .sort((a, b) => a.idx - b.idx),
  }));
}

export async function fetchProfile(sb: SB, userId: string): Promise<Profile | null> {
  const { data } = await sb.from("profiles").select("*").eq("id", userId).single();
  return (data as Profile) ?? null;
}

export async function saveProfile(sb: SB, profile: Partial<Profile> & { id: string }) {
  const { error } = await sb
    .from("profiles")
    .upsert({ ...profile, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function fetchAttempts(sb: SB, userId: string): Promise<Attempt[]> {
  const { data } = await sb
    .from("attempts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Attempt[];
}

export async function submitAttempt(
  sb: SB,
  userId: string,
  res: ExamResult,
  answers: (number | null)[],
  questions: Question[],
): Promise<Attempt> {
  const { data, error } = await sb
    .from("attempts")
    .insert({
      user_id: userId,
      twk_score: res.twkS,
      tiu_score: res.tiuS,
      tkp_score: res.tkpS,
      total: res.total,
      pts: res.pts,
      lulus: res.lulus,
      weak: res.weak,
    })
    .select()
    .single();
  if (error) throw error;
  const attempt = data as Attempt;

  const rows = questions.map((q, i) => ({
    attempt_id: attempt.id,
    question_id: q.id,
    choice: answers[i],
  }));
  await sb.from("answers").insert(rows);
  return attempt;
}

export async function fetchLessonProgress(sb: SB, userId: string): Promise<string[]> {
  const { data } = await sb
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId);
  return (data ?? []).map((r: { lesson_id: string }) => r.lesson_id);
}

export async function toggleLesson(
  sb: SB,
  userId: string,
  lessonId: string,
  done: boolean,
) {
  if (done) {
    await sb
      .from("lesson_progress")
      .upsert({ user_id: userId, lesson_id: lessonId });
  } else {
    await sb
      .from("lesson_progress")
      .delete()
      .eq("user_id", userId)
      .eq("lesson_id", lessonId);
  }
}

export async function fetchNodeProgress(sb: SB, userId: string): Promise<string[]> {
  const { data } = await sb
    .from("node_progress")
    .select("node_id")
    .eq("user_id", userId);
  return (data ?? []).map((r: { node_id: string }) => r.node_id);
}

export async function markNode(sb: SB, userId: string, nodeId: string) {
  await sb.from("node_progress").upsert({ user_id: userId, node_id: nodeId });
}

export async function fetchStreak(sb: SB, userId: string): Promise<string[]> {
  const { data } = await sb.from("streak_days").select("day").eq("user_id", userId);
  return (data ?? []).map((r: { day: string }) => r.day);
}

export async function touchStreakDay(sb: SB, userId: string) {
  await sb.from("streak_days").upsert({ user_id: userId, day: todayStr() });
}

export async function fetchLeaderboard(sb: SB): Promise<LeaderRow[]> {
  const { data } = await sb
    .from("leaderboard")
    .select("*")
    .order("best_total", { ascending: false });
  return (data ?? []) as LeaderRow[];
}
