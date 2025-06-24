"use client"

import Link from "next/link"

export function MainNav() {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-serif font-bold text-xl">Index Wallets</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        <Link
          href="/causes"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Explore Public Goods
        </Link>
        <Link
          href="/create"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Create Public Good
        </Link>
        <Link
          href="https://indexwallets.org"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          About Us
        </Link>
      </nav>
    </div>
  )
}
