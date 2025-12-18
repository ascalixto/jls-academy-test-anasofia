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
      ? "bg-primary/10 text-foreground border-primary/25"
      : "bg-card/60 text-foreground border-border"

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${styles}`}
    >
      {label}
    </span>
  )
}
