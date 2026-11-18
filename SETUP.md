# Siap CPNS — setup

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase.

## 1. Buat project Supabase (sekali saja)

1. Buka <https://supabase.com> → **New project** (free tier cukup).
2. Masuk **Project Settings → API**, salin:
   - **Project URL**
   - **anon public key** (aman untuk dipublik / dipakai di frontend)

## 2. Isi environment

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## 3. Pasang skema + data

Di Supabase Studio → **SQL Editor**, jalankan **berurutan**:

1. Isi & Run seluruh `supabase/schema.sql` (tabel, view leaderboard, trigger auto-profile, RLS).
2. Isi & Run seluruh `supabase/seed.sql` (instansi, jabatan, provinsi, 15 lesson, 29 soal).

## 4. (Opsional) Matikan konfirmasi email saat development

Authentication → **Providers → Email** → nonaktifkan "Confirm email" supaya daftar
langsung bisa login tanpa cek email.

## 5. Jalankan

```
npm run dev
```

Buka <http://localhost:3000> → daftar akun → lengkapi profil di menu **Profil** →
kerjakan **Tryout** supaya skor masuk peringkat & liga.

## Struktur

- `src/app/(auth)/` — login & register
- `src/app/(app)/` — overview, materi, tryout, peringkat, profil (protected)
- `src/components/data-provider.tsx` — satu sumber state (Supabase), mudah dikembangkan
- `src/lib/` — `queries.ts` (akses data), `gamification.ts`, `scoring.ts`, `path.ts`, `leaderboard.ts`
- `supabase/schema.sql`, `supabase/seed.sql`

## Catatan

- Semua pengguna di-set **Pro** otomatis (prototype, tanpa payment gateway).
- Peringkat/liga berisi **pengguna nyata** — awalnya hanya kamu, terisi seiring ada user lain.
- Foto profil disimpan sebagai data URL (diperkecil ke 256px). Untuk produksi,
  pindahkan ke Supabase Storage.
