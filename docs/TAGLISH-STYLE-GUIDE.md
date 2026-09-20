# Taglish Chrome Style Guide — Galing Gear

> **Purpose:** This guide governs how every string in the Taglish chrome catalogue
> (`src/lib/catalogues/taglish.ts`) is written. It exists to satisfy **safeguard 1**
> (§10.1 of the governing internationalisation standard): *"The style guide is written
> first, not last."* A model or translator without a spec drifts batch to batch; three
> batches in, the only record of the sentence shape is the strings themselves.
>
> **Audience:** The human reviewer (D-review-chrome), and any AI model used to produce
> initial Taglish drafts. Both must follow every rule below.
>
> **Scope:** Track 1 site chrome only — nav, buttons, labels, headings, form messages,
> empty states, error messages, footer, page-level copy. Track 2 content (articles,
> rail-card body copy, image captions/alt) has its own generation prompt and is governed
> separately.

---

## 1. What Taglish is (and is not)

Taglish is **English–Tagalog code-switching** — the way educated Filipinos actually speak
and text every day. It is *not* formal Tagalog, and it is *not* English with one Tagalog
word sprinkled in.

The register we target is **casual-informed**: the voice of a trusted friend who happens
to know a lot about emergency preparedness. Think neighbourhood kuya or ate who spent
time abroad and came home — comfortable in both languages, switches naturally, never
showboating in either.

**It is explicitly NOT:**
- Pure Tagalog (formal or colloquial)
- Academic Filipino
- Jejemon or heavy SMS-speak
- English with a single Tagalog particle appended

---

## 2. Register and tone

| Dimension | Rule |
|---|---|
| **Formality** | Casual but competent. Emergency-preparedness content carries life-safety weight — never flippant, never bureaucratic. |
| **Pronouns** | Use **"ka"** / **"mo"** (2nd person singular, casual). Never **"kayo"** / **"ninyo"** (formal/plural) for a single reader — it reads like a government notice. Never **"po"** / **"opo"** — that is an honorific register the brand voice does not use. |
| **Sentence structure** | Let the code-switch happen at clause boundaries, not mid-word. A natural Taglish sentence often starts one language and finishes in the other — that is fine. |
| **Sentence length** | Match the English source length. Do not pad with filler words to sound more Filipino. |
| **Contractions** | Fine in both languages: "don't", "'di" (for "hindi"), "'yung" (for "iyong"). |
| **Exclamation marks** | One per string maximum. None in error messages. |

---

## 3. Glossary — terms that stay English

These terms are **never translated**. They are either technical vocabulary the audience
knows in English, or brand/product terms that must match across both locales.

### 3.1 Brand & product

| Term | Reason |
|---|---|
| Galing Gear | Brand name |
| Subscribe / Unsubscribe | Product action — matches the button, the email, and the URL |
| Archive | Section name — matches the URL slug |
| Email | Universal; "e-liham" is not used in practice |

### 3.2 Emergency preparedness & gear

| Term | Reason |
|---|---|
| Gear | Central brand term; no single Tagalog equivalent covers the same range |
| Guide / Review | Article types; match the URL and the card labels |
| Scenario | Section name; "senaryo" exists but the site navigation uses the English |
| Brownout | Already borrowed into Philippine English and Tagalog |
| Typhoon | Standard meteorological term used across Philippine media |
| Flood / Earthquake | Standard terms; Tagalog equivalents ("baha", "lindol") are acceptable in flowing prose but the catalogue labels keep English for consistency with headings |

### 3.3 UI / web

| Term | Reason |
|---|---|
| Home | Navigation label |
| Error 404 | Technical; universal |
| Dark theme / Light theme | UI convention |

---

## 4. Glossary — terms that go Tagalog (or Taglish)

These terms **should** be in Tagalog/Taglish, not left in English, because the audience
expects them and they read more naturally in the target register.

| English source | Taglish equivalent | Notes |
|---|---|---|
| Read more / Read the review / Read the guide | "Basahin…" or "Tingnan…" | Natural call-to-action in Taglish |
| Join the list | "Sumali sa list" or "Mag-sign up" | Hybrid; "list" stays English |
| Back to home | "Bumalik sa home" | Hybrid |
| Nothing here yet | "Wala pang laman dito" or equivalent | Natural |
| Check back soon | "Balik ka ulit" | Casual |
| Your name | "Pangalan mo" | |
| Sending… | "Nagse-send…" | Taglish verb form (mag- prefix + English root) |
| Something went wrong | "May problema" or "Nagka-error" | |
| On this page | "Nasa page na 'to" | Casual Taglish |
| Published / Updated | "Na-publish" / "Na-update" | Taglish verb forms |
| Our pick | "Pick namin" or "Top pick namin" | |
| Where to buy | "Saan bibilhin" or "Where to buy" | Either is natural; be consistent |
| Browse the archive | "Tingnan ang archive" | |

> **§10.2 note:** This glossary marks *alignments* where the same concept appears in
> multiple places (e.g. "Subscribe" in the nav, the form button, and the page heading).
> Those must use the same Tagalog/Taglish phrasing everywhere, or the inconsistency
> reads as unproofread. The reviewer must check cross-references.

---

## 5. Glossary — uncertain rows (questions for the reviewer)

Per §10.2: *"Flag genuine questions as questions."* These are defensible either way;
only a native ear can settle them.

| Term | Option A | Option B | Question |
|---|---|---|---|
| "Editor's pick" | "Editor's pick" (keep English) | "Pick ng editor" | Does the English phrase feel natural enough in a Taglish context, or does it need localising? |
| "Also featured" | "Also featured" | "Featured din" | Same question — is the English already Taglish-natural here? |
| "Sponsored" / "Advertisement" | Keep English | "Bayad na ad" / "Ad" | Advertising terms — does the audience expect English or would Taglish feel more honest? |
| "Current" (article status) | "Current" | "Updated" / "Bago pa" | The English "Current" as a status badge — clear enough, or needs a Taglish equivalent? |

---

## 6. Formatting rules

| Rule | Detail |
|---|---|
| **Placeholders** | Preserve every `{placeholder}` exactly. Do not translate the placeholder name. Do not split a sentence around a placeholder — the whole sentence is one string. |
| **Plurals** | English plurals in the catalogue use `plural.article` / `plural.articles` etc. Tagalog does not inflect for number — if a Taglish string needs a plural noun, use `mga` + singular or keep the English plural as-is (both are natural in Taglish). The `plural.*` keys may map singular and plural to the same word if appropriate. |
| **Numbers** | Always use `{count}`, `{total}` etc. — never write out numbers in words. |
| **Arrows** | Preserve trailing ` →` on call-to-action strings (e.g. `'Read more →'`). |
| **Ellipsis** | Use `…` (single character), not three dots. |
| **Quotes** | Use curly quotes (‘ ’ / “ ”), not straight quotes. |
| **British spelling** | Any English that remains in a Taglish string keeps **British spelling** (colour, defence, organised). This is a brand-wide rule (ADR-007). |
| **Em dash** | Use `—` (em dash), not `--` or `–`. |
| **No trailing full stop on labels/buttons** | Buttons, nav items, and short labels do not end with a full stop. Longer prose strings (blurbs, descriptions) do. |

---

## 7. Constraints — what a Taglish string must never do

1. **Never invent content.** The Taglish string expresses the same meaning as the English
   source. It does not add information, opinions, or claims that are not in the source.
2. **Never drop a placeholder.** Every `{name}` in the English source must appear in the
   Taglish string.
3. **Never translate brand names** (“Galing Gear”), product names, or URL-derived terms
   (“Archive”, “Scenario” as section names).
4. **Never use “po” / “opo” / “ho”.** The brand voice is casual-informed, not
   formal/honorific.
5. **Never use deep Tagalog** (literary/archaic vocabulary). If a term would send the
   reader to a dictionary, use the English word instead.
6. **Never mix registers within a single string.** If a string starts casual Taglish, it
   finishes casual Taglish — no sudden shift to formal Filipino or pure English mid-sentence.
7. **Never use text-speak** (jejemon, txtspk, random capitalisation).
8. **Preserve all HTML entities and special characters** (`&nbsp;`, `\n`, etc.).

---

## 8. AI generation prompt guidance

When using an AI model to draft the Taglish catalogue, the prompt **must** include:

1. This entire style guide (or a faithful summary of it).
2. The locked glossary (§3–§4 above).
3. The uncertain rows (§5) flagged as questions, not settled answers.
4. The English source string and its key, so the model sees both the text and the
   namespace context.
5. An explicit instruction: *"If you are unsure whether a term should be translated or
   kept in English, keep it in English. The reviewer will localise further if needed."*
6. The failure-mode warnings from §10.5:
   - Do not reach for a more formal register than the style guide allows.
   - Do not produce a sentence that is English with one Tagalog particle appended.
   - Keep affixes and verb conjugations consistent across strings (if “na-publish” is
     used for one past-tense verb, use “na-” for all past-tense verbs, not “in-” for some
     and “na-” for others).
   - Do not insert “po”, “opo”, or any honorific marker.

---

## 9. The gloss requirement (§10.3)

Every Taglish string in the catalogue **must** be accompanied by a back-translation gloss
— a literal English rendering of what the Taglish *actually says*, not a copy of the
English source.

Glosses are stored inline in `taglish.ts` as `_gloss.<key>` entries:

```typescript
export const taglishCatalogue: Record<string, string> = {
  'nav.subscribe': 'Mag-subscribe',
  '_gloss.nav.subscribe': 'Subscribe (imperative)',

  'home.h1': 'Handa ka ba sa bagyo? Simulan sa tamang gear.',
  '_gloss.home.h1': 'Are you ready for the storm? Start with the right gear.',
}
```

- Glosses are **stripped at build time** (the catalogue loader filters `_gloss.*` and
  `_review.*` keys). They never ship to the reader.
- A gloss catches **meaning drift** but cannot catch “this sounds odd” — that is what
  the native reviewer is for.
- The source locale (English) never has glosses, and the loader rejects any that appear.

---

## 10. Review workflow

1. **AI drafts** the Taglish catalogue following this guide, including glosses.
2. **The reviewer** (named in `TAGLISH_REVIEW.reviewer` in `taglish.ts`) checks:
   - Tone and register: does it sound like the brand voice described in §2?
   - Glossary compliance: are §3 terms left in English? Are §4 terms in Taglish?
   - Uncertain rows (§5): settle each question.
   - Gloss accuracy: does each gloss faithfully describe what the Taglish string says?
   - Cross-reference alignment: do strings that express the same concept in different
     places use the same Taglish phrasing?
   - Placeholder completeness: every `{name}` present?
   - No constraint violations (§7).
3. **Once satisfied**, the reviewer writes their name and the date into
   `TAGLISH_REVIEW` in `taglish.ts`. This lifts the review gate and allows the Taglish
   catalogue to be served to readers.
4. **Subsequent edits** to the catalogue require re-review. The reviewer name/date
   should be updated to reflect the latest review pass.

---

## 11. Mechanically catchable checks

Per §10.5, these can be enforced by automated assertion:

| Check | How |
|---|---|
| Every English key has a Taglish key | Compare key sets |
| No `_gloss.*` key without a matching translated key | Orphan check |
| No translated key without a `_gloss.*` key | Completeness check |
| No `po` / `opo` / `ho` on word boundaries | Regex `\b(po|opo|ho)\b` (case-insensitive) — test on a planted string first (§10.5 warning) |
| Placeholders preserved | Extract `{...}` from English, assert same set in Taglish |
| No straight quotes in Taglish strings | Regex `['"]` (excluding code/keys) |
| `_review.signed_off` present and non-null | Gate check |

These can be added as a build-time or CI check when the catalogue is populated.

---

*Last updated: 20 Sep 2026. Author: build agent. To be reviewed and amended by the
native reviewer before the first Taglish catalogue is finalised.*
