var fe=Number.MAX_SAFE_INTEGER;function h(e){let a=typeof e=="number"?e:Number(e);return Number.isFinite(a)?Math.abs(a)>fe?a<0?-fe:fe:Math.round(a):0}function ee(e,a){return h(e*a)}var He=100;function Ja(e,a){return a<=0?"sin_pagar":a>=e+He?"pagaron_de_mas":a>=e-He?"completa":"parcial"}function oe(e,a){let o=new Map;for(let t of a){let n=o.get(t.cuentaDeCobroId)??[];n.push(t),o.set(t.cuentaDeCobroId,n)}return e.map(t=>{let n=(o.get(t.id)??[]).slice().sort((i,l)=>i.fecha.localeCompare(l.fecha)),s=n.reduce((i,l)=>i+h(l.monto),0),r=Ja(h(t.montoEsperado),s);return{cuenta:t,ingresos:n,recibido:s,pendiente:r==="completa"?0:Math.max(0,h(t.montoEsperado)-s),estado:r,ultimoPago:n.length?n[n.length-1].fecha:null}})}function Ve(e){return e.filter(a=>a.pendiente>0)}function he(e){return e.reduce((a,o)=>a+o.pendiente,0)}var ae=new Intl.NumberFormat("es-CO");function Ge(e){let a=`$${ae.format(e.cuenta.montoEsperado)}`,o=`$${ae.format(e.recibido)}`;switch(e.estado){case"sin_pagar":return`${e.cuenta.periodo}: sin pagar \xB7 te deben ${a}`;case"parcial":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 faltan $${ae.format(e.pendiente)}`;case"completa":return`${e.cuenta.periodo}: pagada completa (${o})`;case"pagaron_de_mas":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 $${ae.format(e.recibido-e.cuenta.montoEsperado)} de mas`}}function Ya(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function te(e,a,o){return Ya(a,(e-1)*o)}function C(e,a){let o=Math.max(1,a.diasOptimista);return{optimista:te(e,a.desde,o),pesimista:te(e,a.desde,Math.max(o,a.diasPesimista))}}function ve(e){return e.diasPesimista<=e.diasOptimista}var Xa=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function L(e){return`${Xa[e.getMonth()]} de ${e.getFullYear()}`}function ne(e){let a=L(e.optimista),o=L(e.pesimista);return a===o?a:`entre ${a} y ${o}`}function se(e){return new Map(e.map(a=>[a.id,Math.max(0,h(a.valor)-h(a.abonado??0))]))}function Wa(e){return e.baseCobro??(e.tipo==="porcentaje"?"cada_ingreso":"una_vez_por_cuenta")}function Ka(e,a,o){if(!o&&Wa(e)==="una_vez_por_cuenta")return!1;if(e.modo==="primer_pago")return a===1&&o;if(a<(e.desdePago??1))return!1;if(e.modo==="cada_pago")return!0;let t=e.supuesto??"siempre";return t==="nunca"?!1:t==="cada_dos_pagos"?a%2===1:!0}function Be(e,a,o){let t=e,n=0;for(let s of a??[]){let r=Math.max(1,Math.round(s.desdePago));o>=r&&r>=n&&(t=s.valor,n=r)}return t}function Za(e,a,o){let t=Be(e.valor,e.cambios,o);return e.tipo==="porcentaje"?ee(a,t):h(t)}function eo(e,a){return e.maximoPorPago&&e.maximoPorPago>0?h(e.maximoPorPago):e.enCuotas&&e.enCuotas>0?Math.max(1,Math.ceil(h(e.valor)/Math.round(e.enCuotas))):a}function z(e,a,o,t,n,s,r,i=!0){let l=h(a),d=[];for(let S of o){if(!Ka(S,e,i))continue;let y=Math.min(Za(S,a,e),l);y<=0||(d.push({nombre:S.nombre,monto:y}),l-=y)}let p=Be(t.base,t.cambios,e),m=Math.min(h(p),l);l-=m;let f=[],M=0;for(let S of n){let y=s.get(S.id)??0;if(y<=0||e<(S.desdePago??1))continue;let F=eo(S,y),A=Math.min(y,l,F);if(t.elastico&&A<y&&F>=y){let Z=Math.max(0,m-h(t.minimo)),be=y-A;be<=Z&&(m-=be,M+=be,A=y)}if(!(A<=0)&&(f.push({metaId:S.id,monto:A}),s.set(S.id,y-A),l-=Math.min(A,l),l<=0))break}let D=l;return{numero:e,ingreso:a,obligaciones:d,aColchon:m,recorteColchon:M,abonos:f,sobrante:D,saldoAhorro:r+m+D}}function Qe(e,a,o,t,n,s,r=!0){let i=e.cuentaDeCobroId===void 0||e.cuentaDeCobroId==="",l=z(a,h(e.monto),i?[]:o,i?{...t,base:0,minimo:0}:t,n,s,0,r),d=new Map(n.map(p=>[p.id,p]));return{id:`rep-${e.id}`,ingresoId:e.id,obligaciones:l.obligaciones.map(p=>({nombre:p.nombre,monto:p.monto})),abonos:l.abonos.map(p=>({nombre:d.get(p.metaId)?.nombre??"(meta borrada)",monto:p.monto,refId:p.metaId})),alAhorro:l.aColchon+l.sobrante,propuesto:!0}}function ao(e){let a=o=>o.reduce((t,n)=>t+h(n.monto),0);return a(e.obligaciones)+a(e.abonos)+a(e.gastos??[])+h(e.alAhorro)}function J(e,a){return h(a.monto)-ao(e)}var $e=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ue(e){return e.slice(0,7)}function k(e,a){let o=h(a.monto);if(o===0)return;let t=e.get(a.nombre);t?t.monto+=o:e.set(a.nombre,{...a,monto:o})}function Me(e,a){let o=new Map(a.map(n=>[n.ingresoId,n])),t=new Map;for(let n of e){let s=Ue(n.fecha),r=t.get(s);r||(r={mes:s,entro:0,deTrabajo:0,deFuera:0,aObligaciones:0,aMetas:0,enGastos:0,alAhorro:0,detalle:[],sinAsignar:0,_detalle:new Map},t.set(s,r));let i=h(n.monto);r.entro+=i,n.cuentaDeCobroId===void 0||n.cuentaDeCobroId===""?r.deFuera+=i:r.deTrabajo+=i;let d=o.get(n.id);if(!d){r.sinAsignar+=i;continue}for(let p of d.obligaciones)r.aObligaciones+=h(p.monto),k(r._detalle,p);for(let p of d.abonos)r.aMetas+=h(p.monto),k(r._detalle,p);for(let p of d.gastos??[])r.enGastos+=h(p.monto),k(r._detalle,p);r.alAhorro+=h(d.alAhorro),r.sinAsignar+=J(d,n)}return[...t.values()].map(({_detalle:n,...s})=>({...s,detalle:[...n.values()].sort((r,i)=>i.monto-r.monto)})).sort((n,s)=>n.mes.localeCompare(s.mes))}function Je(e){let a=new Map;for(let o of e)for(let t of[...o.obligaciones,...o.abonos,...o.gastos??[]])k(a,t);return[...a.values()].sort((o,t)=>t.monto-o.monto)}function re(e){let[a,o]=e.split("-"),t=Number(o)-1;return $e[t]?`${$e[t]} de ${a}`:e}function Ye(e,a,o,t=[]){let n=new Map,s=new Map,r=new Map(t.map(l=>[l.id,l.nombre])),i=l=>r.get(l)??l;for(let l of e){let d=te(l.numero,a,Math.max(1,o)),p=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,m=n.get(p);m||(m={mes:p,entro:0,aObligaciones:0,aMetas:0,alAhorro:0,detalle:[],pagos:[]},n.set(p,m),s.set(p,new Map));let f=s.get(p);m.pagos.push(l.numero),m.entro+=h(l.ingreso);for(let M of l.obligaciones)m.aObligaciones+=h(M.monto),k(f,{nombre:M.nombre,monto:M.monto});for(let M of l.abonos)m.aMetas+=h(M.monto),k(f,{nombre:i(M.metaId),monto:M.monto,refId:M.metaId});m.alAhorro+=h(l.aColchon)+h(l.sobrante)}return[...n.values()].map(l=>({...l,detalle:[...s.get(l.mes).values()].sort((d,p)=>p.monto-d.monto)})).sort((l,d)=>l.mes.localeCompare(d.mes))}function Xe(e,a){let o=new Set(a.map(t=>t.cuentaDeCobroId).filter(t=>!!t));return e.cuentaDeCobroId?o.has(e.cuentaDeCobroId)?o.size:o.size+1:Math.max(1,o.size)}function w(e){return(e??[]).filter(a=>h(a.monto)!==0)}function We(e,a){let o=new Set([...w(a.obligaciones),...w(a.abonos)].map(t=>t.nombre));return[...w(e.obligaciones),...w(e.abonos)].map(t=>t.nombre).filter(t=>!o.has(t))}function Ke(e,a,o,t=new Map){return[...new Set([...e.map(s=>s.mes),...a.map(s=>s.mes)])].sort().map(s=>{let r=e.find(p=>p.mes===s)??null,i=a.find(p=>p.mes===s)??null,l=s<o?"pasado":s===o?"actual":"futuro",d=t.get(s)??(r?{monto:r.entro,segun:"escenario"}:null);return{mes:s,estado:l,real:i,simulado:r,esperado:d,diferencia:l==="pasado"&&d&&i?i.entro-d.monto:null}})}function Ze(e){let a=0,o=0,t=0,n=0,s=0,r=0;for(let i of e)i.real&&(n+=1,a+=i.real.entro,o+=i.real.aObligaciones+i.real.aMetas+i.real.enGastos,t+=i.real.alAhorro),i.estado==="futuro"&&i.simulado&&(r+=1,s+=i.esperado?.monto??i.simulado.entro);return{mesesConDatos:n,entroDeVerdad:a,gastadoDeVerdad:o,guardadoDeVerdad:t,faltaPorEntrar:s,mesesQueFaltan:r}}var oo=new Map($e.map((e,a)=>[e,String(a+1).padStart(2,"0")]));function to(e,a){let o=e.toLowerCase().trim(),t=o.match(/^(\d{4})-(\d{2})/);if(t)return`${t[1]}-${t[2]}`;let n=o.match(/([a-záéíóú]+)\D+(\d{4})/);if(n){let r=oo.get(n[1]);if(r)return`${n[2]}-${r}`}let s=a.slice().sort((r,i)=>r.fecha.localeCompare(i.fecha))[0];return s?Ue(s.fecha):null}function ea(e,a,o,t){let n=new Map;for(let s of e){let r=a.filter(l=>l.cuentaDeCobroId!==void 0),i=to(s.periodo,r);i&&n.set(i,h(s.montoEsperado))}return new Map(t.map(s=>{let r=n.get(s);return[s,r!==void 0?{monto:r,segun:"cuenta_de_cobro"}:{monto:h(o),segun:"escenario"}]}))}function aa(e,a){let o=s=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=new Map(a.map(s=>[o(s.nombre),s])),n=[];for(let s of w(e.gastos)){let r=t.get(o(s.nombre));r&&n.push({gasto:s,metaId:r.id,metaNombre:r.nombre})}return n}function ie(e,a){let o=new Map;for(let t of a)for(let n of t.abonos)n.refId&&o.set(n.refId,(o.get(n.refId)??0)+h(n.monto));return new Map(e.map(t=>{let n=h(t.valor),s=h(t.abonado??0),r=o.get(t.id)??0,i=Math.min(s+r,n);return[t.id,{previo:s,real:r,total:i,falta:Math.max(0,n-i)}]}))}function oa(e,a){let o=ie(e,a);return e.map(t=>({...t,abonado:o.get(t.id).total}))}function ta(e,a){let o=0;for(let t of ie(e,a).values())o+=t.total;return o}var no=600;function Y(e){let a=se(e.metas),o=e.maxPagos??no,t=[],n=new Map,s=new Map,r=new Map,i=new Map,l=0,d=0;for(;d<o&&[...a.values()].some(m=>m>0);){d+=1;let m=z(d,h(e.ingresoEsperado),e.obligaciones,e.colchon,e.metas,a,l);l=m.saldoAhorro,t.push(m);for(let f of m.abonos)n.has(f.metaId)||n.set(f.metaId,d),r.set(f.metaId,(r.get(f.metaId)??0)+1),i.set(f.metaId,(i.get(f.metaId)??0)+f.monto),(a.get(f.metaId)??0)<=0&&s.set(f.metaId,d)}let p=e.metas.map(m=>{let f=Math.min(h(m.abonado??0),h(m.valor)),M=i.get(m.id)??0;return{metaId:m.id,nombre:m.nombre,grupo:m.grupo,valor:m.valor,pagoInicio:n.get(m.id)??null,pagoFin:s.get(m.id)??null,cantidadPagos:r.get(m.id)??0,totalAbonado:f+M,completada:(a.get(m.id)??0)<=0,yaEstabaPagada:f>=h(m.valor)}});return{escenario:e.nombre,pagos:t,metas:p,totalPagos:d,ahorroFinal:l,incompleta:d>=o&&p.some(m=>!m.completada)}}function na(e){let a=new Map;for(let o of e.metas){if(!o.grupo)continue;let t=a.get(o.grupo)??[];t.push(o),a.set(o.grupo,t)}return[...a.entries()].map(([o,t])=>{let n=t.map(i=>i.pagoInicio).filter(i=>i!==null),s=t.map(i=>i.pagoFin).filter(i=>i!==null),r=t.every(i=>i.completada);return{grupo:o,valor:t.reduce((i,l)=>i+l.valor,0),pagoInicio:n.length?Math.min(...n):null,pagoFin:r&&s.length?Math.max(...s):null,totalAbonado:t.reduce((i,l)=>i+l.totalAbonado,0),completado:r,yaEstabaPagado:t.every(i=>i.yaEstabaPagada)}})}function sa(e,a){return a.filter(t=>t.antesDelPago&&t.antesDelPago>0).map(t=>{let n=e.metas.find(i=>i.metaId===t.id),s=n?.pagoFin??null,r=n?.yaEstabaPagada?0:s;return{metaId:t.id,nombre:t.nombre,queria:Math.round(t.antesDelPago),termina:r,seRetrasa:r===null?null:Math.max(0,r-Math.round(t.antesDelPago))}})}function ra(e,a){let o=h(a);if(o<=0)return null;let t=Y(e),n=Y({...e,ingresoEsperado:h(e.ingresoEsperado)+o,maxPagos:1}),s=new Map(n.metas.map(l=>[l.metaId,l.totalAbonado])),i=1+Y({...e,metas:e.metas.map(l=>({...l,abonado:Math.max(h(l.abonado??0),s.get(l.id)??0)}))}).totalPagos;return{pendiente:o,pagosAhora:t.totalPagos,pagosSiPagan:i,seAdelanta:Math.max(0,t.totalPagos-i)}}function De(e,a,o){return new Date(e,a-1,o)}function ce(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function so(e){let a=e.getDay();return a===1?e:ce(e,(8-a)%7)}function ro(e){let a=e%19,o=Math.floor(e/100),t=e%100,n=Math.floor(o/4),s=o%4,r=Math.floor((o+8)/25),i=Math.floor((o-r+1)/3),l=(19*a+o-n-i+15)%30,d=Math.floor(t/4),p=t%4,m=(32+2*s+2*d-l-p)%7,f=Math.floor((a+11*l+22*m)/451),M=Math.floor((l+m-7*f+114)/31),D=(l+m-7*f+114)%31+1;return De(e,M,D)}function io(e){let a=ro(e),o=s=>ce(a,s),t=[[1,1,"A\xF1o Nuevo"],[5,1,"D\xEDa del Trabajo"],[7,20,"Independencia de Colombia"],[8,7,"Batalla de Boyac\xE1"],[12,8,"Inmaculada Concepci\xF3n"],[12,25,"Navidad"]],n=[[1,6,"Reyes Magos"],[3,19,"San Jos\xE9"],[6,29,"San Pedro y San Pablo"],[8,15,"Asunci\xF3n de la Virgen"],[10,12,"D\xEDa de la Raza"],[11,1,"Todos los Santos"],[11,11,"Independencia de Cartagena"]];return[...t.map(([s,r,i])=>({fecha:De(e,s,r),nombre:i})),...n.map(([s,r,i])=>({fecha:so(De(e,s,r)),nombre:i})),{fecha:o(-3),nombre:"Jueves Santo"},{fecha:o(-2),nombre:"Viernes Santo"},{fecha:o(43),nombre:"Ascensi\xF3n del Se\xF1or"},{fecha:o(64),nombre:"Corpus Christi"},{fecha:o(71),nombre:"Sagrado Coraz\xF3n de Jes\xFAs"}].sort((s,r)=>s.fecha.getTime()-r.fecha.getTime())}var X=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;function Ee(e){return io(e.getFullYear()).find(a=>X(a.fecha)===X(e))?.nombre??null}function co(e){return Ee(e)!==null}function ye(e){return e.getDay()===0}function ia(e){let a=new Date(e.getTime());for(let o=0;o<15&&(ye(a)||co(a));o++)a=ce(a,-1);return a}var ca=30,la="Febrero no tiene 30: se radica el \xFAltimo d\xEDa del mes (28, o 29 si es bisiesto), y si ese d\xEDa cae domingo o festivo se retrocede igual que siempre.";function lo(e,a){let o=new Date(e,a,0).getDate(),t=o<ca,n=new Date(e,a-1,Math.min(ca,o)),s=ia(n),r=null;if(X(s)!==X(n)){let i=Ee(n);r=i?`el ${n.getDate()} es festivo (${i})`:ye(n)?`el ${n.getDate()} cae domingo`:`el ${n.getDate()} no es d\xEDa h\xE1bil`}return{fecha:s,fechaOriginal:n,motivoDelCambio:r,usoUltimoDiaDelMes:t}}var xe=[{id:"cuenta",nombre:"Cuenta de cobro diligenciada",frecuencia:"cada_mes",detalle:"Con una descripci\xF3n del servicio prestado."},{id:"informe",nombre:"Informe de actividades",frecuencia:"cada_mes",detalle:"Detallando espec\xEDficamente las funciones o actividades realizadas."},{id:"conformidad",nombre:"Certificado de conformidad del servicio",frecuencia:"cada_mes",detalle:"Lo entrega el coordinador o l\xEDder del \xE1rea: hay que ped\xEDrselo con tiempo."},{id:"seguridad_social",nombre:"Planilla de seguridad social",frecuencia:"cada_mes",obligatorioExplicito:!0,detalle:"Liquidada del mes VENCIDO al que se est\xE1 cobrando. La circular la marca como obligatoria."},{id:"constancia",nombre:"Constancia de prestaci\xF3n de servicio firmada por el paciente",frecuencia:"solo_asistencial",detalle:"Solo personal asistencial. Como t\xE9cnico de sistemas, no aplica."},{id:"rut",nombre:"RUT actualizado",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez."},{id:"bancaria",nombre:"Certificaci\xF3n bancaria",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez, o si cambia de cuenta."}];function Se(){return xe.filter(e=>e.frecuencia==="cada_mes")}var uo=5;function po(e,a){let o=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),t=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return Math.round((t-o)/864e5)}var da=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function ua(e,a=[]){let o=lo(e.getFullYear(),e.getMonth()+1),t=po(e,o.fecha),n=t<0?"vencido":t===0?"hoy":t<=uo?"pronto":"tranquilo",s=o.fecha.getDate(),r=da[o.fecha.getMonth()],i=n==="vencido"?`Se pas\xF3 la fecha: hab\xEDa que radicar el ${s} de ${r}`:n==="hoy"?"HOY es el \xFAltimo d\xEDa para radicar la cuenta de cobro":n==="pronto"?`Faltan ${t} d\xEDas: radicas el ${s} de ${r}`:`La cuenta de cobro se radica el ${s} de ${r}`,l=Se().filter(d=>!a.includes(d.id)).map(d=>d.id);return{limite:o,diasQueFaltan:t,urgencia:n,titular:i,soportesPendientes:l}}function pa(e){let a=e.fecha.getDate(),o=da[e.fecha.getMonth()];return e.motivoDelCambio?`Se radica el ${a} de ${o}, no el ${e.fechaOriginal.getDate()}, porque ${e.motivoDelCambio}.`:`Se radica el ${a} de ${o}.`}function Pe(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function mo(){return new Date().toISOString().slice(0,10)}function go(){return[]}function O(){return{version:1,escenario:{nombre:"Mi escenario",ingresoEsperado:2e6,colchonBase:1e5,colchonMinimo:0,colchonElastico:!1,fechaPrimerPago:mo(),diasOptimista:30,diasPesimista:60},obligaciones:go(),metas:[],cuentas:[],ingresos:[],repartos:[],soportesMarcados:{}}}function j(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}var ma="gestiondinerotrabajo.estado";function ga(e){let a=O();if(typeof e!="object"||e===null)return a;let o=e;return{version:1,escenario:{...a.escenario,...o.escenario??{}},obligaciones:o.obligaciones??a.obligaciones,metas:o.metas??a.metas,cuentas:o.cuentas??a.cuentas,ingresos:o.ingresos??a.ingresos,repartos:o.repartos??a.repartos,soportesMarcados:o.soportesMarcados??a.soportesMarcados}}function ba(){let e=null;try{e=localStorage.getItem(ma)}catch{return{estado:O(),aviso:{texto:"No pude leer los datos guardados. Est\xE1s viendo un inicio en blanco.",grave:!0}}}if(!e)return{estado:O(),aviso:null};try{return{estado:ga(JSON.parse(e)),aviso:null}}catch{return{estado:O(),aviso:{texto:"Los datos guardados est\xE1n da\xF1ados. No los borr\xE9: sigue ah\xED el archivo por si se puede recuperar.",grave:!0}}}}function le(e){try{return localStorage.setItem(ma,JSON.stringify(e)),null}catch(a){return a instanceof Error?a.message:"no se pudo guardar"}}function fa(e){return JSON.stringify(e,null,2)}function Re(e){try{return{estado:ga(JSON.parse(e)),aviso:null}}catch{return{estado:null,aviso:{texto:"Ese archivo no es un respaldo v\xE1lido. No cambi\xE9 nada de lo que ten\xEDas.",grave:!0}}}}var Ce=null;function H(e){return Ce?.(),new Promise(a=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${de(e.titulo)}</h3>
        ${e.detalle?`<p class="dlg-detalle">${de(e.detalle)}</p>`:""}
        <input class="dlg-campo" type="text" ${e.dinero?'inputmode="numeric" data-dinero':""}
               value="${de(e.valorInicial??"")}" />
        <div class="dlg-botones">
          <button class="dlg-cancelar">Cancelar</button>
          <button class="primario dlg-aceptar">${de(e.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=o.querySelector(".dlg-campo"),n=i=>{document.removeEventListener("keydown",r,!0),o.remove(),Ce=null,a(i)},s=()=>n(t.value);function r(i){i.key==="Escape"&&(i.preventDefault(),n(null)),i.key==="Enter"&&document.activeElement===t&&(i.preventDefault(),s())}o.querySelector(".dlg-aceptar").addEventListener("click",s),o.querySelector(".dlg-cancelar").addEventListener("click",()=>n(null)),o.addEventListener("mousedown",i=>{i.target===o&&n(null)}),document.addEventListener("keydown",r,!0),document.body.appendChild(o),Ce=()=>n(null),t.focus(),t.select()})}function de(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var ha=new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});function Ie(e){return e.replace(/\D/g,"")}function fo(e){let a=Ie(e);if(a==="")return"";let o=a.replace(/^0+(?=\d)/,"");return ha.format(Number(o))}function P(e){let a=Ie(e);return a===""?0:Number(a)}function x(e){return ha.format(Math.round(e))}function va(e){let a=e.value,o=e.selectionStart??a.length,t=Ie(a.slice(0,o)).length,n=fo(a);if(n===a)return;e.value=n;let s=0,r=0;for(;r<n.length&&s<t;)/\d/.test(n[r])&&s++,r++;e.setSelectionRange(r,r)}function $a(e,a){let o=[],t=0;for(let n of a){let s=Math.max(1,Math.round(n)||1),r=e[t];o.push(s>1||!r?null:r),t+=s}return o}var ho=4;function Ma(e){return e.length>=ho}var V="__borrado";function ue(e,a){return e[a]??""}function Ae(e,a){return JSON.stringify(e??null)===JSON.stringify(a??null)}function Da(e,a,o,t){return e!==o?e>o:JSON.stringify(a??null)>=JSON.stringify(t??null)}function Ea(e,a,o,t={}){let n={...t},s=new Set([...Object.keys(e??{}),...Object.keys(a)]);for(let r of s){if(r==="id")continue;let i=e===null?void 0:e[r],l=a[r];Ae(i,l)||(n[r]=o)}return n}function vo(e,a){if(e.datos.id!==a.datos.id)throw new Error(`No se pueden fusionar dos filas distintas: ${e.datos.id} y ${a.datos.id}.`);let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t={id:e.datos.id},n={},s=[];for(let m of o){if(m==="id")continue;let f=e.datos[m],M=a.datos[m],D=ue(e.tocado,m),S=ue(a.tocado,m),y=Da(D,f,S,M),F=y?f:M,A=y?M:f;F!==void 0&&(t[m]=F);let Z=D>S?D:S;Z!==""&&(n[m]=Z),Ae(f,M)||s.push({id:e.datos.id,campo:m,valor:A,cuando:y?S:D,gano:F})}let r=ue(e.tocado,V),i=ue(a.tocado,V),l=Da(r,e.borradoEn,i,a.borradoEn),d=l?e.borradoEn:a.borradoEn,p=r>i?r:i;return p!==""&&(n[V]=p),Ae(e.borradoEn,a.borradoEn)||s.push({id:e.datos.id,campo:V,valor:l?a.borradoEn:e.borradoEn,cuando:l?i:r,gano:d}),{fila:{datos:t,tocado:n,borradoEn:d??null},descartes:s}}function ya(e,a){let o=new Map(a.map(s=>[s.datos.id,s])),t=[],n=[];for(let s of e){let r=o.get(s.datos.id);if(!r){t.push(s);continue}let i=vo(s,r);t.push(i.fila),n.push(...i.descartes),o.delete(s.datos.id)}for(let s of a)o.has(s.datos.id)&&t.push(s);return{filas:t,descartes:n}}var Le=["escenario","obligaciones","metas","cuentas","ingresos","repartos","soportes"],$o="escenario";function _(e,a){return{datos:{...a,id:e},tocado:{},borradoEn:null}}function xa(e){return{escenario:[_($o,{...e.escenario})],obligaciones:e.obligaciones.map(a=>_(a.id,{...a})),metas:e.metas.map(a=>_(a.id,{...a})),cuentas:e.cuentas.map(a=>_(a.id,{...a})),ingresos:e.ingresos.map(a=>_(a.id,{...a})),repartos:e.repartos.map(a=>_(a.id,{...a})),soportes:Object.entries(e.soportesMarcados).map(([a,o])=>_(a,{marcados:o}))}}function Sa(e,a){let o=r=>(e[r]??[]).filter(i=>i.borradoEn===null),t=r=>e[r]!==void 0&&e[r].length>0,n=t("escenario")?{...a.escenario,...o("escenario")[0]?.datos}:a.escenario;n&&"id"in n&&delete n.id;let s={};for(let r of o("soportes")){let i=r.datos.marcados;s[r.datos.id]=Array.isArray(i)?i:[]}return{version:a.version,escenario:n,obligaciones:t("obligaciones")?o("obligaciones").map(r=>r.datos):a.obligaciones,metas:t("metas")?o("metas").map(r=>r.datos):a.metas,cuentas:t("cuentas")?o("cuentas").map(r=>r.datos):a.cuentas,ingresos:t("ingresos")?o("ingresos").map(r=>r.datos):a.ingresos,repartos:t("repartos")?o("repartos").map(r=>r.datos):a.repartos,soportesMarcados:t("soportes")?s:a.soportesMarcados}}function Pa(e){return{id:e.datos.id,datos:e.datos,tocado:e.tocado,borrado_en:e.borradoEn}}function Ra(e){let a=e.datos??{};return{datos:{...a,id:String(e.id??a.id??"")},tocado:e.tocado??{},borradoEn:e.borrado_en??null}}function Ca(e,a,o,t={}){let n=xa(e),s=a?xa(a):null,r={};for(let i of Le){let l=new Map((s?.[i]??[]).map(f=>[f.datos.id,f])),d=t[i]??new Map,p=n[i].map(f=>({...f,tocado:Ea(l.get(f.datos.id)?.datos??null,f.datos,o,d.get(f.datos.id)??{})})),m=new Set(n[i].map(f=>f.datos.id));for(let[f,M]of l)m.has(f)||p.push({datos:M.datos,tocado:{...d.get(f)??{},[V]:o},borradoEn:o});r[i]=p}return r}var N={url:"https://voncmkjcxzgxfloehovb.supabase.co",clave:"sb_publishable_Ev68VoFXNXqvcVOjgXoknw_vAFK-iHn"},Te="gestiondinerotrabajo.sesion",qe="gestiondinerotrabajo.ultimaSincronizacion";function we(){try{let e=localStorage.getItem(Te);return e?JSON.parse(e):null}catch{return null}}function Oe(e){try{e?localStorage.setItem(Te,JSON.stringify(e)):localStorage.removeItem(Te)}catch{}}function je(){Oe(null);try{localStorage.removeItem(qe)}catch{}}async function Ia(e,a){let o=await fetch(`${N.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:N.clave,"Content-Type":"application/json"},body:JSON.stringify({email:e.trim(),password:a})}),t=await o.json().catch(()=>({}));if(!o.ok)throw new Error(Mo(o.status,t));let n={token:t.access_token,refresco:t.refresh_token,usuarioId:t.user?.id??"",correo:t.user?.email??e.trim(),caduca:Date.now()+(Number(t.expires_in)||3600)*1e3};if(!n.token||!n.usuarioId)throw new Error("Supabase respondi\xF3 sin sesi\xF3n. Revisa la direcci\xF3n del proyecto.");return Oe(n),n}function Mo(e,a){let o=String(a.error_description??a.msg??a.message??"");return e===400&&/invalid login|credentials/i.test(o)?"Correo o contrase\xF1a incorrectos.":e===400&&/email not confirmed/i.test(o)?"Falta confirmar el correo: mira el mensaje que te mand\xF3 Supabase.":e===422?"Ese correo no tiene un formato v\xE1lido.":e===429?"Demasiados intentos seguidos. Espera un momento.":o||`No se pudo entrar (error ${e}).`}async function Do(){let e=we();if(!e)throw new Error("No has entrado con tu correo.");if(Date.now()<e.caduca-6e4)return e;let a=await fetch(`${N.url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:N.clave,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e.refresco})});if(!a.ok)throw je(),new Error("La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.");let o=await a.json(),t={...e,token:o.access_token,refresco:o.refresh_token??e.refresco,caduca:Date.now()+(Number(o.expires_in)||3600)*1e3};return Oe(t),t}function Aa(e){return{apikey:N.clave,Authorization:`Bearer ${e.token}`,"Content-Type":"application/json"}}async function Eo(e,a,o){let t=o?`&actualizado_en=gt.${encodeURIComponent(o)}`:"",n=await fetch(`${N.url}/rest/v1/${a}?select=*${t}`,{headers:Aa(e)});if(!n.ok)throw new Error(await La(n,a,"bajar"));return(await n.json()).map(Ra)}async function yo(e,a,o){if(o.length===0)return;let t=o.map(s=>({...Pa(s),usuario_id:e.usuarioId})),n=await fetch(`${N.url}/rest/v1/${a}?on_conflict=usuario_id,id`,{method:"POST",headers:{...Aa(e),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(t)});if(!n.ok)throw new Error(await La(n,a,"subir"))}async function La(e,a,o){let t=await e.text().catch(()=>"");return e.status===401?"La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.":e.status===404||/does not exist/i.test(t)?`Falta la tabla \xAB${a}\xBB en Supabase: ejecuta supabase/esquema.sql.`:e.status===403||/permission denied/i.test(t)?`Sin permiso sobre \xAB${a}\xBB. Revisa los grants del esquema.`:`No se pudo ${o} \xAB${a}\xBB (error ${e.status}).`}async function Ta(e,a,o){let t=await Do(),n=_e(),s=Ca(e,a,o),r={},i=[];for(let d of Le){let p=s[d],m=await Eo(t,d,n),f=ya(p,m);r[d]=f.filas,i.push(...f.descartes);let M=new Set(p.filter(D=>Object.keys(D.tocado).length>0).map(D=>D.datos.id));for(let D of f.descartes)M.add(D.id);await yo(t,d,f.filas.filter(D=>M.has(D.datos.id)))}let l=new Date().toISOString();try{localStorage.setItem(qe,l)}catch{}return{estado:Sa(r,e),descartes:i,cuando:l}}function _e(){try{return localStorage.getItem(qe)}catch{return null}}var xo=new Intl.NumberFormat("es-CO"),u=e=>`$${xo.format(Math.round(e))}`,c,$=null;function B(e=new Date){let a=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${a}-${o}`}function g(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var b=new Map;function Oa(e){if(!(e instanceof HTMLInputElement)&&!(e instanceof HTMLSelectElement))return null;let a=[e.id&&`#${e.id}`,e.dataset.accion&&`[data-accion="${e.dataset.accion}"]`,e.dataset.id&&`[data-id="${e.dataset.id}"]`,e.dataset.campo&&`[data-campo="${e.dataset.campo}"]`,e.dataset.tipo&&`[data-tipo="${e.dataset.tipo}"]`,e.dataset.i!==void 0&&`[data-i="${e.dataset.i}"]`].filter(Boolean);return a.length>0?a.join(""):null}var pe=null,Fe=null,K=!1,G=!1,q=null;document.addEventListener("mousedown",e=>{let o=e.target?.closest?.(".asa")?.closest("tr");o&&(o.draggable=!0)},!0);document.addEventListener("dragstart",e=>{let a=e.target?.closest?.("tr[data-fila]");a&&(q=Number(a.dataset.fila),a.classList.add("arrastrando"),e.dataTransfer&&(e.dataTransfer.effectAllowed="move"))});document.addEventListener("dragover",e=>{if(q===null)return;let a=e.target?.closest?.("tr[data-fila]");if(a){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");for(let o of document.querySelectorAll(".destino"))o.classList.remove("destino");Number(a.dataset.fila)!==q&&a.classList.add("destino")}});document.addEventListener("drop",e=>{let a=e.target?.closest?.("tr[data-fila]");if(q===null||!a)return;e.preventDefault();let o=Number(a.dataset.fila),t=q;if(q=null,t===o)return E();let[n]=c.metas.splice(t,1);c.metas.splice(o,0,n),$={texto:`\xAB${n.nombre}\xBB qued\xF3 en la posici\xF3n ${o+1}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron.`,malo:!1},v()});document.addEventListener("dragend",()=>{q!==null&&(q=null,E())});document.addEventListener("mousedown",e=>{let a=e.target;K=a?.closest("button[data-accion]")!==null&&a?.closest("button[data-accion]")!==void 0,pe=Oa(a?.closest("input, select")??null),Fe=a?.closest?.("[data-panel]")?.dataset.panel??null},!0);document.addEventListener("mouseup",()=>{setTimeout(()=>{K=!1,Fe=null,G&&(G=!1,ke())},0)},!0);function So(e,a){let o=pe!==null,t=pe??e;if(pe=null,!t)return;let n=document.querySelector(t);if(n&&(n.focus(),!o&&a!==null&&typeof n.setSelectionRange=="function"))try{n.setSelectionRange(a,a)}catch{}}function I(){ja()||ke()}function v(){ja()||E()}function ja(){let e=le(c);return e&&($={texto:`No pude guardar: ${e}`,malo:!0}),K?(G=!0,!0):!1}function R(){let e=c.escenario;return{desde:new Date(`${e.fechaPrimerPago}T12:00:00`),diasOptimista:e.diasOptimista,diasPesimista:e.diasPesimista}}function _a(){let e=c.escenario;return{nombre:e.nombre,ingresoEsperado:e.ingresoEsperado,obligaciones:c.obligaciones,colchon:{nombre:"Otros / Ahorro",base:e.colchonBase,minimo:e.colchonMinimo,elastico:e.colchonElastico,cambios:e.cambiosColchon},metas:oa(c.metas,c.repartos)}}function Po(){return`${(c.escenario.cambiosColchon??[]).map((a,o)=>{let t=L(C(Math.max(1,a.desdePago),R()).optimista);return`<div class="cambio">
      <span class="rango">desde el</span>
      <input type="number" min="1" step="1" value="${a.desdePago}" class="corto"
        data-accion="cambio-ahorro" data-i="${o}" data-campo="desdePago" />
      <input type="text" inputmode="numeric" data-dinero value="${x(a.valor)}"
        class="corto-dinero" data-accion="cambio-ahorro" data-i="${o}" data-campo="valor" />
      <span class="rango">${g(t)}</span>
      <button class="icono" data-accion="borrar-cambio-ahorro" data-i="${o}" title="Quitar">\u2715</button>
    </div>`}).join("")}<button class="chico" data-accion="nuevo-cambio-ahorro">+ cambio</button>`}function Ro(){let e=c.escenario;return`
  <section class="panel">
    <h2>Escenario <span class="sufijo">\u2014 el supuesto sobre lo que va a entrar</span></h2>
    <div class="campos">
      <div class="campo">
        <label for="ingreso">Lo que espero por pago</label>
        <input id="ingreso" type="text" inputmode="numeric" data-dinero
               value="${x(e.ingresoEsperado)}"
               data-accion="escenario" data-campo="ingresoEsperado" />
      </div>
      <div class="campo">
        <label for="colchon">Otros / Ahorro por pago</label>
        <input id="colchon" type="text" inputmode="numeric" data-dinero
               value="${x(e.colchonBase)}"
               data-accion="escenario" data-campo="colchonBase" />
      </div>
      <div class="campo">
        <label for="minimo">Del ahorro no bajar de</label>
        <input id="minimo" type="text" inputmode="numeric" data-dinero
               value="${x(e.colchonMinimo)}"
               title="Solo aplica con el interruptor de abajo encendido"
               data-accion="escenario" data-campo="colchonMinimo" />
      </div>
      <div class="campo">
        <label>El ahorro cambia</label>
        ${Po()}
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
      Con ${e.diasPesimista} d\xEDas, el pago ${ve(R())?10:12} caer\xEDa
      ${(()=>{let a=R();return`<strong>${Math.round(11*(e.diasPesimista-e.diasOptimista)/30)} meses</strong> m\xE1s tarde que si fueran puntuales`})()}.
    </p>`:""}
  </section>`}var Co={cada_pago:"Cada pago",primer_pago:"Solo el primer pago",puntual:"Puntual: cuando yo la marque"},Na={siempre:"asumo que la pago siempre",cada_dos_pagos:"asumo un pago s\xED y otro no",nunca:"asumo que no la pago"};function Fa(e,a,o){let t=e??1,n=L(C(t,R()).optimista);return`<input type="number" min="1" step="1" value="${t}" class="corto"
             data-accion="${a}" data-id="${o}" data-campo="desdePago" />
          <span class="rango mes-de-pago">${t<=1?"desde el primero":g(n)}</span>`}function za(){let e=c.cuentas.filter(a=>a.montoEsperado>0);if(e.length>0){let a=e.reduce((o,t)=>t.periodo.localeCompare(o.periodo)>0?t:o);return{monto:a.montoEsperado,de:a.periodo,esReal:!0}}return{monto:c.escenario.ingresoEsperado,de:"lo que esperas por pago",esReal:!1}}function Io(e){let a=za();if(a.monto<=0)return'<span class="rango">\u2014</span>';let o=e.tipo==="porcentaje"?ee(a.monto,e.valor):e.valor;return`<span class="calculado">${u(o)}</span>`}function Ao(e){let a=e.cambios??[];if(a.length===0)return"";let o=e.tipo==="porcentaje",t=(n,s)=>{let r=L(C(Math.max(1,n.desdePago),R()).optimista);return`<span class="cambio">
      <span class="rango">desde el pago</span>
      <input type="number" min="1" step="1" value="${n.desdePago}" class="corto"
        data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="desdePago" />
      <span class="rango">(${g(r)}) pasa a</span>
      ${o?`<input type="number" min="0" max="100" step="0.5" value="${n.valor*100}" class="corto"
             data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" /><span class="rango">%</span>`:`<input type="text" inputmode="numeric" data-dinero value="${x(n.valor)}"
             class="corto-dinero" data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" />`}
      <button class="icono" data-accion="borrar-cambio" data-id="${e.id}" data-i="${s}"
        title="Quitar este cambio">\u2715</button>
    </span>`};return`<tr class="fila-cambios">
    <td colspan="9"><span class="rango">${g(e.nombre)} \xB7</span>
      ${a.map(t).join("")}</td>
  </tr>`}function Lo(e){let a=e.modo==="puntual";return`
  <tr>
    <td><input class="ancho" value="${g(e.nombre)}" data-accion="oblig" data-id="${e.id}" data-campo="nombre" /></td>
    <td><input value="${g(e.grupo??"")}" placeholder="ninguno"
        data-accion="oblig" data-id="${e.id}" data-campo="grupo" /></td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="tipo">
        <option value="porcentaje" ${e.tipo==="porcentaje"?"selected":""}>% del ingreso</option>
        <option value="fijo" ${e.tipo==="fijo"?"selected":""}>Monto fijo</option>
      </select>
    </td>
    <td class="num">
      ${e.tipo==="porcentaje"?`<input type="number" step="0.5" min="0" max="100" value="${e.valor*100}"
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`:`<input type="text" inputmode="numeric" data-dinero value="${x(e.valor)}"
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`}
      <button class="chico" data-accion="nuevo-cambio" data-id="${e.id}"
        title="A partir de cierto pago, esto pasa a valer otra cosa">+ cambio</button>
    </td>
    <td class="num">${Io(e)}</td>
    <td class="desde">${Fa(e.desdePago,"oblig",e.id)}</td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="modo">
        ${Object.entries(Co).map(([o,t])=>`<option value="${o}" ${e.modo===o?"selected":""}>${t}</option>`).join("")}
      </select>
    </td>
    <td>
      ${a?`<select data-accion="oblig" data-id="${e.id}" data-campo="supuesto">
        ${Object.entries(Na).map(([o,t])=>`<option value="${o}" ${(e.supuesto??"siempre")===o?"selected":""}>${t}</option>`).join("")}
      </select>`:'<span class="rango">\u2014</span>'}
    </td>
    <td class="num"><button class="icono" data-accion="borrar-oblig" data-id="${e.id}" title="Quitar">\u2715</button></td>
  </tr>`}function To(){let e=za();if(e.monto<=0)return"";let a=r=>z(r,e.monto,c.obligaciones,{nombre:"",base:0,minimo:0,elastico:!1},[],new Map,0).obligaciones.reduce((l,d)=>l+d.monto,0),o=a(1),t=a(2),n=(r,i)=>`
    <div><span class="rotulo">${r}</span>
      <span class="valor">${u(e.monto-i)}</span>
      <span class="rotulo">libre para metas \xB7 se van ${u(i)}</span></div>`,s=e.esReal?`Calculado sobre <strong>${g(e.de)}</strong>: ${u(e.monto)}, que es lo que
       esperas cobrar de verdad. Si no hubiera cuenta de cobro registrada, saldr\xEDa del
       escenario de arriba.`:`Calculado sobre el escenario de arriba (${u(e.monto)}), que es una <em>suposici\xF3n</em>.
       En cuanto registres una cuenta de cobro, esta cifra sale de ah\xED.`;return`<div class="resumen resumen-oblig">
    ${n("En el primer pago",o)}
    ${o!==t?n("En los siguientes",t):""}
  </div>
  <p class="nota ${e.esReal?"":"aviso"}">${s}</p>`}function qo(){let e=c.obligaciones.filter(a=>a.modo==="puntual");return c.obligaciones.length===0?`
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
        <tbody>${c.obligaciones.map(a=>Lo(a)+Ao(a)).join("")}</tbody>
      </table>
    </div>
    ${To()}
    <p class="nota"><button data-accion="nueva-oblig">+ Agregar obligaci\xF3n</button>
      ${ka("obligaciones")}</p>
    ${e.length?`<p class="nota aviso">
      Las puntuales no se pueden adivinar. Para calcular las fechas
      ${e.map(a=>`<strong>${g(a.nombre)}</strong>: ${Na[a.supuesto??"siempre"]}`).join(" \xB7 ")}.
    </p>`:""}
  </section>`}function wo(e){if(!e.compra)return`<button data-accion="comprada" data-id="${e.id}">Ya la compr\xE9</button>`;let a=e.compra.precioReal-e.valor;return`<span class="completa">${g(re(e.compra.mes))}</span>
    <span class="rango">${u(e.compra.precioReal)}${a===0?"":a<0?` \xB7 ${u(-a)} menos`:` \xB7 ${u(a)} m\xE1s`}</span>
    <button class="icono" data-accion="no-comprada" data-id="${e.id}" title="No la compr\xE9">\u2715</button>`}function Oo(e){let a=ie(c.metas,c.repartos).get(e.id),o=a.previo>0&&a.real>0&&Math.abs(a.previo-a.real)<=Math.max(1e3,a.real*.05),t=`<input type="text" inputmode="numeric" data-dinero value="${x(a.previo)}"
      title="Lo que ya ten\xEDas pagado antes de usar el programa"
      data-accion="meta" data-id="${e.id}" data-campo="abonado" />`;return a.real===0?t:`${t}
    <span class="rango">+ ${u(a.real)} de lo real</span>
    <span class="${a.falta===0?"completa":""}">= ${u(a.total)}</span>
    ${o?`<span class="aviso">\u26A0\uFE0F ${u(a.previo)} escrito a mano y ${u(a.real)}
      registrado: \xBFes el mismo dinero?
      <button class="icono" data-accion="quitar-previo" data-id="${e.id}"
        title="S\xED, dejar solo lo registrado">\u2713</button></span>`:""}`}function ka(e){if((e==="metas"?c.metas.length:c.obligaciones.length)<2)return"";let o=e==="metas"?' title="Ojo: en las metas el orden es la prioridad de pago, as\xED que esto cambia el plan"':"";return`&nbsp; <span class="rango">Ordenar por</span>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="nombre"${o}>nombre</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="valor"${o}>valor</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="grupo"${o}>grupo</button>`}function jo(e,a,o){return`
  <tr draggable="false" data-fila="${a}">
    <td class="orden">
      <span class="asa" title="Arrastra para moverla de sitio">\u283F</span>
      <button class="icono" data-accion="subir" data-i="${a}" ${a===0?"disabled":""} title="Subir">\u2191</button>
      <button class="icono" data-accion="bajar" data-i="${a}" ${a===o-1?"disabled":""} title="Bajar">\u2193</button>
    </td>
    <td><input class="ancho" value="${g(e.nombre)}" data-accion="meta" data-id="${e.id}" data-campo="nombre" /></td>
    <td class="num"><input type="text" inputmode="numeric" data-dinero value="${x(e.valor)}"
        data-accion="meta" data-id="${e.id}" data-campo="valor" /></td>
    <td><input value="${g(e.grupo??"")}" placeholder="ninguno"
        data-accion="meta" data-id="${e.id}" data-campo="grupo" /></td>
    <td class="desde">${Fa(e.desdePago,"meta",e.id)}
      <div class="plazo"><span class="rango">la quiero antes del</span>
        <input type="number" min="0" step="1" class="corto" value="${e.antesDelPago??""}"
          placeholder="\u2014" title="Solo para avisarte: no cambia el orden de pago"
          data-accion="meta" data-id="${e.id}" data-campo="antesDelPago" />
        ${e.antesDelPago&&e.antesDelPago>0?`<span class="rango">${g(L(C(e.antesDelPago,R()).optimista))}</span>`:""}</div>
    </td>
    <td class="num ritmo">
      <input type="text" inputmode="numeric" data-dinero
        value="${e.maximoPorPago?x(e.maximoPorPago):""}" placeholder="sin tope"
        title="M\xE1ximo que puede recibir en un pago"
        data-accion="meta" data-id="${e.id}" data-campo="maximoPorPago" />
      <span class="rango">o en <input type="number" min="0" step="1" class="corto"
        value="${e.enCuotas??""}" placeholder="\u2014"
        title="Reunirla en tantos pagos: la cuota la calculo yo"
        data-accion="meta" data-id="${e.id}" data-campo="enCuotas" /> pagos
        ${e.enCuotas&&e.enCuotas>0&&!e.maximoPorPago?`\xB7 ${u(Math.ceil(e.valor/Math.round(e.enCuotas)))} c/u`:""}</span>
    </td>
    <td class="num pagado">${Oo(e)}</td>
    <td class="compra">${wo(e)}</td>
    <td class="num">
      <button class="icono" data-accion="duplicar-meta" data-id="${e.id}" title="Duplicar">\u29C9</button>
      <button class="icono" data-accion="borrar-meta" data-id="${e.id}" title="Quitar">\u2715</button>
    </td>
  </tr>`}function _o(){if(c.metas.length===0)return`
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
        <tbody>${c.metas.map((a,o)=>jo(a,o,c.metas.length)).join("")}</tbody>
      </table>
    </div>
    <p class="nota">
      <button data-accion="nueva-meta">+ Agregar meta</button>
      ${ka("metas")}
      &nbsp; Suma de todas: <strong>${u(e)}</strong>
      ${(()=>{let a=ta(c.metas,c.repartos);return a===0?"":` &nbsp; Llevas pagado: <strong class="completa">${u(a)}</strong>
          <span class="rango">\xB7 te faltan ${u(Math.max(0,e-a))}</span>`})()}
      ${c.metas.length>1?`<br /><span class="rango">
        <strong>Ritmo de pago</strong>: para reunir para dos cosas a la vez. Pon un
        <strong>tope</strong> en pesos, o di <strong>en cu\xE1ntos pagos</strong> la quieres reunir
        y yo calculo la cuota. Si pones los dos, manda el tope. Lo que no pase baja a la meta
        siguiente; en blanco, esa meta se lleva todo lo que haya.</span>`:""}
    </p>
  </section>`}var No={tranquilo:"",pronto:"aviso",hoy:"urgente",vencido:"malo"};function Fo(){let e=new Date,a=c.soportesMarcados[Pe(e)]??[],o=ua(e,a),t=No[o.urgencia],n=r=>{let i=a.includes(r.id);return`<li class="soporte ${i?"listo":""}">
      <label class="interruptor">
        <input type="checkbox" data-accion="soporte" data-id="${r.id}" ${i?"checked":""} />
        <span>${g(r.nombre)}${r.obligatorioExplicito?' <strong class="pendiente">OBLIGATORIO</strong>':""}</span>
      </label>
      ${r.detalle?`<p class="nota">${g(r.detalle)}</p>`:""}
    </li>`},s=xe.filter(r=>r.frecuencia!=="cada_mes");return`
  <section class="panel radicacion ${t}">
    <h2><span class="etiqueta real">Real</span> Radicar la cuenta de cobro
      <span class="sufijo">\u2014 qu\xE9 d\xEDa y con qu\xE9 papeles</span></h2>
    <p class="titular ${t}">${g(o.titular)}</p>
    <p class="nota">${g(pa(o.limite))}
      ${o.limite.usoUltimoDiaDelMes?`<br /><span class="rango">${g(la)}</span>`:""}
    </p>
    <ul class="soportes">${Se().map(n).join("")}</ul>
    <p class="nota">
      Ya entregados una sola vez y no hay que repetirlos:
      ${s.filter(r=>r.frecuencia==="una_sola_vez").map(r=>g(r.nombre)).join(" \xB7 ")}.
      La constancia firmada por el paciente es solo para personal asistencial.
    </p>
  </section>`}function zo(){let e=oe(c.cuentas,c.ingresos),a=Ve(e);return`
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
              <td><input class="ancho" value="${g(o.cuenta.periodo)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="periodo" /></td>
              <td class="num"><input type="text" inputmode="numeric" data-dinero value="${x(o.cuenta.montoEsperado)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="montoEsperado" /></td>
              <td class="num">${u(o.recibido)}</td>
              <td class="num ${o.pendiente>0?"pendiente":"completa"}">
                ${o.pendiente>0?u(o.pendiente):"\u2014"}</td>
              <td class="rango">${g(Ge(o).split(": ").slice(1).join(": "))}</td>
              <td class="num">
                <button data-accion="abonar" data-id="${o.cuenta.id}">+ Registrar pago</button>
                <button class="icono" data-accion="borrar-cuenta" data-id="${o.cuenta.id}">\u2715</button>
              </td>
            </tr>
            ${o.ingresos.map(t=>`<tr class="componente">
              <td>${g(t.fecha)}</td><td class="num"></td><td class="num">${u(t.monto)}</td>
              <td colspan="2" class="rango">pago recibido</td>
              <td class="num"><button class="icono" data-accion="borrar-ingreso" data-id="${t.id}">\u2715</button></td>
            </tr>`).join("")}`).join("")}
          </tbody>
        </table></div>
        <p class="nota"><button data-accion="nueva-cuenta">+ Registrar otra cuenta</button>
        ${a.length?` &nbsp; <span class="pendiente">Te deben en total ${u(he(e))}</span>`:""}</p>`}
  </section>`}function qa(e,a,o,t,n,s,r,i,l=""){let d=R(),p=o===null||t===null?"\u2014":`pago ${o}${t!==o?` - ${t}`:""}${n===null?"":` (${n})`}`,m=t!==null?ne(C(t,d)):i?"ya la ten\xEDas pagada":"sin terminar",f=r?`<span class="completa">${u(a)}</span>`:`<span class="pendiente">${u(s)} de ${u(a)}</span>`;return`<tr class="${l}">
    <td class="meta-nombre">${g(e)}</td>
    <td class="num">${f}</td>
    <td class="rango">${p}</td>
    <td class="cuando">${g(m)}</td>
  </tr>`}function ko(){if(c.metas.length===0)return null;try{return Y(_a())}catch{return null}}function Ho(e){if(c.metas.length===0)return`<section class="panel simulado">
      <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
      <div class="vacio">Agrega tus metas arriba y aqu\xED aparecen las fechas.</div>
    </section>`;if(!e)return`<section class="panel simulado"><h2>Simulaci\xF3n</h2>
      <p class="nota aviso">No pude calcular la proyecci\xF3n con estos datos.</p></section>`;let a=new Map(na(e).map(d=>[d.grupo,d])),o=[],t=new Set,n=(d,p="")=>qa(d.nombre,d.valor,d.pagoInicio,d.pagoFin,d.cantidadPagos,d.totalAbonado,d.completada,d.yaEstabaPagada,p);for(let d of e.metas){if(!d.grupo){o.push(n(d));continue}if(t.has(d.grupo))continue;t.add(d.grupo);let p=a.get(d.grupo);o.push(qa(p.grupo,p.valor,p.pagoInicio,p.pagoFin,null,p.totalAbonado,p.completado,p.yaEstabaPagado,"grupo"));for(let m of e.metas)m.grupo===d.grupo&&o.push(n(m,"componente"))}let s=e.pagos.length,r=c.escenario,i=R(),l=ne(C(s,i));return`
  <section class="panel simulado">
    <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
    <div class="resumen">
      <div><span class="valor">${e.totalPagos}</span><span class="rotulo">pagos hasta terminarlo todo</span></div>
      <div><span class="valor cuando">${g(l)}</span><span class="rotulo">termina la \xFAltima meta</span></div>
      <div><span class="valor">${u(e.ahorroFinal)}</span><span class="rotulo">ahorro acumulado al final</span></div>
    </div>
    <div class="tabla-ancha">
      <table>
        <thead><tr><th>Meta</th><th class="num">Abonado</th><th>Pagos</th><th>Cu\xE1ndo</th></tr></thead>
        <tbody>${o.join("")}</tbody>
      </table>
    </div>
    <p class="nota aviso">
      Esto es una simulaci\xF3n, no un hecho: supone que te entran ${u(r.ingresoEsperado)} por pago.
      ${ve(i)?`Las fechas son de <strong>una sola posibilidad</strong>: pagos puntuales cada
           ${r.diasOptimista} d\xEDas, sin contar atrasos. Sube \xABd\xEDas si se atrasan\xBB
           por encima de ${r.diasOptimista} y vuelven a salir como rango.`:`El \xABcu\xE1ndo\xBB va de puntual (cada ${r.diasOptimista} d\xEDas) a atrasado (cada ${r.diasPesimista}).`}
      ${e.incompleta?"<br /><strong>Con ese ingreso no alcanza a terminar.</strong>":""}
    </p>
    ${Go(e)}
    ${Vo()}
  </section>`}function Vo(){let e=he(oe(c.cuentas,c.ingresos));if(e<=0)return"";let a=ra(_a(),e);if(!a)return"";let o=R(),t=n=>ne(C(Math.max(1,n),o));return`<p class="nota ${a.seAdelanta>0?"":"rango"}">
    Te deben <strong class="pendiente">${u(a.pendiente)}</strong>.
    ${a.seAdelanta>0?`Si te los pagaran de una vez, terminar\xEDas <strong>${a.seAdelanta}
         ${a.seAdelanta===1?"pago":"pagos"} antes</strong>: la \xFAltima meta pasar\xEDa de
         ${g(t(a.pagosAhora))} a ${g(t(a.pagosSiPagan))}.`:`Aunque te los pagaran de una vez, las fechas no se mover\xEDan \u2014 el ritmo lo marcan los
         topes por pago que pusiste arriba, no lo que entra.`}
    <br /><span class="rango">Esto es aparte: la proyecci\xF3n de arriba NO cuenta ese dinero
    hasta que lo registres como pago recibido.</span>
  </p>`}function Go(e){let a=sa(e,c.metas);if(a.length===0)return"";let o=R(),t=s=>L(C(Math.max(1,s),o).optimista),n=s=>s.termina===null?`<li class="mal"><strong>${g(s.nombre)}</strong> la quer\xEDas para
        ${g(t(s.queria))} y <strong>no alcanza a terminar</strong> con este ingreso.</li>`:s.seRetrasa===0?`<li class="bien"><strong>${g(s.nombre)}</strong> la quer\xEDas para
        ${g(t(s.queria))} y llega ${s.termina===0?"ya pagada":`en ${g(t(s.termina))}`}.</li>`:`<li class="mal"><strong>${g(s.nombre)}</strong> la quer\xEDas para
      ${g(t(s.queria))} y va para <strong>${g(t(s.termina))}</strong>
      \u2014 ${s.seRetrasa} ${s.seRetrasa===1?"pago":"pagos"} tarde.
      S\xFAbela de posici\xF3n o dale m\xE1s por pago.</li>`;return`<div class="plazos">
    <h3 class="titulo-total">Lo que quer\xEDas para cierta fecha</h3>
    <ul>${a.map(n).join("")}</ul>
    <p class="nota rango">Esto solo avisa: el orden de pago lo pones t\xFA arriba, y el programa
      no lo cambia por su cuenta.</p>
  </div>`}function U(e){let a=se(c.metas),o=c.ingresos.filter(s=>s.fecha<=e.fecha&&s.id!==e.id).sort((s,r)=>s.fecha.localeCompare(r.fecha));for(let s of o){let r=c.repartos.find(i=>i.ingresoId===s.id);for(let i of r?.abonos??[])i.refId&&a.set(i.refId,Math.max(0,(a.get(i.refId)??0)-i.monto))}let t=e.cuentaDeCobroId?!o.some(s=>s.cuentaDeCobroId===e.cuentaDeCobroId):!0,n=c.escenario;return Qe(e,Xe(e,o),c.obligaciones,{nombre:"Otros / Ahorro",base:n.colchonBase,minimo:n.colchonMinimo,elastico:!1},c.metas,a,t)}function Bo(){let e=Me(c.ingresos,c.repartos);if(e.length===0)return`<section class="panel">
      <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
        <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
      <div class="vacio">
        <strong>Todav\xEDa no has registrado ninguna entrada de plata.</strong>
        Registra un pago en \xABCuentas de cobro\xBB y aqu\xED aparece, mes a mes, en qu\xE9 se fue.
        <p><button data-accion="aporte-externo">+ Meter plata de otro lado</button></p>
      </div>
    </section>`;let a=e.slice().reverse().map(t=>{let n=c.ingresos.filter(s=>s.fecha.slice(0,7)===t.mes).sort((s,r)=>s.fecha.localeCompare(r.fecha));return`
    <div class="mes-real">
      <div class="mes-cabecera">
        <h3>${g(re(t.mes))}</h3>
        <span class="valor">${u(t.entro)}</span>
        <span class="rotulo">entr\xF3${t.deFuera>0?` \xB7 ${u(t.deFuera)} los pusiste t\xFA`:""}</span>
      </div>
      ${n.map(Qo).join("")}
      ${n.length>1?`<div class="total-mes">
        <span>Ese mes: ${u(t.aObligaciones)} en obligaciones \xB7 ${u(t.aMetas)} a metas
        ${t.alAhorro>0?` \xB7 ${u(t.alAhorro)} guardado`:""}</span></div>`:""}
    </div>`}).join(""),o=Je(c.repartos);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
      <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
    ${a}
    ${o.length>1?`
      <h3 class="titulo-total">En todo lo que llevas</h3>
      <div class="tabla-ancha"><table><tbody>
        ${o.map(t=>`<tr><td class="meta-nombre">${g(t.nombre)}</td>
          <td class="num">${u(t.monto)}</td></tr>`).join("")}
      </tbody></table></div>`:""}
    <p class="nota"><button data-accion="aporte-externo">+ Meter plata de otro lado</button>
      &nbsp; <span class="rango">Para cuando pones de tu bolsillo (Nequi, efectivo) y no viene del trabajo.</span></p>
  </section>`}function Qo(e){let a=c.repartos.find(i=>i.ingresoId===e.id),o=c.cuentas.find(i=>i.id===e.cuentaDeCobroId),t=g(o?o.periodo:e.nota??"de otro lado");if(!a)return`<div class="ingreso-real">
      <div class="ingreso-cabecera">
        <span class="meta-nombre">${u(e.monto)}</span>
        <span class="rango">${g(e.fecha)} \xB7 ${t}</span>
      </div>
      <p class="nota aviso">No est\xE1 dicho en qu\xE9 se fue este dinero.
        <button data-accion="proponer" data-id="${e.id}">Calcularlo por m\xED</button></p>
    </div>`;let n=J(a,e),s=(i,l,d)=>`
    <tr>
      <td class="meta-nombre">${g(i.nombre)}
        ${i.movidoDesdeGasto?'<span class="rango">\xB7 ven\xEDa de un gasto</span>':""}</td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${x(i.monto)}" class="corto-dinero"
        data-accion="editar-reparto" data-id="${a.id}" data-tipo="${l}" data-i="${d}" /></td>
      <td class="num">${i.movidoDesdeGasto?`<button class="icono" data-accion="abono-a-gasto" data-id="${a.id}" data-i="${d}"
             title="Devolverlo a gastos">\u21A9</button>`:""}</td>
    </tr>`,r=(i,l)=>`
    <tr class="gasto-suelto">
      <td><input value="${g(i.nombre)}" placeholder="\xBFen qu\xE9 se fue?"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${l}" data-campo="nombre" /></td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${x(i.monto)}" class="corto-dinero"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${l}" data-campo="monto" /></td>
      <td class="num"><button class="icono" data-accion="borrar-gasto"
        data-id="${a.id}" data-i="${l}" title="Quitar">\u2715</button></td>
    </tr>`;return`<div class="ingreso-real ${a.propuesto?"propuesto":""}">
    <div class="ingreso-cabecera">
      <span class="meta-nombre">${u(e.monto)}</span>
      <span class="rango">${g(e.fecha)} \xB7 ${t}</span>
      ${a.propuesto?`<button class="primario" data-accion="confirmar-reparto" data-id="${a.id}">As\xED fue</button>`:'<span class="completa">confirmado</span>'}
    </div>
    ${a.propuesto?`<p class="nota aviso">Esto es lo que el programa <em>calcula</em> que
      hiciste. Corrige lo que no fue as\xED y dale a \xABAs\xED fue\xBB.</p>`:""}
    <div class="tabla-ancha">
      <table>
        <tbody>
          ${a.obligaciones.map((i,l)=>[i,l]).filter(([i])=>i.monto!==0).map(([i,l])=>s(i,"obligaciones",l)).join("")}
          ${a.abonos.map((i,l)=>[i,l]).filter(([i])=>i.monto!==0).map(([i,l])=>s(i,"abonos",l)).join("")}
          ${(a.gastos??[]).map(r).join("")}
          <tr class="grupo">
            <td class="meta-nombre">Qued\xF3 guardado</td>
            <td class="num"><input type="text" inputmode="numeric" data-dinero
              value="${x(a.alAhorro)}" class="corto-dinero"
              data-accion="editar-reparto" data-id="${a.id}" data-tipo="ahorro" data-i="0" /></td>
            <td class="num"></td>
          </tr>
        </tbody>
      </table>
    </div>
    ${(()=>{let i=aa(a,c.metas);return i.length===0?"":i.map(l=>`<p class="nota aviso">
        Tienes <strong>${g(l.gasto.nombre)}</strong> (${u(l.gasto.monto)}) anotado aqu\xED como
        un gasto cualquiera, pero <strong>${g(l.metaNombre)}</strong> es una de tus metas.
        <br />Si ese dinero se lo metiste a la meta, m\xE1rcalo: as\xED el programa sabe que ya llevas
        ${u(l.gasto.monto)} pagados y deja de calcular las fechas como si te faltara el precio
        entero. Si fue otra cosa que se llama parecido, d\xE9jalo como est\xE1.
        <br /><button data-accion="gasto-a-abono" data-id="${a.id}"
          data-meta="${l.metaId}" data-nombre="${g(l.gasto.nombre)}">S\xED, fue abono a ${g(l.metaNombre)}</button>
      </p>`).join("")})()}
    ${(()=>{let i=We(a,U(e));return i.length===0?"":`<p class="nota aviso">
        Cambiaste la configuraci\xF3n desde que se calcul\xF3 esto: hoy
        <strong>${i.map(g).join(", ")}</strong> ya no ${i.length===1?"entrar\xEDa":"entrar\xEDan"}
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
  </div>`}function Uo(e){let a=R(),o=e?Ye(e.pagos,a.desde,a.diasOptimista,c.metas):[],t=Me(c.ingresos,c.repartos),n=[...new Set([...o.map(l=>l.mes),...t.map(l=>l.mes)])],s=ea(c.cuentas,c.ingresos,c.escenario.ingresoEsperado,n),r=Ke(o,t,B().slice(0,7),s);if(r.length===0)return`<section class="panel">
      <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
      <div class="vacio">Agrega tus metas y registra un pago: aqu\xED se ve el calendario entero.</div>
    </section>`;Yo(r);let i=Ze(r);return`
  <section class="panel">
    <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
    <div class="resumen">
      <div><span class="valor real">${u(i.entroDeVerdad)}</span>
        <span class="rotulo">ha entrado de verdad \xB7 ${i.mesesConDatos} ${i.mesesConDatos===1?"mes":"meses"}</span></div>
      <div><span class="valor">${u(i.guardadoDeVerdad)}</span>
        <span class="rotulo">llevas guardado</span></div>
      ${i.mesesQueFaltan>0?`<div><span class="valor cuando">${u(i.faltaPorEntrar)}</span>
            <span class="rotulo">faltar\xEDan por entrar \xB7 ${i.mesesQueFaltan} ${i.mesesQueFaltan===1?"mes":"meses"}</span></div>`:`<div><span class="valor">${u(i.gastadoDeVerdad)}</span>
            <span class="rotulo">llevas gastado</span></div>`}
    </div>
    <p class="nota">
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="1">Desplegar todos</button>
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="0">Plegar todos</button>
      <span class="rango">&nbsp; ${r.length} ${r.length===1?"mes":"meses"} \xB7
        pulsa uno para ver en qu\xE9 se va</span>
    </p>
    <div class="linea-tiempo">${r.map(Xo).join("")}</div>
    <p class="nota">
      <span class="etiqueta real">Real</span> lo que pas\xF3 \xB7
      <span class="etiqueta simulacion">Simulaci\xF3n</span> lo que pasar\xEDa si entra lo que supone
      el escenario. Nunca se mezclan en una sola cifra.
    </p>
  </section>`}function Jo(e){let a=(n,s)=>n.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")===s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),o=c.obligaciones.find(n=>a(n.nombre,e));if(o)return`<span class="que-es obligacion">fijo${o.grupo?` \xB7 ${g(o.grupo)}`:""}</span>`;let t=c.metas.find(n=>a(n.nombre,e));return t?`<span class="que-es meta">meta${t.grupo?` \xB7 ${g(t.grupo)}`:""}</span>`:e==="Qued\xF3 guardado"||e==="Se guardar\xEDa"?"":'<span class="que-es suelto">de una vez</span>'}var Q=new Set,wa=!1;function Yo(e){if(wa)return;wa=!0;let a=e.findIndex(t=>t.estado==="actual"),o=a>=0?a:0;for(let t of e.slice(o,o+2))Q.add(t.mes)}function Xo(e){let a=e.real!==null,o=e.real??e.simulado;if(!o)return"";let t=a?o.entro:e.esperado?.monto??o.entro,n=!a&&e.simulado!==null&&e.esperado!==null&&e.esperado.monto!==e.simulado.entro,s=e.real?e.real.detalle:w(e.simulado?.detalle),r=e.estado==="actual"?'<span class="chip ahora">este mes</span>':e.estado==="futuro"?'<span class="chip futuro">viene</span>':"",i=[o.aObligaciones>0?`${u(o.aObligaciones)} fijos`:"",o.aMetas>0?`${u(o.aMetas)} a metas`:"",a&&e.real.enGastos>0?`${u(e.real.enGastos)} sueltos`:"",o.alAhorro>0?`${u(o.alAhorro)} guardado`:""].filter(Boolean).join(" \xB7 ");return`
  <details class="mes-vista ${e.estado} ${a?"es-real":"es-simulado"}"
           data-mes="${e.mes}" ${Q.has(e.mes)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${g(re(e.mes))}</h3>
      ${r}
      <span class="etiqueta ${a?"real":"simulacion"}">${a?"Real":"Simulaci\xF3n"}</span>
      <span class="valor">${u(t)}</span>
      ${i?`<span class="resumen-plegado">${i}</span>`:""}
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
          <td class="meta-nombre">${g(l.nombre)} ${Jo(l.nombre)}</td>
          <td class="num">${u(l.monto)}</td></tr>`).join("")}
        ${o.alAhorro>0?`<tr class="grupo">
          <td class="meta-nombre">${a?"Qued\xF3 guardado":"Se guardar\xEDa"}</td>
          <td class="num">${u(o.alAhorro)}</td></tr>`:""}
      </tbody></table></div>`}
    ${e.real&&e.real.sinAsignar>0?`<p class="nota aviso">
      Hay ${u(e.real.sinAsignar)} sin decir en qu\xE9 se fueron.</p>`:""}
  </details>`}var T=[],Ne=null,W=!1;function Wo(){let e=we(),a=_e();if(!e)return`
    <section class="panel">
      <h2>Sincronizar con el tel\xE9fono <span class="sufijo">\u2014 opcional</span></h2>
      <div class="vacio">
        <strong>Tus datos viven en este aparato.</strong>
        Si entras con tu correo, el PC y el tel\xE9fono se ponen al d\xEDa solos.
        <br /><span class="rango">El programa funciona igual sin esto: la nube es solo el
        buz\xF3n entre los dos.</span>
        <p>
          <input type="email" id="nube-correo" placeholder="tu correo" autocomplete="username" />
          <input type="password" id="nube-clave" placeholder="contrase\xF1a" autocomplete="current-password" />
          <button class="primario" data-accion="nube-entrar">Entrar</button>
        </p>
      </div>
    </section>`;let o=T.length===0?"":`
    <div class="aviso-descartes">
      <strong>${T.length} ${T.length===1?"dato distinto":"datos distintos"} entre los dos aparatos.</strong>
      Se qued\xF3 el m\xE1s reciente. Esto es lo que hab\xEDa en el otro:
      <table><tbody>
        ${T.map((t,n)=>`<tr>
          <td>${g(t.campo)}</td>
          <td class="num">${g(String(t.valor??"\u2014"))}</td>
          <td class="rango">en vez de ${g(String(t.gano??"\u2014"))}</td>
          <td><button class="chico-linea" data-accion="nube-revertir" data-i="${n}">Quedarme con este</button></td>
        </tr>`).join("")}
      </tbody></table>
    </div>`;return`
    <section class="panel">
      <h2>Sincronizar con el tel\xE9fono
        <span class="sufijo">\u2014 ${g(e.correo)}</span></h2>
      <p class="nota">
        ${a?`\xDAltima vez: ${new Date(a).toLocaleString("es-CO")}.`:"Todav\xEDa no has sincronizado desde este aparato."}
      </p>
      <p>
        <button class="primario" data-accion="nube-sincronizar" ${W?"disabled":""}>
          ${W?"Sincronizando\u2026":"Sincronizar ahora"}
        </button>
        <button class="chico-linea" data-accion="nube-salir">Salir de la cuenta</button>
      </p>
      ${o}
    </section>`}function ge(){let e=ko();return[["radicacion",Fo()],["vista",Uo(e)],["escenario",Ro()],["metas",_o()],["proyeccion",Ho(e)],["obligaciones",qo()],["cuentas",zo()],["real",Bo()],["nube",Wo()]]}function Ha(e){if(typeof e.querySelectorAll=="function")for(let a of Array.from(e.querySelectorAll("table"))){let o=Array.from(a.querySelectorAll("thead th")).map(t=>(t.textContent??"").trim());if(Ma(o)){a.classList.add("como-tarjetas");for(let t of Array.from(a.querySelectorAll("tbody tr"))){let n=Array.from(t.children),s=n.map(i=>Number(i.getAttribute("colspan")??1)||1),r=$a(o,s);n.forEach((i,l)=>{let d=r[l];d?i.dataset.etiqueta=d:delete i.dataset.etiqueta})}}}}function ze(e,a){e.innerHTML=a,Ha(e)}function Va(){return document.activeElement?.closest?.("[data-panel]")?.dataset.panel??null}function ke(e=Va()){let a=new Set([e,Fe].filter(Boolean));for(let[o,t]of ge()){if(a.has(o))continue;let n=document.getElementById(`panel-${o}`);n&&ze(n,t)}Ga()}function Ga(){let e=document.getElementById("mensaje");e&&(e.innerHTML=$?`<div class="mensaje ${$.malo?"malo":"bueno"}">${g($.texto)}</div>`:"",$=null)}function E(){let e=document.getElementById("app"),a=Oa(document.activeElement),o=document.activeElement,t=o&&typeof o.selectionStart=="number"?o.selectionStart:null,n=window.scrollY;e.className="",e.innerHTML=`
    <header class="cabecera">
      <h1>Gesti\xF3n del dinero del trabajo</h1>
      <div class="acciones">
        <button data-accion="exportar">Exportar respaldo</button>
        <button data-accion="importar">Importar respaldo</button>
      </div>
    </header>
    <div id="mensaje"></div>
    ${ge().map(([s,r])=>`<div id="panel-${s}" data-panel="${s}">${r}</div>`).join("")}
    <input type="file" id="archivo" accept="application/json" hidden />`,Ha(e),Ga(),window.scrollTo({top:n,behavior:"instant"}),So(a,t)}function Ba(e){let a=Math.round(Number(e));if(!(!Number.isFinite(a)||a<=1))return a}b.set("escenario",e=>{let a=e.dataset.campo,o=e,t=o.value;if(c.escenario[a]=o.type==="date"?t:o.hasAttribute("data-dinero")?P(t):Number(t),a==="diasOptimista"||a==="diasPesimista"){let n=Math.round(Number(t));c.escenario[a]=Number.isFinite(n)&&n>0?n:1}I()});b.set("elastico",e=>{c.escenario.colchonElastico=e.checked,I()});b.set("oblig",e=>{let a=c.obligaciones.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=a.tipo==="porcentaje"?Number(t)/100:P(t);else if(o==="tipo"){let n=t;n!==a.tipo&&(a.valor=n==="porcentaje"?.1:1e5),a.tipo=n}else o==="modo"?(a.modo=t,a.modo==="puntual"&&!a.supuesto&&(a.supuesto="siempre")):o==="grupo"?a.grupo=t.trim()||void 0:o==="desdePago"?a.desdePago=Ba(t):o==="supuesto"?a.supuesto=t:a.nombre=t;I()});b.set("nuevo-cambio",e=>{let a=c.obligaciones.find(t=>t.id===e.dataset.id);if(!a)return;let o=Math.max(1,...(a.cambios??[]).map(t=>t.desdePago));a.cambios=[...a.cambios??[],{desdePago:o+1,valor:a.valor}],v()});b.set("cambio",e=>{let a=c.obligaciones.find(n=>n.id===e.dataset.id),o=a?.cambios?.[Number(e.dataset.i)];if(!a||!o)return;let t=e.value;if(e.dataset.campo==="desdePago"){let n=Math.round(Number(t));o.desdePago=Number.isFinite(n)&&n>0?n:1}else o.valor=a.tipo==="porcentaje"?Number(t)/100:P(t);I()});b.set("borrar-cambio",e=>{let a=c.obligaciones.find(t=>t.id===e.dataset.id);if(!a?.cambios)return;let o=Number(e.dataset.i);a.cambios=a.cambios.filter((t,n)=>n!==o),v()});b.set("nuevo-cambio-ahorro",()=>{let e=c.escenario.cambiosColchon??[],a=Math.max(1,...e.map(o=>o.desdePago));c.escenario.cambiosColchon=[...e,{desdePago:a+1,valor:c.escenario.colchonBase}],v()});b.set("cambio-ahorro",e=>{let a=c.escenario.cambiosColchon?.[Number(e.dataset.i)];if(!a)return;let o=e.value;if(e.dataset.campo==="desdePago"){let t=Math.round(Number(o));a.desdePago=Number.isFinite(t)&&t>0?t:1}else a.valor=P(o);I()});b.set("borrar-cambio-ahorro",e=>{let a=Number(e.dataset.i);c.escenario.cambiosColchon=(c.escenario.cambiosColchon??[]).filter((o,t)=>t!==a),v()});b.set("nueva-oblig",()=>{c.obligaciones.push({id:j("ob"),nombre:"Nueva obligaci\xF3n",tipo:"fijo",valor:1e5,modo:"cada_pago"}),v()});b.set("borrar-oblig",e=>{c.obligaciones=c.obligaciones.filter(a=>a.id!==e.dataset.id),v()});b.set("meta",e=>{let a=c.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=P(t);else if(o==="abonado")a.abonado=P(t);else if(o==="desdePago")a.desdePago=Ba(t);else if(o==="maximoPorPago"){let n=P(t);a.maximoPorPago=n>0?n:void 0}else if(o==="enCuotas"){let n=Math.round(Number(t));a.enCuotas=Number.isFinite(n)&&n>0?n:void 0}else if(o==="antesDelPago"){let n=Math.round(Number(t));a.antesDelPago=Number.isFinite(n)&&n>0?n:void 0}else o==="grupo"?a.grupo=t.trim()||void 0:a.nombre=t;I()});b.set("nueva-meta",()=>{let e=j("meta");c.metas.push({id:e,nombre:"",valor:0}),v(),document.querySelector(`input[data-id="${e}"][data-campo="nombre"]`)?.focus()});b.set("plegar-meses",e=>{let a=e.dataset.abrir==="1";if(Q.clear(),a)for(let t of document.querySelectorAll("[data-mes]"))Q.add(t.dataset.mes);let o=document.getElementById("panel-vista");o&&ze(o,ge().find(([t])=>t==="vista")[1])});b.set("ordenar",e=>{let a=e.dataset.por,o=(n,s)=>n.localeCompare(s,"es",{sensitivity:"base",numeric:!0}),t=(n,s)=>a==="valor"?s.valor-n.valor:a==="grupo"&&o(n.grupo??"\uFFFF",s.grupo??"\uFFFF")||o(n.nombre,s.nombre);e.dataset.lista==="metas"?(c.metas=[...c.metas].sort(t),$={texto:`Metas ordenadas por ${a}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron. Si no era lo que quer\xEDas, reord\xE9nalas con las flechas.`,malo:!1}):c.obligaciones=[...c.obligaciones].sort(t),v()});b.set("duplicar-meta",e=>{let a=c.metas.findIndex(n=>n.id===e.dataset.id);if(a<0)return;let o=c.metas[a],t={...o,id:j("meta"),nombre:`${o.nombre} (copia)`,abonado:0};delete t.compra,c.metas.splice(a+1,0,t),v()});b.set("borrar-meta",e=>{c.metas=c.metas.filter(a=>a.id!==e.dataset.id),v()});function Qa(e,a){let o=e+a;if(o<0||o>=c.metas.length)return;let t=c.metas.slice();[t[e],t[o]]=[t[o],t[e]],c.metas=t,v()}b.set("subir",e=>Qa(Number(e.dataset.i),-1));b.set("bajar",e=>Qa(Number(e.dataset.i),1));b.set("nueva-cuenta",()=>{let e=new Date,a=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];c.cuentas.push({id:j("cta"),periodo:`${a[e.getMonth()]} de ${e.getFullYear()}`,montoEsperado:c.escenario.ingresoEsperado}),v()});b.set("cuenta",e=>{let a=c.cuentas.find(t=>t.id===e.dataset.id);if(!a)return;let o=e.value;e.dataset.campo==="montoEsperado"?a.montoEsperado=P(o):a.periodo=o,I()});b.set("borrar-cuenta",e=>{c.cuentas=c.cuentas.filter(o=>o.id!==e.dataset.id);let a=new Set(c.ingresos.filter(o=>o.cuentaDeCobroId===e.dataset.id).map(o=>o.id));c.ingresos=c.ingresos.filter(o=>o.cuentaDeCobroId!==e.dataset.id),c.repartos=c.repartos.filter(o=>!a.has(o.ingresoId)),v()});b.set("abonar",async e=>{let a=c.cuentas.find(i=>i.id===e.dataset.id);if(!a)return;let o=oe([a],c.ingresos)[0],t=o.pendiente>0?o.pendiente:a.montoEsperado,n=await H({titulo:`\xBFCu\xE1nto te pagaron de ${a.periodo}?`,detalle:o.pendiente>0&&o.recibido>0?`Ya te hab\xEDan pagado ${u(o.recibido)}. Faltan ${u(o.pendiente)}.`:void 0,valorInicial:x(t),dinero:!0,textoAceptar:"Registrar pago"});if(n===null)return;let s=P(n);if(!Number.isFinite(s)||s<=0)return $={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},E();let r={id:j("ing"),cuentaDeCobroId:a.id,fecha:B(),monto:s};c.ingresos.push(r),c.repartos.push(U(r)),$={texto:"Registrado. Mira abajo en qu\xE9 se va ese dinero y corr\xEDgelo si no fue as\xED.",malo:!1},v()});b.set("comprada",async e=>{let a=c.metas.find(s=>s.id===e.dataset.id);if(!a)return;let o=await H({titulo:`\xBFPor cu\xE1nto compraste ${a.nombre}?`,detalle:`La ten\xEDas en ${u(a.valor)}. Pon lo que pagaste de verdad, aunque sea distinto.`,valorInicial:x(a.valor),dinero:!0,textoAceptar:"Siguiente"});if(o===null)return;let t=await H({titulo:"\xBFEn qu\xE9 mes la compraste?",detalle:"Escr\xEDbelo como AAAA-MM. Por ejemplo, 2026-08 para agosto de este a\xF1o.",valorInicial:B().slice(0,7),textoAceptar:"Guardar"});if(t===null)return;let n=/^\d{4}-\d{2}$/.test(t.trim())?t.trim():B().slice(0,7);a.compra={mes:n,precioReal:P(o)},v()});b.set("no-comprada",e=>{let a=c.metas.find(o=>o.id===e.dataset.id);a&&(delete a.compra,v())});b.set("proponer",e=>{let a=c.ingresos.find(o=>o.id===e.dataset.id);a&&(c.repartos=c.repartos.filter(o=>o.ingresoId!==a.id),c.repartos.push(U(a)),v())});b.set("confirmar-reparto",e=>{let a=c.repartos.find(o=>o.id===e.dataset.id);a&&(a.propuesto=!1,v())});b.set("editar-reparto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id);if(!a)return;let o=P(e.value),t=e.dataset.tipo,n=Number(e.dataset.i);t==="ahorro"?a.alAhorro=o:t==="obligaciones"&&a.obligaciones[n]?a.obligaciones[n].monto=o:t==="abonos"&&a.abonos[n]&&(a.abonos[n].monto=o),a.propuesto=!1,I()});b.set("quitar-previo",e=>{let a=c.metas.find(t=>t.id===e.dataset.id);if(!a)return;let o=a.abonado??0;a.abonado=0,$={texto:`Quit\xE9 los ${u(o)} que estaban escritos a mano en ${a.nombre}. Ahora manda lo registrado en \xABen qu\xE9 se fue la plata\xBB, que es lo que de verdad pagaste.`,malo:!1},v()});b.set("gasto-a-abono",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.metas.find(s=>s.id===e.dataset.meta);if(!a||!o)return;let t=e.dataset.nombre,n=(a.gastos??[]).find(s=>s.nombre===t);n&&(a.gastos=a.gastos.filter(s=>s!==n),a.abonos.push({nombre:o.nombre,monto:n.monto,refId:o.id,movidoDesdeGasto:!0}),$={texto:`Listo: los ${u(n.monto)} de \xAB${n.nombre}\xBB ahora cuentan como abono a ${o.nombre}. El total del mes no cambi\xF3. Si te equivocaste, la l\xEDnea tiene un bot\xF3n \u21A9 para devolverla a gastos.`,malo:!1},v())});b.set("abono-a-gasto",e=>{let a=c.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.abonos[o];!a||!t||(a.abonos=a.abonos.filter((n,s)=>s!==o),a.gastos=[...a.gastos??[],{nombre:t.nombre,monto:t.monto}],$={texto:`${t.nombre} volvi\xF3 a ser un gasto suelto.`,malo:!1},v())});b.set("nuevo-gasto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=J(a,o),n=t>0?t:Math.min(a.alAhorro,a.alAhorro);a.gastos=[...a.gastos??[],{nombre:"",monto:0}],n<=0&&(a.propuesto=!1),v()});b.set("editar-gasto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];if(!a||!t)return;let n=e.value;if(e.dataset.campo==="nombre")t.nombre=n;else{let s=P(n);a.alAhorro=Math.max(0,a.alAhorro-(s-t.monto)),t.monto=s}a.propuesto=!1,I()});b.set("borrar-gasto",e=>{let a=c.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];!a||!t||(a.alAhorro+=t.monto,a.gastos=a.gastos.filter((n,s)=>s!==o),v())});b.set("recalcular",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=a.gastos??[],n=U(o);n.gastos=t,n.alAhorro=Math.max(0,n.alAhorro-t.reduce((s,r)=>s+r.monto,0)),c.repartos=c.repartos.map(s=>s.id===a.id?n:s),$={texto:"Recalculado con las obligaciones de ahora.",malo:!1},v()});b.set("cuadrar",e=>{let a=c.repartos.find(t=>t.id===e.dataset.id),o=c.ingresos.find(t=>t.id===a?.ingresoId);!a||!o||(a.alAhorro=Math.max(0,a.alAhorro+J(a,o)),a.propuesto=!1,v())});b.set("aporte-externo",async e=>{let a=await H({titulo:"\xBFCu\xE1nto vas a meter de tu bolsillo?",detalle:"Plata tuya que no viene del trabajo: Nequi, efectivo, lo que tengas guardado por otro lado.",valorInicial:"0",dinero:!0,textoAceptar:"Meterlo"});if(a===null)return;let o=P(a);if(o<=0)return $={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},E();let t=await H({titulo:"\xBFDe d\xF3nde sali\xF3?",detalle:"Para que dentro de unos meses sepas qu\xE9 fue esto.",valorInicial:"Nequi",textoAceptar:"Guardar"}),n={id:j("ing"),fecha:B(),monto:o,nota:t?.trim()||"de otro lado"};c.ingresos.push(n),c.repartos.push(U(n)),v()});b.set("soporte",e=>{let a=Pe(new Date),o=new Set(c.soportesMarcados[a]??[]),t=e.dataset.id;e.checked?o.add(t):o.delete(t),c.soportesMarcados={...c.soportesMarcados,[a]:[...o]},I()});b.set("borrar-ingreso",e=>{c.repartos=c.repartos.filter(a=>a.ingresoId!==e.dataset.id),c.ingresos=c.ingresos.filter(a=>a.id!==e.dataset.id),v()});function Ua(){let e=globalThis.__TAURI__;return e?.dialog&&e?.fs?{dialog:e.dialog,fs:e.fs}:null}b.set("exportar",async()=>{let e=fa(c),a=`respaldo-dinero-${B()}.json`,o=Ua();if(!o){let t=new Blob([e],{type:"application/json"}),n=document.createElement("a");return n.href=URL.createObjectURL(t),n.download=a,n.click(),URL.revokeObjectURL(n.href),$={texto:`Respaldo guardado en tu carpeta de descargas como ${a}.`,malo:!1},E()}try{let t=await o.dialog.save({title:"\xBFD\xF3nde guardo el respaldo?",defaultPath:a,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!t)return;await o.fs.writeTextFile(t,e),$={texto:`Respaldo guardado en ${t}`,malo:!1}}catch(t){$={texto:`No pude guardar el respaldo: ${String(t)}`,malo:!0}}E()});b.set("importar",async()=>{let e=Ua();if(e)try{let o=await e.dialog.open({title:"\xBFQu\xE9 respaldo quieres cargar?",multiple:!1,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!o)return;let{estado:t,aviso:n}=Re(await e.fs.readTextFile(o));return t?(c=t,$={texto:"Respaldo importado.",malo:!1},v()):($={texto:n.texto,malo:!0},E())}catch(o){return $={texto:`No pude leer ese archivo: ${String(o)}`,malo:!0},E()}let a=document.getElementById("archivo");a.onchange=async()=>{let o=a.files?.[0];if(!o)return;let{estado:t,aviso:n}=Re(await o.text());if(!t)return $={texto:n.texto,malo:!0},E();c=t,$={texto:"Respaldo importado.",malo:!1},v()},a.click()});document.addEventListener("input",e=>{let a=e.target;if(a instanceof HTMLInputElement&&(a.hasAttribute("data-dinero")&&va(a),a.dataset.campo==="desdePago")){let o=a.parentElement?.querySelector(".mes-de-pago");if(o){let t=Math.max(1,Math.round(Number(a.value)||1));o.textContent=t<=1?"desde el primero":L(C(t,R()).optimista)}}});document.addEventListener("focusout",e=>{let a=e.target?.closest?.("[data-panel]");if(!a||e.relatedTarget?.closest?.("[data-panel]")===a)return;let t=a.dataset.panel;setTimeout(()=>{if(K||Va()===t)return;let n=ge().find(([r])=>r===t)?.[1],s=document.getElementById(`panel-${t}`);n!==void 0&&s&&ze(s,n)},0)});document.addEventListener("toggle",e=>{let a=e.target,o=a?.dataset?.mes;o&&(a.open?Q.add(o):Q.delete(o))},!0);document.addEventListener("change",e=>{let a=e.target?.closest("[data-accion]");a&&b.get(a.dataset.accion)?.(a,e)});document.addEventListener("click",e=>{let a=e.target?.closest("button[data-accion]");K=!1,a?(G=!1,b.get(a.dataset.accion)?.(a,e)):G&&(G=!1,ke())});"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(()=>{})});var me=ba();c=me.estado;me.aviso&&($={texto:me.aviso.texto,malo:me.aviso.grave});function Ko(){let e=new Set(c.repartos.map(o=>o.ingresoId)),a=c.ingresos.filter(o=>!e.has(o.id)).sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o of a)c.repartos.push(U(o));return a.length>0}Ko()&&le(c);E();globalThis.__estado=()=>c;globalThis.__reiniciar=()=>{c=O(),v()};b.set("nube-entrar",async()=>{let e=document.getElementById("nube-correo")?.value??"",a=document.getElementById("nube-clave")?.value??"";if(!e.trim()||!a)return $={texto:"Escribe tu correo y tu contrase\xF1a.",malo:!0},E();try{$={texto:`Entraste como ${(await Ia(e,a)).correo}. Ya puedes sincronizar.`,malo:!1}}catch(o){$={texto:o.message,malo:!0}}E()});b.set("nube-salir",()=>{je(),Ne=null,T=[],$={texto:"Saliste de la cuenta. Tus datos siguen aqu\xED, intactos.",malo:!1},E()});b.set("nube-sincronizar",async()=>{if(!W){W=!0,E();try{let e=await Ta(c,Ne,new Date().toISOString());c=e.estado,Ne=JSON.parse(JSON.stringify(e.estado)),T=e.descartes.map(a=>({id:a.id,campo:a.campo,valor:a.valor,gano:a.gano})),le(c),$={texto:T.length===0?"Todo al d\xEDa. Nada que resolver.":`Listo. ${T.length} dato(s) distintos entre los dos aparatos: mira abajo.`,malo:!1}}catch(e){$={texto:e.message,malo:!0}}W=!1,E()}});b.set("nube-revertir",e=>{let a=T[Number(e.dataset.i)];a&&($={texto:`\xAB${a.campo}\xBB val\xEDa ${String(a.valor)} en el otro aparato. C\xE1mbialo a mano y vuelve a sincronizar: as\xED queda sellado con la hora de ahora y gana.`,malo:!1},E())});document.addEventListener("keydown",e=>{if(e.key!=="Enter"||e.isComposing)return;let a=e.target;!a||a.closest(".capa-dialogo")||!(a instanceof HTMLInputElement)||a.type==="checkbox"||(e.preventDefault(),a.blur())});
