import { CauseCard } from "@/components/cause-card"

export function FeaturedCauses() {
  // This would normally fetch data from an API
  const causes = [
    {
      id: "1",
      title: "Clean Water Initiative",
      description: "Providing clean water to communities in need around the world.",
      category: "Environment",
      totalRaised: 32500,
      tokenPrice: 2.75,
      daysLeft: 15,
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "Education for All",
      description: "Supporting education programs for underprivileged children.",
      category: "Education",
      totalRaised: 18750,
      tokenPrice: 1.85,
      daysLeft: 22,
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "3",
      title: "Wildlife Conservation",
      description: "Protecting endangered species and their habitats.",
      category: "Animals",
      totalRaised: 12250,
      tokenPrice: 1.25,
      daysLeft: 30,
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
      {causes.map((cause) => (
        <CauseCard key={cause.id} {...cause} />
      ))}
    </div>
  )
}
