import { LayoutSandbox } from "@/components/layout/LayoutSandbox"

export function LayoutSandboxPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Layout Sandbox</h1>
        <p className="text-sm text-slate-200">
          A playground for practicing Tailwind layout patterns.
        </p>
        <p className="text-xs text-slate-400">
          Goal: build small patterns you can reuse later, and keep the UI consistent.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Current sandbox</h2>

        {/* Surface + border + radius */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          {/* Reuse the sandbox component */}
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <LayoutSandbox />
          </div>
        </div>
      </section>
    </div>
  )
}
