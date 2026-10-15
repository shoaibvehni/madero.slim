from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import json,re,subprocess
from PIL import Image
root=Path(__file__).parent/'dist'
class Check(HTMLParser):
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  for key in ['href','src']:
   url=d.get(key,'')
   if url and not url.startswith(('https:','http:','tel:','#','data:')):
    assert (root/urlparse(url).path.lstrip('/')).is_file(),f'Missing: {url}'
for p in root.glob('*.html'):
 s=p.read_text();Check().feed(s)
 assert '<title>' in s and 'name="viewport"' in s and s.count('<main ')==1
 assert 'manifest.webmanifest' in s and 'type="module"' in s
 if p.stem not in ['404','offline']:assert 'privacy.html' in s
for name in ['index','services','gallery','team','reviews','booking','contact','about','privacy','face-lifting','deep-detox','lymphatic-drainage','madero-therapy','deep-tissue','cupping','head-shoulder-feet','hot-stone','404','offline']:
 assert (root/f'{name}.html').exists()
for p in (root/'assets').iterdir():
 assert p.stat().st_size>1000
 with Image.open(p) as image:image.verify()
for size in [192,512]:assert Image.open(root/f'assets/icon-{size}.png').size==(size,size)
manifest=json.loads((root/'manifest.webmanifest').read_text())
assert manifest['display']=='standalone' and manifest['scope']=='/'
for icon in manifest['icons']:assert (root/icon['src'].lstrip('/')).exists()
config=json.loads(Path('vercel.json').read_text());assert config['outputDirectory']=='dist'
assert config['functions']['api/chat.js']['includeFiles']=='knowledge/**'
for p in [*root.glob('*.js'),Path('api/chat.js'),Path('lib/knowledge.js')]:subprocess.run(['node','--check',str(p)],check=True)
home=(root/'index.html').read_text();assert 'desktop-experience' in home and 'mobile-experience' in home and 'sculpture' not in re.findall(r'<canvas[^>]*>',home)
assert len(re.findall('data-category=',home))==8
assert '18px/1.65' in (root/'styles.css').read_text()
assert 'prefers-reduced-motion' in (root/'styles.css').read_text()
for p in root.glob('*.js'):assert 'Bearer ' not in p.read_text() and 'GROQ_API_KEY' not in p.read_text()
print('PASS: 17 content pages + 404/offline; internal links; real image decoding; PWA manifest/icons; Vercel API config; separate mobile/desktop markup; JS syntax; no browser-side API secret')
