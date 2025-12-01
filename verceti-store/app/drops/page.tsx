import { dropService } from '@/lib/services/drop'
import { DropCard } from '@/components/drops/drop-card'

export const metadata = {
  title: 'Drops - Verceti',
  description: 'Exclusive product drops and limited releases',
}

export default async function DropsPage() {
  const upcomingDrops = await dropService.getUpcomingDrops()
  const liveDrops = await dropService.getLiveDrops()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Live Drops */}
      {liveDrops.length > 0 && (
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8">Live Now</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Drops */}
      <section>
        <h2 className="text-3xl font-bold mb-8">
          {liveDrops.length > 0 ? 'Coming Soon' : 'Upcoming Drops'}
        </h2>
        {upcomingDrops.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No upcoming drops at the moment</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingDrops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
