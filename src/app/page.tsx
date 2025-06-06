import { Button } from "@/components/ui/button"
import { FeaturedCauses } from "@/components/featured-causes"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Banner Image */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Banner Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/banner_image.png"
            alt="Sustainable green city with solar panels and wind turbines"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="container relative px-4 md:px-6 z-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-md">
                Fund Public Goods
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-white/90 drop-shadow">
                Vote with your wallet. Index Wallets is brought to you by the Network Goods Institute.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/causes">Explore Public Goods</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 text-base"
              >
                <Link href="/create">Create Public Good</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Public Goods</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
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
                  Contribute any amount you're comfortable with to support the cause.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <span className="text-2xl font-bold text-primary-foreground">3</span>
                </div>
                <h3 className="text-xl font-bold">Track Impact</h3>
                <p className="text-muted-foreground">
                  Follow the progress and see how your contribution is making a difference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
