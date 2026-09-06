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
**Status** · 🟡 rough — the concept works and the moon **API data is good**; the bad data you see is the **display layer** (wrong moon image, moon-sign shown with sun-sign date ranges, raw/timezone-wrong times). No local astronomy, so nothing is unfixable.
**Repo** · `koala/moon-cal` · on `main` (make a renewal branch before any code fix; merge to `main` only when sure)
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

## Roadmap — near future

- [ ] Fix the moon image: correct the end-of-cycle inversion and draw the terminator from illumination %, or swap to a phase-indexed image set (the README's "accurate moon images for each day") <!-- id:n1 -->
- [ ] Fix MoonSign to stop showing sun-sign date ranges (drop the month span, or show the ~2-day moon transit) <!-- id:n2 -->
- [ ] Format sun/moon rise-set times as local clock time in the selected location's timezone <!-- id:n3 -->
- [ ] Fix date rendering: no 1970 fallback, parse date-only strings without the UTC off-by-one, show the location's day not the viewer's <!-- id:n4 -->
- [ ] Replace the `lastIndexOf('}}')` truncation with `response.json()`; surface the missing-field warning instead of swallowing it <!-- id:n5 -->

## Roadmap — far future

- [ ] Remove dead code: `stores/posts.ts`, `DebugInfo.vue`, `ModeToggle.vue` (or wire the Science/Astrology toggle), the duplicate `useMoonImage.ts`, the second header <!-- id:f1 -->
- [ ] Sanitize blog `v-html` (XSS) <!-- id:f2 -->
- [ ] Auto-detect location on first load (currently hard-defaults to Amsterdam) <!-- id:f3 -->
- [ ] Document the required API keys in `.env.example` <!-- id:f4 -->
- [ ] Decide SPA vs SSR for blog SEO (global `ssr:false` defeats the per-page `ssr:true`) <!-- id:f5 -->
- [ ] 3D moon render, favicon/title, i18n (README TODOs) <!-- id:f6 -->

---

## Diary

### 2026-09-06 — first cockpit + grounded audit
- Audited the whole app and **called the live moon API** to check the "bad data" complaint. Finding: the API data is correct; the bad data is the display layer (moon image inversion, moon-sign showing sun-sign ranges, raw/timezone-wrong times/dates).
- Corrected the audit's headline: the JSON-truncation hack is latent, not currently losing data (this response ends `}}}}`).
- No code changed — assessment only, pending green light. Roadmap leads with the three visible bugs.
