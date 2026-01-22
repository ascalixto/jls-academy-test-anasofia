import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: unknown }

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown) {
    console.error("App crashed:", error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full p-6 space-y-3 border border-red-900/40">
          <div className="text-lg font-semibold">The app hit an unexpected error</div>
          <div className="text-sm text-slate-400">
            This is exactly why we use error boundaries — to avoid a blank screen.
          </div>
          <div className="pt-2 flex gap-2">
            <Button onClick={() => window.location.reload()}>Reload</Button>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Try to recover
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}
