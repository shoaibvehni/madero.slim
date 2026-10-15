# madero.slim

Madero Slim UAE wellness website, redesigned for readable desktop browsing and a separate mobile app experience. 17 content pages, eight treatment pages, real service-related Unsplash photography, an installable PWA and a server-side conversational AI concierge.

## Deploy on Vercel

Import `shoaibvehni/madero.slim`, use branch `main`, and keep **Root Directory** blank or `.`. The root `vercel.json` selects **Other**, serves the committed `dist/` directory, skips dependency installation/build, and deploys `api/chat.js` as a Node.js function. Do not move the root to `dist`; the API, knowledge documents and configuration live at repository root.

If an old deployment shows `404 NOT_FOUND`, check the root setting and open a new deployment of the latest `main` commit. Old deployment URLs retain their old code. With Vercel Git integration enabled, a push to `main` triggers deployment automatically.

## Activate the AI concierge

1. Create a key in your [Groq account](https://console.groq.com/keys). Groq has a limited free plan; the owner controls plan selection and limits.
2. In **Vercel → Project Settings → Environment Variables**, add `GROQ_API_KEY` for the desired environments. Never paste it into frontend code, chat messages, the repository, or a public config file.
3. Optionally set `GROQ_MODEL=openai/gpt-oss-20b` (the current default). If changing to a different model, ensure it supports the request parameters used by `api/chat.js`.
4. Redeploy. Ask the concierge a question such as “How much is Madero therapy?” and a follow-up such as “Do you serve Ajman?” to verify the live provider connection.

The UI is a genuine conversational interface, not a hard-coded FAQ matcher. Its Vercel API route calls Groq with conversation history plus the business profile and full treatment menu. Source links are selected by a small retrieval layer. Business knowledge lives in `knowledge/business.md` and `knowledge/treatments.md`; update these when facts change. This is contextual grounding, not model-weight fine-tuning. It is not the ChatGPT product.

No real API key was supplied during implementation. Missing keys, network failures and quota limits produce clear unavailable/error states and a WhatsApp handoff; no fake AI reply is generated. Live model output has not been validated yet.

Messages are stored only in the current browser tab's `sessionStorage` for page-to-page conversation continuity and can be removed with **New chat**. Requests go to the Vercel function and Groq. The app does not persist chat logs to a database. Best-effort throttling is per function instance (8 requests/minute/IP), not a distributed abuse barrier. Provider limits still apply; configure Vercel firewall/rate limiting for a public high-traffic release.

## PWA installation

- Android/desktop Chrome or Edge: use **Get the Madero app** or the browser's install option when offered.
- iOS/iPadOS: Safari → Share → Add to Home Screen.
- HTTPS is required (localhost is accepted for local development).
- Opens in standalone mode with branded icons and a mobile action bar. This is a web app, not an APK or App Store listing.
- The service worker caches the app shell and previously opened pages. Unknown offline pages show an offline screen. Booking, WhatsApp and AI chat require a connection. `/api/` and POST requests are never cached.
- New service-worker versions wait for existing app tabs to close; reopen the app to use an installed update.

The PWA and `/api/chat` paths assume deployment at the origin root, as on Vercel. GitHub project Pages is not the full-app deployment target and cannot run the serverless chat function.

## Development

Requires Node.js 22+ and Python 3 (Pillow for the image checks).

```sh
python3 build.py
npm test
python3 verify.py
npm run dev
```

`npm run dev` serves both the static site and chat endpoint at `http://localhost:8080`. For local AI requests, set `GROQ_API_KEY` securely in the shell environment before starting the server. No dependencies are needed.

- `build.py`: page generator and treatment content. Run after editing page markup/copy.
- `dist/styles.css`: redesigned typography, layout and desktop/mobile motion styles.
- `dist/app.js`: navigation, service filters, separate responsive animation controllers, booking selection and service worker registration.
- `dist/concierge.js`: accessible chat interface, conversation history and API requests.
- `dist/install.js`, `dist/sw.js`, `dist/manifest.webmanifest`: installation and offline behaviour.
- `api/chat.js`, `lib/knowledge.js`, `knowledge/`: server-only model integration and grounding.
- `tests/`: meaningful API and service worker tests with mocked provider/network responses.

## Verification and limits

16 automated tests pass, including direct contact links, native Reel markup, lazy loading and embed-error fallback, plus: message validation, provider request/context, missing key, rate limits, errors, menu completeness, app-shell existence, offline fallback and API cache exclusion. Static verification checks all page links, image decoding, icon dimensions, manifest, API config and JavaScript syntax. API credentials are absent from browser code.

Browser visual QA, a real device installation, live Vercel deployment and live AI calls could not be performed in this environment. The repository includes the implementation and explicit activation steps, not a claim that these live checks passed.

## Research

[Competitor research and before/after comparison](docs/COMPETITOR_RESEARCH.md) · [Image credits](docs/ASSET_CREDITS.md)

## Direct contact and Instagram Reels

WhatsApp for info and Talk on Instagram buttons appear on every page, separate from booking and AI chat. On desktop they sit at the lower left opposite the concierge. On mobile they form a compact contact strip above the app navigation. The homepage also has direct contact links beside the introduction.

Home and Gallery show three curated public Reels from `@madero.slim` using native `instagram-media` markup and Instagram's official `https://www.instagram.com/embed.js`. The script loads only as the Reel section approaches the viewport. No video files are downloaded, mirrored, proxied or cached. Each Reel keeps a permanent direct Instagram link if the embed is blocked or unavailable. Instagram controls availability and playback.

Edit the `REELS` list in `build.py`, then regenerate pages to change the selection. These are curated embeds, not an automatic latest-post feed. The selected permalinks were observed on the business's public profile; Instagram required sign-in to inspect individual Reel captions in this environment, so headings are editorial rather than quotes from captions.

## AI verification and conversational behaviour

The concierge now supports short general explanations, arithmetic, writing and translation as well as business questions. Business facts remain grounded in the supplied documents. Successful model responses include `ai.provider`/`ai.model` metadata and `X-Madero-AI-Provider`/`X-Madero-AI-Model` response headers, plus an AI-generated label in the chat UI. These are only set after a successful upstream model call. No secrets are returned.

A live production API request on 15 October 2026 returned HTTP 200 and combined AED 350 + AED 250 services into an AED 600 / 150-minute plan. This confirms that the configured production API is reachable and producing model-generated replies; it does not guarantee factual correctness of every reply.

Useful conversational tests: ask for two sessions under AED 600; then change the budget and ask for an alternative; then ask for an Arabic booking message. To inspect the transport, check the `/api/chat` response in browser developer tools. Random off-topic refusal is not evidence that AI is missing; the system prompt determines topic boundaries.

For true autoplay/looping videos hosted on the website, see [original video setup](docs/INSTAGRAM_REELS.md). Three original MP4 files have now been supplied and are served inline from this website with muted autoplay, looping, tap-to-toggle sound and poster images. Instagram links are optional profile links, not the video player.


## Uploaded treatment videos

Three user-supplied 720×1280 H.264/AAC videos are now included in `dist/assets/reels/`. They were remuxed losslessly with fast-start metadata, with JPEG poster frames extracted. The home and gallery pages use native video players rather than Instagram embeds. All three outputs passed a full FFmpeg decode check. Videos play muted on repeat while visible; tap toggles sound on or off. Browser autoplay restrictions can still require a tap. MP4s are not cached offline.
