import { createClient } from '@/lib/supabase/server'
import HomePageClient from '@/components/HomePageClient'

export const metadata = {
  title: 'Henka — Melbourne businesses that actually mean it',
  description:
    'A curated directory of Melbourne businesses making genuine, traceable choices toward a more sustainable future.',
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredBusinesses } = await supabase
    .from('businesses')
    .select('id, name, slug, suburb, category, description, criteria, is_verified')
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('name')
    .limit(4)

  const { data: allBusinesses } = await supabase
    .from('businesses')
    .select('category')
    .eq('status', 'approved')

  const categoryCounts: Record<string, number> = {}
  for (const b of allBusinesses ?? []) {
    if (b.category) {
      categoryCounts[b.category] = (categoryCounts[b.category] ?? 0) + 1
    }
  }

  return (
    <HomePageClient
      featuredBusinesses={featuredBusinesses ?? []}
      categoryCounts={categoryCounts}
    />
  )
}
