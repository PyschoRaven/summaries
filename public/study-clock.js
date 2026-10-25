(()=>{
 const key='study-salah-paused-time-v1';
 function read(){try{return JSON.parse(localStorage.getItem(key))||{total:0}}catch(e){return {total:0}}}
 function save(state){try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}}
 window.studyNow=()=>{const now=Date.now(),state=read();const ongoing=state.startedAt?Math.max(0,Math.min(now,state.until)-state.startedAt):0;return now-(state.total||0)-ongoing};
 window.beginSalahPause=until=>{const now=Date.now(),state=read();if(state.startedAt&&state.until===until)return;if(state.startedAt)state.total=(state.total||0)+Math.max(0,Math.min(now,state.until)-state.startedAt);state.startedAt=now;state.until=until;save(state)};
 window.endSalahPause=()=>{const now=Date.now(),state=read();if(state.startedAt){state.total=(state.total||0)+Math.max(0,Math.min(now,state.until)-state.startedAt);delete state.startedAt;delete state.until;save(state)}};
 // Restore a running pause before any study timers initialize.
 try{const until=Number(localStorage.getItem('study-salah-break-v1'));if(until>Date.now())window.beginSalahPause(until);else window.endSalahPause()}catch(e){}
})();
