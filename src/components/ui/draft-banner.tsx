import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DraftBannerProps {
  type: 'success' | 'info' | 'action' | 'error'
  message: string
  actions?: Array<{
    text: string
    action: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }>
  onDismiss?: () => void
}

export function DraftBanner({ type, message, actions, onDismiss }: DraftBannerProps) {
  const styles = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: <CheckCircle className="h-5 w-5" />
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info className="h-5 w-5" />
    },
    action: {
      container: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertCircle className="h-5 w-5" />
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: <AlertCircle className="h-5 w-5" />
    }
  }

  const style = styles[type]

  return (
    <div className={`relative border rounded-lg p-4 mb-6 ${style.container}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {actions && actions.length > 0 && (
            <div className="mt-3 flex gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'default'}
                  onClick={action.action}
                  className="h-8"
                >
                  {action.text}
                </Button>
              ))}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-4 inline-flex text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}