import { CauseCard } from "@/components/cause-card"

export function FeaturedCauses() {
  // Simplified data to reduce potential errors
  const causes = [
    {
      id: "1",
      title: "Clean Water Initiative",
      description: "Providing clean water to communities in need around the world.",
      category: "Environment",
      goalAmount: 50000,
      raisedAmount: 32500,
      daysLeft: 15,
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "Education for All",
      description: "Supporting education programs for underprivileged children.",
      category: "Education",
      goalAmount: 25000,
      raisedAmount: 18750,
      daysLeft: 22,
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "3",
      title: "Wildlife Conservation",
      description: "Protecting endangered species and their habitats.",
      category: "Animals",
      goalAmount: 35000,
      raisedAmount: 12250,
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
