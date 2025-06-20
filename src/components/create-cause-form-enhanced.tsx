"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/ui/image-upload"
import { ProgressIndicator } from "@/components/ui/progress-indicator"
import { DraftBanner } from "@/components/ui/draft-banner"
import { AlertCircle, ShieldCheck, Info, CheckCircle2, Loader2, XCircle } from "lucide-react"

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

interface SavedDraft {
  draftId: string
  symbol: string
  name: string
  createdAt: string
}

interface DraftStatusResponse {
  status: 'draft' | 'incomplete' | 'pending' | 'complete' | 'not_found' | 'error' | 'processing'
  draft?: {
    name: string
    token_symbol: string
    organization: string
    description: string
    long_description: string
    creator_email: string
    token_name: string
    cause_image_url?: string
    token_image_url?: string
  }
  onboarding_url?: string
  cause_id?: string
  cause_symbol?: string
  message?: string
}

export function CreateCauseFormEnhanced() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [stripeUrl, setStripeUrl] = useState("")
  const [isFormReadOnly, setIsFormReadOnly] = useState(false)
  const [draftBanner, setDraftBanner] = useState<{
    type: 'success' | 'info' | 'action' | 'error'
    message: string
    actions?: Array<{ text: string; action: () => void; variant?: 'default' | 'outline' }>
  } | null>(null)
  
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

  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string>('')
  
  // Field-specific error states
  const [fieldErrors, setFieldErrors] = useState<{
    name?: boolean
    tokenName?: boolean
    tokenSymbol?: boolean
  }>({})
  
  // Real-time validation state
  const [fieldValidation, setFieldValidation] = useState<{
    name: { isValidating: boolean; isValid: boolean; message: string | null }
    tokenName: { isValidating: boolean; isValid: boolean; message: string | null }
    tokenSymbol: { isValidating: boolean; isValid: boolean; message: string | null }
  }>({
    name: { isValidating: false, isValid: true, message: null },
    tokenName: { isValidating: false, isValid: true, message: null },
    tokenSymbol: { isValidating: false, isValid: true, message: null }
  })

  const checkExistingDraft = useCallback(async () => {
    // Check for new format first
    let savedDraft: SavedDraft | null = null
    const savedDraftStr = localStorage.getItem('causeDraft')
    
    if (savedDraftStr) {
      try {
        savedDraft = JSON.parse(savedDraftStr)
      } catch (e) {
        console.error('Error parsing causeDraft:', e)
      }
    }
    
    // Check for legacy format if new format not found
    if (!savedDraft) {
      const legacyDraftId = localStorage.getItem('currentDraftId')
      if (legacyDraftId) {
        // Create a temporary SavedDraft object for legacy drafts
        savedDraft = {
          draftId: legacyDraftId,
          symbol: 'Loading...',
          name: 'Loading...',
          createdAt: new Date().toISOString()
        }
      }
    }
    
    if (!savedDraft) return

    try {
      const response = await fetch(`/api/causes/drafts/${savedDraft.draftId}/status`)
      
      if (!response.ok) {
        localStorage.removeItem('causeDraft')
        return
      }

      const status: DraftStatusResponse = await response.json()

      switch (status.status) {
        case 'complete':
          setDraftBanner({
            type: 'success',
            message: `✓ Your cause${status.draft?.name ? ` '${status.draft.name}'` : ''} (${status.cause_symbol}) was created successfully!`,
          })
          localStorage.removeItem('causeDraft')
          localStorage.removeItem('currentDraftId')
          break

        case 'pending':
        case 'processing':
          setDraftBanner({
            type: 'info',
            message: status.message || `Your cause${status.draft?.name ? ` '${status.draft.name}'` : ''} (${status.cause_symbol || status.draft?.token_symbol || ''}) is being set up...`,
          })
          // Poll for updates
          setTimeout(() => checkExistingDraft(), 5000)
          break

        case 'incomplete':
          // Use draft name from status if available, otherwise use saved name
          const causeName = status.draft?.name || savedDraft.name
          const displayName = causeName === 'Loading...' ? 'your cause' : `'${causeName}'`
          
          setDraftBanner({
            type: 'action',
            message: `Continue setting up ${displayName} (${status.cause_symbol})?`,
            actions: [
              { 
                text: 'Continue Setup', 
                action: () => resumeSetup(status),
                variant: 'default'
              },
              { 
                text: 'Start Fresh', 
                action: () => clearDraft(),
                variant: 'outline'
              }
            ]
          })
          break

        case 'not_found':
        case 'error':
          localStorage.removeItem('causeDraft')
          localStorage.removeItem('currentDraftId')
          break
      }
    } catch (error) {
      console.error('Error checking draft status:', error)
      localStorage.removeItem('causeDraft')
      localStorage.removeItem('currentDraftId')
    }
  }, [])

  const resumeSetup = (status: DraftStatusResponse) => {
    if (status.draft) {
      const draft = status.draft
      setFormData({
        name: draft.name || '',
        organization: draft.organization || '',
        description: draft.description || '',
        long_description: draft.long_description || '',
        creator_email: draft.creator_email || '',
        token_name: draft.token_name || '',
        token_symbol: draft.token_symbol || '',
        token_image_url: draft.token_image_url || '',
        cause_image_url: draft.cause_image_url || ''
      })
    }

    if (status.onboarding_url) {
      setIsFormReadOnly(true)
      setStripeUrl(status.onboarding_url)
      
      // Scroll to bottom after a short delay to ensure DOM is updated
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
  }

  const clearDraft = () => {
    localStorage.removeItem('causeDraft')
    localStorage.removeItem('currentDraftId') // Remove legacy key too
    setDraftBanner(null)
    setIsFormReadOnly(false)
    setFormData({
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
  }

  // Validation functions
  const validateField = async (field: 'name' | 'tokenName' | 'tokenSymbol', value: string) => {
    if (!value || isFormReadOnly) return
    
    setFieldValidation(prev => ({
      ...prev,
      [field]: { ...prev[field], isValidating: true }
    }))
    
    try {
      const endpoint = field === 'name' ? 'name' : 
                      field === 'tokenSymbol' ? 'token-symbol' : 
                      'token-name'
      
      const response = await fetch(`/api/causes/validate/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      })
      
      // Check if response is ok and has content
      if (!response.ok) {
        throw new Error(`Validation failed with status: ${response.status}`)
      }
      
      // Check if response has content
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', contentType)
        throw new Error('Invalid response format')
      }
      
      const text = await response.text()
      if (!text) {
        console.error('Empty response body')
        throw new Error('Empty response')
      }
      
      let data
      try {
        data = JSON.parse(text)
      } catch {
        console.error('Failed to parse JSON:', text)
        throw new Error('Invalid JSON response')
      }
      
      setFieldValidation(prev => ({
        ...prev,
        [field]: {
          isValidating: false,
          isValid: data.valid !== false, // Default to true if not explicitly false
          message: data.message || null
        }
      }))
    } catch (error) {
      console.error(`Error validating ${field}:`, error)
      setFieldValidation(prev => ({
        ...prev,
        [field]: {
          isValidating: false,
          isValid: true, // Default to valid on error to not block form
          message: null
        }
      }))
    }
  }
  
  // Custom debounce hook
  const useDebounce = (callback: (...args: unknown[]) => void, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    const debouncedCallback = useCallback((...args: unknown[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }, [callback, delay])
    
    return debouncedCallback
  }
  
  // Debounced validation functions
  const debouncedValidateName = useDebounce((value: unknown) => {
    if (typeof value === 'string') {
      validateField('name', value)
    }
  }, 500)
  const debouncedValidateTokenName = useDebounce((value: unknown) => {
    if (typeof value === 'string') {
      validateField('tokenName', value)
    }
  }, 500)
  const debouncedValidateTokenSymbol = useDebounce((value: unknown) => {
    if (typeof value === 'string') {
      validateField('tokenSymbol', value)
    }
  }, 500)

  useEffect(() => {
    checkExistingDraft()
  }, [checkExistingDraft])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    
    // Clear field error when user starts typing
    const fieldErrorKey = id === 'token_name' ? 'tokenName' : 
                        id === 'token_symbol' ? 'tokenSymbol' : 
                        id === 'name' ? 'name' : null
    
    if (fieldErrorKey && fieldErrors[fieldErrorKey]) {
      setFieldErrors(prev => ({ ...prev, [fieldErrorKey]: false }))
    }
    
    // Update form data
    let processedValue = value
    if (id === 'token_symbol') {
      processedValue = value.toUpperCase()
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: processedValue
    }))
    
    // Trigger debounced validation for specific fields
    if (id === 'name' && processedValue) {
      debouncedValidateName(processedValue)
    } else if (id === 'token_name' && processedValue) {
      debouncedValidateTokenName(processedValue)
    } else if (id === 'token_symbol' && processedValue) {
      debouncedValidateTokenSymbol(processedValue)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors([])
    setSuccessMessage('')
    setFieldErrors({})
    
    const { name, organization, description, creator_email, token_symbol, token_name, long_description, cause_image_url, token_image_url } = formData
    if (!name || !organization || !description || !creator_email || !token_symbol || !token_name) {
      setErrors(['Please fill out all the fields.'])
      setIsSubmitting(false)
      return
    }

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

      if (!response.ok) {
        // Since validation happens in real-time now, we only need to handle non-validation errors
        setErrors([data.message || data.error || 'An unexpected error occurred. Please try again.'])
      } else {
        if (data.onboarding_url && data.draft_id) {
          // Save draft to localStorage
          const savedDraft: SavedDraft = {
            draftId: data.draft_id,
            symbol: token_symbol,
            name: name,
            createdAt: new Date().toISOString()
          }
          localStorage.setItem('causeDraft', JSON.stringify(savedDraft))
          
          setIsRedirecting(true)
          setSuccessMessage('Redirecting to secure payment setup...')
          
          setTimeout(() => {
            window.location.href = data.onboarding_url
          }, 1500)
        } else if (data.stripe_url && data.draft_id) {
          // Alternative naming
          const savedDraft: SavedDraft = {
            draftId: data.draft_id,
            symbol: token_symbol,
            name: name,
            createdAt: new Date().toISOString()
          }
          localStorage.setItem('causeDraft', JSON.stringify(savedDraft))
          
          setIsRedirecting(true)
          setSuccessMessage('Redirecting to secure payment setup...')
          
          setTimeout(() => {
            window.location.href = data.stripe_url
          }, 1500)
        } else if (data.causeId || data.cause_id) {
          // Direct cause creation (legacy)
          const causeToken = data.causeToken || data.cause_token || data.token || data.causeId || data.cause_id
          router.push(`/causes/${causeToken}`)
        } else {
          console.error('Unexpected response format:', data)
          setErrors(['The cause was created but we received an unexpected response format. Please check your email for further instructions.'])
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors(['Network error. Please check your connection and try again.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressSteps = [
    { label: "Cause Details", status: "current" as const },
    { label: "Payment Setup", status: "pending" as const }
  ]

  return (
    <div>
      {draftBanner && (
        <DraftBanner
          type={draftBanner.type}
          message={draftBanner.message}
          actions={draftBanner.actions}
          onDismiss={() => setDraftBanner(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <ProgressIndicator steps={progressSteps} className="mb-8" />
        
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium">Secure Two-Step Process</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  After submitting your cause details, you&apos;ll be redirected to Stripe&apos;s secure platform to set up payment processing. This ensures your donations are handled safely and compliantly.
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
                  <div className="relative">
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => formData.name && validateField('name', formData.name)}
                      placeholder="Enter a clear, descriptive name" 
                      required 
                      disabled={isFormReadOnly}
                      className={`pr-10 ${
                        fieldErrors.name || (!fieldValidation.name.isValid && fieldValidation.name.message)
                          ? "border-red-500 focus-visible:ring-red-500" 
                          : ""
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {fieldValidation.name.isValidating && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {!fieldValidation.name.isValidating && fieldValidation.name.message && !fieldValidation.name.isValid && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {!fieldValidation.name.isValidating && fieldValidation.name.isValid && formData.name && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  {fieldValidation.name.message && !fieldValidation.name.isValid && (
                    <p className="text-sm text-red-500">{fieldValidation.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input 
                    id="organization" 
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Enter your organization name" 
                    required 
                    disabled={isFormReadOnly}
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
                    disabled={isFormReadOnly}
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
                    disabled={isFormReadOnly}
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
                    disabled={isFormReadOnly}
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
                  <div className="relative">
                    <Input 
                      id="token_name" 
                      value={formData.token_name}
                      onChange={handleChange}
                      onBlur={() => formData.token_name && validateField('tokenName', formData.token_name)}
                      placeholder="Enter the full name of your token" 
                      required 
                      disabled={isFormReadOnly}
                      className={`pr-10 ${
                        fieldErrors.tokenName || (!fieldValidation.tokenName.isValid && fieldValidation.tokenName.message)
                          ? "border-red-500 focus-visible:ring-red-500" 
                          : ""
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {fieldValidation.tokenName.isValidating && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {!fieldValidation.tokenName.isValidating && fieldValidation.tokenName.message && !fieldValidation.tokenName.isValid && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {!fieldValidation.tokenName.isValidating && fieldValidation.tokenName.isValid && formData.token_name && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  {fieldValidation.tokenName.message && !fieldValidation.tokenName.isValid && (
                    <p className="text-sm text-red-500">{fieldValidation.tokenName.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Example: &quot;Ocean Cleanup Token&quot;</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token_symbol">Token Symbol</Label>
                  <div className="relative">
                    <Input 
                      id="token_symbol" 
                      value={formData.token_symbol}
                      onChange={handleChange}
                      onBlur={() => formData.token_symbol && validateField('tokenSymbol', formData.token_symbol)}
                      placeholder="Enter token symbol" 
                      maxLength={5}
                      required 
                      disabled={isFormReadOnly}
                      className={`pr-10 ${
                        fieldErrors.tokenSymbol || (!fieldValidation.tokenSymbol.isValid && fieldValidation.tokenSymbol.message)
                          ? "border-red-500 focus-visible:ring-red-500" 
                          : ""
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {fieldValidation.tokenSymbol.isValidating && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {!fieldValidation.tokenSymbol.isValidating && fieldValidation.tokenSymbol.message && !fieldValidation.tokenSymbol.isValid && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {!fieldValidation.tokenSymbol.isValidating && fieldValidation.tokenSymbol.isValid && formData.token_symbol && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  {fieldValidation.tokenSymbol.message && !fieldValidation.tokenSymbol.isValid && (
                    <p className="text-sm text-red-500">{fieldValidation.tokenSymbol.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Example: &quot;OCT&quot; (usually 3-5 characters)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Separator />
        
        {errors.length > 0 && (
          <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Error creating cause</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
            <p>{successMessage}</p>
          </div>
        )}
        
        {isFormReadOnly ? (
          <>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-amber-900">Welcome back! Your draft is ready</h3>
                      <p className="text-sm text-amber-800 mt-1">
                        We&apos;ve loaded your saved information. When you&apos;re ready, continue to Stripe to complete your payment setup.
                      </p>
                      <p className="text-xs text-amber-700 mt-2">
                        Note: Drafts are saved for 24 hours. After that, you&apos;ll need to start fresh.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      onClick={clearDraft}
                      size="lg"
                      variant="outline"
                    >
                      Clear Draft & Start Over
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => window.location.href = stripeUrl}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Resume Stripe Setup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex justify-end space-x-4">
            <Button 
              type="submit" 
              disabled={
                isSubmitting || 
                isRedirecting || 
                !fieldValidation.name.isValid || 
                !fieldValidation.tokenName.isValid || 
                !fieldValidation.tokenSymbol.isValid ||
                fieldValidation.name.isValidating ||
                fieldValidation.tokenName.isValidating ||
                fieldValidation.tokenSymbol.isValidating
              } 
              size="lg"
            >
              {isRedirecting ? "Redirecting to Payment Setup..." : isSubmitting ? "Creating..." : "Continue to Payment Setup"}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}