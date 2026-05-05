import { createClient } from '@/lib/supabase/server'
import { Business } from '@/lib/types'

/**
 * Fetch related businesses to display on a detail page.
 *
 * Strategy: same suburb, any category, exclude the current business,
 * cap at `limit`. Returns an empty array on error or if the current
 * business has no suburb. Order favours verified listings.
 *
 * The current logic is intentionally simple. We can enrich later (mix
 * in a "discover something different" entry, weight by recency, etc.)
 * but for the current 146-business dataset, suburb proximity is the
 * most useful signal and the cheapest to compute.
 */
export async function getRelatedBusinesses(
  currentBusiness: Pick<Business, 'id' | 'suburb'>,
  limit = 3
): Promise<Business[]> {
  if (!currentBusiness.suburb) return []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('status', 'approved')
    .eq('suburb', currentBusiness.suburb)
    .neq('id', currentBusiness.id)
    .order('is_verified', { ascending: false })
    .order('is_featured', { ascending: false })
    .order('name')
    .limit(limit)

    if (error || !data) return []
    return data as Business[]
  } catch {
    return []
  }
}
