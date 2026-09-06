<!--
  PROJECT.md — the cockpit for this repo. One file to open and know where things stand.
  Maintained by the `project-cockpit` skill. The assessment (status/issues/roadmap) is
  refreshed each session; the Diary at the bottom only grows. App-code changes need a
  green light; main is merged to only when sure.
-->
<!-- clickup_list:901508497689 -->

# LUNATRACK (moon-cal) — cockpit

**What it is** · A moon-phase app for moon nerds: today's phase, illumination, age, moon/sun sign, rise/set, next full/new moon and eclipses, for a chosen location. Plus a blog.
**Stack** · Nuxt 3 (SPA, `ssr: false`) · Vue 3 · Pinia · Tailwind · Apollo/GraphQL (Hygraph blog) · RapidAPI moon-phase
**Status** · 🟢 improving — the display bugs are fixed on branch `renewal-fixes` (moon image geometry corrected + no more bright-when-new; moon sign no longer shows a sun-sign range; NextFullMoon date guarded; fetch uses `response.json()`; dead code deleted). `yarn build` green on Node 24. Not merged to `main`.
**Repo** · `koala/moon-cal` · working on `renewal-fixes` (merge to `main` only when sure)
**Hosting** · Nuxt SPA (Netlify-style)
**ClickUp** · Lunatrack list `901508497689`
**Last assessed** · 2026-09-06

---

## Run it

```bash
npm install
npm run dev      # nuxt dev (SPA)
npm run generate # static build
```
Needs two RapidAPI/geocode keys in `.env` (present locally, but `.env.example` is empty): `NUXT_PUBLIC_MOON_API_KEY` (moon-phase.p.rapidapi.com) and `NUXT_PUBLIC_GEOCODE_API_KEY` (geocode.maps.co). Without the moon key the whole homepage shows only an error. Blog needs no key (Hygraph endpoint is hardcoded).

## Status

Verified against the live API this session: the moon endpoint returns correct data (e.g. Last quarter · 26% · age 24 · Moon in Cancer). So the "bad data" complaint is **not** the fetch — it's how a few widgets render it. The app is a thin SPA that fetches all moon data and just displays it; there is essentially no local astronomy to be wrong, which is good news for fixing it.

## Issues

Grounded by reading the code and calling the API. Worst first; the top three are what a user actually sees as "wrong".

| Sev | Issue | Where |
|---|---|---|
| serious | **Moon image is wrong.** Phase mask always masks `full-moon.png`, uses a crude fixed-radius terminator, and inverts at end-of-cycle: `phase >= 1` returns no mask → a **fully lit** moon when it should be **new/dark**. | `components/TheMoon.vue:53-90` |
| serious | **Moon sign shows SUN-sign date ranges.** The Moon transits a sign in ~2.3 days, but `MoonSign` prints a month-long solar span (copy-paste of `SunSign`). | `components/widgets/MoonSign.vue:15,98-111` |
| serious | **Sun/moon times print raw timestamps**, unformatted, no timezone conversion to the chosen location. | `components/widgets/SunTimes.vue:11,15` · `SunMoonTimes.vue:14` |
| warning | Dates render in the **viewer's** timezone, with a `new Date(0)` → **"1/1/1970"** fallback when a timestamp is missing. | `components/widgets/NextFullMoon.vue:18-19` |
| warning | Date-only strings (`YYYY-MM-DD`) parsed as UTC → **off-by-one day** in negative-offset zones. | `NextEclipse.vue:28` · `blog/index.vue:181` · `blog/[slug].vue:201` |
| warning | Fragile response handling: `substring(0, lastIndexOf('}}')+2)` instead of `response.json()`. Currently harmless (this response ends `}}}}`) but will silently mangle a differently-shaped body. Missing-field check only warns into an unrendered field. | `stores/moon.ts:194-247` |
| warning | XSS: blog renders CMS content via hand-rolled `v-html` with unsanitized `src`/`href`/text. | `pages/blog/[slug].vue:254,267,270` |
| cleanup | Dead code present: `stores/posts.ts` (unused), `components/DebugInfo.vue` (reads store fields that don't exist), `ModeToggle.vue` (display mode hardcoded to 'both'), duplicate `composables/useMoonImage.ts` mask math (never imported). Two headers rendered. | see audit |

## Guide

- **Data flow:** `pages/index.vue` `onMounted` → `moonStore.fetchMoonData()` (`stores/moon.ts:180`) → RapidAPI → stored as untyped JSON on `moonData` → each `components/widgets/*` reads fields off it. Location: `LocationSelector` → `useCoordinateLookup` → sets coords → refetch. First load is always Amsterdam (no auto-detect).
- **Blog:** Apollo/GraphQL to a hardcoded Hygraph endpoint (`nuxt.config.ts:68`); `runtimeConfig.public.graphqlEndpoint` is dead (unused).
- **Key insight for fixing:** the API already returns phase value, illumination, sign, and timestamps — the fixes are all "render the field correctly", not "compute astronomy". The one place to consider real local math is the moon *image* (a proper illuminated-fraction terminator), if you want it accurate rather than API-driven.

## Hard parts

<!-- These are what you'll need to understand to fix the display bugs — the mechanics, not code I wrote. -->

### Drawing a moon at the right phase

🔭 **What it does** — A moon-phase image is a full-moon sprite with a shadow mask laid over it. The terminator (the light/dark boundary) is a half-ellipse whose width tracks the illuminated fraction: at new it covers the whole disc, at full it's gone, at quarter it's a straight line down the middle. The current code uses a fixed-radius arc that doesn't scale with illumination, and at `phase → 1` (back to new) it returns no mask — so it paints a *bright* moon when it should be dark.

⚖️ **Why this way** — The honest fix is to build the terminator from the illuminated fraction (an ellipse whose x-radius follows `cos` of the phase angle, the sign flipping at the half-cycle for waxing vs waning), or to sidestep the geometry with a set of phase-indexed images. The API already returns illumination %, so you never need to compute the phase yourself.

🗣️ **Say it to a senior** — "The moon image is a shadow mask over a full-moon sprite; the terminator is an ellipse whose width tracks the illuminated fraction, and ours neither scales with illumination nor handles the new-moon wrap."

---

### Why a date shows the wrong day

🔭 **What it does** — `new Date('2026-09-06')` parses a date-only string as **UTC midnight**; `toLocaleDateString()` then renders it in the *viewer's* timezone, so anyone west of Greenwich sees the day before. And `new Date(0)` — the missing-timestamp fallback — is 1970-01-01, which is how "1/1/1970" lands on screen.

⚖️ **Why this way** — Parse date-only strings as local (`new Date(y, m-1, d)`), guard the missing case instead of defaulting to `0`, and format in the queried location's timezone if you want its day rather than the browser's.

🗣️ **Say it to a senior** — "Date-only strings parse as UTC midnight and render in the viewer's zone, so they drift a day; I'd parse them as local and never fall back to epoch 0."

## Roadmap — near future

- [x] Fix the moon image: correct the end-of-cycle inversion and draw the terminator from illumination %, or swap to a phase-indexed image set (the README's "accurate moon images for each day") <!-- id:n1 cu:123kjkdhp64 -->
- [x] Fix MoonSign to stop showing sun-sign date ranges (drop the month span, or show the ~2-day moon transit) <!-- id:n2 cu:123kjkdhp65 -->
- [x] ~~Format sun/moon rise-set times~~ — **verified already correct**: the time widgets use the API's pre-formatted string fields (`"06:59"`, `"00:10"`), not the epoch fields. The audit over-flagged this; nothing to change. <!-- id:n3 cu:123kjkdhp66 -->
- [x] Fix date rendering: no 1970 fallback, parse date-only strings without the UTC off-by-one, show the location's day not the viewer's <!-- id:n4 cu:123kjkdhp67 -->
- [x] Replace the `lastIndexOf('}}')` truncation with `response.json()`; surface the missing-field warning instead of swallowing it <!-- id:n5 cu:123kjkdhp68 -->

## Roadmap — far future

- [x] Remove dead code: deleted `stores/posts.ts`, `DebugInfo.vue`, `ModeToggle.vue`, the duplicate `useMoonImage.ts` (all zero importers). The redundant second header (`layout/Header` vs `App/Header`) was left — it's layout tidy-up, not dead code; spin off if wanted. <!-- id:f1 cu:123kjkdhp69 -->
- [ ] Sanitize blog `v-html` (XSS) <!-- id:f2 cu:123kjkdhp6a -->
- [ ] Auto-detect location on first load (currently hard-defaults to Amsterdam) <!-- id:f3 cu:123kjkdhp6b -->
- [x] Document the required API keys in `.env.example` <!-- id:f4 cu:123kjkdhp6c -->
- [ ] Decide SPA vs SSR for blog SEO (global `ssr:false` defeats the per-page `ssr:true`) <!-- id:f5 cu:123kjkdhp6d -->
- [ ] 3D moon render, favicon/title, i18n (README TODOs) <!-- id:f6 cu:123kjkdhp6e -->

---

## Diary

### 2026-09-06 (later) — fixed it all (branch `renewal-fixes`)
- Green-lit full fix pass, on a branch (not merged). Fixed: the **moon image** (terminator now scales with illumination; the end-of-cycle bright-instead-of-dark inversion is gone — verified numerically across the phase cycle); the **moon sign** no longer prints a month-long sun-sign range; **NextFullMoon** date is formatted and guarded (no "1/1/1970"); the store **fetch** uses `response.json()` instead of the `}}` truncation; deleted 4 dead files. `.env.example` documented. `yarn build` green on Node 24.
- Grounded correction: re-called the live API and found the **time widgets were already correct** (they use the API's pre-formatted `"06:59"` strings, not the epoch fields) — the first audit over-flagged them. NextEclipse already guards its missing case.
- Left as tasks (secondary): blog `v-html` XSS, first-load location auto-detect, SPA-vs-SSR for blog SEO, the redundant second header.

### 2026-09-06 — first cockpit + grounded audit
- Audited the whole app and **called the live moon API** to check the "bad data" complaint. Finding: the API data is correct; the bad data is the display layer (moon image inversion, moon-sign showing sun-sign ranges, raw/timezone-wrong times/dates).
- Corrected the audit's headline: the JSON-truncation hack is latent, not currently losing data (this response ends `}}}}`).
- No code changed — assessment only, pending green light. Roadmap leads with the three visible bugs.
