"use client"

import { CauseCard } from "@/components/cause-card"
import { useEffect, useState } from "react"
import { use } from "react"

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
  amount_donated?: number
  tokens_purchased?: number
  current_price?: number
  cause_image_url?: string
  token_image_url?: string
}

export function CausesList() {
  const [causes, setCauses] = useState<Cause[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCauses() {
      try {
        const response = await fetch('/api/causes/get-causes')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCauses(data)
      } catch (error) {
        console.error('Error fetching causes:', error)
        setError('Failed to fetch causes')
      } finally {
        setLoading(false)
      }
    }

    fetchCauses()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {causes.map((cause) => (
        <CauseCard
          key={cause._id?.$oid}
          {...cause}
          id={cause._id?.$oid}
        />
      ))}
    </div>
  )
}
