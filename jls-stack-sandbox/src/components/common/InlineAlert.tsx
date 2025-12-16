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
          wrapper:
            "border-rose-500/40 bg-rose-500/10 text-slate-50",
          title: "text-rose-100",
          desc: "text-rose-100/80",
        }
      : tone === "subtle"
      ? {
          wrapper:
            "border-slate-800 bg-slate-900/40 text-slate-50",
          title: "text-slate-100",
          desc: "text-slate-300",
        }
      : {
          wrapper:
            "border-sky-500/35 bg-sky-500/10 text-slate-50",
          title: "text-sky-100",
          desc: "text-slate-200",
        }

  return (
    <div
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
