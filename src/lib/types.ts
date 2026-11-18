export type Topic = "TWK" | "TIU" | "TKP";
export type QType = "mcq" | "tkp";

export interface Instansi {
  id: string;
  name: string;
  parent_id: string | null;
  category: string | null;
}
export interface Jabatan {
  id: string;
  name: string;
}
export interface Provinsi {
  id: string;
  name: string;
}

export interface Lesson {
  id: string;
  sub: Topic;
  title: string;
  minutes: number;
  body: string;
  ingat: string;
  ord: number;
}

export interface QOption {
  idx: number;
  text: string;
  points: number | null;
}
export interface Question {
  id: string;
  topic: Topic;
  type: QType;
  q: string;
  why: string;
  correct: number | null;
  ord: number;
  options: QOption[];
}

export interface Profile {
  id: string;
  name: string;
  instansi_id: string | null;
  jabatan_id: string | null;
  provinsi_id: string | null;
  photo_url: string | null;
  is_pro: boolean;
}

export interface Attempt {
  id: string;
  user_id: string;
  twk_score: number;
  tiu_score: number;
  tkp_score: number;
  total: number;
  pts: number;
  lulus: boolean;
  weak: string | null;
  created_at: string;
}

export interface LeaderRow {
  user_id: string;
  name: string;
  photo_url: string | null;
  instansi_id: string | null;
  jabatan_id: string | null;
  provinsi_id: string | null;
  best_total: number;
  best_twk: number;
  best_tiu: number;
  best_tkp: number;
}
