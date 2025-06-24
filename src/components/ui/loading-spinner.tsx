import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-[#fbd03d]/20" />
      <div className="absolute inset-0 rounded-full border-t-[#fbd03d] border-r-transparent border-b-transparent border-l-transparent animate-spin" 
           style={{ borderWidth: 'inherit' }} />
    </div>
  )
}