"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard"
import { CheckCircle2, ExternalLink, Mail, Share2, AlertCircle } from "lucide-react"
import confetti from "canvas-confetti"

interface CauseData {
  id: string
  name: string
  organization: string
  token: {
    symbol: string
    name: string
  }
}

export default function CauseSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const causeId = params.id as string
  
  const [cause, setCause] = useState<CauseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const donationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/causes/${causeId}`

  useEffect(() => {
    // Trigger confetti on mount
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchCause = async () => {
      try {
        const response = await fetch(`/api/causes/${causeId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch cause")
        }
        const data = await response.json()
        setCause(data)
      } catch (err) {
        setError("Failed to load cause details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCause()
  }, [causeId])

  if (loading) {
    return (
      <div className="container max-w-2xl py-30">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !cause) {
    return (
      <div className="container max-w-2xl py-30">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <p>{error || "Cause not found"}</p>
            </div>
            <Button onClick={() => router.push("/causes")}>
              View All Causes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-30">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Congratulations! 🎉</h1>
        <p className="text-xl text-muted-foreground">
          Your cause "{cause.name}" is now live and ready to receive donations
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Share Your Cause</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Donation Link:</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-background px-3 py-2 rounded text-sm">
                {donationUrl}
              </code>
              <CopyToClipboard text={donationUrl} />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" variant="outline" asChild>
              <Link href={`/causes/${causeId}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Cause Page
              </Link>
            </Button>
            <Button className="flex-1" variant="outline" asChild>
              <a href={`mailto:?subject=Support ${cause.name}&body=Hi! I wanted to share this cause with you: ${donationUrl}`}>
                <Mail className="h-4 w-4 mr-2" />
                Share via Email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Important Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-medium mb-1">Check Your Email</h4>
                <p className="text-sm text-muted-foreground">
                  Stripe will send you login details to access your dashboard where you can view donations, manage payouts, and download reports.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium mb-1">Save Your Stripe Login</h4>
                <p className="text-sm text-muted-foreground">
                  Keep your Stripe account credentials safe. You'll need them to access donation data and manage your payouts.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium mb-1">Start Sharing</h4>
                <p className="text-sm text-muted-foreground">
                  Share your cause link on social media, in newsletters, and with your community to start receiving donations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Token Information</h4>
                <p className="text-sm text-blue-800">
                  Your cause token <strong>{cause.token.symbol}</strong> ({cause.token.name}) will be created when you receive your first donation. Donors will receive these tokens as proof of their contribution.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button size="lg" onClick={() => router.push("/causes")}>
          <Share2 className="h-4 w-4 mr-2" />
          Explore Other Causes
        </Button>
      </div>
    </div>
  )
}