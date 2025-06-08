"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function IndexHeader() {
  const { scrollY } = useScroll()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Animate header position from 24px to 10px when scrolling down
  const topPosition = useTransform(scrollY, [0, 100], [24, 10])

  return (
    <>
      <motion.header
        className="fixed left-1/2 z-50 bg-white shadow-[2px_2px_16px_0px_rgba(233,221,246,0.6)] rounded-xl border border-[#d9d9d980] flex items-center justify-between px-3 h-[59px]"
        style={{
          x: "-50%",
          top: topPosition,
          width: "min(768px, 90vw)",
        }}
        transition={{ ease: "backInOut", duration: 0.5 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image src="/index_logo.svg" alt="Index Wallets Logo" width={28} height={24} />
          <h2 className="font-[SF-Pro-Rounded] font-bold text-lg leading-[21.48px] text-[#0c0a09]" style={{ letterSpacing: "-0.03em" }}>
            Index Wallets
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/causes">
            <span>Explore Public Goods</span>
            <span className="hover-text">Explore Public Goods</span>
          </NavLink>
          <NavLink href="/create">
            <span>Create Public Good</span>
            <span className="hover-text">Create Public Good</span>
          </NavLink>
          <NavLink href="/about">
            <span>About Us</span>
            <span className="hover-text">About Us</span>
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {!isMobileMenuOpen ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </motion.header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-[90px] left-0 right-0 bg-white shadow-lg rounded-lg mx-4 p-4 z-40"
        >
          <nav className="flex flex-col gap-4">
            <MobileNavLink href="/causes" onClick={() => setIsMobileMenuOpen(false)}>
              Explore Public Goods
            </MobileNavLink>
            <MobileNavLink href="/create" onClick={() => setIsMobileMenuOpen(false)}>
              Create Public Good
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              About Us
            </MobileNavLink>
          </nav>
        </motion.div>
      )}

      {/* Add custom styles for hover animations */}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        
        .hover-text {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
        }
        
        a:hover span:first-child {
          animation: slideUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        
        a:hover .hover-text {
          animation: slideUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </>
  )
}

// Navigation Link Component with hover animation
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative overflow-hidden inline-block font-[SF-Pro-Rounded] font-medium text-base leading-[19.09px] text-[#0c0a09] no-underline transition-transform duration-[400ms] hover:scale-[1.05]"
      style={{ letterSpacing: "-0.03em" }}
    >
      {children}
    </Link>
  )
}

// Mobile Navigation Link
function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="font-[SF-Pro-Rounded] font-medium text-base leading-[19.09px] text-[#0c0a09] no-underline py-2"
      style={{ letterSpacing: "-0.03em" }}
    >
      {children}
    </Link>
  )
}