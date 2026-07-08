const fs=require('fs');
const cc=s=>[...s].length;
const p='schedule-tweets/data/yt-posts.json';
const d=JSON.parse(fs.readFileSync(p,'utf8'));
const add1="\n\nAnd if you are wondering whether early conviction actually pays, look at what getting in early did for my community this cycle. The LAB call ran 353x in a bear market and Velvet did a 58x right behind it. That is not a promise about Kaspa, it is a reminder that the biggest moves go to the people who position before the catalyst, not after it.";
const add2="\n\nAnd this is not theoretical. We just watched one order from one agency pull a frontier AI model from millions of people overnight. The same kind of off switch sits on every centralized rail you touch. The only real hedge is to own the layers that were built so no single party can ever flip it.";
const insertBefore=(body,marker,add)=>{ const i=body.indexOf(marker); if(i<0)throw new Error('marker not found'); return body.slice(0,i)+add+"\n\n"+body.slice(i); };
for(const post of d.posts){
  if(post.id==='yt-post-2026-06-17-kaspa-still-number-one'){
    post.body=insertBefore(post.body,"If you want the macro and crypto breakdowns",add1.trim());
  }
  if(post.id==='yt-post-2026-06-17-neutral-layers-kas-tao'){
    post.body=insertBefore(post.body,"If this is the kind of macro and crypto thinking",add2.trim());
  }
}
for(const post of d.posts) if(/2026-06-17/.test(post.id) && /—/.test(post.body)) throw new Error('em dash in '+post.id);
fs.writeFileSync(p,JSON.stringify(d,null,2));
for(const post of d.posts) if(/2026-06-17/.test(post.id)) console.log(post.id,'->',cc(post.body),'chars');
