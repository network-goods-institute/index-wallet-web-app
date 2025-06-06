"use client"

import { Button } from "@/components/ui/button"

interface DonationFormProps {
  causeId: string
  walletAddress: string
  paymentLink: string
}

export function DonationForm({ causeId, walletAddress, paymentLink }: DonationFormProps) {
  const handleDonate = () => {
    const donationUrl = `${paymentLink}?client_reference_id=${walletAddress}`
    window.location.href = donationUrl
  }

  return (
    <Button onClick={handleDonate} className="w-full">
      Donate
    </Button>
  )
}
