(()=>{
'use strict';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const VK='https://vk.me/club49220614';
const catalog={
 kitchen:{name:'Кухня',image:'concept-kitchen.svg',kind:'home',summary:'Практичная зона приготовления с нужным хранением.',tips:['Расположение техники','Рабочая поверхность и хранение','Планировка под помещение'],defaults:[260,245,60]},
 wardrobe:{name:'Шкаф-купе',image:'concept-wardrobe.svg',kind:'home',summary:'Система хранения, которая использует пространство по высоте.',tips:['Глубина и доступ к вещам','Наполнение и двери','Сложные ниши и выступы'],defaults:[240,255,62]},
 hall:{name:'Прихожая',image:'concept-hall.svg',kind:'home',summary:'Место для верхней одежды, обуви и мелочей.',tips:['Шкаф и обувница','Открытые и закрытые секции','Зеркало и место для сидения'],defaults:[220,240,42]},
 storage:{name:'Система хранения',image:'concept-storage.svg',kind:'home',summary:'Сочетание открытых полок и закрытых фасадов.',tips:['Комбинированные секции','Организация внутреннего пространства','Под разные габариты помещения'],defaults:[230,250,45]},
 office:{name:'Офисная мебель',image:'concept-office.svg',kind:'business',summary:'Рабочие места, столы и системы для документов.',tips:['Удобство повседневной работы','Кабель-менеджмент и хранение','Учет площади офиса'],defaults:[180,75,75]},
 retail:{name:'Торговое оборудование',image:'concept-retail.svg',kind:'business',summary:'Витрины, полки и стойки под торговую площадь.',tips:['Размер и потоки посетителей','Системы выкладки товаров','Стойки и хранение'],defaults:[240,200,60]}
};
const toneMap={forest:{name:'Хвойный',fill:'#3b5a50',light:'#7b9c89',dark:'#264137'},sand:{name:'Песочный',fill:'#d6c5ae',light:'#f0e3d1',dark:'#ac9277'},wood:{name:'Древесный',fill:'#ad7954',light:'#d7aa7d',dark:'#815637'},graphite:{name:'Графит',fill:'#4a4e50',light:'#898f8d',dark:'#343738'}};
const state={mode:'home',type:'kitchen',layout:'straight',tone:'forest',quantity:1,photos:[]};
const element={builder:$('#builder'),type:$('#furniture'),width:$('#width-cm'),height:$('#height-cm'),depth:$('#depth-cm'),material:$('#material'),budget:$('#budget'),extra:$('#extra'),photos:$('#photos'),photoPreviews:$('#photo-previews'),preview:$('#builder-svg'),previewTitle:$('#preview-title'),previewSummary:$('#preview-summary'),layoutGroup:$('#layout-group')};
let toastTimer=null;
function toast(text){const t=$('#toast');if(!t)return;t.textContent=text;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3800)}
function num(value,min,max,def){const v=Number(value);return Number.isFinite(v)?Math.max(min,Math.min(max,Math.round(v))):def}
function getMeasures(){return [num(element.width.value,40,1200,260),num(element.height.value,30,500,245),num(element.depth.value,20,180,60)]}
function populateType(selected){element.type.replaceChildren();Object.entries(catalog).filter(([,data])=>data.kind===state.mode).forEach(([id,data])=>{const opt=document.createElement('option');opt.value=id;opt.textContent=data.name;element.type.append(opt)});state.type=selected&&catalog[selected]&&catalog[selected].kind===state.mode?selected:element.type.options[0].value;element.type.value=state.type;}
function chooseMode(mode,type,scroll=false,resetMeasures=true){if(!['home','business'].includes(mode))return;state.mode=mode;$$('[data-mode]').forEach(btn=>{const active=btn.dataset.mode===mode;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active))});populateType(type|| (mode==='business'?'office':'kitchen'));if(resetMeasures)setDefaultMeasures();refreshPreview();if(scroll)element.builder.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
function chooseType(type,scroll=false){if(!catalog[type])return;chooseMode(catalog[type].kind,type,scroll,true)}
function setDefaultMeasures(){const d=catalog[state.type].defaults;[element.width,element.height,element.depth].forEach((input,i)=>input.value=String(d[i]));}
function makeSvg(type,colors,layout){const {fill,light,dark}=colors;const bg=`<rect width="600" height="460" rx="10" fill="#e9e6dc"/><path d="M0 342 600 274v186H0Z" fill="#d7cec1"/><path d="M0 342 600 274" stroke="#c7beb0" stroke-width="2"/><g stroke="#859489" stroke-opacity=".13" stroke-width="1"><path d="M20 0v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460m35-460v460M0 40h600M0 80h600M0 120h600M0 160h600M0 200h600M0 240h600M0 280h600M0 320h600M0 360h600M0 400h600M0 440h600"/></g>`;
 const cabinet=(x,y,w,h,doors=3)=>{let out=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${dark}" stroke-width="2"/>`;
 for(let i=1;i<doors;i++){let xx=x+w*i/doors;out+=`<path d="M${xx} ${y}v${h}" stroke="${dark}" stroke-opacity=".6" stroke-width="2"/>`}
 for(let i=0;i<doors;i++){let xx=x+w*(i+.87)/doors;out+=`<path d="M${xx} ${y+h*.47}v21" stroke="${light}" stroke-width="3.5" stroke-linecap="round"/>`}
 return out;
 };
 let figure='';
 if(type==='kitchen'){
 figure+=`<path d="M104 171h394v110H104Z" fill="#c8c5bd"/><path d="M108 166h396l-21 16H129Z" fill="#f8f3ea"/>`;
 figure+=cabinet(104,182,388,100,4)+`<rect x="93" y="301" width="415" height="10" fill="#f7f0e7"/><path d="M100 311h404v105H100Z" fill="${dark}"/>`+cabinet(107,320,389,87,4);
 figure+=`<path d="M92 299l399-17 29 17-415 15Z" fill="#e7e1d7"/><path d="M135 295l105-4 17 8-107 4Z" fill="#6e807b"/><path d="M184 292v-24q0-21 15-21t15 21" fill="none" stroke="#5d6e67" stroke-width="7"/>`;
 if(layout==='corner') figure+=`<path d="M396 308l93-50 31 24-16 111-101 29Z" fill="${fill}"/><path d="M390 304l104-53 37 29-107 55Z" fill="#ded6c9"/><path d="M447 335l-7 69" stroke="${light}" stroke-width="3"/>`;
 if(layout==='u') figure+=`<path d="M272 350l170-47 69 38-151 59Z" fill="#efebe3"/><path d="M360 400l151-59v42l-151 57Z" fill="${fill}"/><path d="M272 350l88 50v40l-88-49Z" fill="${dark}"/>`;
 }else if(type==='wardrobe'){
 figure+=`<path d="M111 82h375l26 17v320l-401 8Z" fill="${dark}"/><path d="M111 82h375l26 17H133Z" fill="${light}"/>`+cabinet(120,96,365,316,3)+`<path d="M240 98v310M366 98v310" stroke="${light}" stroke-width="3"/><path d="M135 114l88 1v265H135Z" fill="#ffffff" fill-opacity=".16"/>`;
 }else if(type==='hall'){
 figure+=cabinet(103,99,204,304,2)+`<rect x="320" y="155" width="151" height="147" rx="74" fill="#e9eee7" stroke="#b0a597" stroke-width="12"/><path d="M312 334h186v28H312Z" fill="#d4ad8d"/>`+cabinet(315,364,180,63,2);
 }else if(type==='storage'){
 figure+=`<rect x="107" y="93" width="390" height="319" fill="#a4b2a5"/>`+cabinet(248,103,245,304,2)+`<path d="M113 106h127v304H113Z" fill="${light}"/><path d="M115 180h125m-125 79h125m-125 79h125" stroke="${dark}" stroke-width="5"/><rect x="129" y="119" width="45" height="59" fill="#ddc0a6"/><rect x="190" y="128" width="34" height="50" fill="#f1e6d3"/><rect x="132" y="279" width="75" height="56" fill="#bb987c"/>`;
 }else if(type==='office'){
 figure+=`<rect x="115" y="116" width="176" height="194" fill="#d7d7cb"/><path d="M128 175h148M128 233h148" stroke="#b1c2b1" stroke-width="8"/>`;
 figure+=`<path d="M155 287h333l55 32-342 30Z" fill="#e2c5ab"/><path d="M201 349l342-30v22l-342 32-46-61v-25Z" fill="#ac8366"/><path d="M211 370v69m295-97v89" stroke="${dark}" stroke-width="17"/><path d="M304 367h181v56H304Z" fill="${fill}"/><path d="M316 263h129v59H316Z" fill="#354f48"/><rect x="325" y="272" width="112" height="41" fill="#bccac0"/>`;
 }else if(type==='retail'){
 figure+=`<path d="M110 103h350v21H110Z" fill="${dark}"/><path d="M118 125v213m168-213v213m168-213v213" stroke="${fill}" stroke-width="14"/><path d="M125 186h330m-330 78h330m-330 76h330" stroke="#c6a587" stroke-width="15"/><rect x="145" y="145" width="62" height="40" fill="#d7cab7"/><rect x="222" y="153" width="50" height="33" fill="#ae8e78"/><rect x="306" y="152" width="59" height="34" fill="#adbca6"/><rect x="146" y="208" width="80" height="56" fill="#bbc2b4"/><rect x="310" y="222" width="78" height="42" fill="#d9bba1"/>`;
 figure+=`<path d="M313 350l209-20 41 22-214 28Z" fill="#e1c2a4"/><path d="M349 380l214-28v80l-214 20Z" fill="${fill}"/><path d="M313 350l36 30v72l-36-29Z" fill="${dark}"/>`;
 }
 const meter=`<g font-family="Arial,sans-serif" fill="#536d60"><path d="M95 75H505" stroke="#567467" stroke-width="1.8" stroke-dasharray="5 6"/><path d="M95 64v22m410-22v22" stroke="#567467" stroke-width="2"/><rect x="254" y="58" width="96" height="28" rx="5" fill="#f8f4eb"/><text x="302" y="77" text-anchor="middle" font-size="15" font-weight="bold" id="preview-width-label">${getMeasures()[0]} см</text><path d="M548 107v323" stroke="#567467" stroke-width="1.8" stroke-dasharray="5 6"/><path d="M537 107h22m-22 323h22" stroke="#567467" stroke-width="2"/><rect x="520" y="256" width="65" height="27" rx="4" fill="#f8f4eb"/><text x="552" y="274" font-size="13" font-weight="bold" text-anchor="middle">${getMeasures()[1]} см</text><path d="M87 421h53" stroke="#567467" stroke-dasharray="5 6"/><text x="76" y="445" font-size="11" letter-spacing="1">ЭСКИЗ</text></g>`;
 return bg+`<g id="furniture-illustration">${figure}</g>`+meter;
}
function refreshPreview(){const type=state.type;const data=catalog[type];const c=toneMap[state.tone];element.layoutGroup.hidden=type!=='kitchen';element.preview.innerHTML=makeSvg(type,c,state.layout);const subtitle=type==='kitchen'?`, ${({straight:'прямая',corner:'угловая',u:'П-образная'})[state.layout]}`:'';element.previewTitle.textContent=data.name+subtitle;const d=getMeasures();element.previewSummary.textContent=`${d[0]} × ${d[1]} × ${d[2]} см · ${c.name.toLowerCase()} · ${state.quantity} шт.`;}
function activate(selector,key,value,className='selected'){ $$(selector).forEach(el=>{const active=el.dataset[key]===value;el.classList.toggle(className,active);el.setAttribute('aria-pressed',String(active))}) }
$$('.seg-choice').forEach(btn=>btn.addEventListener('click',()=>chooseMode(btn.dataset.mode)));
element.type.addEventListener('change',()=>{state.type=element.type.value;setDefaultMeasures();refreshPreview()});
$$('[data-layout]').forEach(btn=>btn.addEventListener('click',()=>{state.layout=btn.dataset.layout;activate('[data-layout]','layout',state.layout);refreshPreview()}));
$$('[data-tone]').forEach(btn=>btn.addEventListener('click',()=>{state.tone=btn.dataset.tone;activate('[data-tone]','tone',state.tone);refreshPreview()}));
[element.width,element.height,element.depth].forEach(input=>{input.addEventListener('input',refreshPreview);input.addEventListener('change',()=>{const d=getMeasures();[element.width,element.height,element.depth].forEach((el,i)=>el.value=d[i]);refreshPreview()})});
function quantity(delta){state.quantity=Math.max(1,Math.min(30,state.quantity+delta));$('#qty-display').textContent=state.quantity;refreshPreview()}
$('#qty-down').addEventListener('click',()=>quantity(-1));$('#qty-up').addEventListener('click',()=>quantity(1));
$$('[data-route]').forEach(btn=>btn.addEventListener('click',()=>chooseMode(btn.dataset.route,undefined,true)));
$$('[data-preset]').forEach(btn=>btn.addEventListener('click',()=>chooseType(btn.dataset.preset,true)));
// Concept gallery and modal. These are conceptual illustrations, not customer projects.
const modal=$('#idea-modal'),modalImage=$('#modal-image'),modalTitle=$('#modal-heading'),modalDescription=$('#modal-description'),modalTips=$('#modal-tips');
let lastFocus=null,selectedConcept=null;
function openModal(id){if(!catalog[id])return;lastFocus=document.activeElement;selectedConcept=id;const d=catalog[id];modalTitle.textContent=d.name;modalDescription.textContent=d.summary;modalImage.src='./assets/'+d.image;modalImage.alt=`Авторский демонстрационный эскиз: ${d.name.toLowerCase()}`;modalTips.replaceChildren(...d.tips.map(t=>{const s=document.createElement('span');const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.classList.add('ic');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#i-check');icon.append(use);s.append(icon,document.createTextNode(t));return s}));modal.hidden=false;document.body.style.overflow='hidden';$('.modal-close',modal).focus()}
function closeModal(){if(modal.hidden)return;modal.hidden=true;document.body.style.overflow='';if(lastFocus&&lastFocus.isConnected)lastFocus.focus()}
$$('[data-concept]').forEach(card=>card.addEventListener('click',()=>openModal(card.dataset.concept)));
$$('[data-close="modal"]').forEach(el=>el.addEventListener('click',closeModal));
$('#modal-pick').addEventListener('click',()=>{const chosen=selectedConcept;closeModal();chooseType(chosen,true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeMobileNav()}if(e.key==='Tab'&&!modal.hidden){const focus=$$('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',modal).filter(el=>!el.disabled&&el.offsetParent!==null);if(focus.length){const first=focus[0],last=focus[focus.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}});
function filterIdeas(kind){$$('[data-filter]').forEach(btn=>{const active=btn.dataset.filter===kind;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))});const cards=$$('[data-concept]');cards.forEach(card=>{card.hidden=kind!=='all'&&card.dataset.kind!==kind;card.style.gridColumn=kind==='all'?'': 'auto'})}
$$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>filterIdeas(btn.dataset.filter)));
// Mobile navigation.
const navToggle=$('#nav-toggle'),mobileNav=$('#mobile-nav');
function closeMobileNav(){mobileNav.hidden=true;navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Открыть меню')}
navToggle.addEventListener('click',()=>{const open=mobileNav.hidden;mobileNav.hidden=!open;navToggle.setAttribute('aria-expanded',String(open));navToggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});
$$('a',mobileNav).forEach(a=>a.addEventListener('click',closeMobileNav));
window.addEventListener('resize',()=>{if(window.innerWidth>1040)closeMobileNav()},{passive:true});
const header=$('.header');window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>24),{passive:true});
// Photos are local, never transmitted by this demo. Revoke all object URLs.
function renderPhotos(){element.photoPreviews.replaceChildren(...state.photos.map((p,i)=>{const tile=document.createElement('div');tile.className='photo-tile';const img=document.createElement('img');img.src=p.url;img.alt=`Предпросмотр выбранного изображения: ${p.name}`;const rm=document.createElement('button');rm.type='button';rm.setAttribute('aria-label',`Удалить изображение ${p.name}`);rm.innerHTML='<svg class="ic" aria-hidden="true"><use href="#i-close"/></svg>';rm.addEventListener('click',()=>{URL.revokeObjectURL(p.url);state.photos.splice(i,1);renderPhotos();element.photos.value=''});tile.append(img,rm);return tile}))}
element.photos.addEventListener('change',()=>{const files=[...(element.photos.files||[])];let errors=0;for(const file of files){if(state.photos.length>=3){errors++;break}if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){errors++;continue}state.photos.push({name:file.name,url:URL.createObjectURL(file)})}element.photos.value='';renderPhotos();if(errors)toast('Можно выбрать до 3 изображений JPG, PNG, WebP размером до 8 МБ каждое')});
window.addEventListener('pagehide',()=>state.photos.forEach(p=>URL.revokeObjectURL(p.url)));
// Copy the prepared enquiry. Never claim that photos or data were sent.
function buildRequest(){const dims=getMeasures();const layoutLabel=({straight:'прямая',corner:'угловая',u:'П-образная'})[state.layout];const s=[
 'Здравствуйте! Хочу обсудить изготовление мебели на заказ в Ижевске.',
 `Назначение: ${state.mode==='home'?'для дома':'для бизнеса'}`,
 `Изделие: ${catalog[state.type].name}${state.type==='kitchen'?' (планировка: '+layoutLabel+')':''}`,
 `Примерные размеры: ширина ${dims[0]} см, высота ${dims[1]} см, глубина ${dims[2]} см`,
 `Количество: ${state.quantity} шт.`,
 `Желаемый оттенок: ${toneMap[state.tone].name.toLowerCase()}`,
 `Предпочтительный материал: ${element.material.value}`,
 `Ориентир по бюджету: ${element.budget.value}`,
 `Пожелания: ${element.extra.value.trim()||'пока нет'}`,
 state.photos.length?`Есть фотографии помещения или эскизы: ${state.photos.length} шт. (приложу к сообщению отдельно).`:'Фотографии пока нет.',
 'Подскажите, пожалуйста, возможность изготовления, примерную стоимость и условия замера.'
 ];return s.join('\n')}
async function copyText(value){if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(value);return true}catch(e){/* fallback below */}}
 const textarea=document.createElement('textarea');textarea.value=value;textarea.setAttribute('readonly','');textarea.style.cssText='position:fixed;left:-10000px;top:0;opacity:0';document.body.append(textarea);textarea.select();textarea.setSelectionRange(0,value.length);let ok=false;try{ok=document.execCommand('copy')}catch(e){}textarea.remove();return ok}
$('#copy-request').addEventListener('click',async()=>{const copied=await copyText(buildRequest());toast(copied?'Запрос скопирован. Откройте VK и вставьте текст. Фото добавьте отдельно.':'Не удалось скопировать автоматически. Выделите текст заявки в браузере или повторите попытку.')});
// Reveal animations are progressive enhancement, not required for visibility.
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px 70px 0px'});$$('.section-heading,.idea-card,.route-card,.process-item,.business-copy,.materials-copy,.cost-lead,.faq-intro').forEach(el=>{el.classList.add('reveal-ready');obs.observe(el)})}
// Initialize from URL hash if desired without changing browser history.
populateType('kitchen');refreshPreview();
if(window.location.hash==='#builder-business')chooseMode('business','office',false);
})();
