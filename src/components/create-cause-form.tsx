"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/ui/image-upload"
import { ProgressIndicator } from "@/components/ui/progress-indicator"
import { AlertCircle, ShieldCheck } from "lucide-react"

interface CauseFormData {
  name: string
  organization: string
  description: string
  long_description: string
  creator_email: string
  token_symbol: string
  token_name: string
  cause_image_url: string
  token_image_url: string
}

export function CreateCauseForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [formData, setFormData] = useState<CauseFormData>({
    name: "",
    organization: "",
    description: "",
    long_description: "",
    creator_email: "",
    token_symbol: "",
    token_name: "",
    cause_image_url: "",
    token_image_url: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])
    setSuccessMessage('')
    
    // Basic validation
    const { name, organization, description, creator_email, token_symbol, token_name, long_description, cause_image_url, token_image_url } = formData
    if (!name || !organization || !description || !creator_email || !token_symbol || !token_name) {
      setErrors(['Please fill out all the fields.'])
      setIsSubmitting(false)
      return
    }

    // Prepare payload for backend
    const payload = {
      name,
      organization,
      description,
      long_description,
      creator_email,
      token_name,
      token_symbol,
      cause_image_url: cause_image_url || undefined,
      token_image_url: token_image_url || undefined
    }

    try {
      const response = await fetch('/api/causes/create-cause', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log('Response from backend:', data)

      if (!response.ok) {
        // Handle backend error format
        if (data && data.message) {
          setErrors([data.message])
        } else {
          setErrors(['An unexpected error occurred. Please try again.'])
        }
        console.error('Error submitting form:', data)
      } else {
        // Handle successful response
        console.log('Successful response data:', data)
        
        if (data.onboarding_url && data.draft_id) {
          // Stripe Connect flow with onboarding URL
          localStorage.setItem('currentDraftId', data.draft_id);
          setIsRedirecting(true);
          setSuccessMessage('Redirecting to secure payment setup...');
          
          // Redirect to Stripe Connect
          setTimeout(() => {
            window.location.href = data.onboarding_url;
          }, 1500);
        } else if (data.stripeUrl && data.draftId) {
          // Alternative naming (camelCase)
          localStorage.setItem('currentDraftId', data.draftId);
          setIsRedirecting(true);
          setSuccessMessage('Redirecting to secure payment setup...');
          
          // Redirect to Stripe Connect
          setTimeout(() => {
            window.location.href = data.stripeUrl;
          }, 1500);
        } else if (data.stripe_url && data.draft_id) {
          // Alternative naming convention (snake_case)
          localStorage.setItem('currentDraftId', data.draft_id);
          setIsRedirecting(true);
          setSuccessMessage('Redirecting to secure payment setup...');
          
          // Redirect to Stripe Connect
          setTimeout(() => {
            window.location.href = data.stripe_url;
          }, 1500);
        } else if (data.causeId || data.cause_id) {
          // Legacy flow - direct cause creation
          const causeToken = data.causeToken || data.cause_token || data.token || data.causeId || data.cause_id;
          router.push(`/causes/${causeToken}`);
        } else if (data.id && data.token) {
          // Another possible format
          router.push(`/causes/${data.token}`);
        } else {
          console.error('Unexpected response format:', data);
          setErrors(['The cause was created but we received an unexpected response format. Please check your email for further instructions.']);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(['Network error. Please check your connection and try again.']);
    } finally {
      setIsSubmitting(false);
    }
  }

  const progressSteps = [
    { label: "Cause Details", status: "current" as const },
    { label: "Payment Setup", status: "pending" as const }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ProgressIndicator steps={progressSteps} className="mb-8" />
      
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium">Secure Two-Step Process</h3>
              <p className="text-sm text-muted-foreground mt-1">
                After submitting your cause details, you'll be redirected to Stripe's secure platform to set up payment processing. This ensures your donations are handled safely and compliantly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Cause Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter a clear, descriptive name" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input 
                  id="organization" 
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Enter your organization name" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a brief summary (100-150 characters)"
                  maxLength={150}
                  required
                />
                <p className="text-xs text-muted-foreground">This will appear in cause listings</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Full Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={handleChange}
                  placeholder="Describe your cause in detail"
                  className="min-h-[200px]"
                  required
                />
                <p className="text-xs text-muted-foreground">Tell potential donors why this cause matters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creator_email">Contact Email</Label>
                <Input 
                  id="creator_email" 
                  type="email"
                  value={formData.creator_email}
                  onChange={handleChange}
                  placeholder="Enter your email address" 
                  required 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Images</h3>
            <div className="space-y-6">
              <ImageUpload
                title="Cause Image"
                description="Main banner image representing your cause for the web app"
                aspectRatio="banner"
                suggestedDimensions="1200x400px (3:1 ratio)"
                onImageChange={() => {}}
                onImageUploaded={(url) => {
                  setFormData(prev => ({
                    ...prev,
                    cause_image_url: url
                  }))
                }}
              />
              <ImageUpload
                title="Token Image"
                description="Square icon/logo for your token (will be used in wallets and exchanges)"
                aspectRatio="square"
                suggestedDimensions="512x512px (1:1 ratio)"
                onImageChange={() => {}}
                onImageUploaded={(url) => {
                  setFormData(prev => ({
                    ...prev,
                    token_image_url: url
                  }))
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Token Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token_name">Token Name</Label>
                <Input 
                  id="token_name" 
                  value={formData.token_name}
                  onChange={handleChange}
                  placeholder="Enter the full name of your token" 
                  required 
                />
                <p className="text-xs text-muted-foreground">Example: "Ocean Cleanup Token"</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token_symbol">Token Symbol</Label>
                <Input 
                  id="token_symbol" 
                  value={formData.token_symbol}
                  onChange={handleChange}
                  placeholder="Enter token symbol" 
                  maxLength={5}
                  required 
                />
                <p className="text-xs text-muted-foreground">Example: "OCT" (usually 3-5 characters)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Separator />
      
      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md mb-4">
          <h4 className="font-medium mb-1">Please fix the following errors:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-4">
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || isRedirecting} size="lg">
          {isRedirecting ? "Redirecting to Payment Setup..." : isSubmitting ? "Creating..." : "Continue to Payment Setup"}
        </Button>
      </div>
    </form>
  )
}
