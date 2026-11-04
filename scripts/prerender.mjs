// Post-build: write one static HTML file per route so GitHub Pages answers every page with
// HTTP 200 (not the 404.html fallback) and each page has its own title + link-preview card.
// The React app still boots and routes client-side as before.
import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";

const ORIGIN = "https://antangled.github.io";
const BASE = "/engineering_portfolio/";
const dist = path.resolve("dist");
const abs = (p) => (p.startsWith("http") ? p : ORIGIN + (p.startsWith(BASE) ? p : BASE + p.replace(/^\//, "")));

// Load the site's own data (TypeScript) so titles and covers never drift from the pages.
const out = await build({
  entryPoints: ["src/data/projects.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  define: { "import.meta.env.BASE_URL": JSON.stringify(BASE) },
});
const { projects } = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function render({ route, title, description, image }) {
  const url = ORIGIN + BASE + route.replace(/^\//, "");
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Adam Tang" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${abs(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${abs(image)}" />`,
  ].join("\n    ");
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace("<!--page-meta-->", tags);
}

function write(file, html) {
  const f = path.join(dist, file);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

const home = {
  route: "",
  title: "Adam Tang — Mechatronics & Embedded Systems Engineer",
  description:
    "UC Berkeley EECS. Cycloidal actuators, passive radar, PCBs and firmware — open to Spring + Summer 2027 co-ops and internships.",
  image: "/images/og-home.jpg",
};
write("index.html", render(home));
write("404.html", render(home));

const gallery = {
  route: "projects",
  title: "Projects — Adam Tang",
  description: "Hardware and software I've built: actuators, radar, synths, sensor nodes, an underwater ROV, and AI tools.",
  image: "/images/og-home.jpg",
};
// Both forms, so /projects works whether or not the host adds a trailing slash.
write("projects.html", render(gallery));
write("projects/index.html", render(gallery));

let n = 0;
for (const p of projects) {
  const page = render({
    route: `projects/${p.slug}`,
    title: `${p.title} — Adam Tang`,
    description: p.tagline,
    image: p.cover || "/images/og-home.jpg",
  });
  write(`projects/${p.slug}.html`, page);
  write(`projects/${p.slug}/index.html`, page);
  n++;
}
console.log(`prerender: home, 404, projects + ${n} project pages`);
