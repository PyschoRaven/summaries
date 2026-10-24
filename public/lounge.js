(()=>{
 const doc=document.documentElement,toggle=document.getElementById('lounge-theme');
 function get(key){try{return localStorage.getItem(key)}catch(e){return null}}
 function set(key,value){try{localStorage.setItem(key,value)}catch(e){}}
 let theme=get('study-lounge-theme')||'light';
 function apply(){doc.dataset.theme=theme;if(toggle){toggle.textContent=theme==='dark'?'☀ Light mode':'☾ Dark mode';toggle.setAttribute('aria-pressed',String(theme==='dark'))}}
 apply();if(toggle)toggle.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';apply();set('study-lounge-theme',theme)});
 const chapter=Number(document.body.dataset.chapter);
 if(chapter>=1&&chapter<=8)set('study-last-chapter',String(chapter));
 function progress(n){let saved;try{saved=JSON.parse(get(n===3?'chapter-three-study':`study-chapter-${n}-sections`))}catch(e){}const p=saved?.privateContent||saved;const total=Number(document.querySelector(`[data-progress-chapter="${n}"]`)?.dataset.total)||0;const completed=Array.isArray(p?.completed)?new Set(p.completed.filter(i=>Number.isInteger(i)&&i>=0&&i<total)).size:0;return {completed,total,pct:total?Math.round(completed/total*100):0}}
 function refresh(){document.querySelectorAll('[data-progress-chapter]').forEach(el=>{const p=progress(Number(el.dataset.progressChapter));el.querySelector('.chapter-progress-text').textContent=p.completed?`${p.completed} of ${p.total} sections complete`:'Ready when you are';el.querySelector('.chapter-progress-percent').textContent=p.pct+'%';el.querySelector('.chapter-fill').style.width=p.pct+'%';el.querySelector('.chapter-track').setAttribute('aria-valuenow',p.pct)});const link=document.getElementById('continue-studying');if(link){let n=Number(get('study-last-chapter'));if(!Number.isInteger(n)||n<1||n>8)n=1;link.href=`chapter-${n}.html`;link.querySelector('span').textContent=`Continue with Chapter ${n}`;const hint=document.getElementById('continue-hint');hint.textContent=get('study-last-chapter')?'Your last chapter is ready for you.':'Start with Chapter 1, or choose any chapter below.'}}
 refresh();window.addEventListener('pageshow',refresh);window.addEventListener('storage',refresh);
})();
// A shared five-minute rhythm keeps encouragement consistent between chapters.
(()=>{
 const root=document.getElementById('chapter-three');if(!root)return;
 const messages=[
  'One small step now makes the next step easier.',
  'You don’t need to finish everything today. This section is enough for now.',
  'Every time you return, you give yourself another chance to understand.',
  'Take your time. Understanding grows one idea at a time.',
  'A short, focused session still counts as progress.',
  'You can pause, take a breath, and begin again.',
  'Look how far you’ve come. Keep going at your own pace.',
  'You’re building knowledge, one connection at a time.',
  'Getting curious is a good place to start.',
  'Give this moment your attention. The rest can wait.',
  'A difficult topic becomes more familiar each time you meet it.',
  'Your effort today is something your future self can build on.'
 ];
 const box=document.createElement('aside');box.className='lounge-encouragement';box.setAttribute('aria-label','Study encouragement');
 const icon=document.createElement('span');icon.className='encouragement-symbol';icon.textContent='✧';icon.setAttribute('aria-hidden','true');
 const copy=document.createElement('div');copy.className='encouragement-copy';
 const label=document.createElement('span');label.className='encouragement-label';label.textContent='A little encouragement · Every 5 min';
 const sentence=document.createElement('p');sentence.className='encouragement-sentence';sentence.setAttribute('aria-live','polite');sentence.setAttribute('aria-atomic','true');copy.append(label,sentence);box.append(icon,copy);
 const bar=root.querySelector('.lounge-bar');if(bar)bar.after(box);else root.prepend(box);
 let current=-1;const period=5*60*1000;
 function update(){const index=Math.floor(Date.now()/period)%messages.length;if(index===current)return;current=index;sentence.textContent=messages[index];if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&sentence.animate)sentence.animate([{opacity:.25,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});}
 function schedule(){update();setTimeout(schedule,period-Date.now()%period+20)}schedule();document.addEventListener('visibilitychange',()=>{if(!document.hidden)update()});
 const scene=document.querySelector('.ambient-scene');if(scene){const positions=[[3,16],[96,25],[5,59],[94,72],[9,88],[91,45],[2,38],[97,91]];positions.forEach(([left,top],i)=>{const mote=document.createElement('i');mote.className='lounge-mote'+([1,2,5,6].includes(i)?' lounge-mote-hollow':'');mote.setAttribute('aria-hidden','true');mote.style.setProperty('--mote-left',left+'%');mote.style.setProperty('--mote-top',top+'%');mote.style.setProperty('--mote-color',['var(--l-lavender)','var(--l-sage)','var(--l-peach)'][i%3]);mote.style.setProperty('--mote-time',(20+i*3)+'s');mote.style.setProperty('--mote-delay',(-i*4)+'s');mote.style.setProperty('--roam-x1',(100-left)+'%');mote.style.setProperty('--roam-y1',((top+38)%84+8)+'%');mote.style.setProperty('--roam-x2',((left+43)%88+6)+'%');mote.style.setProperty('--roam-y2',((top+63)%84+8)+'%');mote.style.setProperty('--roam-x3',((left+71)%88+6)+'%');mote.style.setProperty('--roam-y3',((top+17)%84+8)+'%');scene.append(mote)})}
})();
// Quran reading break: complete verses; translations credited separately.
(()=>{
 const anchor=document.querySelector('.lounge-encouragement');if(!anchor)return;
 const verses=[
 {arabic:'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',english:'So, surely with hardship comes ease.',reference:'Ash-Sharh · 94:5',url:'https://quran.com/94/5'},
 {arabic:'قَالَ رَبِّ ٱشْرَحْ لِي صَدْرِي',english:'Moses prayed, “My Lord! Uplift my heart for me,',reference:'Taha · 20:25',url:'https://quran.com/20/25'},
 {arabic:'وَيَسِّرْ لِي أَمْرِي',english:'and make my task easy,',reference:'Taha · 20:26',url:'https://quran.com/20/26'},
 {arabic:'وَقُل رَّبِّ زِدْنِي عِلْمًا',english:'and pray, “My Lord! Increase me in knowledge.”',reference:'Taha · 20:114 (excerpt)',url:'https://quran.com/20/114'},
 {arabic:'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',english:'Surely with ˹that˺ hardship comes ˹more˺ ease.',reference:'Ash-Sharh · 94:6',url:'https://quran.com/94/6'},
 {arabic:'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',english:'And ˹surely˺ your Lord will give so much to you that you will be pleased.',reference:'Ad-Duhaa · 93:5',url:'https://quran.com/93/5'}
 ];
 const panel=document.createElement('details');panel.className='quran-break';
 const summary=document.createElement('summary');summary.textContent='Take a Quran break';panel.append(summary);
 const content=document.createElement('div');content.className='quran-content';
 const arabic=document.createElement('p');arabic.className='quran-arabic';arabic.setAttribute('lang','ar');arabic.setAttribute('dir','rtl');
 const english=document.createElement('p');english.className='quran-translation';
 const reference=document.createElement('a');reference.className='quran-reference';reference.target='_blank';reference.rel='noopener noreferrer';
 const credit=document.createElement('p');credit.className='quran-credit';credit.textContent='English translation: Dr. Mustafa Khattab, The Clear Quran · Quran.com';
 const actions=document.createElement('div');actions.className='quran-actions';const next=document.createElement('button');next.type='button';next.className='btn';next.textContent='Next verse →';actions.append(next);content.append(arabic,english,reference,credit,actions);panel.append(content);anchor.after(panel);
 let index=0;function draw(){const v=verses[index];arabic.textContent=v.arabic;english.textContent=v.english;reference.textContent=v.reference+' · Read in context';reference.href=v.url;}next.addEventListener('click',()=>{index=(index+1)%verses.length;draw()});draw();
})();
// Gentle in-page break reminders, shared across chapter navigation.
(()=>{
 const root=document.getElementById('chapter-three');if(!root)return;
 const period=5*60*1000;let timer;
 const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
 const set=(k,v)=>{try{localStorage.setItem(k,String(v))}catch(e){}};
 let paused=get('study-breaks-paused')==='true';let due=Number(get('study-break-due'))||Date.now()+period;set('study-break-due',due);
 const controls=document.createElement('div');controls.className='break-controls';const label=document.createElement('span');label.textContent='Wellbeing breaks · Every 5 min';const toggle=document.createElement('button');toggle.className='break-toggle';toggle.type='button';controls.append(label,toggle);const anchor=root.querySelector('.lounge-encouragement');if(anchor)anchor.after(controls);else root.append(controls);
 const toast=document.createElement('aside');toast.className='wellbeing-reminder';toast.hidden=true;toast.setAttribute('aria-label','Wellbeing break reminder');const heading=document.createElement('strong');heading.textContent='Time for a little reset';const message=document.createElement('p');message.setAttribute('role','status');message.setAttribute('aria-live','polite');const done=document.createElement('button');done.className='btn';done.type='button';done.textContent='Got it';done.addEventListener('click',()=>{toast.hidden=true});toast.append(heading,message,done);document.body.append(toast);
 function draw(){toggle.textContent=paused?'Resume reminders':'Pause reminders';toggle.setAttribute('aria-pressed',String(paused))}
 const messages=['Stand up, walk around for a moment, and have a sip of water.','Give yourself a short break: stretch your legs and drink some water.','Time to stand up and move a little. Your water bottle could use a visit, too.'];let index=0;
 function tick(){clearTimeout(timer);paused=get('study-breaks-paused')==='true';draw();if(paused){timer=setTimeout(tick,30000);return}due=Number(get('study-break-due'))||due;if(!document.hidden&&Date.now()>=due){due=Date.now()+period;set('study-break-due',due);toast.hidden=false;message.textContent=messages[index++%messages.length]}timer=setTimeout(tick,Math.max(250,Math.min(due-Date.now(),30000)))}
 toggle.addEventListener('click',()=>{paused=!paused;set('study-breaks-paused',paused);if(paused)toast.hidden=true;else{due=Date.now()+period;set('study-break-due',due)}tick()});document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});window.addEventListener('storage',e=>{if(e.key==='study-breaks-paused'||e.key==='study-break-due')tick()});draw();tick();
})();
