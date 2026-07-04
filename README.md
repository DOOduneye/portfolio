# davidoduneye.com

Personal website for David Oduneye — software engineer. Static site built with
[Astro](https://astro.build), deployed to GitHub Pages.

Typography does the work: near-monochrome, one accent color, dark by default
(light follows the system preference), no client-side JavaScript.

## Structure

```
src/
  layouts/           # base HTML shell
  pages/             # routes: / (experience + projects), 404
  styles/            # design tokens + global styles
```

## Development

```bash
npm install
npm run dev       # dev server
npm run build     # static build to dist/
npm run preview   # serve the build locally
```

## Deploying

Pushes to the `v1` branch build and deploy to the `gh-pages` branch via
GitHub Actions. To publish a post, add a markdown file to
`src/content/writing/` and push.
