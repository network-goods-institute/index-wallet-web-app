"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { ProgressIndicator } from "@/components/ui/progress-indicator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import confetti from "canvas-confetti"

interface DraftStatus {
  status: "pending" | "complete" | "incomplete" | "draft" | "not_found" | "error"
  cause_id?: string
  cause_symbol?: string
  draft?: {
    name: string
    token_symbol: string
  }
  onboarding_url?: string
  retryUrl?: string
  message?: string
}

export default function SetupStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const draftId = searchParams.get("draft")
  
  const [status, setStatus] = useState<"checking" | "error" | DraftStatus["status"]>("checking")
  const [draftData, setDraftData] = useState<DraftStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  const checkStatus = useCallback(async () => {
    if (!draftId) {
      setError("No draft ID provided")
      setStatus("error")
      return
    }

    try {
      const response = await fetch(`/api/causes/drafts/${draftId}/status`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Draft not found. It may have expired or already been completed.")
        } else {
          setError("Failed to check status. Please try again.")
        }
        setStatus("error")
        return
      }

      const data: DraftStatus = await response.json()
      console.log("Data:", data)
      setDraftData(data)
      setStatus(data.status)

      if (data.status === "complete") {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    } catch (error) {
      console.error("Error checking status:", error)
      setError("Network error. Please check your connection.")
      setStatus("error")
    }
  }, [draftId, router])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  useEffect(() => {
    // Poll for status updates if pending
    if (status === "pending" && pollCount < 40) { // Max 2 minutes of polling
      const timer = setTimeout(() => {
        checkStatus()
        setPollCount(prev => prev + 1)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [status, pollCount, checkStatus])

  const progressSteps: Array<{ label: string; status: "complete" | "current" | "pending" }> = [
    { label: "Cause Details", status: "complete" },
    { label: "Payment Setup", status: status === "complete" ? "complete" : "current" }
  ]

  if (status === "checking") {
    return (
      <div className="container max-w-2xl py-30">
        <div className="flex flex-col items-center justify-center space-y-8">
          <ProgressIndicator steps={progressSteps} />
          <Card className="w-full">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-2xl font-semibold">Checking Your Setup Status</h2>
                <p className="text-muted-foreground text-center">
                  Please wait while we verify your payment setup...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="container max-w-2xl py-30">
        <Card className="w-full">
          <CardContent className="pt-8 pb-8">
            <StatusIndicator
              status="error"
              title="Something went wrong"
              description={error || "An unexpected error occurred"}
              className="mb-6"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push("/create")}>
                Create New Cause
              </Button>
              <Button variant="outline" onClick={() => router.push("/setup/resume")}>
                Find Existing Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="container max-w-2xl py-30">
        <div className="flex flex-col items-center justify-center space-y-8">
          <ProgressIndicator steps={progressSteps} />
          <Card className="w-full">
            <CardContent className="pt-8 pb-8">
              <StatusIndicator
                status="pending"
                title="Confirming Your Payment Setup"
                description="We're verifying your information with Stripe. This usually takes just a moment."
                className="mb-6"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Why is this taking time?</strong> Stripe needs to verify your identity and banking information to ensure secure donation processing. This protects both you and your donors.
                </p>
              </div>
              {pollCount > 10 && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    This is taking longer than expected. You can continue waiting or try again later.
                  </p>
                  <Button variant="outline" onClick={() => router.push("/setup/resume")}>
                    Check Status Later
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === "incomplete") {
    return (
      <div className="container max-w-2xl py-30">
        <div className="flex flex-col items-center justify-center space-y-8">
          <ProgressIndicator steps={progressSteps} />
          <Card className="w-full">
            <CardContent className="pt-8 pb-8">
              <StatusIndicator
                status="incomplete"
                title="Payment Setup Incomplete"
                description={draftData?.message || "You need to complete your payment setup to activate your cause."}
                className="mb-6"
              />
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6 mb-6">
                <p className="text-sm text-orange-800">
                  <strong>What's next?</strong> Click the button below to return to Stripe and complete your setup. This includes verifying your identity and adding bank account details for receiving donations.
                </p>
              </div>
              <div className="flex justify-center">
                {(draftData?.retryUrl || draftData?.onboarding_url) ? (
                  <Button 
                    size="lg"
                    onClick={() => window.location.href = (draftData.retryUrl || draftData.onboarding_url)!}
                  >
                    Complete Payment Setup
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    onClick={() => router.push("/setup/resume")}
                  >
                    Resume Setup
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === "complete") {
    return (
      <div className="container max-w-2xl py-30">
        <div className="flex flex-col items-center justify-center space-y-8">
          <ProgressIndicator steps={progressSteps} />
          <Card className="w-full">
            <CardContent className="pt-8 pb-8">
              <StatusIndicator
                status="complete"
                title="Setup Complete!"
                description="Your cause is now live and ready to receive donations."
                className="mb-6"
              />
              <div className="flex flex-col items-center space-y-6">
                <div className="text-6xl">🎉</div>
                <p className="text-muted-foreground text-center">
                  Your payment setup is complete. You can now start receiving donations!
                </p>
                {draftData && (draftData.cause_symbol || draftData.cause_id) && (
                  <Button 
                    size="lg"
                    onClick={() => {
                      const identifier = draftData.cause_symbol || draftData.cause_id
                      router.push(`/causes/${identifier}`)
                    }}
                  >
                    View Your Cause
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}