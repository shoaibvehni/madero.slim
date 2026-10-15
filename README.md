# madero.slim

Premium, responsive Madero Slim UAE wellness website.

## Run locally

No dependencies or build step required. Run `python3 -m http.server 8080 --directory dist` and open http://localhost:8080.

## Edit

- `build.py`: page copy, eight services, prices and shared page markup. Run `python3 build.py` after editing.
- `dist/styles.css`: responsive styling, typography and motion.
- `dist/app.js`: self-contained canvas 3D sculpture, gallery, navigation and booking handoff.
- `dist/assets/`: supplied logo and three business photos.

## Features

17 content pages; eight treatment detail pages; Setmore booking handoff; WhatsApp business link and tailored booking message; tap-to-call; Instagram and Google listing links; three-photo rotating gallery with pause and keyboard-accessible controls; reduced-motion support; responsive navigation.

No fabricated testimonials, appointments, body results or extra gallery photos. Instagram video access is linked out because source reel files were not supplied.

## Hosting

Deploy `dist/` to any static host. GitHub Pages workflow is included and requires Pages source **GitHub Actions** in repository Settings → Pages. Native Sites hosting metadata is in `.openai/hosting.json`.

## Verification

Run `python3 verify.py` for internal links, required pages, assets, service prices and script syntax checks. Browser visual QA was unavailable in the managed environment.
