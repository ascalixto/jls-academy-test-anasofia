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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          isActive
            ? "bg-sky-500/10 text-sky-100 ring-1 ring-sky-500/30"
            : "text-slate-300 hover:bg-slate-900/60 hover:text-slate-50"
        )
      }
    >
      <span className="truncate">{item.label}</span>

      {item.badge ? (
        <span className="shrink-0 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-100">
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
          <div className="px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
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

  // ✅ Grupos (cada um com 2+ links) — usando rotas que você já tem
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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* ✅ Sticky Topbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
          {/* Left: brand + name */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1 text-xs text-slate-100 md:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              Menu
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-xs font-bold text-sky-100 ring-1 ring-sky-500/30">
                A
              </span>

              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight">
                  Adopt a Task
                </span>
                <span className="text-xs text-slate-400">
                  Collaborative workflow sandbox
                </span>
              </div>
            </div>

            {/* ✅ Enhancement #1: environment indicator */}
            <span className="hidden items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[11px] font-medium text-sky-100 md:inline-flex">
              Env: Dev
            </span>
          </div>

          {/* Center: fake search (desktop) */}
          <div className="hidden flex-1 md:block">
            <div className="mx-auto max-w-md">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2">
                <span className="text-xs text-slate-400">Search</span>
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[11px] text-slate-500">⌘K</span>
              </div>
            </div>
          </div>

          {/* Right: actions + user */}
          <div className="flex items-center gap-2">
            {/* ✅ Enhancement #2: secondary action button */}
            <Button
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-900/30 text-xs text-slate-100 hover:bg-slate-900/60"
            >
              Open Docs
            </Button>

            {/* ✅ simple user menu placeholder */}
            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/30 px-2 py-1.5 md:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold">
                OE
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-medium">Ana Sofia</span>
                <span className="text-[11px] text-slate-400">Builder</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* ✅ Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950/60 md:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pt-4">
            <SidebarContent groups={navGroups} />
          </div>
        </aside>

        {/* ✅ Mobile sidebar overlay */}
        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="flex-1 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="w-72 border-l border-slate-800 bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-800 p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Navigation
                </span>
                <button
                  type="button"
                  className="text-xs text-slate-300 hover:text-slate-50"
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

        {/* ✅ Scrollable content area */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
