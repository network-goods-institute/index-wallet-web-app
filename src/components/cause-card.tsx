import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"

interface CauseCardProps {
  id: string
  _id?: {
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
}

// we can get the token price by using simple bonding curve: 
// we'll need to get the token information itself -- through a fetch: 


export function CauseCard({
  _id,
  name,
  organization,
  description,
  long_description,
  token_name,
  token_symbol,
  total_raised,
  payment_link,
  status,
  is_active,
  error_message,
  created_at,
  updated_at,
}: CauseCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Link href={`/causes/${_id?.$oid}`} className="hover:underline">
              <h3 className="font-serif font-semibold text-lg line-clamp-1">{name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{organization}</p>
            <p className="text-xs text-muted-foreground">Status: {status}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Raised</p>
            <p className="font-medium">${total_raised?.toLocaleString() || '$0'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Token</p>
            <div className="font-medium">
              {token_name} ({token_symbol})
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <a href={payment_link} target="_blank" rel="noopener noreferrer">Support This Cause</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
