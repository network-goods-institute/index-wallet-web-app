"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowRight, FileSearch } from "lucide-react"

export default function ResumePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/causes/find-drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError("No drafts found for this email address. Please check your email or create a new cause.")
        } else {
          setError("Failed to find drafts. Please try again.")
        }
        return
      }

      const data = await response.json()
      
      if (data.drafts && data.drafts.length > 0) {
        // Redirect to the most recent draft
        const mostRecentDraft = data.drafts[0]
        router.push(`/setup/status?draft=${mostRecentDraft.id}`)
      } else {
        setError("No drafts found for this email address.")
      }
    } catch (err) {
      console.error("Error finding drafts:", err)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Check if there's a draft ID in localStorage
  const checkLocalDraft = () => {
    const draftId = localStorage.getItem("currentDraftId")
    if (draftId) {
      router.push(`/setup/status?draft=${draftId}`)
    }
  }

  return (
    <div className="container max-w-lg py-30">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <FileSearch className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Resume Your Setup</h1>
        <p className="text-muted-foreground">
          Enter your email to find and complete your cause setup
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Your Draft</CardTitle>
          <CardDescription>
            We&apos;ll use your email to locate any incomplete cause setups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Use the same email you provided when creating your cause
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  Find My Draft
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={checkLocalDraft}
              className="text-sm text-primary hover:underline w-full text-center"
            >
              Check for saved draft on this device
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Don&apos;t have a draft to resume?
        </p>
        <Button variant="outline" onClick={() => router.push("/create")}>
          Create New Cause
        </Button>
      </div>
    </div>
  )
}