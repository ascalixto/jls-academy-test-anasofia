import { NavLink, Outlet } from "react-router-dom"
import { PageHeader } from "@/components/common/PageHeader"
import { InlineAlert } from "@/components/common/InlineAlert"

export function SettingsLayout() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Preferences for how this sandbox behaves (placeholder settings)."
      />

      <InlineAlert
        tone="subtle"
        title="Note"
        description="These are demo settings for Week 2 routing + layout practice."
      />

      <nav className="flex flex-wrap gap-2 text-sm">
        <NavLink
          to="."
          end
          className={({ isActive }: { isActive: boolean }) =>
            [
              "px-3 py-1.5 rounded-lg border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              isActive
                ? "border-primary/25 bg-primary/10 text-foreground"
                : "border-border bg-card/50 text-muted-foreground hover:border-primary/25 hover:text-foreground",
            ].join(" ")
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="notifications"
          className={({ isActive }: { isActive: boolean }) =>
            [
              "px-3 py-1.5 rounded-lg border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              isActive
                ? "border-primary/25 bg-primary/10 text-foreground"
                : "border-border bg-card/50 text-muted-foreground hover:border-primary/25 hover:text-foreground",
            ].join(" ")
          }
        >
          Notifications
        </NavLink>
      </nav>

      <div className="rounded-xl border border-border bg-card/60 p-4">
        <Outlet />
      </div>
    </div>
  )
}
