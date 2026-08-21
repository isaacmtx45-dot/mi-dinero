var ie=Number.MAX_SAFE_INTEGER;function b(e){let a=typeof e=="number"?e:Number(e);return Number.isFinite(a)?Math.abs(a)>ie?a<0?-ie:ie:Math.round(a):0}function U(e,a){return b(e*a)}var Re=100;function Da(e,a){return a<=0?"sin_pagar":a>=e+Re?"pagaron_de_mas":a>=e-Re?"completa":"parcial"}function J(e,a){let o=new Map;for(let t of a){let n=o.get(t.cuentaDeCobroId)??[];n.push(t),o.set(t.cuentaDeCobroId,n)}return e.map(t=>{let n=(o.get(t.id)??[]).slice().sort((r,l)=>r.fecha.localeCompare(l.fecha)),s=n.reduce((r,l)=>r+b(l.monto),0),i=Da(b(t.montoEsperado),s);return{cuenta:t,ingresos:n,recibido:s,pendiente:i==="completa"?0:Math.max(0,b(t.montoEsperado)-s),estado:i,ultimoPago:n.length?n[n.length-1].fecha:null}})}function Ie(e){return e.filter(a=>a.pendiente>0)}function ce(e){return e.reduce((a,o)=>a+o.pendiente,0)}var Y=new Intl.NumberFormat("es-CO");function Ce(e){let a=`$${Y.format(e.cuenta.montoEsperado)}`,o=`$${Y.format(e.recibido)}`;switch(e.estado){case"sin_pagar":return`${e.cuenta.periodo}: sin pagar \xB7 te deben ${a}`;case"parcial":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 faltan $${Y.format(e.pendiente)}`;case"completa":return`${e.cuenta.periodo}: pagada completa (${o})`;case"pagaron_de_mas":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 $${Y.format(e.recibido-e.cuenta.montoEsperado)} de mas`}}function Ea(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function W(e,a,o){return Ea(a,(e-1)*o)}function R(e,a){let o=Math.max(1,a.diasOptimista);return{optimista:W(e,a.desde,o),pesimista:W(e,a.desde,Math.max(o,a.diasPesimista))}}function le(e){return e.diasPesimista<=e.diasOptimista}var Pa=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function S(e){return`${Pa[e.getMonth()]} de ${e.getFullYear()}`}function X(e){let a=S(e.optimista),o=S(e.pesimista);return a===o?a:`entre ${a} y ${o}`}function K(e){return new Map(e.map(a=>[a.id,Math.max(0,b(a.valor)-b(a.abonado??0))]))}function xa(e){return e.baseCobro??(e.tipo==="porcentaje"?"cada_ingreso":"una_vez_por_cuenta")}function ya(e,a,o){if(!o&&xa(e)==="una_vez_por_cuenta")return!1;if(e.modo==="primer_pago")return a===1&&o;if(a<(e.desdePago??1))return!1;if(e.modo==="cada_pago")return!0;let t=e.supuesto??"siempre";return t==="nunca"?!1:t==="cada_dos_pagos"?a%2===1:!0}function Se(e,a,o){let t=e,n=0;for(let s of a??[]){let i=Math.max(1,Math.round(s.desdePago));o>=i&&i>=n&&(t=s.valor,n=i)}return t}function Ra(e,a,o){let t=Se(e.valor,e.cambios,o);return e.tipo==="porcentaje"?U(a,t):b(t)}function Ia(e,a){return e.maximoPorPago&&e.maximoPorPago>0?b(e.maximoPorPago):e.enCuotas&&e.enCuotas>0?Math.max(1,Math.ceil(b(e.valor)/Math.round(e.enCuotas))):a}function j(e,a,o,t,n,s,i,r=!0){let l=b(a),d=[];for(let C of o){if(!ya(C,e,r))continue;let P=Math.min(Ra(C,a,e),l);P<=0||(d.push({nombre:C.nombre,monto:P}),l-=P)}let m=Se(t.base,t.cambios,e),g=Math.min(b(m),l);l-=g;let v=[],D=0;for(let C of n){let P=s.get(C.id)??0;if(P<=0||e<(C.desdePago??1))continue;let ye=Ia(C,P),L=Math.min(P,l,ye);if(t.elastico&&L<P&&ye>=P){let Ma=Math.max(0,g-b(t.minimo)),re=P-L;re<=Ma&&(g-=re,D+=re,L=P)}if(!(L<=0)&&(v.push({metaId:C.id,monto:L}),s.set(C.id,P-L),l-=Math.min(L,l),l<=0))break}let k=l;return{numero:e,ingreso:a,obligaciones:d,aColchon:g,recorteColchon:D,abonos:v,sobrante:k,saldoAhorro:i+g+k}}function Ae(e,a,o,t,n,s,i=!0){let r=e.cuentaDeCobroId===void 0||e.cuentaDeCobroId==="",l=j(a,b(e.monto),r?[]:o,r?{...t,base:0,minimo:0}:t,n,s,0,i),d=new Map(n.map(m=>[m.id,m]));return{id:`rep-${e.id}`,ingresoId:e.id,obligaciones:l.obligaciones.map(m=>({nombre:m.nombre,monto:m.monto})),abonos:l.abonos.map(m=>({nombre:d.get(m.metaId)?.nombre??"(meta borrada)",monto:m.monto,refId:m.metaId})),alAhorro:l.aColchon+l.sobrante,propuesto:!0}}function Ca(e){let a=o=>o.reduce((t,n)=>t+b(n.monto),0);return a(e.obligaciones)+a(e.abonos)+a(e.gastos??[])+b(e.alAhorro)}function G(e,a){return b(a.monto)-Ca(e)}var de=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Le(e){return e.slice(0,7)}function _(e,a){let o=b(a.monto);if(o===0)return;let t=e.get(a.nombre);t?t.monto+=o:e.set(a.nombre,{...a,monto:o})}function ue(e,a){let o=new Map(a.map(n=>[n.ingresoId,n])),t=new Map;for(let n of e){let s=Le(n.fecha),i=t.get(s);i||(i={mes:s,entro:0,deTrabajo:0,deFuera:0,aObligaciones:0,aMetas:0,enGastos:0,alAhorro:0,detalle:[],sinAsignar:0,_detalle:new Map},t.set(s,i));let r=b(n.monto);i.entro+=r,n.cuentaDeCobroId===void 0||n.cuentaDeCobroId===""?i.deFuera+=r:i.deTrabajo+=r;let d=o.get(n.id);if(!d){i.sinAsignar+=r;continue}for(let m of d.obligaciones)i.aObligaciones+=b(m.monto),_(i._detalle,m);for(let m of d.abonos)i.aMetas+=b(m.monto),_(i._detalle,m);for(let m of d.gastos??[])i.enGastos+=b(m.monto),_(i._detalle,m);i.alAhorro+=b(d.alAhorro),i.sinAsignar+=G(d,n)}return[...t.values()].map(({_detalle:n,...s})=>({...s,detalle:[...n.values()].sort((i,r)=>r.monto-i.monto)})).sort((n,s)=>n.mes.localeCompare(s.mes))}function qe(e){let a=new Map;for(let o of e)for(let t of[...o.obligaciones,...o.abonos,...o.gastos??[]])_(a,t);return[...a.values()].sort((o,t)=>t.monto-o.monto)}function Z(e){let[a,o]=e.split("-"),t=Number(o)-1;return de[t]?`${de[t]} de ${a}`:e}function Te(e,a,o,t=[]){let n=new Map,s=new Map,i=new Map(t.map(l=>[l.id,l.nombre])),r=l=>i.get(l)??l;for(let l of e){let d=W(l.numero,a,Math.max(1,o)),m=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,g=n.get(m);g||(g={mes:m,entro:0,aObligaciones:0,aMetas:0,alAhorro:0,detalle:[],pagos:[]},n.set(m,g),s.set(m,new Map));let v=s.get(m);g.pagos.push(l.numero),g.entro+=b(l.ingreso);for(let D of l.obligaciones)g.aObligaciones+=b(D.monto),_(v,{nombre:D.nombre,monto:D.monto});for(let D of l.abonos)g.aMetas+=b(D.monto),_(v,{nombre:r(D.metaId),monto:D.monto,refId:D.metaId});g.alAhorro+=b(l.aColchon)+b(l.sobrante)}return[...n.values()].map(l=>({...l,detalle:[...s.get(l.mes).values()].sort((d,m)=>m.monto-d.monto)})).sort((l,d)=>l.mes.localeCompare(d.mes))}function Oe(e,a){let o=new Set(a.map(t=>t.cuentaDeCobroId).filter(t=>!!t));return e.cuentaDeCobroId?o.has(e.cuentaDeCobroId)?o.size:o.size+1:Math.max(1,o.size)}function q(e){return(e??[]).filter(a=>b(a.monto)!==0)}function je(e,a){let o=new Set([...q(a.obligaciones),...q(a.abonos)].map(t=>t.nombre));return[...q(e.obligaciones),...q(e.abonos)].map(t=>t.nombre).filter(t=>!o.has(t))}function _e(e,a,o,t=new Map){return[...new Set([...e.map(s=>s.mes),...a.map(s=>s.mes)])].sort().map(s=>{let i=e.find(m=>m.mes===s)??null,r=a.find(m=>m.mes===s)??null,l=s<o?"pasado":s===o?"actual":"futuro",d=t.get(s)??(i?{monto:i.entro,segun:"escenario"}:null);return{mes:s,estado:l,real:r,simulado:i,esperado:d,diferencia:l==="pasado"&&d&&r?r.entro-d.monto:null}})}function we(e){let a=0,o=0,t=0,n=0,s=0,i=0;for(let r of e)r.real&&(n+=1,a+=r.real.entro,o+=r.real.aObligaciones+r.real.aMetas+r.real.enGastos,t+=r.real.alAhorro),r.estado==="futuro"&&r.simulado&&(i+=1,s+=r.esperado?.monto??r.simulado.entro);return{mesesConDatos:n,entroDeVerdad:a,gastadoDeVerdad:o,guardadoDeVerdad:t,faltaPorEntrar:s,mesesQueFaltan:i}}var Sa=new Map(de.map((e,a)=>[e,String(a+1).padStart(2,"0")]));function Aa(e,a){let o=e.toLowerCase().trim(),t=o.match(/^(\d{4})-(\d{2})/);if(t)return`${t[1]}-${t[2]}`;let n=o.match(/([a-záéíóú]+)\D+(\d{4})/);if(n){let i=Sa.get(n[1]);if(i)return`${n[2]}-${i}`}let s=a.slice().sort((i,r)=>i.fecha.localeCompare(r.fecha))[0];return s?Le(s.fecha):null}function Ne(e,a,o,t){let n=new Map;for(let s of e){let i=a.filter(l=>l.cuentaDeCobroId!==void 0),r=Aa(s.periodo,i);r&&n.set(r,b(s.montoEsperado))}return new Map(t.map(s=>{let i=n.get(s);return[s,i!==void 0?{monto:i,segun:"cuenta_de_cobro"}:{monto:b(o),segun:"escenario"}]}))}function Fe(e,a){let o=s=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=new Map(a.map(s=>[o(s.nombre),s])),n=[];for(let s of q(e.gastos)){let i=t.get(o(s.nombre));i&&n.push({gasto:s,metaId:i.id,metaNombre:i.nombre})}return n}function ee(e,a){let o=new Map;for(let t of a)for(let n of t.abonos)n.refId&&o.set(n.refId,(o.get(n.refId)??0)+b(n.monto));return new Map(e.map(t=>{let n=b(t.valor),s=b(t.abonado??0),i=o.get(t.id)??0,r=Math.min(s+i,n);return[t.id,{previo:s,real:i,total:r,falta:Math.max(0,n-r)}]}))}function He(e,a){let o=ee(e,a);return e.map(t=>({...t,abonado:o.get(t.id).total}))}function ze(e,a){let o=0;for(let t of ee(e,a).values())o+=t.total;return o}var La=600;function V(e){let a=K(e.metas),o=e.maxPagos??La,t=[],n=new Map,s=new Map,i=new Map,r=new Map,l=0,d=0;for(;d<o&&[...a.values()].some(g=>g>0);){d+=1;let g=j(d,b(e.ingresoEsperado),e.obligaciones,e.colchon,e.metas,a,l);l=g.saldoAhorro,t.push(g);for(let v of g.abonos)n.has(v.metaId)||n.set(v.metaId,d),i.set(v.metaId,(i.get(v.metaId)??0)+1),r.set(v.metaId,(r.get(v.metaId)??0)+v.monto),(a.get(v.metaId)??0)<=0&&s.set(v.metaId,d)}let m=e.metas.map(g=>{let v=Math.min(b(g.abonado??0),b(g.valor)),D=r.get(g.id)??0;return{metaId:g.id,nombre:g.nombre,grupo:g.grupo,valor:g.valor,pagoInicio:n.get(g.id)??null,pagoFin:s.get(g.id)??null,cantidadPagos:i.get(g.id)??0,totalAbonado:v+D,completada:(a.get(g.id)??0)<=0,yaEstabaPagada:v>=b(g.valor)}});return{escenario:e.nombre,pagos:t,metas:m,totalPagos:d,ahorroFinal:l,incompleta:d>=o&&m.some(g=>!g.completada)}}function Ge(e){let a=new Map;for(let o of e.metas){if(!o.grupo)continue;let t=a.get(o.grupo)??[];t.push(o),a.set(o.grupo,t)}return[...a.entries()].map(([o,t])=>{let n=t.map(r=>r.pagoInicio).filter(r=>r!==null),s=t.map(r=>r.pagoFin).filter(r=>r!==null),i=t.every(r=>r.completada);return{grupo:o,valor:t.reduce((r,l)=>r+l.valor,0),pagoInicio:n.length?Math.min(...n):null,pagoFin:i&&s.length?Math.max(...s):null,totalAbonado:t.reduce((r,l)=>r+l.totalAbonado,0),completado:i,yaEstabaPagado:t.every(r=>r.yaEstabaPagada)}})}function Ve(e,a){return a.filter(t=>t.antesDelPago&&t.antesDelPago>0).map(t=>{let n=e.metas.find(r=>r.metaId===t.id),s=n?.pagoFin??null,i=n?.yaEstabaPagada?0:s;return{metaId:t.id,nombre:t.nombre,queria:Math.round(t.antesDelPago),termina:i,seRetrasa:i===null?null:Math.max(0,i-Math.round(t.antesDelPago))}})}function Qe(e,a){let o=b(a);if(o<=0)return null;let t=V(e),n=V({...e,ingresoEsperado:b(e.ingresoEsperado)+o,maxPagos:1}),s=new Map(n.metas.map(l=>[l.metaId,l.totalAbonado])),r=1+V({...e,metas:e.metas.map(l=>({...l,abonado:Math.max(b(l.abonado??0),s.get(l.id)??0)}))}).totalPagos;return{pendiente:o,pagosAhora:t.totalPagos,pagosSiPagan:r,seAdelanta:Math.max(0,t.totalPagos-r)}}function pe(e,a,o){return new Date(e,a-1,o)}function ae(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function qa(e){let a=e.getDay();return a===1?e:ae(e,(8-a)%7)}function Ta(e){let a=e%19,o=Math.floor(e/100),t=e%100,n=Math.floor(o/4),s=o%4,i=Math.floor((o+8)/25),r=Math.floor((o-i+1)/3),l=(19*a+o-n-r+15)%30,d=Math.floor(t/4),m=t%4,g=(32+2*s+2*d-l-m)%7,v=Math.floor((a+11*l+22*g)/451),D=Math.floor((l+g-7*v+114)/31),k=(l+g-7*v+114)%31+1;return pe(e,D,k)}function Oa(e){let a=Ta(e),o=s=>ae(a,s),t=[[1,1,"A\xF1o Nuevo"],[5,1,"D\xEDa del Trabajo"],[7,20,"Independencia de Colombia"],[8,7,"Batalla de Boyac\xE1"],[12,8,"Inmaculada Concepci\xF3n"],[12,25,"Navidad"]],n=[[1,6,"Reyes Magos"],[3,19,"San Jos\xE9"],[6,29,"San Pedro y San Pablo"],[8,15,"Asunci\xF3n de la Virgen"],[10,12,"D\xEDa de la Raza"],[11,1,"Todos los Santos"],[11,11,"Independencia de Cartagena"]];return[...t.map(([s,i,r])=>({fecha:pe(e,s,i),nombre:r})),...n.map(([s,i,r])=>({fecha:qa(pe(e,s,i)),nombre:r})),{fecha:o(-3),nombre:"Jueves Santo"},{fecha:o(-2),nombre:"Viernes Santo"},{fecha:o(43),nombre:"Ascensi\xF3n del Se\xF1or"},{fecha:o(64),nombre:"Corpus Christi"},{fecha:o(71),nombre:"Sagrado Coraz\xF3n de Jes\xFAs"}].sort((s,i)=>s.fecha.getTime()-i.fecha.getTime())}var Q=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;function me(e){return Oa(e.getFullYear()).find(a=>Q(a.fecha)===Q(e))?.nombre??null}function ja(e){return me(e)!==null}function ge(e){return e.getDay()===0}function Be(e){let a=new Date(e.getTime());for(let o=0;o<15&&(ge(a)||ja(a));o++)a=ae(a,-1);return a}var ke=30,Ue="Febrero no tiene 30: se radica el \xFAltimo d\xEDa del mes (28, o 29 si es bisiesto), y si ese d\xEDa cae domingo o festivo se retrocede igual que siempre.";function _a(e,a){let o=new Date(e,a,0).getDate(),t=o<ke,n=new Date(e,a-1,Math.min(ke,o)),s=Be(n),i=null;if(Q(s)!==Q(n)){let r=me(n);i=r?`el ${n.getDate()} es festivo (${r})`:ge(n)?`el ${n.getDate()} cae domingo`:`el ${n.getDate()} no es d\xEDa h\xE1bil`}return{fecha:s,fechaOriginal:n,motivoDelCambio:i,usoUltimoDiaDelMes:t}}var be=[{id:"cuenta",nombre:"Cuenta de cobro diligenciada",frecuencia:"cada_mes",detalle:"Con una descripci\xF3n del servicio prestado."},{id:"informe",nombre:"Informe de actividades",frecuencia:"cada_mes",detalle:"Detallando espec\xEDficamente las funciones o actividades realizadas."},{id:"conformidad",nombre:"Certificado de conformidad del servicio",frecuencia:"cada_mes",detalle:"Lo entrega el coordinador o l\xEDder del \xE1rea: hay que ped\xEDrselo con tiempo."},{id:"seguridad_social",nombre:"Planilla de seguridad social",frecuencia:"cada_mes",obligatorioExplicito:!0,detalle:"Liquidada del mes VENCIDO al que se est\xE1 cobrando. La circular la marca como obligatoria."},{id:"constancia",nombre:"Constancia de prestaci\xF3n de servicio firmada por el paciente",frecuencia:"solo_asistencial",detalle:"Solo personal asistencial. Como t\xE9cnico de sistemas, no aplica."},{id:"rut",nombre:"RUT actualizado",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez."},{id:"bancaria",nombre:"Certificaci\xF3n bancaria",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez, o si cambia de cuenta."}];function fe(){return be.filter(e=>e.frecuencia==="cada_mes")}var wa=5;function Na(e,a){let o=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),t=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return Math.round((t-o)/864e5)}var Ye=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Je(e,a=[]){let o=_a(e.getFullYear(),e.getMonth()+1),t=Na(e,o.fecha),n=t<0?"vencido":t===0?"hoy":t<=wa?"pronto":"tranquilo",s=o.fecha.getDate(),i=Ye[o.fecha.getMonth()],r=n==="vencido"?`Se pas\xF3 la fecha: hab\xEDa que radicar el ${s} de ${i}`:n==="hoy"?"HOY es el \xFAltimo d\xEDa para radicar la cuenta de cobro":n==="pronto"?`Faltan ${t} d\xEDas: radicas el ${s} de ${i}`:`La cuenta de cobro se radica el ${s} de ${i}`,l=fe().filter(d=>!a.includes(d.id)).map(d=>d.id);return{limite:o,diasQueFaltan:t,urgencia:n,titular:r,soportesPendientes:l}}function We(e){let a=e.fecha.getDate(),o=Ye[e.fecha.getMonth()];return e.motivoDelCambio?`Se radica el ${a} de ${o}, no el ${e.fechaOriginal.getDate()}, porque ${e.motivoDelCambio}.`:`Se radica el ${a} de ${o}.`}function he(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function Fa(){return new Date().toISOString().slice(0,10)}function Ha(){return[]}function T(){return{version:1,escenario:{nombre:"Mi escenario",ingresoEsperado:2e6,colchonBase:1e5,colchonMinimo:0,colchonElastico:!1,fechaPrimerPago:Fa(),diasOptimista:30,diasPesimista:60},obligaciones:Ha(),metas:[],cuentas:[],ingresos:[],repartos:[],soportesMarcados:{}}}function O(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}var Xe="gestiondinerotrabajo.estado";function Ke(e){let a=T();if(typeof e!="object"||e===null)return a;let o=e;return{version:1,escenario:{...a.escenario,...o.escenario??{}},obligaciones:o.obligaciones??a.obligaciones,metas:o.metas??a.metas,cuentas:o.cuentas??a.cuentas,ingresos:o.ingresos??a.ingresos,repartos:o.repartos??a.repartos,soportesMarcados:o.soportesMarcados??a.soportesMarcados}}function Ze(){let e=null;try{e=localStorage.getItem(Xe)}catch{return{estado:T(),aviso:{texto:"No pude leer los datos guardados. Est\xE1s viendo un inicio en blanco.",grave:!0}}}if(!e)return{estado:T(),aviso:null};try{return{estado:Ke(JSON.parse(e)),aviso:null}}catch{return{estado:T(),aviso:{texto:"Los datos guardados est\xE1n da\xF1ados. No los borr\xE9: sigue ah\xED el archivo por si se puede recuperar.",grave:!0}}}}function ve(e){try{return localStorage.setItem(Xe,JSON.stringify(e)),null}catch(a){return a instanceof Error?a.message:"no se pudo guardar"}}function ea(e){return JSON.stringify(e,null,2)}function $e(e){try{return{estado:Ke(JSON.parse(e)),aviso:null}}catch{return{estado:null,aviso:{texto:"Ese archivo no es un respaldo v\xE1lido. No cambi\xE9 nada de lo que ten\xEDas.",grave:!0}}}}var Me=null;function w(e){return Me?.(),new Promise(a=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${oe(e.titulo)}</h3>
        ${e.detalle?`<p class="dlg-detalle">${oe(e.detalle)}</p>`:""}
        <input class="dlg-campo" type="text" ${e.dinero?'inputmode="numeric" data-dinero':""}
               value="${oe(e.valorInicial??"")}" />
        <div class="dlg-botones">
          <button class="dlg-cancelar">Cancelar</button>
          <button class="primario dlg-aceptar">${oe(e.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=o.querySelector(".dlg-campo"),n=r=>{document.removeEventListener("keydown",i,!0),o.remove(),Me=null,a(r)},s=()=>n(t.value);function i(r){r.key==="Escape"&&(r.preventDefault(),n(null)),r.key==="Enter"&&document.activeElement===t&&(r.preventDefault(),s())}o.querySelector(".dlg-aceptar").addEventListener("click",s),o.querySelector(".dlg-cancelar").addEventListener("click",()=>n(null)),o.addEventListener("mousedown",r=>{r.target===o&&n(null)}),document.addEventListener("keydown",i,!0),document.body.appendChild(o),Me=()=>n(null),t.focus(),t.select()})}function oe(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var aa=new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});function De(e){return e.replace(/\D/g,"")}function Ga(e){let a=De(e);if(a==="")return"";let o=a.replace(/^0+(?=\d)/,"");return aa.format(Number(o))}function E(e){let a=De(e);return a===""?0:Number(a)}function M(e){return aa.format(Math.round(e))}function oa(e){let a=e.value,o=e.selectionStart??a.length,t=De(a.slice(0,o)).length,n=Ga(a);if(n===a)return;e.value=n;let s=0,i=0;for(;i<n.length&&s<t;)/\d/.test(n[i])&&s++,i++;e.setSelectionRange(i,i)}function ta(e,a){let o=[],t=0;for(let n of a){let s=Math.max(1,Math.round(n)||1),i=e[t];o.push(s>1||!i?null:i),t+=s}return o}var Va=4;function na(e){return e.length>=Va}var Qa=new Intl.NumberFormat("es-CO"),u=e=>`$${Qa.format(Math.round(e))}`,c,$=null;function F(e=new Date){let a=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${a}-${o}`}function p(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var f=new Map;function ia(e){if(!(e instanceof HTMLInputElement)&&!(e instanceof HTMLSelectElement))return null;let a=[e.id&&`#${e.id}`,e.dataset.accion&&`[data-accion="${e.dataset.accion}"]`,e.dataset.id&&`[data-id="${e.dataset.id}"]`,e.dataset.campo&&`[data-campo="${e.dataset.campo}"]`,e.dataset.tipo&&`[data-tipo="${e.dataset.tipo}"]`,e.dataset.i!==void 0&&`[data-i="${e.dataset.i}"]`].filter(Boolean);return a.length>0?a.join(""):null}var te=null,Ee=null,B=!1,N=!1,A=null;document.addEventListener("mousedown",e=>{let o=e.target?.closest?.(".asa")?.closest("tr");o&&(o.draggable=!0)},!0);document.addEventListener("dragstart",e=>{let a=e.target?.closest?.("tr[data-fila]");a&&(A=Number(a.dataset.fila),a.classList.add("arrastrando"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move"))});document.addEventListener("dragover",e=>{if(A===null)return;let a=e.target?.closest?.("tr[data-fila]");if(a){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");for(let o of document.querySelectorAll(".destino"))o.classList.remove("destino");Number(a.dataset.fila)!==A&&a.classList.add("destino")}});document.addEventListener("drop",e=>{let a=e.target?.closest?.("tr[data-fila]");if(A===null||!a)return;e.preventDefault();let o=Number(a.dataset.fila),t=A;if(A=null,t===o)return y();let[n]=c.metas.splice(t,1);c.metas.splice(o,0,n),$={texto:`\xAB${n.nombre}\xBB qued\xF3 en la posici\xF3n ${o+1}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron.`,malo:!1},h()});document.addEventListener("dragend",()=>{A!==null&&(A=null,y())});document.addEventListener("mousedown",e=>{let a=e.target;B=a?.closest("button[data-accion]")!==null&&a?.closest("button[data-accion]")!==void 0,te=ia(a?.closest("input, select")??null),Ee=a?.closest?.("[data-panel]")?.dataset.panel??null},!0);document.addEventListener("mouseup",()=>{setTimeout(()=>{B=!1,Ee=null,N&&(N=!1,xe())},0)},!0);function Ba(e,a){let o=te!==null,t=te??e;if(te=null,!t)return;let n=document.querySelector(t);if(n&&(n.focus(),!o&&a!==null&&typeof n.setSelectionRange=="function"))try{n.setSelectionRange(a,a)}catch{}}function I(){ca()||xe()}function h(){ca()||y()}function ca(){let e=ve(c);return e&&($={texto:`No pude guardar: ${e}`,malo:!0}),B?(N=!0,!0):!1}function x(){let e=c.escenario;return{desde:new Date(`${e.fechaPrimerPago}T12:00:00`),diasOptimista:e.diasOptimista,diasPesimista:e.diasPesimista}}function la(){let e=c.escenario;return{nombre:e.nombre,ingresoEsperado:e.ingresoEsperado,obligaciones:c.obligaciones,colchon:{nombre:"Otros / Ahorro",base:e.colchonBase,minimo:e.colchonMinimo,elastico:e.colchonElastico,cambios:e.cambiosColchon},metas:He(c.metas,c.repartos)}}function ka(){return`${(c.escenario.cambiosColchon??[]).map((a,o)=>{let t=S(R(Math.max(1,a.desdePago),x()).optimista);return`<div class="cambio">
      <span class="rango">desde el</span>
      <input type="number" min="1" step="1" value="${a.desdePago}" class="corto"
        data-accion="cambio-ahorro" data-i="${o}" data-campo="desdePago" />
      <input type="text" inputmode="numeric" data-dinero value="${M(a.valor)}"
        class="corto-dinero" data-accion="cambio-ahorro" data-i="${o}" data-campo="valor" />
      <span class="rango">${p(t)}</span>
      <button class="icono" data-accion="borrar-cambio-ahorro" data-i="${o}" title="Quitar">\u2715</button>
    </div>`}).join("")}<button class="chico" data-accion="nuevo-cambio-ahorro">+ cambio</button>`}function Ua(){let e=c.escenario;return`
  <section class="panel">
    <h2>Escenario <span class="sufijo">\u2014 el supuesto sobre lo que va a entrar</span></h2>
    <div class="campos">
      <div class="campo">
        <label for="ingreso">Lo que espero por pago</label>
        <input id="ingreso" type="text" inputmode="numeric" data-dinero
               value="${M(e.ingresoEsperado)}"
               data-accion="escenario" data-campo="ingresoEsperado" />
      </div>
      <div class="campo">
        <label for="colchon">Otros / Ahorro por pago</label>
        <input id="colchon" type="text" inputmode="numeric" data-dinero
               value="${M(e.colchonBase)}"
               data-accion="escenario" data-campo="colchonBase" />
      </div>
      <div class="campo">
        <label for="minimo">Del ahorro no bajar de</label>
        <input id="minimo" type="text" inputmode="numeric" data-dinero
               value="${M(e.colchonMinimo)}"
               title="Solo aplica con el interruptor de abajo encendido"
               data-accion="escenario" data-campo="colchonMinimo" />
      </div>
      <div class="campo">
        <label>El ahorro cambia</label>
        ${ka()}
      </div>
      <div class="campo">
        <label for="fecha">Fecha del primer pago</label>
        <input id="fecha" type="date" class="ancho" value="${e.fechaPrimerPago}"
               data-accion="escenario" data-campo="fechaPrimerPago" />
      </div>
      <div class="campo">
        <label for="opt">D\xEDas entre pagos, si son puntuales</label>
        <input id="opt" type="number" min="1" value="${e.diasOptimista}"
               data-accion="escenario" data-campo="diasOptimista" />
      </div>
      <div class="campo">
        <label for="pes">D\xEDas entre pagos, si se atrasan</label>
        <input id="pes" type="number" min="1" value="${e.diasPesimista}"
               data-accion="escenario" data-campo="diasPesimista" />
      </div>
    </div>
    <p class="nota">
      <label class="interruptor">
        <input type="checkbox" data-accion="elastico" ${e.colchonElastico?"checked":""} />
        Usar el ahorro para adelantar metas
      </label>
      \u2014 apagado, el ahorro no se toca y las fechas son las conservadoras.
      ${e.colchonElastico?`<br /><span class="rango">Encendido: si recortando el ahorro se CIERRA una meta, se
           recorta \u2014 pero nunca por debajo de ${u(e.colchonMinimo)}. Solo para cerrar, nunca
           para abonar a medias.</span>`:""}
    </p>
    ${e.diasPesimista>e.diasOptimista?`<p class="nota rango">
      Los dos campos de d\xEDas son <strong>de pago a pago</strong>, no un retraso de una vez.
      Con ${e.diasPesimista} d\xEDas, el pago ${le(x())?10:12} caer\xEDa
      ${(()=>{let a=x();return`<strong>${Math.round(11*(e.diasPesimista-e.diasOptimista)/30)} meses</strong> m\xE1s tarde que si fueran puntuales`})()}.
    </p>`:""}
  </section>`}var Ya={cada_pago:"Cada pago",primer_pago:"Solo el primer pago",puntual:"Puntual: cuando yo la marque"},da={siempre:"asumo que la pago siempre",cada_dos_pagos:"asumo un pago s\xED y otro no",nunca:"asumo que no la pago"};function ua(e,a,o){let t=e??1,n=S(R(t,x()).optimista);return`<input type="number" min="1" step="1" value="${t}" class="corto"
             data-accion="${a}" data-id="${o}" data-campo="desdePago" />
          <span class="rango mes-de-pago">${t<=1?"desde el primero":p(n)}</span>`}function pa(){let e=c.cuentas.filter(a=>a.montoEsperado>0);if(e.length>0){let a=e.reduce((o,t)=>t.periodo.localeCompare(o.periodo)>0?t:o);return{monto:a.montoEsperado,de:a.periodo,esReal:!0}}return{monto:c.escenario.ingresoEsperado,de:"lo que esperas por pago",esReal:!1}}function Ja(e){let a=pa();if(a.monto<=0)return'<span class="rango">\u2014</span>';let o=e.tipo==="porcentaje"?U(a.monto,e.valor):e.valor;return`<span class="calculado">${u(o)}</span>`}function Wa(e){let a=e.cambios??[];if(a.length===0)return"";let o=e.tipo==="porcentaje",t=(n,s)=>{let i=S(R(Math.max(1,n.desdePago),x()).optimista);return`<span class="cambio">
      <span class="rango">desde el pago</span>
      <input type="number" min="1" step="1" value="${n.desdePago}" class="corto"
        data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="desdePago" />
      <span class="rango">(${p(i)}) pasa a</span>
      ${o?`<input type="number" min="0" max="100" step="0.5" value="${n.valor*100}" class="corto"
             data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" /><span class="rango">%</span>`:`<input type="text" inputmode="numeric" data-dinero value="${M(n.valor)}"
             class="corto-dinero" data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" />`}
      <button class="icono" data-accion="borrar-cambio" data-id="${e.id}" data-i="${s}"
        title="Quitar este cambio">\u2715</button>
    </span>`};return`<tr class="fila-cambios">
    <td colspan="9"><span class="rango">${p(e.nombre)} \xB7</span>
      ${a.map(t).join("")}</td>
  </tr>`}function Xa(e){let a=e.modo==="puntual";return`
  <tr>
    <td><input class="ancho" value="${p(e.nombre)}" data-accion="oblig" data-id="${e.id}" data-campo="nombre" /></td>
    <td><input value="${p(e.grupo??"")}" placeholder="ninguno"
        data-accion="oblig" data-id="${e.id}" data-campo="grupo" /></td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="tipo">
        <option value="porcentaje" ${e.tipo==="porcentaje"?"selected":""}>% del ingreso</option>
        <option value="fijo" ${e.tipo==="fijo"?"selected":""}>Monto fijo</option>
      </select>
    </td>
    <td class="num">
      ${e.tipo==="porcentaje"?`<input type="number" step="0.5" min="0" max="100" value="${e.valor*100}"
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`:`<input type="text" inputmode="numeric" data-dinero value="${M(e.valor)}"
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`}
      <button class="chico" data-accion="nuevo-cambio" data-id="${e.id}"
        title="A partir de cierto pago, esto pasa a valer otra cosa">+ cambio</button>
    </td>
    <td class="num">${Ja(e)}</td>
    <td class="desde">${ua(e.desdePago,"oblig",e.id)}</td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="modo">
        ${Object.entries(Ya).map(([o,t])=>`<option value="${o}" ${e.modo===o?"selected":""}>${t}</option>`).join("")}
      </select>
    </td>
    <td>
      ${a?`<select data-accion="oblig" data-id="${e.id}" data-campo="supuesto">
        ${Object.entries(da).map(([o,t])=>`<option value="${o}" ${(e.supuesto??"siempre")===o?"selected":""}>${t}</option>`).join("")}
      </select>`:'<span class="rango">\u2014</span>'}
    </td>
    <td class="num"><button class="icono" data-accion="borrar-oblig" data-id="${e.id}" title="Quitar">\u2715</button></td>
  </tr>`}function Ka(){let e=pa();if(e.monto<=0)return"";let a=i=>j(i,e.monto,c.obligaciones,{nombre:"",base:0,minimo:0,elastico:!1},[],new Map,0).obligaciones.reduce((l,d)=>l+d.monto,0),o=a(1),t=a(2),n=(i,r)=>`
    <div><span class="rotulo">${i}</span>
      <span class="valor">${u(e.monto-r)}</span>
      <span class="rotulo">libre para metas \xB7 se van ${u(r)}</span></div>`,s=e.esReal?`Calculado sobre <strong>${p(e.de)}</strong>: ${u(e.monto)}, que es lo que
       esperas cobrar de verdad. Si no hubiera cuenta de cobro registrada, saldr\xEDa del
       escenario de arriba.`:`Calculado sobre el escenario de arriba (${u(e.monto)}), que es una <em>suposici\xF3n</em>.
       En cuanto registres una cuenta de cobro, esta cifra sale de ah\xED.`;return`<div class="resumen resumen-oblig">
    ${n("En el primer pago",o)}
    ${o!==t?n("En los siguientes",t):""}
  </div>
  <p class="nota ${e.esReal?"":"aviso"}">${s}</p>`}function Za(){let e=c.obligaciones.filter(a=>a.modo==="puntual");return c.obligaciones.length===0?`
    <section class="panel">
      <h2>Obligaciones <span class="sufijo">\u2014 salen antes que las metas</span></h2>
      <div class="vacio">
        <strong>Lo que se descuenta de cada pago antes de que quede nada para tus metas.</strong>
        Por ejemplo: un diezmo, lo que le das a alguien de la familia, el internet, un recibo.
        <br /><span class="rango">Cada una puede ser un <strong>% de lo que entra</strong> o un
        <strong>monto fijo</strong> \u2014 y sale de todos los pagos, solo del primero, o cuando t\xFA
        la marques.</span>
        <p><button data-accion="nueva-oblig">+ Agregar la primera</button></p>
      </div>
    </section>`:`
  <section class="panel">
    <h2>Obligaciones <span class="sufijo">\u2014 salen antes que las metas</span></h2>
    <div class="tabla-ancha">
      <table>
        <thead><tr>
          <th>Nombre</th><th>Grupo (opcional)</th><th>C\xF3mo se calcula</th><th class="num">Valor</th>
          <th class="num">Cu\xE1nto sale</th><th>Empieza en</th>
          <th>Cada cu\xE1ndo</th><th>Supuesto al proyectar</th><th></th>
        </tr></thead>
        <tbody>${c.obligaciones.map(a=>Xa(a)+Wa(a)).join("")}</tbody>
      </table>
    </div>
    ${Ka()}
    <p class="nota"><button data-accion="nueva-oblig">+ Agregar obligaci\xF3n</button>
      ${ma("obligaciones")}</p>
    ${e.length?`<p class="nota aviso">
      Las puntuales no se pueden adivinar. Para calcular las fechas
      ${e.map(a=>`<strong>${p(a.nombre)}</strong>: ${da[a.supuesto??"siempre"]}`).join(" \xB7 ")}.
    </p>`:""}
  </section>`}function eo(e){if(!e.compra)return`<button data-accion="comprada" data-id="${e.id}">Ya la compr\xE9</button>`;let a=e.compra.precioReal-e.valor;return`<span class="completa">${p(Z(e.compra.mes))}</span>
    <span class="rango">${u(e.compra.precioReal)}${a===0?"":a<0?` \xB7 ${u(-a)} menos`:` \xB7 ${u(a)} m\xE1s`}</span>
    <button class="icono" data-accion="no-comprada" data-id="${e.id}" title="No la compr\xE9">\u2715</button>`}function ao(e){let a=ee(c.metas,c.repartos).get(e.id),o=a.previo>0&&a.real>0&&Math.abs(a.previo-a.real)<=Math.max(1e3,a.real*.05),t=`<input type="text" inputmode="numeric" data-dinero value="${M(a.previo)}"
      title="Lo que ya ten\xEDas pagado antes de usar el programa"
      data-accion="meta" data-id="${e.id}" data-campo="abonado" />`;return a.real===0?t:`${t}
    <span class="rango">+ ${u(a.real)} de lo real</span>
    <span class="${a.falta===0?"completa":""}">= ${u(a.total)}</span>
    ${o?`<span class="aviso">\u26A0\uFE0F ${u(a.previo)} escrito a mano y ${u(a.real)}
      registrado: \xBFes el mismo dinero?
      <button class="icono" data-accion="quitar-previo" data-id="${e.id}"
        title="S\xED, dejar solo lo registrado">\u2713</button></span>`:""}`}function ma(e){if((e==="metas"?c.metas.length:c.obligaciones.length)<2)return"";let o=e==="metas"?' title="Ojo: en las metas el orden es la prioridad de pago, as\xED que esto cambia el plan"':"";return`&nbsp; <span class="rango">Ordenar por</span>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="nombre"${o}>nombre</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="valor"${o}>valor</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="grupo"${o}>grupo</button>`}function oo(e,a,o){return`
  <tr draggable="false" data-fila="${a}">
    <td class="orden">
      <span class="asa" title="Arrastra para moverla de sitio">\u283F</span>
      <button class="icono" data-accion="subir" data-i="${a}" ${a===0?"disabled":""} title="Subir">\u2191</button>
      <button class="icono" data-accion="bajar" data-i="${a}" ${a===o-1?"disabled":""} title="Bajar">\u2193</button>
    </td>
    <td><input class="ancho" value="${p(e.nombre)}" data-accion="meta" data-id="${e.id}" data-campo="nombre" /></td>
    <td class="num"><input type="text" inputmode="numeric" data-dinero value="${M(e.valor)}"
        data-accion="meta" data-id="${e.id}" data-campo="valor" /></td>
    <td><input value="${p(e.grupo??"")}" placeholder="ninguno"
        data-accion="meta" data-id="${e.id}" data-campo="grupo" /></td>
    <td class="desde">${ua(e.desdePago,"meta",e.id)}
      <div class="plazo"><span class="rango">la quiero antes del</span>
        <input type="number" min="0" step="1" class="corto" value="${e.antesDelPago??""}"
          placeholder="\u2014" title="Solo para avisarte: no cambia el orden de pago"
          data-accion="meta" data-id="${e.id}" data-campo="antesDelPago" />
        ${e.antesDelPago&&e.antesDelPago>0?`<span class="rango">${p(S(R(e.antesDelPago,x()).optimista))}</span>`:""}</div>
    </td>
    <td class="num ritmo">
      <input type="text" inputmode="numeric" data-dinero
        value="${e.maximoPorPago?M(e.maximoPorPago):""}" placeholder="sin tope"
        title="M\xE1ximo que puede recibir en un pago"
        data-accion="meta" data-id="${e.id}" data-campo="maximoPorPago" />
      <span class="rango">o en <input type="number" min="0" step="1" class="corto"
        value="${e.enCuotas??""}" placeholder="\u2014"
        title="Reunirla en tantos pagos: la cuota la calculo yo"
        data-accion="meta" data-id="${e.id}" data-campo="enCuotas" /> pagos
        ${e.enCuotas&&e.enCuotas>0&&!e.maximoPorPago?`\xB7 ${u(Math.ceil(e.valor/Math.round(e.enCuotas)))} c/u`:""}</span>
    </td>
    <td class="num pagado">${ao(e)}</td>
    <td class="compra">${eo(e)}</td>
    <td class="num">
      <button class="icono" data-accion="duplicar-meta" data-id="${e.id}" title="Duplicar">\u29C9</button>
      <button class="icono" data-accion="borrar-meta" data-id="${e.id}" title="Quitar">\u2715</button>
    </td>
  </tr>`}function to(){if(c.metas.length===0)return`
    <section class="panel">
      <h2>Mis metas <span class="sufijo">\u2014 en el orden en que las quiero pagar</span></h2>
      <div class="vacio">
        <strong>Todav\xEDa no has puesto ninguna meta.</strong>
        Agrega lo que quieres comprar, con el precio de hoy.<br />
        El orden es el que t\xFA decidas: el programa paga de arriba hacia abajo.
        <p><button class="primario" data-accion="nueva-meta">+ Agregar mi primera meta</button></p>
      </div>
    </section>`;let e=c.metas.reduce((a,o)=>a+o.valor,0);return`
  <section class="panel">
    <h2>Mis metas <span class="sufijo">\u2014 en el orden en que las quiero pagar</span></h2>
    <div class="tabla-ancha">
      <table>
        <thead><tr>
          <th>Orden</th><th>Meta</th><th class="num">Precio</th>
          <th>Grupo (opcional)</th><th>Empieza en</th>
          <th class="num">Ritmo de pago</th><th class="num">Ya pagado</th>
          <th>\xBFYa la compraste?</th><th></th>
        </tr></thead>
        <tbody>${c.metas.map((a,o)=>oo(a,o,c.metas.length)).join("")}</tbody>
      </table>
    </div>
    <p class="nota">
      <button data-accion="nueva-meta">+ Agregar meta</button>
      ${ma("metas")}
      &nbsp; Suma de todas: <strong>${u(e)}</strong>
      ${(()=>{let a=ze(c.metas,c.repartos);return a===0?"":` &nbsp; Llevas pagado: <strong class="completa">${u(a)}</strong>
          <span class="rango">\xB7 te faltan ${u(Math.max(0,e-a))}</span>`})()}
      ${c.metas.length>1?`<br /><span class="rango">
        <strong>Ritmo de pago</strong>: para reunir para dos cosas a la vez. Pon un
        <strong>tope</strong> en pesos, o di <strong>en cu\xE1ntos pagos</strong> la quieres reunir
        y yo calculo la cuota. Si pones los dos, manda el tope. Lo que no pase baja a la meta
        siguiente; en blanco, esa meta se lleva todo lo que haya.</span>`:""}
    </p>
  </section>`}var no={tranquilo:"",pronto:"aviso",hoy:"urgente",vencido:"malo"};function so(){let e=new Date,a=c.soportesMarcados[he(e)]??[],o=Je(e,a),t=no[o.urgencia],n=i=>{let r=a.includes(i.id);return`<li class="soporte ${r?"listo":""}">
      <label class="interruptor">
        <input type="checkbox" data-accion="soporte" data-id="${i.id}" ${r?"checked":""} />
        <span>${p(i.nombre)}${i.obligatorioExplicito?' <strong class="pendiente">OBLIGATORIO</strong>':""}</span>
      </label>
      ${i.detalle?`<p class="nota">${p(i.detalle)}</p>`:""}
    </li>`},s=be.filter(i=>i.frecuencia!=="cada_mes");return`
  <section class="panel radicacion ${t}">
    <h2><span class="etiqueta real">Real</span> Radicar la cuenta de cobro
      <span class="sufijo">\u2014 qu\xE9 d\xEDa y con qu\xE9 papeles</span></h2>
    <p class="titular ${t}">${p(o.titular)}</p>
    <p class="nota">${p(We(o.limite))}
      ${o.limite.usoUltimoDiaDelMes?`<br /><span class="rango">${p(Ue)}</span>`:""}
    </p>
    <ul class="soportes">${fe().map(n).join("")}</ul>
    <p class="nota">
      Ya entregados una sola vez y no hay que repetirlos:
      ${s.filter(i=>i.frecuencia==="una_sola_vez").map(i=>p(i.nombre)).join(" \xB7 ")}.
      La constancia firmada por el paciente es solo para personal asistencial.
    </p>
  </section>`}function ro(){let e=J(c.cuentas,c.ingresos),a=Ie(e);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> Lo que te deben y lo que te han pagado
      <span class="sufijo">\u2014 una fila por mes cobrado</span></h2>
    ${c.cuentas.length===0?`<div class="vacio">A\xFAn no has registrado ninguna cuenta de cobro.<br />
         Sirve para llevar cu\xE1nto te deben cuando te pagan a medias.
         <p><button data-accion="nueva-cuenta">+ Registrar una cuenta de cobro</button></p></div>`:`<div class="tabla-ancha"><table>
          <thead><tr><th>Periodo</th><th class="num">Esperado</th><th class="num">Recibido</th>
            <th class="num">Falta</th><th>Estado</th><th></th></tr></thead>
          <tbody>${e.map(o=>`
            <tr>
              <td><input class="ancho" value="${p(o.cuenta.periodo)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="periodo" /></td>
              <td class="num"><input type="text" inputmode="numeric" data-dinero value="${M(o.cuenta.montoEsperado)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="montoEsperado" /></td>
              <td class="num">${u(o.recibido)}</td>
              <td class="num ${o.pendiente>0?"pendiente":"completa"}">
                ${o.pendiente>0?u(o.pendiente):"\u2014"}</td>
              <td class="rango">${p(Ce(o).split(": ").slice(1).join(": "))}</td>
              <td class="num">
                <button data-accion="abonar" data-id="${o.cuenta.id}">+ Registrar pago</button>
                <button class="icono" data-accion="borrar-cuenta" data-id="${o.cuenta.id}">\u2715</button>
              </td>
            </tr>
            ${o.ingresos.map(t=>`<tr class="componente">
              <td>${p(t.fecha)}</td><td class="num"></td><td class="num">${u(t.monto)}</td>
              <td colspan="2" class="rango">pago recibido</td>
              <td class="num"><button class="icono" data-accion="borrar-ingreso" data-id="${t.id}">\u2715</button></td>
            </tr>`).join("")}`).join("")}
          </tbody>
        </table></div>
        <p class="nota"><button data-accion="nueva-cuenta">+ Registrar otra cuenta</button>
        ${a.length?` &nbsp; <span class="pendiente">Te deben en total ${u(ce(e))}</span>`:""}</p>`}
  </section>`}function sa(e,a,o,t,n,s,i,r,l=""){let d=x(),m=o===null||t===null?"\u2014":`pago ${o}${t!==o?` - ${t}`:""}${n===null?"":` (${n})`}`,g=t!==null?X(R(t,d)):r?"ya la ten\xEDas pagada":"sin terminar",v=i?`<span class="completa">${u(a)}</span>`:`<span class="pendiente">${u(s)} de ${u(a)}</span>`;return`<tr class="${l}">
    <td class="meta-nombre">${p(e)}</td>
    <td class="num">${v}</td>
    <td class="rango">${m}</td>
    <td class="cuando">${p(g)}</td>
  </tr>`}function io(){if(c.metas.length===0)return null;try{return V(la())}catch{return null}}function co(e){if(c.metas.length===0)return`<section class="panel simulado">
      <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
      <div class="vacio">Agrega tus metas arriba y aqu\xED aparecen las fechas.</div>
    </section>`;if(!e)return`<section class="panel simulado"><h2>Simulaci\xF3n</h2>
      <p class="nota aviso">No pude calcular la proyecci\xF3n con estos datos.</p></section>`;let a=new Map(Ge(e).map(d=>[d.grupo,d])),o=[],t=new Set,n=(d,m="")=>sa(d.nombre,d.valor,d.pagoInicio,d.pagoFin,d.cantidadPagos,d.totalAbonado,d.completada,d.yaEstabaPagada,m);for(let d of e.metas){if(!d.grupo){o.push(n(d));continue}if(t.has(d.grupo))continue;t.add(d.grupo);let m=a.get(d.grupo);o.push(sa(m.grupo,m.valor,m.pagoInicio,m.pagoFin,null,m.totalAbonado,m.completado,m.yaEstabaPagado,"grupo"));for(let g of e.metas)g.grupo===d.grupo&&o.push(n(g,"componente"))}let s=e.pagos.length,i=c.escenario,r=x(),l=X(R(s,r));return`
  <section class="panel simulado">
    <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
    <div class="resumen">
      <div><span class="valor">${e.totalPagos}</span><span class="rotulo">pagos hasta terminarlo todo</span></div>
      <div><span class="valor cuando">${p(l)}</span><span class="rotulo">termina la \xFAltima meta</span></div>
      <div><span class="valor">${u(e.ahorroFinal)}</span><span class="rotulo">ahorro acumulado al final</span></div>
    </div>
    <div class="tabla-ancha">
      <table>
        <thead><tr><th>Meta</th><th class="num">Abonado</th><th>Pagos</th><th>Cu\xE1ndo</th></tr></thead>
        <tbody>${o.join("")}</tbody>
      </table>
    </div>
    <p class="nota aviso">
      Esto es una simulaci\xF3n, no un hecho: supone que te entran ${u(i.ingresoEsperado)} por pago.
      ${le(r)?`Las fechas son de <strong>una sola posibilidad</strong>: pagos puntuales cada
           ${i.diasOptimista} d\xEDas, sin contar atrasos. Sube \xABd\xEDas si se atrasan\xBB
           por encima de ${i.diasOptimista} y vuelven a salir como rango.`:`El \xABcu\xE1ndo\xBB va de puntual (cada ${i.diasOptimista} d\xEDas) a atrasado (cada ${i.diasPesimista}).`}
      ${e.incompleta?"<br /><strong>Con ese ingreso no alcanza a terminar.</strong>":""}
    </p>
    ${uo(e)}
    ${lo()}
  </section>`}function lo(){let e=ce(J(c.cuentas,c.ingresos));if(e<=0)return"";let a=Qe(la(),e);if(!a)return"";let o=x(),t=n=>X(R(Math.max(1,n),o));return`<p class="nota ${a.seAdelanta>0?"":"rango"}">
    Te deben <strong class="pendiente">${u(a.pendiente)}</strong>.
    ${a.seAdelanta>0?`Si te los pagaran de una vez, terminar\xEDas <strong>${a.seAdelanta}
         ${a.seAdelanta===1?"pago":"pagos"} antes</strong>: la \xFAltima meta pasar\xEDa de
         ${p(t(a.pagosAhora))} a ${p(t(a.pagosSiPagan))}.`:`Aunque te los pagaran de una vez, las fechas no se mover\xEDan \u2014 el ritmo lo marcan los
         topes por pago que pusiste arriba, no lo que entra.`}
    <br /><span class="rango">Esto es aparte: la proyecci\xF3n de arriba NO cuenta ese dinero
    hasta que lo registres como pago recibido.</span>
  </p>`}function uo(e){let a=Ve(e,c.metas);if(a.length===0)return"";let o=x(),t=s=>S(R(Math.max(1,s),o).optimista),n=s=>s.termina===null?`<li class="mal"><strong>${p(s.nombre)}</strong> la quer\xEDas para
        ${p(t(s.queria))} y <strong>no alcanza a terminar</strong> con este ingreso.</li>`:s.seRetrasa===0?`<li class="bien"><strong>${p(s.nombre)}</strong> la quer\xEDas para
        ${p(t(s.queria))} y llega ${s.termina===0?"ya pagada":`en ${p(t(s.termina))}`}.</li>`:`<li class="mal"><strong>${p(s.nombre)}</strong> la quer\xEDas para
      ${p(t(s.queria))} y va para <strong>${p(t(s.termina))}</strong>
      \u2014 ${s.seRetrasa} ${s.seRetrasa===1?"pago":"pagos"} tarde.
      S\xFAbela de posici\xF3n o dale m\xE1s por pago.</li>`;return`<div class="plazos">
    <h3 class="titulo-total">Lo que quer\xEDas para cierta fecha</h3>
    <ul>${a.map(n).join("")}</ul>
    <p class="nota rango">Esto solo avisa: el orden de pago lo pones t\xFA arriba, y el programa
      no lo cambia por su cuenta.</p>
  </div>`}function z(e){let a=K(c.metas),o=c.ingresos.filter(s=>s.fecha<=e.fecha&&s.id!==e.id).sort((s,i)=>s.fecha.localeCompare(i.fecha));for(let s of o){let i=c.repartos.find(r=>r.ingresoId===s.id);for(let r of i?.abonos??[])r.refId&&a.set(r.refId,Math.max(0,(a.get(r.refId)??0)-r.monto))}let t=e.cuentaDeCobroId?!o.some(s=>s.cuentaDeCobroId===e.cuentaDeCobroId):!0,n=c.escenario;return Ae(e,Oe(e,o),c.obligaciones,{nombre:"Otros / Ahorro",base:n.colchonBase,minimo:n.colchonMinimo,elastico:!1},c.metas,a,t)}function po(){let e=ue(c.ingresos,c.repartos);if(e.length===0)return`<section class="panel">
      <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
        <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
      <div class="vacio">
        <strong>Todav\xEDa no has registrado ninguna entrada de plata.</strong>
        Registra un pago en \xABCuentas de cobro\xBB y aqu\xED aparece, mes a mes, en qu\xE9 se fue.
        <p><button data-accion="aporte-externo">+ Meter plata de otro lado</button></p>
      </div>
    </section>`;let a=e.slice().reverse().map(t=>{let n=c.ingresos.filter(s=>s.fecha.slice(0,7)===t.mes).sort((s,i)=>s.fecha.localeCompare(i.fecha));return`
    <div class="mes-real">
      <div class="mes-cabecera">
        <h3>${p(Z(t.mes))}</h3>
        <span class="valor">${u(t.entro)}</span>
        <span class="rotulo">entr\xF3${t.deFuera>0?` \xB7 ${u(t.deFuera)} los pusiste t\xFA`:""}</span>
      </div>
      ${n.map(mo).join("")}
      ${n.length>1?`<div class="total-mes">
        <span>Ese mes: ${u(t.aObligaciones)} en obligaciones \xB7 ${u(t.aMetas)} a metas
        ${t.alAhorro>0?` \xB7 ${u(t.alAhorro)} guardado`:""}</span></div>`:""}
    </div>`}).join(""),o=qe(c.repartos);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
      <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
    ${a}
    ${o.length>1?`
      <h3 class="titulo-total">En todo lo que llevas</h3>
      <div class="tabla-ancha"><table><tbody>
        ${o.map(t=>`<tr><td class="meta-nombre">${p(t.nombre)}</td>
          <td class="num">${u(t.monto)}</td></tr>`).join("")}
      </tbody></table></div>`:""}
    <p class="nota"><button data-accion="aporte-externo">+ Meter plata de otro lado</button>
      &nbsp; <span class="rango">Para cuando pones de tu bolsillo (Nequi, efectivo) y no viene del trabajo.</span></p>
  </section>`}function mo(e){let a=c.repartos.find(r=>r.ingresoId===e.id),o=c.cuentas.find(r=>r.id===e.cuentaDeCobroId),t=p(o?o.periodo:e.nota??"de otro lado");if(!a)return`<div class="ingreso-real">
      <div class="ingreso-cabecera">
        <span class="meta-nombre">${u(e.monto)}</span>
        <span class="rango">${p(e.fecha)} \xB7 ${t}</span>
      </div>
      <p class="nota aviso">No est\xE1 dicho en qu\xE9 se fue este dinero.
        <button data-accion="proponer" data-id="${e.id}">Calcularlo por m\xED</button></p>
    </div>`;let n=G(a,e),s=(r,l,d)=>`
    <tr>
      <td class="meta-nombre">${p(r.nombre)}
        ${r.movidoDesdeGasto?'<span class="rango">\xB7 ven\xEDa de un gasto</span>':""}</td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${M(r.monto)}" class="corto-dinero"
        data-accion="editar-reparto" data-id="${a.id}" data-tipo="${l}" data-i="${d}" /></td>
      <td class="num">${r.movidoDesdeGasto?`<button class="icono" data-accion="abono-a-gasto" data-id="${a.id}" data-i="${d}"
             title="Devolverlo a gastos">\u21A9</button>`:""}</td>
    </tr>`,i=(r,l)=>`
    <tr class="gasto-suelto">
      <td><input value="${p(r.nombre)}" placeholder="\xBFen qu\xE9 se fue?"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${l}" data-campo="nombre" /></td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${M(r.monto)}" class="corto-dinero"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${l}" data-campo="monto" /></td>
      <td class="num"><button class="icono" data-accion="borrar-gasto"
        data-id="${a.id}" data-i="${l}" title="Quitar">\u2715</button></td>
    </tr>`;return`<div class="ingreso-real ${a.propuesto?"propuesto":""}">
    <div class="ingreso-cabecera">
      <span class="meta-nombre">${u(e.monto)}</span>
      <span class="rango">${p(e.fecha)} \xB7 ${t}</span>
      ${a.propuesto?`<button class="primario" data-accion="confirmar-reparto" data-id="${a.id}">As\xED fue</button>`:'<span class="completa">confirmado</span>'}
    </div>
    ${a.propuesto?`<p class="nota aviso">Esto es lo que el programa <em>calcula</em> que
      hiciste. Corrige lo que no fue as\xED y dale a \xABAs\xED fue\xBB.</p>`:""}
    <div class="tabla-ancha">
      <table>
        <tbody>
          ${a.obligaciones.map((r,l)=>[r,l]).filter(([r])=>r.monto!==0).map(([r,l])=>s(r,"obligaciones",l)).join("")}
          ${a.abonos.map((r,l)=>[r,l]).filter(([r])=>r.monto!==0).map(([r,l])=>s(r,"abonos",l)).join("")}
          ${(a.gastos??[]).map(i).join("")}
          <tr class="grupo">
            <td class="meta-nombre">Qued\xF3 guardado</td>
            <td class="num"><input type="text" inputmode="numeric" data-dinero
              value="${M(a.alAhorro)}" class="corto-dinero"
              data-accion="editar-reparto" data-id="${a.id}" data-tipo="ahorro" data-i="0" /></td>
            <td class="num"></td>
          </tr>
        </tbody>
      </table>
    </div>
    ${(()=>{let r=Fe(a,c.metas);return r.length===0?"":r.map(l=>`<p class="nota aviso">
        Tienes <strong>${p(l.gasto.nombre)}</strong> (${u(l.gasto.monto)}) anotado aqu\xED como
        un gasto cualquiera, pero <strong>${p(l.metaNombre)}</strong> es una de tus metas.
        <br />Si ese dinero se lo metiste a la meta, m\xE1rcalo: as\xED el programa sabe que ya llevas
        ${u(l.gasto.monto)} pagados y deja de calcular las fechas como si te faltara el precio
        entero. Si fue otra cosa que se llama parecido, d\xE9jalo como est\xE1.
        <br /><button data-accion="gasto-a-abono" data-id="${a.id}"
          data-meta="${l.metaId}" data-nombre="${p(l.gasto.nombre)}">S\xED, fue abono a ${p(l.metaNombre)}</button>
      </p>`).join("")})()}
    ${(()=>{let r=je(a,z(e));return r.length===0?"":`<p class="nota aviso">
        Cambiaste la configuraci\xF3n desde que se calcul\xF3 esto: hoy
        <strong>${r.map(p).join(", ")}</strong> ya no ${r.length===1?"entrar\xEDa":"entrar\xEDan"}
        en este mes. Si as\xED fue de verdad, d\xE9jalo; si no, dale a \xABVolver a calcular\xBB.</p>`})()}
    <p class="nota">
      <button data-accion="nuevo-gasto" data-id="${a.id}">+ Se fue en algo m\xE1s</button>
      <button data-accion="recalcular" data-id="${a.id}">Volver a calcular</button>
      <span class="rango">Lo primero es para lo que sali\xF3 de lo guardado \u2014prestado, comida,
      un tr\xE1mite\u2014. Lo segundo rehace el c\xE1lculo con las obligaciones de ahora
      <strong>y borra lo que hayas corregido a mano</strong>.</span>
    </p>
    ${n!==0?`<p class="nota ${n>0?"aviso":"malo"}">
      ${n>0?`Faltan <strong>${u(n)}</strong> por decir a d\xF3nde fueron.`:`Repartiste <strong>${u(-n)}</strong> m\xE1s de lo que entr\xF3.`}
      <button data-accion="cuadrar" data-id="${a.id}">Mandarlos a lo guardado</button>
    </p>`:""}
  </div>`}function go(e){let a=x(),o=e?Te(e.pagos,a.desde,a.diasOptimista,c.metas):[],t=ue(c.ingresos,c.repartos),n=[...new Set([...o.map(l=>l.mes),...t.map(l=>l.mes)])],s=Ne(c.cuentas,c.ingresos,c.escenario.ingresoEsperado,n),i=_e(o,t,F().slice(0,7),s);if(i.length===0)return`<section class="panel">
      <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
      <div class="vacio">Agrega tus metas y registra un pago: aqu\xED se ve el calendario entero.</div>
    </section>`;fo(i);let r=we(i);return`
  <section class="panel">
    <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
    <div class="resumen">
      <div><span class="valor real">${u(r.entroDeVerdad)}</span>
        <span class="rotulo">ha entrado de verdad \xB7 ${r.mesesConDatos} ${r.mesesConDatos===1?"mes":"meses"}</span></div>
      <div><span class="valor">${u(r.guardadoDeVerdad)}</span>
        <span class="rotulo">llevas guardado</span></div>
      ${r.mesesQueFaltan>0?`<div><span class="valor cuando">${u(r.faltaPorEntrar)}</span>
            <span class="rotulo">faltar\xEDan por entrar \xB7 ${r.mesesQueFaltan} ${r.mesesQueFaltan===1?"mes":"meses"}</span></div>`:`<div><span class="valor">${u(r.gastadoDeVerdad)}</span>
            <span class="rotulo">llevas gastado</span></div>`}
    </div>
    <p class="nota">
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="1">Desplegar todos</button>
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="0">Plegar todos</button>
      <span class="rango">&nbsp; ${i.length} ${i.length===1?"mes":"meses"} \xB7
        pulsa uno para ver en qu\xE9 se va</span>
    </p>
    <div class="linea-tiempo">${i.map(ho).join("")}</div>
    <p class="nota">
      <span class="etiqueta real">Real</span> lo que pas\xF3 \xB7
      <span class="etiqueta simulacion">Simulaci\xF3n</span> lo que pasar\xEDa si entra lo que supone
      el escenario. Nunca se mezclan en una sola cifra.
    </p>
  </section>`}function bo(e){let a=(n,s)=>n.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")===s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),o=c.obligaciones.find(n=>a(n.nombre,e));if(o)return`<span class="que-es obligacion">fijo${o.grupo?` \xB7 ${p(o.grupo)}`:""}</span>`;let t=c.metas.find(n=>a(n.nombre,e));return t?`<span class="que-es meta">meta${t.grupo?` \xB7 ${p(t.grupo)}`:""}</span>`:e==="Qued\xF3 guardado"||e==="Se guardar\xEDa"?"":'<span class="que-es suelto">de una vez</span>'}var H=new Set,ra=!1;function fo(e){if(ra)return;ra=!0;let a=e.findIndex(t=>t.estado==="actual"),o=a>=0?a:0;for(let t of e.slice(o,o+2))H.add(t.mes)}function ho(e){let a=e.real!==null,o=e.real??e.simulado;if(!o)return"";let t=a?o.entro:e.esperado?.monto??o.entro,n=!a&&e.simulado!==null&&e.esperado!==null&&e.esperado.monto!==e.simulado.entro,s=e.real?e.real.detalle:q(e.simulado?.detalle),i=e.estado==="actual"?'<span class="chip ahora">este mes</span>':e.estado==="futuro"?'<span class="chip futuro">viene</span>':"",r=[o.aObligaciones>0?`${u(o.aObligaciones)} fijos`:"",o.aMetas>0?`${u(o.aMetas)} a metas`:"",a&&e.real.enGastos>0?`${u(e.real.enGastos)} sueltos`:"",o.alAhorro>0?`${u(o.alAhorro)} guardado`:""].filter(Boolean).join(" \xB7 ");return`
  <details class="mes-vista ${e.estado} ${a?"es-real":"es-simulado"}"
           data-mes="${e.mes}" ${H.has(e.mes)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${p(Z(e.mes))}</h3>
      ${i}
      <span class="etiqueta ${a?"real":"simulacion"}">${a?"Real":"Simulaci\xF3n"}</span>
      <span class="valor">${u(t)}</span>
      ${r?`<span class="resumen-plegado">${r}</span>`:""}
    </summary>
    ${e.esperado?.segun==="cuenta_de_cobro"&&!a?`<p class="nota rango">
      Seg\xFAn tu cuenta de cobro de este mes, no seg\xFAn el escenario.</p>`:""}
    ${n?`<p class="nota aviso">
      El desglose de abajo est\xE1 calculado con el escenario (${u(e.simulado.entro)}).
      Si de verdad esperas ${u(e.esperado.monto)} este mes, cambia \xABLo que espero por pago\xBB
      para que las cifras cuadren.</p>`:""}
    ${e.diferencia!==null&&e.diferencia!==0?`<p class="nota ${e.diferencia<0?"aviso":""}">
      ${e.diferencia<0?`Entraron ${u(-e.diferencia)} menos de lo esperado para ese mes (${u(e.esperado.monto)}${e.esperado.segun==="cuenta_de_cobro"?", seg\xFAn tu cuenta de cobro":""}).`:`Entraron ${u(e.diferencia)} m\xE1s de lo esperado para ese mes.`}</p>`:""}
    ${e.estado==="actual"&&e.real&&e.esperado?`<p class="nota">
      ${e.esperado.segun==="cuenta_de_cobro"?`Tu cuenta de cobro de este mes es de <strong>${u(e.esperado.monto)}</strong>`:`El escenario supone <strong>${u(e.esperado.monto)}</strong> este mes`}.
      ${e.real.entro<e.esperado.monto?`Llevas ${u(e.real.entro)}: faltar\xEDan ${u(e.esperado.monto-e.real.entro)} por entrar.`:"Ya entr\xF3 todo."}</p>`:""}
    ${s.length===0?'<p class="nota rango">Sin movimientos.</p>':`
      <div class="tabla-ancha"><table><tbody>
        ${s.map(l=>`<tr>
          <td class="meta-nombre">${p(l.nombre)} ${bo(l.nombre)}</td>
          <td class="num">${u(l.monto)}</td></tr>`).join("")}
        ${o.alAhorro>0?`<tr class="grupo">
          <td class="meta-nombre">${a?"Qued\xF3 guardado":"Se guardar\xEDa"}</td>
          <td class="num">${u(o.alAhorro)}</td></tr>`:""}
      </tbody></table></div>`}
    ${e.real&&e.real.sinAsignar>0?`<p class="nota aviso">
      Hay ${u(e.real.sinAsignar)} sin decir en qu\xE9 se fueron.</p>`:""}
  </details>`}function se(){let e=io();return[["radicacion",so()],["vista",go(e)],["escenario",Ua()],["metas",to()],["proyeccion",co(e)],["obligaciones",Za()],["cuentas",ro()],["real",po()]]}function ga(e){if(typeof e.querySelectorAll=="function")for(let a of Array.from(e.querySelectorAll("table"))){let o=Array.from(a.querySelectorAll("thead th")).map(t=>(t.textContent??"").trim());if(na(o)){a.classList.add("como-tarjetas");for(let t of Array.from(a.querySelectorAll("tbody tr"))){let n=Array.from(t.children),s=n.map(r=>Number(r.getAttribute("colspan")??1)||1),i=ta(o,s);n.forEach((r,l)=>{let d=i[l];d?r.dataset.etiqueta=d:delete r.dataset.etiqueta})}}}}function Pe(e,a){e.innerHTML=a,ga(e)}function ba(){return document.activeElement?.closest?.("[data-panel]")?.dataset.panel??null}function xe(e=ba()){let a=new Set([e,Ee].filter(Boolean));for(let[o,t]of se()){if(a.has(o))continue;let n=document.getElementById(`panel-${o}`);n&&Pe(n,t)}fa()}function fa(){let e=document.getElementById("mensaje");e&&(e.innerHTML=$?`<div class="mensaje ${$.malo?"malo":"bueno"}">${p($.texto)}</div>`:"",$=null)}function y(){let e=document.getElementById("app"),a=ia(document.activeElement),o=document.activeElement,t=o&&typeof o.selectionStart=="number"?o.selectionStart:null,n=window.scrollY;e.className="",e.innerHTML=`
    <header class="cabecera">
      <h1>Gesti\xF3n del dinero del trabajo</h1>
      <div class="acciones">
        <button data-accion="exportar">Exportar respaldo</button>
        <button data-accion="importar">Importar respaldo</button>
      </div>
    </header>
    <div id="mensaje"></div>
    ${se().map(([s,i])=>`<div id="panel-${s}" data-panel="${s}">${i}</div>`).join("")}
    <input type="file" id="archivo" accept="application/json" hidden />`,ga(e),fa(),window.scrollTo({top:n,behavior:"instant"}),Ba(a,t)}function ha(e){let a=Math.round(Number(e));if(!(!Number.isFinite(a)||a<=1))return a}f.set("escenario",e=>{let a=e.dataset.campo,o=e,t=o.value;if(c.escenario[a]=o.type==="date"?t:o.hasAttribute("data-dinero")?E(t):Number(t),a==="diasOptimista"||a==="diasPesimista"){let n=Math.round(Number(t));c.escenario[a]=Number.isFinite(n)&&n>0?n:1}I()});f.set("elastico",e=>{c.escenario.colchonElastico=e.checked,I()});f.set("oblig",e=>{let a=c.obligaciones.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=a.tipo==="porcentaje"?Number(t)/100:E(t);else if(o==="tipo"){let n=t;n!==a.tipo&&(a.valor=n==="porcentaje"?.1:1e5),a.tipo=n}else o==="modo"?(a.modo=t,a.modo==="puntual"&&!a.supuesto&&(a.supuesto="siempre")):o==="grupo"?a.grupo=t.trim()||void 0:o==="desdePago"?a.desdePago=ha(t):o==="supuesto"?a.supuesto=t:a.nombre=t;I()});f.set("nuevo-cambio",e=>{let a=c.obligaciones.find(t=>t.id===e.dataset.id);if(!a)return;let o=Math.max(1,...(a.cambios??[]).map(t=>t.desdePago));a.cambios=[...a.cambios??[],{desdePago:o+1,valor:a.valor}],h()});f.set("cambio",e=>{let a=c.obligaciones.find(n=>n.id===e.dataset.id),o=a?.cambios?.[Number(e.dataset.i)];if(!a||!o)return;let t=e.value;if(e.dataset.campo==="desdePago"){let n=Math.round(Number(t));o.desdePago=Number.isFinite(n)&&n>0?n:1}else o.valor=a.tipo==="porcentaje"?Number(t)/100:E(t);I()});f.set("borrar-cambio",e=>{let a=c.obligaciones.find(t=>t.id===e.dataset.id);if(!a?.cambios)return;let o=Number(e.dataset.i);a.cambios=a.cambios.filter((t,n)=>n!==o),h()});f.set("nuevo-cambio-ahorro",()=>{let e=c.escenario.cambiosColchon??[],a=Math.max(1,...e.map(o=>o.desdePago));c.escenario.cambiosColchon=[...e,{desdePago:a+1,valor:c.escenario.colchonBase}],h()});f.set("cambio-ahorro",e=>{let a=c.escenario.cambiosColchon?.[Number(e.dataset.i)];if(!a)return;let o=e.value;if(e.dataset.campo==="desdePago"){let t=Math.round(Number(o));a.desdePago=Number.isFinite(t)&&t>0?t:1}else a.valor=E(o);I()});f.set("borrar-cambio-ahorro",e=>{let a=Number(e.dataset.i);c.escenario.cambiosColchon=(c.escenario.cambiosColchon??[]).filter((o,t)=>t!==a),h()});f.set("nueva-oblig",()=>{c.obligaciones.push({id:O("ob"),nombre:"Nueva obligaci\xF3n",tipo:"fijo",valor:1e5,modo:"cada_pago"}),h()});f.set("borrar-oblig",e=>{c.obligaciones=c.obligaciones.filter(a=>a.id!==e.dataset.id),h()});f.set("meta",e=>{let a=c.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=E(t);else if(o==="abonado")a.abonado=E(t);else if(o==="desdePago")a.desdePago=ha(t);else if(o==="maximoPorPago"){let n=E(t);a.maximoPorPago=n>0?n:void 0}else if(o==="enCuotas"){let n=Math.round(Number(t));a.enCuotas=Number.isFinite(n)&&n>0?n:void 0}else if(o==="antesDelPago"){let n=Math.round(Number(t));a.antesDelPago=Number.isFinite(n)&&n>0?n:void 0}else o==="grupo"?a.grupo=t.trim()||void 0:a.nombre=t;I()});f.set("nueva-meta",()=>{let e=O("meta");c.metas.push({id:e,nombre:"",valor:0}),h(),document.querySelector(`input[data-id="${e}"][data-campo="nombre"]`)?.focus()});f.set("plegar-meses",e=>{let a=e.dataset.abrir==="1";if(H.clear(),a)for(let t of document.querySelectorAll("[data-mes]"))H.add(t.dataset.mes);let o=document.getElementById("panel-vista");o&&Pe(o,se().find(([t])=>t==="vista")[1])});f.set("ordenar",e=>{let a=e.dataset.por,o=(n,s)=>n.localeCompare(s,"es",{sensitivity:"base",numeric:!0}),t=(n,s)=>a==="valor"?s.valor-n.valor:a==="grupo"&&o(n.grupo??"\uFFFF",s.grupo??"\uFFFF")||o(n.nombre,s.nombre);e.dataset.lista==="metas"?(c.metas=[...c.metas].sort(t),$={texto:`Metas ordenadas por ${a}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron. Si no era lo que quer\xEDas, reord\xE9nalas con las flechas.`,malo:!1}):c.obligaciones=[...c.obligaciones].sort(t),h()});f.set("duplicar-meta",e=>{let a=c.metas.findIndex(n=>n.id===e.dataset.id);if(a<0)return;let o=c.metas[a],t={...o,id:O("meta"),nombre:`${o.nombre} (copia)`,abonado:0};delete t.compra,c.metas.splice(a+1,0,t),h()});f.set("borrar-meta",e=>{c.metas=c.metas.filter(a=>a.id!==e.dataset.id),h()});function va(e,a){let o=e+a;if(o<0||o>=c.metas.length)return;let t=c.metas.slice();[t[e],t[o]]=[t[o],t[e]],c.metas=t,h()}f.set("subir",e=>va(Number(e.dataset.i),-1));f.set("bajar",e=>va(Number(e.dataset.i),1));f.set("nueva-cuenta",()=>{let e=new Date,a=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];c.cuentas.push({id:O("cta"),periodo:`${a[e.getMonth()]} de ${e.getFullYear()}`,montoEsperado:c.escenario.ingresoEsperado}),h()});f.set("cuenta",e=>{let a=c.cuentas.find(t=>t.id===e.dataset.id);if(!a)return;let o=e.value;e.dataset.campo==="montoEsperado"?a.montoEsperado=E(o):a.periodo=o,I()});f.set("borrar-cuenta",e=>{c.cuentas=c.cuentas.filter(o=>o.id!==e.dataset.id);let a=new Set(c.ingresos.filter(o=>o.cuentaDeCobroId===e.dataset.id).map(o=>o.id));c.ingresos=c.ingresos.filter(o=>o.cuentaDeCobroId!==e.dataset.id),c.repartos=c.repartos.filter(o=>!a.has(o.ingresoId)),h()});f.set("abonar",async e=>{let a=c.cuentas.find(r=>r.id===e.dataset.id);if(!a)return;let o=J([a],c.ingresos)[0],t=o.pendiente>0?o.pendiente:a.montoEsperado,n=await w({titulo:`\xBFCu\xE1nto te pagaron de ${a.periodo}?`,detalle:o.pendiente>0&&o.recibido>0?`Ya te hab\xEDan pagado ${u(o.recibido)}. Faltan ${u(o.pendiente)}.`:void 0,valorInicial:M(t),dinero:!0,textoAceptar:"Registrar pago"});if(n===null)return;let s=E(n);if(!Number.isFinite(s)||s<=0)return $={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},y();let i={id:O("ing"),cuentaDeCobroId:a.id,fecha:F(),monto:s};c.ingresos.push(i),c.repartos.push(z(i)),$={texto:"Registrado. Mira abajo en qu\xE9 se va ese dinero y corr\xEDgelo si no fue as\xED.",malo:!1},h()});f.set("comprada",async e=>{let a=c.metas.find(s=>s.id===e.dataset.id);if(!a)return;let o=await w({titulo:`\xBFPor cu\xE1nto compraste ${a.nombre}?`,detalle:`La ten\xEDas en ${u(a.valor)}. Pon lo que pagaste de verdad, aunque sea distinto.`,valorInicial:M(a.valor),dinero:!0,textoAceptar:"Siguiente"});if(o===null)return;let t=await w({titulo:"\xBFEn qu\xE9 mes la compraste?",detalle:"Escr\xEDbelo como AAAA-MM. Por ejemplo, 2026-08 para agosto de este a\xF1o.",valorInicial:F().slice(0,7),textoAceptar:"Guardar"});if(t===null)return;let n=/^\d{4}-\d{2}$/.test(t.trim())?t.trim():F().slice(0,7);a.compra={mes:n,precioReal:E(o)},h()});f.set("no-comprada",e=>{let a=c.metas.find(o=>o.id===e.dataset.id);a&&(delete a.compra,h())});f.set("proponer",e=>{let a=c.ingresos.find(o=>o.id===e.dataset.id);a&&(c.repartos=c.repartos.filter(o=>o.ingresoId!==a.id),c.repartos.push(z(a)),h())});f.set("confirmar-reparto",e=>{let a=c.repartos.find(o=>o.id===e.dataset.id);a&&(a.propuesto=!1,h())});f.set("editar-reparto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id);if(!a)return;let o=E(e.value),t=e.dataset.tipo,n=Number(e.dataset.i);t==="ahorro"?a.alAhorro=o:t==="obligaciones"&&a.obligaciones[n]?a.obligaciones[n].monto=o:t==="abonos"&&a.abonos[n]&&(a.abonos[n].monto=o),a.propuesto=!1,I()});f.set("quitar-previo",e=>{let a=c.metas.find(t=>t.id===e.dataset.id);if(!a)return;let o=a.abonado??0;a.abonado=0,$={texto:`Quit\xE9 los ${u(o)} que estaban escritos a mano en ${a.nombre}. Ahora manda lo registrado en \xABen qu\xE9 se fue la plata\xBB, que es lo que de verdad pagaste.`,malo:!1},h()});f.set("gasto-a-abono",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.metas.find(s=>s.id===e.dataset.meta);if(!a||!o)return;let t=e.dataset.nombre,n=(a.gastos??[]).find(s=>s.nombre===t);n&&(a.gastos=a.gastos.filter(s=>s!==n),a.abonos.push({nombre:o.nombre,monto:n.monto,refId:o.id,movidoDesdeGasto:!0}),$={texto:`Listo: los ${u(n.monto)} de \xAB${n.nombre}\xBB ahora cuentan como abono a ${o.nombre}. El total del mes no cambi\xF3. Si te equivocaste, la l\xEDnea tiene un bot\xF3n \u21A9 para devolverla a gastos.`,malo:!1},h())});f.set("abono-a-gasto",e=>{let a=c.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.abonos[o];!a||!t||(a.abonos=a.abonos.filter((n,s)=>s!==o),a.gastos=[...a.gastos??[],{nombre:t.nombre,monto:t.monto}],$={texto:`${t.nombre} volvi\xF3 a ser un gasto suelto.`,malo:!1},h())});f.set("nuevo-gasto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=G(a,o),n=t>0?t:Math.min(a.alAhorro,a.alAhorro);a.gastos=[...a.gastos??[],{nombre:"",monto:0}],n<=0&&(a.propuesto=!1),h()});f.set("editar-gasto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];if(!a||!t)return;let n=e.value;if(e.dataset.campo==="nombre")t.nombre=n;else{let s=E(n);a.alAhorro=Math.max(0,a.alAhorro-(s-t.monto)),t.monto=s}a.propuesto=!1,I()});f.set("borrar-gasto",e=>{let a=c.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];!a||!t||(a.alAhorro+=t.monto,a.gastos=a.gastos.filter((n,s)=>s!==o),h())});f.set("recalcular",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=a.gastos??[],n=z(o);n.gastos=t,n.alAhorro=Math.max(0,n.alAhorro-t.reduce((s,i)=>s+i.monto,0)),c.repartos=c.repartos.map(s=>s.id===a.id?n:s),$={texto:"Recalculado con las obligaciones de ahora.",malo:!1},h()});f.set("cuadrar",e=>{let a=c.repartos.find(t=>t.id===e.dataset.id),o=c.ingresos.find(t=>t.id===a?.ingresoId);!a||!o||(a.alAhorro=Math.max(0,a.alAhorro+G(a,o)),a.propuesto=!1,h())});f.set("aporte-externo",async e=>{let a=await w({titulo:"\xBFCu\xE1nto vas a meter de tu bolsillo?",detalle:"Plata tuya que no viene del trabajo: Nequi, efectivo, lo que tengas guardado por otro lado.",valorInicial:"0",dinero:!0,textoAceptar:"Meterlo"});if(a===null)return;let o=E(a);if(o<=0)return $={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},y();let t=await w({titulo:"\xBFDe d\xF3nde sali\xF3?",detalle:"Para que dentro de unos meses sepas qu\xE9 fue esto.",valorInicial:"Nequi",textoAceptar:"Guardar"}),n={id:O("ing"),fecha:F(),monto:o,nota:t?.trim()||"de otro lado"};c.ingresos.push(n),c.repartos.push(z(n)),h()});f.set("soporte",e=>{let a=he(new Date),o=new Set(c.soportesMarcados[a]??[]),t=e.dataset.id;e.checked?o.add(t):o.delete(t),c.soportesMarcados={...c.soportesMarcados,[a]:[...o]},I()});f.set("borrar-ingreso",e=>{c.repartos=c.repartos.filter(a=>a.ingresoId!==e.dataset.id),c.ingresos=c.ingresos.filter(a=>a.id!==e.dataset.id),h()});function $a(){let e=globalThis.__TAURI__;return e?.dialog&&e?.fs?{dialog:e.dialog,fs:e.fs}:null}f.set("exportar",async()=>{let e=ea(c),a=`respaldo-dinero-${F()}.json`,o=$a();if(!o){let t=new Blob([e],{type:"application/json"}),n=document.createElement("a");return n.href=URL.createObjectURL(t),n.download=a,n.click(),URL.revokeObjectURL(n.href),$={texto:`Respaldo guardado en tu carpeta de descargas como ${a}.`,malo:!1},y()}try{let t=await o.dialog.save({title:"\xBFD\xF3nde guardo el respaldo?",defaultPath:a,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!t)return;await o.fs.writeTextFile(t,e),$={texto:`Respaldo guardado en ${t}`,malo:!1}}catch(t){$={texto:`No pude guardar el respaldo: ${String(t)}`,malo:!0}}y()});f.set("importar",async()=>{let e=$a();if(e)try{let o=await e.dialog.open({title:"\xBFQu\xE9 respaldo quieres cargar?",multiple:!1,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!o)return;let{estado:t,aviso:n}=$e(await e.fs.readTextFile(o));return t?(c=t,$={texto:"Respaldo importado.",malo:!1},h()):($={texto:n.texto,malo:!0},y())}catch(o){return $={texto:`No pude leer ese archivo: ${String(o)}`,malo:!0},y()}let a=document.getElementById("archivo");a.onchange=async()=>{let o=a.files?.[0];if(!o)return;let{estado:t,aviso:n}=$e(await o.text());if(!t)return $={texto:n.texto,malo:!0},y();c=t,$={texto:"Respaldo importado.",malo:!1},h()},a.click()});document.addEventListener("input",e=>{let a=e.target;if(a instanceof HTMLInputElement&&(a.hasAttribute("data-dinero")&&oa(a),a.dataset.campo==="desdePago")){let o=a.parentElement?.querySelector(".mes-de-pago");if(o){let t=Math.max(1,Math.round(Number(a.value)||1));o.textContent=t<=1?"desde el primero":S(R(t,x()).optimista)}}});document.addEventListener("focusout",e=>{let a=e.target?.closest?.("[data-panel]");if(!a||e.relatedTarget?.closest?.("[data-panel]")===a)return;let t=a.dataset.panel;setTimeout(()=>{if(B||ba()===t)return;let n=se().find(([i])=>i===t)?.[1],s=document.getElementById(`panel-${t}`);n!==void 0&&s&&Pe(s,n)},0)});document.addEventListener("toggle",e=>{let a=e.target,o=a?.dataset?.mes;o&&(a.open?H.add(o):H.delete(o))},!0);document.addEventListener("change",e=>{let a=e.target?.closest("[data-accion]");a&&f.get(a.dataset.accion)?.(a,e)});document.addEventListener("click",e=>{let a=e.target?.closest("button[data-accion]");B=!1,a?(N=!1,f.get(a.dataset.accion)?.(a,e)):N&&(N=!1,xe())});"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(()=>{})});var ne=Ze();c=ne.estado;ne.aviso&&($={texto:ne.aviso.texto,malo:ne.aviso.grave});function vo(){let e=new Set(c.repartos.map(o=>o.ingresoId)),a=c.ingresos.filter(o=>!e.has(o.id)).sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o of a)c.repartos.push(z(o));return a.length>0}vo()&&ve(c);y();globalThis.__estado=()=>c;globalThis.__reiniciar=()=>{c=T(),h()};
