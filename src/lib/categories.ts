export const CATEGORIES = {
  'Cafes & Restaurants': {
    color: '#A1EDCA',
    textColor: '#0F5C3A',
    slug: 'cafes-restaurants',
  },
  'Fashion': {
    color: '#EDB1A1',
    textColor: '#6B2410',
    slug: 'fashion',
  },
  'Groceries': {
    color: '#EDA1B7',
    textColor: '#6B1030',
    slug: 'groceries',
  },
  'Home & Living': {
    color: '#D1A1ED',
    textColor: '#4A1069',
    slug: 'home-living',
  },
  'Alcohol': {
    color: '#A1D0ED',
    textColor: '#0F3C5C',
    slug: 'alcohol',
  },
  'Markets': {
    color: '#DDEDA1',
    textColor: '#3C5C0F',
    slug: 'markets',
  },
} as const

export type CategoryName = keyof typeof CATEGORIES

export function getCategoryColor(category: string): string {
  return CATEGORIES[category as CategoryName]?.color ?? '#D3D1C7'
}

export function getCategoryTextColor(category: string): string {
  return CATEGORIES[category as CategoryName]?.textColor ?? '#444441'
}