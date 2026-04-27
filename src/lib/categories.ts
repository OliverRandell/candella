export const CATEGORIES = {
  'Cafes & Restaurants': {
    color: '#A1EDCA',
    textColor: '#0F5C3A',
    slug: 'cafes-restaurants',
    iconPath: '/icons/category/icon-cafesRestaurants.svg',
  },
  'Fashion': {
    color: '#EDB1A1',
    textColor: '#6B2410',
    slug: 'fashion',
    iconPath: '/icons/category/icon-clothing.svg',
  },
  'Groceries': {
    color: '#EDA1B7',
    textColor: '#6B1030',
    slug: 'groceries',
    iconPath: '/icons/category/icon-groceries.svg',
  },
  'Home & Living': {
    color: '#D1A1ED',
    textColor: '#4A1069',
    slug: 'home-living',
    iconPath: '/icons/category/icon-homeLiving.svg',
  },
  'Alcohol': {
    color: '#A1D0ED',
    textColor: '#0F3C5C',
    slug: 'alcohol',
    iconPath: '/icons/category/icon-alcohol.svg',
  },
  'Markets': {
    color: '#DDEDA1',
    textColor: '#3C5C0F',
    slug: 'markets',
    iconPath: '/icons/category/icon-market.svg',
  },
} as const

export type CategoryName = keyof typeof CATEGORIES

/**
 * The canonical list of categories, in display order. Use this anywhere you
 * need to iterate (homepage tiles, filter dropdown, etc.) so the order is
 * consistent across the app.
 */
export const CATEGORY_NAMES = Object.keys(CATEGORIES) as CategoryName[]

export function getCategoryColor(category: string): string {
  return CATEGORIES[category as CategoryName]?.color ?? '#D3D1C7'
}

export function getCategoryTextColor(category: string): string {
  return CATEGORIES[category as CategoryName]?.textColor ?? '#444441'
}

export function getCategoryIconPath(category: string): string | null {
  return CATEGORIES[category as CategoryName]?.iconPath ?? null
}