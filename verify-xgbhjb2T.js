import{d as e,h as t,o as n,t as r,u as i,v as a}from"./style-BLZMWAPv.js";var o=document.getElementById(`app`),s=null,c=null,l=null,u=``,d=new Map,f=[],p=[],m=0,h=0,g=[],_=0,v=`
class Tap extends AudioWorkletProcessor {
  constructor() { super(); this.buf = new Float32Array(2048); this.n = 0; this.start = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    if (this.n === 0) this.start = currentFrame;
    this.buf.set(ch, this.n);
    this.n += ch.length;
    if (this.n >= this.buf.length) {
      this.port.postMessage({ start: this.start, data: this.buf }, [this.buf.buffer]);
      this.buf = new Float32Array(2048);
      this.n = 0;
    }
    return true;
  }
}
registerProcessor('tap', Tap);
`,y=()=>s?.state.test??[];function b(e,t,n=300){e.push(t),e.length>n&&e.shift()}var x=e=>e.length?e.reduce((e,t)=>e+t,0)/e.length:NaN,S=e=>{if(e.length<2)return NaN;let t=x(e);return Math.sqrt(e.reduce((e,n)=>e+(n-t)**2,0)/(e.length-1))},C=e=>{if(!e.length)return NaN;let t=[...e].sort((e,t)=>e-t);return t[Math.min(t.length-1,Math.floor(t.length*.95))]};function w(){d.clear(),f.length=0,p.length=0,m=0,h=0,g=[]}function T(e){_=Math.max(_,e.time);let t=d.get(e.freq);t||d.set(e.freq,t={diffs:[],lastPeak:0,count:0}),t.lastPeak=e.peak,t.count++;let n=g.find(t=>Math.abs(t.t0-e.time)<.04&&!t.onsets.has(e.freq));n?n.onsets.set(e.freq,e.time):g.push({t0:e.time,onsets:new Map([[e.freq,e.time]])})}function E(e){let t=y();if(!t.length)return;let n=t[0].freq,r=g.filter(t=>e-t.t0>.12);g=g.filter(t=>e-t.t0<=.12);for(let e of r){m++,e.onsets.size<t.length&&h++;let r=e.onsets.get(n);if(r==null||e.onsets.size<2)continue;let i=[...e.onsets.values()];b(f,(Math.max(...i)-Math.min(...i))*1e3);let a=[0];for(let[t,i]of e.onsets){if(t===n)continue;let e=(i-r)*1e3,o=d.get(t);b(o.diffs,e),a.push(e-x(o.diffs))}b(p,Math.max(...a)-Math.min(...a))}}async function D(){try{let e=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1,channelCount:1}});l=new AudioContext,await l.audioWorklet.addModule(URL.createObjectURL(new Blob([v],{type:`text/javascript`})));let t=l.createMediaStreamSource(e),r=new AudioWorkletNode(l,`tap`);t.connect(r);let i=l.createGain();i.gain.value=0,r.connect(i).connect(l.destination),c=new n(l.sampleRate),c.onOnset=T,r.port.onmessage=e=>{let{start:t,data:n}=e.data;c.process(n,t),_=(t+n.length)/l.sampleRate,E(_)},await l.resume(),u=``}catch(e){u=`Micro indisponible : ${e.message}`}j()}function O(e){a.set(`cs.verifyCode`,e),s=new r(e,`Outil micro`,`verify`),s.onChange=()=>j(),s.start(),A()}function k(){o.innerHTML=`
    <main class="home">
      <h1>Vérification au micro</h1>
      <p class="sub">Mesure l'écart réel entre les téléphones. À ouvrir sur un ordinateur, dans le même réseau.</p>
      <label class="field">Code de la salle
        <input id="code" autocomplete="off" autocapitalize="characters" value="${i(a.get(`cs.verifyCode`)??``)}">
      </label>
      <button id="join" class="big primary">Rejoindre la salle</button>
    </main>`,o.querySelector(`#join`).addEventListener(`click`,()=>{let e=t(o.querySelector(`#code`).value);e&&O(e)})}function A(){o.innerHTML=`
    <main class="session wide">
      <header><div><span class="role">Vérification</span> · salle <b>${s.code}</b></div></header>
      <div id="vstatus" class="syncline"></div>
      <ol class="hint steps">
        <li>Pose les téléphones <b>à la même distance</b> du micro de l'ordinateur (le son parcourt 34 cm par milliseconde), volume au maximum, son activé sur chacun.</li>
        <li>Active le micro ici, puis le mode test : chaque téléphone joue alors un bip à sa propre fréquence.</li>
        <li>Sur le téléphone du leader : Start. Laisse tourner au moins 30 secondes.</li>
      </ol>
      <section class="tools">
        <button id="mic" class="small">Activer le micro</button>
        <button id="test" class="small">Mode test : OFF</button>
        <button id="reset" class="small">Remettre les mesures à zéro</button>
      </section>
      <section id="verdict"></section>
      <section id="table"></section>
    </main>`,o.querySelector(`#mic`).addEventListener(`click`,()=>void D()),o.querySelector(`#test`).addEventListener(`click`,()=>{s?.send({t:`test.set`,on:!s.state.test}),w()}),o.querySelector(`#reset`).addEventListener(`click`,()=>{w(),j()}),setInterval(j,500),j()}function j(){if(!s)return;let t=document.getElementById(`vstatus`);if(!t)return;let n=s;t.className=`syncline ${n.status===`connected`?`ok`:`bad`}`,t.innerHTML=(n.status===`connected`?`<b>Connecté</b> à ${i(n.hostName)}`:`<b>Pas connecté</b> ${i(n.statusDetail)}`)+` · micro : ${l?`actif (${l.sampleRate} Hz)`:u||`inactif`} · lecture : ${n.state.timeline.playing?`en cours`:`arrêtée`}`;let r=document.getElementById(`test`);r.textContent=`Mode test : ${n.state.test?`ON`:`OFF`}`,r.classList.toggle(`on`,!!n.state.test),document.getElementById(`mic`).disabled=!!l;let a=y(),o=a.map((t,n)=>{let r=d.get(t.freq),a=x(r?.diffs??[]),o=S(r?.diffs??[]),s=r?.diffs[r.diffs.length-1];return`<tr class="${r?n===0||Number.isFinite(o)&&o<2?`ok`:`bad`:``}">
      <td><b>${i(t.name)}</b>${n===0?` <small>(référence)</small>`:``}</td>
      <td>${t.freq/1e3} kHz</td>
      <td>${r?.count??0}</td>
      <td>${n===0?`0`:e(a,2)}</td>
      <td>${n===0?`–`:e(o,2)}</td>
      <td>${n===0?`–`:e(s,2)}</td>
      <td>${n===0||!Number.isFinite(a)?`–`:`${a>0?`+`:``}${e(a,0)} ms`}</td>
      <td>${r?(20*Math.log10(r.lastPeak)).toFixed(0)+` dB`:`–`}</td>
    </tr>`});document.getElementById(`table`).innerHTML=a.length?`<div class="scroll"><table>
        <thead><tr><th>Téléphone</th><th>Bip</th><th>Détections</th><th>Écart moyen (ms)</th><th>Stabilité σ (ms)</th><th>Dernier (ms)</th><th>Avance à régler</th><th>Niveau</th></tr></thead>
        <tbody>${o.join(``)}</tbody></table></div>
       <p class="hint">Écart moyen &gt; 0 : le téléphone joue après le leader. « Avance à régler » : valeur à mettre dans « Son de ce téléphone » sur ce téléphone pour le caler sur le leader.</p>`:`<p class="hint">Mode test inactif : aucune fréquence attribuée.</p>`;let c=Math.max(...a.slice(1).map(e=>S(d.get(e.freq)?.diffs??[])).filter(Number.isFinite)),g=C(p),_=C(f),v=p.length>=20;document.getElementById(`verdict`).innerHTML=`
    <div class="kpis">
      <div class="kpi ${v?c<2?`ok`:`bad`:``}"><span>Stabilité (σ max)</span><b>${e(c,2)} ms</b><small>objectif &lt; 2 ms</small></div>
      <div class="kpi ${v?g<5?`ok`:`bad`:``}"><span>Écart après compensation (p95)</span><b>${e(g,2)} ms</b><small>objectif &lt; 5 ms</small></div>
      <div class="kpi"><span>Écart brut (p95)</span><b>${e(_,1)} ms</b><small>avant réglage de l'avance</small></div>
      <div class="kpi"><span>Temps mesurés</span><b>${p.length}</b><small>${h} incomplets / ${m}</small></div>
    </div>
    ${v?``:`<p class="hint">Résultats fiables à partir de 20 temps mesurés.</p>`}`}k();