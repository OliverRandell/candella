export type Business = {
  id: string
  name: string
  slug: string
  suburb: string
  city: string
  state: string
  category: string
  description: string | null
  tags: string[]
  criteria: string[]
  website_url: string | null
  instagram_url: string | null
  address: string | null
  lat: number | null
  lng: number | null
  is_verified: boolean
  is_featured: boolean
  claimed_by: string | null
  claimed_at: string | null
  created_at: string
  updated_at: string
}

export type Claim = {
  id: string
  business_id: string
  email: string
  business_name: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
}

export type Criteria = {
  id: string
  name: string
  slug: string
  description: string
}