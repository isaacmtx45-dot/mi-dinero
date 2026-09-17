var Be=Number.MAX_SAFE_INTEGER;function h(e){let a=typeof e=="number"?e:Number(e);return Number.isFinite(a)?Math.abs(a)>Be?a<0?-Be:Be:Math.round(a):0}function ae(e,a){return h(e*a)}var ha=100;function _o(e,a){return a<=0?"sin_pagar":a>=e+ha?"pagaron_de_mas":a>=e-ha?"completa":"parcial"}function oe(e,a){let o=new Map;for(let t of a){let n=o.get(t.cuentaDeCobroId)??[];n.push(t),o.set(t.cuentaDeCobroId,n)}return e.map(t=>{let n=(o.get(t.id)??[]).slice().sort((i,l)=>i.fecha.localeCompare(l.fecha)),s=n.reduce((i,l)=>i+h(l.monto),0),r=_o(h(t.montoEsperado),s);return{cuenta:t,ingresos:n,recibido:s,pendiente:r==="completa"?0:Math.max(0,h(t.montoEsperado)-s),estado:r,ultimoPago:n.length?n[n.length-1].fecha:null}})}function va(e){return e.filter(a=>a.pendiente>0)}function he(e){return e.reduce((a,o)=>a+o.pendiente,0)}var fe=new Intl.NumberFormat("es-CO");function $a(e){let a=`$${fe.format(e.cuenta.montoEsperado)}`,o=`$${fe.format(e.recibido)}`;switch(e.estado){case"sin_pagar":return`${e.cuenta.periodo}: sin pagar \xB7 te deben ${a}`;case"parcial":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 faltan $${fe.format(e.pendiente)}`;case"completa":return`${e.cuenta.periodo}: pagada completa (${o})`;case"pagaron_de_mas":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 $${fe.format(e.recibido-e.cuenta.montoEsperado)} de mas`}}function No(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function ve(e,a,o){return No(a,(e-1)*o)}function L(e,a){let o=Math.max(1,a.diasOptimista);return{optimista:ve(e,a.desde,o),pesimista:ve(e,a.desde,Math.max(o,a.diasPesimista))}}function Ge(e){return e.diasPesimista<=e.diasOptimista}var ko=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function j(e){return`${ko[e.getMonth()]} de ${e.getFullYear()}`}function _(e){let a=j(e.optimista),o=j(e.pesimista);return a===o?a:`entre ${a} y ${o}`}function $e(e){return new Map(e.map(a=>[a.id,Math.max(0,h(a.valor)-h(a.abonado??0))]))}function zo(e){return e.baseCobro??(e.tipo==="porcentaje"?"cada_ingreso":"una_vez_por_cuenta")}function Ho(e,a,o){if(!o&&zo(e)==="una_vez_por_cuenta")return!1;if(e.modo==="primer_pago")return a===1&&o;if(a<(e.desdePago??1))return!1;if(e.modo==="cada_pago")return!0;let t=e.supuesto??"siempre";return t==="nunca"?!1:t==="cada_dos_pagos"?a%2===1:!0}function Ma(e,a,o){let t=e,n=0;for(let s of a??[]){let r=Math.max(1,Math.round(s.desdePago));o>=r&&r>=n&&(t=s.valor,n=r)}return t}function Vo(e,a,o){let t=Ma(e.valor,e.cambios,o);return e.tipo==="porcentaje"?ae(a,t):h(t)}function Bo(e,a){return e.maximoPorPago&&e.maximoPorPago>0?h(e.maximoPorPago):e.enCuotas&&e.enCuotas>0?Math.max(1,Math.ceil(h(e.valor)/Math.round(e.enCuotas))):a}function G(e,a,o,t,n,s,r,i=!0){let l=h(a),d=[];for(let y of o){if(!Ho(y,e,i))continue;let E=Math.min(Vo(y,a,e),l);E<=0||(d.push({nombre:y.nombre,monto:E}),l-=E)}let m=Ma(t.base,t.cambios,e),g=Math.min(h(m),l);l-=g;let f=[],v=0;for(let y of n){let E=s.get(y.id)??0;if(E<=0||e<(y.desdePago??1))continue;let D=Bo(y,E),S=Math.min(E,l,D);if(t.elastico&&S<E&&D>=E){let O=Math.max(0,g-h(t.minimo)),Z=E-S;Z<=O&&(g-=Z,v+=Z,S=E)}if(!(S<=0)&&(f.push({metaId:y.id,monto:S}),s.set(y.id,E-S),l-=Math.min(S,l),l<=0))break}let I=l;return{numero:e,ingreso:a,obligaciones:d,aColchon:g,recorteColchon:v,abonos:f,sobrante:I,saldoAhorro:r+g+I}}function Da(e,a,o,t,n,s,r=!0){let i=e.cuentaDeCobroId===void 0||e.cuentaDeCobroId==="",l=G(a,h(e.monto),i?[]:o,i?{...t,base:0,minimo:0}:t,n,s,0,r),d=new Map(n.map(m=>[m.id,m]));return{id:`rep-${e.id}`,ingresoId:e.id,obligaciones:l.obligaciones.map(m=>({nombre:m.nombre,monto:m.monto})),abonos:l.abonos.map(m=>({nombre:d.get(m.metaId)?.nombre??"(meta borrada)",monto:m.monto,refId:m.metaId})),alAhorro:l.aColchon+l.sobrante,propuesto:!0}}function Go(e){let a=o=>o.reduce((t,n)=>t+h(n.monto),0);return a(e.obligaciones)+a(e.abonos)+a(e.gastos??[])+h(e.alAhorro)}function te(e,a){return h(a.monto)-Go(e)}var Qe=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ea(e){return e.slice(0,7)}function Q(e,a){let o=h(a.monto);if(o===0)return;let t=e.get(a.nombre);t?t.monto+=o:e.set(a.nombre,{...a,monto:o})}function Ye(e,a){let o=new Map(a.map(n=>[n.ingresoId,n])),t=new Map;for(let n of e){let s=Ea(n.fecha),r=t.get(s);r||(r={mes:s,entro:0,deTrabajo:0,deFuera:0,aObligaciones:0,aMetas:0,enGastos:0,alAhorro:0,detalle:[],sinAsignar:0,_detalle:new Map},t.set(s,r));let i=h(n.monto);r.entro+=i,n.cuentaDeCobroId===void 0||n.cuentaDeCobroId===""?r.deFuera+=i:r.deTrabajo+=i;let d=o.get(n.id);if(!d){r.sinAsignar+=i;continue}for(let m of d.obligaciones)r.aObligaciones+=h(m.monto),Q(r._detalle,m);for(let m of d.abonos)r.aMetas+=h(m.monto),Q(r._detalle,m);for(let m of d.gastos??[])r.enGastos+=h(m.monto),Q(r._detalle,m);r.alAhorro+=h(d.alAhorro),r.sinAsignar+=te(d,n)}return[...t.values()].map(({_detalle:n,...s})=>({...s,detalle:[...n.values()].sort((r,i)=>i.monto-r.monto)})).sort((n,s)=>n.mes.localeCompare(s.mes))}function ya(e){let a=new Map;for(let o of e)for(let t of[...o.obligaciones,...o.abonos,...o.gastos??[]])Q(a,t);return[...a.values()].sort((o,t)=>t.monto-o.monto)}function Me(e){let[a,o]=e.split("-"),t=Number(o)-1;return Qe[t]?`${Qe[t]} de ${a}`:e}function xa(e,a,o,t=[]){let n=new Map,s=new Map,r=new Map(t.map(l=>[l.id,l.nombre])),i=l=>r.get(l)??l;for(let l of e){let d=ve(l.numero,a,Math.max(1,o)),m=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,g=n.get(m);g||(g={mes:m,entro:0,aObligaciones:0,aMetas:0,alAhorro:0,detalle:[],pagos:[]},n.set(m,g),s.set(m,new Map));let f=s.get(m);g.pagos.push(l.numero),g.entro+=h(l.ingreso);for(let v of l.obligaciones)g.aObligaciones+=h(v.monto),Q(f,{nombre:v.nombre,monto:v.monto});for(let v of l.abonos)g.aMetas+=h(v.monto),Q(f,{nombre:i(v.metaId),monto:v.monto,refId:v.metaId});g.alAhorro+=h(l.aColchon)+h(l.sobrante)}return[...n.values()].map(l=>({...l,detalle:[...s.get(l.mes).values()].sort((d,m)=>m.monto-d.monto)})).sort((l,d)=>l.mes.localeCompare(d.mes))}function Sa(e,a){let o=new Set(a.map(t=>t.cuentaDeCobroId).filter(t=>!!t));return e.cuentaDeCobroId?o.has(e.cuentaDeCobroId)?o.size:o.size+1:Math.max(1,o.size)}function N(e){return(e??[]).filter(a=>h(a.monto)!==0)}function Pa(e,a){let o=new Set([...N(a.obligaciones),...N(a.abonos)].map(t=>t.nombre));return[...N(e.obligaciones),...N(e.abonos)].map(t=>t.nombre).filter(t=>!o.has(t))}function Ra(e,a,o,t=new Map){return[...new Set([...e.map(s=>s.mes),...a.map(s=>s.mes)])].sort().map(s=>{let r=e.find(m=>m.mes===s)??null,i=a.find(m=>m.mes===s)??null,l=s<o?"pasado":s===o?"actual":"futuro",d=t.get(s)??(r?{monto:r.entro,segun:"escenario"}:null);return{mes:s,estado:l,real:i,simulado:r,esperado:d,diferencia:l==="pasado"&&d&&i?i.entro-d.monto:null}})}function Ue(e){let a=0,o=0,t=0,n=0,s=0,r=0;for(let i of e)i.real&&(n+=1,a+=i.real.entro,o+=i.real.aObligaciones+i.real.aMetas+i.real.enGastos,t+=i.real.alAhorro),i.estado==="futuro"&&i.simulado&&(r+=1,s+=i.esperado?.monto??i.simulado.entro);return{mesesConDatos:n,entroDeVerdad:a,gastadoDeVerdad:o,guardadoDeVerdad:t,faltaPorEntrar:s,mesesQueFaltan:r}}var Qo=new Map(Qe.map((e,a)=>[e,String(a+1).padStart(2,"0")]));function Yo(e,a){let o=e.toLowerCase().trim(),t=o.match(/^(\d{4})-(\d{2})/);if(t)return`${t[1]}-${t[2]}`;let n=o.match(/([a-záéíóú]+)\D+(\d{4})/);if(n){let r=Qo.get(n[1]);if(r)return`${n[2]}-${r}`}let s=a.slice().sort((r,i)=>r.fecha.localeCompare(i.fecha))[0];return s?Ea(s.fecha):null}function Ia(e,a,o,t){let n=new Map;for(let s of e){let r=a.filter(l=>l.cuentaDeCobroId!==void 0),i=Yo(s.periodo,r);i&&n.set(i,h(s.montoEsperado))}return new Map(t.map(s=>{let r=n.get(s);return[s,r!==void 0?{monto:r,segun:"cuenta_de_cobro"}:{monto:h(o),segun:"escenario"}]}))}function Ca(e,a){let o=s=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=new Map(a.map(s=>[o(s.nombre),s])),n=[];for(let s of N(e.gastos)){let r=t.get(o(s.nombre));r&&n.push({gasto:s,metaId:r.id,metaNombre:r.nombre})}return n}function ne(e,a){let o=new Map;for(let t of a)for(let n of t.abonos)n.refId&&o.set(n.refId,(o.get(n.refId)??0)+h(n.monto));return new Map(e.map(t=>{let n=h(t.valor),s=h(t.abonado??0),r=o.get(t.id)??0,i=Math.min(s+r,n);return[t.id,{previo:s,real:r,total:i,falta:Math.max(0,n-i)}]}))}function Aa(e,a){let o=ne(e,a);return e.map(t=>({...t,abonado:o.get(t.id).total}))}function La(e,a){let o=0;for(let t of ne(e,a).values())o+=t.total;return o}var Uo=600;function se(e){let a=$e(e.metas),o=e.maxPagos??Uo,t=[],n=new Map,s=new Map,r=new Map,i=new Map,l=0,d=0;for(;d<o&&[...a.values()].some(g=>g>0);){d+=1;let g=G(d,h(e.ingresoEsperado),e.obligaciones,e.colchon,e.metas,a,l);l=g.saldoAhorro,t.push(g);for(let f of g.abonos)n.has(f.metaId)||n.set(f.metaId,d),r.set(f.metaId,(r.get(f.metaId)??0)+1),i.set(f.metaId,(i.get(f.metaId)??0)+f.monto),(a.get(f.metaId)??0)<=0&&s.set(f.metaId,d)}let m=e.metas.map(g=>{let f=Math.min(h(g.abonado??0),h(g.valor)),v=i.get(g.id)??0;return{metaId:g.id,nombre:g.nombre,grupo:g.grupo,valor:g.valor,pagoInicio:n.get(g.id)??null,pagoFin:s.get(g.id)??null,cantidadPagos:r.get(g.id)??0,totalAbonado:f+v,completada:(a.get(g.id)??0)<=0,yaEstabaPagada:f>=h(g.valor)}});return{escenario:e.nombre,pagos:t,metas:m,totalPagos:d,ahorroFinal:l,incompleta:d>=o&&m.some(g=>!g.completada)}}function wa(e){let a=new Map;for(let o of e.metas){if(!o.grupo)continue;let t=a.get(o.grupo)??[];t.push(o),a.set(o.grupo,t)}return[...a.entries()].map(([o,t])=>{let n=t.map(i=>i.pagoInicio).filter(i=>i!==null),s=t.map(i=>i.pagoFin).filter(i=>i!==null),r=t.every(i=>i.completada);return{grupo:o,valor:t.reduce((i,l)=>i+l.valor,0),pagoInicio:n.length?Math.min(...n):null,pagoFin:r&&s.length?Math.max(...s):null,totalAbonado:t.reduce((i,l)=>i+l.totalAbonado,0),completado:r,yaEstabaPagado:t.every(i=>i.yaEstabaPagada)}})}function qa(e,a){return a.filter(t=>t.antesDelPago&&t.antesDelPago>0).map(t=>{let n=e.metas.find(i=>i.metaId===t.id),s=n?.pagoFin??null,r=n?.yaEstabaPagada?0:s;return{metaId:t.id,nombre:t.nombre,queria:Math.round(t.antesDelPago),termina:r,seRetrasa:r===null?null:Math.max(0,r-Math.round(t.antesDelPago))}})}function Ta(e,a){let o=h(a);if(o<=0)return null;let t=se(e),n=se({...e,ingresoEsperado:h(e.ingresoEsperado)+o,maxPagos:1}),s=new Map(n.metas.map(l=>[l.metaId,l.totalAbonado])),i=1+se({...e,metas:e.metas.map(l=>({...l,abonado:Math.max(h(l.abonado??0),s.get(l.id)??0)}))}).totalPagos;return{pendiente:o,pagosAhora:t.totalPagos,pagosSiPagan:i,seAdelanta:Math.max(0,t.totalPagos-i)}}function Je(e,a,o){return new Date(e,a-1,o)}function De(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function Jo(e){let a=e.getDay();return a===1?e:De(e,(8-a)%7)}function Xo(e){let a=e%19,o=Math.floor(e/100),t=e%100,n=Math.floor(o/4),s=o%4,r=Math.floor((o+8)/25),i=Math.floor((o-r+1)/3),l=(19*a+o-n-i+15)%30,d=Math.floor(t/4),m=t%4,g=(32+2*s+2*d-l-m)%7,f=Math.floor((a+11*l+22*g)/451),v=Math.floor((l+g-7*f+114)/31),I=(l+g-7*f+114)%31+1;return Je(e,v,I)}function Wo(e){let a=Xo(e),o=s=>De(a,s),t=[[1,1,"A\xF1o Nuevo"],[5,1,"D\xEDa del Trabajo"],[7,20,"Independencia de Colombia"],[8,7,"Batalla de Boyac\xE1"],[12,8,"Inmaculada Concepci\xF3n"],[12,25,"Navidad"]],n=[[1,6,"Reyes Magos"],[3,19,"San Jos\xE9"],[6,29,"San Pedro y San Pablo"],[8,15,"Asunci\xF3n de la Virgen"],[10,12,"D\xEDa de la Raza"],[11,1,"Todos los Santos"],[11,11,"Independencia de Cartagena"]];return[...t.map(([s,r,i])=>({fecha:Je(e,s,r),nombre:i})),...n.map(([s,r,i])=>({fecha:Jo(Je(e,s,r)),nombre:i})),{fecha:o(-3),nombre:"Jueves Santo"},{fecha:o(-2),nombre:"Viernes Santo"},{fecha:o(43),nombre:"Ascensi\xF3n del Se\xF1or"},{fecha:o(64),nombre:"Corpus Christi"},{fecha:o(71),nombre:"Sagrado Coraz\xF3n de Jes\xFAs"}].sort((s,r)=>s.fecha.getTime()-r.fecha.getTime())}var re=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;function Xe(e){return Wo(e.getFullYear()).find(a=>re(a.fecha)===re(e))?.nombre??null}function Ko(e){return Xe(e)!==null}function We(e){return e.getDay()===0}function Oa(e){let a=new Date(e.getTime());for(let o=0;o<15&&(We(a)||Ko(a));o++)a=De(a,-1);return a}var ja=30,Fa="Febrero no tiene 30: se radica el \xFAltimo d\xEDa del mes (28, o 29 si es bisiesto), y si ese d\xEDa cae domingo o festivo se retrocede igual que siempre.";function Zo(e,a){let o=new Date(e,a,0).getDate(),t=o<ja,n=new Date(e,a-1,Math.min(ja,o)),s=Oa(n),r=null;if(re(s)!==re(n)){let i=Xe(n);r=i?`el ${n.getDate()} es festivo (${i})`:We(n)?`el ${n.getDate()} cae domingo`:`el ${n.getDate()} no es d\xEDa h\xE1bil`}return{fecha:s,fechaOriginal:n,motivoDelCambio:r,usoUltimoDiaDelMes:t}}var Ke=[{id:"cuenta",nombre:"Cuenta de cobro diligenciada",frecuencia:"cada_mes",detalle:"Con una descripci\xF3n del servicio prestado."},{id:"informe",nombre:"Informe de actividades",frecuencia:"cada_mes",detalle:"Detallando espec\xEDficamente las funciones o actividades realizadas."},{id:"conformidad",nombre:"Certificado de conformidad del servicio",frecuencia:"cada_mes",detalle:"Lo entrega el coordinador o l\xEDder del \xE1rea: hay que ped\xEDrselo con tiempo."},{id:"seguridad_social",nombre:"Planilla de seguridad social",frecuencia:"cada_mes",obligatorioExplicito:!0,detalle:"Liquidada del mes VENCIDO al que se est\xE1 cobrando. La circular la marca como obligatoria."},{id:"constancia",nombre:"Constancia de prestaci\xF3n de servicio firmada por el paciente",frecuencia:"solo_asistencial",detalle:"Solo personal asistencial. Como t\xE9cnico de sistemas, no aplica."},{id:"rut",nombre:"RUT actualizado",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez."},{id:"bancaria",nombre:"Certificaci\xF3n bancaria",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez, o si cambia de cuenta."}];function Ee(){return Ke.filter(e=>e.frecuencia==="cada_mes")}var et=5;function at(e,a){let o=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),t=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return Math.round((t-o)/864e5)}var _a=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ze(e,a=[]){let o=Zo(e.getFullYear(),e.getMonth()+1),t=at(e,o.fecha),n=t<0?"vencido":t===0?"hoy":t<=et?"pronto":"tranquilo",s=o.fecha.getDate(),r=_a[o.fecha.getMonth()],i=n==="vencido"?`Se pas\xF3 la fecha: hab\xEDa que radicar el ${s} de ${r}`:n==="hoy"?"HOY es el \xFAltimo d\xEDa para radicar la cuenta de cobro":n==="pronto"?`Faltan ${t} d\xEDas: radicas el ${s} de ${r}`:`La cuenta de cobro se radica el ${s} de ${r}`,l=Ee().filter(d=>!a.includes(d.id)).map(d=>d.id);return{limite:o,diasQueFaltan:t,urgencia:n,titular:i,soportesPendientes:l}}function Na(e){let a=e.fecha.getDate(),o=_a[e.fecha.getMonth()];return e.motivoDelCambio?`Se radica el ${a} de ${o}, no el ${e.fechaOriginal.getDate()}, porque ${e.motivoDelCambio}.`:`Se radica el ${a} de ${o}.`}function ye(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function ot(){return new Date().toISOString().slice(0,10)}function tt(){return[]}function k(){return{version:1,escenario:{nombre:"Mi escenario",ingresoEsperado:2e6,colchonBase:1e5,colchonMinimo:0,colchonElastico:!1,fechaPrimerPago:ot(),diasOptimista:30,diasPesimista:60},obligaciones:tt(),metas:[],cuentas:[],ingresos:[],repartos:[],soportesMarcados:{}}}function z(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}var ka="gestiondinerotrabajo.estado";function za(e){let a=k();if(typeof e!="object"||e===null)return a;let o=e;return{version:1,escenario:{...a.escenario,...o.escenario??{}},obligaciones:o.obligaciones??a.obligaciones,metas:o.metas??a.metas,cuentas:o.cuentas??a.cuentas,ingresos:o.ingresos??a.ingresos,repartos:o.repartos??a.repartos,soportesMarcados:o.soportesMarcados??a.soportesMarcados}}function Ha(){let e=null;try{e=localStorage.getItem(ka)}catch{return{estado:k(),aviso:{texto:"No pude leer los datos guardados. Est\xE1s viendo un inicio en blanco.",grave:!0}}}if(!e)return{estado:k(),aviso:null};try{return{estado:za(JSON.parse(e)),aviso:null}}catch{return{estado:k(),aviso:{texto:"Los datos guardados est\xE1n da\xF1ados. No los borr\xE9: sigue ah\xED el archivo por si se puede recuperar.",grave:!0}}}}function ie(e){try{return localStorage.setItem(ka,JSON.stringify(e)),null}catch(a){return a instanceof Error?a.message:"no se pudo guardar"}}function Va(e){return JSON.stringify(e,null,2)}function ea(e){try{return{estado:za(JSON.parse(e)),aviso:null}}catch{return{estado:null,aviso:{texto:"Ese archivo no es un respaldo v\xE1lido. No cambi\xE9 nada de lo que ten\xEDas.",grave:!0}}}}var aa=null;function Y(e){return aa?.(),new Promise(a=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${xe(e.titulo)}</h3>
        ${e.detalle?`<p class="dlg-detalle">${xe(e.detalle)}</p>`:""}
        <input class="dlg-campo" type="text" ${e.dinero?'inputmode="numeric" data-dinero':""}
               value="${xe(e.valorInicial??"")}" />
        <div class="dlg-botones">
          <button class="dlg-cancelar">Cancelar</button>
          <button class="primario dlg-aceptar">${xe(e.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=o.querySelector(".dlg-campo"),n=i=>{document.removeEventListener("keydown",r,!0),o.remove(),aa=null,a(i)},s=()=>n(t.value);function r(i){i.key==="Escape"&&(i.preventDefault(),n(null)),i.key==="Enter"&&document.activeElement===t&&(i.preventDefault(),s())}o.querySelector(".dlg-aceptar").addEventListener("click",s),o.querySelector(".dlg-cancelar").addEventListener("click",()=>n(null)),o.addEventListener("mousedown",i=>{i.target===o&&n(null)}),document.addEventListener("keydown",r,!0),document.body.appendChild(o),aa=()=>n(null),t.focus(),t.select()})}function xe(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var Ba=new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});function oa(e){return e.replace(/\D/g,"")}function st(e){let a=oa(e);if(a==="")return"";let o=a.replace(/^0+(?=\d)/,"");return Ba.format(Number(o))}function C(e){let a=oa(e);return a===""?0:Number(a)}function R(e){return Ba.format(Math.round(e))}function Ga(e){let a=e.value,o=e.selectionStart??a.length,t=oa(a.slice(0,o)).length,n=st(a);if(n===a)return;e.value=n;let s=0,r=0;for(;r<n.length&&s<t;)/\d/.test(n[r])&&s++,r++;e.setSelectionRange(r,r)}function Qa(e,a){let o=[],t=0;for(let n of a){let s=Math.max(1,Math.round(n)||1),r=e[t];o.push(s>1||!r?null:r),t+=s}return o}var rt=4;function Ya(e){return e.length>=rt}var H="__borrado";function Se(e,a){return e[a]??""}function U(e){if(e==null)return"null";if(Array.isArray(e))return`[${e.map(U).join(",")}]`;if(typeof e=="object"){let a=e;return`{${Object.keys(a).filter(t=>a[t]!==void 0).sort().map(t=>`${JSON.stringify(t)}:${U(a[t])}`).join(",")}}`}return JSON.stringify(e)}function Pe(e,a){return U(e)===U(a)}function Ua(e,a,o,t){return e!==o?e>o:U(a)>=U(t)}function Ja(e,a,o,t={}){let n={...t},s=new Set([...Object.keys(e??{}),...Object.keys(a)]);for(let r of s){if(r==="id")continue;let i=e===null?void 0:e[r],l=a[r];Pe(i,l)||(n[r]=o)}return n}function it(e,a){if(e.datos.id!==a.datos.id)throw new Error(`No se pueden fusionar dos filas distintas: ${e.datos.id} y ${a.datos.id}.`);let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t={id:e.datos.id},n={},s=[];for(let g of o){if(g==="id")continue;let f=e.datos[g],v=a.datos[g],I=Se(e.tocado,g),y=Se(a.tocado,g),E=Ua(I,f,y,v),D=E?f:v,S=E?v:f;D!==void 0&&(t[g]=D);let O=I>y?I:y;O!==""&&(n[g]=O),Pe(f,v)||s.push({id:e.datos.id,campo:g,valor:S,cuando:E?y:I,gano:D})}let r=Se(e.tocado,H),i=Se(a.tocado,H),l=Ua(r,e.borradoEn,i,a.borradoEn),d=l?e.borradoEn:a.borradoEn,m=r>i?r:i;return m!==""&&(n[H]=m),Pe(e.borradoEn,a.borradoEn)||s.push({id:e.datos.id,campo:H,valor:l?a.borradoEn:e.borradoEn,cuando:l?i:r,gano:d}),{fila:{datos:t,tocado:n,borradoEn:d??null},descartes:s}}function Xa(e,a){let o=new Map(a.map(s=>[s.datos.id,s])),t=[],n=[];for(let s of e){let r=o.get(s.datos.id);if(!r){t.push(s);continue}let i=it(s,r);t.push(i.fila),n.push(...i.descartes),o.delete(s.datos.id)}for(let s of a)o.has(s.datos.id)&&t.push(s);return{filas:t,descartes:n}}function Wa(e,a){return a?e.filter(o=>{let t=a.get(o.id);if(!t)return!0;let n=o.campo===H?t.borradoEn:t.datos[o.campo];return!Pe(o.valor,n)}):e}var ta=["escenario","obligaciones","metas","cuentas","ingresos","repartos","soportes"],ct="escenario";function V(e,a){return{datos:{...a,id:e},tocado:{},borradoEn:null}}function Re(e){return{escenario:[V(ct,{...e.escenario})],obligaciones:e.obligaciones.map(a=>V(a.id,{...a})),metas:e.metas.map(a=>V(a.id,{...a})),cuentas:e.cuentas.map(a=>V(a.id,{...a})),ingresos:e.ingresos.map(a=>V(a.id,{...a})),repartos:e.repartos.map(a=>V(a.id,{...a})),soportes:Object.entries(e.soportesMarcados).map(([a,o])=>V(a,{marcados:o}))}}function Ka(e,a){let o=r=>(e[r]??[]).filter(i=>i.borradoEn===null),t=r=>e[r]!==void 0&&e[r].length>0,n=t("escenario")?{...a.escenario,...o("escenario")[0]?.datos}:a.escenario;n&&"id"in n&&delete n.id;let s={};for(let r of o("soportes")){let i=r.datos.marcados;s[r.datos.id]=Array.isArray(i)?i:[]}return{version:a.version,escenario:n,obligaciones:t("obligaciones")?o("obligaciones").map(r=>r.datos):a.obligaciones,metas:t("metas")?o("metas").map(r=>r.datos):a.metas,cuentas:t("cuentas")?o("cuentas").map(r=>r.datos):a.cuentas,ingresos:t("ingresos")?o("ingresos").map(r=>r.datos):a.ingresos,repartos:t("repartos")?o("repartos").map(r=>r.datos):a.repartos,soportesMarcados:t("soportes")?s:a.soportesMarcados}}function Za(e){return{id:e.datos.id,datos:e.datos,tocado:e.tocado,borrado_en:e.borradoEn}}function eo(e){let a=e.datos??{};return{datos:{...a,id:String(e.id??a.id??"")},tocado:e.tocado??{},borradoEn:e.borrado_en??null}}function ao(e,a,o,t={}){let n=Re(e),s=a?Re(a):null,r={};for(let i of ta){let l=new Map((s?.[i]??[]).map(f=>[f.datos.id,f])),d=t[i]??new Map,m=n[i].map(f=>({...f,tocado:Ja(l.get(f.datos.id)?.datos??null,f.datos,o,d.get(f.datos.id)??{})})),g=new Set(n[i].map(f=>f.datos.id));for(let[f,v]of l)g.has(f)||m.push({datos:v.datos,tocado:{...d.get(f)??{},[H]:o},borradoEn:o});r[i]=m}return r}var B={url:"https://voncmkjcxzgxfloehovb.supabase.co",clave:"sb_publishable_Ev68VoFXNXqvcVOjgXoknw_vAFK-iHn"},na="gestiondinerotrabajo.sesion",sa="gestiondinerotrabajo.ultimaSincronizacion",Ie="gestiondinerotrabajo.nube.sincronizado";function Ce(){try{let e=localStorage.getItem(na);return e?JSON.parse(e):null}catch{return null}}function ra(e){try{e?localStorage.setItem(na,JSON.stringify(e)):localStorage.removeItem(na)}catch{}}function ia(){ra(null);try{localStorage.removeItem(sa),localStorage.removeItem(Ie)}catch{}}function oo(){try{let e=localStorage.getItem(Ie);return e?JSON.parse(e):null}catch{return null}}function to(e){try{e?localStorage.setItem(Ie,JSON.stringify(e)):localStorage.removeItem(Ie)}catch{}}async function no(e,a){let o=await fetch(`${B.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:B.clave,"Content-Type":"application/json"},body:JSON.stringify({email:e.trim(),password:a})}),t=await o.json().catch(()=>({}));if(!o.ok)throw new Error(lt(o.status,t));let n={token:t.access_token,refresco:t.refresh_token,usuarioId:t.user?.id??"",correo:t.user?.email??e.trim(),caduca:Date.now()+(Number(t.expires_in)||3600)*1e3};if(!n.token||!n.usuarioId)throw new Error("Supabase respondi\xF3 sin sesi\xF3n. Revisa la direcci\xF3n del proyecto.");return ra(n),n}function lt(e,a){let o=String(a.error_description??a.msg??a.message??"");return e===400&&/invalid login|credentials/i.test(o)?"Correo o contrase\xF1a incorrectos.":e===400&&/email not confirmed/i.test(o)?"Falta confirmar el correo: mira el mensaje que te mand\xF3 Supabase.":e===422?"Ese correo no tiene un formato v\xE1lido.":e===429?"Demasiados intentos seguidos. Espera un momento.":o||`No se pudo entrar (error ${e}).`}async function dt(){let e=Ce();if(!e)throw new Error("No has entrado con tu correo.");if(Date.now()<e.caduca-6e4)return e;let a=await fetch(`${B.url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:B.clave,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e.refresco})});if(!a.ok)throw ia(),new Error("La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.");let o=await a.json(),t={...e,token:o.access_token,refresco:o.refresh_token??e.refresco,caduca:Date.now()+(Number(o.expires_in)||3600)*1e3};return ra(t),t}function so(e){return{apikey:B.clave,Authorization:`Bearer ${e.token}`,"Content-Type":"application/json"}}async function ut(e,a,o){let t=o?`&actualizado_en=gt.${encodeURIComponent(o)}`:"",n=await fetch(`${B.url}/rest/v1/${a}?select=*${t}`,{headers:so(e)});if(!n.ok)throw new Error(await ro(n,a,"bajar"));return(await n.json()).map(eo)}async function pt(e,a,o){if(o.length===0)return;let t=o.map(s=>({...Za(s),usuario_id:e.usuarioId})),n=await fetch(`${B.url}/rest/v1/${a}?on_conflict=usuario_id,id`,{method:"POST",headers:{...so(e),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(t)});if(!n.ok)throw new Error(await ro(n,a,"subir"))}async function ro(e,a,o){let t=await e.text().catch(()=>"");return e.status===401?"La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.":e.status===404||/does not exist/i.test(t)?`Falta la tabla \xAB${a}\xBB en Supabase: ejecuta supabase/esquema.sql.`:e.status===403||/permission denied/i.test(t)?`Sin permiso sobre \xAB${a}\xBB. Revisa los grants del esquema.`:`No se pudo ${o} \xAB${a}\xBB (error ${e.status}).`}async function io(e,a,o){let t=await dt(),n=Ae(),s=ao(e,a,o),r=a?Re(a):null,i={},l=[];for(let m of ta){let g=s[m],f=await ut(t,m,n),v=Xa(g,f);i[m]=v.filas;let I=r?new Map(r[m].map(D=>[D.datos.id,{datos:D.datos,borradoEn:D.borradoEn}])):null,y=new Map(v.filas.map(D=>[D.datos.id,D.datos]));l.push(...Wa(v.descartes,I).map(D=>{let S=y.get(D.id),O=typeof S?.nombre=="string"?S.nombre:typeof S?.periodo=="string"?S.periodo:void 0;return{...D,tabla:m,nombre:O}}));let E=new Set(g.filter(D=>Object.keys(D.tocado).length>0).map(D=>D.datos.id));for(let D of v.descartes)E.add(D.id);await pt(t,m,v.filas.filter(D=>E.has(D.datos.id)))}let d=new Date().toISOString();try{localStorage.setItem(sa,d)}catch{}return{estado:Ka(i,e),descartes:l,cuando:d}}function Ae(){try{return localStorage.getItem(sa)}catch{return null}}var qe="__borrado",we=new Intl.NumberFormat("es-CO"),mt={obligaciones:"obligaciones",abonos:"abonos a metas",gastos:"gastos",cambios:"cambios de valor",valor:"valor",nombre:"nombre",grupo:"grupo",abonado:"ya pagado antes",alAhorro:"al ahorro",monto:"monto",fecha:"fecha",ingresoEsperado:"ingreso esperado",fechaPrimerPago:"fecha del primer pago",marcados:"soportes marcados",clase:"compra o deuda"};function ca(e,a){switch(e.tabla){case"metas":{let o=a.metas.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la meta \xAB${o}\xBB`:"una meta que ya no est\xE1"}case"obligaciones":{let o=a.obligaciones.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la obligaci\xF3n \xAB${o}\xBB`:"una obligaci\xF3n que ya no est\xE1"}case"cuentas":{let o=a.cuentas.find(t=>t.id===e.id);return o?`la cuenta de cobro de ${o.periodo}`:"una cuenta de cobro que ya no est\xE1"}case"ingresos":{let o=a.ingresos.find(t=>t.id===e.id);return o?`el pago del ${o.fecha} (${we.format(o.monto)})`:"un pago que ya no est\xE1"}case"repartos":{let o=a.repartos.find(n=>n.id===e.id),t=o?a.ingresos.find(n=>n.id===o.ingresoId):void 0;return t?`el reparto del pago del ${t.fecha} (${we.format(t.monto)})`:"un reparto de un pago que ya no est\xE1"}case"escenario":return"el escenario";case"soportes":return`los soportes de ${e.id}`}}function la(e){return e===qe?"borrado":mt[e]??e}function Te(e,a){return e===qe?a?"borrada":"sin borrar":Le(a)}function Le(e){if(e==null||e==="")return"\u2014";if(typeof e=="number")return we.format(e);if(typeof e=="boolean")return e?"s\xED":"no";if(typeof e=="string")return e;if(Array.isArray(e))return e.length===0?"nada":e.map(Le).join(" \xB7 ");if(typeof e=="object"){let a=e;if(typeof a.nombre=="string"&&typeof a.monto=="number")return`${a.nombre} ${we.format(a.monto)}`;if(typeof a.desdePago=="number"&&"valor"in a)return`desde el pago ${a.desdePago}: ${Le(a.valor)}`;let o=Object.keys(a).sort().filter(t=>a[t]!==void 0).map(t=>`${la(t)}: ${Le(a[t])}`);return o.length?o.join(", "):"\u2014"}return String(e)}var ce=[{id:"inicio",rotulo:"Inicio",icono:"\u{1F3E0}",paneles:["inicio","radicacion"]},{id:"calendario",rotulo:"Calendario",icono:"\u{1F5D3}\uFE0F",paneles:["vista"]},{id:"metas",rotulo:"Metas",icono:"\u{1F3AF}",paneles:["metas","proyeccion"]},{id:"registrar",rotulo:"Registrar",icono:"\u{1F4B5}",paneles:["cuentas","real"]},{id:"ajustes",rotulo:"Ajustes",icono:"\u2699\uFE0F",paneles:["escenario","obligaciones","nube"]}],gt="inicio";function co(e){return ce.find(a=>a.paneles.includes(e))?.id??null}function Oe(e){return ce.some(a=>a.id===e)?e:gt}var lo=new Intl.NumberFormat("es-CO"),da=e=>`$${lo.format(Math.round(e))}`;function uo(e,a,o){let t=[];return t.push(`${e.clase==="deuda"?"\u26A0\uFE0F ":""}${e.nombre.trim()||"(sin nombre)"}`),t.push(da(e.valor)),e.compra?t.push("ya la compraste"):a?.yaEstabaPagada?t.push("ya est\xE1 pagada"):o?t.push(o):t.push("sin fecha todav\xEDa"),t.join(" \xB7 ")}function po(e,a){let o=e.tipo==="porcentaje"?`${bt(e.valor*100)} %${a?` = ${da(a)}`:""}`:da(e.valor),t=e.modo==="cada_pago"?"cada pago":e.modo==="puntual"?"puntual":e.modo==="primer_pago"?"solo el primero":String(e.modo),n=[e.nombre.trim()||"(sin nombre)",o,t];return(e.cambios?.length??0)>0&&n.push(`${e.cambios.length} cambio${e.cambios.length===1?"":"s"}`),n.join(" \xB7 ")}function bt(e){return Number.isInteger(e)?String(e):lo.format(Math.round(e*10)/10)}function mo(e,a){let o=new Map(a.map(s=>[s.metaId,s])),t=e.filter(s=>!s.compra&&!o.get(s.id)?.yaEstabaPagada&&s.valor>0),n=null;for(let s of t){let r=o.get(s.id)?.pagoFin??null;r!==null&&(!n||r<n.pagoFin)&&(n={meta:s,pagoFin:r})}return n||(t.length>0?{meta:t[0],pagoFin:null}:null)}function ua(e,a){return e.compra||e.valor<=0?1:Math.max(0,Math.min(1,a/e.valor))}function go(e,a){if(a.campo===qe)return{ok:!1,motivo:"Un borrado no se puede deshacer desde aqu\xED: vuelve a crear esa fila."};if(a.campo==="id")return{ok:!1,motivo:"El identificador de una fila no se cambia."};let o=ht(e,a);if(!o)return{ok:!1,motivo:"Eso ya no est\xE1 en este aparato."};let t=ft(a);return a.valor===void 0?delete o[t]:o[t]=a.valor,{ok:!0}}function ft(e){return e.tabla==="soportes"?e.id:e.campo}function ht(e,a){let o=t=>t.find(n=>n.id===a.id)??null;switch(a.tabla){case"escenario":return e.escenario;case"metas":return o(e.metas);case"obligaciones":return o(e.obligaciones);case"cuentas":return o(e.cuentas);case"ingresos":return o(e.ingresos);case"repartos":return o(e.repartos);case"soportes":return a.campo!=="marcados"?null:e.soportesMarcados;default:return null}}var vt=new Intl.NumberFormat("es-CO"),u=e=>`$${vt.format(Math.round(e))}`,c,M=null;function X(e=new Date){let a=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${a}-${o}`}function p(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var b=new Map;function ho(e){if(!(e instanceof HTMLInputElement)&&!(e instanceof HTMLSelectElement))return null;let a=[e.id&&`#${e.id}`,e.dataset.accion&&`[data-accion="${e.dataset.accion}"]`,e.dataset.id&&`[data-id="${e.dataset.id}"]`,e.dataset.campo&&`[data-campo="${e.dataset.campo}"]`,e.dataset.tipo&&`[data-tipo="${e.dataset.tipo}"]`,e.dataset.i!==void 0&&`[data-i="${e.dataset.i}"]`].filter(Boolean);return a.length>0?a.join(""):null}var je=null,ma=null,de=!1,J=!1;var ke=null,w=null,$t=6,Ne=!1;function Mt(e){let o=window.innerHeight;e<90?window.scrollBy({top:-Math.max(6,(90-e)/3),behavior:"instant"}):e>o-90&&window.scrollBy({top:Math.max(6,(e-(o-90))/3),behavior:"instant"})}function vo(e,a){return document.elementFromPoint(e,a)?.closest?.("tr[data-fila]")??null}function Dt(e){for(let a of document.querySelectorAll(".destino"))a.classList.remove("destino");e&&Number(e.dataset.fila)!==w?.desde&&e.classList.add("destino")}function $o(){w?.fila.classList.remove("arrastrando");for(let e of document.querySelectorAll(".destino"))e.classList.remove("destino");w=null}document.addEventListener("pointerdown",e=>{let a=e.target?.closest?.(".asa"),o=a?.closest("tr[data-fila]");!a||!o||(w={desde:Number(o.dataset.fila),fila:o,movido:!1,y0:e.clientY},o.classList.add("arrastrando"),a.setPointerCapture?.(e.pointerId),e.preventDefault())});document.addEventListener("pointermove",e=>{w&&(!w.movido&&Math.abs(e.clientY-w.y0)<$t||(w.movido=!0,e.preventDefault(),Mt(e.clientY),Dt(vo(e.clientX,e.clientY))))});document.addEventListener("pointerup",e=>{if(!w)return;let{desde:a,movido:o}=w,t=vo(e.clientX,e.clientY);if($o(),!o||!t)return;Ne=!0,setTimeout(()=>{Ne=!1},0);let n=Number(t.dataset.fila);if(!Number.isInteger(n)||n===a)return;let[s]=c.metas.splice(a,1);c.metas.splice(n,0,s),M={texto:`\xAB${s.nombre}\xBB qued\xF3 en la posici\xF3n ${n+1}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron.`,malo:!1},$()});document.addEventListener("pointercancel",()=>{w&&($o(),P())});document.addEventListener("mousedown",e=>{let a=e.target;de=a?.closest("button[data-accion]")!==null&&a?.closest("button[data-accion]")!==void 0,je=ho(a?.closest("input, select")??null),ma=a?.closest?.("[data-panel]")?.dataset.panel??null},!0);document.addEventListener("mouseup",()=>{setTimeout(()=>{de=!1,ma=null,J&&(J=!1,ba())},0)},!0);function Et(e,a){let o=je!==null,t=je??e;if(je=null,!t)return;let n=document.querySelector(t);if(n&&(n.focus(),!o&&a!==null&&typeof n.setSelectionRange=="function"))try{n.setSelectionRange(a,a)}catch{}}function T(){Mo()||ba()}function $(){Mo()||P()}function Mo(){let e=ie(c);return e&&(M={texto:`No pude guardar: ${e}`,malo:!0}),de?(J=!0,!0):!1}function A(){let e=c.escenario;return{desde:new Date(`${e.fechaPrimerPago}T12:00:00`),diasOptimista:e.diasOptimista,diasPesimista:e.diasPesimista}}function Do(){let e=c.escenario;return{nombre:e.nombre,ingresoEsperado:e.ingresoEsperado,obligaciones:c.obligaciones,colchon:{nombre:"Otros / Ahorro",base:e.colchonBase,minimo:e.colchonMinimo,elastico:e.colchonElastico,cambios:e.cambiosColchon},metas:Aa(c.metas,c.repartos)}}function yt(){return`${(c.escenario.cambiosColchon??[]).map((a,o)=>{let t=j(L(Math.max(1,a.desdePago),A()).optimista);return`<div class="cambio">
      <span class="rango">desde el</span>
      <input type="number" min="1" step="1" value="${a.desdePago}" class="corto"
        data-accion="cambio-ahorro" data-i="${o}" data-campo="desdePago" />
      <input type="text" inputmode="numeric" data-dinero value="${R(a.valor)}"
        class="corto-dinero" data-accion="cambio-ahorro" data-i="${o}" data-campo="valor" />
      <span class="rango">${p(t)}</span>
      <button class="icono" data-accion="borrar-cambio-ahorro" data-i="${o}" title="Quitar">\u2715</button>
    </div>`}).join("")}<button class="chico" data-accion="nuevo-cambio-ahorro">+ cambio</button>`}function xt(){let e=c.escenario;return`
  <section class="panel">
    <h2>Escenario <span class="sufijo">\u2014 el supuesto sobre lo que va a entrar</span></h2>
    <div class="campos">
      <div class="campo">
        <label for="ingreso">Lo que espero por pago</label>
        <input id="ingreso" type="text" inputmode="numeric" data-dinero
               value="${R(e.ingresoEsperado)}"
               data-accion="escenario" data-campo="ingresoEsperado" />
      </div>
      <div class="campo">
        <label for="colchon">Otros / Ahorro por pago</label>
        <input id="colchon" type="text" inputmode="numeric" data-dinero
               value="${R(e.colchonBase)}"
               data-accion="escenario" data-campo="colchonBase" />
      </div>
      <div class="campo">
        <label for="minimo">Del ahorro no bajar de</label>
        <input id="minimo" type="text" inputmode="numeric" data-dinero
               value="${R(e.colchonMinimo)}"
               title="Solo aplica con el interruptor de abajo encendido"
               data-accion="escenario" data-campo="colchonMinimo" />
      </div>
      <div class="campo">
        <label>El ahorro cambia</label>
        ${yt()}
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
      Con ${e.diasPesimista} d\xEDas, el pago ${Ge(A())?10:12} caer\xEDa
      ${(()=>{let a=A();return`<strong>${Math.round(11*(e.diasPesimista-e.diasOptimista)/30)} meses</strong> m\xE1s tarde que si fueran puntuales`})()}.
    </p>`:""}
  </section>`}var St={cada_pago:"Cada pago",primer_pago:"Solo el primer pago",puntual:"Puntual: cuando yo la marque"},Eo={siempre:"asumo que la pago siempre",cada_dos_pagos:"asumo un pago s\xED y otro no",nunca:"asumo que no la pago"};function yo(e,a,o){let t=e??1,n=j(L(t,A()).optimista);return`<input type="number" min="1" step="1" value="${t}" class="corto"
             data-accion="${a}" data-id="${o}" data-campo="desdePago" />
          <span class="rango mes-de-pago">${t<=1?"desde el primero":p(n)}</span>`}function ze(){let e=c.cuentas.filter(a=>a.montoEsperado>0);if(e.length>0){let a=e.reduce((o,t)=>t.periodo.localeCompare(o.periodo)>0?t:o);return{monto:a.montoEsperado,de:a.periodo,esReal:!0}}return{monto:c.escenario.ingresoEsperado,de:"lo que esperas por pago",esReal:!1}}function Pt(e){let a=ze();if(a.monto<=0)return'<span class="rango">\u2014</span>';let o=e.tipo==="porcentaje"?ae(a.monto,e.valor):e.valor;return`<span class="calculado">${u(o)}</span>`}function Rt(e){let a=e.cambios??[];if(a.length===0)return"";let o=e.tipo==="porcentaje",t=(n,s)=>{let r=j(L(Math.max(1,n.desdePago),A()).optimista);return`<span class="cambio">
      <span class="rango">desde el pago</span>
      <input type="number" min="1" step="1" value="${n.desdePago}" class="corto"
        data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="desdePago" />
      <span class="rango">(${p(r)}) pasa a</span>
      ${o?`<input type="number" min="0" max="100" step="0.5" value="${n.valor*100}" class="corto"
             data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" /><span class="rango">%</span>`:`<input type="text" inputmode="numeric" data-dinero value="${R(n.valor)}"
             class="corto-dinero" data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" />`}
      <button class="icono" data-accion="borrar-cambio" data-id="${e.id}" data-i="${s}"
        title="Quitar este cambio">\u2715</button>
    </span>`};return`<tr class="fila-cambios" data-hija-de="${e.id}">
    <td colspan="9"><span class="rango">${p(e.nombre)} \xB7</span>
      ${a.map(t).join("")}</td>
  </tr>`}function It(e){let a=e.modo==="puntual",o=ze(),t=o.monto>0&&e.tipo==="porcentaje"?ae(o.monto,e.valor):null;return`
  <tr data-id-fila="${e.id}" data-resumen="${p(po(e,t))}"
      class="${e.id===ke?"abierta":""}">
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
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`:`<input type="text" inputmode="numeric" data-dinero value="${R(e.valor)}"
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`}
      <button class="chico" data-accion="nuevo-cambio" data-id="${e.id}"
        title="A partir de cierto pago, esto pasa a valer otra cosa">+ cambio</button>
    </td>
    <td class="num">${Pt(e)}</td>
    <td class="desde">${yo(e.desdePago,"oblig",e.id)}</td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="modo">
        ${Object.entries(St).map(([n,s])=>`<option value="${n}" ${e.modo===n?"selected":""}>${s}</option>`).join("")}
      </select>
    </td>
    <td>
      ${a?`<select data-accion="oblig" data-id="${e.id}" data-campo="supuesto">
        ${Object.entries(Eo).map(([n,s])=>`<option value="${n}" ${(e.supuesto??"siempre")===n?"selected":""}>${s}</option>`).join("")}
      </select>`:'<span class="rango">\u2014</span>'}
    </td>
    <td class="num"><button class="icono" data-accion="borrar-oblig" data-id="${e.id}" title="Quitar">\u2715</button></td>
  </tr>`}function pa(e,a){return G(e,a,c.obligaciones,{nombre:"",base:0,minimo:0,elastico:!1},[],new Map,0).obligaciones.reduce((t,n)=>t+n.monto,0)}function Ct(){let e=ze();if(e.monto<=0)return"";let a=pa(1,e.monto),o=pa(2,e.monto),t=(s,r)=>`
    <div><span class="rotulo">${s}</span>
      <span class="valor">${u(e.monto-r)}</span>
      <span class="rotulo">libre para metas \xB7 se van ${u(r)}</span></div>`,n=e.esReal?`Calculado sobre <strong>${p(e.de)}</strong>: ${u(e.monto)}, que es lo que
       esperas cobrar de verdad. Si no hubiera cuenta de cobro registrada, saldr\xEDa del
       escenario de arriba.`:`Calculado sobre el escenario de arriba (${u(e.monto)}), que es una <em>suposici\xF3n</em>.
       En cuanto registres una cuenta de cobro, esta cifra sale de ah\xED.`;return`<div class="resumen resumen-oblig">
    ${t("En el primer pago",a)}
    ${a!==o?t("En los siguientes",o):""}
  </div>
  <p class="nota ${e.esReal?"":"aviso"}">${n}</p>`}function At(){let e=c.obligaciones.filter(a=>a.modo==="puntual");return c.obligaciones.length===0?`
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
        <tbody>${c.obligaciones.map(a=>It(a)+Rt(a)).join("")}</tbody>
      </table>
    </div>
    ${Ct()}
    <p class="nota"><button data-accion="nueva-oblig">+ Agregar obligaci\xF3n</button>
      ${So("obligaciones")}
      ${xo("obligaciones")}</p>
    ${e.length?`<p class="nota aviso">
      Las puntuales no se pueden adivinar. Para calcular las fechas
      ${e.map(a=>`<strong>${p(a.nombre)}</strong>: ${Eo[a.supuesto??"siempre"]}`).join(" \xB7 ")}.
    </p>`:""}
  </section>`}function Lt(e){if(!e.compra)return`<button data-accion="comprada" data-id="${e.id}">Ya la compr\xE9</button>`;let a=e.compra.precioReal-e.valor;return`<span class="completa">${p(Me(e.compra.mes))}</span>
    <span class="rango">${u(e.compra.precioReal)}${a===0?"":a<0?` \xB7 ${u(-a)} menos`:` \xB7 ${u(a)} m\xE1s`}</span>
    <button class="icono" data-accion="no-comprada" data-id="${e.id}" title="No la compr\xE9">\u2715</button>`}function wt(e){let a=ne(c.metas,c.repartos).get(e.id),o=a.previo>0&&a.real>0&&Math.abs(a.previo-a.real)<=Math.max(1e3,a.real*.05),t=`<input type="text" inputmode="numeric" data-dinero value="${R(a.previo)}"
      title="Lo que ya le hab\xEDas abonado a esta meta ANTES de empezar a usar el programa"
      data-accion="meta" data-id="${e.id}" data-campo="abonado" />`;return a.real===0?t:`${t}
    <span class="rango">+ ${u(a.real)} de lo real</span>
    <span class="${a.falta===0?"completa":""}">= ${u(a.total)}</span>
    ${o?`<span class="aviso">\u26A0\uFE0F ${u(a.previo)} escrito a mano y ${u(a.real)}
      registrado: \xBFes el mismo dinero?
      <button class="icono" data-accion="quitar-previo" data-id="${e.id}"
        title="S\xED, dejar solo lo registrado">\u2713</button></span>`:""}`}function xo(e){return`<span class="solo-telefono plegado-todo">
    <button class="chico" data-accion="desplegar-todo" data-lista="${e}">Desplegar todo</button>
    <button class="chico" data-accion="plegar-todo" data-lista="${e}">Plegar todo</button>
  </span>`}function So(e){if((e==="metas"?c.metas.length:c.obligaciones.length)<2)return"";let o=e==="metas"?' title="Ojo: en las metas el orden es la prioridad de pago, as\xED que esto cambia el plan"':"";return`&nbsp; <span class="rango">Ordenar por</span>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="nombre"${o}>nombre</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="valor"${o}>valor</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="grupo"${o}>grupo</button>`}function qt(e,a,o,t,n){return`
  <tr data-fila="${a}" data-id-fila="${e.id}"
      data-resumen="${p(uo(e,n,t))}"
      class="${e.clase==="deuda"?"es-deuda":""} ${e.id===ke?"abierta":""}">
    <td class="orden">
      <span class="asa" title="Arrastra para moverla de sitio">\u283F</span>
      <button class="icono" data-accion="subir" data-i="${a}" ${a===0?"disabled":""} title="Subir">\u2191</button>
      <button class="icono" data-accion="bajar" data-i="${a}" ${a===o-1?"disabled":""} title="Bajar">\u2193</button>
    </td>
    <td><input class="ancho" value="${p(e.nombre)}" data-accion="meta" data-id="${e.id}" data-campo="nombre" />
      <select class="clase-meta" data-accion="meta" data-id="${e.id}" data-campo="clase"
        title="Solo para distinguirlas de un vistazo: no cambia el orden ni el reparto">
        <option value="compra" ${e.clase!=="deuda"?"selected":""}>\u{1F6D2} quiero comprarla</option>
        <option value="deuda" ${e.clase==="deuda"?"selected":""}>\u26A0\uFE0F ya la debo</option>
      </select></td>
    <td class="num"><input type="text" inputmode="numeric" data-dinero value="${R(e.valor)}"
        data-accion="meta" data-id="${e.id}" data-campo="valor" /></td>
    <td><input value="${p(e.grupo??"")}" placeholder="ninguno"
        data-accion="meta" data-id="${e.id}" data-campo="grupo" /></td>
    <td class="desde">${yo(e.desdePago,"meta",e.id)}
      <div class="plazo"><span class="rango">la quiero antes del</span>
        <input type="number" min="0" step="1" class="corto" value="${e.antesDelPago??""}"
          placeholder="\u2014" title="Solo para avisarte: no cambia el orden de pago"
          data-accion="meta" data-id="${e.id}" data-campo="antesDelPago" />
        ${e.antesDelPago&&e.antesDelPago>0?`<span class="rango">${p(j(L(e.antesDelPago,A()).optimista))}</span>`:""}</div>
    </td>
    <td class="num ritmo">
      <input type="text" inputmode="numeric" data-dinero
        value="${e.maximoPorPago?R(e.maximoPorPago):""}" placeholder="sin tope"
        title="M\xE1ximo que puede recibir en un pago"
        data-accion="meta" data-id="${e.id}" data-campo="maximoPorPago" />
      <span class="rango">o en <input type="number" min="0" step="1" class="corto"
        value="${e.enCuotas??""}" placeholder="\u2014"
        title="Reunirla en tantos pagos: la cuota la calculo yo"
        data-accion="meta" data-id="${e.id}" data-campo="enCuotas" /> pagos
        ${e.enCuotas&&e.enCuotas>0&&!e.maximoPorPago?`\xB7 ${u(Math.ceil(e.valor/Math.round(e.enCuotas)))} c/u`:""}</span>
    </td>
    <td class="num pagado">${wt(e)}</td>
    <td class="compra">${Lt(e)}</td>
    <td class="num">
      <button class="icono" data-accion="duplicar-meta" data-id="${e.id}" title="Duplicar">\u29C9</button>
      <button class="icono" data-accion="borrar-meta" data-id="${e.id}" title="Quitar">\u2715</button>
    </td>
  </tr>`}function Tt(e){let a=A(),o=new Map((e?.metas??[]).map(n=>[n.metaId,{res:n,cuando:n.pagoFin!==null?_(L(n.pagoFin,a)):null}]));if(c.metas.length===0)return`
    <section class="panel">
      <h2>Mis metas <span class="sufijo">\u2014 en el orden en que las quiero pagar</span></h2>
      <div class="vacio">
        <strong>Todav\xEDa no has puesto ninguna meta.</strong>
        Agrega lo que quieres comprar, con el precio de hoy.<br />
        El orden es el que t\xFA decidas: el programa paga de arriba hacia abajo.
        <p><button class="primario" data-accion="nueva-meta">+ Agregar mi primera meta</button></p>
      </div>
    </section>`;let t=c.metas.reduce((n,s)=>n+s.valor,0);return`
  <section class="panel">
    <h2>Mis metas <span class="sufijo">\u2014 en el orden en que las quiero pagar</span></h2>
    <div class="tabla-ancha">
      <table>
        <thead><tr>
          <th>Orden</th><th>Meta</th><th class="num">Precio</th>
          <th>Grupo (opcional)</th><th>Empieza en</th>
          <th class="num">Ritmo de pago</th><th class="num">Ya pagado antes</th>
          <th>\xBFYa la compraste?</th><th></th>
        </tr></thead>
        <tbody>${c.metas.map((n,s)=>{let r=o.get(n.id);return qt(n,s,c.metas.length,r?.cuando??null,r?.res??null)}).join("")}</tbody>
      </table>
    </div>
    <p class="nota">
      <button data-accion="nueva-meta">+ Agregar meta</button>
      ${So("metas")}
      ${xo("metas")}
      &nbsp; Suma de todas: <strong>${u(t)}</strong>
      ${(()=>{let n=La(c.metas,c.repartos);return n===0?"":` &nbsp; Llevas pagado: <strong class="completa">${u(n)}</strong>
          <span class="rango">\xB7 te faltan ${u(Math.max(0,t-n))}</span>`})()}
      ${c.metas.length>1?`<br /><span class="rango">
        <strong>Ritmo de pago</strong>: para reunir para dos cosas a la vez. Pon un
        <strong>tope</strong> en pesos, o di <strong>en cu\xE1ntos pagos</strong> la quieres reunir
        y yo calculo la cuota. Si pones los dos, manda el tope. Lo que no pase baja a la meta
        siguiente; en blanco, esa meta se lleva todo lo que haya.</span>`:""}
      <br /><span class="rango">
        <strong>Ya pagado antes</strong>: solo lo que YA le hab\xEDas abonado a esa meta
        <strong>antes de empezar a usar el programa</strong>. Lo que pagues de aqu\xED en
        adelante sale solo de los repartos reales y no se teclea aqu\xED.</span>
    </p>
  </section>`}var Po={tranquilo:"",pronto:"aviso",hoy:"urgente",vencido:"malo"};function Ot(){let e=new Date,a=c.soportesMarcados[ye(e)]??[],o=Ze(e,a),t=Po[o.urgencia],n=r=>{let i=a.includes(r.id);return`<li class="soporte ${i?"listo":""}">
      <label class="interruptor">
        <input type="checkbox" data-accion="soporte" data-id="${r.id}" ${i?"checked":""} />
        <span>${p(r.nombre)}${r.obligatorioExplicito?' <strong class="pendiente">OBLIGATORIO</strong>':""}</span>
      </label>
      ${r.detalle?`<p class="nota">${p(r.detalle)}</p>`:""}
    </li>`},s=Ke.filter(r=>r.frecuencia!=="cada_mes");return`
  <section class="panel radicacion ${t}">
    <h2><span class="etiqueta real">Real</span> Radicar la cuenta de cobro
      <span class="sufijo">\u2014 qu\xE9 d\xEDa y con qu\xE9 papeles</span></h2>
    <p class="titular ${t}">${p(o.titular)}</p>
    <p class="nota">${p(Na(o.limite))}
      ${o.limite.usoUltimoDiaDelMes?`<br /><span class="rango">${p(Fa)}</span>`:""}
    </p>
    <ul class="soportes">${Ee().map(n).join("")}</ul>
    <p class="nota">
      Ya entregados una sola vez y no hay que repetirlos:
      ${s.filter(r=>r.frecuencia==="una_sola_vez").map(r=>p(r.nombre)).join(" \xB7 ")}.
      La constancia firmada por el paciente es solo para personal asistencial.
    </p>
  </section>`}function jt(){let e=oe(c.cuentas,c.ingresos),a=va(e);return`
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
              <td class="num"><input type="text" inputmode="numeric" data-dinero value="${R(o.cuenta.montoEsperado)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="montoEsperado" /></td>
              <td class="num">${u(o.recibido)}</td>
              <td class="num ${o.pendiente>0?"pendiente":"completa"}">
                ${o.pendiente>0?u(o.pendiente):"\u2014"}</td>
              <td class="rango">${p($a(o).split(": ").slice(1).join(": "))}</td>
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
        ${a.length?` &nbsp; <span class="pendiente">Te deben en total ${u(he(e))}</span>`:""}</p>`}
  </section>`}function bo(e,a,o,t,n,s,r,i,l=""){let d=A(),m=o===null||t===null?"\u2014":`pago ${o}${t!==o?` - ${t}`:""}${n===null?"":` (${n})`}`,g=t!==null?_(L(t,d)):i?"ya la ten\xEDas pagada":"sin terminar",f=r?`<span class="completa">${u(a)}</span>`:`<span class="pendiente">${u(s)} de ${u(a)}</span>`;return`<tr class="${l}">
    <td class="meta-nombre">${p(e)}</td>
    <td class="num">${f}</td>
    <td class="rango">${m}</td>
    <td class="cuando">${p(g)}</td>
  </tr>`}function Ft(){if(c.metas.length===0)return null;try{return se(Do())}catch{return null}}function _t(e){if(c.metas.length===0)return`<section class="panel simulado">
      <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
      <div class="vacio">Agrega tus metas arriba y aqu\xED aparecen las fechas.</div>
    </section>`;if(!e)return`<section class="panel simulado"><h2>Simulaci\xF3n</h2>
      <p class="nota aviso">No pude calcular la proyecci\xF3n con estos datos.</p></section>`;let a=new Map(wa(e).map(d=>[d.grupo,d])),o=[],t=new Set,n=(d,m="")=>bo(d.nombre,d.valor,d.pagoInicio,d.pagoFin,d.cantidadPagos,d.totalAbonado,d.completada,d.yaEstabaPagada,m);for(let d of e.metas){if(!d.grupo){o.push(n(d));continue}if(t.has(d.grupo))continue;t.add(d.grupo);let m=a.get(d.grupo);o.push(bo(m.grupo,m.valor,m.pagoInicio,m.pagoFin,null,m.totalAbonado,m.completado,m.yaEstabaPagado,"grupo"));for(let g of e.metas)g.grupo===d.grupo&&o.push(n(g,"componente"))}let s=e.pagos.length,r=c.escenario,i=A(),l=_(L(s,i));return`
  <section class="panel simulado">
    <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
    <div class="resumen">
      <div><span class="valor">${e.totalPagos}</span><span class="rotulo">pagos hasta terminarlo todo</span></div>
      <div><span class="valor cuando">${p(l)}</span><span class="rotulo">termina la \xFAltima meta</span></div>
      <div><span class="valor">${u(e.ahorroFinal)}</span><span class="rotulo">ahorro acumulado al final</span></div>
    </div>
    <div class="tabla-ancha">
      <table class="compacta">
        <thead><tr><th>Meta</th><th class="num">Abonado</th><th>Pagos</th><th>Cu\xE1ndo</th></tr></thead>
        <tbody>${o.join("")}</tbody>
      </table>
    </div>
    <p class="nota aviso">
      Esto es una simulaci\xF3n, no un hecho: supone que te entran ${u(r.ingresoEsperado)} por pago.
      ${Ge(i)?`Las fechas son de <strong>una sola posibilidad</strong>: pagos puntuales cada
           ${r.diasOptimista} d\xEDas, sin contar atrasos. Sube \xABd\xEDas si se atrasan\xBB
           por encima de ${r.diasOptimista} y vuelven a salir como rango.`:`El \xABcu\xE1ndo\xBB va de puntual (cada ${r.diasOptimista} d\xEDas) a atrasado (cada ${r.diasPesimista}).`}
      ${e.incompleta?"<br /><strong>Con ese ingreso no alcanza a terminar.</strong>":""}
    </p>
    ${kt(e)}
    ${Nt()}
  </section>`}function Nt(){let e=he(oe(c.cuentas,c.ingresos));if(e<=0)return"";let a=Ta(Do(),e);if(!a)return"";let o=A(),t=n=>_(L(Math.max(1,n),o));return`<p class="nota ${a.seAdelanta>0?"":"rango"}">
    Te deben <strong class="pendiente">${u(a.pendiente)}</strong>.
    ${a.seAdelanta>0?`Si te los pagaran de una vez, terminar\xEDas <strong>${a.seAdelanta}
         ${a.seAdelanta===1?"pago":"pagos"} antes</strong>: la \xFAltima meta pasar\xEDa de
         ${p(t(a.pagosAhora))} a ${p(t(a.pagosSiPagan))}.`:`Aunque te los pagaran de una vez, las fechas no se mover\xEDan \u2014 el ritmo lo marcan los
         topes por pago que pusiste arriba, no lo que entra.`}
    <br /><span class="rango">Esto es aparte: la proyecci\xF3n de arriba NO cuenta ese dinero
    hasta que lo registres como pago recibido.</span>
  </p>`}function kt(e){let a=qa(e,c.metas);if(a.length===0)return"";let o=A(),t=s=>j(L(Math.max(1,s),o).optimista),n=s=>s.termina===null?`<li class="mal"><strong>${p(s.nombre)}</strong> la quer\xEDas para
        ${p(t(s.queria))} y <strong>no alcanza a terminar</strong> con este ingreso.</li>`:s.seRetrasa===0?`<li class="bien"><strong>${p(s.nombre)}</strong> la quer\xEDas para
        ${p(t(s.queria))} y llega ${s.termina===0?"ya pagada":`en ${p(t(s.termina))}`}.</li>`:`<li class="mal"><strong>${p(s.nombre)}</strong> la quer\xEDas para
      ${p(t(s.queria))} y va para <strong>${p(t(s.termina))}</strong>
      \u2014 ${s.seRetrasa} ${s.seRetrasa===1?"pago":"pagos"} tarde.
      S\xFAbela de posici\xF3n o dale m\xE1s por pago.</li>`;return`<div class="plazos">
    <h3 class="titulo-total">Lo que quer\xEDas para cierta fecha</h3>
    <ul>${a.map(n).join("")}</ul>
    <p class="nota rango">Esto solo avisa: el orden de pago lo pones t\xFA arriba, y el programa
      no lo cambia por su cuenta.</p>
  </div>`}function K(e){let a=$e(c.metas),o=c.ingresos.filter(s=>s.fecha<=e.fecha&&s.id!==e.id).sort((s,r)=>s.fecha.localeCompare(r.fecha));for(let s of o){let r=c.repartos.find(i=>i.ingresoId===s.id);for(let i of r?.abonos??[])i.refId&&a.set(i.refId,Math.max(0,(a.get(i.refId)??0)-i.monto))}let t=e.cuentaDeCobroId?!o.some(s=>s.cuentaDeCobroId===e.cuentaDeCobroId):!0,n=c.escenario;return Da(e,Sa(e,o),c.obligaciones,{nombre:"Otros / Ahorro",base:n.colchonBase,minimo:n.colchonMinimo,elastico:!1},c.metas,a,t)}function zt(){let e=Ye(c.ingresos,c.repartos);if(e.length===0)return`<section class="panel">
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
        <h3>${p(Me(t.mes))}</h3>
        <span class="valor">${u(t.entro)}</span>
        <span class="rotulo">entr\xF3${t.deFuera>0?` \xB7 ${u(t.deFuera)} los pusiste t\xFA`:""}</span>
      </div>
      ${n.map(Ht).join("")}
      ${n.length>1?`<div class="total-mes">
        <span>Ese mes: ${u(t.aObligaciones)} en obligaciones \xB7 ${u(t.aMetas)} a metas
        ${t.alAhorro>0?` \xB7 ${u(t.alAhorro)} guardado`:""}</span></div>`:""}
    </div>`}).join(""),o=ya(c.repartos);return`
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
  </section>`}function Ht(e){let a=c.repartos.find(i=>i.ingresoId===e.id),o=c.cuentas.find(i=>i.id===e.cuentaDeCobroId),t=p(o?o.periodo:e.nota??"de otro lado");if(!a)return`<div class="ingreso-real">
      <div class="ingreso-cabecera">
        <span class="meta-nombre">${u(e.monto)}</span>
        <span class="rango">${p(e.fecha)} \xB7 ${t}</span>
      </div>
      <p class="nota aviso">No est\xE1 dicho en qu\xE9 se fue este dinero.
        <button data-accion="proponer" data-id="${e.id}">Calcularlo por m\xED</button></p>
    </div>`;let n=te(a,e),s=(i,l,d)=>`
    <tr>
      <td class="meta-nombre">${p(i.nombre)}
        ${i.movidoDesdeGasto?'<span class="rango">\xB7 ven\xEDa de un gasto</span>':""}</td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${R(i.monto)}" class="corto-dinero"
        data-accion="editar-reparto" data-id="${a.id}" data-tipo="${l}" data-i="${d}" /></td>
      <td class="num">${i.movidoDesdeGasto?`<button class="icono" data-accion="abono-a-gasto" data-id="${a.id}" data-i="${d}"
             title="Devolverlo a gastos">\u21A9</button>`:""}</td>
    </tr>`,r=(i,l)=>`
    <tr class="gasto-suelto">
      <td><input value="${p(i.nombre)}" placeholder="\xBFen qu\xE9 se fue?"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${l}" data-campo="nombre" /></td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${R(i.monto)}" class="corto-dinero"
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
          ${a.obligaciones.map((i,l)=>[i,l]).filter(([i])=>i.monto!==0).map(([i,l])=>s(i,"obligaciones",l)).join("")}
          ${a.abonos.map((i,l)=>[i,l]).filter(([i])=>i.monto!==0).map(([i,l])=>s(i,"abonos",l)).join("")}
          ${(a.gastos??[]).map(r).join("")}
          <tr class="grupo">
            <td class="meta-nombre">Qued\xF3 guardado</td>
            <td class="num"><input type="text" inputmode="numeric" data-dinero
              value="${R(a.alAhorro)}" class="corto-dinero"
              data-accion="editar-reparto" data-id="${a.id}" data-tipo="ahorro" data-i="0" /></td>
            <td class="num"></td>
          </tr>
        </tbody>
      </table>
    </div>
    ${(()=>{let i=Ca(a,c.metas);return i.length===0?"":i.map(l=>`<p class="nota aviso">
        Tienes <strong>${p(l.gasto.nombre)}</strong> (${u(l.gasto.monto)}) anotado aqu\xED como
        un gasto cualquiera, pero <strong>${p(l.metaNombre)}</strong> es una de tus metas.
        <br />Si ese dinero se lo metiste a la meta, m\xE1rcalo: as\xED el programa sabe que ya llevas
        ${u(l.gasto.monto)} pagados y deja de calcular las fechas como si te faltara el precio
        entero. Si fue otra cosa que se llama parecido, d\xE9jalo como est\xE1.
        <br /><button data-accion="gasto-a-abono" data-id="${a.id}"
          data-meta="${l.metaId}" data-nombre="${p(l.gasto.nombre)}">S\xED, fue abono a ${p(l.metaNombre)}</button>
      </p>`).join("")})()}
    ${(()=>{let i=Pa(a,K(e));return i.length===0?"":`<p class="nota aviso">
        Cambiaste la configuraci\xF3n desde que se calcul\xF3 esto: hoy
        <strong>${i.map(p).join(", ")}</strong> ya no ${i.length===1?"entrar\xEDa":"entrar\xEDan"}
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
  </div>`}function Ro(e){let a=A(),o=e?xa(e.pagos,a.desde,a.diasOptimista,c.metas):[],t=Ye(c.ingresos,c.repartos),n=[...new Set([...o.map(r=>r.mes),...t.map(r=>r.mes)])],s=Ia(c.cuentas,c.ingresos,c.escenario.ingresoEsperado,n);return Ra(o,t,X().slice(0,7),s)}function Vt(e){let a=Ro(e);if(a.length===0)return`<section class="panel">
      <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
      <div class="vacio">Agrega tus metas y registra un pago: aqu\xED se ve el calendario entero.</div>
    </section>`;Gt(a);let o=Ue(a);return`
  <section class="panel">
    <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
    <div class="resumen">
      <div><span class="valor real">${u(o.entroDeVerdad)}</span>
        <span class="rotulo">ha entrado de verdad \xB7 ${o.mesesConDatos} ${o.mesesConDatos===1?"mes":"meses"}</span></div>
      <div><span class="valor">${u(o.guardadoDeVerdad)}</span>
        <span class="rotulo">llevas guardado</span></div>
      ${o.mesesQueFaltan>0?`<div><span class="valor cuando">${u(o.faltaPorEntrar)}</span>
            <span class="rotulo">faltar\xEDan por entrar \xB7 ${o.mesesQueFaltan} ${o.mesesQueFaltan===1?"mes":"meses"}</span></div>`:`<div><span class="valor">${u(o.gastadoDeVerdad)}</span>
            <span class="rotulo">llevas gastado</span></div>`}
    </div>
    <p class="nota">
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="1">Desplegar todos</button>
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="0">Plegar todos</button>
      <span class="rango">&nbsp; ${a.length} ${a.length===1?"mes":"meses"} \xB7
        pulsa uno para ver en qu\xE9 se va</span>
    </p>
    <div class="linea-tiempo">${a.map(Qt).join("")}</div>
    <p class="nota">
      <span class="etiqueta real">Real</span> lo que pas\xF3 \xB7
      <span class="etiqueta simulacion">Simulaci\xF3n</span> lo que pasar\xEDa si entra lo que supone
      el escenario. Nunca se mezclan en una sola cifra.
    </p>
  </section>`}function Bt(e){let a=(n,s)=>n.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")===s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),o=c.obligaciones.find(n=>a(n.nombre,e));if(o)return`<span class="que-es obligacion">fijo${o.grupo?` \xB7 ${p(o.grupo)}`:""}</span>`;let t=c.metas.find(n=>a(n.nombre,e));return t?`<span class="que-es meta">meta${t.grupo?` \xB7 ${p(t.grupo)}`:""}</span>`:e==="Qued\xF3 guardado"||e==="Se guardar\xEDa"?"":'<span class="que-es suelto">de una vez</span>'}var W=new Set,fo=!1;function Gt(e){if(fo)return;fo=!0;let a=e.findIndex(t=>t.estado==="actual"),o=a>=0?a:0;for(let t of e.slice(o,o+2))W.add(t.mes)}function Qt(e){let a=e.real!==null,o=e.real??e.simulado;if(!o)return"";let t=a?o.entro:e.esperado?.monto??o.entro,n=!a&&e.simulado!==null&&e.esperado!==null&&e.esperado.monto!==e.simulado.entro,s=e.real?e.real.detalle:N(e.simulado?.detalle),r=e.estado==="actual"?'<span class="chip ahora">este mes</span>':e.estado==="futuro"?'<span class="chip futuro">viene</span>':"",i=[o.aObligaciones>0?`${u(o.aObligaciones)} fijos`:"",o.aMetas>0?`${u(o.aMetas)} a metas`:"",a&&e.real.enGastos>0?`${u(e.real.enGastos)} sueltos`:"",o.alAhorro>0?`${u(o.alAhorro)} guardado`:""].filter(Boolean).join(" \xB7 ");return`
  <details class="mes-vista ${e.estado} ${a?"es-real":"es-simulado"}"
           data-mes="${e.mes}" ${W.has(e.mes)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${p(Me(e.mes))}</h3>
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
          <td class="meta-nombre">${p(l.nombre)} ${Bt(l.nombre)}</td>
          <td class="num">${u(l.monto)}</td></tr>`).join("")}
        ${o.alAhorro>0?`<tr class="grupo">
          <td class="meta-nombre">${a?"Qued\xF3 guardado":"Se guardar\xEDa"}</td>
          <td class="num">${u(o.alAhorro)}</td></tr>`:""}
      </tbody></table></div>`}
    ${e.real&&e.real.sinAsignar>0?`<p class="nota aviso">
      Hay ${u(e.real.sinAsignar)} sin decir en qu\xE9 se fueron.</p>`:""}
  </details>`}var q=[],Fe=oo(),le=!1;function Yt(){let e=Ce(),a=Ae();if(!e)return`
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
    </section>`;let o=q.length===0?"":`
    <div class="aviso-descartes">
      <strong>${q.length} ${q.length===1?"dato distinto":"datos distintos"} entre los dos aparatos.</strong>
      Se qued\xF3 el m\xE1s reciente. Esto es lo que hab\xEDa en el otro:
      <table><tbody>
        ${q.map((t,n)=>`<tr>
          <td><strong>${p(la(t.campo))}</strong>
            <span class="rango">de ${p(ca(t,c))}</span></td>
          <td>${p(Te(t.campo,t.valor))}</td>
          <td class="rango">en vez de ${p(Te(t.campo,t.gano))}</td>
          <td><button class="chico-linea" data-accion="nube-revertir" data-i="${n}">Quedarme con este</button></td>
        </tr>`).join("")}
      </tbody></table>
    </div>`;return`
    <section class="panel">
      <h2>Sincronizar con el tel\xE9fono
        <span class="sufijo">\u2014 ${p(e.correo)}</span></h2>
      <p class="nota">
        ${a?`\xDAltima vez: ${new Date(a).toLocaleString("es-CO")}.`:"Todav\xEDa no has sincronizado desde este aparato."}
      </p>
      <p>
        <button class="primario" data-accion="nube-sincronizar" ${le?"disabled":""}>
          ${le?"Sincronizando\u2026":"Sincronizar ahora"}
        </button>
        <button class="chico-linea" data-accion="nube-salir">Salir de la cuenta</button>
      </p>
      ${o}
    </section>`}function Ut(e){let a=new Date,o=a.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),t=he(oe(c.cuentas,c.ingresos)),n=ze(),s=n.monto>0?pa(2,n.monto):0,r=Ro(e),i=r.length>0?Ue(r).guardadoDeVerdad:0,l=A(),d=mo(c.metas,e?.metas??[]),m=d?.pagoFin!=null?_(L(d.pagoFin,l)):null,g=c.soportesMarcados[ye(a)]??[],f=Ze(a,g),v=Ee(),I=v.filter(x=>g.includes(x.id)).length,y=f.diasQueFaltan,E=(x,me,ge,be,ee,Ve)=>`
    <div class="cifra tono-${x}">
      <div class="cifra-cab"><span class="cifra-chip">${me}</span>${ge}</div>
      <div class="cifra-nombre">${be}</div>
      <div class="cifra-valor">${ee}</div>
      <div class="cifra-detalle">${Ve}</div>
    </div>`,D='<span class="etiqueta real">Real</span>',S='<span class="etiqueta simulacion">Simulaci\xF3n</span>',O=ne(c.metas,c.repartos),Z=new Map((e?.metas??[]).map(x=>[x.metaId,x])),jo=x=>ua(x,O.get(x.id)?.total??0)>=1,F=c.metas.filter(x=>!jo(x)),ue=c.metas.length-F.length,fa=(F.length>0?F:c.metas).slice(0,5),pe=(F.length>0?F.length:c.metas.length)-fa.length,Fo=fa.map(x=>{let me=Z.get(x.id),ge=O.get(x.id)?.total??0,be=ua(x,ge),ee=be>=1,Ve=x.compra?"ya la compraste":ee?"\u2713 lista":me?.pagoFin!=null?_(L(me.pagoFin,l)):"sin fecha todav\xEDa";return`<li class="inicio-meta ${x.clase==="deuda"?"es-deuda":""} ${ee?"lista":""}">
      <div class="inicio-meta-texto">
        <div class="inicio-meta-nombre">${p(x.nombre.trim()||"(sin nombre)")}
          ${x.clase==="deuda"?'<span class="marca-deuda">Ya la debo</span>':""}</div>
        <div class="rango">${u(ge)} de ${u(x.valor)}</div>
        <div class="barra-progreso"><i style="width:${Math.round(be*100)}%"></i></div>
      </div>
      <div class="inicio-meta-der"><strong>${u(x.valor)}</strong>
        <span class="${ee?"completa":"cuando"}">${p(Ve)}</span></div>
    </li>`}).join("");return`
  <section class="inicio">
    <div class="saludo">
      <h1>\xA1Hola!</h1>
      <p>As\xED va tu plata \xB7 <span class="fecha-larga">${p(o)}</span></p>
    </div>

    <div class="aviso-radicar ${Po[f.urgencia]}">
      <div class="aviso-radicar-texto">
        ${D} <strong>${p(f.titular)}</strong>
        <div class="rango">${I} de ${v.length} soportes listos \xB7 la lista est\xE1 abajo</div>
        <div class="barra-progreso real"><i style="width:${v.length?Math.round(I/v.length*100):0}%"></i></div>
      </div>
      <div class="aviso-radicar-dias"><strong>${Math.abs(y)}</strong>
        <span>${y<0?Math.abs(y)===1?"d\xEDa tarde":"d\xEDas tarde":y===1?"d\xEDa":"d\xEDas"}</span></div>
    </div>

    <div class="cifras">
      ${E("real","\u{1F4B5}",D,"Te deben",t>0?u(t):"$0",t>0?"de cuentas de cobro sin pagar completas":"no tienes cuentas pendientes")}
      ${E("turquesa","\u{1F45B}","","Libre para metas, por pago",n.monto>0?u(n.monto-s):"\u2014",n.monto>0?`de ${u(n.monto)} \xB7 se van ${u(s)}`:"pon cu\xE1nto esperas por pago en Ajustes")}
      ${E("simulado","\u{1F3C1}",S,d?`Pr\xF3xima meta \xB7 ${p(d.meta.nombre.trim()||"(sin nombre)")}`:"Pr\xF3xima meta",d?m?p(m.replace(/^entre /,"").split(" y ")[0]):"Sin fecha":"\u2014",d?m?m.startsWith("entre ")?p(m):"seg\xFAn la proyecci\xF3n":"la proyecci\xF3n no alcanza a terminarla":"no hay metas pendientes")}
      ${E("morado","\u{1F437}","","Llevas guardado",u(i),"lo que ha quedado de verdad en el ahorro")}
    </div>

    <div class="panel inicio-metas">
      <h2>Mis metas ${S}
        <button class="enlace" data-accion="seccion" data-seccion="metas">Ver todas \u2192</button></h2>
      ${c.metas.length===0?`<div class="vacio">Todav\xEDa no has puesto ninguna meta.
            <p><button class="primario" data-accion="seccion" data-seccion="metas">Ir a Metas</button></p></div>`:`<ul class="inicio-lista">${Fo}</ul>
           ${pe>0||F.length>0&&ue>0?`<p class="nota">${[pe>0?`${pe} ${pe===1?"pendiente m\xE1s":"pendientes m\xE1s"}`:"",F.length>0&&ue>0?`${ue} ya ${ue===1?"lista":"listas"}`:""].filter(Boolean).join(" \xB7 ")} \u2014 todas en Metas.</p>`:""}`}
    </div>
  </section>`}function He(){let e=Ft();return[["inicio",Ut(e)],["radicacion",Ot()],["vista",Vt(e)],["escenario",xt()],["metas",Tt(e)],["proyeccion",_t(e)],["obligaciones",At()],["cuentas",jt()],["real",zt()],["nube",Yt()]]}function Io(e){if(typeof e.querySelectorAll=="function")for(let a of Array.from(e.querySelectorAll("table"))){let o=Array.from(a.querySelectorAll("thead th")).map(t=>(t.textContent??"").trim());if(Ya(o)){a.classList.add("como-tarjetas");for(let t of Array.from(a.querySelectorAll("tbody tr"))){let n=Array.from(t.children),s=n.map(i=>Number(i.getAttribute("colspan")??1)||1),r=Qa(o,s);n.forEach((i,l)=>{let d=r[l];d?i.dataset.etiqueta=d:delete i.dataset.etiqueta})}}}}function ga(e,a){e.innerHTML=a,Io(e)}function Co(){return document.activeElement?.closest?.("[data-panel]")?.dataset.panel??null}function ba(e=Co()){let a=new Set([e,ma].filter(Boolean));for(let[o,t]of He()){if(a.has(o))continue;let n=document.getElementById(`panel-${o}`);n&&ga(n,t)}Ao()}function Ao(){let e=document.getElementById("mensaje");e&&(e.innerHTML=M?`<div class="mensaje ${M.malo?"malo":"bueno"}">${p(M.texto)}</div>`:"",M=null)}var Lo="gestiondinerotrabajo.seccion";function Jt(){try{return Oe(localStorage.getItem(Lo))}catch{return Oe(null)}}function Xt(e){try{localStorage.setItem(Lo,e)}catch{}}function Wt(e){return`<nav class="barra-secciones">
    ${ce.map(a=>`<button data-accion="seccion" data-seccion="${a.id}"
      class="${a.id===e?"activa":""}" aria-current="${a.id===e?"page":"false"}">
      <span class="icono-seccion">${a.icono}</span>${p(a.rotulo)}</button>`).join("")}
  </nav>`}function Kt(e){let a=Ce(),o=Ae(),t=o?new Date(o).toLocaleString("es-CO",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):null;return`<aside class="lateral">
    <div class="marca"><span class="logo">$</span>
      <div><strong>Mi dinero</strong><span>Metas con ingreso variable</span></div></div>
    <nav class="nav-lateral">
      ${ce.map(n=>`<button data-accion="seccion" data-seccion="${n.id}"
        class="${n.id===e?"activa":""}" aria-current="${n.id===e?"page":"false"}">
        <span class="icono-seccion">${n.icono}</span><span class="rotulo-seccion">${p(n.rotulo)}</span></button>`).join("")}
    </nav>
    <div class="lateral-pie">
      <div class="estado-nube ${a?"conectada":""}"><span class="punto"></span>
        <div><strong>${a?"Sincronizado":"Solo en este aparato"}</strong>
          <span>${a?t?`\xFAltima vez ${p(t)}`:"todav\xEDa sin sincronizar":"la nube est\xE1 en Ajustes"}</span></div></div>
      <button class="chico-linea" data-accion="exportar">Exportar respaldo</button>
      <button class="chico-linea" data-accion="importar">Importar respaldo</button>
    </div>
  </aside>`}function P(){let e=document.getElementById("app"),a=ho(document.activeElement),o=document.activeElement,t=o&&typeof o.selectionStart=="number"?o.selectionStart:null,n=window.scrollY,s=Jt();e.className=`seccion-${s}`,e.innerHTML=`
    ${Kt(s)}
    <header class="cabecera">
      <h1>Gesti\xF3n del dinero del trabajo</h1>
      <div class="acciones">
        <button data-accion="exportar">Exportar respaldo</button>
        <button data-accion="importar">Importar respaldo</button>
      </div>
    </header>
    <div id="mensaje"></div>
    ${He().map(([r,i])=>`<div id="panel-${r}" data-panel="${r}"
         data-seccion="${co(r)??""}">${i}</div>`).join("")}
    <input type="file" id="archivo" accept="application/json" hidden />
    ${Wt(s)}`,Io(e),Ao(),window.scrollTo({top:n,behavior:"instant"}),Et(a,t)}function wo(e){let a=Math.round(Number(e));if(!(!Number.isFinite(a)||a<=1))return a}b.set("escenario",e=>{let a=e.dataset.campo,o=e,t=o.value;if(c.escenario[a]=o.type==="date"?t:o.hasAttribute("data-dinero")?C(t):Number(t),a==="diasOptimista"||a==="diasPesimista"){let n=Math.round(Number(t));c.escenario[a]=Number.isFinite(n)&&n>0?n:1}T()});b.set("elastico",e=>{c.escenario.colchonElastico=e.checked,T()});b.set("oblig",e=>{let a=c.obligaciones.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=a.tipo==="porcentaje"?Number(t)/100:C(t);else if(o==="tipo"){let n=t;n!==a.tipo&&(a.valor=n==="porcentaje"?.1:1e5),a.tipo=n}else o==="modo"?(a.modo=t,a.modo==="puntual"&&!a.supuesto&&(a.supuesto="siempre")):o==="grupo"?a.grupo=t.trim()||void 0:o==="desdePago"?a.desdePago=wo(t):o==="supuesto"?a.supuesto=t:a.nombre=t;T()});b.set("nuevo-cambio",e=>{let a=c.obligaciones.find(t=>t.id===e.dataset.id);if(!a)return;let o=Math.max(1,...(a.cambios??[]).map(t=>t.desdePago));a.cambios=[...a.cambios??[],{desdePago:o+1,valor:a.valor}],$()});b.set("cambio",e=>{let a=c.obligaciones.find(n=>n.id===e.dataset.id),o=a?.cambios?.[Number(e.dataset.i)];if(!a||!o)return;let t=e.value;if(e.dataset.campo==="desdePago"){let n=Math.round(Number(t));o.desdePago=Number.isFinite(n)&&n>0?n:1}else o.valor=a.tipo==="porcentaje"?Number(t)/100:C(t);T()});b.set("borrar-cambio",e=>{let a=c.obligaciones.find(t=>t.id===e.dataset.id);if(!a?.cambios)return;let o=Number(e.dataset.i);a.cambios=a.cambios.filter((t,n)=>n!==o),$()});b.set("nuevo-cambio-ahorro",()=>{let e=c.escenario.cambiosColchon??[],a=Math.max(1,...e.map(o=>o.desdePago));c.escenario.cambiosColchon=[...e,{desdePago:a+1,valor:c.escenario.colchonBase}],$()});b.set("cambio-ahorro",e=>{let a=c.escenario.cambiosColchon?.[Number(e.dataset.i)];if(!a)return;let o=e.value;if(e.dataset.campo==="desdePago"){let t=Math.round(Number(o));a.desdePago=Number.isFinite(t)&&t>0?t:1}else a.valor=C(o);T()});b.set("borrar-cambio-ahorro",e=>{let a=Number(e.dataset.i);c.escenario.cambiosColchon=(c.escenario.cambiosColchon??[]).filter((o,t)=>t!==a),$()});b.set("nueva-oblig",()=>{let e=z("ob");ke=e,c.obligaciones.push({id:e,nombre:"Nueva obligaci\xF3n",tipo:"fijo",valor:1e5,modo:"cada_pago"}),$()});b.set("borrar-oblig",e=>{c.obligaciones=c.obligaciones.filter(a=>a.id!==e.dataset.id),$()});b.set("meta",e=>{let a=c.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=C(t);else if(o==="abonado")a.abonado=C(t);else if(o==="desdePago")a.desdePago=wo(t);else if(o==="maximoPorPago"){let n=C(t);a.maximoPorPago=n>0?n:void 0}else if(o==="enCuotas"){let n=Math.round(Number(t));a.enCuotas=Number.isFinite(n)&&n>0?n:void 0}else if(o==="antesDelPago"){let n=Math.round(Number(t));a.antesDelPago=Number.isFinite(n)&&n>0?n:void 0}else if(o==="grupo")a.grupo=t.trim()||void 0;else if(o==="clase"){a.clase=t==="deuda"?"deuda":void 0,$();return}else a.nombre=t;T()});function Zt(e){let a=e.classList.toggle("abierta"),o=e.dataset.idFila;if(o)for(let t of document.querySelectorAll(`[data-hija-de="${CSS.escape(o)}"]`))t.classList.toggle("abierta",a)}function qo(e,a){let o=document.getElementById(`panel-${e==="metas"?"metas":"obligaciones"}`);if(o){for(let t of o.querySelectorAll("tr[data-resumen]"))t.classList.toggle("abierta",a);for(let t of o.querySelectorAll("[data-hija-de]"))t.classList.toggle("abierta",a)}}b.set("desplegar-todo",e=>qo(e.dataset.lista,!0));b.set("plegar-todo",e=>qo(e.dataset.lista,!1));b.set("seccion",e=>{let a=Oe(e.dataset.seccion);Xt(a);let o=document.getElementById("app");o&&(o.className=`seccion-${a}`);for(let t of document.querySelectorAll(".barra-secciones button, .nav-lateral button")){let n=t.dataset.seccion===a;t.classList.toggle("activa",n),t.setAttribute("aria-current",n?"page":"false")}window.scrollTo({top:0,behavior:"instant"})});b.set("nueva-meta",()=>{let e=z("meta");ke=e,c.metas.push({id:e,nombre:"",valor:0}),$(),document.querySelector(`input[data-id="${e}"][data-campo="nombre"]`)?.focus()});b.set("plegar-meses",e=>{let a=e.dataset.abrir==="1";if(W.clear(),a)for(let t of document.querySelectorAll("[data-mes]"))W.add(t.dataset.mes);let o=document.getElementById("panel-vista");o&&ga(o,He().find(([t])=>t==="vista")[1])});b.set("ordenar",e=>{let a=e.dataset.por,o=(n,s)=>n.localeCompare(s,"es",{sensitivity:"base",numeric:!0}),t=(n,s)=>a==="valor"?s.valor-n.valor:a==="grupo"&&o(n.grupo??"\uFFFF",s.grupo??"\uFFFF")||o(n.nombre,s.nombre);e.dataset.lista==="metas"?(c.metas=[...c.metas].sort(t),M={texto:`Metas ordenadas por ${a}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron. Si no era lo que quer\xEDas, reord\xE9nalas con las flechas.`,malo:!1}):c.obligaciones=[...c.obligaciones].sort(t),$()});b.set("duplicar-meta",e=>{let a=c.metas.findIndex(n=>n.id===e.dataset.id);if(a<0)return;let o=c.metas[a],t={...o,id:z("meta"),nombre:`${o.nombre} (copia)`,abonado:0};delete t.compra,c.metas.splice(a+1,0,t),$()});b.set("borrar-meta",e=>{c.metas=c.metas.filter(a=>a.id!==e.dataset.id),$()});function To(e,a){let o=e+a;if(o<0||o>=c.metas.length)return;let t=c.metas.slice();[t[e],t[o]]=[t[o],t[e]],c.metas=t,$()}b.set("subir",e=>To(Number(e.dataset.i),-1));b.set("bajar",e=>To(Number(e.dataset.i),1));b.set("nueva-cuenta",()=>{let e=new Date,a=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];c.cuentas.push({id:z("cta"),periodo:`${a[e.getMonth()]} de ${e.getFullYear()}`,montoEsperado:c.escenario.ingresoEsperado}),$()});b.set("cuenta",e=>{let a=c.cuentas.find(t=>t.id===e.dataset.id);if(!a)return;let o=e.value;e.dataset.campo==="montoEsperado"?a.montoEsperado=C(o):a.periodo=o,T()});b.set("borrar-cuenta",e=>{c.cuentas=c.cuentas.filter(o=>o.id!==e.dataset.id);let a=new Set(c.ingresos.filter(o=>o.cuentaDeCobroId===e.dataset.id).map(o=>o.id));c.ingresos=c.ingresos.filter(o=>o.cuentaDeCobroId!==e.dataset.id),c.repartos=c.repartos.filter(o=>!a.has(o.ingresoId)),$()});b.set("abonar",async e=>{let a=c.cuentas.find(i=>i.id===e.dataset.id);if(!a)return;let o=oe([a],c.ingresos)[0],t=o.pendiente>0?o.pendiente:a.montoEsperado,n=await Y({titulo:`\xBFCu\xE1nto te pagaron de ${a.periodo}?`,detalle:o.pendiente>0&&o.recibido>0?`Ya te hab\xEDan pagado ${u(o.recibido)}. Faltan ${u(o.pendiente)}.`:void 0,valorInicial:R(t),dinero:!0,textoAceptar:"Registrar pago"});if(n===null)return;let s=C(n);if(!Number.isFinite(s)||s<=0)return M={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},P();let r={id:z("ing"),cuentaDeCobroId:a.id,fecha:X(),monto:s};c.ingresos.push(r),c.repartos.push(K(r)),M={texto:"Registrado. Mira abajo en qu\xE9 se va ese dinero y corr\xEDgelo si no fue as\xED.",malo:!1},$()});b.set("comprada",async e=>{let a=c.metas.find(s=>s.id===e.dataset.id);if(!a)return;let o=await Y({titulo:`\xBFPor cu\xE1nto compraste ${a.nombre}?`,detalle:`La ten\xEDas en ${u(a.valor)}. Pon lo que pagaste de verdad, aunque sea distinto.`,valorInicial:R(a.valor),dinero:!0,textoAceptar:"Siguiente"});if(o===null)return;let t=await Y({titulo:"\xBFEn qu\xE9 mes la compraste?",detalle:"Escr\xEDbelo como AAAA-MM. Por ejemplo, 2026-08 para agosto de este a\xF1o.",valorInicial:X().slice(0,7),textoAceptar:"Guardar"});if(t===null)return;let n=/^\d{4}-\d{2}$/.test(t.trim())?t.trim():X().slice(0,7);a.compra={mes:n,precioReal:C(o)},$()});b.set("no-comprada",e=>{let a=c.metas.find(o=>o.id===e.dataset.id);a&&(delete a.compra,$())});b.set("proponer",e=>{let a=c.ingresos.find(o=>o.id===e.dataset.id);a&&(c.repartos=c.repartos.filter(o=>o.ingresoId!==a.id),c.repartos.push(K(a)),$())});b.set("confirmar-reparto",e=>{let a=c.repartos.find(o=>o.id===e.dataset.id);a&&(a.propuesto=!1,$())});b.set("editar-reparto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id);if(!a)return;let o=C(e.value),t=e.dataset.tipo,n=Number(e.dataset.i);t==="ahorro"?a.alAhorro=o:t==="obligaciones"&&a.obligaciones[n]?a.obligaciones[n].monto=o:t==="abonos"&&a.abonos[n]&&(a.abonos[n].monto=o),a.propuesto=!1,T()});b.set("quitar-previo",e=>{let a=c.metas.find(t=>t.id===e.dataset.id);if(!a)return;let o=a.abonado??0;a.abonado=0,M={texto:`Quit\xE9 los ${u(o)} que estaban escritos a mano en ${a.nombre}. Ahora manda lo registrado en \xABen qu\xE9 se fue la plata\xBB, que es lo que de verdad pagaste.`,malo:!1},$()});b.set("gasto-a-abono",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.metas.find(s=>s.id===e.dataset.meta);if(!a||!o)return;let t=e.dataset.nombre,n=(a.gastos??[]).find(s=>s.nombre===t);n&&(a.gastos=a.gastos.filter(s=>s!==n),a.abonos.push({nombre:o.nombre,monto:n.monto,refId:o.id,movidoDesdeGasto:!0}),M={texto:`Listo: los ${u(n.monto)} de \xAB${n.nombre}\xBB ahora cuentan como abono a ${o.nombre}. El total del mes no cambi\xF3. Si te equivocaste, la l\xEDnea tiene un bot\xF3n \u21A9 para devolverla a gastos.`,malo:!1},$())});b.set("abono-a-gasto",e=>{let a=c.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.abonos[o];!a||!t||(a.abonos=a.abonos.filter((n,s)=>s!==o),a.gastos=[...a.gastos??[],{nombre:t.nombre,monto:t.monto}],M={texto:`${t.nombre} volvi\xF3 a ser un gasto suelto.`,malo:!1},$())});b.set("nuevo-gasto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=te(a,o),n=t>0?t:Math.min(a.alAhorro,a.alAhorro);a.gastos=[...a.gastos??[],{nombre:"",monto:0}],n<=0&&(a.propuesto=!1),$()});b.set("editar-gasto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];if(!a||!t)return;let n=e.value;if(e.dataset.campo==="nombre")t.nombre=n;else{let s=C(n);a.alAhorro=Math.max(0,a.alAhorro-(s-t.monto)),t.monto=s}a.propuesto=!1,T()});b.set("borrar-gasto",e=>{let a=c.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];!a||!t||(a.alAhorro+=t.monto,a.gastos=a.gastos.filter((n,s)=>s!==o),$())});b.set("recalcular",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=a.gastos??[],n=K(o);n.gastos=t,n.alAhorro=Math.max(0,n.alAhorro-t.reduce((s,r)=>s+r.monto,0)),c.repartos=c.repartos.map(s=>s.id===a.id?n:s),M={texto:"Recalculado con las obligaciones de ahora.",malo:!1},$()});b.set("cuadrar",e=>{let a=c.repartos.find(t=>t.id===e.dataset.id),o=c.ingresos.find(t=>t.id===a?.ingresoId);!a||!o||(a.alAhorro=Math.max(0,a.alAhorro+te(a,o)),a.propuesto=!1,$())});b.set("aporte-externo",async e=>{let a=await Y({titulo:"\xBFCu\xE1nto vas a meter de tu bolsillo?",detalle:"Plata tuya que no viene del trabajo: Nequi, efectivo, lo que tengas guardado por otro lado.",valorInicial:"0",dinero:!0,textoAceptar:"Meterlo"});if(a===null)return;let o=C(a);if(o<=0)return M={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},P();let t=await Y({titulo:"\xBFDe d\xF3nde sali\xF3?",detalle:"Para que dentro de unos meses sepas qu\xE9 fue esto.",valorInicial:"Nequi",textoAceptar:"Guardar"}),n={id:z("ing"),fecha:X(),monto:o,nota:t?.trim()||"de otro lado"};c.ingresos.push(n),c.repartos.push(K(n)),$()});b.set("soporte",e=>{let a=ye(new Date),o=new Set(c.soportesMarcados[a]??[]),t=e.dataset.id;e.checked?o.add(t):o.delete(t),c.soportesMarcados={...c.soportesMarcados,[a]:[...o]},T()});b.set("borrar-ingreso",e=>{c.repartos=c.repartos.filter(a=>a.ingresoId!==e.dataset.id),c.ingresos=c.ingresos.filter(a=>a.id!==e.dataset.id),$()});function Oo(){let e=globalThis.__TAURI__;return e?.dialog&&e?.fs?{dialog:e.dialog,fs:e.fs}:null}b.set("exportar",async()=>{let e=Va(c),a=`respaldo-dinero-${X()}.json`,o=Oo();if(!o){let t=new Blob([e],{type:"application/json"}),n=document.createElement("a");return n.href=URL.createObjectURL(t),n.download=a,n.click(),URL.revokeObjectURL(n.href),M={texto:`Respaldo guardado en tu carpeta de descargas como ${a}.`,malo:!1},P()}try{let t=await o.dialog.save({title:"\xBFD\xF3nde guardo el respaldo?",defaultPath:a,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!t)return;await o.fs.writeTextFile(t,e),M={texto:`Respaldo guardado en ${t}`,malo:!1}}catch(t){M={texto:`No pude guardar el respaldo: ${String(t)}`,malo:!0}}P()});b.set("importar",async()=>{let e=Oo();if(e)try{let o=await e.dialog.open({title:"\xBFQu\xE9 respaldo quieres cargar?",multiple:!1,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!o)return;let{estado:t,aviso:n}=ea(await e.fs.readTextFile(o));return t?(c=t,M={texto:"Respaldo importado.",malo:!1},$()):(M={texto:n.texto,malo:!0},P())}catch(o){return M={texto:`No pude leer ese archivo: ${String(o)}`,malo:!0},P()}let a=document.getElementById("archivo");a.onchange=async()=>{let o=a.files?.[0];if(!o)return;let{estado:t,aviso:n}=ea(await o.text());if(!t)return M={texto:n.texto,malo:!0},P();c=t,M={texto:"Respaldo importado.",malo:!1},$()},a.click()});document.addEventListener("input",e=>{let a=e.target;if(a instanceof HTMLInputElement&&(a.hasAttribute("data-dinero")&&Ga(a),a.dataset.campo==="desdePago")){let o=a.parentElement?.querySelector(".mes-de-pago");if(o){let t=Math.max(1,Math.round(Number(a.value)||1));o.textContent=t<=1?"desde el primero":j(L(t,A()).optimista)}}});document.addEventListener("focusout",e=>{let a=e.target?.closest?.("[data-panel]");if(!a||e.relatedTarget?.closest?.("[data-panel]")===a)return;let t=a.dataset.panel;setTimeout(()=>{if(de||Co()===t)return;let n=He().find(([r])=>r===t)?.[1],s=document.getElementById(`panel-${t}`);n!==void 0&&s&&ga(s,n)},0)});document.addEventListener("toggle",e=>{let a=e.target,o=a?.dataset?.mes;o&&(a.open?W.add(o):W.delete(o))},!0);document.addEventListener("change",e=>{let a=e.target?.closest("[data-accion]");a&&b.get(a.dataset.accion)?.(a,e)});document.addEventListener("click",e=>{let a=e.target,o=a?.closest?.("tr[data-resumen]");if(Ne){Ne=!1;return}if(o&&!a?.closest("input, select, textarea, button, a")&&window.matchMedia("(max-width: 620px)").matches){Zt(o);return}let t=e.target?.closest("button[data-accion]");de=!1,t?(J=!1,b.get(t.dataset.accion)?.(t,e)):J&&(J=!1,ba())});"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(()=>{})});var _e=Ha();c=_e.estado;_e.aviso&&(M={texto:_e.aviso.texto,malo:_e.aviso.grave});function en(){let e=new Set(c.repartos.map(o=>o.ingresoId)),a=c.ingresos.filter(o=>!e.has(o.id)).sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o of a)c.repartos.push(K(o));return a.length>0}en()&&ie(c);P();globalThis.__estado=()=>c;globalThis.__reiniciar=()=>{c=k(),$()};b.set("nube-entrar",async()=>{let e=document.getElementById("nube-correo")?.value??"",a=document.getElementById("nube-clave")?.value??"";if(!e.trim()||!a)return M={texto:"Escribe tu correo y tu contrase\xF1a.",malo:!0},P();try{M={texto:`Entraste como ${(await no(e,a)).correo}. Ya puedes sincronizar.`,malo:!1}}catch(o){M={texto:o.message,malo:!0}}P()});b.set("nube-salir",()=>{ia(),Fe=null,q=[],M={texto:"Saliste de la cuenta. Tus datos siguen aqu\xED, intactos.",malo:!1},P()});b.set("nube-sincronizar",async()=>{if(!le){le=!0,P();try{let e=await io(c,Fe,new Date().toISOString());c=e.estado,Fe=JSON.parse(JSON.stringify(e.estado)),q=e.descartes.map(a=>({tabla:a.tabla,id:a.id,campo:a.campo,valor:a.valor,gano:a.gano,nombre:a.nombre})),ie(c),to(Fe),M={texto:q.length===0?"Todo al d\xEDa. Nada que resolver.":`Listo. ${q.length} dato(s) distintos entre los dos aparatos: mira abajo.`,malo:!1}}catch(e){M={texto:e.message,malo:!0}}le=!1,P()}});b.set("nube-revertir",e=>{let a=Number(e.dataset.i),o=q[a];if(!o)return;let t=go(c,o);if(!t.ok)return M={texto:t.motivo??"Eso no se puede deshacer desde aqu\xED.",malo:!0},P();q=q.filter((n,s)=>s!==a),ie(c),M={texto:`Listo: ${ca(o,c)} se queda con ${Te(o.campo,o.valor)}. Sincroniza otra vez para que el otro aparato lo tome.`,malo:!1},P()});document.addEventListener("keydown",e=>{if(e.key!=="Enter"||e.isComposing)return;let a=e.target;!a||a.closest(".capa-dialogo")||!(a instanceof HTMLInputElement)||a.type==="checkbox"||(e.preventDefault(),a.blur())});
