/**
 * The sustainability criteria Candella uses to assess businesses for inclusion.
 *
 * Single source of truth. Used by:
 * - The /about page (rendered as the criteria glossary)
 * - The browse page filter chips (CRITERIA_OPTIONS pulls from here)
 * - Future per-business credentials (when business.criteria is populated,
 *   each string resolves back to one of these entries)
 *
 * The `framing` field is the editorial "doesn't mean..." or clarifying note
 * that appears beneath the definition. It's the part that makes the page
 * feel honest rather than promotional.
 */

export type Criterion = {
  /** Display name. Matches strings used in business.criteria column. */
  name: string
  /** URL-safe identifier. Stable across renames. */
  slug: string
  /** Plain-language definition. */
  definition: string
  /** Editorial framing — the "doesn't mean..." line or clarifying note. */
  framing?: string
}

export const CRITERIA: Criterion[] = [
  {
    name: 'Locally Made',
    slug: 'locally-made',
    definition:
      'Made in Melbourne or Victoria, with the production happening within Australia. Materials may still be sourced internationally, but the design, manufacturing, or assembly happens close to home. Look for this when you want to support local industry and reduce shipping emissions.',
    framing:
      'Doesn\u2019t mean every input is Australian \u2014 it means the making is.',
  },
  {
    name: 'Organic',
    slug: 'organic',
    definition:
      'Uses ingredients or materials grown without synthetic pesticides, herbicides, or fertilisers. For food, this often means certified organic by ACO (Australian Certified Organic) or NASAA. For textiles, this typically means GOTS certification or organic cotton sourcing.',
    framing:
      'Doesn\u2019t always mean fully certified \u2014 some smaller producers operate to organic standards without paying for certification. Where this is the case, the listing will say so.',
  },
  {
    name: 'Fair Labour',
    slug: 'fair-labour',
    definition:
      'Pays workers a living wage and operates in transparent, safe conditions. For Australian-made products, this often means Ethical Clothing Australia accreditation. For internationally-made products, this means Fairtrade certification, B Corp accreditation, or transparent supplier auditing.',
    framing:
      'Doesn\u2019t mean cheap \u2014 fair labour costs more, and the price reflects that.',
  },
  {
    name: 'Plastic-Free / Low-Waste',
    slug: 'plastic-free-low-waste',
    definition:
      'Operates with minimal single-use plastic. This includes bring-your-own-container shops, bulk food stores, businesses that have phased out plastic packaging, and producers using compostable or reusable alternatives.',
    framing:
      'Doesn\u2019t always mean zero plastic \u2014 it means a real, ongoing effort to reduce or eliminate it.',
  },
  {
    name: 'Secondhand / Circular',
    slug: 'secondhand-circular',
    definition:
      'Sells preloved, vintage, or upcycled goods. Includes consignment stores, vintage boutiques, charity shops, and businesses that take returns for repair or resale.',
    framing:
      'The most reliably sustainable purchase is one that already exists.',
  },
  {
    name: 'Vegan',
    slug: 'vegan',
    definition:
      'No animal products in the goods sold. For food, this means fully plant-based menus or product ranges. For fashion, this means no leather, wool, silk, fur, or animal-derived dyes.',
    framing:
      'Vegan doesn\u2019t automatically mean low-impact \u2014 a vegan polyester jacket isn\u2019t sustainable. And vegan doesn\u2019t mean cruelty-free; some vegan products are still tested on animals. Look for vegan combined with other criteria like cruelty-free or fair labour.',
  },
  {
    name: 'Cruelty Free',
    slug: 'cruelty-free',
    definition:
      'No animal testing in the production of any goods sold. For beauty and personal care, this often means Choose Cruelty Free or Leaping Bunny certification. For fashion and homewares, it means materials and dyes that haven\u2019t been tested on animals.',
    framing:
      'Different from vegan \u2014 a business can be cruelty-free and still sell leather, or vegan and still test on animals. Look for both if both matter to you.',
  },
  {
    name: 'Female Founded',
    slug: 'female-founded',
    definition:
      'Founded by, or co-founded by, women. Listed when the founder publicly identifies as such. This isn\u2019t environmental sustainability \u2014 it\u2019s a different kind of ethics, and we list it for the same reason we list everything else: where your money goes matters.',
    framing:
      'Doesn\u2019t mean perfect on every other axis \u2014 it means one specific thing about who built the business.',
  },
  {
    name: 'Carbon-Aware',
    slug: 'carbon-aware',
    definition:
      'Measures, reports on, or actively reduces its carbon footprint. This often means certifications like Climate Active (Australian government-backed carbon-neutral certification) or B Corp. May include businesses powered by renewable energy or with verified offset programs.',
    framing:
      'Doesn\u2019t mean carbon-neutral by default \u2014 it means the business is doing the measurement and the work.',
  },
  {
    name: 'B Corp',
    slug: 'b-corp',
    definition:
      'Certified by B Lab as meeting verified standards of social and environmental performance, public transparency, and legal accountability. B Corp is a rigorous third-party certification, not a self-declared label.',
    framing:
      'One of the most reliable signals on this list.',
  },
  {
    name: 'Indigenous-Owned',
    slug: 'indigenous-owned',
    definition:
      'Owned and operated by Aboriginal or Torres Strait Islander people. Listed when the business publicly identifies as such. We don\u2019t infer this \u2014 we go by what the business tells us.',
  },
  {
    name: 'Social Enterprise',
    slug: 'social-enterprise',
    definition:
      'A business with a social mission baked into its operations \u2014 typically reinvesting profits into a cause, employing marginalised communities, or operating as a registered not-for-profit. Examples include businesses training young people experiencing homelessness, refugee employment programs, or community co-ops.',
  },
]

export const CRITERIA_BY_NAME: Record<string, Criterion> = Object.fromEntries(
  CRITERIA.map(c => [c.name, c])
)

/** Names only — useful for the filter chip list and select dropdowns. */
export const CRITERIA_NAMES: string[] = CRITERIA.map(c => c.name)

export function getCriterion(name: string): Criterion | undefined {
  return CRITERIA_BY_NAME[name]
}
