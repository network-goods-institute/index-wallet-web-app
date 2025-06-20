import { CausesList } from "@/components/causes-list"

export default function CausesPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col py-16 space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold">Causes</h1>
          <p className="text-muted-foreground">Discover and support causes that matter to you</p>
        </div>
        <CausesList />
      </div>
    </div>
  )
}
