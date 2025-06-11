import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressStep {
  label: string
  status: "complete" | "current" | "pending"
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  className?: string
}

export function ProgressIndicator({ steps, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              {step.status === "complete" ? (
                <CheckCircle2 className="h-8 w-8 text-primary" />
              ) : step.status === "current" ? (
                <div className="relative">
                  <Circle className="h-8 w-8 text-primary" />
                  <Loader2 className="absolute inset-0 h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Circle className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-sm font-medium",
                step.status === "complete" || step.status === "current"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "mx-4 h-0.5 w-16 md:w-24",
                step.status === "complete" ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}