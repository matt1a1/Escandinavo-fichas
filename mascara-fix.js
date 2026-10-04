(function(){
var PV=20,PE=10,DEF=10;
function isMask(){
  if(!window.state)return false;
  if(state.tipoFicha==="mascaras")return true;
  var id="";
  try{id=(typeof AGENTE_ID!=="undefined"&&AGENTE_ID)||new URLSearchParams(location.search).get("id")||""}catch(e){}
  if(!id)return false;
  try{
    var reg=JSON.parse(localStorage.getItem("escandinavo-agentes-registro")||"[]");
    for(var i=0;i<reg.length;i++){
      if(reg[i]&&reg[i].id===id&&reg[i].tipoFicha==="mascaras"){state.tipoFicha="mascaras";return true}
    }
  }catch(e){}
  try{
    var raw=localStorage.getItem("escandinavo-ficha-"+id);
    if(raw){var d=JSON.parse(raw);if(d&&d.tipoFicha==="mascaras"){state.tipoFicha="mascaras";return true}}
  }catch(e){}
  return false;
}
function freeL(){
  if(!window.state)return;
  if(state.tipoFicha!=="mascaras"&&state.tipoFicha!=="custom")return;
  window.isFichaCustom=function(){return !!(state&&(state.tipoFicha==="custom"||state.tipoFicha==="mascaras"))};
  window.isFichaLivre=window.isFichaCustom;
}
function patch(){
  if(typeof calcularRecursos==="function"&&!calcularRecursos.__msk2){
    var _c=calcularRecursos;
    window.calcularRecursos=function(){
      var r=_c.apply(this,arguments);
      if(state&&state.mascaraAtiva){r.pvMax=(+r.pvMax||0)+PV;r.peMax=(+r.peMax||0)+PE}
      return r;
    };
    window.calcularRecursos.__msk2=true;
  }
  if(typeof calcularDefesa==="function"&&!calcularDefesa.__msk2){
    var _d=calcularDefesa;
    window.calcularDefesa=function(){
      var v=_d.apply(this,arguments);
      if(state&&state.mascaraAtiva)v=(+v||0)+DEF;
      return v;
    };
    window.calcularDefesa.__msk2=true;
  }
}
function uiOn(){
  var b=document.getElementById("msk-badge");
  if(b){b.textContent="ATIVA";b.classList.add("on")}
  document.body.classList.add("msk-red");
  var o=document.getElementById("msk-on"),s=document.getElementById("msk-stay"),f=document.getElementById("msk-off");
  if(o)o.style.cssText="display:none!important";
  if(s)s.style.cssText="display:inline-block!important;visibility:visible!important;opacity:1!important;cursor:pointer;border-radius:8px;padding:10px 14px;font-weight:700;font-size:.85rem;border:none;background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff";
  if(f)f.style.cssText="display:inline-block!important;visibility:visible!important;opacity:1!important;cursor:pointer;border-radius:8px;padding:10px 14px;font-weight:700;font-size:.85rem;border:1px solid #57534e;background:#1c1917;color:#e7e5e4";
}
function uiOff(){
  var b=document.getElementById("msk-badge");
  if(b){b.textContent="INATIVA";b.classList.remove("on")}
  document.body.classList.remove("msk-red");
  var o=document.getElementById("msk-on"),s=document.getElementById("msk-stay"),f=document.getElementById("msk-off");
  if(o)o.style.cssText="display:inline-block!important;cursor:pointer;border-radius:8px;padding:10px 14px;font-weight:700;font-size:.85rem;border:none;background:linear-gradient(135deg,#9f1239,#e11d48);color:#fff";
  if(s)s.style.cssText="display:none!important";
  if(f)f.style.cssText="display:none!important";
}
function nums(){
  if(typeof calcularRecursos!=="function")return;
  var r=calcularRecursos();
  var def=typeof calcularDefesa==="function"?calcularDefesa():15;
  function set(id,v){var e=document.getElementById(id);if(e)e.textContent=String(v)}
  if(state.vidaAtual!=null)set("vida-atual",state.vidaAtual);set("vida-max",r.pvMax);
  if(state.sanAtual!=null)set("san-atual",state.sanAtual);set("san-max",r.sanMax);
  if(state.peAtual!=null)set("pe-atual",state.peAtual);set("pe-max",r.peMax);set("defesa",def);
  try{if(typeof renderRecursos==="function")renderRecursos()}catch(e){}
}
function save(){if(typeof saveState==="function")saveState();else if(typeof scheduleSave==="function")scheduleSave()}
function colocar(){
  if(!window.state)return;
  if(state.mascaraAtiva){uiOn();return}
  var custo=6,san=state.sanAtual;
  if(san==null)san=(typeof calcularRecursos==="function"?calcularRecursos().sanMax:0)||0;
  san=+san||0;
  if(san<custo&&!confirm("Sanidade insuficiente ("+san+"). Continuar?"))return;
  state.mascaraAtiva=false;
  var r0=typeof calcularRecursos==="function"?calcularRecursos():{pvMax:0,peMax:0};
  var curPv=state.vidaAtual!=null?+state.vidaAtual:(r0.pvMax||0);
  var curPe=state.peAtual!=null?+state.peAtual:(r0.peMax||0);
  state.sanAtual=Math.max(0,san-custo);
  state.mascaraAtiva=true;
  state.vidaAtual=curPv+PV;
  state.peAtual=curPe+PE;
  uiOn();
  var m=document.getElementById("msk-msg");
  if(m)m.textContent="ATIVA: +20 Vida · +10 Esforço · +10 Defesa · −6 Sanidade";
  nums();save();
}
function manter(){
  if(!window.state)return;
  if(!state.mascaraAtiva){colocar();return}
  var custo=2,san=state.sanAtual;
  if(san==null)san=(typeof calcularRecursos==="function"?calcularRecursos().sanMax:0)||0;
  san=+san||0;
  if(san<custo&&!confirm("Sanidade insuficiente ("+san+"). Continuar?"))return;
  state.sanAtual=Math.max(0,san-custo);
  uiOn();
  var m=document.getElementById("msk-msg");
  if(m)m.textContent="Mantida: −2 Sanidade";
  nums();save();
}
function tirar(){
  if(!window.state)return;
  if(!state.mascaraAtiva){uiOff();return}
  if(!confirm("Tirar a máscara? Perde +20 Vida / +10 Esforço / +10 Defesa."))return;
  var curPv=state.vidaAtual!=null?+state.vidaAtual:0;
  var curPe=state.peAtual!=null?+state.peAtual:0;
  state.mascaraAtiva=false;
  var npv=Math.max(0,curPv-PV);
  state.vidaAtual=npv;
  state.peAtual=Math.max(0,curPe-PE);
  uiOff();
  var m=document.getElementById("msk-msg");
  if(m)m.textContent=npv===0?"Removida. 0 Vida — morrendo.":"Removida. Bônus perdidos.";
  if(npv===0)alert("0 Vida — morrendo.");
  nums();save();
}
function inject(){
  if(!window.state)return;
  if(!isMask())return;
  freeL();patch();
  document.body.classList.add("ficha-mascaras-sheet");
  if(state.mascaraAtiva==null)state.mascaraAtiva=false;
  if(!document.getElementById("msk-css")){
    var st=document.createElement("style");st.id="msk-css";
    st.textContent="#msk-box{display:block!important;margin:10px 0 12px;padding:14px;border-radius:12px;border:1px solid rgba(239,68,68,.45);background:linear-gradient(180deg,rgba(127,29,29,.28),rgba(20,10,12,.55));box-shadow:0 8px 24px rgba(0,0,0,.25);position:relative;z-index:50}#msk-box .msk-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}#msk-box .msk-title{margin:0;font-size:.92rem;font-weight:700;color:#fca5a5}#msk-box .msk-badge{font-size:.68rem;font-weight:700;padding:3px 8px;border-radius:999px;border:1px solid rgba(239,68,68,.4);color:#fca5a5;background:rgba(239,68,68,.12)}#msk-box .msk-badge.on{background:rgba(239,68,68,.45);color:#fff}#msk-box .msk-help{margin:0 0 10px;font-size:.78rem;color:#e7e5e4;line-height:1.4}#msk-box .msk-actions{display:flex!important;flex-wrap:wrap;gap:8px}#msk-msg{margin-top:8px;font-size:.75rem;color:#fecaca;min-height:1.1em}body.msk-red .tab.active{border-bottom-color:#ef4444!important;color:#fca5a5!important}";
    document.head.appendChild(st);
  }
  if(!document.getElementById("msk-box")){
    var box=document.createElement("div");
    box.id="msk-box";
    box.innerHTML='<div class="msk-head"><p class="msk-title">Forma Suprema</p><span class="msk-badge" id="msk-badge">INATIVA</span></div><p class="msk-help">Clique em <b>Colocar Máscara</b>: +20 Vida, +10 Esforço, +10 Defesa, −6 Sanidade.<br>Depois: <b>Manter</b> (−2 SAN) ou <b>Tirar</b>.</p><div class="msk-actions"><button type="button" id="msk-on">Colocar Máscara</button><button type="button" id="msk-stay">Manter máscara (−2 Sanidade)</button><button type="button" id="msk-off">Tirar máscara</button></div><div id="msk-msg"></div>';
    var res=document.querySelector("section.card.resources")||document.querySelector(".resources");
    if(res&&res.parentNode)res.parentNode.insertBefore(box,res);
    else{
      var at=document.querySelector("section.card.attributes")||document.querySelector(".attributes");
      if(at&&at.parentNode)at.parentNode.insertBefore(box,at.nextSibling);
      else (document.querySelector("#app")||document.body).appendChild(box);
    }
  }
  var a=document.getElementById("msk-on"),b=document.getElementById("msk-stay"),c=document.getElementById("msk-off");
  if(a&&a.dataset.ok!=="1"){
    a.dataset.ok="1";
    a.onclick=function(e){e.preventDefault();colocar()};
    if(b){b.dataset.ok="1";b.onclick=function(e){e.preventDefault();manter()}}
    if(c){c.dataset.ok="1";c.onclick=function(e){e.preventDefault();tirar()}}
  }
  if(state.mascaraAtiva)uiOn();else uiOff();
}
setInterval(function(){if(typeof state==="undefined")return;inject();},300);
})();
