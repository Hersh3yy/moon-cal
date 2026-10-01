# LUNATRACK — for moon nerds

Today's moon, for where you are: phase and illumination, age, moon and sun sign, rise and set
times, the next full moon and its name, upcoming phases, distance, the next eclipses as seen
from where you are, and viewing tips — plus a blog about the moon and the people, animals and
tides that live by it.

Live at **https://lunatrack.info**.

## Run it locally

```bash
yarn install
cp .env.example .env   # then fill in the two keys
yarn dev               # http://localhost:3000
```

Build and preview a production bundle:

```bash
yarn generate
yarn preview
```

### Keys

| Variable | Service | Needed for |
|---|---|---|
| `NUXT_MOON_API_KEY` | [moon-phase on RapidAPI](https://rapidapi.com/MoonAPIcom/api/moon-phase) | every moon and sun figure on the home page |
| `NUXT_GEOCODE_API_KEY` | [geocode.maps.co](https://geocode.maps.co) | turning a typed city into coordinates, and GPS coordinates into a city name |

Both keys stay on the server: the browser only talks to this site's own `/api/*` routes. The blog
needs no key by default (Hygraph); set `NUXT_POSTS_SOURCE=vams` plus `NUXT_VAMS_API_KEY` to read
it from VAMS instead. Eclipses are computed in the browser with
[astronomy-engine](https://github.com/cosinekitty/astronomy).

## How it's built

Nuxt 3 · Vue 3 · Pinia · Tailwind · deployed on Netlify from `main`. The home page is
client-rendered (live data per visitor); the blog is prerendered at build time. Components follow
atomic design (`components/atoms`, `molecules`, `organisms`). One store (`stores/moon.ts`) holds
the moon data for the chosen location; `composables/useMoon.ts` exposes it as named values the
cards read. The moon image is a full-moon photo under an SVG shadow mask drawn from the phase.

For status, known issues, architecture and the roadmap, read [`PROJECT.md`](PROJECT.md).

## Credits

Made by [Hiren Budhrani](https://hiren.ninja) and [Anna Veerman](https://stratessa.com/).
Moon data by moon-phase (RapidAPI); eclipses by astronomy-engine. Full-moon names follow the
Old Farmer's Almanac tradition.
