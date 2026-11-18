"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";
import { Hero } from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LEAGUES,
  bestAttempt,
  bestTotal,
  leagueIdx,
  levelInfo,
  streakCount,
  totalXp,
} from "@/lib/gamification";
import { User } from "lucide-react";

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

async function resizeImage(file: File, max = 256): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.8);
}

export default function ProfilPage() {
  const d = useData();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(d.profile?.name ?? "");
  const [instansi, setInstansi] = useState(d.profile?.instansi_id ?? "");
  const [jabatan, setJabatan] = useState(d.profile?.jabatan_id ?? "");
  const [provinsi, setProvinsi] = useState(d.profile?.provinsi_id ?? "");
  const [photo, setPhoto] = useState<string | null>(d.profile?.photo_url ?? null);
  const [busy, setBusy] = useState(false);

  if (d.loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  const xp = totalXp(d.attempts, d.lessonsDone.length, d.nodesDone.length);
  const lvl = levelInfo(xp);
  const streak = streakCount(d.streakDays);
  const best = bestAttempt(d.attempts);
  const league = LEAGUES[leagueIdx(bestTotal(d.attempts))];
  const displayName = d.profile?.name || "Pengguna";

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await resizeImage(file));
    } catch {
      toast.error("Gagal memproses foto");
    }
  }

  async function save() {
    if (!name.trim()) {
      toast.warning("Isi nama dulu ya");
      return;
    }
    setBusy(true);
    try {
      await d.saveProfile({
        name: name.trim(),
        instansi_id: instansi || null,
        jabatan_id: jabatan || null,
        provinsi_id: provinsi || null,
        photo_url: photo,
      });
      toast.success("Profil tersimpan");
    } catch {
      toast.error("Gagal menyimpan profil");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <Hero
        crumb="Profil"
        subtitle="Akun"
        title={displayName}
        icon={<User className="size-5" />}
      />

      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">My details</TabsTrigger>
          <TabsTrigger value="edit">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <Card>
            <CardContent className="flex flex-col gap-5 pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  {d.profile?.photo_url ? (
                    <AvatarImage src={d.profile.photo_url} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-gold text-gold-ink text-lg">
                    {initials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg">{displayName}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Badge style={{ backgroundColor: league.color }} className="text-white">
                      Liga {league.name}
                    </Badge>
                    <Badge variant="secondary">Level {lvl.level}</Badge>
                    <Badge variant="secondary">{streak} hari beruntun</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <Field label="Instansi" value={d.instansiName(d.profile?.instansi_id ?? null)} />
                <Field label="Jabatan" value={d.jabatanName(d.profile?.jabatan_id ?? null)} />
                <Field label="Provinsi" value={d.provinsiName(d.profile?.provinsi_id ?? null)} />
                <Field label="Total XP" value={String(xp)} />
                <Field
                  label="Skor terbaik"
                  value={best ? `${best.total}/300` : "—"}
                />
                <Field
                  label="Jumlah tryout"
                  value={String(d.attempts.length)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardContent className="flex flex-col gap-5 pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  {photo ? <AvatarImage src={photo} alt="foto" /> : null}
                  <AvatarFallback className="bg-secondary text-lg">
                    {initials(name || displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    Unggah foto
                  </Button>
                  {photo ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPhoto(null)}
                    >
                      Hapus
                    </Button>
                  ) : null}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onPhoto}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="pname">Nama</Label>
                <Input
                  id="pname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Picker
                  label="Instansi"
                  value={instansi}
                  onChange={setInstansi}
                  options={d.instansi.map((i) => ({ value: i.id, label: i.name }))}
                />
                <Picker
                  label="Jabatan"
                  value={jabatan}
                  onChange={setJabatan}
                  options={d.jabatan.map((j) => ({ value: j.id, label: j.name }))}
                />
                <Picker
                  label="Provinsi"
                  value={provinsi}
                  onChange={setProvinsi}
                  options={d.provinsi.map((p) => ({ value: p.id, label: p.name }))}
                />
              </div>

              <Button onClick={save} disabled={busy} className="w-fit">
                {busy ? "Menyimpan…" : "Simpan profil"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate">{value}</div>
    </div>
  );
}

function Picker({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
