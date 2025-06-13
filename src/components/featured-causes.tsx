"use client"

import { useEffect, useState } from "react"
import { CauseCard } from "@/components/cause-card"
import { Skeleton } from "@/components/ui/skeleton"

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
  token_image_url?: string
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
  amount_donated?: number
  tokens_purchased?: number
  current_price?: number
}

export function FeaturedCauses() {
  const [causes, setCauses] = useState<Cause[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/causes/get-causes')
      .then(res => res.json())
      .then(data => {
        // Only show first 3 causes as featured
        setCauses(data.slice(0, 3))
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch causes:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
      {causes.map((cause) => (
        <CauseCard key={cause._id.$oid} {...cause} />
      ))}
    </div>
  )
}