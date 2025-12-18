type ChecklistCardProps = {
  title: string
  description?: string
  items: string[]
}

export function ChecklistCard({ title, description, items }: ChecklistCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card/70 p-4 space-y-3">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>

        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
