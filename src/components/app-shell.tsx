"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useData } from "@/components/data-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, FileText, Trophy, User, LogOut } from "lucide-react";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/tryout", label: "Tryout", icon: FileText },
  { href: "/peringkat", label: "Peringkat", icon: Trophy },
];

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut, configured } = useData();

  const name = profile?.name || "Pengguna";

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4">
          <Link href="/" className="mr-2 flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-md bg-primary-foreground/15 text-xs">
              SC
            </div>
            <span className="hidden text-sm sm:inline">Siap CPNS</span>
          </Link>
          <nav className="flex flex-1 items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-primary-foreground/15"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="size-8 ring-2 ring-primary-foreground/30">
                {profile?.photo_url ? (
                  <AvatarImage src={profile.photo_url} alt={name} />
                ) : null}
                <AvatarFallback className="bg-gold text-gold-ink text-xs">
                  {initials(name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profil")}>
                <User className="size-4" /> Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="size-4" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {!configured ? (
        <div className="bg-gold-soft px-4 py-2 text-center text-sm text-gold-ink">
          Supabase belum dikonfigurasi — isi <code>.env.local</code> dengan URL &
          anon key, lalu jalankan <code>schema.sql</code> + <code>seed.sql</code>.
        </div>
      ) : null}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
