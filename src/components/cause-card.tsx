import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from "lucide-react"

interface CauseCardProps {
  _id?: {
    $oid: string
  }
  name: string
  organization: string
  description: string
  long_description?: string
  token_name: string
  token_symbol: string
  token_image_url?: string
  total_raised: number
  payment_link?: string
  status?: string
  stripe_product_id?: string
  error_message?: string
  is_active?: boolean
  created_at?: {
    $date: Date
  }
  updated_at?: {
    $date: Date
  }
  amount_donated?: number
  tokens_purchased?: number
  current_price?: number
  cause_image_url?: string
}

// Generate a consistent color based on token name
function getTokenColor(tokenName: string): { bg: string; border: string } {
  const colors = [
    { bg: "#E7F0FF", border: "#0046BE" }, // Blue
    { bg: "#F0E4FC", border: "#A856F7" }, // Purple
    { bg: "#D5FFEB", border: "#049952" }, // Green
    { bg: "#FFF2E6", border: "#EDA058" }, // Orange
    { bg: "#FFE5E5", border: "#FF4444" }, // Red
  ]
  
  const index = tokenName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}

// Generate placeholder image based on cause name
function getPlaceholderImage(): string {
  // You can replace this with actual token images when available
  const imageTypes = [
    "/images/banner_image.png", // Use existing banner as placeholder
  ]
  return imageTypes[0]
}

// Generate token image or fallback to initials
function getTokenImage(tokenImageUrl: string | undefined, tokenSymbol: string): { type: 'image' | 'initials', content: string } {
  if (tokenImageUrl) {
    return { type: 'image', content: tokenImageUrl }
  }
  
  // Fallback to initials
  const initials = tokenSymbol
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  return { type: 'initials', content: initials }
}


export function CauseCard({
  name,
  organization,
  description,
  token_name,
  token_symbol,
  token_image_url,
  total_raised,
  current_price,
  amount_donated,
  cause_image_url,
}: CauseCardProps) {
  const tokenColors = getTokenColor(token_name)
  const tokenImage = getTokenImage(token_image_url, token_symbol)
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] group">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={cause_image_url || getPlaceholderImage()}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Token Image/Avatar */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            {/* White background circle for contrast */}
            <div className="absolute inset-0 bg-white rounded-full scale-110 shadow-md" />
            
            {/* Token container */}
            <div 
              className="relative w-12 h-12 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
              style={{ 
                backgroundColor: 'white',
              }}
            >
              {tokenImage.type === 'image' ? (
                <Image
                  src={tokenImage.content}
                  alt={`${token_name} token`}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: tokenColors.bg,
                  }}
                >
                  <span 
                    className="font-[SF-Pro-Rounded] font-bold text-sm"
                    style={{ color: tokenColors.border }}
                  >
                    {tokenImage.content}
                  </span>
                </div>
              )}
            </div>
            
            {/* Subtle glow effect on hover */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-md scale-150"
              style={{ backgroundColor: tokenColors.border }}
            />
          </div>
        </div>
      </div>

      <CardHeader className="p-5 pb-3">
        <div className="space-y-2">
          <Link href={`/causes/${token_symbol}`} className="block group/link">
            <h3 className="font-[SF-Pro-Rounded] font-bold text-xl line-clamp-1 group-hover/link:text-[#fbd03d] transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground font-medium">{organization}</p>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
        
        <div className="space-y-3">
          {/* Stats */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Raised</span>
            <span className="text-sm font-semibold text-green-600">
              ${(amount_donated || total_raised || 0).toFixed(2)}
            </span>
          </div>

          {/* Token Info */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Cause: {token_name}</span>
            </div>
            {current_price && (
              <Badge variant="secondary" className="font-[SF-Pro-Rounded] font-medium">
                ${(current_price * 100).toFixed(2)}/receipt
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button 
          asChild 
          className="w-full bg-[#fbd03d] hover:bg-[#fbd03d]/90 text-black font-[SF-Pro-Rounded] font-semibold group/btn"
        >
          <Link href={`/causes/${token_symbol}`}>
            Support This Cause
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}