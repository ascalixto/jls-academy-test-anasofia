import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            JLS Stack Sandbox
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Week 1 – Stack Foundations (Day 4: shadcn/ui Setup)
          </p>

          <div className="space-y-1">
            <label className="text-xs font-medium" htmlFor="test-input">
              Sandbox test input
            </label>
            <Input
              id="test-input"
              placeholder="Type here to prove the UI works"
            />
          </div>

          <Button size="sm">
            I&apos;m ready for Day 5
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
