import { LayoutSandbox } from "@/components/layout/LayoutSandbox"

export function LayoutSandboxPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">
        Layout Sandbox
      </h1>
      <p className="text-sm text-slate-300">
        A playground for practicing Tailwind layout patterns.
      </p>

      {/* Reuse the sandbox component */}
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <LayoutSandbox />
      </div>
    </div>
  )
}
