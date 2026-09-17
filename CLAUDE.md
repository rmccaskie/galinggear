# Galing Gear — AI Assistant Rules

Rules for any AI assistant (Claude, Gemini, GPT, Copilot, etc.) working on this project.

## Language

- **British spelling** everywhere in user-visible content and documentation.
  `colour`, `favourite`, `organisation`, `realise`, `honour`, `centre`, `recognise`.
  American spelling is a bug, not a style choice.
- Code identifiers and filenames use conventional casing (`camelCase`, `kebab-case`) — spelling does not apply there.

## CSS

- **Logical properties only.** Never `margin-left`, `padding-right`, `border-left`, etc.
  Use `margin-inline-start`, `padding-inline-end`, `border-inline-start` and so on.
- **No raw hex values in component CSS.** Use `var(--job-name)` tokens only.
  Raw hex lives exclusively in `src/styles/tokens.css`.
- **`--orange-600` (`#E2620E`) is fill-only.** It fails WCAG AA as text (contrast 3.11:1 on white).
  Never use it as a text colour. Every usage must carry the comment `/* fill-only — not text */`.
- Do not add utility-class frameworks (Tailwind, UnoCSS, etc.). Plain CSS + custom properties only.
- Inline styles are forbidden.

## Colour tokens

Two-layer system. Markup references job names, never palette names.

### Palette layer (`--clay-*`, `--teal-*`, etc.)
Defined once in `:root` inside `tokens.css`. Do not add new palette entries without a clear reason.

### Job-name layer
```
--page-background   --surface           --surface-sunken
--main-text         --muted-text        --hairline
--accent-text       --accent-fill       --on-accent-fill
--focus-ring
--status-error      --status-caution    --status-success
```
`status-*` tokens are for real status communication (success, warning, error) — never decorative.

## Typography

- `--font-display`: Fraunces — display headings, pulled quotes only.
- `--font-body`: Inter — body copy, UI labels, navigation.
- `--font-mono`: JetBrains Mono — prices, product labels, inline code.
- Body floor: 17 px on small screens, 18 px on large.
- Prose cap: `--measure` (66 ch).
- `text-wrap: balance` on all headings.
- Fluid sizing via `clamp()`. Do not add fixed font sizes without a strong reason.

## Scenarios (the 7 content categories)

| Label | Slug |
|---|---|
| Typhoon Season | `typhoon-season` |
| Earthquake Ready | `earthquake-ready` |
| Power Outage | `power-outage` |
| Go-Bag | `go-bag` |
| Off Grid | `off-grid` |
| First Aid | `first-aid` |
| EDC | `edc` |

The enum is defined in `src/content.config.ts`. Do not add or remove scenarios without updating both the schema and `src/lib/scenarios.ts`.

## Supabase

- Use the **anon client** only (`SUPABASE_URL` + `SUPABASE_ANON_KEY`).
- RLS is enabled on the `subscribers` table. Anon users have INSERT only — no SELECT, UPDATE, or DELETE.
- **Never log field values.** Log event types and timestamps only.
- Do not expose a service-role key anywhere in this codebase.

## API route (`/api/subscribe`)

- Returns **codes**, not sentences: `"duplicate"`, `"validation"`, `"server_error"`.
- Progressive enhancement: a plain form POST (no JS) gets a redirect to `/subscribe?status=…`.
- Server logs: event type + timestamp only. Never `name` or `email` values.

## Environment variables

- `.env` is gitignored. `.env.example` is committed with empty values.
- All `PUBLIC_*` vars are safe for client use. No server secrets in this phase.
- See `docs/CLOUDFLARE.md` for the variables Cloudflare Pages must have.

## Accessibility

- Focus ring: 3 px solid `var(--focus-ring)`, 3 px offset, on every interactive element.
- `prefers-reduced-motion`: disable or reduce all animations.
- `aria-live="polite"` on all status/validation message regions.
- Hamburger must have `aria-expanded` and `aria-controls`.
- Colour alone must never be the only indicator of state.

## Content voice

First-person, tested-it-myself, honest. Not survival fantasy. Philippine conditions, weather and shopping context throughout. British spelling.
