import type { ReactNode } from "react"

type Tone = "default" | "subtle" | "danger"

type InlineAlertProps = {
  title: string
  description?: string
  tone?: Tone
  right?: ReactNode
}

export function InlineAlert({
  title,
  description,
  tone = "default",
  right,
}: InlineAlertProps) {
  const styles =
    tone === "danger"
      ? {
          wrapper: "border-destructive/30 bg-destructive/10",
          title: "text-foreground",
          desc: "text-muted-foreground",
        }
      : tone === "subtle"
      ? {
          wrapper: "border-border bg-card/60",
          title: "text-foreground",
          desc: "text-muted-foreground",
        }
      : {
          wrapper: "border-primary/25 bg-primary/10",
          title: "text-foreground",
          desc: "text-muted-foreground",
        }

  return (
    <div
      role={tone === "danger" ? "alert" : undefined}
      aria-live={tone !== "danger" ? "polite" : undefined}
      className={[
        "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between",
        styles.wrapper,
      ].join(" ")}
    >
      <div className="space-y-1">
        <div className={["text-sm font-semibold", styles.title].join(" ")}>
          {title}
        </div>

        {description ? (
          <div className={["text-sm", styles.desc].join(" ")}>
            {description}
          </div>
        ) : null}
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}
