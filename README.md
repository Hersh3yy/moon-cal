# LUNATRACK — for moon nerds

Today's moon, for where you are: phase and illumination, age, moon and sun sign, rise and set
times, the next full moon and its name, and viewing tips — plus a blog about the moon and the
people, animals and tides that live by it.

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
| `NUXT_PUBLIC_MOON_API_KEY` | [moon-phase on RapidAPI](https://rapidapi.com/MoonAPIcom/api/moon-phase) | every moon and sun figure on the home page |
| `NUXT_PUBLIC_GEOCODE_API_KEY` | [geocode.maps.co](https://geocode.maps.co) | turning a typed city into coordinates, and GPS coordinates into a city name |

The blog needs no key; posts come from a Hygraph project whose public endpoint is in `nuxt.config.ts`.

## How it's built

Nuxt 3 (single-page app) · Vue 3 · Pinia · Tailwind · Apollo/GraphQL for the blog · deployed on
Netlify from `main`. One store (`stores/moon.ts`) fetches the moon data for the chosen location;
the cards on the home page read from it. The moon image is a full-moon photo under an SVG shadow
mask drawn from the phase.

For status, known issues, architecture and the roadmap, read [`PROJECT.md`](PROJECT.md).

## Credits

Made by [Hiren Budhrani](https://hiren.ninja) and [Anna Veerman](https://stratessa.com/).
Moon data by moon-phase (RapidAPI). Full-moon names follow the Old Farmer's Almanac tradition.
