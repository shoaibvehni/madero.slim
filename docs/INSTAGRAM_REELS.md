# Instagram integration

Account: https://www.instagram.com/madero.slim/

Public profile inspected on 15 October 2026 through its rendered post grid. These three links were present:

- https://www.instagram.com/madero.slim/reel/Dec9bDmgDRE/
- https://www.instagram.com/madero.slim/reel/DeXw4k9o0Hc/
- https://www.instagram.com/madero.slim/reel/DeUmRr6oyJY/

The site uses Instagram native blockquote markup and official embed.js, rather than third-party players or downloaded copies. Three curated embeds appear on Home and Gallery. The embed script loads near the viewport; direct links remain even if a post is removed, private, unavailable or restricted. Third-party Instagram responses are outside the service-worker cache.

Official integration reference: https://developers.facebook.com/documentation/instagram-platform/oembed

Captions and embed settings could not be inspected because individual posts displayed a sign-in prompt. Playback therefore requires a live visitor check; profile membership was verified, but universal playback is not claimed. The code does not attempt an automatic account feed or bypass Instagram restrictions.
