import sys, datetime
from playwright.sync_api import sync_playwright
from cap import *
JOBS={
 'R3':dict(url='https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698',
   file='R3-vitalik-rollup-centric-roadmap.png', start='A rollup-centric ethereum roadmap', end='There are a few things that follow from this:',
   hl=['the Ethereum ecosystem is likely to be all-in on rollups (plus some plasma and channels) as a scaling strategy','users have their primary accounts, balances, assets, etc entirely inside an L2'], padX=80,padT=30,padB=8,padY=0),
 'R4':dict(url='https://kasmagazine.com/article/sneakpeaks-and-developments',
   file='R4-kasmagazine-obsolete-path-quote.png', start='Yonatan on vProgs', end='Yonatan also clarified that vProgs should not be viewed', 
   hl=['avoid the obsolete path of L2’s'], padX=70,padT=10,padB=8,padY=0),
 'R8':dict(url='https://kasmagazine.com/article/sneakpeaks-and-developments',
   file='R8-kasmagazine-covenant-fork-3-6-months.png', start='Yonatan Sompolinsky also commented that he expects', end='100 blocks per second (BPS).',
   hl=['three to six months'], padX=70,padT=8,padB=8,padY=0),
 'R5a':dict(url='https://docs.kaspa.org/toccata', file='R5a-docs-kaspa-toccata-activation.png',
   start='Toccata Dev Guide', end='DAA score', hl=['active on mainnet as of June 30, 2026, at DAA score'], padX=120,padT=30,padB=8,padY=0),
 'R5b':dict(url='https://docs.kaspa.org/toccata', file='R5b-docs-kaspa-toccata-zk-precompiles.png',
   start='Before Toccata, a Kaspa script could protect', end='The result is still UTXO-native', hl=['direct verification of Groth16 and RISC Zero Succinct proofs inside script'], padX=120,padY=60),
 'R7':dict(url='https://kaspa.org/build', file='R7-kaspa-org-build-vprogs-in-construction.png',
   start='vProgs: Based Apps', end='Full vProgs remain a future direction', hl=['In construction','Full vProgs remain a future direction'], extra='card', padX=40,padT=12,padB=12,padY=0),
}
which=sys.argv[1:]
with sync_playwright() as p:
    b=p.chromium.launch()
    for k in which:
        j=JOBS[k]
        c=b.new_context(user_agent=UA,viewport={'width':1920,'height':1080},device_scale_factor=2)
        pg=c.new_page()
        pg.goto(j['url'],wait_until='domcontentloaded',timeout=90000); pg.wait_for_timeout(6000)
        for sel in ['button:has-text("Accept")','button:has-text("Got it")','button:has-text("I agree")']:
            try: pg.click(sel,timeout=800)
            except: pass
        r=cap(pg,k,j['start'],j['end'],j['hl'],extra=j.get('extra'))
        print(k,r, datetime.datetime.now().isoformat(timespec='seconds'))
        if r:
            pt=j.get('padT',j['padY']); pb=j.get('padB',j['padY']); clip=dict(x=max(0,r['left']-j['padX']),y=max(0,r['top']-pt),width=r['right']-r['left']+2*j['padX'],height=r['bottom']-r['top']+pt+pb)
            pg.screenshot(path=OUT+j['file'],clip=clip,full_page=True)
        c.close()
    b.close()
