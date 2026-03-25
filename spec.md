# RichieStory — Pets Rebrand & English Translation

## Current State
The platform is a rabbit collectibles marketplace with all UI text in Russian. It uses 'rabbit'/'заяц' throughout the codebase. The design uses a pastel pink/mint palette tuned for bunnies. Routes use `/rabbit/$id`, components are named `RabbitCard`, `RabbitDetail`, and backend types use `Rabbit`/`RabbitId`.

## Requested Changes (Diff)

### Add
- New pets-themed color palette — warmer, more versatile (soft amber/teal/cream instead of strict pink/mint)
- English-only UI text across all pages and components

### Modify
- All 'rabbit'/'заяц' text labels → 'pet'/'pets' in English everywhere (pages, buttons, empty states, dialogs)
- Route `/rabbit/$id` → `/pet/$id` in App.tsx
- Component `RabbitCard.tsx` → `PetCard.tsx` (rename file and component)
- Page `RabbitDetail.tsx` → `PetDetail.tsx` (rename file and component, update internal copy)
- Page `Catalog.tsx` — all Russian copy → English, replace 'rabbit' with 'pet'
- Page `Admin.tsx` — all Russian copy → English, replace 'rabbit' with 'pet', update form field labels
- Page `Auction.tsx` — all Russian copy → English
- Page `Collectors.tsx` — all Russian copy → English, replace 'зайцев' with 'pets collected'
- Page `Home.tsx` — all Russian copy → English, update steps/features, replace rabbit emojis with 🐾 or 🐶🐱 where appropriate
- Page `Dashboard.tsx` — all Russian copy → English
- Page `Profile.tsx` — all Russian copy → English
- `Header.tsx` — nav links translated, auth buttons translated
- `Footer.tsx` — all copy translated to English, update tagline
- `index.css` — update color tokens to a warmer pets-friendly palette (soft amber primary, teal accent, cream background)
- `sampleData.ts` — rename interfaces to `SamplePet`/`SampleCollector`, update field names where needed
- `data-ocid` attributes remain unchanged

### Remove
- No features removed; only rebrand and translation

## Implementation Plan
1. Update `index.css` with new pets-themed OKLCH color palette
2. Rename `RabbitCard.tsx` → `PetCard.tsx`, update component internals to English + pets terminology
3. Rename `RabbitDetail.tsx` → `PetDetail.tsx`, update all copy + route reference `/rabbit/$id` → `/pet/$id`
4. Update `App.tsx`: rename route path and component import
5. Update `sampleData.ts`: rename interfaces, ensure empty arrays remain
6. Translate and update `Home.tsx`, `Catalog.tsx`, `Auction.tsx`, `Admin.tsx`, `Collectors.tsx`, `Dashboard.tsx`, `Profile.tsx`
7. Update `Header.tsx` and `Footer.tsx`
