import beaver from '~/assets/images/full-moon-types/beaver-moon.png'
import buck from '~/assets/images/full-moon-types/buck-moon.png'
import cold from '~/assets/images/full-moon-types/cold-moon.png'
import corn from '~/assets/images/full-moon-types/corn-moon.png'
import flower from '~/assets/images/full-moon-types/flower-moon.png'
import hunter from '~/assets/images/full-moon-types/hunter-moon.png'
import pink from '~/assets/images/full-moon-types/pink-moon.png'
import snow from '~/assets/images/full-moon-types/snow-moon.png'
import strawberry from '~/assets/images/full-moon-types/strawberry-moon.png'
import sturgeon from '~/assets/images/full-moon-types/sturgeon-moon.png'
import wolf from '~/assets/images/full-moon-types/wolf-moon.png'
import worm from '~/assets/images/full-moon-types/worm-moon.png'

export interface FullMoonKind {
  key: string
  icon: string
  /** timeanddate.com explainer page */
  url: string
}

// The API names full moons the Old Farmer's Almanac way, sometimes with a possessive
// ("Hunter's Moon"). Normalise to a key before looking anything up.
const KINDS: Record<string, { icon: string; slug: string }> = {
  wolf: { icon: wolf, slug: 'wolf' },
  snow: { icon: snow, slug: 'snow' },
  worm: { icon: worm, slug: 'worm' },
  pink: { icon: pink, slug: 'pink' },
  flower: { icon: flower, slug: 'flower' },
  strawberry: { icon: strawberry, slug: 'strawberry' },
  buck: { icon: buck, slug: 'buck' },
  sturgeon: { icon: sturgeon, slug: 'sturgeon' },
  corn: { icon: corn, slug: 'corn' },
  harvest: { icon: corn, slug: 'harvest' },
  hunter: { icon: hunter, slug: 'hunter' },
  beaver: { icon: beaver, slug: 'beaver' },
  cold: { icon: cold, slug: 'cold' },
}

export function fullMoonKey(name?: string | null): string | null {
  if (!name) return null
  return name.toLowerCase().replace(/['’]s\b/g, '').replace(/\s*moon\s*$/i, '').trim() || null
}

export function fullMoonKind(name?: string | null): FullMoonKind | null {
  const key = fullMoonKey(name)
  if (!key) return null
  const kind = KINDS[key]
  if (!kind) return null
  return { key, icon: kind.icon, url: `https://www.timeanddate.com/astronomy/moon/${kind.slug}.html` }
}
