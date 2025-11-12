import { Card, CardContent } from "@/components/ui/card"

interface WeekStatsProps {
  weeksLived: number
  weeksDocumented: number
  milestoneCount: number // Added milestone count
  birthDate: string
}

export function WeekStats({ weeksLived, weeksDocumented, milestoneCount, birthDate }: WeekStatsProps) {
  const averageLifespan = 80 * 52 // 80 years in weeks
  const percentageLived = Math.min((weeksLived / averageLifespan) * 100, 100)
  const documentationRate = weeksLived > 0 ? (weeksDocumented / weeksLived) * 100 : 0

  const birthDateObj = new Date(birthDate)
  const age = Math.floor(weeksLived / 52)

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      <Card className="border-stone-200">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-slate-900 mb-1">{age}</div>
          <div className="text-sm text-stone-600">Years Old</div>
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-slate-900 mb-1">{weeksLived.toLocaleString()}</div>
          <div className="text-sm text-stone-600">Weeks Lived</div>
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-lime-600 mb-1">{weeksDocumented.toLocaleString()}</div>
          <div className="text-sm text-stone-600">Weeks Documented</div>
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-amber-600 mb-1">{milestoneCount.toLocaleString()}</div>
          <div className="text-sm text-stone-600">Milestones Recorded</div>
        </CardContent>
      </Card>
    </div>
  )
}
