"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 640)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Gradient Fade */}
      <div className="absolute inset-x-0 -top-[100px] w-full h-[500px] md:h-[600px]">
        <Image
          src="/images/banner_image.png"
          alt="Sustainable future"
          fill
          priority
          className="object-cover"
        />
        {/* Bottom fade to white */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        {/* Overall darkening overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <Image src="/svgs/wave.svg" alt="" width={80} height={40} />
      </div>
      <div className="absolute top-10 right-10 opacity-20">
        <Image src="/svgs/shock.svg" alt="" width={60} height={30} />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-20 pb-32 md:pt-32 md:pb-40">
        <motion.div
          initial={{ y: "30%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "30%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "circInOut", delay: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 
            className="font-[SF-Pro-Rounded] font-black text-white mb-6 drop-shadow-lg"
            style={{ 
              fontSize: isMobile ? '48px' : '72px',
              letterSpacing: '-0.03em',
              lineHeight: '1.1'
            }}
          >
            Fund Public Goods
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow font-medium">
            Vote with your wallet. Support causes that matter and make a real impact in communities worldwide.
          </p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button 
              asChild 
              size="lg" 
              className="bg-[#fbd03d] hover:bg-[#fbd03d]/90 text-black font-[SF-Pro-Rounded] font-semibold text-base px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link href="/causes">Explore Causes</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white backdrop-blur-sm border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 font-[SF-Pro-Rounded] font-semibold text-base px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link href="/create">Create Cause</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}