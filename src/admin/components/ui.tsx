export function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="rounded-full border border-ok/20 bg-ok/10 px-2 py-0.5 font-mono text-xs text-ok">
      published
    </span>
  ) : (
    <span className="rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-xs text-subtle">
      draft
    </span>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-subtle">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-page px-3 py-2 text-sm text-fg placeholder-subtle outline-none transition-colors focus:border-accent";

export const primaryButton =
  "rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-page transition-colors hover:bg-accent-strong disabled:opacity-50";

export const ghostButton =
  "rounded-lg border border-line px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:border-subtle hover:text-fg";

export const dangerButton =
  "rounded-lg px-3.5 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10";
