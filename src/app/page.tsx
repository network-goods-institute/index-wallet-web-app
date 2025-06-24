import { Button } from "@/components/ui/button"
import { FeaturedCauses } from "@/components/featured-causes"
import { HeroSection } from "@/components/hero-section"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Causes */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="font-[SF-Pro-Rounded] font-black text-3xl sm:text-4xl md:text-5xl text-[#0c0a09]" style={{ letterSpacing: '-0.02em' }}>
                Featured Public Goods
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-medium">
                These public goods need your support. Every contribution makes a difference.
              </p>
            </div>
          </div>
          <FeaturedCauses />
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline" className="text-base">
              <Link href="/causes">View All Public Goods</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Simple steps to make a big impact
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <h3 className="text-xl font-bold">Find a Cause</h3>
                <p className="text-muted-foreground">
                  Browse through our collection of public goods or search for specific ones.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <span className="text-2xl font-bold text-primary-foreground">2</span>
                </div>
                <h3 className="text-xl font-bold">Make a Donation</h3>
                <p className="text-muted-foreground">
                  Contribute any amount you&apos;re comfortable with to support the cause.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <span className="text-2xl font-bold text-primary-foreground">3</span>
                </div>
                <h3 className="text-xl font-bold">Receive Receipts</h3>
                <p className="text-muted-foreground">
                  Receive donation receipts in exchange for your contributions, spend them at participating vendors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
