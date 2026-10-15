// Original business videos use inline players; unconfigured slots may use official Instagram embeds.
export function initReels(){
 const section=document.querySelector('.reels-section');if(!section)return;
 initNativeReels(section);
 if(!section.querySelector('.instagram-media')){section.querySelector('.reels-status').textContent='Videos play here, muted on repeat. Tap a video to turn sound on or off.';return}
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
  const status=video.parentElement.querySelector('.native-reel-status'),hint=video.parentElement.querySelector('.video-sound-hint');let visible=false,userPaused=false;
  const name=video.getAttribute('aria-label')?.replace(/^Turn on sound for /,'')||'this video';
  const updateSound=()=>{video.setAttribute('aria-pressed',String(!video.muted));video.setAttribute('aria-label',`${video.muted?'Turn on':'Mute'} sound for ${name}`);if(hint)hint.textContent=video.muted?'Tap for sound ♫':'Sound on ♫'};
  const toggleSound=()=>{const unmute=video.muted;if(unmute)section.querySelectorAll('.native-reel-video').forEach(other=>{if(other!==video)other.muted=true});video.muted=!unmute;updateSound();if(video.paused){userPaused=false;video.play().then(()=>status.hidden=true).catch(()=>{status.textContent='Tap again to play this video.';status.hidden=false})}};
  video.addEventListener('click',toggleSound);video.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleSound()}});video.addEventListener('volumechange',updateSound);
  video.muted=true;video.loop=true;video.playsInline=true;updateSound();
  const sync=()=>{if(!visible||document.hidden||reduced.matches||navigator.connection?.saveData){video.pause();return}if(userPaused)return;video.play().then(()=>status.hidden=true).catch(()=>{status.textContent='Tap this video to play.';status.hidden=false})};
  video.addEventListener('pause',()=>{if(visible&&!document.hidden&&!reduced.matches)userPaused=true});
  video.addEventListener('play',()=>{userPaused=false;status.hidden=true});
  video.addEventListener('error',()=>{status.textContent='This video could not load. Please try again shortly.';status.hidden=false});
  if('IntersectionObserver'in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.35}).observe(video)}else{visible=true;sync()}
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 });
}
