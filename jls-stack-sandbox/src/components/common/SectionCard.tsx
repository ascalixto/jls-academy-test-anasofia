import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <Card className="border-border bg-card/70 text-card-foreground">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm font-semibold text-foreground">
          {title}
        </CardTitle>

        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>

      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
