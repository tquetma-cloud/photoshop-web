/* Photoshop frontend demo. Authentication and posts are stored in this browser only.
   For production, connect a secure backend, database, and image storage service. */
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const STORE = {users:'photoshop_demo_users', session:'photoshop_demo_session', posts:'photoshop_demo_posts', drafts:'photoshop_demo_drafts'};
const seedPhotos = [
 {title:'Where the Mountains Meet',category:'Nature',author:'Alex Carter',initials:'AC',likes:'2.4k',comments:124,img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85'},
 {title:'City Lights at Dusk',category:'City',author:'Sophia Lee',initials:'SL',likes:'1.8k',comments:96,img:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=85'},
 {title:'Little Curious Friend',category:'Animals',author:'Daniel Smith',initials:'DS',likes:'3.1k',comments:210,img:'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=85'},
 {title:'Blue Water, Quiet Mind',category:'Travel',author:'Emma Wilson',initials:'EW',likes:'1.2k',comments:76,img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85'},
 {title:'A Little Spring',category:'Nature',author:'Mia Chen',initials:'MC',likes:'856',comments:42,img:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=85'},
 {title:'Under the Milky Way',category:'Art',author:'Lucas Brown',initials:'LB',likes:'1.6k',comments:98,img:'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=85'},
 {title:'The Open Road',category:'Travel',author:'Noah Kim',initials:'NK',likes:'2.7k',comments:156,img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85'},
 {title:'Into the Green',category:'Nature',author:'Olivia Park',initials:'OP',likes:'1.4k',comments:87,img:'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=85'}
];
function read(key, fallback=[]){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
function getSession(){return read(STORE.session,null)}
function initials(name='User'){return name.split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join('')||'U'}
function escapeHTML(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function setYear(){const el=$('#year');if(el)el.textContent=new Date().getFullYear()}
function switchAuth(view){
 const login=view==='login';$('#login-form')?.classList.toggle('hidden',!login);$('#signup-form')?.classList.toggle('hidden',login);
 $$('.auth-tab').forEach(b=>b.classList.toggle('active',b.dataset.authView===view));
 const alert=$('#auth-alert');if(alert){alert.classList.add('hidden');alert.textContent='';alert.classList.remove('error')}
}
function authMessage(message,error=false){const el=$('#auth-alert');if(!el)return;el.textContent=message;el.classList.remove('hidden','error');if(error)el.classList.add('error')}
function initAuth(){
 if(!$('#login-form'))return;
 $$('[data-auth-view]').forEach(b=>b.addEventListener('click',()=>switchAuth(b.dataset.authView)));
 $('#login-form').addEventListener('submit',e=>{
   e.preventDefault();const fd=new FormData(e.currentTarget);const identity=String(fd.get('identity')).trim().toLowerCase();const password=String(fd.get('password'));
   const users=read(STORE.users,[]);const user=users.find(u=>(u.email.toLowerCase()===identity||u.username.toLowerCase()===identity)&&u.password===password);
   if(!user){authMessage('We could not find a matching demo account. Create an account first or check your details.',true);return}
   write(STORE.session,{name:user.name,username:user.username,email:user.email});location.href='dashboard.html';
 });
 $('#signup-form').addEventListener('submit',e=>{
   e.preventDefault();const fd=new FormData(e.currentTarget);const name=String(fd.get('name')).trim();const email=String(fd.get('email')).trim();const username=String(fd.get('username')).trim();const password=String(fd.get('password'));
   const users=read(STORE.users,[]);if(users.some(u=>u.email.toLowerCase()===email.toLowerCase()||u.username.toLowerCase()===username.toLowerCase())){authMessage('That email or username is already registered in this browser.',true);return}
   const user={name,email,username,password};users.push(user);write(STORE.users,users);write(STORE.session,{name,username,email});location.href='dashboard.html';
 });
 $('#forgot-link')?.addEventListener('click',e=>{e.preventDefault();authMessage('Password recovery needs a backend email service. For this demo, create a new local account if needed.')});
 $('#year').textContent=new Date().getFullYear();
 const session=getSession();if(session) { /* Keep login page available so users can switch accounts. */ }
}
function ensureSession(){
 const session=getSession();if(!session){location.replace('index.html');return null}
 $('#header-name')?.replaceChildren(document.createTextNode(session.name||session.username||'Your Profile'));
 const avatar=$('#header-avatar');if(avatar)avatar.textContent=initials(session.name||session.username);
 const prev=$('#preview-author');if(prev)prev.textContent=session.name||session.username;
 const pa=$('#preview-avatar');if(pa)pa.textContent=initials(session.name||session.username);
 $('#logout-btn')?.addEventListener('click',()=>{localStorage.removeItem(STORE.session);location.href='index.html'});
 return session;
}
function getAllPosts(){return [...read(STORE.posts,[]),...seedPhotos.map((p,i)=>({...p,id:'seed-'+i,createdAt:0}))]}
function photoCard(p){return `<article class="photo-card" data-category="${escapeHTML(p.category||'Other')}" data-title="${escapeHTML(p.title)}"><div class="photo-thumb"><img loading="lazy" src="${escapeHTML(p.img)}" alt="${escapeHTML(p.title)}"><div class="photo-stats"><span class="stat-pill">♥ ${escapeHTML(p.likes||'0')}</span><span class="stat-pill">▢ ${escapeHTML(p.comments||0)}</span></div></div><div class="photo-info"><h3 title="${escapeHTML(p.title)}">${escapeHTML(p.title)}</h3><div class="photo-byline"><span class="avatar">${escapeHTML(p.initials||initials(p.author||'User'))}</span><span>by ${escapeHTML(p.author||'Community')}</span></div></div></article>`}
function renderGallery(filter='All',query='',sort='latest'){
 const grid=$('#gallery-grid');if(!grid)return;
 let posts=getAllPosts().filter(p=>(filter==='All'||p.category===filter)&&(`${p.title} ${p.author} ${p.category} ${p.description||''}`).toLowerCase().includes(query.toLowerCase()));
 if(sort==='popular')posts=posts.reverse();
 grid.innerHTML=posts.length?posts.map(photoCard).join(''):'<div class="empty-state">No photos found. Try another search or category.</div>';
}
function initDashboard(){
 if(!$('#gallery-grid'))return;const session=ensureSession();if(!session)return;
 let category='All',query='',sort='latest';
 renderGallery();
 $('#category-select')?.addEventListener('change',e=>{category=e.target.value;renderGallery(category,query,sort)});
 $('#sort-select')?.addEventListener('change',e=>{sort=e.target.value;renderGallery(category,query,sort)});
 $('#global-search')?.addEventListener('input',e=>{query=e.target.value;renderGallery(category,query,sort)});
 $$('.category-filter').forEach(a=>a.addEventListener('click',()=>{category=a.dataset.category;const sel=$('#category-select');if(sel)sel.value=category;renderGallery(category,query,sort)}));
 const trend=$('#trending-list');if(trend)trend.innerHTML=seedPhotos.slice(0,5).map(p=>`<div class="trend-item"><img loading="lazy" src="${p.img}" alt=""><div><b>${p.title}</b><small>${p.category}</small><small class="trend-likes">♡ ${p.likes} likes</small></div></div>`).join('');
}
let selectedFiles=[];
function initCreate(){
 if(!$('#post-form'))return;const session=ensureSession();if(!session)return;
 const title=$('#post-title'),description=$('#post-description'),images=$('#post-images'),previewImage=$('#preview-image'),coverSelect=$('#cover-select');
 const updatePreview=()=>{
   $('#preview-title').textContent=title.value.trim()||'Your post title';
   $('#preview-description').textContent=description.value.trim()||'Your description will appear here as you type.';
   $('#title-count').textContent=title.value.length;$('#description-count').textContent=description.value.length;
   $('#preview-visibility').textContent=$('#post-visibility').value;
   $('#preview-tags').innerHTML=$('#post-tags').value.split(',').map(s=>s.trim()).filter(Boolean).slice(0,8).map(t=>`<span class="tag-chip">#${escapeHTML(t)}</span>`).join('');
   updateCover();
 };
 function updateCover(){
   const index=Number(coverSelect.value||0);const file=selectedFiles[index];
   if(file){const url=URL.createObjectURL(file);previewImage.innerHTML=`<img src="${url}" alt="Post cover preview">`}
   else previewImage.innerHTML='<span>Your cover image will appear here</span>';
 }
 function renderSelected(){
   $('#selected-images').innerHTML=selectedFiles.map((file,i)=>`<div class="selected-image"><img src="${URL.createObjectURL(file)}" alt="${escapeHTML(file.name)}"><button type="button" data-remove-image="${i}" aria-label="Remove image">×</button></div>`).join('');
   coverSelect.innerHTML='<option value="0">Use first uploaded image</option>'+selectedFiles.map((f,i)=>`<option value="${i}">${escapeHTML(f.name)}</option>`).join('');
   coverSelect.disabled=selectedFiles.length===0;
   $('#selected-images').querySelectorAll('[data-remove-image]').forEach(btn=>btn.addEventListener('click',()=>{selectedFiles.splice(Number(btn.dataset.removeImage),1);renderSelected();updatePreview()}));
   updateCover();
 }
 function addFiles(fileList){
   const incoming=[...fileList].filter(f=>/^image\/(jpeg|png|webp)$/.test(f.type));
   const tooLarge=incoming.filter(f=>f.size>10*1024*1024);
   const good=incoming.filter(f=>f.size<=10*1024*1024);
   if(tooLarge.length)showPostMessage(`${tooLarge.length} image(s) exceed the 10 MB limit and were skipped.`,true);
   selectedFiles=[...selectedFiles,...good].slice(0,12);renderSelected();
 }
 images.addEventListener('change',e=>addFiles(e.target.files));
 const zone=$('.upload-zone');zone?.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragover')});zone?.addEventListener('dragleave',()=>zone.classList.remove('dragover'));zone?.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('dragover');addFiles(e.dataTransfer.files)});
 [title,description,$('#post-tags'),$('#post-visibility')].forEach(el=>el.addEventListener('input',updatePreview));coverSelect.addEventListener('change',updateCover);
 function showPostMessage(msg,error=false){const el=$('#post-message');el.textContent=msg;el.classList.remove('hidden','error');if(error)el.classList.add('error')}
 function collectPost(status){
   const postTitle=title.value.trim(),desc=description.value.trim(),category=$('#post-category').value;
   if(!postTitle||!desc||!category){showPostMessage('Please complete the title, description, and category before publishing.',true);return null}
   const media=selectedFiles.map(f=>({name:f.name,type:f.type,size:f.size}));const cover=selectedFiles[Number(coverSelect.value||0)];
   return {id:Date.now().toString(),title:postTitle,description:desc,category,album:$('#post-album').value,tags:$('#post-tags').value.split(',').map(s=>s.trim()).filter(Boolean),visibility:$('#post-visibility').value,comments:$('#post-comments').value,author:session.name||session.username,initials:initials(session.name||session.username),img:cover?URL.createObjectURL(cover):(seedPhotos[0].img),media,status,createdAt:Date.now()};
 }
 $('#save-draft').addEventListener('click',()=>{
   const draft={title:title.value,description:description.value,category:$('#post-category').value,album:$('#post-album').value,tags:$('#post-tags').value,visibility:$('#post-visibility').value,createdAt:Date.now()};
   const drafts=read(STORE.drafts,[]);drafts.unshift(draft);write(STORE.drafts,drafts);showPostMessage('Draft saved in this browser.'); 
 });
 $('#post-form').addEventListener('submit',e=>{
   e.preventDefault();const post=collectPost('published');if(!post)return;
   // Browser-local demo only. Object URLs won't persist after reload; real image uploads need storage.
   const posts=read(STORE.posts,[]);posts.unshift({...post,img:post.img.startsWith('blob:')?seedPhotos[0].img:post.img});write(STORE.posts,posts);
   showPostMessage('Post published in this browser demo. Redirecting to your gallery…');setTimeout(()=>location.href='dashboard.html',800);
 });
 updatePreview();
}
document.addEventListener('DOMContentLoaded',()=>{setYear();initAuth();if($('#gallery-grid'))initDashboard();if($('#post-form'))initCreate()});
