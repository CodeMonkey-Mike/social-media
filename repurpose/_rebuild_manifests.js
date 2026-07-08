const fs=require('fs');
const REF='C:/Users/mnede/Documents/Claude/social-media/schedule-tweets/images/reference/';
const HS='Pixar-style 3D animated CGI, film-quality render, deep navy near-black background, dramatic rim lighting, no text or words in the image';
const xt=JSON.parse(fs.readFileSync('schedule-tweets/data/x-tweets.json','utf8')).tweets.slice(-6);
const ig=JSON.parse(fs.readFileSync('schedule-tweets/data/ig-single-image.json','utf8')).posts.slice(-2);
const yt=JSON.parse(fs.readFileSync('schedule-tweets/data/yt-posts.json','utf8')).posts.filter(p=>/2026-06-17/.test(p.id));
const promptBySlug={
 'kaspa-tao-favorites-hardfork':{ref:null,prompt:'A Kaspa coin showing the backwards-K (mirrored capital K) logo glowing greenish-cyan teal as the HERO (larger, front), beside a slightly smaller Bittensor TAO coin, on a dark reflective surface with energy particles. '+HS+'. 1:1 square.'},
 'linea-chosen-by-swift':{ref:REF+'linea.png',prompt:'The Linea logo (use the attached reference image) as a glowing 3D coin/medallion on a pedestal lit by a beam, a faded old bank-wire terminal in shadow behind it. '+HS+'. 1:1 square.'},
 'lab-353x-bear-market':{ref:REF+'LAB.png',prompt:'The LAB token logo (use the attached reference image) as a glowing 3D coin erupting upward off a green ascending arc of light against a stormy dark sky. '+HS+'. No numbers. 1:1 square.'},
 'tao-kas-neutral-layers':{ref:null,prompt:'Two glowing neutral monoliths in dark space: a Bittensor TAO coin above, a Kaspa coin (backwards-K, greenish-cyan teal) below, untouched while shadowy hands reach but cannot grab them. '+HS+'. 1:1 square.'},
 'kaspa-hardfork-almost-here':{ref:REF+'kaspa-logo.png',prompt:'A single Kaspa coin showing the backwards-K (mirrored capital K) logo (use the attached reference) glowing intense greenish-cyan teal, cracking along a fork line with energy bursting out. '+HS+'. 1:1 square.'},
 '1992-ai-buildout':{ref:null,prompt:'A cinematic dawn-of-an-era scene: a glowing AI neural core at the base of a rising staircase of light ascending through robotics and biotech silhouettes, the start of a massive super-cycle. '+HS+'. 1:1 square.'},
};
// X tweets
const xitems=xt.map(t=>{const slug=t.image_path.replace(/^.*x-tweets-[0-9a-f]{8}-/,'').replace('.png',''); const p=promptBySlug[slug]; return {image_id:t.image_id,slug,ref:p.ref,prompt:p.prompt};});
// IG (4:5) -- multi-coin (kaspa-tao) word-described, single-coin uses kaspa-logo
const igitems=ig.map(g=>{const slug=g.image_path.replace(/^.*ig-single-[0-9a-f]{8}-/,'').replace('.png',''); const base=promptBySlug[slug]; const ref = slug==='kaspa-hardfork-almost-here'?REF+'kaspa-logo.png':null; return {image_id:g.image_id,slug,ref,aspect:'4:5',prompt:base.prompt.replace('1:1 square','4:5 portrait')};});
// YT carousels -- role-matched single exemplar per slide
const v1=REF+'carousels/version1/', v2=REF+'carousels/version2/';
const refMapV1={'01-hook':'yt-posts-828eee71-01-hook.png','02-tps':'yt-posts-89869680-02-btc-failure.png','03-fair-launch':'yt-posts-6f54e3d5-03-the-problem.png','04-hardfork':'yt-posts-69451879-05-kas-can.png','05-question':'yt-posts-9e20b9b1-06-question.png'};
const refMapV2={'01-hook':'yt-posts-9611992a-01-hook.png','02-control':'yt-posts-44d02f9a-03-the-problem.png','03-kas':'yt-posts-33856452-05-kas-can.png','04-tao':'yt-posts-074be0dc-04-the-solution.png','05-question':'yt-posts-81abb2d9-06-question.png'};
function ytItems(post,ver,folder,refMap){return post.images.map(s=>{const slug=s.image_path.replace(/^.*yt-posts-[0-9a-f]{8}-/,'').replace('.png',''); return {image_id:s.image_id,slug,ref:folder+refMap[slug],carousel:ver,slide_text:s.slide_text,prompt:`Carousel slide anchored on the attached VERSION ${ver==='version1'?'1':'2'} exemplar (role-matched): keep its exact layout, font, color system and ${ver==='version1'?'bold headline + 3D coin treatment':'clean editorial text-design with the labeled box'}. Replace ONLY the wording with this slide text: "${s.slide_text}". ${ver==='version1'?'Where a coin appears, render a Kaspa coin (backwards-K, greenish-cyan teal).':'Text-design only, no coin render.'} Deep near-black background. 1:1 square.`};});}
const p1=yt.find(p=>/kaspa-still-number-one/.test(p.id)), p2=yt.find(p=>/neutral-layers/.test(p.id));
const ytitems=[...ytItems(p1,'version1',v1,refMapV1),...ytItems(p2,'version2',v2,refMapV2)];
// verify all ref files exist
let missing=[];
for(const it of [...xitems,...igitems,...ytitems]) if(it.ref && !fs.existsSync(it.ref)) missing.push(it.ref);
if(missing.length){console.log('MISSING REFS:',[...new Set(missing)]);}
fs.writeFileSync('repurpose/items-bestcoin-x-tweets.json',JSON.stringify(xitems,null,2));
fs.writeFileSync('repurpose/items-bestcoin-ig-single.json',JSON.stringify(igitems,null,2));
fs.writeFileSync('repurpose/items-bestcoin-yt-posts.json',JSON.stringify(ytitems,null,2));
console.log('x',xitems.length,'ig',igitems.length,'yt',ytitems.length,'| refs all exist:',missing.length===0);
console.log('x refs:',xitems.map(i=>i.slug+'='+(i.ref?i.ref.split('/').pop():'none')).join(', '));
