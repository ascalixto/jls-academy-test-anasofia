import { InfoRow } from "@/components/common/InfoRow"

export function SettingsProfilePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Profile basics</h2>
      <p className="text-sm text-muted-foreground">
        Simple info about the person using this sandbox (placeholder).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoRow label="Display name" value="Ana Sofia" hint="Editable later" />
        <InfoRow label="Role" value="Developer (in training)" />
      </div>
    </div>
  )
}
