"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DonationFormProps {
  causeId: string
  walletAddress: string
  causeName?: string
}

const PRESET_AMOUNTS = [10, 25, 50, 100]

export function DonationForm({ causeId, walletAddress, causeName }: DonationFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount)
    setIsCustom(false)
    setCustomAmount("")
    setError(null)
  }

  const handleCustomAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, "")
    
    // Prevent multiple decimal points
    const parts = sanitized.split(".")
    if (parts.length > 2) return
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return
    
    setCustomAmount(sanitized)
    setIsCustom(true)
    setSelectedAmount(null)
    setError(null)
  }

  const getAmountInCents = () => {
    if (isCustom && customAmount) {
      const amount = parseFloat(customAmount)
      if (!isNaN(amount)) {
        return Math.round(amount * 100)
      }
    }
    return selectedAmount ? selectedAmount * 100 : 0
  }

  const validateAmount = () => {
    const amountCents = getAmountInCents()
    
    if (amountCents < 100) {
      setError("Minimum donation amount is $1.00")
      return false
    }
    
    if (amountCents > 999999) {
      setError("Maximum donation amount is $9,999.99")
      return false
    }
    
    return true
  }

  const handleDonate = async () => {
    if (!validateAmount()) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/causes/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cause_id: causeId,
          amount_cents: getAmountInCents(),
          user_wallet_address: walletAddress,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create donation session")
      }

      const data = await response.json()
      
      // Store donation info for success page
      sessionStorage.setItem("pendingDonation", JSON.stringify({
        causeId,
        causeName,
        amount: getAmountInCents() / 100,
        sessionId: data.session_id
      }))
      
      // Redirect to Stripe checkout
      window.location.href = data.checkout_url
    } catch (err) {
      console.error("Donation error:", err)
      setError(err instanceof Error ? err.message : "Failed to process donation")
    } finally {
      setIsLoading(false)
    }
  }

  const displayAmount = isCustom && customAmount 
    ? `$${customAmount}` 
    : selectedAmount 
    ? `$${selectedAmount}` 
    : "Select amount"

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Select donation amount
        </Label>
        
        {/* Preset amounts */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {PRESET_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant={selectedAmount === amount && !isCustom ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(amount)}
              disabled={isLoading}
              className={cn(
                "font-semibold",
                selectedAmount === amount && !isCustom && "ring-2 ring-offset-2"
              )}
            >
              ${amount}
            </Button>
          ))}
        </div>

        {/* Custom amount input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            type="text"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            onFocus={() => setIsCustom(true)}
            disabled={isLoading}
            className={cn(
              "pl-7",
              isCustom && customAmount && "ring-2 ring-offset-2"
            )}
          />
        </div>
        
        {/* Min/max info */}
        <p className="text-xs text-muted-foreground mt-1">
          Min: $1.00 • Max: $9,999.99
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Donate button */}
      <Button 
        onClick={handleDonate} 
        disabled={!getAmountInCents() || isLoading}
        className="w-full font-semibold"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating secure checkout...
          </>
        ) : (
          `Donate ${getAmountInCents() ? displayAmount : ""}`
        )}
      </Button>

      {/* Fee info */}
      {getAmountInCents() > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          Platform fee: ${(getAmountInCents() * 0.05 / 100).toFixed(2)} (5%)
        </p>
      )}
    </div>
  )
}