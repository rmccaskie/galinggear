/**
 * Taglish catalogue — Track 1 site chrome.
 *
 * ⚠ REVIEW GATE (§10.4): this catalogue is NOT servable until the reviewer
 *   marker below has a name and date. Until then, `catalogue.ts` skips it
 *   and falls through to the English base — so unreviewed Taglish chrome
 *   never reaches the reader.
 *
 * To mark as reviewed: fill in reviewer + date, then deploy.
 * The review must be done by someone fluent in English, Tagalog and Taglish
 * (D-review-chrome).
 */
import { siteProfile } from '../site-profile'

const BRAND = siteProfile.brand.name

export const TAGLISH_REVIEW = {
  reviewer: 'Robert McCaskie' as string | null,
  date: '2026-09-21' as string | null,
}

/**
 * Partial catalogue — only keys that differ from English need entries here.
 * Missing keys fall back to the English base via the fallback chain.
 *
 * Strings below are DRAFT Taglish (urban conversational register: Tagalog
 * grammar with the English loan-words Filipinos actually keep for UI/tech
 * terms — “gear”, “email”, “archive”, “subscribe”). They must be reviewed by a
 * fluent speaker before the review gate above is opened.
 */
export const taglishCatalogue: Record<string, string> = {
  // ── brand ──
  'brand.tagline': 'Para sa bagyo, sa lindol, at sa gear na panalo sa lahat.',
  'brand.mission':
    'Para sa bagyo, sa lindol, at sa gear na panalo sa lahat. Tinutulungan namin ang mga pamilyang Pilipino na maging handa — para sa lahat ng nasa bahay.',
  'brand.legal': `© 2026 ${BRAND}. Walang kaugnayan sa kahit anong supplier.`,

  // ── nav / header ──
  'nav.scenarios': 'Mga Sitwasyon',
  'nav.more': 'Iba pa',
  'nav.open_menu': 'Buksan ang menu',
  'nav.close_menu': 'Isara ang menu',
  'nav.subscribe': 'Mag-subscribe',
  'nav.archive': 'Archive',
  'nav.skip_to_content': 'Dumiretso sa content',

  // ── footer ──
  'footer.scenarios_heading': 'Mga Sitwasyon',
  'footer.subscribe_heading': `Mag-subscribe sa ${BRAND}`,
  'footer.about_heading': 'Tungkol sa Amin',
  'footer.about_body':
    `Ang ${BRAND} ay isang independent na preparedness project na tumutulong sa mga pamilyang Pilipino na maging handa sa bagyo, baha, lindol at brownout — may malinaw at praktikal na mga gabay at tapat na gear picks.`,
  'footer.contact_label': 'I-email kami',

  // ── theme ──
  'theme.to_dark': 'Lumipat sa dark theme',
  'theme.to_light': 'Lumipat sa light theme',

  // ── subscribe form ──
  'form.name_label': 'Pangalan mo',
  'form.email_label': 'Email address',
  'form.sending': 'Ipinapadala...',
  'form.supporting':
    'Mga gabay sa preparedness at ang gear na talagang gumagana — madalas at regular. Walang spam. Pwedeng mag-unsubscribe an(y)time.',
  'form.success': 'Nasa listahan ka na. Kokontakin ka namin.',
  'form.submit': 'Sali sa listahan',

  // ── form validation / result messages ──
  'form.err.name_required': 'Pakilagay ang pangalan mo.',
  'form.err.name_too_long':
    'Medyo mahaba ang pangalang iyan — pakipanatili sa ilalim ng 80 characters.',
  'form.err.email_required': 'Pakilagay ang email address mo.',
  'form.err.email_invalid': 'Mukhang hindi valid ang email address na iyan.',
  'form.err.already_subscribed':
    'Nasa listahan ka na — hindi na kailangang mag-sign up ulit.',
  'form.err.invalid_request': 'Pakicheck ang form at subukan ulit.',
  'form.err.method_not_allowed': 'Hindi pinapayagan ang request na iyan dito.',
  'form.err.server_error':
    'May nangyaring mali sa amin. Pakisubukan ulit maya-maya.',

  // ── article page ──
  'article.published': 'Nailathala',
  'article.updated': 'Na-update',
  'article.status_current': 'Kasalukuyan',
  'article.status_archived':
    'Naka-archive — itinago para sa reference, pwedeng luma na.',
  'article.toc_label': 'Sa page na ito',
  'article.more_in': 'Iba pa sa {scenario}',
  'article.share': 'I-share ito',

  // ── article card ──
  'card.read_review': 'Basahin ang review →',
  'card.read_guide': 'Basahin ang gabay →',
  'card.read_more': 'Magbasa pa →',
  'card.status_archived': 'Naka-archive',
  'card.status_current': 'Kasalukuyan',

  // ── rail items ──
  'rail.label_product': 'Pili namin',
  'rail.label_image': 'Ilustrasyon',
  'rail.label_article': 'Rekomendadong basahin',
  'rail.label_ad': 'Sponsored',
  'rail.cta_buy': 'Saan bibili →',
  'rail.cta_ad': 'Alamin pa',
  'rail.ad_flag': 'Advertisement',

  // ── home page ──
  'home.eyebrow': 'Preparedness at gear para sa mga pamilyang Pilipino',
  'home.h1': 'Talunin ang bagyo gamit ang tamang gear at kaalaman.',
  'home.lede':
    'Bagyo, baha, lindol, brownout — praktikal na gabay para maihanda ang pamilya mo, kasama ang gear, bag at gadget na talagang nakakatulong kapag kailangan. Lahat ng kailangan mo, wala nang labis.',
  'home.cta': 'Sali sa listahan',
  'home.editors_pick': 'Mga pili ng editor',
  'home.also_featured': 'Iba pang featured',
  'home.load_more': 'Magpakita pa',
  'home.prev': 'Nakaraan',
  'home.next': 'Susunod',
  'home.pagination': 'Mga pahina ng artikulo',
  'home.latest': 'Pinakabagong gabay, gear at gadget',
  'home.empty': 'Wala pang bago. Bumalik ka mamaya.',
  'home.callout_h2': 'Ang tamang gear ang gumagawa ng pagkakaiba',
  'home.callout_body':
    'Kapag tumama ang bagyo, ang magandang gear ang nagpapanatiling ligtas, tuyo at may kuryente ang pamilya mo — kaya sinusubok namin ito sa totoong kondisyon ng Pilipinas at sinasabi nang tapat kung alin ang sulit. Sali sa listahan para sa mga gabay at gear na sulit ariin.',

  // ── archive page ──
  'archive.eyebrow': 'Ang archive',
  'archive.h1': 'Archive',
  'archive.blurb':
    'Ang mga artikulong inalis namin sa mga pangunahing listahan ay nandito pa rin. Pumili ng kategorya, tapos buksan ang isang buwan para tingnan ang mga piyesang na-archive noon.',
  'archive.counts': '{total} naka-archive na {totalNoun} · {cats} {catsNoun}',
  'archive.cat_counts': '{count} naka-archive na {countNoun}',
  'archive.cat_counts_months':
    '{count} naka-archive na {countNoun} · {months} {monthsNoun}',
  'archive.empty_cat': 'Wala pang naka-archive sa {category}.',
  'archive.empty':
    'Wala pang na-archive. Kapag nag-retire kami ng artikulo, dito ito lalabas.',

  // ── subscribe page ──
  'subscribe.eyebrow': 'Sali sa listahan',
  'subscribe.h1': 'Mga gabay, gear at gadget',
  'subscribe.lede':
    'Bagyo, baha, lindol at brownout — isinusulat namin kung paano ihanda ang pamilya mo, at ang gear, bag at gadget na nakakatulong. Walang spam, pwedeng mag-unsubscribe an(y)time.',

  // ── 404 page ──
  '404.eyebrow': 'Error 404',
  '404.h1': 'Hindi namin nahanap ang page na iyan.',
  '404.blurb':
    'Pasensya na — ang page na hinahanap mo ay lumipat, nag-retire, o hindi talaga umiral. Okay lang. Nandito pa rin lahat ng gabay at gear namin; ibabalik ka namin sa kung ano ang kapaki-pakinabang.',
  '404.back_home': 'Balik sa home',
  '404.browse_archive': 'Tingnan ang archive',
  '404.browse_by_category': 'Tingnan ayon sa kategorya',
  '404.latest': 'Pinakabagong gabay, gear at gadget',

  // ── scenario page ──
  'scenario.eyebrow': 'Sitwasyon',
  'scenario.empty': 'Wala pa dito. Bumalik ka mamaya.',
  'scenario.more': 'Higit pa sa {label}',
  'scenario.archive_link': 'Tingnan ang mga naka-archive na artikulo sa {label}',
  'scenario.archive_note':
    '{count} mas lumang {countNoun} na inalis namin sa listahang ito, itinago para sa reference.',

  // ── series ── (draft Taglish; "Live" kept as a natural loanword)
  'series.part_of': 'Serye',
  'series.part': 'Bahagi',
  'series.of': 'ng',
  'series.prev': 'Nakaraan',
  'series.next': 'Susunod',
  'series.in_this_series': 'Sa seryeng ito',
  'series.you_are_reading': 'Binabasa mo ito',
  'series.anchor_start_here': 'Ang anchor — dito magsimula',
  'series.live_now': 'Live na',
  'series.coming_date': 'Sa {date}',
  'series.coming_soon': 'Paparating na',
  'series.pill_reading': 'Binabasa',
  'series.pill_live': 'Live',
  'series.pill_soon': 'Malapit',
  'series.see_full_overview': 'Tingnan ang buong serye',
  'series.eyebrow': `Isang Serye ng ${BRAND}`,
  'series.anchor_label': 'Anchor',
  'series.start_here': 'dito magsimula',
  'series.stat_parts': 'bahagi',
  'series.stat_live': 'live na',
  'series.progress': 'Progreso ng serye',
  'series.n_of_m_published': '{n} ng {m} nailathala',
  'series.badge': 'Serye',
  'series.n_part_series': '{count}-bahaging serye',
  'series.live_label': 'live',
  'series.explore': 'Tuklasin ang serye',
  'series.section_title': 'Serye',
  // ── plurals ── (Tagalog reuses the base noun; “mga” marks plural elsewhere)
  'plural.article': 'artikulo',
  'plural.articles': 'artikulo',
  'plural.category': 'kategorya',
  'plural.categories': 'kategorya',
  'plural.month': 'buwan',
  'plural.months': 'buwan',
}
