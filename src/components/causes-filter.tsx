import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export function CausesFilter() {
  const categories = [
    { id: "environment", label: "Environment" },
    { id: "education", label: "Education" },
    { id: "animals", label: "Animals" },
    { id: "humanitarian", label: "Humanitarian" },
    { id: "health", label: "Health" },
    { id: "arts", label: "Arts & Culture" },
    { id: "community", label: "Community" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Causes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input id="search" placeholder="Search causes..." />
        </div>

        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox id={category.id} />
                <Label htmlFor={category.id} className="font-normal">
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Funding Goal</Label>
            <div className="pt-2">
              <Slider defaultValue={[50000]} max={100000} step={5000} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$100,000</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Time Left</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="ending-soon" />
              <Label htmlFor="ending-soon" className="font-normal">
                Ending Soon (&lt; 7 days)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="new-causes" />
              <Label htmlFor="new-causes" className="font-normal">
                New Causes (&lt; 14 days)
              </Label>
            </div>
          </div>
        </div>

        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}
