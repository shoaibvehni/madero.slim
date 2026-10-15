// Official Instagram native embeds. No video files, scraping, API tokens or mirrored players.
export function initReels(){
 const section=document.querySelector('.reels-section');if(!section)return;
 const status=section.querySelector('.reels-status');let started=false;
 const load=()=>{if(started)return;started=true;
  const ready=()=>{window.instgrm?.Embeds?.process();status.textContent='Reels are hosted by Instagram. If a player does not load, use the direct Reel link below it.'};
  if(window.instgrm?.Embeds){ready();return}
  const script=document.createElement('script');script.src='https://www.instagram.com/embed.js';script.async=true;script.onload=ready;script.onerror=()=>{status.textContent='Instagram could not load here. You can still watch each Reel using its Instagram link.'};document.body.append(script);
 };
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();load()}},{rootMargin:'150px'});observer.observe(section)}else load();
}
