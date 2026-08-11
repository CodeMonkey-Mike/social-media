const fs=require('fs');
// set repurpose done
const b=JSON.parse(fs.readFileSync('batches.json','utf8'));
const bc=b.batches.find(x=>x.batch==='best-coin-to-buy');
bc.pipelines.repurpose='done';
fs.writeFileSync('batches.json',JSON.stringify(b,null,2));
console.log('batches: best-coin-to-buy repurpose ->',bc.pipelines.repurpose,'| shorts ->',bc.pipelines.shorts);
// audit
const grab={
 'x-tweets':['schedule-tweets/data/x-tweets.json','tweets',a=>a.slice(-6)],
 'ig':['schedule-tweets/data/ig-single-image.json','posts',a=>a.slice(-2)],
 'x-polls':['schedule-tweets/data/x-polls.json','polls',a=>a.slice(-2)],
 'yt-polls':['schedule-tweets/data/yt-text-polls.json','polls',a=>a.slice(-2)],
 'yt-posts':['schedule-tweets/data/yt-posts.json','posts',a=>a.filter(p=>/2026-06-17/.test(p.id))],
 'threads':['schedule-tweets/data/x-threads.json','threads',a=>a.filter(p=>/2026-06-17/.test(p.id))],
};
let bad=0;
for(const [name,[p,key,sel]] of Object.entries(grab)){
  const arr=sel(JSON.parse(fs.readFileSync(p,'utf8'))[key]);
  for(const e of arr){
    const s=JSON.stringify(e);
    const issues=[];
    if(/—/.test(s)) issues.push('EM-DASH');
    if(/\btau\b/.test(s)) issues.push('lowercase-tau');
    if(/Casper|Caspie|Cassie|Cappy/.test(s)) issues.push('Casper-misspell');
    if(/Linnea/.test(s)) issues.push('Linnea');
    if(issues.length){bad++; console.log('  ISSUE',name,e.id||e.slug||(e.tweet||'').slice(0,30),issues.join(','));}
  }
  console.log(name,'checked',arr.length);
}
console.log(bad?('AUDIT FAILED: '+bad):'AUDIT CLEAN');
