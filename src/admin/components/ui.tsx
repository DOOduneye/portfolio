export function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
      Published
    </span>
  ) : (
    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
      Draft
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
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-blue-500";

export const primaryButton =
  "rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50";

export const ghostButton =
  "rounded-lg border border-zinc-800 px-3.5 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white";

export const dangerButton =
  "rounded-lg px-3.5 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10";
