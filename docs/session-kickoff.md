# Lunatrack — session kickoff

Paste this into a fresh Claude session on any machine. It orients the session; `PROJECT.md` carries the detail.

---

You are picking up **Lunatrack** (`moon-cal`), Hiren's moon-phase side project: tonight's moon for where you are, plus a blog. Repo `github.com/Hersh3yy/moon-cal`, live at `https://lunatrack.info`, Netlify deploys `main`. Read `PROJECT.md` first: status, run steps, issues, guide (with diagrams), hard parts, roadmap, diary. The roadmap's "near future" is the weekend launch pad; do its items in order.

**House rules**
- One branch: `main`. Commit and push straight to it. No feature branches.
- Before every push: `yarn build && npx nuxi typecheck`, both clean. After a push, check the live deploy (`curl -I https://lunatrack.info/`).
- Talk in plain words; never ask Hiren to decode roadmap ids.
- Keep the code's own words (`phase`, `stage`, `illumination`, `upcoming_phases`, `moon_sign`).
- Atomic design: new UI goes in `components/atoms`, `molecules` or `organisms`; widgets read `useMoon()` selectors, never raw API JSON. New data sources get one Nitro route under `server/api/` with a cache; the browser never calls a third party.

**Set up on a new machine**
1. `git clone git@github.com:Hersh3yy/moon-cal.git && cd moon-cal && yarn install`
2. `cp .env.example .env`, then fill `NUXT_MOON_API_KEY` (RapidAPI dashboard → moon-phase) and `NUXT_GEOCODE_API_KEY` (geocode.maps.co). The same values are in Netlify → Site configuration → Environment variables (still under the old `NUXT_PUBLIC_*` names; both names work).
3. `yarn dev` → http://localhost:3000. Production preview: `yarn build && node .output/server/index.mjs`.

**Where things are**
- UI: `components/atoms|molecules|organisms` (auto-imported by file name), `organisms/widgets/*Card.vue`, `layouts/default.vue`, `pages/`.
- State and logic: `stores/moon.ts`, `composables/useMoon.ts` (selectors), `composables/useLocation.ts` (geolocation + city search), `composables/useEclipses.ts` (astronomy-engine), `composables/useSeo.ts`.
- Server: `server/api/moon.get.ts`, `server/api/geocode/*`, `server/api/posts/*`, adapters `server/utils/posts/{hygraph,vams}.ts`, sitemap source `server/api/__sitemap__/urls.get.ts`.
- Tables and helpers: `data/zodiac.ts`, `data/fullMoons.ts`, `utils/dates.ts`, `utils/format.ts`, `types/`.
- Blog backup / VAMS import source: `content/posts/*.md`, `content/posts.json` (`yarn export:posts` refreshes them).

**Next up, in order** (details in `PROJECT.md` → Roadmap, near future): Search Console + Hygraph→Netlify build hook · NASA Dial-a-Moon image in the hero · Open-Meteo cloud cover ("will you see it tonight") · full-moon calendar pages 2026/2027 · 24-hour sky timeline + computed stats · funnel + blog polish · VAMS blog hookup · PWA. Verified free, keyless sources: NASA `https://svs.gsfc.nasa.gov/api/dialamoon/YYYY-MM-DDTHH:MM`, Open-Meteo `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&hourly=cloud_cover&timezone=auto`, NOAA Kp `https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json`.
