import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-border bg-card/70 px-6 py-12 text-center shadow-sm">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
