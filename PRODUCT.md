# Product

## Register

brand

## Users

Engineering recruiters and hiring managers (hardware, robotics, mechatronics, embedded, and software roles), plus collaborators and admissions/research contacts. They arrive skimming — often <30 seconds on first pass — and decide within the first viewport whether to keep scrolling. They need to (1) instantly understand what Adam is, (2) jump straight to an impressive project, and (3) reach a resume / contact without hunting.

## Product Purpose

A personal engineering portfolio (v3) for Adam Tang — UC Berkeley EECS. It exists to *wow* recruiters instantly and route them efficiently to either deep project case studies or a concise "who I am / how I work" story. Success = a recruiter lands, is impressed within 5 seconds, opens a project (or the resume), and reaches out. Visual-first, not text-heavy.

## Brand Personality

Precise, ambitious, builder-confident. Voice is direct and outcome-first ("I build products."), never boastful filler. Every project leads with the problem, Adam's role, and a measured result. The work should read as "how was this made?" — distinctive and crafted, never generic.

## Anti-references

- Generic AI-template portfolios: identical card grids, eyebrow kickers above every section, gradient text, hero-metric template.
- Text-heavy walls that bury the work (the failure mode of v2).
- The "engineer → navy blue" palette reflex and the editorial-magazine (display-serif + italic + drop caps) lane.

## Design Principles

1. **Show, don't tell.** Imagery, video, and CAD carry the story; copy is concise and metric-forward.
2. **Win the first 5 seconds.** Anchor project + outcome-first identity live in the first viewport; contact/resume are always one glance away.
3. **Two registers, one voice.** A bright, airy pop-out hero & about (clarity, approachability) flows into a dark, cinematic gallery (the work glows like a showroom).
4. **Quantify impact.** Numbers in titles, chips, and results — the recruiter should see "+12%", "36:1", "75+ files" without reading prose.
5. **Distinctive over safe.** Committed signal-orange accent, Clash Display headlines, deliberate motion — avoid the AI-slop monoculture.

## Reference Patterns (fused)

- **julienr.co** — pop-out oversized hero label + persistent sticky-left identity column (bio, resume, LinkedIn, GitHub, Studio Instagram, YouTube, email) beside scrolling experience.
- **baptisteglaymann.com** — cinematic project gallery: poster → autoplay-video-on-hover tiles, sibling dimming, custom "View" cursor, smooth inertial scroll.
- **thomasmonavon.com** — calm, clean card/box system for about, skills, and secondary content.

## Information Architecture

- `/` Home (light): pop-out hero → Selected Work teaser (anchor first) → sticky-left About + Experience + Recognition → Toolchain → dark closing CTA/footer.
- `/projects` (dark): cinematic gallery with a Hardware / Software toggle. Cycloidal actuator featured first.
- `/projects/:slug` (dark): per-project case study — impact metrics, overview, My Role, Problem → Approach → Result, media, links. The Internal Cycloidal Actuator embeds the Instagram reel.

## Accessibility & Inclusion

Target WCAG AA. Body/UI text meets ≥4.5:1; large display text ≥3:1. Full `prefers-reduced-motion` support (smooth scroll, custom cursor, and entrance animations all disable). Custom cursor is pointer-fine only; native cursor restored otherwise. Semantic headings and link labels (not bare icons) so screen-reader and fast-skimming users both get unambiguous targets.
