/* Kreduj Whiteboard Core — standalone browser whiteboard. */
'use strict';
const NS='http://www.w3.org/2000/svg',W=1100,H=720,KEY='kreduj-whiteboard-v1';
const board=document.getElementById('board'),layer=document.getElementById('elements'),preview=document.getElementById('preview');
const $=id=>document.getElementById(id);
let tool='pen',color='#6b47d7',width=3,shapes=[],history=[],future=[],draft=null,selected=null,drag=null,nextId=1;
function sample(){return [
 {type:'text',x:205,y:74,text:'Twierdzenie Pitagorasa',size:39,color:'#29213e'},
 {type:'line',x:211,y:86,x2:665,y2:86,color:'#ba9df7',width:6},
 {type:'text',x:80,y:215,text:'a² + b² = c²',size:44,color:'#6b47d7'},
 {type:'text',x:80,y:270,text:'W trójkącie prostokątnym:',size:20,color:'#383247'},
 {type:'text',x:80,y:303,text:'suma kwadratów przyprostokątnych',size:18,color:'#383247'},
 {type:'text',x:80,y:332,text:'równa się kwadratowi przeciwprostokątnej.',size:17,color:'#383247'},
 {type:'line',x:520,y:212,x2:520,y2:395,color:'#30304f',width:4},
 {type:'line',x:520,y:395,x2:768,y2:395,color:'#30304f',width:4},
 {type:'line',x:520,y:212,x2:768,y2:395,color:'#30304f',width:4},
 {type:'text',x:496,y:305,text:'b',size:29,color:'#2870dc'},
 {type:'text',x:625,y:429,text:'a',size:29,color:'#2870dc'},
 {type:'text',x:665,y:281,text:'c',size:29,color:'#7942ce'},
 {type:'rect',x:525,y:364,w:29,h:29,color:'#dd78a8',width:2},
 {type:'text',x:825,y:185,text:'Zadanie:',size:25,color:'#b14781'},
 {type:'text',x:825,y:226,text:'Jeśli a = 3 i b = 4,',size:18,color:'#3c3449'},
 {type:'text',x:825,y:253,text:'ile wynosi c?',size:18,color:'#3c3449'},
 {type:'text',x:835,y:339,text:'c² = 9 + 16',size:25,color:'#258a5b'},
 {type:'text',x:835,y:378,text:'c = 5',size:31,color:'#258a5b'},
 {type:'text',x:122,y:490,text:'f(x) = x²',size:26,color:'#6f3ddb'},
 {type:'line',x:134,y:646,x2:367,y2:646,color:'#8a8398',width:2},
 {type:'line',x:247,y:690,x2:247,y2:530,color:'#8a8398',width:2},
 {type:'circle',x:530,y:550,w:145,h:145,color:'#28895c',width:3},
 {type:'line',x:602,y:622,x2:673,y2:574,color:'#28895c',width:2},
 {type:'text',x:533,y:717,text:'P = πr²',size:24,color:'#228d57'},
 {type:'rect',x:770,y:535,w:150,h:105,color:'#3b91d5',width:3},
 {type:'text',x:796,y:601,text:'P = a · b',size:22,color:'#235f9a'}
].map(o=>({...o,width:o.width??3,id:nextId++}));}
function position(ev){const p=board.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;const matrix=board.getScreenCTM();const t=matrix?p.matrixTransform(matrix.inverse()):{x:0,y:0};return {x:Math.max(0,Math.min(W,t.x)),y:Math.max(0,Math.min(H,t.y))};}
function element(tag,attributes){const node=document.createElementNS(NS,tag);for(const [key,val] of Object.entries(attributes))node.setAttribute(key,String(val));return node;}
function shapeElement(s){
 if(s.type==='pen')return element('polyline',{points:s.points.map(p=>p.x+','+p.y).join(' '),fill:'none',stroke:s.color,'stroke-width':s.width,'stroke-linecap':'round','stroke-linejoin':'round'});
 if(s.type==='line')return element('line',{x1:s.x,y1:s.y,x2:s.x2,y2:s.y2,stroke:s.color,'stroke-width':s.width,'stroke-linecap':'round'});
 if(s.type==='rect')return element('rect',{x:s.x,y:s.y,width:Math.max(0,s.w),height:Math.max(0,s.h),rx:2,fill:'transparent',stroke:s.color,'stroke-width':s.width});
 if(s.type==='circle')return element('ellipse',{cx:s.x+s.w/2,cy:s.y+s.h/2,rx:Math.max(0,s.w/2),ry:Math.max(0,s.h/2),fill:'transparent',stroke:s.color,'stroke-width':s.width});
 if(s.type==='text'){const node=element('text',{x:s.x,y:s.y,fill:s.color,'font-size':s.size||26,'font-family':'system-ui,sans-serif'});node.textContent=s.text;return node;}
 return null;
}
function render(){layer.replaceChildren();for(const shape of shapes){const node=shapeElement(shape);if(!node)continue;node.dataset.id=shape.id;node.style.pointerEvents='visiblePainted';if(shape.id===selected&&shape.type!=='text')node.setAttribute('stroke-dasharray','7 3');layer.append(node);}preview.replaceChildren();if(draft){const node=shapeElement(draft);if(node){node.setAttribute('opacity','.55');preview.append(node);}}$('count').textContent=shapes.length+' obiektów';$('undo').disabled=!history.length;$('redo').disabled=!future.length;}
function snapshot(){history.push(JSON.stringify(shapes));if(history.length>70)history.shift();future=[];}
function commit(){try{localStorage.setItem(KEY,JSON.stringify(shapes));$('saveStatus').textContent='● Zapisano lokalnie';}catch{$('saveStatus').textContent='● Brak dostępu do zapisu';}render();}
function switchTool(t){tool=t;selected=null;document.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===t));board.classList.toggle('select',t==='select');board.classList.toggle('eraser',t==='eraser');render();}
function makeShape(t,p){return {type:t,id:nextId++,color,width,x:p.x,y:p.y,...(t==='pen'?{points:[p]}:{}),...(t==='line'?{x2:p.x,y2:p.y}:{}),...(['rect','circle'].includes(t)?{w:0,h:0}:{})};}
board.addEventListener('pointerdown',ev=>{if(ev.button!==0)return;const p=position(ev),id=ev.target?.dataset?.id?Number(ev.target.dataset.id):null;if(tool==='eraser'){if(id!==null){snapshot();shapes=shapes.filter(s=>s.id!==id);commit();}return;}if(tool==='select'){selected=id;if(id!==null){snapshot();drag={id,last:p,changed:false};board.setPointerCapture(ev.pointerId);}render();return;}if(tool==='text'||tool==='formula'){const value=prompt(tool==='formula'?'Wpisz wzór (np. a² + b² = c²):':'Wpisz tekst:');if(value&&value.trim()){snapshot();shapes.push({...makeShape('text',p),text:value.slice(0,250),size:tool==='formula'?31:23});commit();}return;}snapshot();draft=makeShape(tool,p);board.setPointerCapture(ev.pointerId);render();});
board.addEventListener('pointermove',ev=>{const p=position(ev);if(drag){const s=shapes.find(x=>x.id===drag.id);if(!s)return;const dx=p.x-drag.last.x,dy=p.y-drag.last.y;drag.last=p;drag.changed=true;if(s.type==='pen')s.points=s.points.map(pt=>({x:pt.x+dx,y:pt.y+dy}));else if(s.type==='line'){s.x+=dx;s.y+=dy;s.x2+=dx;s.y2+=dy;}else{s.x+=dx;s.y+=dy;}render();return;}if(!draft)return;if(draft.type==='pen')draft.points.push(p);else if(draft.type==='line'){draft.x2=p.x;draft.y2=p.y;}else{draft.w=p.x-draft.x;draft.h=p.y-draft.y;}render();});
board.addEventListener('pointerup',()=>{if(drag){if(!drag.changed)history.pop();drag=null;commit();return;}if(!draft)return;if(['rect','circle'].includes(draft.type)){if(draft.w<0){draft.x+=draft.w;draft.w=-draft.w;}if(draft.h<0){draft.y+=draft.h;draft.h=-draft.h;}}const valid=draft.type==='pen'?draft.points.length>1:draft.type==='line'?Math.hypot(draft.x2-draft.x,draft.y2-draft.y)>2:draft.w>3&&draft.h>3;if(valid)shapes.push(draft);else history.pop();draft=null;commit();});
board.addEventListener('pointercancel',()=>{draft=null;drag=null;render();});
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>switchTool(b.dataset.tool)));
$('color').addEventListener('input',e=>color=e.target.value);$('strokeWidth').addEventListener('input',e=>width=Number(e.target.value));
$('undo').addEventListener('click',()=>{if(!history.length)return;future.push(JSON.stringify(shapes));shapes=JSON.parse(history.pop());selected=null;commit();});
$('redo').addEventListener('click',()=>{if(!future.length)return;history.push(JSON.stringify(shapes));shapes=JSON.parse(future.pop());selected=null;commit();});
window.addEventListener('keydown',ev=>{if(['Delete','Backspace'].includes(ev.key)&&selected!==null&&!(ev.target instanceof HTMLInputElement)){snapshot();shapes=shapes.filter(s=>s.id!==selected);selected=null;commit();}if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='z'){ev.preventDefault();$('undo').click();}});
function download(name,content,mime){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type:mime}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
$('downloadSvg').addEventListener('click',()=>{const copy=board.cloneNode(true);copy.querySelector('#preview')?.remove();copy.querySelector('#elements')?.querySelectorAll('[stroke-dasharray]').forEach(n=>n.removeAttribute('stroke-dasharray'));download('kreduj-tablica.svg',new XMLSerializer().serializeToString(copy),'image/svg+xml');});
$('downloadJson').addEventListener('click',()=>download('kreduj-tablica.json',JSON.stringify({version:1,elements:shapes},null,2),'application/json'));
$('shareBtn').addEventListener('click',()=>$('downloadJson').click());$('importJson').addEventListener('click',()=>$('jsonFile').click());
function validShape(s){return s&&['pen','line','rect','circle','text'].includes(s.type)&&typeof s.color==='string'&&/^#[0-9a-fA-F]{6}$/.test(s.color)&&Number.isFinite(s.width)&&s.width>0&&s.width<=40&&Number.isFinite(s.id)&&Number.isFinite(s.x)&&Number.isFinite(s.y)&&(s.type!=='pen'||Array.isArray(s.points)&&s.points.length<=50000&&s.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)))&&(s.type!=='text'||typeof s.text==='string'&&s.text.length<=250)&&(s.type!=='line'||Number.isFinite(s.x2)&&Number.isFinite(s.y2))&&(!['rect','circle'].includes(s.type)||(Number.isFinite(s.w)&&Number.isFinite(s.h)&&s.w>=0&&s.h>=0));}
$('jsonFile').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>2000000)throw Error('Plik jest zbyt duży');const data=JSON.parse(await file.text());if(data.version!==1||!Array.isArray(data.elements)||data.elements.length>5000||!data.elements.every(validShape))throw Error('Nieprawidłowy format tablicy');snapshot();shapes=data.elements;nextId=Math.max(1,...shapes.map(s=>s.id))+1;selected=null;commit();}catch(err){alert('Nie można wczytać tablicy: '+err.message);}finally{e.target.value='';}});
$('clear').addEventListener('click',()=>{if(confirm('Wyczyścić tablicę?')){snapshot();shapes=[];selected=null;commit();}});
$('reset').addEventListener('click',()=>{if(confirm('Przywrócić przykładową lekcję?')){snapshot();shapes=sample();selected=null;commit();}});
function grid(v){$('gridBackground').style.display=v?'':'none';$('showGrid').checked=v;}
$('showGrid').addEventListener('change',e=>grid(e.target.checked));$('toggleGrid').addEventListener('click',()=>grid(!$('showGrid').checked));
try{const saved=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(saved)&&saved.length<=5000&&saved.every(validShape)){shapes=saved;nextId=Math.max(1,...shapes.map(s=>s.id))+1;}else shapes=sample();}catch{shapes=sample();}
render();
