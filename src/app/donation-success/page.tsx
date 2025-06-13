"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Home, Share2, AlertCircle, ArrowRight, Heart } from "lucide-react"
import confetti from "canvas-confetti"

interface DonationInfo {
  causeId: string
  causeName?: string
  tokenSymbol?: string
  amount: number
  sessionId: string
}

export default function DonationSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null)
  const [showShareOptions, setShowShareOptions] = useState(false)
  
  // Get session ID from URL params (Stripe adds this)
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    // Retrieve donation info from session storage
    const storedInfo = sessionStorage.getItem("pendingDonation")
    if (storedInfo) {
      const info = JSON.parse(storedInfo)
      // Verify session ID matches if provided
      if (!sessionId || sessionId === info.sessionId) {
        setDonationInfo(info)
        // Clear the stored info
        sessionStorage.removeItem("pendingDonation")
      }
    }

    // Trigger confetti
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [sessionId])

  const shareMessage = donationInfo 
    ? `I just donated $${donationInfo.amount.toFixed(2)} to ${donationInfo.causeName || 'a great cause'}! Join me in making a difference.`
    : "I just made a donation to support a great cause!"

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/causes/${donationInfo?.tokenSymbol || donationInfo?.causeId}`
    : ''

  const handleShare = (platform: string) => {
    const encodedMessage = encodeURIComponent(shareMessage)
    const encodedUrl = encodeURIComponent(shareUrl)
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=I just made a donation!&body=${encodedMessage}%0A%0A${encodedUrl}`
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="container max-w-2xl py-30">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Thank You! 🎉</h1>
        <p className="text-xl text-muted-foreground">
          Your donation has been successfully processed
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Donation Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {donationInfo ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-lg">${donationInfo.amount.toFixed(2)}</span>
              </div>
              {donationInfo.causeName && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Cause</span>
                  <span className="font-medium">{donationInfo.causeName}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Platform Fee (5%)</span>
                <span className="text-sm">${(donationInfo.amount * 0.05).toFixed(2)}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      Check your wallet for the corresponding amount of receipts for your donation. 
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Your donation was successful!
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Spread the Word</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Help this cause reach more people by sharing your donation
          </p>
          
          {!showShareOptions ? (
            <Button 
              onClick={() => setShowShareOptions(true)} 
              variant="outline" 
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Your Donation
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="w-full"
              >
                Twitter/X
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="w-full"
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('linkedin')}
                className="w-full"
              >
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('email')}
                className="w-full"
              >
                Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        {donationInfo && (
          <Button 
            className="flex-1" 
            onClick={() => router.push(`/causes/${donationInfo.tokenSymbol || donationInfo.causeId}`)}
          >
            View Cause
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => router.push('/causes')}
        >
          <Home className="h-4 w-4 mr-2" />
          Browse More Causes
        </Button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Questions about your donation? Contact support at{" "}
          <a href="mailto:support@indexwallets.com" className="text-primary hover:underline">
            support@indexwallets.com
          </a>
        </p>
      </div>
    </div>
  )
}