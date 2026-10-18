/* Sunny Letters: all page logic (login, dashboard, editor, sharing, viewer).
   Needs config.js (Supabase keys) and the libraries loaded in index.html first. */
const $=(s,r=document)=>r.querySelector(s), app=$('#app');
const COLORS=['#fff8d6','#ffefaa','#fdeaa8','#fce4c4','#f7cfc4','#e3efd3','#dbeaf2','#ffffff'];
const FONTS={'Handwritten':'Caveat','Elegant script':'Dancing Script','Formal script':'Great Vibes','Playful script':'Pacifico','Notebook':'Indie Flower','Neat print':'Patrick Hand','Quick note':'Shadows Into Light','Tiny caps':'Amatic SC','Classic serif':'Lora','Fancy serif':'Playfair Display','Book':'Merriweather','Typewriter':'Courier Prime','Round':'Quicksand','Friendly':'Nunito'};
const HEADS=['','🌻','💌','☀️','🌼','🎂','💛','🕊️'];
const LIMITS={image:5,audio:10,video:25}; // MB per file
const ICONS={
  undo:'<polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>',
  redo:'<polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>',
  bold:'<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
  italic:'<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>',
  underline:'<path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/>',
  strike:'<path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/>',
  sub:'<path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/>',
  sup:'<path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.072"/>',
  color:'<path d="M5 17 12 3l7 14"/><path d="M8 12h8"/>',
  mark:'<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
  nomark:'<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  left:'<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>',
  center:'<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>',
  right:'<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>',
  justify:'<line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>',
  ul:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  ol:'<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
  outdent:'<polyline points="7 8 3 12 7 16"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="18" x2="11" y2="18"/>',
  indent:'<polyline points="3 8 7 12 3 16"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="18" x2="11" y2="18"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  rule:'<path d="M3 12h4M10 12h4M17 12h4"/>',
  clear:'<path d="M4 7V4h16v3"/><path d="M5 20h6"/><path d="M13 4 8 20"/><path d="m15 15 5 5"/><path d="m20 15-5 5"/>'
};
const IC=n=>`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;
const DEF={paper:'#fff8d6',font:'Caveat',border:'solid',head:'💌',pattern:'none',effect:'none',corner:'',coverTitle:''};
const PATTERNS={'Plain':'none','Notebook lines':'lined','Grid':'grid','Polka dots':'dots','Soft stripes':'stripes','Watercolor':'wash','Confetti':'confetti','Gingham':'gingham'};
const EFFECTS={'None':'none','Tape on top':'tape','Folded corner':'fold','Slight tilt':'tilt','Lifted shadow':'lift'};
const CORNERS=['','🌻','🌼','🍃','⭐','❤️','🦋','🎈'];
const OPT={border:['solid','dashed','double','none'],pattern:Object.values(PATTERNS),effect:Object.values(EFFECTS),corner:CORNERS};
// Never trust design data from the database: keep only known values (viewers load other people's letters).
function safeDesign(r){
  r=r||{};const pick=(v,l,d)=>l.includes(v)?v:d,mu=r.music;
  const m=mu&&typeof mu.src==='string'&&/^https:\/\/\S+$/.test(mu.src)?{src:mu.src,path:typeof mu.path==='string'?mu.path:null,title:String(mu.title||'').slice(0,120),credit:String(mu.credit||'').slice(0,300),start:Math.max(0,+mu.start||0),end:Math.max(0,+mu.end||0)}:null;
  return {paper:/^#[0-9a-f]{3,8}$/i.test(r.paper)?r.paper:DEF.paper,font:Object.values(FONTS).includes(r.font)?r.font:DEF.font,
    border:pick(r.border,OPT.border,'solid'),pattern:pick(r.pattern,OPT.pattern,'none'),effect:pick(r.effect,OPT.effect,'none'),
    corner:pick(r.corner,OPT.corner,''),head:HEADS.includes(r.head)?r.head:'',coverTitle:String(r.coverTitle||'').slice(0,60),...(m?{music:m}:{})};
}
const pc=d=>`paper b-${d.border} pt-${d.pattern} fx-${d.effect}`;
const decoHTML=e=>e?['cn1','cn2','cn3','cn4'].map(c=>`<span class="cn ${c}">${esc(e)}</span>`).join(''):'';
let S={user:null,cur:null,design:{...DEF},del:[]}, sb;
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2600)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clean=h=>DOMPurify.sanitize(h||'');
// Letters come from other users: keep only safe, formatting-related inline styles (no overlays or fixed positioning).
const COL=/^(#[0-9a-f]{3,8}|transparent|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\))$/i;
const FAMS=()=>[...Object.values(FONTS),'cursive','serif','sans-serif','monospace'];
const DECO=v=>/^(underline|line-through|none)( (underline|line-through))?$/.test(v);
const STY={'text-align':v=>/^(left|right|center|justify)$/.test(v),'--w':v=>/^[\d.]+$/.test(v),'--x':v=>/^-?[\d.]+$/.test(v),'--y':v=>/^[\d.]+$/.test(v),
  color:v=>COL.test(v),'background-color':v=>COL.test(v),'font-size':v=>/^\d{1,3}(\.\d+)?(px|pt|em|rem|%)$/.test(v),'line-height':v=>/^\d(\.\d+)?$/.test(v),
  'font-weight':v=>/^(bold|normal|[1-9]00)$/.test(v),'font-style':v=>/^(italic|normal)$/.test(v),'text-decoration':DECO,'text-decoration-line':DECO,'-webkit-text-decoration-line':DECO,
  'vertical-align':v=>/^(sub|super)$/.test(v),'margin-left':v=>/^\d{1,3}px$/.test(v),'font-family':v=>v.replace(/["']/g,'').split(',').every(f=>FAMS().includes(f.trim()))};
DOMPurify.addHook('afterSanitizeAttributes',n=>{
  if(n.tagName==='A'&&n.hasAttribute('href')){n.setAttribute('target','_blank');n.setAttribute('rel','noopener noreferrer')}
  if(!n.hasAttribute||!n.hasAttribute('style'))return;
  const keep=[];n.getAttribute('style').split(';').forEach(s=>{const i=s.indexOf(':');if(i<0)return;const k=s.slice(0,i).trim().toLowerCase(),v=s.slice(i+1).trim();
    if(STY[k]&&STY[k](v))keep.push(k+':'+v)});
  keep.length?n.setAttribute('style',keep.join(';')):n.removeAttribute('style');
});
const paperStyle=d=>`background-color:${d.paper};font-family:${d.font},cursive`;
const uname=()=>S.user?.user_metadata?.name||S.user?.email||'';
async function logout(){await sb.auth.signOut();location.href='/'}
function nav(){$('#nav').innerHTML=S.user?`<span>Hi, ${esc(uname())} </span><button class="soft" onclick="dash()">My letters</button> <button class="soft" onclick="logout()">Log out</button>`:''}

/* ---------- auth ---------- */
function authView(mode='login'){
  nav();const reg=mode==='register';
  app.innerHTML=`<div class="card auth"><h2>${reg?'Create your account':'Welcome back'}</h2>
  ${reg?'<label for="n">Name</label><input id="n" autocomplete="name">':''}
  <label for="e">Email</label><input id="e" type="email" autocomplete="email">
  <label for="p">Password</label><input id="p" type="password" autocomplete="${reg?'new-password':'current-password'}">
  <p class="err" id="err"></p><button id="go">${reg?'Sign up':'Log in'}</button>
  <p><a href="#" id="sw">${reg?'I already have an account':'Create a new account'}</a></p></div>`;
  $('#sw').onclick=e=>{e.preventDefault();authView(reg?'login':'register')};
  $('#go').onclick=async()=>{
    const email=$('#e').value.trim(),password=$('#p').value;$('#err').textContent='';
    try{
      if(reg&&(!$('#n').value.trim()||password.length<8))throw new Error('Enter your name and a password of 8+ characters.');
      const r=reg?await sb.auth.signUp({email,password,options:{data:{name:$('#n').value.trim()}}}):await sb.auth.signInWithPassword({email,password});
      if(r.error)throw r.error;
      if(!r.data.session){$('#err').textContent='Check your email to confirm your account, then log in.';return}
      S.user=r.data.user;dash();
    }catch(e){$('#err').textContent=e.message}};
}

/* ---------- dashboard ---------- */
async function dash(){
  nav();const {data:ls,error}=await sb.from('letters').select('id,title,design,updated_at').order('updated_at',{ascending:false});
  if(error)return toast(error.message);
  app.innerHTML=`<div class="top"><h2>My letters</h2><button onclick="edit()">✍ Make a letter</button></div>`+
  (ls.length?`<div class="grid">${ls.map(l=>`<div class="card mini" style="background-color:${safeDesign(l.design).paper}" onclick="edit('${l.id}')">
    <b>${esc(l.design.head||'')} ${esc(l.title)}</b><small>Edited ${new Date(l.updated_at).toLocaleDateString()}</small></div>`).join('')}</div>`
  :`<div class="card empty"><h3>No letters yet</h3><p>Write your first one and share it with someone.</p><button onclick="edit()">Make a letter</button></div>`);
}

/* ---------- designer / editor ---------- */
async function edit(id){
  nav();S.del=[];
  if(id){const {data,error}=await sb.from('letters').select('*').eq('id',id).single();if(error)return toast(error.message);S.cur=data;S.design=safeDesign(data.design)}
  else{S.cur={id:null,title:'',content:''};S.design={...DEF}}
  const d=S.design;
  app.innerHTML=`<div class="top"><h2>${id?'Edit letter':'New letter'}</h2>
    <div class="row"><button class="soft" onclick="dash()">Back</button>
    ${id?'<button class="soft" onclick="del()">Delete</button><button class="soft" onclick="shareModal()">Share</button>':''}
    <button onclick="save()">Save letter</button></div></div>
  <div class="editor"><aside class="card panel"><label for="title">Title</label><input id="title" value="${esc(S.cur.title)}" placeholder="Dear Mom"><details id="dpanel"><summary>🎨 Design your letter</summary>
    <label>Paper color</label><div class="swatches">${COLORS.map(c=>`<button class="sw ${c==d.paper?'on':''}" style="background:${c}" data-c="${c}" aria-label="Paper ${c}"></button>`).join('')}</div>
    <label for="font">Handwriting</label><select id="font">${Object.entries(FONTS).map(([k,v])=>`<option value="${v}" ${v==d.font?'selected':''}>${k}</option>`).join('')}</select>
    <label for="border">Border</label><select id="border">${['solid','dashed','double','none'].map(b=>`<option ${b==d.border?'selected':''}>${b}</option>`).join('')}</select>
    <label for="pattern">Paper pattern</label><select id="pattern">${Object.entries(PATTERNS).map(([k,v])=>`<option value="${v}" ${v==d.pattern?'selected':''}>${k}</option>`).join('')}</select>
    <label for="effect">Paper effect</label><select id="effect">${Object.entries(EFFECTS).map(([k,v])=>`<option value="${v}" ${v==d.effect?'selected':''}>${k}</option>`).join('')}</select>
    <label for="corner">Corner stickers</label><select id="corner">${CORNERS.map(c=>`<option value="${c}" ${c==d.corner?'selected':''}>${c||'None'}</option>`).join('')}</select>
    <label for="head">Header sticker</label><select id="head">${HEADS.map(h=>`<option value="${h}" ${h==d.head?'selected':''}>${h||'None'}</option>`).join('')}</select>
    <label for="ctitle">Cover title (shown before the letter opens)</label>
    <input id="ctitle" maxlength="60" placeholder="A letter for you" value="${esc(d.coverTitle||'')}">
    <label for="music">Background music</label>
    <select id="music"><option value="none">None</option><option value="browse">Browse from device…</option><option value="online">Get music online…</option></select>
    <input type="file" id="mfile" accept="audio/*" hidden>
    <div id="mstate"></div>
    <div id="monline" hidden>
      <div class="row"><input id="mq" placeholder="Search free music, e.g. piano"><button class="soft" type="button" id="msearch">Search</button></div>
      <div id="mres"></div>
      <small>Or paste a direct https link to an audio file:</small>
      <div class="row"><input id="murl" placeholder="https://…/song.mp3"><button class="soft" type="button" id="mlink">Use</button></div>
      <small>Free tracks come from Openverse (Creative Commons). Credit is shown on the letter.</small>
    </div>
    <label for="file">Add media</label><input type="file" id="file" accept="image/*,audio/*,video/*">
    <small>Max: images 5 MB, audio 10 MB, video 25 MB. Click a photo, video or sound in the letter to move it, resize it, choose how text wraps around it, or remove it.</small>
  </details></aside><section>
    <details class="tdrop no-print" id="tdrop"><summary>✎ Text tools</summary>
    <div class="rt" id="rtools" role="toolbar" aria-label="Text formatting">
      <div class="tg" role="group" aria-label="History"><button class="tb" type="button" data-cmd="undo" title="Undo (Ctrl+Z)" aria-label="Undo">${IC('undo')}</button><button class="tb" type="button" data-cmd="redo" title="Redo (Ctrl+Y)" aria-label="Redo">${IC('redo')}</button></div>
      <div class="tg" role="group" aria-label="Text style">
        <select id="tblock" aria-label="Text style"><option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select>
        <select id="tfont" aria-label="Font for selected text"><option value="">Font</option>${Object.entries(FONTS).map(([k,v])=>`<option value="${v}">${k}</option>`).join('')}</select>
        <select id="tsize" aria-label="Size for selected text"><option value="">Size</option>${[12,14,16,18,20,24,28,32,40,48,60,72].map(n=>`<option>${n}</option>`).join('')}</select></div>
      <div class="tg" role="group" aria-label="Character formatting"><button class="tb" type="button" data-cmd="bold" title="Bold (Ctrl+B)" aria-label="Bold">${IC('bold')}</button><button class="tb" type="button" data-cmd="italic" title="Italic (Ctrl+I)" aria-label="Italic">${IC('italic')}</button><button class="tb" type="button" data-cmd="underline" title="Underline (Ctrl+U)" aria-label="Underline">${IC('underline')}</button><button class="tb" type="button" data-cmd="strikeThrough" title="Strikethrough" aria-label="Strikethrough">${IC('strike')}</button><button class="tb" type="button" data-cmd="subscript" title="Subscript" aria-label="Subscript">${IC('sub')}</button><button class="tb" type="button" data-cmd="superscript" title="Superscript" aria-label="Superscript">${IC('sup')}</button></div>
      <div class="tg" role="group" aria-label="Colors">
        <label class="tb clr" title="Text color" style="--c:#4a3f2a">${IC('color')}<span class="bar"></span><input type="color" id="tcol" value="#4a3f2a" aria-label="Text color"></label>
        <label class="tb clr" title="Highlight color" style="--c:#fff176">${IC('mark')}<span class="bar"></span><input type="color" id="thil" value="#fff176" aria-label="Highlight color"></label>
        <button class="tb" type="button" id="thno" title="Remove highlight" aria-label="Remove highlight">${IC('nomark')}</button></div>
      <div class="tg" role="group" aria-label="Alignment"><button class="tb" type="button" data-cmd="justifyLeft" title="Align left" aria-label="Align left">${IC('left')}</button><button class="tb" type="button" data-cmd="justifyCenter" title="Center" aria-label="Center">${IC('center')}</button><button class="tb" type="button" data-cmd="justifyRight" title="Align right" aria-label="Align right">${IC('right')}</button><button class="tb" type="button" data-cmd="justifyFull" title="Justify" aria-label="Justify">${IC('justify')}</button></div>
      <div class="tg" role="group" aria-label="Lists and spacing"><button class="tb" type="button" data-cmd="insertUnorderedList" title="Bullet list" aria-label="Bullet list">${IC('ul')}</button><button class="tb" type="button" data-cmd="insertOrderedList" title="Numbered list" aria-label="Numbered list">${IC('ol')}</button>
        <button class="tb" type="button" id="tout" title="Decrease indent" aria-label="Decrease indent">${IC('outdent')}</button><button class="tb" type="button" id="tin" title="Increase indent" aria-label="Increase indent">${IC('indent')}</button>
        <select id="tlh" aria-label="Line spacing"><option value="">↕ Spacing</option><option>1</option><option>1.15</option><option>1.5</option><option>2</option></select></div>
      <div class="tg" role="group" aria-label="Insert">
        <button class="tb" type="button" id="tlink" title="Add link" aria-label="Add link">${IC('link')}</button><button class="tb" type="button" data-cmd="insertHorizontalRule" title="Divider line" aria-label="Divider line">${IC('rule')}</button>
        <select id="temo" aria-label="Insert emoji"><option value="">😊</option>${['😊','😍','🥰','😘','😂','😢','🙏','💛','❤️','🌻','🌼','🌸','🌈','☀️','⭐','✨','🎂','🎉','🎁','💌','🕊️','🦋','🍀','☕'].map(e=>`<option>${e}</option>`).join('')}</select><button class="tb" type="button" data-cmd="removeFormat" title="Clear formatting" aria-label="Clear formatting">${IC('clear')}</button></div>
    </div></details>
    <div class="tools no-print mbar" id="mbar" hidden><b>Selected media:</b>
      <select id="mlay" aria-label="Media layout"><option value="bl">On its own line, left</option><option value="bc">On its own line, center</option><option value="br">On its own line, right</option><option value="fl">Left, text wraps around</option><option value="fr">Right, text wraps around</option><option value="bh">Behind the text (free move)</option><option value="ft">In front of the text (free move)</option></select>
      <label>Size <input type="range" id="msz" min="8" max="100" aria-label="Media size"></label>
      <button class="soft" type="button" id="mtop">⬆ Above all text</button><button class="soft" type="button" id="mbot">⬇ Below all text</button></div>
    <div class="${pc(d)}" id="paper" style="${paperStyle(d)}"><div id="cns">${decoHTML(d.corner)}</div><div class="head" id="ph">${d.head}</div>
      <div class="body" id="body" contenteditable="true" aria-label="Letter text">${clean(S.cur.content)||'<p>Dear …</p>'}</div></div></section></div>`;
  const P=$('#paper');decorate();initMedia();initRT();
  // Both dropdowns (Design your letter, Text tools) start collapsed on every screen size.
  document.querySelectorAll('.sw').forEach(b=>b.onclick=()=>{S.design.paper=b.dataset.c;P.style.backgroundColor=b.dataset.c;document.querySelectorAll('.sw').forEach(x=>x.classList.toggle('on',x==b))});
  $('#font').onchange=e=>{S.design.font=e.target.value;P.style.fontFamily=e.target.value+',cursive'};
  $('#border').onchange=e=>{S.design.border=e.target.value;P.className=pc(S.design)};
  $('#pattern').onchange=e=>{S.design.pattern=e.target.value;P.className=pc(S.design)};
  $('#effect').onchange=e=>{S.design.effect=e.target.value;P.className=pc(S.design)};
  $('#corner').onchange=e=>{S.design.corner=e.target.value;$('#cns').innerHTML=decoHTML(e.target.value)};
  $('#ctitle').oninput=e=>{S.design.coverTitle=e.target.value};
  $('#head').onchange=e=>{S.design.head=e.target.value;$('#ph').textContent=e.target.value};
  initMusic();
  $('#body').onclick=e=>{
    const w=e.target.closest('.mw');
    if(e.target.classList.contains('mdel')){if(w.dataset.path)S.del.push(w.dataset.path);w.remove();selectMW(null);toast('Removed. Click “Save letter” to keep this change.');return}
    selectMW(w);
  };
  $('#file').onchange=async e=>{
    const f=e.target.files[0];e.target.value='';if(!f)return;const t=f.type.split('/')[0];
    if(!LIMITS[t])return toast('Please choose an image, audio or video file.');
    if(f.size>LIMITS[t]*1048576)return toast(`${t} files can be up to ${LIMITS[t]} MB.`);
    toast('Uploading…');const path=`${S.user.id}/${crypto.randomUUID()}.${(f.name.split('.').pop()||'bin').toLowerCase()}`;
    const {error}=await sb.storage.from('media').upload(path,f,{contentType:f.type});if(error)return toast(error.message);
    const url=sb.storage.from('media').getPublicUrl(path).data.publicUrl;
    const tag=t=='image'?`<img src="${url}" alt="">`:t=='audio'?`<audio src="${url}" controls></audio>`:`<video src="${url}" controls></video>`;
    $('#body').focus();document.execCommand('insertHTML',false,`<div class="mw m-bc" style="--w:${t=='image'?60:t=='audio'?80:70}" data-path="${path}">${tag}</div><p><br></p>`);decorate();selectMW($('#body').querySelector(`.mw[data-path="${path}"]`));toast('Added');};
}
const fmt=c=>{$('#body').focus();document.execCommand(c)};
function decorate(){document.querySelectorAll('#body .mw').forEach(w=>{
  w.contentEditable='false';
  if(!MODES.some(m=>w.classList.contains('m-'+m)))w.classList.add('m-bc');
  if(!w.querySelector('.mdel')){const b=document.createElement('button');b.type='button';b.className='mdel';b.textContent='✕ Remove';w.appendChild(b)}
  if(!w.querySelector('.mmv')){const m=document.createElement('span');m.className='mmv';m.title='Drag to move';m.textContent='✥';w.appendChild(m)}
  if(!w.querySelector('.mrs')){const r=document.createElement('span');r.className='mrs';r.title='Drag to resize';w.appendChild(r)}
})}
function bodyHTML(){const c=$('#body').cloneNode(true);c.querySelectorAll('.mdel,.mmv,.mrs').forEach(b=>b.remove());c.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));c.querySelectorAll('[contenteditable]').forEach(x=>x.removeAttribute('contenteditable'));return clean(c.innerHTML)}
async function save(){
  const p={title:$('#title').value||'Untitled letter',content:bodyHTML(),design:S.design,updated_at:new Date().toISOString()};
  const r=S.cur.id?await sb.from('letters').update(p).eq('id',S.cur.id).select().single():await sb.from('letters').insert(p).select().single();
  if(r.error)return toast(r.error.message);
  if(S.del.length){await sb.storage.from('media').remove(S.del);S.del=[]}
  toast('Saved');S.cur.id?S.cur=r.data:edit(r.data.id);
}
async function del(){
  if(!confirm('Delete this letter for good?'))return;
  const paths=[...(S.cur.content||'').matchAll(/data-path="([^"]+)"/g)].map(m=>m[1]);
  if(S.cur.design?.music?.path)paths.push(S.cur.design.music.path);
  if(paths.length)await sb.storage.from('media').remove(paths);
  const {error}=await sb.from('letters').delete().eq('id',S.cur.id);error?toast(error.message):dash();
}

/* ---------- rich text tools ---------- */
let SAVED=null;
const TAGCMD=['bold','italic','underline','strikeThrough','subscript','superscript'];
document.addEventListener('selectionchange',()=>{const b=$('#body'),s=getSelection();if(b&&s.rangeCount&&b.contains(s.anchorNode)){SAVED=s.getRangeAt(0).cloneRange();updateTools()}});
function restoreSel(){const b=$('#body');b.focus();if(SAVED){const s=getSelection();s.removeAllRanges();s.addRange(SAVED)}}
const cmd=(c,v=null)=>{restoreSel();document.execCommand('styleWithCSS',false,!TAGCMD.includes(c));document.execCommand(c,false,v);updateTools()};
function updateTools(){
  const rt=$('#rtools');if(!rt)return;
  rt.querySelectorAll('[data-cmd]').forEach(b=>{let on=false;try{on=document.queryCommandState(b.dataset.cmd)}catch{}b.classList.toggle('on',!!on)});
  try{const f=(document.queryCommandValue('formatBlock')||'').toLowerCase().replace(/[<>]/g,'');$('#tblock').value=['h1','h2','h3','blockquote'].includes(f)?f:'p'}catch{}
}
function eachBlock(fn){
  restoreSel();const b=$('#body'),s=getSelection();if(!s.rangeCount)return;const r=s.getRangeAt(0);
  [...b.childNodes].filter(n=>r.intersectsNode(n)).forEach(n=>{
    if(n.nodeType===3){if(!n.textContent.trim())return;const p=document.createElement('p');n.replaceWith(p);p.appendChild(n);fn(p)}
    else if(n.nodeType===1&&!n.classList.contains('mw'))fn(n)});
}
function setSize(px){
  if(!SAVED||SAVED.collapsed)return toast('Select some text first, then choose a size.');
  restoreSel();document.execCommand('styleWithCSS',false,false);document.execCommand('fontSize',false,'7');
  $('#body').querySelectorAll('font[size="7"]').forEach(f=>{const s=document.createElement('span');s.style.fontSize=px+'px';while(f.firstChild)s.appendChild(f.firstChild);f.replaceWith(s)});
}
function initRT(){
  const rt=$('#rtools'),body=$('#body');
  rt.addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault()});
  rt.addEventListener('click',e=>{const b=e.target.closest('[data-cmd]');if(b)cmd(b.dataset.cmd)});
  $('#tblock').onchange=e=>cmd('formatBlock','<'+e.target.value+'>');
  $('#tfont').onchange=e=>{if(e.target.value)cmd('fontName',e.target.value);e.target.value=''};
  $('#tsize').onchange=e=>{if(e.target.value)setSize(e.target.value);e.target.value=''};
  $('#tcol').onchange=e=>{e.target.parentElement.style.setProperty('--c',e.target.value);cmd('foreColor',e.target.value)};
  $('#thil').onchange=e=>{e.target.parentElement.style.setProperty('--c',e.target.value);cmd('hiliteColor',e.target.value)};
  $('#thno').onclick=()=>cmd('hiliteColor','transparent');
  $('#tin').onclick=()=>eachBlock(k=>{k.style.marginLeft=Math.min(200,(parseInt(k.style.marginLeft)||0)+32)+'px'});
  $('#tout').onclick=()=>eachBlock(k=>{const m=Math.max(0,(parseInt(k.style.marginLeft)||0)-32);m?k.style.marginLeft=m+'px':k.style.removeProperty('margin-left')});
  $('#tlh').onchange=e=>{if(e.target.value)eachBlock(k=>{k.style.lineHeight=e.target.value});e.target.value=''};
  $('#tlink').onclick=()=>{const u=prompt('Link address (starts with https://)');if(!u)return;if(!/^https?:\/\//i.test(u))return toast('The address must start with http:// or https://');cmd('createLink',u)};
  $('#temo').onchange=e=>{if(e.target.value)cmd('insertText',e.target.value);e.target.value=''};
  body.addEventListener('paste',e=>{e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain'))});
}

/* ---------- media layout: move, resize, wrap ---------- */
const MODES=['bl','bc','br','fl','fr','bh','ft'];
const getMode=w=>MODES.find(m=>w.classList.contains('m-'+m))||'bc';
const isFree=w=>['bh','ft'].includes(getMode(w));
let selMW=null;
function selectMW(w){
  document.querySelectorAll('#body .mw.sel').forEach(x=>x.classList.remove('sel'));
  selMW=w||null;$('#mbar').hidden=!w;
  if(w){w.classList.add('sel');syncBar(w)}
}
function syncBar(w){$('#mlay').value=getMode(w);$('#msz').value=Math.round(parseFloat(w.style.getPropertyValue('--w'))||60)}
function setMode(w,mode){
  const was=isFree(w),b=$('#body').getBoundingClientRect(),r=w.getBoundingClientRect(),pw=$('#paper').getBoundingClientRect().width;
  MODES.forEach(m=>w.classList.remove('m-'+m));w.classList.add('m-'+mode);
  if(isFree(w)&&!was){w.style.setProperty('--x',((r.left-b.left)/pw*100).toFixed(2));w.style.setProperty('--y',Math.max(0,Math.round(r.top-b.top)))}
  syncBar(w);
}
function initMedia(){
  const body=$('#body'),paper=$('#paper');body.classList.add('editing');
  $('#mlay').onchange=e=>selMW&&setMode(selMW,e.target.value);
  $('#msz').oninput=e=>selMW&&selMW.style.setProperty('--w',e.target.value);
  $('#mtop').onclick=()=>{if(!selMW)return;if(isFree(selMW))setMode(selMW,'bc');body.insertBefore(selMW,body.firstChild);selMW.scrollIntoView({block:'nearest'})};
  $('#mbot').onclick=()=>{if(!selMW)return;if(isFree(selMW))setMode(selMW,'bc');body.appendChild(selMW);body.insertAdjacentHTML('beforeend','<p><br></p>');selMW.scrollIntoView({block:'nearest'})};
  body.addEventListener('pointerdown',e=>{
    const rs=e.target.closest('.mrs'),mv=e.target.closest('.mmv');if(!rs&&!mv)return;
    const w=e.target.closest('.mw');e.preventDefault();selectMW(w);
    const pr=paper.getBoundingClientRect(),br=body.getBoundingClientRect(),r=w.getBoundingClientRect();
    const free=isFree(w),sx=e.clientX,sy=e.clientY,w0=r.width,x0=r.left-br.left,y0=r.top-br.top,maxY=Math.max(0,br.height-r.height);
    const move=ev=>{
      const dx=ev.clientX-sx,dy=ev.clientY-sy;
      if(rs){w.style.setProperty('--w',Math.min(100,Math.max(8,(w0+dx)/pr.width*100)).toFixed(1));syncBar(w)}
      else if(free){w.style.setProperty('--x',((x0+dx)/pr.width*100).toFixed(2));w.style.setProperty('--y',Math.min(maxY,Math.max(0,Math.round(y0+dy))))}
      else{w.style.transform=`translate(${dx}px,${dy}px)`;w.style.opacity='.7'}
    };
    const up=ev=>{
      window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      if(mv&&!free){
        w.style.transform='';w.style.opacity='';
        const kids=[...body.children].filter(k=>k!==w&&!k.classList.contains('m-bh')&&!k.classList.contains('m-ft'));
        let ref=null;for(const k of kids){const kr=k.getBoundingClientRect();if(ev.clientY<kr.top+kr.height/2){ref=k;break}}
        body.insertBefore(w,ref);
        if(!body.lastElementChild||body.lastElementChild.classList.contains('mw'))body.insertAdjacentHTML('beforeend','<p><br></p>');
      }
    };
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  });
}

/* ---------- background music ---------- */
let MRES=[];
const musicKind=()=>S.design.music?(S.design.music.path?'browse':'online'):'none';
function initMusic(){
  const sel=$('#music'),mf=$('#mfile');
  sel.value=musicKind();renderMusic();
  sel.onchange=()=>{
    $('#monline').hidden=sel.value!=='online';
    if(sel.value==='none')setMusic(null);
    if(sel.value==='browse')mf.click();
  };
  mf.addEventListener('cancel',()=>{sel.value=musicKind()});
  mf.onchange=async e=>{
    const f=e.target.files[0];e.target.value='';
    if(!f){sel.value=musicKind();return}
    if(!f.type.startsWith('audio/')){sel.value=musicKind();return toast('Please choose an audio file.')}
    if(f.size>LIMITS.audio*1048576){sel.value=musicKind();return toast(`Music can be up to ${LIMITS.audio} MB.`)}
    toast('Uploading music…');
    const path=`${S.user.id}/${crypto.randomUUID()}.${(f.name.split('.').pop()||'mp3').toLowerCase()}`;
    const {error}=await sb.storage.from('media').upload(path,f,{contentType:f.type});
    if(error){sel.value=musicKind();return toast(error.message)}
    setMusic({src:sb.storage.from('media').getPublicUrl(path).data.publicUrl,path,title:f.name.replace(/\.[^.]+$/,'')});
    toast('Music added');
  };
  $('#msearch').onclick=searchMusic;
  $('#mq').onkeydown=e=>{if(e.key==='Enter')searchMusic()};
  $('#mlink').onclick=()=>{const u=$('#murl').value.trim();if(!/^https:\/\/\S+$/i.test(u))return toast('Paste a direct https link to an audio file.');setMusic({src:u,path:null,title:'Online music'})};
}
function setMusic(m){
  const old=S.design.music;
  if(old&&old.path&&(!m||m.path!==old.path))S.del.push(old.path);
  if(m)S.design.music=m;else delete S.design.music;
  $('#music').value=musicKind();
  if(m)$('#monline').hidden=true;
  renderMusic();
}
let pvTimer;
const fmt2=s=>{s=Math.round(s||0);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function renderMusic(){
  clearInterval(pvTimer);
  const m=S.design.music,el=$('#mstate');
  if(!m){el.innerHTML='';return}
  el.innerHTML=`<div class="mstate">🎵 <b>${esc(m.title||'Music')}</b>${m.credit?`<br><small>${esc(m.credit)}</small>`:''}
    <audio id="mprev" src="${esc(m.src)}" controls preload="metadata"></audio>
    <b>Loop section</b> <small id="cinfo"></small>
    <div class="row"><input id="cs" type="number" min="0" step="0.1" placeholder="Start (sec)" value="${m.start||''}" aria-label="Loop start in seconds"><input id="ce" type="number" min="0" step="0.1" placeholder="End (sec)" value="${m.end||''}" aria-label="Loop end in seconds"></div>
    <div class="row"><button class="soft" type="button" id="cst">Start = now</button><button class="soft" type="button" id="cen">End = now</button><button class="soft" type="button" id="cpv">▶ Test loop</button></div>
    <small>Play the song above, pause where you want, then press “Start = now” or “End = now”. Leave both empty to loop the whole song.</small>
    <button class="soft" type="button" id="mrm">Remove music</button></div>`;
  const a=$('#mprev'),cs=$('#cs'),ce=$('#ce');
  const sync=()=>{const s=Math.max(0,+cs.value||0);let e=Math.max(0,+ce.value||0);if(e&&e<=s+0.2)e=0;m.start=s;m.end=e;
    $('#cinfo').textContent=e?`(${fmt2(s)} → ${fmt2(e)}, ${(e-s).toFixed(1)}s repeating)`:s?`(from ${fmt2(s)} to the end)`:''};
  cs.oninput=ce.oninput=sync;
  $('#cst').onclick=()=>{cs.value=a.currentTime.toFixed(1);sync()};
  $('#cen').onclick=()=>{ce.value=a.currentTime.toFixed(1);sync()};
  $('#cpv').onclick=()=>{if(!a.paused){a.pause();return}a.currentTime=m.start||0;a.play()};
  a.onended=()=>{if(m.start||m.end){a.currentTime=m.start||0;a.play()}};
  pvTimer=setInterval(()=>{if(!a.paused&&m.end&&a.currentTime>=m.end-0.03)a.currentTime=m.start||0},30);
  $('#mrm').onclick=()=>setMusic(null);
  sync();
}
async function searchMusic(){
  const q=$('#mq').value.trim(),box=$('#mres');
  if(!q)return toast('Type what music you want, e.g. piano.');
  box.textContent='Searching…';
  try{
    const r=await fetch('https://api.openverse.org/v1/audio/?'+new URLSearchParams({q,category:'music',license:'cc0,pdm,by',page_size:'10'}));
    if(!r.ok)throw new Error('bad');
    MRES=(await r.json()).results.filter(x=>x.url&&x.url.startsWith('https://'));
    if(!MRES.length){box.textContent='No results. Try another word.';return}
    box.innerHTML=MRES.map((x,i)=>`<div class="res"><b>${esc(x.title||'Untitled')}</b><br><small>${esc(x.creator||'Unknown')} · ${esc((x.license||'').toUpperCase())}</small><audio src="${esc(x.url)}" controls preload="none"></audio><button class="soft" type="button" onclick="pickMusic(${i})">Use this</button></div>`).join('');
  }catch{box.textContent='Could not reach the music library. You can paste a direct audio link instead.'}
}
function pickMusic(i){const x=MRES[i];setMusic({src:x.url,path:null,title:x.title||'Online music',credit:`${x.title||'Untitled'} by ${x.creator||'Unknown'} (CC ${(x.license||'').toUpperCase()}${x.license_version?' '+x.license_version:''}), via Openverse`})}
function playMusic(m){
  const s=+m.start||0,e=+m.end||0,clip=s>0||e>s,a=new Audio(m.src);
  a.volume=0;a.loop=!clip;
  if(clip){
    a.currentTime=s;a.addEventListener('loadedmetadata',()=>{if(a.currentTime<s)a.currentTime=s});
    a.onended=()=>{a.currentTime=s;a.play()};
    setInterval(()=>{if(!a.paused&&e>s&&a.currentTime>=e-0.03)a.currentTime=s},30);
  }
  const b=document.createElement('button');b.className='mtoggle no-print';b.textContent='🔊';b.setAttribute('aria-label','Mute or play music');document.body.appendChild(b);
  let t;const fade=()=>{clearInterval(t);t=setInterval(()=>{a.volume=Math.min(0.35,a.volume+0.02);if(a.volume>=0.35)clearInterval(t)},120)};
  const start=()=>a.play().then(()=>{b.textContent='🔊';fade()}).catch(()=>{b.textContent='🔇'});
  b.onclick=()=>{if(a.paused)start();else{a.pause();b.textContent='🔇'}};
  start();
}

/* ---------- sharing ---------- */
function shareModal(){
  const code=S.cur.share_token,url=location.origin+'/l/'+code,t=encodeURIComponent(S.cur.title||'A letter for you'),u=encodeURIComponent(url);
  const links=[['WhatsApp',`https://wa.me/?text=${t}%20${u}`],['Telegram',`https://t.me/share/url?url=${u}&text=${t}`],['Messenger',`https://www.facebook.com/dialog/send?link=${u}&app_id=0&redirect_uri=${u}`],
    ['Facebook',`https://www.facebook.com/sharer/sharer.php?u=${u}`],['X / Twitter',`https://twitter.com/intent/tweet?text=${t}&url=${u}`],['LinkedIn',`https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['Reddit',`https://www.reddit.com/submit?url=${u}&title=${t}`],['Pinterest',`https://pinterest.com/pin/create/button/?url=${u}&description=${t}`],
    ['Email',`mailto:?subject=${t}&body=${u}`],['SMS',`sms:?&body=${t}%20${u}`]];
  $('#modalBody').innerHTML=`<div class="top"><h2 style="font:700 30px Caveat">Share this letter</h2><button class="soft" onclick="closeM()">Close</button></div>
  <div class="row"><input readonly value="${url}" aria-label="Letter link"><button onclick="copy('${url}')">Copy link</button></div>
  <div class="opts">
    <button onclick="showQR('${url}')">▦ QR code</button><button onclick="showBar('${code}')">▌▌ Barcode</button>
    <button onclick="copy('${code}')">🔑 Copy code</button><button onclick="nativeShare('${url}')">📲 Device share</button>
    <button onclick="copy('<iframe src=&quot;${url}&quot; width=&quot;100%&quot; height=&quot;600&quot;></iframe>')">&lt;/&gt; Embed</button>
    <button onclick="closeM();window.print()">🖨 Print / PDF</button>
    ${links.map(([n,h])=>`<a href="${h}" target="_blank" rel="noopener">${n}</a>`).join('')}</div>
  <div class="share-out" id="out">Pick a way to share. Anyone with the link can read this letter, but only you can edit it.</div>`;
  $('#modal').classList.add('on');
}
const closeM=()=>$('#modal').classList.remove('on');
const copy=async t=>{try{await navigator.clipboard.writeText(t);toast('Copied')}catch{toast('Copy failed')}};
const nativeShare=u=>navigator.share?navigator.share({title:S.cur.title,url:u}):toast('Device share is not supported here');
function showQR(u){
  const q=qrcode(0,'M');q.addData(u);q.make();
  const n=q.getModuleCount(),cell=10,pad=cell*4,size=n*cell+pad*2,c=document.createElement('canvas');
  c.width=c.height=size;const x=c.getContext('2d');
  x.fillStyle='#fff8d6';x.fillRect(0,0,size,size);x.fillStyle='#4a3f2a';
  for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))x.fillRect(pad+k*cell,pad+r*cell,cell,cell);
  const png=c.toDataURL('image/png'),jpg=c.toDataURL('image/jpeg',0.95);
  $('#out').innerHTML=`<img src="${png}" alt="QR code" width="220"><p><a download="letter-qr.png" href="${png}">Download PNG</a> · <a download="letter-qr.jpg" href="${jpg}">Download JPG</a></p>`}
function showBar(c){$('#out').innerHTML='<svg id="bc"></svg><p>Code: <b>'+c+'</b> (open /l/'+c+')</p>';
  JsBarcode('#bc',c,{format:'CODE128',background:'#fff8d6',lineColor:'#4a3f2a',height:70})}

/* ---------- public viewer (no login) ---------- */
async function view(tok){
  document.querySelector('header').style.display='none';
  const {data,error}=await sb.rpc('get_public_letter',{code:tok});
  if(error||!data||!data.length){app.innerHTML=`<div class="card empty"><h3>This letter does not exist.</h3><a href="/">Go home</a></div>`;return}
  const l=data[0],d=safeDesign(l.design),m=d.music||null;
  const render=()=>{app.innerHTML=`<div class="${pc(d)}" style="${paperStyle(d)}">${decoHTML(d.corner)}<div class="head">${esc(d.head)}</div><div class="body vb">${clean(l.content)}</div><p style="text-align:right">— ${esc(l.author)}</p></div>
  ${m&&m.credit?`<p class="credit">♪ ${esc(m.credit)}</p>`:''}
  <p class="no-print" style="text-align:center"><a href="/">Make your own letter</a></p>`};
  if(!m&&!d.coverTitle){render();return}
  app.innerHTML=`<div class="card gate" style="background-color:${d.paper}"><div class="env">${esc(d.head||'💌')}</div><h2 style="font-family:${d.font},cursive">${esc(d.coverTitle||'A letter for you')}</h2><p>From ${esc(l.author)}</p><button id="open">Open letter${m?' ♪':''}</button></div>`;
  $('#open').onclick=()=>{render();if(m)playMusic(m)};
}

/* ---------- boot ---------- */
(async()=>{
  if(!window.SUPABASE_URL||window.SUPABASE_URL.includes('YOUR-PROJECT')){app.innerHTML='<div class="card empty"><h3>Almost there</h3><p>Add your Supabase URL and key to <b>public/config.js</b>.</p></div>';return}
  sb=supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
  $('#modal').onclick=e=>{if(e.target.id=='modal')closeM()};
  const m=location.pathname.match(/^\/l\/([\w-]+)/);if(m)return view(m[1]);
  const {data}=await sb.auth.getSession();S.user=data.session?.user||null;S.user?dash():authView();
})();