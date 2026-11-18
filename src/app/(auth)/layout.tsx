export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-6 flex items-center gap-2 text-primary">
        <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-sm">SC</span>
        </div>
        <span className="text-lg">Siap CPNS</span>
      </div>
      {children}
    </div>
  );
}
