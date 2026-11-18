import { cn } from "@/lib/utils";

export function Hero({
  crumb,
  title,
  subtitle,
  meta,
  icon,
  className,
}: {
  crumb?: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#1d3f84] p-5 text-primary-foreground sm:p-6",
        className,
      )}
    >
      {crumb ? (
        <div className="mb-3 text-xs text-primary-foreground/60">{crumb}</div>
      ) : null}
      <div className="flex items-center gap-3">
        {icon ? (
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/15">
            {icon}
          </div>
        ) : null}
        <div>
          {subtitle ? (
            <div className="text-xs text-primary-foreground/70">{subtitle}</div>
          ) : null}
          <h1 className="text-xl sm:text-2xl">{title}</h1>
        </div>
      </div>
      {meta ? (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-primary-foreground/85">
          {meta}
        </div>
      ) : null}
    </div>
  );
}
