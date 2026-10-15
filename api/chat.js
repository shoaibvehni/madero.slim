import { retrieveKnowledge, SYSTEM_PROMPT } from '../lib/knowledge.js';
const windows=new Map();
export function createHandler({fetcher=fetch,env=process.env,now=Date.now}={}){
 return async function handler(req,res){
  const respond=(code,data)=>{res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');return res.status(code).json(data)};
  if(req.method!=='POST'){res.setHeader('Allow','POST');return respond(405,{message:'Please send a chat message using POST.'})}
  const origin=req.headers.origin;
  if(origin){try{const host=req.headers['x-forwarded-host']||req.headers.host;if(new URL(origin).host!==host)return respond(403,{message:'Please open the concierge from the Madero Slim website.'})}catch{return respond(403,{message:'Invalid request origin.'})}}
  if(!String(req.headers['content-type']||'').includes('application/json'))return respond(415,{message:'Please send a JSON request.'});
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body}catch{return respond(400,{message:'That message could not be read. Please try again.'})}
  if(!body||!Array.isArray(body.messages)||!body.messages.length||body.messages.length>12)return respond(400,{message:'Please send a short conversation with up to 12 messages.'});
  if(body.messages.some(m=>!m||!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>(m.role==='user'?1200:5000)))return respond(400,{message:'Please keep each message short and try again.'});
  if(body.messages.at(-1).role!=='user'||JSON.stringify(body).length>22000)return respond(400,{message:'Please send a shorter message.'});
  const key=env.GROQ_API_KEY;
  if(!key)return respond(503,{code:'AI_NOT_CONFIGURED',message:'Our AI concierge is not available yet. The Madero Slim team can help you on WhatsApp.'});
  // Best-effort per-instance throttling. Provider limits also apply; see deployment docs.
  const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();const time=now();
  for(const [id,entry] of windows)if(time-entry.start>60000)windows.delete(id);
  const window=windows.get(ip)||{start:time,count:0};if(window.count>=8){res.setHeader('Retry-After','60');return respond(429,{message:'A little pause, please. Try again in a minute or contact us on WhatsApp.'})}window.count++;windows.set(ip,window);
  if(windows.size>5000)windows.delete(windows.keys().next().value);
  const messages=body.messages.map(m=>({role:m.role,content:m.content.trim()}));
  const {context,sources}=retrieveKnowledge(messages);const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{
   const upstream=await fetcher('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({model:env.GROQ_MODEL||'openai/gpt-oss-20b',messages:[{role:'system',content:SYSTEM_PROMPT+'\n\nBUSINESS KNOWLEDGE:\n'+context},...messages],temperature:.35,max_completion_tokens:900,reasoning_effort:'low'})});
   if(!upstream.ok){if(upstream.status===429){res.setHeader('Retry-After','60');return respond(429,{message:'Our AI concierge is busy right now. Please try again shortly or reach the team on WhatsApp.'})}return respond(502,{message:'Our AI concierge is temporarily unavailable. Our team can help on WhatsApp.'})}
   const data=await upstream.json();const reply=data.choices?.[0]?.message?.content;
   if(typeof reply!=='string'||!reply.trim())return respond(502,{message:'We could not finish that reply. Please try again or reach us on WhatsApp.'});
   return respond(200,{reply:reply.trim().slice(0,5000),sources});
  }catch{return respond(503,{message:'The concierge could not connect right now. Please try again or message our team on WhatsApp.'})}finally{clearTimeout(timer)}
 };
}
export default createHandler();
