import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function IdeasListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>

      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Skeleton className="h-10 md:col-span-2" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-4 w-64" />
        </div>
      </Card>

      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-4 space-y-3">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14" />
          </div>
        </Card>
      ))}
    </div>
  )
}
