import { useMemo, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"

type NavItem = {
  label: string
  to: string
  end?: boolean
  badge?: string
}

type NavGroup = {
  label: string
  items: NavItem[]
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function SidebarLink({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }: { isActive: boolean }) =>
        cx(
          "group flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          isActive
            ? "bg-accent text-foreground ring-1 ring-primary/20"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        )
      }
    >
      <span className="truncate">{item.label}</span>

      {item.badge ? (
        <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          {item.badge}
        </span>
      ) : null}
    </NavLink>
  )
}

function SidebarContent({
  groups,
  onNavigate,
}: {
  groups: NavGroup[]
  onNavigate?: () => void
}) {
  return (
    <nav className="space-y-6 px-3 pb-4">
      {groups.map((group) => (
        <div key={group.label} className="space-y-2">
          <div className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {group.label}
          </div>

          <div className="space-y-1">
            {group.items.map((item) => (
              <SidebarLink key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navGroups = useMemo<NavGroup[]>(
    () => [
      {
        label: "Main",
        items: [
          { label: "Dashboard", to: "/", end: true },
          { label: "Quality Check", to: "/quality-check", badge: "New" },
        ],
      },
      {
        label: "Sandbox",
        items: [
          { label: "Layout Sandbox", to: "/layout-sandbox" },
          { label: "Components", to: "/components", badge: "Beta" },
        ],
      },
      {
        label: "Tools",
        items: [{ label: "Create Tool", to: "/create-tool" }],
      },
      {
        label: "System",
        items: [
          { label: "Settings", to: "/settings" },
          { label: "Help", to: "/help" },
        ],
      },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground md:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              Menu
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/30">
                A
              </span>

              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight">
                  Adopt a Task
                </span>
                <span className="text-xs text-muted-foreground">
                  Collaborative workflow sandbox
                </span>
              </div>
            </div>

            <span className="hidden items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary md:inline-flex">
              Env: Dev
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Open Docs
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pt-4">
            <SidebarContent groups={navGroups} />
          </div>
        </aside>

        {/* (Opcional) Mobile overlay — mantive sua state, mas você não tinha render aqui.
            Se você quiser, eu coloco no próximo passo sem mudar arquitetura. */}
        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="flex-1 bg-black/20"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="w-72 border-l border-border bg-sidebar">
              <div className="flex items-center justify-between border-b border-border p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Navigation
                </span>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setSidebarOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="h-[calc(100vh-57px)] overflow-y-auto pt-4">
                <SidebarContent
                  groups={navGroups}
                  onNavigate={() => setSidebarOpen(false)}
                />
              </div>
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
