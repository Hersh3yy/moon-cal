import aries from '~/assets/images/zodiac/aries.svg'
import taurus from '~/assets/images/zodiac/taurus.svg'
import gemini from '~/assets/images/zodiac/gemini.svg'
import cancer from '~/assets/images/zodiac/cancer.svg'
import leo from '~/assets/images/zodiac/leo.svg'
import virgo from '~/assets/images/zodiac/virgo.svg'
import libra from '~/assets/images/zodiac/libra.svg'
import scorpio from '~/assets/images/zodiac/scorpio.svg'
import sagittarius from '~/assets/images/zodiac/sagittarius.svg'
import capricorn from '~/assets/images/zodiac/capricorn.svg'
import aquarius from '~/assets/images/zodiac/aquarius.svg'
import pisces from '~/assets/images/zodiac/pisces.svg'

export interface ZodiacSign {
  name: string
  symbol: string
  icon: string
  sunDates: string
  /** What the sign means for the Sun (identity). */
  sunDescription: string
  /** What the sign means for the Moon (feeling). The Moon changes sign every ~2.3 days. */
  moonDescription: string
}

const SIGNS: ZodiacSign[] = [
  { name: 'Aries', symbol: '♈', icon: aries, sunDates: '21 Mar – 19 Apr', sunDescription: 'The first sign of the zodiac, ruled by Mars', moonDescription: 'Emotionally dynamic and instinctively courageous' },
  { name: 'Taurus', symbol: '♉', icon: taurus, sunDates: '20 Apr – 20 May', sunDescription: 'The fixed earth sign, ruled by Venus', moonDescription: 'Emotional security through material comfort and stability' },
  { name: 'Gemini', symbol: '♊', icon: gemini, sunDates: '21 May – 20 Jun', sunDescription: 'The mutable air sign, ruled by Mercury', moonDescription: 'Processes feelings through communication and curiosity' },
  { name: 'Cancer', symbol: '♋', icon: cancer, sunDates: '21 Jun – 22 Jul', sunDescription: 'The cardinal water sign, ruled by the Moon', moonDescription: 'Deeply intuitive with strong emotional memory' },
  { name: 'Leo', symbol: '♌', icon: leo, sunDates: '23 Jul – 22 Aug', sunDescription: 'The fixed fire sign, ruled by the Sun', moonDescription: 'Expresses emotions with warmth and dramatic flair' },
  { name: 'Virgo', symbol: '♍', icon: virgo, sunDates: '23 Aug – 22 Sep', sunDescription: 'The mutable earth sign, ruled by Mercury', moonDescription: 'Processes emotions through practical analysis' },
  { name: 'Libra', symbol: '♎', icon: libra, sunDates: '23 Sep – 22 Oct', sunDescription: 'The cardinal air sign, ruled by Venus', moonDescription: 'Seeks emotional harmony and balance in relationships' },
  { name: 'Scorpio', symbol: '♏', icon: scorpio, sunDates: '23 Oct – 21 Nov', sunDescription: 'The fixed water sign, ruled by Pluto', moonDescription: 'Deep emotional intensity and psychological insight' },
  { name: 'Sagittarius', symbol: '♐', icon: sagittarius, sunDates: '22 Nov – 21 Dec', sunDescription: 'The mutable fire sign, ruled by Jupiter', moonDescription: 'Emotional freedom through exploration and growth' },
  { name: 'Capricorn', symbol: '♑', icon: capricorn, sunDates: '22 Dec – 19 Jan', sunDescription: 'The cardinal earth sign, ruled by Saturn', moonDescription: 'Emotional restraint with deep inner security' },
  { name: 'Aquarius', symbol: '♒', icon: aquarius, sunDates: '20 Jan – 18 Feb', sunDescription: 'The fixed air sign, ruled by Uranus', moonDescription: 'Processes feelings through intellectual understanding' },
  { name: 'Pisces', symbol: '♓', icon: pisces, sunDates: '19 Feb – 20 Mar', sunDescription: 'The mutable water sign, ruled by Neptune', moonDescription: 'Highly empathetic with flowing emotional awareness' },
]

export const ZODIAC: Record<string, ZodiacSign> = Object.fromEntries(SIGNS.map((s) => [s.name, s]))

export function zodiacSign(name?: string | null): ZodiacSign | null {
  if (!name) return null
  return ZODIAC[name] ?? null
}
