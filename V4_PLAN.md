# Portfolio v4 plan

**Goal:** bold, concise and alive. A recruiter should understand Adam in 5 seconds, feel the craft in 15, and reach proof (a project, the resume, an email) in one click. Motion explains; it doesn't decorate.

**References:**
- ayoungcho.com for structure and restraint
- Motion, anime.js, Kokonut UI and Bklit UI for techniques
- Manus for calm confidence

## Decisions (locked)

| Topic | Decision |
|---|---|
| Styling stack | **Upgrade to Tailwind v4** and set up the shadcn registries for Bklit (`@bklit`) and Kokonut (`@kokonutui`) |
| Hero statement | **Keep "I build products."** and the v3 supporting line |
| Featured work | **Stacking cards** (try first) |
| Skills | **Plan A:** data-backed, with tools ranked by how many projects used them plus a build calendar. **Plan B** if A doesn't land: grouped keyword skills with rankings, styled with Bklit/Kokonut |
| 3D | The Kinema actuator as a scroll-driven exploded view (home) and an interactive viewer (project page), once the model arrives |
| Award photos | SCET hackathon and MATE photos now. COP28 photos come after Adam sees the preview, and the layout works without them |

## How we'll ship it

- Build on a new `v4` git branch. v3 stays live at the main URL the whole time.
- Publish a **preview** at `antangled.github.io/engineering_portfolio/v4/` after each phase, so Adam reviews the real thing on his own phone and laptop.
- When v4 is approved, promote it to the main URL in one deploy. v3 stays in git history and can be restored in one command.
- **Every phase gets checked at:**
  - desktop and phone sizes
  - reduced motion turned on
  - speed (Lighthouse)
  - keyboard navigation
  - the existing per-page titles, link previews and HTTP 200 checks

## Ground rules (all phases)

- **One signature move per section,** not the same fade on everything.
- **One easing curve and three durations** (fast 150 ms, base 400 ms, slow 800 ms).
- **Content is always visible without animation.** Reveals only enhance it, so screenshots, printing and slow devices never show a blank section.
- **Reduced motion:** every effect becomes a simple fade or an instant change. Pinned scroll sections become normal stacked sections.
- **Phones:** no custom cursor, no pinned scrolling, simpler backgrounds, and the 3D model only loads when tapped.
- **Performance budget:**
  - home page JS stays under about +45 KB gzip over v3, not counting lazy-loaded parts
  - charts and 3D load only when you scroll near them
  - the first screen loads in under 1.5 s

---

## Phase 0: Foundation

- Tailwind v3 → v4. Move the color, font and radius tokens into the v4 CSS `@theme`, and keep every color and component looking identical. Verified with before/after screenshots.
- framer-motion 11 → **Motion 12** (`motion/react`). Same API, plus scroll-linked and layout features.
- Add `components.json` with the `@bklit` and `@kokonutui` registries. Components install as source files we own and can edit.
- Shared motion primitives: `Reveal` (fade-up / blur-in / mask-line / wipe), `Stagger`, `CountUp` (animates once and never past the real value) and `useInViewOnce`.
- **Done when:** the site looks and behaves exactly like v3 on the new stack.

## Phase 1: Hero (the first 5 seconds)

- **"I build products." stays.** Add one orchestrated entrance of about 1.2 s: the photo un-blurs and settles from 1.04×, the headline lines rise in, then the role, line, buttons and tags stagger in.
- **Departure-board status line** (Kokonut split-flap text): flips between `NOW BUILDING: KINEMA 6-DOF ARM` and `OPEN: SPRING + SUMMER 2027` every few seconds. Phones show a static line.
- Build strip: thumbnails get a gentle hover scale, and play a short muted clip on hover where one exists (PolySynth, Kinema).
- The hero stays light: no 3D or heavy backgrounds here, so it loads instantly.

## Phase 1c: Bold hero + builds reel (Nov 15, after Adam's review of the orbit and plain versions)

- A large centred portrait. "I build" sits to its left at face height; "products." steps onto the next line and crosses the photo.
  - It is drawn twice: black on the page, and white (plus a soft scrim) inside the photo frame.
  - The words slide or rise out from behind the photo.
- Caption centred under the photo: UC Berkeley seal, role, "UC Berkeley · EECS". Then View my work / Résumé / LinkedIn. A subtle animated scroll cue at the bottom of the first screen.
- No builds in the hero (Adam found the tiles cluttered); the featured stack below carries the work.
- "Adam Tang" sits above "I build" in Clash Display at ~0.26× the headline size, with an orange underline that draws in.
- The caption is role-only: seal, "Mechatronics & Embedded Systems Engineer", "UC Berkeley · EECS".
- Then the full-width image statement.

## Phase 2: Statement reveal (the image version is back, full width, below the hero)

- After the build strip, the v3 line is set large and revealed word by word as you scroll:
  > "From cycloidal actuators to satellite-IoT field sensors and RF drone detection."
- *cycloidal actuators*, *satellite-IoT field sensors* and *RF drone detection* turn signal-orange as they land and link to Kinema, Biodiversity and Eldaeon.
- ~~Pinned briefly on desktop.~~ **Revised after review (Nov 15):** no pin and no full-screen size. A compact block (about 390 px tall) beside a "What I build" label: the words rise in once on entering view, a small thumbnail of each build pops in beside its phrase, and the phrases turn orange as an underline draws. CSS transitions only, so no per-scroll-frame work. Normal, fully visible text on phones and with reduced motion.

## Phase 3: Selected work as stacking cards

- The 4 featured projects (Kinema, Envoy, PolySynth X, Biodiversity) become **stacking cards**. Each card pins and the next slides over it while the previous scales to 0.94 and dims slightly.
- Each card is one takeaway:
  - large media, with an autoplaying muted clip where available
  - the title and one line
  - the role badge
  - 3 tool chips
  - **one accent metric**: Kinema "2 N·m bench-tested", Envoy "Hackathon winner", PolySynth "12 keys, per-key pitch bend", Biodiversity "100% solar"
- **Click → shared-image transition:** the card's image morphs into the project page's gallery image, so moving between pages feels continuous.
- Phones get a plain vertical list of the same cards, with no pinning.
- **Fallback if stacking feels too much:** alternating image/text rows (ayoungcho style), using the same card content. This is a one-file swap.

## Phase 3b: Kinema in 3D (done Nov 15, from the RO80 drive v2 Onshape GLBs)

- **Home, Kinema stacking card:** a scroll-driven exploded view. While the card is pinned, the parts separate along the axis (housing → cycloidal discs → eccentric cam → output bearing), each name appears beside its part, and then they reassemble.
- **Kinema project page:** an interactive viewer tile. Drag to rotate, an "Explode" toggle, and part names on hover.
- **Tech:**
  - three.js through react-three-fiber + drei, with lighting matched to the site (soft key light, faint orange rim light) and a transparent background
  - lazy-loaded near the viewport, with the model Draco/meshopt-compressed to under 2 MB
- **Fallbacks:** the current exploded-CAD image shows first and stays if 3D isn't available. Reduced motion shows a static exploded render.
- **Asset needed:**
  - the actuator assembly as **GLB/glTF**, with each part a separate, named body (housing, disc 1, disc 2, cam, pins, bearing, output flange, motor)
  - otherwise **STEP**, or **one OBJ/STL per part**
  - original colors if possible

## Phase 4: About (concise and bold)

- **One paragraph of about 60 words.** The proof phrases are accent links: *6th in the world at MATE* → MUREX, *drone-detection pipeline at Eldaeon* → Eldaeon, *won Best Enterprise Reinvention* → Envoy.
- **One facts line** in place of the table: `B.S. EECS · Minor Bioengineering · 3.91 GPA · Tau Beta Pi · HKN · May 2028`.
- **Experience accordion:**
  - one line per role (org · role · dates), with the current role's dot pulsing
  - click expands the description and project link with a smooth layout animation
  - all rows start collapsed
- **Recognition:**
  - three photo cards with year badges:
    - SCET Innovation Intelligence Hackathon (award photo)
    - MATE World Championship (team photo)
    - COP28: a styled card with no photo until Adam pastes the photos in
  - the remaining honors as a compact list below
- The pitch photo stays, with a slow parallax (about 6%) as it scrolls.

## Phase 5: Skills

**Plan A (try first): data-backed, so every claim is checkable on the site**
- **Toolchain ranking** (Bklit bar chart): tools ranked by how many projects on this site used them, computed automatically from the project data, e.g. "SolidWorks: 4 projects".
  - Hovering a bar shows those projects; clicking one goes to it.
  - Grouped by Mechanical / Electrical / Embedded & software / Fabrication & test, switched with tabs.
- **Build calendar** (Bklit heatmap): months with an active build from 2022 to 2026, from project dates. It shows consistency at a glance.
- **"Show all tools" expander** (ayoungcho style): every tool with a one-line proof, e.g. "STM32H7: real-time DSP firmware for PolySynth X".

**Plan B (if A doesn't land): keywords with rankings**
- Skills grouped by domain as bold keyword chips, each with a one-line proof on hover.
- A ranked "top tools" list per domain, shown with Bklit bars or ring charts and animated in with Kokonut text effects.
- Same data source and expander as Plan A, so switching is cheap.

Charts load lazily and animate in once.

## Phase 6: Micro-interactions and polish

- **Cursor:** a dot that grows into a labeled ring ("View", "Play", "Open"). Primary buttons get a subtle magnetic pull (Kokonut magnet button). Desktop only.
- **Count-up stats** on project pages when they come into view.
- **Route transition:** a short orange wipe (about 350 ms) between the light home page and the dark project pages.
- **Scroll progress:** a 1 px orange line under the nav on long pages.
- **Project pages:**
  - build-log images reveal with a clip-path wipe
  - "What I did" bullets stagger in
  - videos play only while on screen
- **Delight:** a small particle burst when the email is copied, and a blinking caret after the footer email.

## Not doing (too much)

Horizontal scroll-jacking, autoplaying sound, glitch or extruded text, glassmorphism, particle backgrounds everywhere, confetti on page load, and 3D anywhere except the Kinema actuator.

---

## Order and effort

| # | Phase | Preview checkpoint | Effort |
|---|---|---|---|
| 0 | Foundation (Tailwind v4, Motion 12, registries, primitives) | v4 preview looks identical to v3 | ~½ day |
| 1 | Hero entrance + split-flap status | Preview 1 | ~½ day |
| 2 | Statement reveal | Preview 1 | ~2 h |
| 3 | Stacking featured cards + shared-image transition | Preview 2 | ~1 day |
| 4 | About: concise paragraph, accordion, award cards | Preview 2 (Adam adds COP28 photos) | ~½ day |
| 5 | Skills: Plan A, with Plan B as fallback | Preview 3 | ~1 day |
| 6 | Polish: cursor, count-ups, transitions, delight | Preview 3 | ~½ day |
| 3b | Kinema 3D (when the model arrives) | Its own preview | ~1–1½ days |
| — | Promote v4 to the main URL | Final review | ~1 h |

## Waiting on Adam

- **COP28 photos** (and any other award photos), after preview 2.
- **Kinema actuator 3D model:** GLB/glTF with named parts, or STEP / per-part OBJ.
- Review of each preview, especially **stacking vs. rows** (preview 2) and **skills Plan A vs. B** (preview 3).
