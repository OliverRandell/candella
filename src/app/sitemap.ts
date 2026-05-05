import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: businesses } = await supabase
  .from('businesses')
  .select('slug, updated_at')
  .eq('status', 'approved')

  const { data: suburbs } = await supabase
  .from('businesses')
  .select('suburb')
  .eq('status', 'approved')

  const uniqueSuburbs = Array.from(
    new Set((suburbs ?? []).map(b => b.suburb).filter(Boolean))
  ) as string[]

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://candella-six.vercel.app'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/businesses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/claim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const businessPages: MetadataRoute.Sitemap = (businesses ?? []).map(business => ({
    url: `${baseUrl}/businesses/${business.slug}`,
    lastModified: new Date(business.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const suburbPages: MetadataRoute.Sitemap = uniqueSuburbs.map(suburb => ({
    url: `${baseUrl}/suburb/${suburb.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const categoryPages: MetadataRoute.Sitemap = [
    'cafes-restaurants',
    'fashion',
    'groceries',
    'home-living',
    'alcohol',
    'markets',
  ].map(slug => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...businessPages,
    ...suburbPages,
    ...categoryPages,
  ]
}