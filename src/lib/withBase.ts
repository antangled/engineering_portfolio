// Prefix a public asset path with Vite's configured base URL so assets resolve
// correctly both locally (/) and on GitHub Pages (/engineering_portfolio/).
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${clean}`;
}
