type Tone = "default" | "subtle"

export function BadgePill({
  label,
  tone = "default",
}: {
  label: string
  tone?: Tone
}) {
  const styles =
    tone === "default"
      ? "bg-sky-500/10 text-sky-200 border-sky-500/30"
      : "bg-slate-800 text-slate-200 border-slate-700"

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${styles}`}
    >
      {label}
    </span>
  )
}
