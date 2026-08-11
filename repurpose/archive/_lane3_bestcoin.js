const fs=require('fs'), crypto=require('crypto');
const cc = s => [...s].length;
const SRC_T="transcripts/best coin to buy LOW BPS VERTICAL/best coin to buy LOW BPS VERTICAL_plain.txt";
const now=()=>new Date().toISOString();
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const save=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2));
const files={xt:'schedule-tweets/data/x-tweets.json',ig:'schedule-tweets/data/ig-single-image.json',xp:'schedule-tweets/data/x-polls.json',yp:'schedule-tweets/data/yt-text-polls.json',yt:'schedule-tweets/data/yt-posts.json',th:'schedule-tweets/data/x-threads.json'};
const D={}; for(const k in files) D[k]=load(files[k]);
const usedIds=new Set();
(function scan(o){ if(o&&typeof o==='object') for(const[k,v]of Object.entries(o)){ if(k==='image_id'&&typeof v==='string')usedIds.add(v); else scan(v);} })(D);
function newId(){let id;do{id=crypto.randomBytes(4).toString('hex')}while(usedIds.has(id));usedIds.add(id);return id;}
function noEm(s,w){ if(/—/.test(s)) throw new Error('EM DASH in '+w); }

const id_t1=newId(),id_t2=newId(),id_t3=newId(),id_t4=newId(),id_t5=newId(),id_t6=newId();
const yt1ids=[newId(),newId(),newId(),newId(),newId()];
const yt2ids=[newId(),newId(),newId(),newId(),newId()];

// ===== TWEETS =====
const T1="My two favorites going into this bull run are still the same: $KAS and $TAO.\n\nThe Kaspa hard fork is almost here. Fair launch, no premine, 5,700 TPS while Bitcoin does 7.\n\nThe BTC maxis will find it eventually...\n\n#kaspa #bittensor";
const T2="XRP was supposed to replace Swift.\n\nThen Swift went and partnered with Linea instead.\n\nLow cap, real catalyst, and at the top of this run a 100x is not crazy. I know which one I would rather hold.\n\n#linea #xrp";
const T3="I had $LAB listed as a 20x for my community.\n\nIt did a 353x. In a bear market.\n\nThen Velvet did a 58x a few days later. This is what getting in early actually looks like. 😎\n\n#crypto";
const T4="Everyone is racing to own AI. Everyone is racing to own money.\n\n$TAO is the AI layer nobody owns. $KAS is the money layer nobody owns.\n\nThe more they fight for control, the more the neutral layers win.\n\n#bittensor #kaspa";
const T5="The Kaspa hard fork is almost here, and most of crypto still is not paying attention. 🔥\n\n#kaspa";
const T6="We are at 1992 in the AI buildout. The five year run has not even started yet.\n\n#ai #crypto";
const tw=[
 {tweet:T1,hook:"My two favorites going into this bull run are still the same: $KAS and $TAO.",slug:'kaspa-tao-favorites-hardfork',id:id_t1},
 {tweet:T2,hook:"XRP was supposed to replace Swift.",slug:'linea-chosen-by-swift',id:id_t2},
 {tweet:T3,hook:"I had $LAB listed as a 20x for my community.",slug:'lab-353x-bear-market',id:id_t3},
 {tweet:T4,hook:"Everyone is racing to own AI. Everyone is racing to own money.",slug:'tao-kas-neutral-layers',id:id_t4},
 {tweet:T5,hook:T5.split("\n")[0],slug:'kaspa-hardfork-almost-here',id:id_t5},
 {tweet:T6,hook:T6.split("\n")[0],slug:'1992-ai-buildout',id:id_t6},
];
for(const t of tw){ noEm(t.tweet,t.slug); if(cc(t.tweet)>280)throw new Error('over280 '+t.slug);
 D.xt.tweets.push({tweet:t.tweet,hook:t.hook,status:'pending',posted_at:null,url:null,views:null,views_captured_at:null,image_id:t.id,image_path:`schedule-tweets/images/x/x-tweets-${t.id}-${t.slug}.png`,char_count:cc(t.tweet)});
}
// ===== IG companions (Kaspa: t1,t5) =====
const igTags=["#kaspa","#kas","#krc20","#proofofwork","#fairlaunch","#crypto","#cryptocurrency","#bitcoin","#btc","#altcoins","#blockchain","#cryptoinvesting","#cryptotrading"];
const igs=[
 {from:tw[0],cap:"My two favorites going into this bull run are still the same: Kaspa and TAO.\n\nThe Kaspa hard fork is almost here. Fair launch, no premine, 5,700 transactions per second while Bitcoin does 7.\n\nThe BTC maxis will find it eventually. Tag one who still hasn't.",hook:"My two favorites going into this bull run are still the same: Kaspa and TAO.",slug:'kaspa-tao-favorites-hardfork'},
 {from:tw[4],cap:"The Kaspa hard fork is almost here, and most of crypto still is not paying attention.\n\nFair launch, no premine, built for real throughput. This is the catalyst the market sleeps on until it is already priced in.\n\nTag a Kaspa holder who is paying attention.",hook:"The Kaspa hard fork is almost here, and most of crypto still is not paying attention.",slug:'kaspa-hardfork-almost-here'},
];
for(const g of igs){ noEm(g.cap,'ig '+g.slug);
 D.ig.posts.push({id:`ig-2026-06-17-${g.slug}`,caption:g.cap,hook:g.hook,hashtags:igTags,hashtag_placement:'caption_end',image_id:g.from.id,image_path:`schedule-tweets/images/ig/ig-single-${g.from.id}-${g.slug}.png`,aspect_ratio:'4:5',source_post:g.from.tweet,status:'pending',created_at:now(),posted_at:null,post_url:null,likes:null,comments:null,engagement_captured_at:null,capture_engagement_after_days:7});
}
// ===== YT POSTS =====
const ytBody1="Everyone keeps asking me what the best coin to buy right now is. After all these years, my answer has not changed: Kaspa is still my number one.\n\nAnd the timing matters, because the Kaspa hard fork is almost here. This is the kind of catalyst the market sleeps on until it is already priced in.\n\nHere is why $KAS sits at the top of my list, in plain terms.\n\nBitcoin was built to be global cash. It processes about 7 transactions per second. Kaspa processes 5,700. That is not a small upgrade, that is a different category of network. Same proof of work foundation, same fair launch ethos, just built for the throughput an actual monetary network needs.\n\nAnd the fair launch part is the piece most people gloss over. No premine. No insider allocation. No foundation sitting on a war chest of tokens to dump on you. That is why you do not see $KAS getting the easy Coinbase listing that pre-mined chains buy their way into. The exclusion is the receipt. It launched the way Bitcoin launched, and almost nothing since has.\n\nThis is the same reason I pair it with $TAO. Both are neutral layers nobody owns. The more governments and corporations race to control money and compute, the more obvious the value of the layers nobody can control becomes.\n\nNone of this is financial advice, and I am not telling you to ape your life savings into anything. But when I look at where this cycle is heading, the AI driven super cycle I think is bigger than the dot com explosion, I want to be holding the assets that were built to be neutral and fair from day one.\n\nThe hard fork is a milestone, not the finish line. Kaspa is a long game, and I have been playing it for a while.\n\nIf you want the macro and crypto breakdowns the four year cycle crowd will not give you, follow me here.\n\nWhat is your number one going into the hard fork? Let me know below.";
const ytBody2="Last week the market got a reminder of something most of crypto would rather ignore: the things you depend on can be switched off by someone who is not you.\n\nA government can lean on a centralized AI lab and cut access to a frontier model overnight. A bank can freeze an account. A payment network can decide who is allowed to transact. None of that is a conspiracy, it is just how centralized infrastructure works. Whoever owns the layer owns the off switch.\n\nThis is the whole reason I keep coming back to two assets: $KAS and $TAO. Think of them as two neutral layers nobody owns.\n\n$KAS is the money layer. Proof of work, fair launch, no premine, no foundation that can rug the supply or quietly change the rules. It processes 5,700 transactions per second versus Bitcoin's 7, so it is actually built to move value at scale. Nobody can switch it off because nobody is in charge of it.\n\n$TAO is the AI layer. Bittensor is an open network for machine intelligence that no single company owns. When a government can order one lab to go dark for millions of people, a decentralized AI network with no central kill switch stops being a niche idea and starts looking inevitable.\n\nHere is the thesis in one line: the more governments and corporations race to control money and compute, the more valuable the layers nobody controls become.\n\nThat is not a trade for next week. It is a position for the next decade. While everyone argues about the four year cycle and which centralized token gets the next listing, I would rather own the rails that were designed so no one can flip the switch on them.\n\nThis is the AI driven super cycle I keep talking about, and I think it is bigger than the dot com explosion. Two neutral layers are a good place to be standing when it really gets going.\n\nIf this is the kind of macro and crypto thinking you want more of, follow me here. Which neutral layer do you think 10x's first?";
noEm(ytBody1,'ytBody1'); noEm(ytBody2,'ytBody2');
console.log('YT post 1 chars:',cc(ytBody1),'| YT post 2 chars:',cc(ytBody2));
function slides(ids,rows){ return rows.map((r,i)=>({seq:i+1,image_id:ids[i],image_path:`schedule-tweets/images/yt/yt-posts-${ids[i]}-${r[0]}.png`,slide_text:r[1]})); }
const yt1slides=slides(yt1ids,[['01-hook','STILL MY NUMBER ONE COIN: KASPA'],['02-tps','BITCOIN: 7 TPS. KASPA: 5,700.'],['03-fair-launch','FAIR LAUNCH. NO PREMINE. NO INSIDERS.'],['04-hardfork','THE HARD FORK IS ALMOST HERE'],['05-question','WHAT IS YOUR NUMBER ONE?']]);
const yt2slides=slides(yt2ids,[['01-hook','THE THINGS YOU DEPEND ON CAN BE SWITCHED OFF'],['02-control','A GOVERNMENT CAN CUT AI. A BANK CAN FREEZE FUNDS.'],['03-kas','KAS: THE MONEY LAYER NOBODY OWNS'],['04-tao','TAO: THE AI LAYER NOBODY OWNS'],['05-question','WHICH NEUTRAL LAYER 10X FIRST?']]);
D.yt.posts.push({id:'yt-post-2026-06-17-kaspa-still-number-one',topic:'Kaspa is still my number one going into the hard fork',source_transcript:SRC_T,variation_label:'A + CTA-follow',body_style:'kaspa conviction / fair-launch thesis',cta_target:'follow_x',carousel_reference_version:'version1',created_at:now(),status:'pending',posted_at:null,post_url:null,body:ytBody1,images:yt1slides});
D.yt.posts.push({id:'yt-post-2026-06-17-neutral-layers-kas-tao',topic:'KAS and TAO are the neutral layers nobody can switch off',source_transcript:SRC_T,variation_label:'A + CTA-follow',body_style:'macro / neutral-layers thesis',cta_target:'follow_x',carousel_reference_version:'version2',created_at:now(),status:'pending',posted_at:null,post_url:null,body:ytBody2,images:yt2slides});
// ===== POLLS =====
const xp1text="The Kaspa hard fork is almost here.\n\n$KAS prints a new all-time high within 12 months of it: yes or no?\n\n#kaspa";
const xp1opts=['Yes, new ATH','No, not this cycle'];
const xp2text="Two neutral layers nobody owns.\n\n$KAS is the money layer. $TAO is the AI layer.\n\nWhich one 10x's first this cycle?\n\n#kaspa #bittensor";
const xp2opts=['$KAS (money layer)','$TAO (AI layer)'];
for(const a of [[xp1text,xp1opts],[xp2text,xp2opts]]){ noEm(a[0],'xpoll'); a[1].forEach(x=>{if(cc(x)>25)throw new Error('xopt>25 '+x)}); }
D.xp.polls.push({id:'poll-2026-06-17-kaspa-hardfork-ath',topic:'Does $KAS make a new ATH within a year of the hard fork',source_transcript:SRC_T,tweet_text:xp1text,hook:xp1text.split("\n")[0],options:xp1opts,duration:'1d',created_at:now(),status:'pending',posted_at:null,poll_url:null,results:null,results_captured_at:null});
D.xp.polls.push({id:'poll-2026-06-17-kas-vs-tao-neutral-layer',topic:'KAS vs TAO: which neutral layer 10x first',source_transcript:SRC_T,tweet_text:xp2text,hook:xp2text.split("\n")[0],options:xp2opts,duration:'1d',created_at:now(),status:'pending',posted_at:null,poll_url:null,results:null,results_captured_at:null});
const yp1text="The Kaspa hard fork is almost here, and it is the kind of catalyst the market usually sleeps on until it is already priced in.\n\nKaspa is a fair launch proof of work network: no premine, no insiders, 5,700 transactions per second versus Bitcoin's 7. The fork is a real on-chain milestone, not a marketing event.\n\nSo here is the question. Does $KAS print a brand new all-time high within 12 months of the hard fork?";
const yp1opts=['Yes, new ATH within a year','No, not this cycle','It blows way past the old ATH'];
const yp2text="I keep coming back to two assets for the same reason: they are neutral layers nobody owns.\n\n$KAS is the money layer. Proof of work, fair launch, no premine, nobody in charge of the supply. $TAO is the AI layer, an open machine-intelligence network with no central kill switch.\n\nThe more governments and corporations race to control money and compute, the more valuable the layers nobody controls become. So which one runs first?";
const yp2opts=['$KAS, the money layer, 10x first','$TAO, the AI layer, 10x first','They run together this cycle'];
for(const a of [[yp1text,yp1opts],[yp2text,yp2opts]]){ noEm(a[0],'ytpoll'); a[1].forEach(x=>{if(cc(x)>65)throw new Error('yopt>65 '+x)}); }
D.yp.polls.push({id:'yt-text-poll-2026-06-17-kaspa-hardfork-ath',topic:'Does $KAS make a new ATH within a year of the hard fork',source_post:'yt-post-2026-06-17-kaspa-still-number-one',source_transcript:SRC_T,question_text:yp1text,hook:yp1text.split("\n")[0],options:yp1opts,capture_results_after_days:7,created_at:now(),status:'pending',posted_at:null,post_url:null,results:null,results_captured_at:null});
D.yp.polls.push({id:'yt-text-poll-2026-06-17-kas-vs-tao-neutral-layer',topic:'KAS vs TAO: which neutral layer 10x first',source_post:'yt-post-2026-06-17-neutral-layers-kas-tao',source_transcript:SRC_T,question_text:yp2text,hook:yp2text.split("\n")[0],options:yp2opts,capture_results_after_days:7,created_at:now(),status:'pending',posted_at:null,post_url:null,results:null,results_captured_at:null});
// ===== THREADS =====
function mkThread(id,topic,arr){
 const tweets=arr.map((t,i)=>{ noEm(t.text,id+' #'+(i+1)); if(cc(t.text)>280)throw new Error('thread over280 '+id+' #'+(i+1)+' = '+cc(t.text));
  const o={position:i+1,text:t.text,hook:i===0?t.hook:null,char_count:cc(t.text),posted_url:null,views:null,views_captured_at:null}; if(t.cta)o.is_cta=true; return o; });
 return {id,topic,source_transcript:SRC_T,variation_label:'A',created_at:now(),status:'pending',posted_at:null,thread_root_url:null,tweets};
}
const threadA=mkThread('thread-2026-06-17-kaspa-still-number-one','Kaspa is still my number one going into the hard fork',[
 {text:"Everyone keeps asking me the best coin to buy right now.\n\nAfter all these years my answer has not changed: Kaspa.\n\nAnd the hard fork is almost here. 🧵",hook:"Everyone keeps asking me the best coin to buy right now."},
 {text:"Bitcoin was built to be global cash. It does about 7 transactions per second.\n\n$KAS does 5,700.\n\nSame proof of work foundation, completely different category of network."},
 {text:"The part people gloss over is the fair launch.\n\nNo premine. No insider allocation. No foundation sitting on a war chest of tokens to dump on you."},
 {text:"That is why $KAS does not get the easy Coinbase listing pre-mined chains buy their way into.\n\nThe exclusion is the receipt. It launched the way Bitcoin did, and almost nothing since has."},
 {text:"It is the same reason I pair it with $TAO.\n\nTwo neutral layers nobody owns. The more they race to control money and compute, the more the neutral layers win."},
 {text:"If this is how you want to think about the cycle instead of the four year cycle echo chamber,\n\nFollow me for macro x crypto with no echo chamber.\n\n🧠",cta:true},
]);
const threadB=mkThread('thread-2026-06-17-neutral-layers-kas-tao','KAS and TAO are the neutral layers nobody can switch off',[
 {text:"Last week was a reminder of something most of crypto wants to ignore:\n\nThe things you depend on can be switched off by someone who is not you. 🧵",hook:"Last week was a reminder of something most of crypto wants to ignore."},
 {text:"A government can lean on a centralized AI lab and cut a frontier model overnight.\n\nA bank can freeze an account. A network can decide who gets to transact.\n\nWhoever owns the layer owns the off switch."},
 {text:"That is the whole reason I keep coming back to two assets: $KAS and $TAO.\n\nTwo neutral layers nobody owns."},
 {text:"$KAS is the money layer.\n\nProof of work, fair launch, no premine. 5,700 TPS versus Bitcoin's 7.\n\nNobody can switch it off because nobody is in charge of it."},
 {text:"$TAO is the AI layer.\n\nAn open network for machine intelligence no single company owns. No central kill switch.\n\nWhen one lab can go dark for millions, that stops being niche."},
 {text:"The thesis in one line:\n\nThe more they race to control money and compute, the more valuable the layers nobody controls become."},
 {text:"If you want macro x crypto that ignores the four year cycle noise,\n\nFollow me.\n\n😎",cta:true},
]);
D.th.threads.push(threadA); D.th.threads.push(threadB);
console.log('threadA tweets:',threadA.tweets.length,'| threadB tweets:',threadB.tweets.length);
for(const k in files) save(files[k],D[k]);
console.log('WROTE x-tweets',D.xt.tweets.length,'| ig',D.ig.posts.length,'| x-polls',D.xp.polls.length,'| yt-polls',D.yp.polls.length,'| yt-posts',D.yt.posts.length,'| threads',D.th.threads.length);
// ===== IMAGE MANIFESTS =====
const HS='Pixar-style 3D animated CGI, film-quality render, deep navy near-black background, dramatic rim lighting, no text or words in the image';
const xitems=[
 {image_id:id_t1,slug:'kaspa-tao-favorites-hardfork',ref:'schedule-tweets/images/reference/kaspa-logo.png',prompt:'A Kaspa coin showing the backwards-K (mirrored capital K) logo glowing greenish-cyan teal as the HERO (larger, front), beside a slightly smaller Bittensor TAO coin, on a dark reflective surface with energy particles. '+HS+'. 1:1 square.'},
 {image_id:id_t2,slug:'linea-chosen-by-swift',ref:'schedule-tweets/images/reference/linea.png',prompt:'The Linea logo (use the attached reference image) as a glowing 3D coin/medallion on a pedestal lit by a beam, a faded old bank-wire terminal in shadow behind it. '+HS+'. 1:1 square.'},
 {image_id:id_t3,slug:'lab-353x-bear-market',ref:'schedule-tweets/images/reference/LAB.png',prompt:'The LAB token logo (use the attached reference image) as a glowing 3D coin erupting upward off a green ascending arc of light against a stormy dark sky. '+HS+'. No numbers. 1:1 square.'},
 {image_id:id_t4,slug:'tao-kas-neutral-layers',ref:null,prompt:'Two glowing neutral monoliths in dark space: a Bittensor TAO coin above, a Kaspa coin (backwards-K, greenish-cyan teal) below, untouched while shadowy hands reach but cannot grab them. '+HS+'. 1:1 square.'},
 {image_id:id_t5,slug:'kaspa-hardfork-almost-here',ref:'schedule-tweets/images/reference/kaspa-logo.png',prompt:'A single Kaspa coin showing the backwards-K (mirrored capital K) logo glowing intense greenish-cyan teal, cracking along a fork line with energy bursting out. '+HS+'. 1:1 square.'},
 {image_id:id_t6,slug:'1992-ai-buildout',ref:null,prompt:'A cinematic dawn-of-an-era scene: a glowing AI neural core at the base of a rising staircase of light ascending through robotics and biotech silhouettes, the start of a massive super-cycle. '+HS+'. 1:1 square.'},
];
const igitems=igs.map(g=>({image_id:g.from.id,slug:g.slug,ref:'schedule-tweets/images/reference/kaspa-logo.png',aspect:'4:5',note:'Same image_id as its X tweet, re-rendered at 4:5 (same subject/style).',prompt:xitems.find(x=>x.image_id===g.from.id).prompt.replace('1:1 square','4:5 portrait')}));
const ytitems=[
 ...yt1slides.map(s=>({image_id:s.image_id,carousel:'version1',ref:'schedule-tweets/images/reference/carousels/version1/',slide_text:s.slide_text,image_path:s.image_path,prompt:'Carousel slide anchored on the VERSION 1 exemplar (role-matched via --reference-image). Bold all-caps headline, white with greenish-cyan accent; cinematic 3D Kaspa coin render (backwards-K, teal glow) where a coin is shown. Slide text: "'+s.slide_text+'". Near-black background. 1:1 square.'})),
 ...yt2slides.map(s=>({image_id:s.image_id,carousel:'version2',ref:'schedule-tweets/images/reference/carousels/version2/',slide_text:s.slide_text,image_path:s.image_path,prompt:'Carousel slide anchored on the VERSION 2 exemplar (role-matched via --reference-image). Clean editorial text-design: slide counter, large bold headline, teal subhead, labeled stat/insight box. Slide text: "'+s.slide_text+'". Minimal near-black background. 1:1 square.'})),
];
fs.writeFileSync('repurpose/items-bestcoin-x-tweets.json',JSON.stringify(xitems,null,2));
fs.writeFileSync('repurpose/items-bestcoin-ig-single.json',JSON.stringify(igitems,null,2));
fs.writeFileSync('repurpose/items-bestcoin-yt-posts.json',JSON.stringify(ytitems,null,2));
console.log('MANIFESTS x',xitems.length,'ig',igitems.length,'yt-slides',ytitems.length);
