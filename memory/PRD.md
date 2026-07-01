# Vennela Rudraraju — Portfolio PRD

## Original Problem Statement
Elevate an existing enchanted-botanical portfolio (Secret Garden × Studio Ghibli × Hermès) from
beautiful to award-worthy. Preserve identity, do NOT rebuild. Position Vennela as someone who
solves messy human/business problems (fit for Product Management, Founder's Office, Chief of
Staff, Product Strategy, Product Operations, UX Research). Keep the voice: witty, confident, warm,
slightly playful — anchored on the line *"I love creating experiences so personal, you'll wonder if
I've been stalking you."*

## Architecture
- **Frontend**: Static HTML/CSS/JS (vanilla — preserved from original repo). Served by Vite dev
  server on port 3000. Additive Chapter II elevation layer at the end of `style.css` and
  `script.js` — no existing rule replaced.
- **Backend**: FastAPI on port 8001. Single job: contact form → Resend → vennela.rudraraju@gmail.com.
  Slowapi rate limit 5/minute per real IP (X-Forwarded-For aware). Honeypot field.
- **Email**: Resend (free tier, `onboarding@resend.dev` sender). Reply-to auto-set to the visitor.

## User Personas
- **Recruiters** (PM, Founder's Office, COS, Product Strategy, UX Research) skimming portfolios
  quickly. Must feel curiosity → wonder → *"I want her on my team."*
- **Peer designers/awards jurors** who reward craftsmanship and quiet luxury.
- **Vennela** herself — the site must feel personal, not templated.

## Core Requirements (Static)
1. Preserve every existing section: gate intro, hero, projects, magic mirror, experience, about, footer.
2. Preserve every existing interaction (mirror, custom cursor, sound toggle, vine progress, hover blooms, PromptSense embed, Blend Box video placeholder).
3. Enchanted botanical aesthetic — never Harry Potter / Disney / gamer.
4. Quiet luxury. Everything breathes.
5. Contact form → email delivery to vennela.rudraraju@gmail.com with butterfly-envelope delivery animation and confirmation *"The butterflies have done their job. I'll take it from here."*
6. Motion respects `prefers-reduced-motion`.
7. Accessibility: focus-visible rings, honest ARIA labels, contrast preserved.

## What's Been Implemented (2026-07-01)

### Content repositioning
- Hero eyebrow: `UX Designer · Researcher` → **`Product · Research · Design`**
- Hero headline restructured into three staggered-reveal lines: *"I love creating experiences / so personal, / you'll wonder if I've been stalking you."*
- Hero subline rewritten to lead with *computer science graduate* + *product, strategy, research, design*.
- About body rewritten: three chapters — origin, breadth (Wholsum / Ericsson / UXRIT / IEEE), the instinct that ties them together.
- Meta description + `<title>` updated to reflect the broader positioning.
- Footer eyebrow tightened to *"leave a note"* + *"slip me a note and the butterflies will carry it across."*
- Fixed placeholder mailto (was `vennela@example.com`) → `vennela.rudraraju@gmail.com`.

### Contact form + backend
- New `<form id="contactForm">` embedded in footer with name, email, message, honeypot.
- Inline validation with warm micro-copy (*"A name, however informal, helps"*, *"I need a way to write back"*, *"Even a sentence is enough"*).
- Gilded underline focus animation, cream-serif inputs against forest green.
- Submit button: pill outline → gold-glow on hover, rotating `✦` arrow.
- FastAPI backend `/api/contact` with Pydantic email validation, honeypot swallow, slowapi rate limit (5/min, X-Forwarded-For aware).
- Resend integration sends styled HTML email with reply-to = visitor.

### Butterfly delivery animation
- Full-screen overlay `#butterflyDelivery` triggers on 200 response.
- SVG butterfly with real wing-flap keyframes carries a glowing envelope on a silken thread.
- Cinematic 4.8s flight path (bezier easing) from off-screen bottom-left to screen center.
- Ambient particles drift upward with staggered delays.
- Confirmation card fades in: *"The butterflies have done their job. I'll take it from here."*
- Dismissible via close button or ESC.

### Chapter II craftsmanship layer (additive)
- **Ambient sunlight** — fixed radial-gradient that shifts vertically as visitor scrolls (morning → afternoon).
- **Filmic grain** — very subtle drifting noise overlay, `mix-blend-mode: overlay`, disabled on reduced-motion + reduced on mobile.
- **Storybook chapter reveals** — every `.reveal` element now uses opacity + translate + blur transitions on `.in-view`, staggered for project cards and experience timeline.
- **Section dividers** with fading gilded rules that extend on scroll.
- **Hero parallax** — photo, botanical overlays, and content shift on scroll with rAF throttling.
- **3D card tilt** — project cards tilt subtly toward pointer; radial spotlight follows cursor.
- **Mirror sublimation** — pointer-follow highlight, drifting conic-gradient halo (18s), deeper antique-glass layers, softer content transitions. Concept preserved 100%.
- **Butterfly drift physics** — floating butterflies now ease toward cursor with 0.03 lerp for silk-thread feel.
- **Nav glass** — refined backdrop-filter + saturation on scroll.
- **Typography** — tighter letter-spacing on hero/section titles, ligature/kern/dlig font-feature-settings on serif display type.
- **Refined easing curves** — `--ease-quiet`, `--ease-silk`, `--ease-bloom`, `--ease-exit` used across the elevation layer.
- **Responsive polish** — tuned breakpoints for tablet (1024px) and mobile (768px, 480px).

### Easter eggs
- **Konami code** (`↑↑↓↓←→←→ b a`) reveals a handwritten thank-you note (`#secretNote`) styled like a torn journal page.
- **Long-press VR monogram** (700ms) triggers a golden bloom.


### Chapter architecture (2026-07-01, afternoon)
- **History API routing** for `/projects/wholsum`, `/projects/ericsson`, `/projects/promptsense`, `/projects/archive`. Vite's SPA fallback serves index.html for all deep links.
- **4 chapter entry cards** on the home projects grid — clean, no over-explaining, each labelled Chapter I–IV.
- **Chapter view (`main#chapterView`)** — hides all home sections when a chapter route is active (via `body.route-chapter` class); nav + chapter footer remain.
- **Chapter navigation** — top: "← All chapters" + Chapter breadcrumb. Bottom: "Back to all chapters" + Previous / Next chapter cards (auto-disabled at endpoints).
- **Gate bypass** — deep links to `/projects/*` skip the enchanted gate for recruiter-friendly UX; first-time direct visit sets `sessionStorage.gateOpened = 1`.
- **Chapter I · Wholsum Foods** (empty scaffolds): Introduction, Mentors, Product Innovation (with 8 sub-cards: Milkshake Mix, Strawberry Pancake, Savoury Pancakes, Korean Noodles, Cookies, Veg Chips, Lentil Chips, Crackers), Competitive Benchmarking, Packaging Revamp, Power BI, Azure/Data, GS1, Warehouse Visit, SOPs, LBLF, Townhall, Wholsum Wrapped (video slot), Reflection.
- **Chapter II · Ericsson**: Project Brief, Research Planning, Competitive Analysis, User Interviews, Affinity Mapping, Information Architecture, Crazy 8s, Paper Prototypes, High Fidelity, Presentation (ppt), Behind the Playground (ppt · GenAI), Reflection.
- **Chapter III · PromptSense**: Problem, Research, Promptify, Architecture, UX, Implementation, Sustainability, Demo (video slot), Report (pdf), Presentation (ppt), Reflection.
- **Chapter IV · Curiosity Cabinet**: 9 filter chips (All · Branding · Posters · Motion · Illustrations · Presentations · Competitions · Experiments · Misc), CSS-column masonry grid ready to receive `<figure class="cab-item" data-category="…">` items.
- **Universal lightbox** — opens any `[data-lightbox]` element. Auto-detects media type (image/video/pdf/embed), keyboard nav (← → Esc), group-aware prev/next within a section.
- **Empty-state elegance** — sections with no content show the title at 62% opacity + a delicate hairline underneath. No fabricated text, no "lorem ipsum", no placeholder images.
- **Confidential blur helper** — any element with `class="confidential"` renders with an 18px blur and a "CONFIDENTIAL" watermark, ready for Ericsson artefacts.
- **Chapter open transition** — subtle 0.9s translate + blur + tilt entry so each chapter feels like a page being turned.
- **Verified working**: direct deep links, card→chapter navigation, prev/next chapter, back-to-home, filter selection, chapter route hides home sections, home route hides chapters, hash anchors on home still work.

### Content repositioning
### Testing (2026-07-01, iteration_1)
- 15/15 frontend acceptance criteria pass.
- Backend 7/7 after middleware fix. Rate limit verified enforcing (5 → 429).
- Resend integration verified end-to-end (email IDs returned).
- Report: `/app/test_reports/iteration_1.json`.

## Prioritized Backlog

### P0 (done)
- Contact form + butterfly delivery + Resend
- Copy repositioning for product/strategy roles
- Craftsmanship elevation layer

### P1 (future)
- Individual project chapter pages (Sakhi Suraksha, Blend Box, PromptSense, Wholsum Wrapped) — each opens like a chapter of a book with page-turn transition.
- Real download-resume asset (currently `#` placeholder).
- Real case-study links on project cards (currently `#`).
- Verify a domain in Resend so emails send from `hello@vennela.com` instead of `onboarding@resend.dev`.

### P2 (nice-to-have)
- Cursor-follow petal trail on the hero photo hover.
- Audio: ambient garden sounds (already has toggle infrastructure).
- Print stylesheet for the about page as a "specimen card".
- Analytics (Plausible or similar) so Vennela can see which chapter recruiters linger on.

## Next Action Items
- Populate real case-study URLs when the case studies are written.
- Upload resume PDF and point `#footerResume` to it.
- Consider verifying a custom sending domain in Resend for polish.
