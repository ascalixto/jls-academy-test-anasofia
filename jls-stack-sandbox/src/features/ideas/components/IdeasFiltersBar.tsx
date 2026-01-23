import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { IdeasFilterState } from "../hooks/useIdeasFilters"

type Props = {
  filters: IdeasFilterState
  onChange: (patch: Partial<IdeasFilterState>) => void
  onReset: () => void
}

export function IdeasFiltersBar({ filters, onChange, onReset }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Search title (starts with...)"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          className="md:col-span-2"
        />

        <Input
          placeholder="Status (draft/active/paused/shipped or all)"
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
        />

        <Input
          placeholder="Tag (ux/frontend/ops or all)"
          value={filters.tag}
          onChange={(e) => onChange({ tag: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={filters.archived}
            onCheckedChange={(v) => onChange({ archived: v })}
            id="archivedToggle"
          />
          <Label htmlFor="archivedToggle" className="text-sm text-slate-300">
            Show archived
          </Label>
        </div>

        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
