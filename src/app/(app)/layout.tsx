import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DataProvider } from "@/components/data-provider";
import { AppShell } from "@/components/app-shell";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // When Supabase is configured, enforce auth on the server too.
  if (url && !url.includes("YOUR_")) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }

  return (
    <DataProvider>
      <AppShell>{children}</AppShell>
    </DataProvider>
  );
}
