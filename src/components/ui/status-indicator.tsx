import { CheckCircle2, Clock, AlertCircle, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "checking" | "pending" | "complete" | "incomplete" | "error"
  title: string
  description?: string
  className?: string
}

export function StatusIndicator({ status, title, description, className }: StatusIndicatorProps) {
  const statusConfig = {
    checking: {
      icon: Loader2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconClass: "animate-spin"
    },
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      iconClass: ""
    },
    complete: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconClass: ""
    },
    incomplete: {
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      iconClass: ""
    },
    error: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      iconClass: ""
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn("flex items-start space-x-4", className)}>
      <div className={cn("rounded-full p-3", config.bgColor)}>
        <Icon className={cn("h-6 w-6", config.color, config.iconClass)} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}