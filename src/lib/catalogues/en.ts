/**
 * Base English catalogue — every reader-facing chrome string.
 *
 * Naming: `namespace.key` — dotted, lowercase, snake_case segments.
 * This is the completeness base (D-base): every key MUST have a value here.
 * A missing key is a bug, not a fallback case.
 *
 * British spelling throughout (ADR-007).
 */
export const enCatalogue = {
  // ── brand ──────────────────────────────────────────────────────────────
  'brand.name': 'Galing Gear',
  'brand.tagline': 'For the storms, the quakes, and the gear that beats them.',
  'brand.mission':
    'For the storms, the quakes, and the gear that beats them. We help Filipino families get ready — for everyone under the roof.',
  'brand.legal': '© 2026 Galing Gear. No affiliation with any supplier.',

  // ── nav / header ──────────────────────────────────────────────────────
  'nav.home_aria': 'Galing Gear — home',
  'nav.scenarios': 'Scenarios',
  'nav.more': 'More',
  'nav.open_menu': 'Open menu',
  'nav.close_menu': 'Close menu',
  'nav.subscribe': 'Subscribe',
  'nav.archive': 'Archive',
  'nav.skip_to_content': 'Skip to content',

  // ── footer ────────────────────────────────────────────────────────────
  'footer.scenarios_heading': 'Scenarios',
  'footer.subscribe_heading': 'Subscribe to Galing Gear',
  'footer.about_heading': 'About',
  'footer.about_body':
    'Galing Gear is an independent preparedness project helping Filipino families get ready for typhoons, floods, quakes and brownouts — with clear, practical guides and honest gear picks.',
  'footer.contact_heading': 'Contact',
  'footer.contact_label': 'Email us',
  'footer.contact_email': 'hello@galinggear.com',

  // ── theme ─────────────────────────────────────────────────────────────
  'theme.to_dark': 'Switch to dark theme',
  'theme.to_light': 'Switch to light theme',

  // ── subscribe form ────────────────────────────────────────────────────
  'form.name_label': 'Your name',
  'form.email_label': 'Email address',
  'form.sending': 'Sending…',
  'form.supporting':
    'Preparedness guides and the gear that makes the difference — often and regular. No spam. Unsubscribe any time.',
  'form.success': "You're on the list. We'll be in touch.",
  'form.submit': 'Join the list',

  // ── form validation / result messages ─────────────────────────────────
  'form.err.name_required': 'Please tell us your name.',
  'form.err.name_too_long':
    'That name is a little long — please keep it under 80 characters.',
  'form.err.email_required': 'Please enter your email address.',
  'form.err.email_invalid': 'That does not look like a valid email address.',
  'form.err.already_subscribed':
    "You're already on the list — no need to sign up again.",
  'form.err.invalid_request': 'Please check the form and try again.',
  'form.err.method_not_allowed': 'That request is not allowed here.',
  'form.err.server_error':
    'Something went wrong at our end. Please try again in a moment.',

  // ── article page ──────────────────────────────────────────────────────
  'article.published': 'Published',
  'article.updated': 'Updated',
  'article.status_current': 'Current',
  'article.status_archived':
    'Archived — kept for reference, may be out of date.',
  'article.toc_label': 'On this page',
  'article.more_in': 'More in {scenario}',
  'article.share': 'Share this',

  // ── article card ──────────────────────────────────────────────────────
  'card.read_review': 'Read the review →',
  'card.read_guide': 'Read the guide →',
  'card.read_more': 'Read more →',
  'card.status_archived': 'Archived',
  'card.status_current': 'Current',

  // ── rail items ────────────────────────────────────────────────────────
  'rail.label_product': 'Our pick',
  'rail.label_image': 'Illustration',
  'rail.label_article': 'Suggested reading',
  'rail.label_ad': 'Sponsored',
  'rail.cta_buy': 'Where to buy →',
  'rail.cta_ad': 'Learn more',
  'rail.ad_flag': 'Advertisement',

  // ── home page ─────────────────────────────────────────────────────────
  'home.eyebrow': 'Preparedness and gear for Filipino families',
  'home.h1': 'Beat the storm with the right gear and know-how.',
  'home.lede':
    'Typhoons, floods, earthquakes, brownouts — practical guides to get your family ready, plus the gear, bags and gadgets that actually make the difference when it counts. Everything you need, nothing you don\'t.',
  'home.cta': 'Join the list',
  'home.editors_pick': "Editor's choice",
  'home.also_featured': 'Also featured',
  'home.load_more': 'Load more',
  'home.prev': 'Previous',
  'home.next': 'Next',
  'home.pagination': 'Article pages',
  'home.latest': 'Latest guides, gear and gadgets',
  'home.empty': 'Nothing new yet. Check back soon.',
  'home.callout_h2': 'The right gear makes the difference',
  'home.callout_body':
    'When the storm hits, good gear is what keeps your family safe, dry and powered — so we test it in real Philippine conditions and tell you honestly what earns its place. Join the list for the guides and the gear worth owning.',

  // ── archive page ──────────────────────────────────────────────────────
  'archive.eyebrow': 'The archive',
  'archive.h1': 'Archive',
  'archive.blurb':
    'Articles we\'ve retired from the main listings live on here. Choose a category, then open a month to browse the pieces we archived back then.',
  'archive.counts': '{total} archived {totalNoun} · {cats} {catsNoun}',
  'archive.cat_counts': '{count} archived {countNoun}',
  'archive.cat_counts_months':
    '{count} archived {countNoun} · {months} {monthsNoun}',
  'archive.empty_cat': 'Nothing archived in {category} yet.',
  'archive.empty':
    'Nothing has been archived yet. When we retire an article it will appear here.',

  // ── subscribe page ────────────────────────────────────────────────────
  'subscribe.eyebrow': 'Join the list',
  'subscribe.h1': 'Guides, gear and gadgets',
  'subscribe.lede':
    'Typhoons, floods, earthquakes and brownouts — we write up how to get your family ready, and the gear, bags and gadgets that make the difference. No spam, unsubscribe any time.',

  // ── 404 page ──────────────────────────────────────────────────────────
  '404.eyebrow': 'Error 404',
  '404.h1': "We couldn't find that page.",
  '404.blurb':
    'Sorry about that — the page you were after has either moved, been retired, or never existed. No harm done. All our guides and gear are still here; let\'s get you back to something useful.',
  '404.back_home': 'Back to home',
  '404.browse_archive': 'Browse the archive',
  '404.browse_by_category': 'Browse by category',
  '404.latest': 'Latest guides, gear and gadgets',

  // ── scenario page ──────────────────────────────────────────────────────
  'scenario.eyebrow': 'Scenario',
  'scenario.empty': 'Nothing here yet. Check back soon.',
  'scenario.archive_link': 'Browse archived {label} articles',
  'scenario.archive_note':
    '{count} older {countNoun} we\'ve retired from this list, kept for reference.',

  // ── plurals (used by interpolation helper) ────────────────────────────
  'plural.article': 'article',
  'plural.articles': 'articles',
  'plural.category': 'category',
  'plural.categories': 'categories',
  'plural.month': 'month',
  'plural.months': 'months',

  // ── series ─────────────────────────────────────────────────────────────
  'series.part_of': 'Series',
  'series.part': 'Part',
  'series.of': 'of',
  'series.prev': 'Prev',
  'series.next': 'Next',
  'series.in_this_series': 'In this series',
  'series.you_are_reading': "You're reading this",
  'series.anchor_start_here': 'The anchor — start here',
  'series.live_now': 'Live now',
  'series.coming_date': 'Coming {date}',
  'series.coming_soon': 'Coming soon',
  'series.pill_reading': 'Reading',
  'series.pill_live': 'Live',
  'series.pill_soon': 'Soon',
  'series.see_full_overview': 'See the full series overview',
  'series.eyebrow': 'A Galing Gear Series',
  'series.anchor_label': 'Anchor',
  'series.start_here': 'start here',
  'series.stat_parts': 'parts',
  'series.stat_live': 'live now',
  'series.progress': 'Series progress',
  'series.n_of_m_published': '{n} of {m} published',
  'series.badge': 'Series',
  'series.n_part_series': '{count}-part series',
  'series.live_label': 'live',
  'series.explore': 'Explore the series',
  'series.section_title': 'Series',

  // Downloadable branded documents (checklists, go-bag lists, plans, recipes,
  // buying guides). Rendered by the DocumentDownloads section on article pages.
  'documents.heading': 'Free downloads',
  'documents.subheading': 'Printable, branded guides to go with this article — free to download and share.',
  'documents.download': 'Download PDF',
  'documents.nav': 'Free downloads',
  'documents.loading': 'Loading downloads…',
  'documents.type.checklist': 'Checklist',
  'documents.type.packing-list': 'Packing list',
  'documents.type.emergency-plan': 'Emergency plan',
  'documents.type.summary': 'Summary',
  'documents.type.recipe': 'Recipe',
  'documents.type.buying-guide': 'Buying guide',
} as const
