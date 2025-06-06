"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DonationForm } from "@/components/donation-form"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Coins } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

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
}

export default function CauseDetailPage({ params }: { params: { id: string } }) {
  const [cause, setCause] = useState<Cause | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    async function fetchCause() {
      try {
        const response = await fetch(`/api/causes/${params.id}`);
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
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!cause) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-muted-foreground">No cause found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">{cause.name}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant="outline">{cause.status}</Badge>
              <span className="text-sm text-muted-foreground">{cause.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          {cause.cause_image_url ? (
            <div className="aspect-[3/1] overflow-hidden rounded-lg bg-muted border">
              <img 
                src={cause.cause_image_url} 
                alt={`${cause.name} banner`} 
                className="object-cover w-full h-full" 
              />
            </div>
          ) : (
            <div className="aspect-[3/1] overflow-hidden rounded-lg bg-muted border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">No banner image available</p>
              </div>
            </div>
          )}

          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4 mt-4">
              <p>{cause.long_description}</p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Wallet Address</label>
                  <Input
                    type="text"
                    placeholder="Enter your wallet address"
                    value={walletAddress}
                    onChange={(e) => {
                      setWalletAddress(e.target.value);
                    }}
                  />
                  {!walletAddress && (
                    <p className="text-sm text-destructive">Please enter your wallet address</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Raised</p>
                  <p className="text-2xl font-serif font-medium">${cause.total_raised.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Token</p>
                  <div className="flex items-center gap-2">
                    {cause.token_image_url ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border bg-muted flex-shrink-0">
                        <img 
                          src={cause.token_image_url} 
                          alt={`${cause.token_symbol} token`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <Coins className="h-8 w-8 text-primary flex-shrink-0" />
                    )}
                    <div className="text-lg font-serif font-medium">
                      <div>{cause.token_name}</div>
                      <div className="text-sm text-muted-foreground">({cause.token_symbol})</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={cause.creator_email} />
                  <AvatarFallback>{cause.creator_email.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Created by</p>
                  <p className="text-sm text-muted-foreground">{cause.creator_email}</p>
                </div>
              </div>

              {walletAddress ? (
                <DonationForm 
                  causeId={cause._id.$oid} 
                  walletAddress={walletAddress} 
                  paymentLink={cause.payment_link}
                />
              ) : (
                <p className="text-sm text-destructive">Please enter your wallet address to proceed with donation</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-serif font-semibold mb-2">Share this cause</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
