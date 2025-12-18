import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
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
        action={
          <Button onClick={() => navigate("/create-tool")}>
            Create your first tool
          </Button>
        }
      />
    </div>
  )
}
