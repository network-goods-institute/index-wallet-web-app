"use client"

import { Button } from "@/components/ui/button"
import { DonationForm } from "@/components/donation-form"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Share2, Facebook, Mail, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { motion } from "framer-motion"
import { getCauseStatusDisplay, isDonationEnabled } from "@/lib/status-utils"

interface Cause {
  _id: {
    $oid: string
  }
  name: string
  organization: string
  description: string
  long_description: string
  token_name: string
  token_symbol: string
  total_raised: number
  payment_link: string
  status: string
  stripe_product_id?: string
  error_message?: string
  is_active: boolean
  created_at: {
    $date: Date
  }
  updated_at: {
    $date: Date
  }
  creator_email: string
  cause_image_url?: string
  token_image_url?: string
  amount_donated: number
  tokens_purchased: number
  current_price: number
}

// Generate token color (reuse from cause-card)
function getTokenColor(tokenName: string): { bg: string; border: string } {
  const colors = [
    { bg: "#E7F0FF", border: "#0046BE" },
    { bg: "#F0E4FC", border: "#A856F7" },
    { bg: "#D5FFEB", border: "#049952" },
    { bg: "#FFF2E6", border: "#EDA058" },
    { bg: "#FFE5E5", border: "#FF4444" },
  ]
  
  const index = tokenName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}

export default function CauseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [cause, setCause] = useState<Cause | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [walletValidation, setWalletValidation] = useState<{
    isValidating: boolean
    isValid: boolean
    username?: string
    error?: string
  }>({
    isValidating: false,
    isValid: false
  })
  const [causeId, setCauseId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setCauseId(resolvedParams.id);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!causeId) return;
    
    async function fetchCause() {
      try {
        const response = await fetch(`/api/causes/${causeId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCause(data);
      } catch (error) {
        console.error('Error fetching cause:', error);
        setError('Failed to fetch cause details');
      } finally {
        setLoading(false);
      }
    }

    fetchCause();
  }, [causeId]);

  // Validate wallet address
  useEffect(() => {
    if (!walletAddress || walletAddress.length < 20) {
      setWalletValidation({
        isValidating: false,
        isValid: false
      });
      return;
    }

    const validateWallet = async () => {
      setWalletValidation(prev => ({ ...prev, isValidating: true, error: undefined }));
      
      try {
        const response = await fetch(`/api/wallet/${walletAddress}/user`);
        const data = await response.json();
        
        if (response.ok && data.exists) {
          setWalletValidation({
            isValidating: false,
            isValid: true,
            username: data.username
          });
        } else {
          setWalletValidation({
            isValidating: false,
            isValid: false,
            error: "Wallet address not found. Please check your address."
          });
        }
      } catch {
        setWalletValidation({
          isValidating: false,
          isValid: false,
          error: "Failed to validate wallet address"
        });
      }
    };

    // Debounce the validation
    const timeoutId = setTimeout(validateWallet, 500);
    return () => clearTimeout(timeoutId);
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="container py-8 md:py-12 mt-24">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fbd03d]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12 mt-24">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="font-[SF-Pro-Rounded] font-bold text-2xl text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            onClick={() => router.back()}
            className="bg-[#fbd03d] hover:bg-[#fbd03d]/90 text-black font-[SF-Pro-Rounded] font-semibold"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!cause) {
    return (
      <div className="container py-8 md:py-12 mt-24">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-muted-foreground font-medium">No cause found</p>
        </div>
      </div>
    );
  }

  const tokenColors = getTokenColor(cause.token_name)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Banner */}
      <div className="relative">
        {cause.cause_image_url ? (
          <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
            <Image 
              src={cause.cause_image_url} 
              alt={`${cause.name} banner`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="h-[300px] md:h-[400px] w-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}

        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="absolute top-24 left-4 md:left-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container max-w-6xl">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-[SF-Pro-Rounded] font-black text-3xl md:text-5xl text-white mb-2 drop-shadow-lg">
                {cause.name}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium">
                by {cause.organization}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container max-w-6xl py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Status Badges */}
            <div className="flex items-center gap-2">
              {(() => {
                const statusDisplay = getCauseStatusDisplay(cause.status)
                if (statusDisplay.showToPublic || cause.status !== "Active") {
                  return (
                    <Badge 
                      variant={statusDisplay.variant} 
                      className="font-[SF-Pro-Rounded] font-semibold"
                    >
                      {statusDisplay.label}
                    </Badge>
                  )
                }
                return null
              })()}
              {!isDonationEnabled(cause.status, cause.is_active) && (
                <Badge 
                  variant="secondary"
                  className="font-[SF-Pro-Rounded] font-semibold"
                >
                  Donations Paused
                </Badge>
              )}
            </div>

            {/* About Section */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <h2 className="font-[SF-Pro-Rounded] font-bold text-2xl mb-4">
                  About this cause
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {cause.long_description}
                </p>
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-[#fbd03d] text-black font-[SF-Pro-Rounded] font-semibold">
                      {cause.creator_email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-[SF-Pro-Rounded] font-semibold">Created by</p>
                    <p className="text-sm text-muted-foreground">{cause.creator_email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Donation Card */}
            <Card className="overflow-hidden border-2">
              <CardContent className="p-6 space-y-6">
                {/* Token & Stats */}
                <div className="text-center space-y-4">
                  {/* Token Image */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-full scale-110 shadow-md" />
                      <div 
                        className="relative w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'white' }}
                      >
                        {cause.token_image_url ? (
                          <Image
                            src={cause.token_image_url}
                            alt={`${cause.token_name} token`}
                            width={72}
                            height={72}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full rounded-full flex items-center justify-center"
                            style={{ backgroundColor: tokenColors.bg }}
                          >
                            <span 
                              className="font-[SF-Pro-Rounded] font-black text-2xl"
                              style={{ color: tokenColors.border }}
                            >
                              {cause.token_symbol.slice(0, 2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-[SF-Pro-Rounded] font-bold text-xl">{cause.token_name}</h3>
                    <p className="text-sm text-muted-foreground">({cause.token_symbol})</p>
                  </div>

                  <div className="py-4 border-y space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Raised</p>
                      <p className="font-[SF-Pro-Rounded] font-black text-3xl text-[#049952]">
                        ${(cause.amount_donated || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current receipt price</p>
                      <p className="font-[SF-Pro-Rounded] font-semibold text-lg">
                        ${(cause.current_price * 100).toFixed(2)}/receipt
                      </p>
                    </div>
                  </div>
                </div>

                {isDonationEnabled(cause.status, cause.is_active) ? (
                  <>
                    {/* Wallet Input */}
                    <div className="space-y-2">
                      <label className="font-[SF-Pro-Rounded] font-semibold text-sm">
                        Your Wallet Address
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Find your address in the Index Wallets app"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          className={`font-mono pr-10 ${
                            walletValidation.error ? 'border-destructive' : 
                            walletValidation.isValid ? 'border-green-500' : ''
                          }`}
                        />
                        {walletValidation.isValidating && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          </div>
                        )}
                        {walletValidation.isValid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      {!walletAddress && (
                        <p className="text-sm text-destructive">Required to receive receipts</p>
                      )}
                      {walletValidation.error && (
                        <p className="text-sm text-destructive">{walletValidation.error}</p>
                      )}
                      {walletValidation.username && (
                        <p className="text-sm text-green-600">
                          Wallet verified • {walletValidation.username}
                        </p>
                      )}
                    </div>

                    {/* Donation Form */}
                    {walletAddress && walletValidation.isValid ? (
                      <DonationForm 
                        causeId={cause._id.$oid} 
                        walletAddress={walletAddress} 
                        causeName={cause.name}
                        currentPrice={cause.current_price}
                        tokenSymbol={cause.token_symbol}
                        amountDonated={cause.amount_donated}
                        tokensPurchased={cause.tokens_purchased}
                      />
                    ) : (
                      <Button 
                        disabled 
                        className="w-full font-[SF-Pro-Rounded] font-semibold"
                      >
                        {!walletAddress ? 'Enter wallet address to donate' : 
                         walletValidation.isValidating ? 'Validating wallet...' :
                         'Valid wallet address required'}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        {cause.status === "Failed" 
                          ? "This cause encountered an issue during setup. Please contact support."
                          : "This cause is being set up and will be ready for donations soon."}
                      </p>
                    </div>
                    <Button 
                      disabled 
                      variant="secondary"
                      className="w-full font-[SF-Pro-Rounded] font-semibold"
                    >
                      Donations Not Available
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-[SF-Pro-Rounded] font-bold mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share this cause
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="font-[SF-Pro-Rounded]">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="font-[SF-Pro-Rounded]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="sm" className="font-[SF-Pro-Rounded]">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}