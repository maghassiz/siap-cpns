"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type {
  Attempt,
  Instansi,
  Jabatan,
  Lesson,
  LeaderRow,
  Profile,
  Provinsi,
  Question,
} from "@/lib/types";
import * as q from "@/lib/queries";
import type { ExamResult } from "@/lib/scoring";

interface DataState {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  instansi: Instansi[];
  jabatan: Jabatan[];
  provinsi: Provinsi[];
  lessons: Lesson[];
  questions: Question[];
  attempts: Attempt[];
  lessonsDone: string[];
  nodesDone: string[];
  streakDays: string[];
  leaderboard: LeaderRow[];
}

interface DataContextValue extends DataState {
  configured: boolean;
  instansiName: (id: string | null) => string;
  jabatanName: (id: string | null) => string;
  provinsiName: (id: string | null) => string;
  saveProfile: (p: Partial<Profile>) => Promise<void>;
  markLesson: (id: string, done: boolean) => Promise<void>;
  markNode: (id: string) => Promise<void>;
  touchStreak: () => Promise<void>;
  submitAttempt: (
    res: ExamResult,
    answers: (number | null)[],
    questions: Question[],
  ) => Promise<void>;
  reload: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<DataContextValue | null>(null);

const EMPTY: DataState = {
  loading: true,
  user: null,
  profile: null,
  instansi: [],
  jabatan: [],
  provinsi: [],
  lessons: [],
  questions: [],
  attempts: [],
  lessonsDone: [],
  nodesDone: [],
  streakDays: [],
  leaderboard: [],
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const configured = useMemo(() => {
    const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(u && k && !u.includes("YOUR_"));
  }, []);
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);
  const [state, setState] = useState<DataState>(EMPTY);

  const loadAll = useCallback(async () => {
    if (!supabase) {
      setState({ ...EMPTY, loading: false });
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setState({ ...EMPTY, loading: false });
      return;
    }
    const [ref, lessons, questions, profile, attempts, lp, np, streak, lb] =
      await Promise.all([
        q.fetchReference(supabase),
        q.fetchLessons(supabase),
        q.fetchQuestions(supabase),
        q.fetchProfile(supabase, user.id),
        q.fetchAttempts(supabase, user.id),
        q.fetchLessonProgress(supabase, user.id),
        q.fetchNodeProgress(supabase, user.id),
        q.fetchStreak(supabase, user.id),
        q.fetchLeaderboard(supabase),
      ]);
    setState({
      loading: false,
      user,
      profile,
      instansi: ref.instansi,
      jabatan: ref.jabatan,
      provinsi: ref.provinsi,
      lessons,
      questions,
      attempts,
      lessonsDone: lp,
      nodesDone: np,
      streakDays: streak,
      leaderboard: lb,
    });
  }, [supabase]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const value = useMemo<DataContextValue>(() => {
    const nameOf = (
      arr: { id: string; name: string }[],
      id: string | null,
    ) => arr.find((x) => x.id === id)?.name ?? "—";

    return {
      ...state,
      configured,
      instansiName: (id) => nameOf(state.instansi, id),
      jabatanName: (id) => nameOf(state.jabatan, id),
      provinsiName: (id) => nameOf(state.provinsi, id),

      async saveProfile(p) {
        if (!supabase || !state.user) return;
        await q.saveProfile(supabase, { id: state.user.id, ...p });
        await loadAll();
      },
      async markLesson(id, done) {
        if (!supabase || !state.user) return;
        await q.toggleLesson(supabase, state.user.id, id, done);
        await q.touchStreakDay(supabase, state.user.id);
        setState((s) => ({
          ...s,
          lessonsDone: done
            ? [...new Set([...s.lessonsDone, id])]
            : s.lessonsDone.filter((x) => x !== id),
        }));
      },
      async markNode(id) {
        if (!supabase || !state.user) return;
        await q.markNode(supabase, state.user.id, id);
        await q.touchStreakDay(supabase, state.user.id);
        setState((s) => ({
          ...s,
          nodesDone: [...new Set([...s.nodesDone, id])],
        }));
      },
      async touchStreak() {
        if (!supabase || !state.user) return;
        await q.touchStreakDay(supabase, state.user.id);
        await loadAll();
      },
      async submitAttempt(res, answers, questions) {
        if (!supabase || !state.user) return;
        await q.submitAttempt(supabase, state.user.id, res, answers, questions);
        await q.touchStreakDay(supabase, state.user.id);
        await loadAll();
      },
      reload: loadAll,
      async signOut() {
        if (supabase) await supabase.auth.signOut();
        window.location.href = "/login";
      },
    };
  }, [state, supabase, configured, loadAll]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useData must be used within DataProvider");
  return v;
}
