(()=>{
 const STUDY_MINUTES=50,BREAK_MINUTES=25,key='study-enforced-break-v1';
 const studyMs=STUDY_MINUTES*60000,breakMs=BREAK_MINUTES*60000;
 const sessionKey='study-break-session-v3';
 function localCycle(){try{return JSON.parse(localStorage.getItem(key))}catch(e){return null}}
 function read(){const shared=localCycle();if(shared&&Number.isFinite(shared.breakUntil)&&shared.breakUntil>0)return shared;try{return JSON.parse(sessionStorage.getItem(sessionKey))}catch(e){return null}}
 function save(v){try{sessionStorage.setItem(sessionKey,JSON.stringify(v))}catch(e){}try{if(v.breakUntil>0)localStorage.setItem(key,JSON.stringify(v));else{const old=localCycle();if(!old||!old.breakUntil||old.breakUntil<=Date.now())localStorage.removeItem(key)}}catch(e){}}
 // A restored tab can retain sessionStorage, so storage alone does not identify a new visit.
 const handoffKey='study-break-navigation-v1';
 let continueVisit=false;
 try{
  const navigation=window.performance?.getEntriesByType('navigation')[0];
  const handoff=JSON.parse(sessionStorage.getItem(handoffKey));
  sessionStorage.removeItem(handoffKey);
  continueVisit=navigation?.type==='reload'||Boolean(handoff&&handoff.url===window.location.href&&Date.now()-handoff.at<15000);
  if(!continueVisit)sessionStorage.removeItem(sessionKey);
 }catch(e){}
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.download||link.target&&link.target!=='_self')return;
  try{const target=new URL(link.href,window.location.href);if(target.origin===window.location.origin&&target.pathname!==window.location.pathname)sessionStorage.setItem(handoffKey,JSON.stringify({url:target.href,at:Date.now()}))}catch(e){}
 });
 let cycle=read();if(!cycle||!Number.isFinite(cycle.startedAt)||(cycle.breakUntil&&cycle.breakUntil<=Date.now()))cycle={startedAt:Date.now(),elapsedMs:0,breakUntil:0};save(cycle);
 const screen=document.createElement('div');screen.className='enforced-break';screen.hidden=true;screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-label','Required study break');
 const card=document.createElement('div');card.className='enforced-break-card';const title=document.createElement('h2');title.textContent='Time to take care of yourself';const message=document.createElement('p');message.textContent='Your 25-minute break has started. Step away, walk around, and have some water. Your notes will unlock automatically.';const time=document.createElement('p');time.className='enforced-break-time';const hint=document.createElement('p');hint.textContent='Refreshing or changing chapters will keep this break running.';card.append(title,message,time,hint);screen.append(card);document.body.append(screen);

 const breakVerses=[
 {arabic:'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',english:'So, surely with hardship comes ease.',reference:'Ash-Sharh · 94:5',url:'https://quran.com/94/5'},
 {arabic:'قَالَ رَبِّ ٱشْرَحْ لِي صَدْرِي',english:'Moses prayed, “My Lord! Uplift my heart for me,',reference:'Taha · 20:25',url:'https://quran.com/20/25'},
 {arabic:'وَيَسِّرْ لِي أَمْرِي',english:'and make my task easy,',reference:'Taha · 20:26',url:'https://quran.com/20/26'},
 {arabic:'وَقُل رَّبِّ زِدْنِي عِلْمًا',english:'and pray, “My Lord! Increase me in knowledge.”',reference:'Taha · 20:114 (excerpt)',url:'https://quran.com/20/114'},
 {arabic:'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',english:'Surely with ˹that˺ hardship comes ˹more˺ ease.',reference:'Ash-Sharh · 94:6',url:'https://quran.com/94/6'},
 {arabic:'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',english:'And ˹surely˺ your Lord will give so much to you that you will be pleased.',reference:'Ad-Duhaa · 93:5',url:'https://quran.com/93/5'}
 ];
 const reading=document.createElement('section');reading.className='break-quran-reading';reading.setAttribute('aria-label','Quran reading during your break');const readingTitle=document.createElement('p');readingTitle.className='break-reading-label';readingTitle.textContent='A moment with the Quran · Changes every minute';const arabic=document.createElement('p');arabic.className='quran-arabic';arabic.lang='ar';arabic.dir='rtl';const english=document.createElement('p');english.className='quran-translation';const reference=document.createElement('a');reference.className='quran-reference';reference.target='_blank';reference.rel='noopener noreferrer';const credit=document.createElement('p');credit.className='quran-credit';credit.textContent='Translation: Dr. Mustafa Khattab, The Clear Quran · Quran.com';reading.append(readingTitle,arabic,english,reference,credit);card.insertBefore(reading,hint);let currentVerse=-1;
 function updateReading(now,locked){if(!locked){currentVerse=-1;return}const elapsed=Math.max(0,now-(cycle.breakUntil-breakMs));const index=Math.floor(elapsed/60000)%breakVerses.length;if(index===currentVerse)return;currentVerse=index;const verse=breakVerses[index];arabic.textContent=verse.arabic;english.textContent=verse.english;reference.textContent=verse.reference+' · Read in context';reference.href=verse.url;}

 const upcoming=document.createElement('span');upcoming.className='study-clock break-upcoming';const upcomingLabel=document.createElement('span');upcomingLabel.textContent='Break in';const upcomingTime=document.createElement('span');upcomingTime.className='study-clock-value';upcomingTime.setAttribute('role','timer');upcoming.append(upcomingLabel,upcomingTime);const clockPanel=document.querySelector('.study-clocks');if(clockPanel)clockPanel.append(upcoming);
 const warning=document.createElement('aside');warning.className='break-warning';warning.hidden=true;warning.setAttribute('aria-label','Upcoming study break');const warningTitle=document.createElement('strong');warningTitle.textContent='Your break is coming up';const warningText=document.createElement('p');warningText.setAttribute('role','status');warningText.textContent='Your 25-minute break starts in 5 minutes. Wrap up your section; your progress is saved automatically.';const warningTime=document.createElement('p');warningTime.className='break-warning-countdown';const dismiss=document.createElement('button');dismiss.type='button';dismiss.className='btn';dismiss.textContent='Got it';dismiss.addEventListener('click',()=>{warning.hidden=true});warning.append(warningTitle,warningText,warningTime,dismiss);document.body.append(warning);
 function formatTime(ms){const seconds=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')}
 function updateWarning(now,locked){const remaining=cycle.startedAt+studyMs-now;upcomingTime.textContent=locked?'On break':formatTime(remaining);if(locked){warning.hidden=true;return}if(remaining>0&&remaining<=5*60000&&!cycle.warned){cycle.warned=true;save(cycle);warning.hidden=false;window.dispatchEvent(new Event('study-notification'))}warningTime.textContent='Break starts in '+formatTime(remaining)}
 const targets=[document.getElementById('chapter-three'),document.querySelector('.chapter-nav')].filter(Boolean);
 let wasLocked=false,lastTick=Date.now(),wasVisible=!document.hidden;
 function tick(){const now=Date.now();cycle=read()||cycle;
 if(cycle.breakUntil){if(now>=cycle.breakUntil){cycle={startedAt:now,elapsedMs:0,breakUntil:0};save(cycle)}}
 else{if(!Number.isFinite(cycle.elapsedMs))cycle.elapsedMs=0;if(wasVisible)cycle.elapsedMs+=Math.max(0,now-lastTick);cycle.startedAt=now-cycle.elapsedMs;if(cycle.elapsedMs>=studyMs)cycle.breakUntil=now+breakMs;save(cycle)}
 lastTick=now;wasVisible=!document.hidden;
 const locked=cycle.breakUntil>now;document.body.dataset.studyLocked=String(locked);screen.hidden=!locked;if(locked&&!wasLocked)window.dispatchEvent(new Event('study-notification'));wasLocked=locked;targets.forEach(el=>el.inert=locked);document.body.classList.toggle('study-break-locked',locked);const left=Math.max(0,Math.ceil((cycle.breakUntil-now)/1000));time.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');updateReading(now,locked);updateWarning(now,locked);}

 tick();setInterval(tick,1000);window.addEventListener('storage',tick);document.addEventListener('visibilitychange',tick);window.addEventListener('pagehide',()=>{tick();wasVisible=false});window.addEventListener('pageshow',()=>{lastTick=Date.now();wasVisible=!document.hidden;tick()});
 const chapter=Number(document.body.dataset.chapter);if(chapter){const button=document.createElement('button');button.type='button';button.className='btn reset-chapter-time';button.textContent='Reset chapter time';button.addEventListener('click',()=>{if(!confirm('Reset reading time for this chapter and its sections? Your completed sections will stay checked.'))return;try{localStorage.removeItem('study-chapter-'+chapter+'-time-ms');localStorage.removeItem('study-chapter-'+chapter+'-section-times')}catch(e){}window.dispatchEvent(new CustomEvent('study-reset-time',{detail:{chapter}}));});const clocks=document.querySelector('.study-clocks');if(clocks)clocks.append(button)}
})();

