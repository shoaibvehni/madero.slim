from pathlib import Path
from html.parser import HTMLParser
import subprocess
root=Path(__file__).parent/'dist'
class Check(HTMLParser):
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  for key in ['href','src']:
   url=d.get(key,'')
   if url and not url.startswith(('https:','http:','tel:','#','data:')):
    assert (root/url.split('#')[0]).is_file(),f'Missing: {url}'
for p in root.glob('*.html'):
 s=p.read_text(); c=Check();c.feed(s)
 assert '<title>' in s and 'name="viewport"' in s
 assert s.count('<main ')==1
for name in ['index','services','gallery','team','reviews','booking','contact','about','privacy','face-lifting','deep-detox','lymphatic-drainage','madero-therapy','deep-tissue','cupping','head-shoulder-feet','hot-stone']:
 assert (root/f'{name}.html').exists()
for p in (root/'assets').iterdir():assert p.stat().st_size>1000
subprocess.run(['node','--check',str(root/'app.js')],check=True)
print('PASS: 17 content pages, all internal links and local assets, metadata and JavaScript syntax')
