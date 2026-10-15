// Local-only server for exercising both the static site and the real server-side chat route.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import handler from './api/chat.js';
const root=path.resolve('dist');const types={'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.webmanifest':'application/manifest+json'};
http.createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname==='/api/chat'){let text='';for await(const chunk of req){text+=chunk;if(text.length>24000){res.writeHead(413);res.end('Too large');return}}req.body=text;res.status=code=>{res.statusCode=code;return res};res.json=data=>res.end(JSON.stringify(data));await handler(req,res);return}const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}try{const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data)}catch{res.writeHead(404,{'Content-Type':'text/html'});res.end(await readFile(path.join(root,'404.html')))}}).listen(8080,'127.0.0.1',()=>console.log('Madero Slim: http://localhost:8080'));
