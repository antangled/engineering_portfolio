// Builds AdamTang_Portfolio.pdf (6 pages, Letter) from the website's own data (src/data/projects.ts + profile.ts),
// so the PDF never drifts from the site. Rendered with headless Chrome; every project title and URL is a live link.
// Usage: node build.mjs <siteDir> <assetsDir> <out.pdf>
// Needs: puppeteer-core (resolved from ../tools/node_modules — adjust the require below), system Google Chrome,
// and <assetsDir> holding resized copies of the public/images files it references plus qr.png
// (QR code for https://antangled.github.io/engineering_portfolio/).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const [siteDir, assetsDir, outPdf] = process.argv.slice(2).map((p) => path.resolve(p));
const { build } = require(path.join(siteDir, "node_modules/esbuild"));
const puppeteer = require(path.resolve(path.dirname(new URL(import.meta.url).pathname), "../tools/node_modules/puppeteer-core"));

const SITE = "https://antangled.github.io/engineering_portfolio";
const load = async (f) => {
  const r = await build({ entryPoints: [path.join(siteDir, f)], bundle: true, write: false, format: "esm", platform: "neutral", define: { "import.meta.env.BASE_URL": '"/"' } });
  return import("data:text/javascript;base64," + Buffer.from(r.outputFiles[0].text).toString("base64"));
};
const { getProject } = await load("src/data/projects.ts");
const { profile, education, contact } = await load("src/data/profile.ts");

const img = (p) => pathToFileURL(path.join(assetsDir, p.replace(/^\//, ""))).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const url = (slug) => `${SITE}/projects/${slug}`;
const short = (u) => u.replace(/^https:\/\//, "");

// ── building blocks ─────────────────────────────────────────────────────────
const stats = (p, n = 4) =>
  (p.stats ?? []).slice(0, n).length
    ? `<dl class="stats c${Math.min((p.stats ?? []).length, n)}">${(p.stats ?? []).slice(0, n).map((s) => `<div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join("")}</dl>`
    : "";
const bullets = (items) => `<ul class="did">${items.map((h) => { const i = h.indexOf(" "); return `<li><b>${esc(h.slice(0, i))}</b>${esc(h.slice(i))}</li>`; }).join("")}</ul>`;
const link = (slug, label = "Full write-up, photos and video") =>
  `<a class="more" href="${url(slug)}"><span>${label}</span><span class="u">${short(url(slug))}</span><span class="ar">↗</span></a>`;
const fig = (src, cap, cls = "") => `<figure class="${cls}"><img src="${img(src)}" alt=""><figcaption>${esc(cap)}</figcaption></figure>`;
const head = (p, meta) => `
  <header class="ph">
    <div><h2><a href="${url(p.slug)}">${esc(p.title)}</a></h2><p class="tag">${esc(p.tagline)}</p></div>
    <div class="when"><span class="badge">${esc(p.badge ?? "")}</span><span>${esc(p.duration)}</span></div>
  </header>
  <p class="meta">${meta}</p>`;
const footer = (n) => `<footer><span>Adam Tang · Engineering Portfolio</span><a href="${SITE}/">${short(SITE)}</a><span class="pg">${n}</span></footer>`;

// Half-page project block
function half(slug, figs, { did, n = 4, meta, layout = "" } = {}) {
  const p = getProject(slug);
  return `<section class="proj half">
    ${head(p, meta ?? esc(p.tags.slice(0, 6).join(" · ")))}
    <div class="figs ${layout}">${figs.join("")}</div>
    ${stats(p, n)}
    ${bullets(did ?? p.highlights.slice(0, 3))}
    ${link(slug)}
  </section>`;
}

// ── pages ───────────────────────────────────────────────────────────────────
const index = [
  ["internal-cycloidal-actuator", "Cycloidal/cycloidal-main.jpg", 2],
  ["polysynth-x", "PolysynthX/polysynthx.jpg", 3],
  ["biodiversity-sensing-module", "BiodiversityTech/BiodiversityTech.jpg", 3],
  ["eldaeon-passive-radar-system", "Eldaeon/Eldaeon.jpg", 4],
  ["murex-rov", "MUREX/murex-rov.jpg", 4],
  ["solar-array-optimization", "CalSol/CalSol_Excalibur.jpg", 5],
  ["compact-automated-aquaponics", "Aquaponics/AquaponicsDLab.jpg", 5],
  ["envoy", null, 6],
];

const cover = `
<div class="page cover">
  <div class="hero">
    <div class="id">
      <p class="kick">Engineering Portfolio · 2026</p>
      <h1>Adam Tang<span class="dot">.</span></h1>
      <p class="role">${esc(profile.role)}</p>
      <p class="sub">EECS at UC Berkeley. I design and build hardware end to end — actuators, sensor nodes, RF systems — and write the software that runs it.</p>
      <p class="avail"><i></i>${esc(profile.availability)}</p>
      <p class="contact">
        <a href="mailto:${contact.email}">${contact.email}</a><span>·</span>
        <a href="${contact.phoneHref}">${contact.phone}</a><span>·</span>
        <a href="https://www.linkedin.com/in/adam-tang-2374992a7">linkedin.com/in/adam-tang-2374992a7</a><span>·</span>
        <a href="https://github.com/antangled">github.com/antangled</a>
      </p>
    </div>
    <div class="photo" style="background-image:url('${img("images/feature-v3.jpg")}')"></div>
  </div>

  <a class="site" href="${SITE}/">
    <img class="qr" src="${img("qr.png")}" alt="QR code to the online portfolio">
    <div>
      <p class="l1">The full portfolio is online</p>
      <p class="l2">${short(SITE)}</p>
      <p class="l3">Photos, video and a write-up for every project, plus more software work. Every project title in this document is a link.</p>
    </div>
    <span class="go">Open ↗</span>
  </a>

  <dl class="edu">
    <div><dt>Degree</dt><dd>${esc(education.degree)} · ${esc(education.minor)}</dd></div>
    <div><dt>School</dt><dd>${esc(education.school)} · expected ${esc(education.graduation)}</dd></div>
    <div><dt>GPA</dt><dd>${esc(education.gpa)}</dd></div>
    <div><dt>Honors</dt><dd>${esc(education.honors)}</dd></div>
  </dl>

  <h3 class="ix-h">Inside</h3>
  <ol class="ix">
    ${index
      .map(([slug, thumb, pg]) => {
        const p = getProject(slug);
        const t = thumb ? img("images/projects/" + thumb) : img("images/software/envoy-hero.jpg");
        const title = slug === "envoy" ? "Software: Envoy, Fantom Finder, BOMMaker" : p.title;
        const sub = slug === "envoy" ? "AI tools, passive-radar spoof detection and a parts-to-BOM Chrome extension." : p.tagline;
        return `<li><a href="${url(slug)}"><span class="th" style="background-image:url('${t}')"></span><span class="tx"><b>${esc(title)}</b><span>${esc(sub)}</span></span><span class="pn">${pg}</span></a></li>`;
      })
      .join("")}
  </ol>
  ${footer(1)}
</div>`;

const k = getProject("internal-cycloidal-actuator");
const kinema = `
<div class="page">
  <section class="proj full">
    ${head(k, "Hardware lead · with Jacob Leung (software and ML) · SolidWorks · FEA · tolerance stack-ups · CNC machining · 3D printing · BLDC control")}
    <div class="kgrid">
      ${fig("images/projects/Cycloidal/cycloidal-main.jpg", "Shoulder-joint prototype with the mjbots moteus controller on the rear housing.", "big")}
      ${fig("images/projects/Cycloidal/cycloidal-exploded.jpg", "Exploded CAD: housing, cycloidal discs, eccentric cam, cross-roller output bearing.", "white wide")}
      ${fig("images/projects/Cycloidal/cycloidal-proto-v2.jpg", "Prototype v2, assembled.")}
      <a class="video" href="${url(k.slug)}" style="background-image:url('${img("images/projects/Cycloidal/cycloidal-plays-poster.jpg")}')"><span>▶ Watch it run (with sound)</span></a>
    </div>
    ${stats(k)}
    <div class="two">
      <div><h4>What I did</h4>${bullets(k.highlights)}</div>
      <div class="side">
        <h4>The problem</h4><p>${esc(k.problem)}</p>
        <h4>Result</h4><p>${esc(k.results)}</p>
      </div>
    </div>
    ${link(k.slug, "Full write-up and video")}
  </section>
  ${footer(2)}
</div>`;

const p3 = `
<div class="page">
  ${half("polysynth-x", [
    fig("images/projects/PolysynthX/polysynthx.jpg", "Sensor PCB, display and the 3D-printed compliant keybed."),
    fig("images/projects/PolysynthX/polysynth-cad.jpg", "CAD of the 12-key prototype over the hall-effect sensor PCB.", "white"),
  ], { meta: "Solo · STM32H7 (Daisy Seed) · C++ real-time DSP · KiCad · Onshape · compliant mechanisms" })}
  ${half("biodiversity-sensing-module", [
    fig("images/projects/BiodiversityTech/BiodiversityTech1.jpg", "The sensing board at the bench.", "tall"),
    fig("images/projects/BiodiversityTech/BiodiversityTech.jpg", "Prototype board on a Seeed XIAO ESP32-S3.", "tall"),
    fig("images/projects/BiodiversityTech/BiodiversityTech2.jpg", "The ESP32-S3 that runs the species-ID model."),
  ], { meta: "Hardware lead · Echeverri Lab, UC Berkeley · ESP32-S3 · edge AI · satellite IoT · solar + buck converters", n: 3, did: getProject("biodiversity-sensing-module").highlights.slice(0, 4), layout: "three" })}
  ${footer(3)}
</div>`;

const p4 = `
<div class="page">
  ${half("eldaeon-passive-radar-system", [
    fig("images/projects/Eldaeon/Eldaeon.jpg", "A radar node: weatherproof case below, antenna on the pan-tilt mount."),
    fig("images/projects/Eldaeon/Eldaeon1.jpg", "The antenna on its pan-tilt mount.", "tall"),
  ], { meta: "Embedded Systems & Hardware Integration Intern · Python · Raspberry Pi · SDR · ADS-B/AIS · AWS · Twilio · mechanism design", n: 3, did: [0, 2, 3].map((i) => getProject("eldaeon-passive-radar-system").highlights[i]), layout: "wide-tall" })}
  ${half("murex-rov", [
    fig("images/projects/MUREX/murex-rov.jpg", "The ROV on the pool deck, February 2024."),
    fig("images/projects/MUREX/murex-presentation.jpg", "Engineering presentation at MATE 2024 (113/100)."),
  ], { meta: "Mechanical Lead · 6-person mechanical team · Onshape · CNC machining · 3D printing · design reviews" })}
  ${footer(4)}
</div>`;

const p5 = `
<div class="page">
  ${half("solar-array-optimization", [
    fig("images/projects/CalSol/CalSol_Excalibur.jpg", "CalSol's solar car on track."),
  ], { meta: "Solar Engineering Project Manager · CalSol, UC Berkeley Solar Racing · bypass diodes · MPPT · SolidWorks", layout: "one" })}
  ${half("compact-automated-aquaponics", [
    fig("images/projects/Aquaponics/AquaponicsDLab.jpg", "The system during the build."),
    fig("images/projects/Aquaponics/AquaponicsDHall.jpg", "Deployed in the dining hall."),
  ], { meta: "Design and build lead · Fusion 360 · sensors · closed-loop control · fabrication" })}
  ${footer(5)}
</div>`;

const sw = (slug, src, cap, meta, did) => {
  const p = getProject(slug);
  return `<section class="sw">
    <a class="swimg" href="${url(slug)}"><img src="${img(src)}" alt=""></a>
    <div>
      <header class="ph"><div><h2><a href="${url(slug)}">${esc(p.title)}</a></h2><p class="tag">${esc(p.tagline)}</p></div><div class="when"><span class="badge">${esc(p.badge)}</span><span>${esc(p.duration)}</span></div></header>
      <p class="meta">${meta}</p>
      ${bullets(did)}
      ${link(slug, "Write-up")}
    </div>
  </section>`;
};
const env = getProject("envoy"), ff = getProject("fantom-finder"), bm = getProject("bommaker");
const p6 = `
<div class="page">
  <h2 class="sect">Software</h2>
  ${sw("envoy", "images/software/envoy-hero.jpg", "", "Full-stack, team of 2 · Next.js · TypeScript · Claude API · Exa · Hunter · Gmail API · Postgres", env.highlights.slice(0, 2))}
  ${sw("fantom-finder", "images/software/fantom-combined.jpg", "", "Software lead, team of 2 · Python · passive radar (blah2) · SDR · Leaflet · Cursor-on-Target / ATAK · ESP32", ff.highlights.slice(0, 2))}
  ${sw("bommaker", "images/software/bommaker-dashboard.jpg", "", "Solo · TypeScript · React · WXT · Chrome extension (MV3) · ExcelJS", bm.highlights.slice(0, 2))}
  <a class="site end" href="${SITE}/projects">
    <img class="qr" src="${img("qr.png")}" alt="">
    <div>
      <p class="l1">More online</p>
      <p class="l2">${short(SITE)}/projects</p>
      <p class="l3">Also: BeacnReach (outreach tool for BEACN), Oski Leases, BuildDash, Graded, NewsFlash, and microplastics research recognized by NASA, the EPA and ISEF.</p>
    </div>
  </a>
  ${footer(6)}
</div>`;

const css = `
@page { size: Letter; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --ink:#15171B; --ink7:#3B3F46; --ink5:#5E636B; --line:#E3E5E8; --paper:#F4F5F6; --sig:#FF5A1F; --sigink:#D33E08; }
html, body { font-family: 'General Sans', system-ui, sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: inherit; text-decoration: none; }
.page { width: 8.5in; height: 11in; padding: 0.5in 0.55in 0.62in; position: relative; overflow: hidden; page-break-after: always; background: #fff; }
.page::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(to right, rgba(21,23,27,.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,23,27,.035) 1px, transparent 1px); background-size: 0.333in 0.333in; z-index: 0; }
.page > :not(footer) { position: relative; z-index: 1; }
.page > footer { z-index: 1; }
footer { position: absolute; left: 0.55in; right: 0.55in; bottom: 0.3in; display: flex; gap: 12px; align-items: center; font: 500 7.5pt 'JetBrains Mono', monospace; color: var(--ink5); border-top: 1px solid var(--line); padding-top: 6px; }
footer a { margin-left: auto; color: var(--sigink); }
footer .pg { color: var(--ink); }
h1, h2, h3, h4 { font-family: 'Clash Display', sans-serif; font-weight: 600; letter-spacing: -0.02em; }
/* cover */
.cover .hero { display: grid; grid-template-columns: 1fr 2.05in; gap: 0.3in; align-items: stretch; }
.kick { font: 500 8pt 'JetBrains Mono', monospace; letter-spacing: .2em; text-transform: uppercase; color: var(--sigink); }
.cover h1 { font-size: 46pt; line-height: .95; margin-top: 10px; letter-spacing: -0.03em; }
.dot { color: var(--sig); }
.role { font-size: 13.5pt; font-weight: 500; margin-top: 8px; }
.sub { font-size: 9.5pt; line-height: 1.5; color: var(--ink7); margin-top: 8px; max-width: 4.3in; }
.avail { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; font-size: 8.5pt; color: var(--ink7); border: 1px solid var(--line); border-radius: 99px; padding: 4px 10px; background: #fff; }
.avail i { width: 7px; height: 7px; border-radius: 50%; background: #10b981; }
.contact { margin-top: 12px; font: 500 7.6pt 'JetBrains Mono', monospace; color: var(--ink7); display: flex; flex-wrap: wrap; gap: 4px 6px; }
.contact a { color: var(--ink); border-bottom: 1px solid rgba(255,90,31,.45); }
.contact span { color: var(--ink5); }
.photo { border-radius: 16px; background-size: cover; background-position: 30% 22%; min-height: 2.5in; }
.site { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center; margin-top: 0.26in; padding: 14px 16px; border-radius: 16px; background: var(--ink); color: #F1F2F4; }
.site .qr { width: 0.95in; height: 0.95in; background: #fff; padding: 6px; border-radius: 8px; }
.site .l1 { font: 500 7.5pt 'JetBrains Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: #FF7A45; }
.site .l2 { font-family: 'Clash Display'; font-weight: 600; font-size: 15pt; margin-top: 3px; letter-spacing: -0.01em; }
.site .l3 { font-size: 8.5pt; line-height: 1.45; color: #C9CDD2; margin-top: 4px; max-width: 4.2in; }
.site .go { font: 500 8pt 'JetBrains Mono', monospace; background: var(--sig); color: #fff; padding: 6px 11px; border-radius: 99px; white-space: nowrap; }
.edu { margin-top: 0.22in; display: grid; grid-template-columns: 1fr 1fr; gap: 0 18px; border-top: 1px solid var(--line); }
.edu div { display: grid; grid-template-columns: 0.62in 1fr; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--line); }
.edu dt { font: 500 7pt 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: .08em; color: var(--ink5); padding-top: 1px; }
.edu dd { font-size: 8.5pt; color: var(--ink7); }
.ix-h { font-size: 13pt; margin-top: 0.22in; }
.ix { list-style: none; margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
.ix a { display: grid; grid-template-columns: 0.9in 1fr auto; gap: 10px; align-items: center; padding: 6px; border: 1px solid var(--line); border-radius: 12px; background: #fff; }
.ix .th { height: 0.62in; border-radius: 8px; background-size: cover; background-position: center; }
.ix .tx b { display: block; font-family: 'Clash Display'; font-weight: 600; font-size: 9.5pt; letter-spacing: -0.01em; }
.ix .tx span { display: block; font-size: 7.4pt; line-height: 1.35; color: var(--ink5); margin-top: 2px; }
.ix .pn { font: 500 8pt 'JetBrains Mono', monospace; color: var(--sigink); padding-right: 4px; }
/* project blocks */
.proj.half { height: 4.82in; display: flex; flex-direction: column; }
.proj.half > * { flex-shrink: 0; }
.proj.half + .proj.half { margin-top: 0.18in; padding-top: 0.16in; border-top: 1px solid var(--line); }
.ph { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.ph h2 { font-size: 17pt; line-height: 1.05; }
.full .ph h2 { font-size: 22pt; }
.tag { font-size: 8.8pt; color: var(--ink7); margin-top: 3px; line-height: 1.4; max-width: 5in; }
.when { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; font: 500 7.5pt 'JetBrains Mono', monospace; color: var(--ink5); white-space: nowrap; }
.badge { background: rgba(255,90,31,.1); color: var(--sigink); padding: 2px 8px; border-radius: 99px; }
.meta { font: 500 7.3pt 'JetBrains Mono', monospace; color: var(--ink5); margin-top: 5px; line-height: 1.5; }
figure { position: relative; border-radius: 10px; overflow: hidden; background: var(--paper); border: 1px solid var(--line); }
figure img { width: 100%; height: 100%; object-fit: cover; display: block; }
figure.white { background: #fff; } figure.white img { object-fit: contain; padding: 6px; }
figcaption { position: absolute; left: 6px; right: 6px; bottom: 6px; font-size: 6.6pt; line-height: 1.3; color: var(--ink7); background: rgba(255,255,255,.92); padding: 3px 6px; border-radius: 6px; }
.figs { display: grid; grid-template-columns: 1.35fr 1fr; gap: 7px; height: 1.85in; margin-top: 8px; }
.figs.three { grid-template-columns: 0.75fr 0.75fr 1.35fr; }
.figs.wide-tall { grid-template-columns: 1.6fr 0.75fr; height: 1.65in; }
.figs.one { grid-template-columns: 1fr; }
.stats { display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; margin-top: 8px; }
.stats.c1 { grid-template-columns: 1fr; } .stats.c2 { grid-template-columns: repeat(2,1fr); } .stats.c3 { grid-template-columns: repeat(3,1fr); } .stats.c4 { grid-template-columns: repeat(4,1fr); }
.stats div { background: #fff; padding: 6px 9px; }
.stats dt { font-family: 'Clash Display'; font-weight: 600; font-size: 14pt; letter-spacing: -0.02em; line-height: 1; }
.stats dd { font-size: 7pt; line-height: 1.3; color: var(--ink5); margin-top: 3px; }
.did { list-style: none; margin-top: 8px; display: grid; gap: 4px; }
.did li { position: relative; padding-left: 11px; font-size: 8.3pt; line-height: 1.42; color: var(--ink7); }
.did li::before { content: ""; position: absolute; left: 0; top: 0.5em; width: 4px; height: 4px; border-radius: 50%; background: var(--sig); }
.did b { color: var(--ink); font-weight: 600; }
.more { margin-top: auto; display: flex; gap: 8px; align-items: baseline; padding-top: 6px; font-size: 7.8pt; }
.more span:first-child { font-weight: 600; }
.more .u { font-family: 'JetBrains Mono'; font-size: 7.2pt; color: var(--sigink); border-bottom: 1px solid rgba(255,90,31,.4); }
.more .ar { color: var(--sigink); }
/* kinema */
.kgrid { display: grid; grid-template-columns: 1.55fr 1fr 1fr; grid-template-rows: 2.3in 2.3in; gap: 7px; margin-top: 10px; }
.kgrid .big { grid-row: span 2; }
.kgrid .wide { grid-column: span 2; }
.video { position: relative; border-radius: 10px; overflow: hidden; background-size: cover; background-position: center; display: flex; align-items: flex-end; border: 1px solid var(--line); }
.video span { margin: 6px; background: var(--ink); color: #fff; font: 500 7pt 'JetBrains Mono', monospace; padding: 4px 8px; border-radius: 99px; }
.full .stats { margin-top: 10px; } .full .stats dt { font-size: 18pt; }
.two { display: grid; grid-template-columns: 1.45fr 1fr; gap: 0.25in; margin-top: 12px; }
.two h4 { font-size: 11pt; } .two .side p { font-size: 8.8pt; line-height: 1.5; color: var(--ink7); margin: 3px 0 10px; }
.full .did { margin-top: 6px; gap: 6px; } .full .did li { font-size: 9pt; }
.full .more { margin-top: 12px; }
/* software */
.sect { font-size: 22pt; }
.sw { display: grid; grid-template-columns: 2.4in 1fr; gap: 0.2in; padding: 0.16in 0; border-bottom: 1px solid var(--line); }
.swimg { display: block; border-radius: 10px; overflow: hidden; border: 1px solid var(--line); height: 1.5in; background: var(--paper); }
.swimg img { width: 100%; height: 100%; object-fit: cover; object-position: top left; }
.sw .ph h2 { font-size: 14pt; }
.sw .did li { font-size: 7.9pt; }
.chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
.chips span { font-size: 7pt; color: var(--ink5); background: var(--paper); border: 1px solid var(--line); border-radius: 6px; padding: 2px 6px; }
.chips b { color: var(--ink); font-family: 'Clash Display'; font-weight: 600; }
.sw .more { margin-top: 6px; }
.site.end { margin-top: 0.2in; }
.site.end .go { background: transparent; border: 1px solid rgba(241,242,244,.3); color: #F1F2F4; }
`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@600&f[]=general-sans@400,500,600&display=block" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">
<style>${css}</style></head><body>${cover}${kinema}${p3}${p4}${p5}${p6}</body></html>`;

const htmlPath = path.join(path.dirname(outPdf), "portfolio.html");
fs.writeFileSync(htmlPath, html);
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
// Overflow guard: report any project block whose content spills past its box
const spill = await page.evaluate(() =>
  [...document.querySelectorAll(".proj, .page")].filter((e) => e.scrollHeight > e.clientHeight + 2).map((e) => (e.querySelector("h2")?.textContent || e.className) + ` ${e.scrollHeight}>${e.clientHeight}`)
);
if (spill.length) console.log("OVERFLOW:", spill);
await page.pdf({ path: outPdf, printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("wrote", outPdf, Math.round(fs.statSync(outPdf).size / 1024) + " KB");
