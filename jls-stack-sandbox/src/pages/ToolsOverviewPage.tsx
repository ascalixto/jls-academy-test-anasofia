import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/states/EmptyState"
import { useNavigate } from "react-router-dom"

export default function ToolsOverviewPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tools Overview"
        subtitle="See your registered tools"
      />

      <EmptyState
        title="No tools yet"
        description="When you create a tool, it will show up here."
        actionLabel="Create your first tool"
        onAction={() => navigate("/create-tool")}
      />
    </div>
  )
}
