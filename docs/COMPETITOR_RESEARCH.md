# Madero Slim redesign: research and implementation

Research date: 15 October 2026. These are relevant benchmarks, not a claim that any one brand is objectively the world's best. Official public pages were reviewed for content, service presentation and booking flow; this was not a pixel-by-pixel browser audit. No competitor copy, testimonials, prices or photographs were reused.

| Benchmark | Evidence from its public site | Relevant pattern | Madero implementation |
| --- | --- | --- | --- |
| [Aman wellness](https://www.aman.com/wellness) | Wellness journeys, treatment photography and dedicated treatment/retreat pages | An immersive introduction followed by more specific care options | Prominent wellness photography, a restrained cream/gold/green identity, dedicated pages for eight rituals |
| [Six Senses wellness](https://www.sixsenses.com/en/wellness-spa/) | Personalised wellness programs and individual treatment experiences | Explain the experience and personal preferences before asking the visitor to commit | Clear session descriptions, comfort guidance, care preferences and direct booking |
| [Ruuby home massage](https://ruuby.com/at-home-treatments/massage) | Location → treatment → booking steps, treatment prices and FAQs | A short route from browsing to a suitable appointment | Category filters, visible duration and AED price, selected-treatment booking, mobile Book action |
| [Ruuby UAE menu](https://www.ruuby.com/UAE-ruuby-price-menu) | UAE treatment durations, starting prices, app and WhatsApp booking choices | Make price and contact channels easy to find | Consistent AED pricing, WhatsApp with prefilled treatment/city, installable PWA, online booking handoff |
| [Urban Company Dubai spa](https://www.urbancompany.com/dubai-spa-at-home) | Dubai home massage categories, therapist/service information and booking | Clarify who the service is for and where it is offered | Ladies/couples and Dubai/Sharjah/Ajman visible early; accurate hours and service-area guidance |

## Before and after

| Issue | Previous implementation | Revised implementation |
| --- | --- | --- |
| Readability | Many body/UI elements at 9–13 px | Desktop base 18 px, main copy 17–19 px, key form controls 16 px; tiny type reserved for secondary photo credits |
| Treatment discovery | Repeated decorative symbols | Real service-related photos, readable cards, categories, price/duration and booking actions |
| Desktop motion | Spinning canvas shape | CSS perspective photo layer and a wooden massage-tool motif; pointer tilt on desktop only |
| Mobile motion | Scaled desktop canvas | Separate mobile DOM, photo sequence, swipe/dot controls and breathing detail; autoplay stops offscreen, hidden or reduced-motion |
| Mobile actions | Floating WhatsApp and desktop navigation | Dedicated four-action app dock, 44–54 px targets, full-screen concierge |
| App access | No PWA | Manifest, icons, installation guidance, standalone mode and offline screen |
| Assistance | No conversational endpoint | Real server-side Groq model call using business documents and conversation context, with accurate missing-key/failure states |

## Photo choices

Five free Unsplash photographs were downloaded, inspected and bundled locally. They illustrate massage, wooden-tool massage, facial care and spa essentials. They are labelled as illustrative, not Madero clients or staff. The existing three supplied business photos remain in the separate rotating business gallery. Asset sources and photographer credits: `ASSET_CREDITS.md`.

## AI implementation sources

- [Groq rate limits and free-plan availability](https://console.groq.com/docs/rate-limits)
- [GPT OSS 20B on Groq](https://console.groq.com/docs/model/openai/gpt-oss-20b)
- [Groq API reference](https://console.groq.com/docs/api-reference)
- [Groq deprecations](https://console.groq.com/docs/deprecations): older Llama IDs are not used as the default.
- [Vercel Node.js functions](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json)

The selected model is `openai/gpt-oss-20b` via Groq. This is an AI concierge, not the ChatGPT product. Free-plan quotas are limited and can change. An owner-provided server-side API key is required; no key was supplied during implementation. This uses business-context grounding and retrieval; it does not falsely claim that model weights have been fine-tuned.
