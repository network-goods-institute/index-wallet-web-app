import { CreateCauseForm } from "@/components/create-cause-form"

export default function CreateCausePage() {
  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create a Cause</h1>
          <p className="text-muted-foreground">Share your mission with the world and start raising funds</p>
        </div>
        <CreateCauseForm />
      </div>
    </div>
  )
}
