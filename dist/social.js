// Official Instagram native embeds. No video files, scraping, API tokens or mirrored players.
export function initReels(){
 const section=document.querySelector('.reels-section');if(!section)return;
 initNativeReels(section);
 if(!section.querySelector('.instagram-media')){section.querySelector('.reels-status').textContent='Videos play here, muted on repeat. Use the player controls for sound or to pause.';return}
 const status=section.querySelector('.reels-status');let started=false;
 const load=()=>{if(started)return;started=true;
  const ready=()=>{window.instgrm?.Embeds?.process();status.textContent='Reels are hosted by Instagram. If a player does not load, use the direct Reel link below it.'};
  if(window.instgrm?.Embeds){ready();return}
  const script=document.createElement('script');script.src='https://www.instagram.com/embed.js';script.async=true;script.onload=ready;script.onerror=()=>{status.textContent='Instagram could not load here. You can still watch each Reel using its Instagram link.'};document.body.append(script);
 };
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();load()}},{rootMargin:'150px'});observer.observe(section)}else load();
}

// Used only for business-provided original media, never to control Instagram's cross-origin player.
export function initNativeReels(section){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 section.querySelectorAll('.native-reel-video').forEach(video=>{
  const status=video.parentElement.querySelector('.native-reel-status');let visible=false,userPaused=false;
  video.muted=true;video.loop=true;video.playsInline=true;
  const sync=()=>{if(!visible||document.hidden||reduced.matches||navigator.connection?.saveData){video.pause();return}if(userPaused)return;video.play().then(()=>status.hidden=true).catch(()=>{status.textContent='Tap Play to watch this video.';status.hidden=false})};
  video.addEventListener('pause',()=>{if(visible&&!document.hidden&&!reduced.matches)userPaused=true});
  video.addEventListener('play',()=>{userPaused=false;status.hidden=true});
  video.addEventListener('error',()=>{status.textContent='This video could not load. Please try again shortly.';status.hidden=false});
  if('IntersectionObserver'in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.35}).observe(video)}else{visible=true;sync()}
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 });
}
