import { NavLink, Outlet } from "react-router-dom"
import { PageHeader } from "@/components/common/PageHeader"
import { InlineAlert } from "@/components/common/InlineAlert"

function settingsTabClass(isActive: boolean) {
  return [
    "inline-flex items-center",
    "px-3 py-1.5 rounded-lg border text-sm transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    isActive
      ? "border-primary/25 bg-accent text-foreground font-medium"
      : "border-border bg-background/60 text-muted-foreground hover:border-primary/25 hover:text-foreground",
  ].join(" ")
}

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

      <nav className="flex flex-wrap gap-2" aria-label="Settings sections">
        <NavLink
          to="."
          end
          className={({ isActive }: { isActive: boolean }) =>
            settingsTabClass(isActive)
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="notifications"
          className={({ isActive }: { isActive: boolean }) =>
            settingsTabClass(isActive)
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
