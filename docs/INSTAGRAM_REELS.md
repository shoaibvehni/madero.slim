# Instagram integration

Account: https://www.instagram.com/madero.slim/

Public profile inspected on 15 October 2026 through its rendered post grid. These three links were present:

- https://www.instagram.com/madero.slim/reel/Dec9bDmgDRE/
- https://www.instagram.com/madero.slim/reel/DeXw4k9o0Hc/
- https://www.instagram.com/madero.slim/reel/DeUmRr6oyJY/

The site uses Instagram native blockquote markup and official embed.js, rather than third-party players or downloaded copies. Three curated embeds appear on Home and Gallery. The embed script loads near the viewport; direct links remain even if a post is removed, private, unavailable or restricted. Third-party Instagram responses are outside the service-worker cache.

Official integration reference: https://developers.facebook.com/documentation/instagram-platform/oembed

Captions and embed settings could not be inspected because individual posts displayed a sign-in prompt. Playback therefore requires a live visitor check; profile membership was verified, but universal playback is not claimed. The code does not attempt an automatic account feed or bypass Instagram restrictions.

## Continuous inline playback

Instagram embeds are hosted and controlled by Instagram; this site cannot reliably force their internal player to autoplay, repeat or avoid Instagram navigation. Do not add invented autoplay URL parameters or attempt cross-origin player manipulation.

For full on-site playback, provide original business-owned MP4/WebM files (or stable public HTTPS URLs for those files). Add a mapping in root `reel-media.json`, for example:

```json
{
  "Dec9bDmgDRE": "assets/reels/madero-session.mp4"
}
```

Place that original file under `dist/assets/reels/`, then run `python3 build.py` and deploy. This replaces only that Reel's Instagram player with an actual HTML video. The player is muted, inline, looping and set to autoplay while visible. Playback pauses when the page or video is hidden and honours a visitor's manual pause, reduced-motion preference and data-saving setting. Native controls allow play/pause and sound; a blocked autoplay attempt shows a tap-to-play hint. The original Instagram link remains secondary.

No original business video files were supplied during this change, so `reel-media.json` is intentionally empty and the current live videos still use Instagram embeds. Continuous inline playback is prepared but cannot be activated until original media is provided. MP4 files should be web-optimised (H.264 video/AAC audio, fast-start) and sized appropriately for the hosting plan. Videos are not added to the offline cache.
