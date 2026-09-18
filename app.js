var ee=Number.MAX_SAFE_INTEGER;function v(a){let e=typeof a=="number"?a:Number(a);return Number.isFinite(e)?Math.abs(e)>ee?e<0?-ee:ee:Math.round(e):0}function ca(a,e){return v(a*e)}var Ie=100;function nt(a,e){return e<=0?"sin_pagar":e>=a+Ie?"pagaron_de_mas":e>=a-Ie?"completa":"parcial"}function la(a,e){let o=new Map;for(let t of e){let n=o.get(t.cuentaDeCobroId)??[];n.push(t),o.set(t.cuentaDeCobroId,n)}return a.map(t=>{let n=(o.get(t.id)??[]).slice().sort((r,l)=>r.fecha.localeCompare(l.fecha)),s=n.reduce((r,l)=>r+v(l.monto),0),i=nt(v(t.montoEsperado),s);return{cuenta:t,ingresos:n,recibido:s,pendiente:i==="completa"?0:Math.max(0,v(t.montoEsperado)-s),estado:i,ultimoPago:n.length?n[n.length-1].fecha:null}})}function qe(a){return a.filter(e=>e.pendiente>0)}function Pa(a){return a.reduce((e,o)=>e+o.pendiente,0)}var Sa=new Intl.NumberFormat("es-CO");function Ae(a){let e=`$${Sa.format(a.cuenta.montoEsperado)}`,o=`$${Sa.format(a.recibido)}`;switch(a.estado){case"sin_pagar":return`${a.cuenta.periodo}: sin pagar \xB7 te deben ${e}`;case"parcial":return`${a.cuenta.periodo}: te pagaron ${o} de ${e} \xB7 faltan $${Sa.format(a.pendiente)}`;case"completa":return`${a.cuenta.periodo}: pagada completa (${o})`;case"pagaron_de_mas":return`${a.cuenta.periodo}: te pagaron ${o} de ${e} \xB7 $${Sa.format(a.recibido-a.cuenta.montoEsperado)} de mas`}}function st(a,e){let o=new Date(a.getTime());return o.setDate(o.getDate()+e),o}function Ra(a,e,o){return st(e,(a-1)*o)}function q(a,e){let o=Math.max(1,e.diasOptimista);return{optimista:Ra(a,e.desde,o),pesimista:Ra(a,e.desde,Math.max(o,e.diasPesimista))}}function oe(a){return a.diasPesimista<=a.diasOptimista}var rt=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function _(a){return`${rt[a.getMonth()]} de ${a.getFullYear()}`}var we=["ene.","feb.","mar.","abr.","mayo","jun.","jul.","ago.","sept.","oct.","nov.","dic."];function da(a){let[e,o]=[a.optimista,a.pesimista],t=we[e.getMonth()],n=we[o.getMonth()];return e.getFullYear()!==o.getFullYear()?`${t} ${e.getFullYear()} \u2013 ${n} ${o.getFullYear()}`:e.getMonth()===o.getMonth()?`${t} ${e.getFullYear()}`:`${t} \u2013 ${n} ${o.getFullYear()}`}function K(a){let e=_(a.optimista),o=_(a.pesimista);return e===o?e:`entre ${e} y ${o}`}function Ca(a){return new Map(a.map(e=>[e.id,Math.max(0,v(e.valor)-v(e.abonado??0))]))}function it(a){return a.baseCobro??(a.tipo==="porcentaje"?"cada_ingreso":"una_vez_por_cuenta")}function ct(a,e,o){if(!o&&it(a)==="una_vez_por_cuenta")return!1;if(a.modo==="primer_pago")return e===1&&o;if(e<(a.desdePago??1))return!1;if(a.modo==="cada_pago")return!0;let t=a.supuesto??"siempre";return t==="nunca"?!1:t==="cada_dos_pagos"?e%2===1:!0}function Ia(a,e,o){let t=a,n=0;for(let s of e??[]){let i=Math.max(1,Math.round(s.desdePago));o>=i&&i>=n&&(t=s.valor,n=i)}return t}function lt(a,e,o){let t=Ia(a.valor,a.cambios,o);return a.tipo==="porcentaje"?ca(e,t):v(t)}function dt(a,e){return a.maximoPorPago&&a.maximoPorPago>0?v(a.maximoPorPago):a.enCuotas&&a.enCuotas>0?Math.max(1,Math.ceil(v(a.valor)/Math.round(a.enCuotas))):e}function Z(a,e,o,t,n,s,i,r=!0){let l=v(e),u=[];for(let $ of o){if(!ct($,a,r))continue;let E=Math.min(lt($,e,a),l);E<=0||(u.push({nombre:$.nombre,monto:E}),l-=E)}let d=Ia(t.base,t.cambios,a),f=Math.min(v(d),l);l-=f;let g=[],b=0;for(let $ of n){let E=s.get($.id)??0;if(E<=0||a<($.desdePago??1))continue;let M=dt($,E),R=Math.min(E,l,M);if(t.elastico&&R<E&&M>=E){let C=Math.max(0,f-v(t.minimo)),F=E-R;F<=C&&(f-=F,b+=F,R=E)}if(!(R<=0)&&(g.push({metaId:$.id,monto:R}),s.set($.id,E-R),l-=Math.min(R,l),l<=0))break}let x=l;return{numero:a,ingreso:e,obligaciones:u,aColchon:f,recorteColchon:b,abonos:g,sobrante:x,saldoAhorro:i+f+x}}function Te(a,e,o,t,n,s,i=!0){let r=a.cuentaDeCobroId===void 0||a.cuentaDeCobroId==="",l=Z(e,v(a.monto),r?[]:o,r?{...t,base:0,minimo:0}:t,n,s,0,i),u=new Map(n.map(d=>[d.id,d]));return{id:`rep-${a.id}`,ingresoId:a.id,obligaciones:l.obligaciones.map(d=>({nombre:d.nombre,monto:d.monto})),abonos:l.abonos.map(d=>({nombre:u.get(d.metaId)?.nombre??"(meta borrada)",monto:d.monto,refId:d.metaId})),alAhorro:l.aColchon+l.sobrante,propuesto:!0}}function ut(a){let e=o=>o.reduce((t,n)=>t+v(n.monto),0);return e(a.obligaciones)+e(a.abonos)+e(a.gastos??[])+v(a.alAhorro)}function ua(a,e){return v(e.monto)-ut(a)}var te=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Le(a){return a.slice(0,7)}function aa(a,e){let o=v(e.monto);if(o===0)return;let t=a.get(e.nombre);t?t.monto+=o:a.set(e.nombre,{...e,monto:o})}function ne(a,e){let o=new Map(e.map(n=>[n.ingresoId,n])),t=new Map;for(let n of a){let s=Le(n.fecha),i=t.get(s);i||(i={mes:s,entro:0,deTrabajo:0,deFuera:0,aObligaciones:0,aMetas:0,enGastos:0,alAhorro:0,detalle:[],sinAsignar:0,_detalle:new Map},t.set(s,i));let r=v(n.monto);i.entro+=r,n.cuentaDeCobroId===void 0||n.cuentaDeCobroId===""?i.deFuera+=r:i.deTrabajo+=r;let u=o.get(n.id);if(!u){i.sinAsignar+=r;continue}for(let d of u.obligaciones)i.aObligaciones+=v(d.monto),aa(i._detalle,d);for(let d of u.abonos)i.aMetas+=v(d.monto),aa(i._detalle,d);for(let d of u.gastos??[])i.enGastos+=v(d.monto),aa(i._detalle,d);i.alAhorro+=v(u.alAhorro),i.sinAsignar+=ua(u,n)}return[...t.values()].map(({_detalle:n,...s})=>({...s,detalle:[...n.values()].sort((i,r)=>r.monto-i.monto)})).sort((n,s)=>n.mes.localeCompare(s.mes))}function Oe(a){let e=new Map;for(let o of a)for(let t of[...o.obligaciones,...o.abonos,...o.gastos??[]])aa(e,t);return[...e.values()].sort((o,t)=>t.monto-o.monto)}function qa(a){let[e,o]=a.split("-"),t=Number(o)-1;return te[t]?`${te[t]} de ${e}`:a}function je(a,e,o,t=[]){let n=new Map,s=new Map,i=new Map(t.map(l=>[l.id,l.nombre])),r=l=>i.get(l)??l;for(let l of a){let u=Ra(l.numero,e,Math.max(1,o)),d=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,f=n.get(d);f||(f={mes:d,entro:0,aObligaciones:0,aMetas:0,alAhorro:0,detalle:[],pagos:[]},n.set(d,f),s.set(d,new Map));let g=s.get(d);f.pagos.push(l.numero),f.entro+=v(l.ingreso);for(let b of l.obligaciones)f.aObligaciones+=v(b.monto),aa(g,{nombre:b.nombre,monto:b.monto});for(let b of l.abonos)f.aMetas+=v(b.monto),aa(g,{nombre:r(b.metaId),monto:b.monto,refId:b.metaId});f.alAhorro+=v(l.aColchon)+v(l.sobrante)}return[...n.values()].map(l=>({...l,detalle:[...s.get(l.mes).values()].sort((u,d)=>d.monto-u.monto)})).sort((l,u)=>l.mes.localeCompare(u.mes))}function Aa(a,e){let o=new Set(e.map(t=>t.cuentaDeCobroId).filter(t=>!!t));return a.cuentaDeCobroId?o.has(a.cuentaDeCobroId)?o.size:o.size+1:Math.max(1,o.size)}function G(a){return(a??[]).filter(e=>v(e.monto)!==0)}function Fe(a,e){let o=new Set([...G(e.obligaciones),...G(e.abonos)].map(t=>t.nombre));return[...G(a.obligaciones),...G(a.abonos)].map(t=>t.nombre).filter(t=>!o.has(t))}function Ne(a,e,o,t){let n=e.find(i=>i.nombre.trim()===a.trim());if(n)return n.compra?{tipo:"ya-comprada"}:v(n.abonado??0)>=v(n.valor)?{tipo:"ya-pagada"}:(n.desdePago??1)>t?{tipo:"empieza-despues",pago:n.desdePago}:{tipo:"no-se-sabe"};let s=o.find(i=>i.nombre.trim()===a.trim());return s?s.valor<=0?{tipo:"en-cero"}:s.modo==="primer_pago"&&t>1?{tipo:"solo-el-primer-pago"}:(s.desdePago??1)>t?{tipo:"empieza-despues",pago:s.desdePago}:s.modo==="puntual"?{tipo:"puntual"}:{tipo:"no-se-sabe"}:{tipo:"ya-no-esta"}}function _e(a,e,o,t=new Map){return[...new Set([...a.map(s=>s.mes),...e.map(s=>s.mes)])].sort().map(s=>{let i=a.find(d=>d.mes===s)??null,r=e.find(d=>d.mes===s)??null,l=s<o?"pasado":s===o?"actual":"futuro",u=t.get(s)??(i?{monto:i.entro,segun:"escenario"}:null);return{mes:s,estado:l,real:r,simulado:i,esperado:u,diferencia:l==="pasado"&&u&&r?r.entro-u.monto:null}})}function se(a){let e=0,o=0,t=0,n=0,s=0,i=0;for(let r of a)r.real&&(n+=1,e+=r.real.entro,o+=r.real.aObligaciones+r.real.aMetas+r.real.enGastos,t+=r.real.alAhorro),r.estado==="futuro"&&r.simulado&&(i+=1,s+=r.esperado?.monto??r.simulado.entro);return{mesesConDatos:n,entroDeVerdad:e,gastadoDeVerdad:o,guardadoDeVerdad:t,faltaPorEntrar:s,mesesQueFaltan:i}}var pt=new Map(te.map((a,e)=>[a,String(e+1).padStart(2,"0")]));function mt(a,e){let o=a.toLowerCase().trim(),t=o.match(/^(\d{4})-(\d{2})/);if(t)return`${t[1]}-${t[2]}`;let n=o.match(/([a-záéíóú]+)\D+(\d{4})/);if(n){let i=pt.get(n[1]);if(i)return`${n[2]}-${i}`}let s=e.slice().sort((i,r)=>i.fecha.localeCompare(r.fecha))[0];return s?Le(s.fecha):null}function ke(a,e,o,t){let n=new Map;for(let s of a){let i=e.filter(l=>l.cuentaDeCobroId!==void 0),r=mt(s.periodo,i);r&&n.set(r,v(s.montoEsperado))}return new Map(t.map(s=>{let i=n.get(s);return[s,i!==void 0?{monto:i,segun:"cuenta_de_cobro"}:{monto:v(o),segun:"escenario"}]}))}function ze(a,e){let o=s=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=new Map(e.map(s=>[o(s.nombre),s])),n=[];for(let s of G(a.gastos)){let i=t.get(o(s.nombre));i&&n.push({gasto:s,metaId:i.id,metaNombre:i.nombre})}return n}function pa(a,e){let o=new Map;for(let t of e)for(let n of t.abonos)n.refId&&o.set(n.refId,(o.get(n.refId)??0)+v(n.monto));return new Map(a.map(t=>{let n=v(t.valor),s=v(t.abonado??0),i=o.get(t.id)??0,r=Math.min(s+i,n);return[t.id,{previo:s,real:i,total:r,falta:Math.max(0,n-r)}]}))}function re(a,e){let o=pa(a,e);return a.map(t=>({...t,abonado:o.get(t.id).total}))}function He(a,e){let o=0;for(let t of pa(a,e).values())o+=t.total;return o}var gt=600;function ma(a){let e=Ca(a.metas),o=a.maxPagos??gt,t=[],n=new Map,s=new Map,i=new Map,r=new Map,l=0,d=Math.max(1,Math.round(a.desdePago??1))-1;for(;t.length<o&&[...e.values()].some(g=>g>0);){d+=1;let g=Z(d,v(Ia(a.ingresoEsperado,a.cambiosIngreso,d)),a.obligaciones,a.colchon,a.metas,e,l);l=g.saldoAhorro,t.push(g);for(let b of g.abonos)n.has(b.metaId)||n.set(b.metaId,d),i.set(b.metaId,(i.get(b.metaId)??0)+1),r.set(b.metaId,(r.get(b.metaId)??0)+b.monto),(e.get(b.metaId)??0)<=0&&s.set(b.metaId,d)}let f=a.metas.map(g=>{let b=Math.min(v(g.abonado??0),v(g.valor)),x=r.get(g.id)??0;return{metaId:g.id,nombre:g.nombre,grupo:g.grupo,valor:g.valor,pagoInicio:n.get(g.id)??null,pagoFin:s.get(g.id)??null,cantidadPagos:i.get(g.id)??0,totalAbonado:b+x,completada:(e.get(g.id)??0)<=0,yaEstabaPagada:b>=v(g.valor)}});return{escenario:a.nombre,pagos:t,metas:f,totalPagos:d,ahorroFinal:l,incompleta:t.length>=o&&f.some(g=>!g.completada)}}function Be(a){let e=new Map;for(let o of a.metas){if(!o.grupo)continue;let t=e.get(o.grupo)??[];t.push(o),e.set(o.grupo,t)}return[...e.entries()].map(([o,t])=>{let n=t.map(r=>r.pagoInicio).filter(r=>r!==null),s=t.map(r=>r.pagoFin).filter(r=>r!==null),i=t.every(r=>r.completada);return{grupo:o,valor:t.reduce((r,l)=>r+l.valor,0),pagoInicio:n.length?Math.min(...n):null,pagoFin:i&&s.length?Math.max(...s):null,totalAbonado:t.reduce((r,l)=>r+l.totalAbonado,0),completado:i,yaEstabaPagado:t.every(r=>r.yaEstabaPagada)}})}function Ve(a,e){return e.filter(t=>t.antesDelPago&&t.antesDelPago>0).map(t=>{let n=a.metas.find(r=>r.metaId===t.id),s=n?.pagoFin??null,i=n?.yaEstabaPagada?0:s;return{metaId:t.id,nombre:t.nombre,queria:Math.round(t.antesDelPago),termina:i,seRetrasa:i===null?null:Math.max(0,i-Math.round(t.antesDelPago))}})}function Ge(a,e){let o=v(e);if(o<=0)return null;let t=ma(a),n=ma({...a,ingresoEsperado:v(a.ingresoEsperado)+o,maxPagos:1}),s=new Map(n.metas.map(l=>[l.metaId,l.totalAbonado])),r=1+ma({...a,metas:a.metas.map(l=>({...l,abonado:Math.max(v(l.abonado??0),s.get(l.id)??0)}))}).totalPagos;return{pendiente:o,pagosAhora:t.totalPagos,pagosSiPagan:r,seAdelanta:Math.max(0,t.totalPagos-r)}}function ie(a,e,o){return new Date(a,e-1,o)}function wa(a,e){let o=new Date(a.getTime());return o.setDate(o.getDate()+e),o}function bt(a){let e=a.getDay();return e===1?a:wa(a,(8-e)%7)}function ft(a){let e=a%19,o=Math.floor(a/100),t=a%100,n=Math.floor(o/4),s=o%4,i=Math.floor((o+8)/25),r=Math.floor((o-i+1)/3),l=(19*e+o-n-r+15)%30,u=Math.floor(t/4),d=t%4,f=(32+2*s+2*u-l-d)%7,g=Math.floor((e+11*l+22*f)/451),b=Math.floor((l+f-7*g+114)/31),x=(l+f-7*g+114)%31+1;return ie(a,b,x)}function ht(a){let e=ft(a),o=s=>wa(e,s),t=[[1,1,"A\xF1o Nuevo"],[5,1,"D\xEDa del Trabajo"],[7,20,"Independencia de Colombia"],[8,7,"Batalla de Boyac\xE1"],[12,8,"Inmaculada Concepci\xF3n"],[12,25,"Navidad"]],n=[[1,6,"Reyes Magos"],[3,19,"San Jos\xE9"],[6,29,"San Pedro y San Pablo"],[8,15,"Asunci\xF3n de la Virgen"],[10,12,"D\xEDa de la Raza"],[11,1,"Todos los Santos"],[11,11,"Independencia de Cartagena"]];return[...t.map(([s,i,r])=>({fecha:ie(a,s,i),nombre:r})),...n.map(([s,i,r])=>({fecha:bt(ie(a,s,i)),nombre:r})),{fecha:o(-3),nombre:"Jueves Santo"},{fecha:o(-2),nombre:"Viernes Santo"},{fecha:o(43),nombre:"Ascensi\xF3n del Se\xF1or"},{fecha:o(64),nombre:"Corpus Christi"},{fecha:o(71),nombre:"Sagrado Coraz\xF3n de Jes\xFAs"}].sort((s,i)=>s.fecha.getTime()-i.fecha.getTime())}var ga=a=>`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`;function ce(a){return ht(a.getFullYear()).find(e=>ga(e.fecha)===ga(a))?.nombre??null}function vt(a){return ce(a)!==null}function le(a){return a.getDay()===0}function Qe(a){let e=new Date(a.getTime());for(let o=0;o<15&&(le(e)||vt(e));o++)e=wa(e,-1);return e}var Ye=30,Ue="Febrero no tiene 30: se radica el \xFAltimo d\xEDa del mes (28, o 29 si es bisiesto), y si ese d\xEDa cae domingo o festivo se retrocede igual que siempre.";function $t(a,e){let o=new Date(a,e,0).getDate(),t=o<Ye,n=new Date(a,e-1,Math.min(Ye,o)),s=Qe(n),i=null;if(ga(s)!==ga(n)){let r=ce(n);i=r?`el ${n.getDate()} es festivo (${r})`:le(n)?`el ${n.getDate()} cae domingo`:`el ${n.getDate()} no es d\xEDa h\xE1bil`}return{fecha:s,fechaOriginal:n,motivoDelCambio:i,usoUltimoDiaDelMes:t}}var de=[{id:"cuenta",nombre:"Cuenta de cobro diligenciada",frecuencia:"cada_mes",detalle:"Con una descripci\xF3n del servicio prestado."},{id:"informe",nombre:"Informe de actividades",frecuencia:"cada_mes",detalle:"Detallando espec\xEDficamente las funciones o actividades realizadas."},{id:"conformidad",nombre:"Certificado de conformidad del servicio",frecuencia:"cada_mes",detalle:"Lo entrega el coordinador o l\xEDder del \xE1rea: hay que ped\xEDrselo con tiempo."},{id:"seguridad_social",nombre:"Planilla de seguridad social",frecuencia:"cada_mes",obligatorioExplicito:!0,detalle:"Liquidada del mes VENCIDO al que se est\xE1 cobrando. La circular la marca como obligatoria."},{id:"constancia",nombre:"Constancia de prestaci\xF3n de servicio firmada por el paciente",frecuencia:"solo_asistencial",detalle:"Solo personal asistencial. Como t\xE9cnico de sistemas, no aplica."},{id:"rut",nombre:"RUT actualizado",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez."},{id:"bancaria",nombre:"Certificaci\xF3n bancaria",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez, o si cambia de cuenta."}];function Ta(){return de.filter(a=>a.frecuencia==="cada_mes")}var Mt=5;function Dt(a,e){let o=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime(),t=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime();return Math.round((t-o)/864e5)}var Je=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function ue(a,e=[]){let o=$t(a.getFullYear(),a.getMonth()+1),t=Dt(a,o.fecha),n=t<0?"vencido":t===0?"hoy":t<=Mt?"pronto":"tranquilo",s=o.fecha.getDate(),i=Je[o.fecha.getMonth()],r=n==="vencido"?`Se pas\xF3 la fecha: hab\xEDa que radicar el ${s} de ${i}`:n==="hoy"?"HOY es el \xFAltimo d\xEDa para radicar la cuenta de cobro":n==="pronto"?`Faltan ${t} d\xEDas: radicas el ${s} de ${i}`:`La cuenta de cobro se radica el ${s} de ${i}`,l=Ta().filter(u=>!e.includes(u.id)).map(u=>u.id);return{limite:o,diasQueFaltan:t,urgencia:n,titular:r,soportesPendientes:l}}function Xe(a){let e=a.fecha.getDate(),o=Je[a.fecha.getMonth()];return a.motivoDelCambio?`Se radica el ${e} de ${o}, no el ${a.fechaOriginal.getDate()}, porque ${a.motivoDelCambio}.`:`Se radica el ${e} de ${o}.`}function La(a){return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`}function Et(){return new Date().toISOString().slice(0,10)}function yt(){return[]}function Q(){return{version:1,escenario:{nombre:"Mi escenario",ingresoEsperado:2e6,colchonBase:1e5,colchonMinimo:0,colchonElastico:!1,fechaPrimerPago:Et(),diasOptimista:30,diasPesimista:60},obligaciones:yt(),metas:[],cuentas:[],ingresos:[],repartos:[],soportesMarcados:{}}}function Y(a){return`${a}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}var We="gestiondinerotrabajo.estado";function Ke(a){let e=Q();if(typeof a!="object"||a===null)return e;let o=a;return{version:1,escenario:{...e.escenario,...o.escenario??{}},obligaciones:o.obligaciones??e.obligaciones,metas:o.metas??e.metas,cuentas:o.cuentas??e.cuentas,ingresos:o.ingresos??e.ingresos,repartos:o.repartos??e.repartos,soportesMarcados:o.soportesMarcados??e.soportesMarcados}}function Ze(){let a=null;try{a=localStorage.getItem(We)}catch{return{estado:Q(),aviso:{texto:"No pude leer los datos guardados. Est\xE1s viendo un inicio en blanco.",grave:!0}}}if(!a)return{estado:Q(),aviso:null};try{return{estado:Ke(JSON.parse(a)),aviso:null}}catch{return{estado:Q(),aviso:{texto:"Los datos guardados est\xE1n da\xF1ados. No los borr\xE9: sigue ah\xED el archivo por si se puede recuperar.",grave:!0}}}}function ea(a){try{return localStorage.setItem(We,JSON.stringify(a)),null}catch(e){return e instanceof Error?e.message:"no se pudo guardar"}}function ao(a){return JSON.stringify(a,null,2)}function pe(a){try{return{estado:Ke(JSON.parse(a)),aviso:null}}catch{return{estado:null,aviso:{texto:"Ese archivo no es un respaldo v\xE1lido. No cambi\xE9 nada de lo que ten\xEDas.",grave:!0}}}}var me=null;function oa(a){return me?.(),new Promise(e=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${Oa(a.titulo)}</h3>
        ${a.detalle?`<p class="dlg-detalle">${Oa(a.detalle)}</p>`:""}
        <input class="dlg-campo" type="text" ${a.dinero?'inputmode="numeric" data-dinero':""}
               value="${Oa(a.valorInicial??"")}" />
        <div class="dlg-botones">
          <button class="dlg-cancelar">Cancelar</button>
          <button class="primario dlg-aceptar">${Oa(a.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=o.querySelector(".dlg-campo"),n=r=>{document.removeEventListener("keydown",i,!0),o.remove(),me=null,e(r)},s=()=>n(t.value);function i(r){r.key==="Escape"&&(r.preventDefault(),n(null)),r.key==="Enter"&&document.activeElement===t&&(r.preventDefault(),s())}o.querySelector(".dlg-aceptar").addEventListener("click",s),o.querySelector(".dlg-cancelar").addEventListener("click",()=>n(null)),o.addEventListener("mousedown",r=>{r.target===o&&n(null)}),document.addEventListener("keydown",i,!0),document.body.appendChild(o),me=()=>n(null),t.focus(),t.select()})}function Oa(a){return a.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var eo=new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});function ge(a){return a.replace(/\D/g,"")}function St(a){let e=ge(a);if(e==="")return"";let o=e.replace(/^0+(?=\d)/,"");return eo.format(Number(o))}function T(a){let e=ge(a);return e===""?0:Number(e)}function A(a){return eo.format(Math.round(a))}function oo(a){let e=a.value,o=a.selectionStart??e.length,t=ge(e.slice(0,o)).length,n=St(e);if(n===e)return;a.value=n;let s=0,i=0;for(;i<n.length&&s<t;)/\d/.test(n[i])&&s++,i++;a.setSelectionRange(i,i)}function to(a,e){let o=[],t=0;for(let n of e){let s=Math.max(1,Math.round(n)||1),i=a[t];o.push(s>1||!i?null:i),t+=s}return o}var Pt=4;function no(a){return a.length>=Pt}var k="__borrado";function ba(a,e){return a[e]??""}function H(a){if(a==null)return"null";if(Array.isArray(a))return`[${a.map(H).join(",")}]`;if(typeof a=="object"){let e=a;return`{${Object.keys(e).filter(t=>e[t]!==void 0).sort().map(t=>`${JSON.stringify(t)}:${H(e[t])}`).join(",")}}`}return JSON.stringify(a)}function ja(a,e){return H(a)===H(e)}function so(a,e,o,t){return a!==o?a>o:H(e)>=H(t)}function ro(a,e,o,t={}){let n={...t},s=new Set([...Object.keys(a??{}),...Object.keys(e)]);for(let i of s){if(i==="id")continue;let r=a===null?void 0:a[i],l=e[i];ja(r,l)||(n[i]=o)}return n}function Rt(a,e){if(a.datos.id!==e.datos.id)throw new Error(`No se pueden fusionar dos filas distintas: ${a.datos.id} y ${e.datos.id}.`);let o=new Set([...Object.keys(a.datos),...Object.keys(e.datos)]),t={id:a.datos.id},n={},s=[];for(let f of o){if(f==="id")continue;let g=a.datos[f],b=e.datos[f],x=ba(a.tocado,f),$=ba(e.tocado,f),E=so(x,g,$,b),M=E?g:b,R=E?b:g;M!==void 0&&(t[f]=M);let C=x>$?x:$;C!==""&&(n[f]=C),ja(g,b)||s.push({id:a.datos.id,campo:f,valor:R,cuando:E?$:x,gano:M})}let i=ba(a.tocado,k),r=ba(e.tocado,k),l=so(i,a.borradoEn,r,e.borradoEn),u=l?a.borradoEn:e.borradoEn,d=i>r?i:r;return d!==""&&(n[k]=d),ja(a.borradoEn,e.borradoEn)||s.push({id:a.datos.id,campo:k,valor:l?e.borradoEn:a.borradoEn,cuando:l?r:i,gano:u}),{fila:{datos:t,tocado:n,borradoEn:u??null},descartes:s}}function Ct(a,e){let o=a.datos.propuesto,t=e.datos.propuesto;return o===!1&&t===!0?a:t===!1&&o===!0?e:null}function It(a,e){let o=new Set([...Object.keys(a.datos),...Object.keys(e.datos)]),t=[];for(let n of o){if(n==="id")continue;let s=a.datos[n],i=e.datos[n];JSON.stringify(s)!==JSON.stringify(i)&&t.push({id:a.datos.id,campo:n,valor:i,cuando:ba(e.tocado,n),gano:s})}return t}function io(a,e){let o=new Map(e.map(s=>[s.datos.id,s])),t=[],n=[];for(let s of a){let i=o.get(s.datos.id);if(!i){t.push(s);continue}let r=Ct(s,i);if(r){t.push(r),n.push(...It(r,r===s?i:s)),o.delete(s.datos.id);continue}let l=Rt(s,i);t.push(l.fila),n.push(...l.descartes),o.delete(s.datos.id)}for(let s of e)o.has(s.datos.id)&&t.push(s);return{filas:t,descartes:n}}function co(a,e){return e?a.filter(o=>{let t=e.get(o.id);if(!t)return!0;let n=o.campo===k?t.borradoEn:t.datos[o.campo];return!ja(o.valor,n)}):a}var B=["escenario","obligaciones","metas","cuentas","ingresos","repartos","soportes"],qt="escenario";function U(a,e){return{datos:{...e,id:a},tocado:{},borradoEn:null}}var At=["ordenMetas","ordenObligaciones"];function lo(a,e){if(!Array.isArray(e))return a;let o=new Map(e.map((n,s)=>[String(n),s]));return[...a.filter(n=>o.has(n.id)).sort((n,s)=>o.get(n.id)-o.get(s.id)),...a.filter(n=>!o.has(n.id))]}function ta(a){return{escenario:[U(qt,{...a.escenario,ordenMetas:a.metas.map(e=>e.id),ordenObligaciones:a.obligaciones.map(e=>e.id)})],obligaciones:a.obligaciones.map(e=>U(e.id,{...e})),metas:a.metas.map(e=>U(e.id,{...e})),cuentas:a.cuentas.map(e=>U(e.id,{...e})),ingresos:a.ingresos.map(e=>U(e.id,{...e})),repartos:a.repartos.map(e=>U(e.id,{...e})),soportes:Object.entries(a.soportesMarcados).map(([e,o])=>U(e,{marcados:o}))}}function Fa(a,e){let o=r=>(a[r]??[]).filter(l=>l.borradoEn===null),t=r=>a[r]!==void 0&&a[r].length>0,n=t("escenario")?{...e.escenario,...o("escenario")[0]?.datos}:e.escenario;n&&"id"in n&&delete n.id;let s=(t("escenario")?o("escenario")[0]?.datos:void 0)??{};for(let r of At)delete n[r];let i={};for(let r of o("soportes")){let l=r.datos.marcados;i[r.datos.id]=Array.isArray(l)?l:[]}return{version:e.version,escenario:n,obligaciones:lo(t("obligaciones")?o("obligaciones").map(r=>r.datos):e.obligaciones,s.ordenObligaciones),metas:lo(t("metas")?o("metas").map(r=>r.datos):e.metas,s.ordenMetas),cuentas:t("cuentas")?o("cuentas").map(r=>r.datos):e.cuentas,ingresos:t("ingresos")?o("ingresos").map(r=>r.datos):e.ingresos,repartos:t("repartos")?o("repartos").map(r=>r.datos):e.repartos,soportesMarcados:t("soportes")?i:e.soportesMarcados}}function uo(a){return{id:a.datos.id,datos:a.datos,tocado:a.tocado,borrado_en:a.borradoEn}}function po(a){let e=a.datos??{};return{datos:{...e,id:String(a.id??e.id??"")},tocado:a.tocado??{},borradoEn:a.borrado_en??null}}function mo(a,e,o,t={}){let n=ta(a),s=e?ta(e):null,i={};for(let r of B){let l=new Map((s?.[r]??[]).map(g=>[g.datos.id,g])),u=t[r]??new Map,d=n[r].map(g=>({...g,tocado:ro(l.get(g.datos.id)?.datos??null,g.datos,o,u.get(g.datos.id)??{})})),f=new Set(n[r].map(g=>g.datos.id));for(let[g,b]of l)f.has(g)||d.push({datos:b.datos,tocado:{...u.get(g)??{},[k]:o},borradoEn:o});i[r]=d}return i}var J={url:"https://voncmkjcxzgxfloehovb.supabase.co",clave:"sb_publishable_Ev68VoFXNXqvcVOjgXoknw_vAFK-iHn"},be="gestiondinerotrabajo.sesion",_a="gestiondinerotrabajo.ultimaSincronizacion",Na="gestiondinerotrabajo.nube.sincronizado";function ka(){try{let a=localStorage.getItem(be);return a?JSON.parse(a):null}catch{return null}}function fe(a){try{a?localStorage.setItem(be,JSON.stringify(a)):localStorage.removeItem(be)}catch{}}function he(){fe(null);try{localStorage.removeItem(_a),localStorage.removeItem(Na)}catch{}}function go(){try{let a=localStorage.getItem(Na);return a?JSON.parse(a):null}catch{return null}}function za(a){try{a?localStorage.setItem(Na,JSON.stringify(a)):localStorage.removeItem(Na)}catch{}}async function bo(a,e){let o=await fetch(`${J.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:J.clave,"Content-Type":"application/json"},body:JSON.stringify({email:a.trim(),password:e})}),t=await o.json().catch(()=>({}));if(!o.ok)throw new Error(wt(o.status,t));let n={token:t.access_token,refresco:t.refresh_token,usuarioId:t.user?.id??"",correo:t.user?.email??a.trim(),caduca:Date.now()+(Number(t.expires_in)||3600)*1e3};if(!n.token||!n.usuarioId)throw new Error("Supabase respondi\xF3 sin sesi\xF3n. Revisa la direcci\xF3n del proyecto.");return fe(n),n}function wt(a,e){let o=String(e.error_description??e.msg??e.message??"");return a===400&&/invalid login|credentials/i.test(o)?"Correo o contrase\xF1a incorrectos.":a===400&&/email not confirmed/i.test(o)?"Falta confirmar el correo: mira el mensaje que te mand\xF3 Supabase.":a===422?"Ese correo no tiene un formato v\xE1lido.":a===429?"Demasiados intentos seguidos. Espera un momento.":o||`No se pudo entrar (error ${a}).`}async function ve(){let a=ka();if(!a)throw new Error("No has entrado con tu correo.");if(Date.now()<a.caduca-6e4)return a;let e=await fetch(`${J.url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:J.clave,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:a.refresco})});if(!e.ok)throw he(),new Error("La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.");let o=await e.json(),t={...a,token:o.access_token,refresco:o.refresh_token??a.refresco,caduca:Date.now()+(Number(o.expires_in)||3600)*1e3};return fe(t),t}function fo(a){return{apikey:J.clave,Authorization:`Bearer ${a.token}`,"Content-Type":"application/json"}}async function ho(a,e,o){let t=o?`&actualizado_en=gt.${encodeURIComponent(o)}`:"",n=await fetch(`${J.url}/rest/v1/${e}?select=*${t}`,{headers:fo(a)});if(!n.ok)throw new Error(await $o(n,e,"bajar"));return(await n.json()).map(po)}async function vo(a,e,o){if(o.length===0)return;let t=o.map(s=>({...uo(s),usuario_id:a.usuarioId})),n=await fetch(`${J.url}/rest/v1/${e}?on_conflict=usuario_id,id`,{method:"POST",headers:{...fo(a),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(t)});if(!n.ok)throw new Error(await $o(n,e,"subir"))}async function $o(a,e,o){let t=await a.text().catch(()=>"");return a.status===401?"La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.":a.status===404||/does not exist/i.test(t)?`Falta la tabla \xAB${e}\xBB en Supabase: ejecuta supabase/esquema.sql.`:a.status===403||/permission denied/i.test(t)?`Sin permiso sobre \xAB${e}\xBB. Revisa los grants del esquema.`:`No se pudo ${o} \xAB${e}\xBB (error ${a.status}).`}async function Mo(a,e,o){let t=await ve(),n=Ha(),s=mo(a,e,o),i=e?ta(e):null,r={},l=[];for(let d of B){let f=s[d],g=await ho(t,d,n),b=io(f,g);r[d]=b.filas;let x=i?new Map(i[d].map(M=>[M.datos.id,{datos:M.datos,borradoEn:M.borradoEn}])):null,$=new Map(b.filas.map(M=>[M.datos.id,M.datos]));l.push(...co(b.descartes,x).map(M=>{let R=$.get(M.id),C=typeof R?.nombre=="string"?R.nombre:typeof R?.periodo=="string"?R.periodo:void 0;return{...M,tabla:d,nombre:C}}));let E=new Set(f.filter(M=>Object.keys(M.tocado).length>0).map(M=>M.datos.id));for(let M of b.descartes)E.add(M.id);await vo(t,d,b.filas.filter(M=>E.has(M.datos.id)))}let u=new Date().toISOString();try{localStorage.setItem(_a,u)}catch{}return{estado:Fa(r,a),descartes:l,cuando:u}}async function Do(){let a=await ve(),e={};for(let o of B)e[o]=await ho(a,o,null);return e}async function Eo(a){let e=await ve();for(let t of B)await vo(e,t,a[t]??[]);let o=new Date().toISOString();try{localStorage.setItem(_a,o)}catch{}return o}function Ha(){try{return localStorage.getItem(_a)}catch{return null}}function yo(a,e){let o=[];for(let t of B){let n=new Map((a[t]??[]).map(r=>[r.datos.id,r])),s=new Map((e[t]??[]).map(r=>[r.datos.id,r])),i=[...n.keys(),...[...s.keys()].filter(r=>!n.has(r))];for(let r of i){let l=n.get(r),u=s.get(r),d={tabla:t,id:r};if(l&&!u){o.push({...d,clave:`${t}|${r}|fila`,tipo:"solo-aqui",aqui:l.datos,nube:void 0,datos:l.datos});continue}if(!l&&u){if(u.borradoEn)continue;o.push({...d,clave:`${t}|${r}|fila`,tipo:"solo-nube",aqui:void 0,nube:u.datos,datos:u.datos});continue}if(!l||!u)continue;if(u.borradoEn){o.push({...d,clave:`${t}|${r}|fila`,tipo:"borrada-en-la-nube",aqui:l.datos,nube:null,datos:l.datos});continue}let f=l.datos.propuesto===!1&&u.datos.propuesto===!0?"aqui":u.datos.propuesto===!1&&l.datos.propuesto===!0?"nube":void 0,g=new Set([...Object.keys(l.datos),...Object.keys(u.datos)]);for(let b of g){if(b==="id")continue;let x=l.datos[b],$=u.datos[b];H(x)!==H($)&&o.push({...d,clave:`${t}|${r}|${b}`,tipo:"campo",campo:b,aqui:x,nube:$,datos:l.datos,confirmadoEn:f})}}}return o}function $e(a,e){let o={};for(let t of a)o[t.clave]=t.tipo==="solo-aqui"?"aqui":t.tipo==="solo-nube"?"nube":t.tipo==="borrada-en-la-nube"?"aqui":t.confirmadoEn??(e==="subir"?"aqui":"nube");return o}function xo(a,e,o,t,n){let s=d=>t[d.clave]??$e([d],"subir")[d.clave],i=new Map;for(let d of o){let f=`${d.tabla}|${d.id}`;i.set(f,[...i.get(f)??[],d])}let r=d=>({datos:d.datos,tocado:{...d.tocado,[k]:n},borradoEn:n}),l={};for(let d of B){let f=new Map((a[d]??[]).map($=>[$.datos.id,$])),g=new Map((e[d]??[]).map($=>[$.datos.id,$])),b=[...f.keys(),...[...g.keys()].filter($=>!f.has($))],x=[];for(let $ of b){let E=f.get($),M=g.get($),R=i.get(`${d}|${$}`)??[],C=R.find(F=>F.tipo!=="campo");if(E&&!M)x.push(C&&s(C)==="nube"?r(E):E);else if(!E&&M)M.borradoEn?x.push(M):x.push(C&&s(C)==="aqui"?r(M):M);else if(E&&M&&M.borradoEn)x.push(C&&s(C)==="nube"?M:{datos:E.datos,tocado:{...M.tocado,...E.tocado,[k]:n},borradoEn:null});else if(E&&M){let F={...E.datos},$a={...M.tocado,...E.tocado};for(let I of R)I.tipo!=="campo"||!I.campo||(s(I)==="nube"&&(M.datos[I.campo]===void 0?delete F[I.campo]:F[I.campo]=M.datos[I.campo]),$a[I.campo]=n);x.push({datos:F,tocado:$a,borradoEn:null})}}l[d]=x}let u=l.escenario[0];if(u){let d={...u.datos};for(let[f,g]of[["ordenMetas","metas"],["ordenObligaciones","obligaciones"]]){let b=l[g].filter($=>!$.borradoEn).map($=>$.datos.id),x=Array.isArray(d[f])?d[f]:[];d[f]=[...x.filter($=>b.includes($)),...b.filter($=>!x.includes($))]}l.escenario[0]={...u,datos:d}}return l}var Ga="__borrado",Va=new Intl.NumberFormat("es-CO"),Tt={obligaciones:"obligaciones",abonos:"abonos a metas",gastos:"gastos",cambios:"cambios de valor",valor:"valor",nombre:"nombre",grupo:"grupo",abonado:"ya pagado antes",alAhorro:"al ahorro",monto:"monto",fecha:"fecha",ingresoEsperado:"ingreso esperado",fechaPrimerPago:"fecha del primer pago",marcados:"soportes marcados",clase:"compra o deuda",ordenMetas:"orden (prioridad) de las metas",ordenObligaciones:"orden de las obligaciones",desdePago:"empieza en el pago",maximoPorPago:"m\xE1ximo por pago",enCuotas:"reunirla en N pagos",antesDelPago:"la quiero antes del pago",colchonBase:"otros / ahorro por pago",colchonMinimo:"del ahorro no bajar de",colchonElastico:"usar el ahorro para adelantar metas",cambiosColchon:"cambios del ahorro",cambiosIngreso:"cambios del pago",diasOptimista:"d\xEDas entre pagos, si son puntuales",diasPesimista:"d\xEDas entre pagos, si se atrasan",tipo:"c\xF3mo se calcula",modo:"cada cu\xE1ndo",montoEsperado:"monto esperado",periodo:"periodo",propuesto:"sin confirmar",compra:"ya la compraste",nota:"nota",link:"enlace",cuentaDeCobroId:"cuenta de cobro",ingresoId:"pago"};function Qa(a,e){switch(a.tabla){case"metas":{let o=e.metas.find(t=>t.id===a.id)?.nombre??a.nombre;return o!==void 0?`la meta \xAB${o}\xBB`:"una meta que ya no est\xE1"}case"obligaciones":{let o=e.obligaciones.find(t=>t.id===a.id)?.nombre??a.nombre;return o!==void 0?`la obligaci\xF3n \xAB${o}\xBB`:"una obligaci\xF3n que ya no est\xE1"}case"cuentas":{let o=e.cuentas.find(t=>t.id===a.id);return o?`la cuenta de cobro de ${o.periodo}`:"una cuenta de cobro que ya no est\xE1"}case"ingresos":{let o=e.ingresos.find(t=>t.id===a.id);return o?`el pago del ${o.fecha} (${Va.format(o.monto)})`:"un pago que ya no est\xE1"}case"repartos":{let o=e.repartos.find(n=>n.id===a.id),t=o?e.ingresos.find(n=>n.id===o.ingresoId):void 0;return t?`el reparto del pago del ${t.fecha} (${Va.format(t.monto)})`:"un reparto de un pago que ya no est\xE1"}case"escenario":return"el escenario";case"soportes":return`los soportes de ${a.id}`}}function Ya(a){return a===Ga?"borrado":Tt[a]??a}function fa(a,e){return a===Ga?e?"borrada":"sin borrar":Ba(e)}function Ba(a){if(a==null||a==="")return"\u2014";if(typeof a=="number")return Va.format(a);if(typeof a=="boolean")return a?"s\xED":"no";if(typeof a=="string")return a;if(Array.isArray(a))return a.length===0?"nada":a.map(Ba).join(" \xB7 ");if(typeof a=="object"){let e=a;if(typeof e.nombre=="string"&&typeof e.monto=="number")return`${e.nombre} ${Va.format(e.monto)}`;if(typeof e.desdePago=="number"&&"valor"in e)return`desde el pago ${e.desdePago}: ${Ba(e.valor)}`;let o=Object.keys(e).sort().filter(t=>e[t]!==void 0).map(t=>`${Ya(t)}: ${Ba(e[t])}`);return o.length?o.join(", "):"\u2014"}return String(a)}var ha=[{id:"inicio",rotulo:"Inicio",icono:"\u{1F3E0}",paneles:["inicio","radicacion"]},{id:"calendario",rotulo:"Calendario",icono:"\u{1F5D3}\uFE0F",paneles:["vista"]},{id:"metas",rotulo:"Metas",icono:"\u{1F3AF}",paneles:["metas","proyeccion"]},{id:"registrar",rotulo:"Registrar",icono:"\u{1F4B5}",paneles:["cuentas","real"]},{id:"ajustes",rotulo:"Ajustes",icono:"\u2699\uFE0F",paneles:["escenario","obligaciones","nube"]}],Lt="inicio";function So(a){return ha.find(e=>e.paneles.includes(a))?.id??null}function Ua(a){return ha.some(e=>e.id===a)?a:Lt}var Po=new Intl.NumberFormat("es-CO"),Me=a=>`$${Po.format(Math.round(a))}`;function Ro(a,e,o){let t=[];return t.push(`${a.clase==="deuda"?"\u26A0\uFE0F ":""}${a.nombre.trim()||"(sin nombre)"}`),t.push(Me(a.valor)),a.compra?t.push("ya la compraste"):e?.yaEstabaPagada?t.push("ya est\xE1 pagada"):o?t.push(o):t.push("sin fecha todav\xEDa"),t.join(" \xB7 ")}function Co(a,e){let o=a.tipo==="porcentaje"?`${Ot(a.valor*100)} %${e?` = ${Me(e)}`:""}`:Me(a.valor),t=a.modo==="cada_pago"?"cada pago":a.modo==="puntual"?"puntual":a.modo==="primer_pago"?"solo el primero":String(a.modo),n=[a.nombre.trim()||"(sin nombre)",o,t];return(a.cambios?.length??0)>0&&n.push(`${a.cambios.length} cambio${a.cambios.length===1?"":"s"}`),n.join(" \xB7 ")}function Ot(a){return Number.isInteger(a)?String(a):Po.format(Math.round(a*10)/10)}function Io(a,e){let o=new Map(e.map(s=>[s.metaId,s])),t=a.filter(s=>!s.compra&&!o.get(s.id)?.yaEstabaPagada&&s.valor>0),n=null;for(let s of t){let i=o.get(s.id)?.pagoFin??null;i!==null&&(!n||i<n.pagoFin)&&(n={meta:s,pagoFin:i})}return n||(t.length>0?{meta:t[0],pagoFin:null}:null)}function De(a,e){return a.compra||a.valor<=0?1:Math.max(0,Math.min(1,e/a.valor))}function qo(a){let e=a.find(n=>n.numero===2)??a[0];if(!e||e.ingreso<=0)return null;let o=e.obligaciones.reduce((n,s)=>n+s.monto,0),t=e.abonos.reduce((n,s)=>n+s.monto,0);return{numero:e.numero,ingreso:e.ingreso,obligaciones:o,metas:t,ahorro:e.aColchon+e.sobrante}}function Ao(a,e){let o=2*Math.PI*e,t=a.reduce((s,i)=>s+Math.max(0,i),0),n=0;return a.map(s=>{let i=t>0?Math.max(0,s)/t*o:0,r={largo:i,desde:n};return n+=i,r})}function wo(a,e){if(e.campo===Ga)return{ok:!1,motivo:"Un borrado no se puede deshacer desde aqu\xED: vuelve a crear esa fila."};if(e.campo==="id")return{ok:!1,motivo:"El identificador de una fila no se cambia."};let o=Ft(a,e);if(!o)return{ok:!1,motivo:"Eso ya no est\xE1 en este aparato."};let t=jt(e);return e.valor===void 0?delete o[t]:o[t]=e.valor,{ok:!0}}function jt(a){return a.tabla==="soportes"?a.id:a.campo}function Ft(a,e){let o=t=>t.find(n=>n.id===e.id)??null;switch(e.tabla){case"escenario":return a.escenario;case"metas":return o(a.metas);case"obligaciones":return o(a.obligaciones);case"cuentas":return o(a.cuentas);case"ingresos":return o(a.ingresos);case"repartos":return o(a.repartos);case"soportes":return e.campo!=="marcados"?null:a.soportesMarcados;default:return null}}var Nt=new Intl.NumberFormat("es-CO"),m=a=>`$${Nt.format(Math.round(a))}`,c,D=null;function sa(a=new Date){let e=String(a.getMonth()+1).padStart(2,"0"),o=String(a.getDate()).padStart(2,"0");return`${a.getFullYear()}-${e}-${o}`}function p(a){return a.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var h=new Map;function Fo(a){if(!(a instanceof HTMLInputElement)&&!(a instanceof HTMLSelectElement))return null;let e=[a.id&&`#${a.id}`,a.dataset.accion&&`[data-accion="${a.dataset.accion}"]`,a.dataset.id&&`[data-id="${a.dataset.id}"]`,a.dataset.campo&&`[data-campo="${a.dataset.campo}"]`,a.dataset.tipo&&`[data-tipo="${a.dataset.tipo}"]`,a.dataset.i!==void 0&&`[data-i="${a.dataset.i}"]`].filter(Boolean);return e.length>0?e.join(""):null}var Ja=null,ye=null,va=!1,na=!1;var Ka=null,N=null,_t=6,Wa=!1;function kt(a){let o=window.innerHeight;a<90?window.scrollBy({top:-Math.max(6,(90-a)/3),behavior:"instant"}):a>o-90&&window.scrollBy({top:Math.max(6,(a-(o-90))/3),behavior:"instant"})}function No(a,e){return document.elementFromPoint(a,e)?.closest?.("tr[data-fila]")??null}function zt(a){for(let e of document.querySelectorAll(".destino"))e.classList.remove("destino");a&&Number(a.dataset.fila)!==N?.desde&&a.classList.add("destino")}function _o(){N?.fila.classList.remove("arrastrando");for(let a of document.querySelectorAll(".destino"))a.classList.remove("destino");N=null}document.addEventListener("pointerdown",a=>{let e=a.target?.closest?.(".asa"),o=e?.closest("tr[data-fila]");!e||!o||(N={desde:Number(o.dataset.fila),fila:o,movido:!1,y0:a.clientY},o.classList.add("arrastrando"),e.setPointerCapture?.(a.pointerId),a.preventDefault())});document.addEventListener("pointermove",a=>{N&&(!N.movido&&Math.abs(a.clientY-N.y0)<_t||(N.movido=!0,a.preventDefault(),kt(a.clientY),zt(No(a.clientX,a.clientY))))});document.addEventListener("pointerup",a=>{if(!N)return;let{desde:e,movido:o}=N,t=No(a.clientX,a.clientY);if(_o(),!o||!t)return;Wa=!0,setTimeout(()=>{Wa=!1},0);let n=Number(t.dataset.fila);if(!Number.isInteger(n)||n===e)return;let[s]=c.metas.splice(e,1);c.metas.splice(n,0,s),D={texto:`\xAB${s.nombre}\xBB qued\xF3 en la posici\xF3n ${n+1}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron.`,malo:!1},y()});document.addEventListener("pointercancel",()=>{N&&(_o(),P())});document.addEventListener("mousedown",a=>{let e=a.target;va=e?.closest("button[data-accion]")!==null&&e?.closest("button[data-accion]")!==void 0,Ja=Fo(e?.closest("input, select")??null),ye=e?.closest?.("[data-panel]")?.dataset.panel??null},!0);document.addEventListener("mouseup",()=>{setTimeout(()=>{va=!1,ye=null,na&&(na=!1,Se())},0)},!0);function Ht(a,e){let o=Ja!==null,t=Ja??a;if(Ja=null,!t)return;let n=document.querySelector(t);if(n&&(n.focus(),!o&&e!==null&&typeof n.setSelectionRange=="function"))try{n.setSelectionRange(e,e)}catch{}}function z(){ko()||Se()}function y(){ko()||P()}function ko(){let a=ea(c);return a&&(D={texto:`No pude guardar: ${a}`,malo:!0}),va?(na=!0,!0):!1}function w(){let a=c.escenario;return{desde:new Date(`${a.fechaPrimerPago}T12:00:00`),diasOptimista:a.diasOptimista,diasPesimista:a.diasPesimista}}function Bt(){let a=0,e=[...c.ingresos].sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o=0;o<e.length;o++)a=Math.max(a,Aa(e[o],e.slice(0,o)));return a+1}function zo(){let a=c.escenario;return{nombre:a.nombre,desdePago:Bt(),ingresoEsperado:a.ingresoEsperado,cambiosIngreso:a.cambiosIngreso,obligaciones:c.obligaciones,colchon:{nombre:"Otros / Ahorro",base:a.colchonBase,minimo:a.colchonMinimo,elastico:a.colchonElastico,cambios:a.cambiosColchon},metas:re(c.metas,c.repartos)}}function To(a){return`${((a==="ahorro"?c.escenario.cambiosColchon:c.escenario.cambiosIngreso)??[]).map((t,n)=>{let s=_(q(Math.max(1,t.desdePago),w()).optimista);return`<div class="cambio">
      <span class="rango">desde el</span>
      <input type="number" min="1" step="1" value="${t.desdePago}" class="corto"
        data-accion="cambio-escenario" data-cual="${a}" data-i="${n}" data-campo="desdePago" />
      <input type="text" inputmode="numeric" data-dinero value="${A(t.valor)}"
        class="corto-dinero" data-accion="cambio-escenario" data-cual="${a}" data-i="${n}" data-campo="valor" />
      <span class="rango">${p(s)}</span>
      <button class="icono" data-accion="borrar-cambio-escenario" data-cual="${a}" data-i="${n}" title="Quitar">\u2715</button>
    </div>`}).join("")}<button class="chico" data-accion="nuevo-cambio-escenario" data-cual="${a}">+ cambio</button>`}function Vt(){let a=c.escenario;return`
  <section class="panel">
    <h2>Escenario <span class="sufijo">\u2014 el supuesto sobre lo que va a entrar</span></h2>
    <div class="campos">
      <div class="campo">
        <label for="ingreso">Lo que espero por pago</label>
        <input id="ingreso" type="text" inputmode="numeric" data-dinero
               value="${A(a.ingresoEsperado)}"
               data-accion="escenario" data-campo="ingresoEsperado" />
      </div>
      <div class="campo">
        <label>El pago cambia</label>
        ${To("ingreso")}
      </div>
      <div class="campo">
        <label for="colchon">Otros / Ahorro por pago</label>
        <input id="colchon" type="text" inputmode="numeric" data-dinero
               value="${A(a.colchonBase)}"
               data-accion="escenario" data-campo="colchonBase" />
      </div>
      <div class="campo">
        <label for="minimo">Del ahorro no bajar de</label>
        <input id="minimo" type="text" inputmode="numeric" data-dinero
               value="${A(a.colchonMinimo)}"
               title="Solo aplica con el interruptor de abajo encendido"
               data-accion="escenario" data-campo="colchonMinimo" />
      </div>
      <div class="campo">
        <label>El ahorro cambia</label>
        ${To("ahorro")}
      </div>
      <div class="campo">
        <label for="fecha">Fecha del primer pago</label>
        <input id="fecha" type="date" class="ancho" value="${a.fechaPrimerPago}"
               data-accion="escenario" data-campo="fechaPrimerPago" />
      </div>
      <div class="campo">
        <label for="opt">D\xEDas entre pagos, si son puntuales</label>
        <input id="opt" type="number" min="1" value="${a.diasOptimista}"
               data-accion="escenario" data-campo="diasOptimista" />
      </div>
      <div class="campo">
        <label for="pes">D\xEDas entre pagos, si se atrasan</label>
        <input id="pes" type="number" min="1" value="${a.diasPesimista}"
               data-accion="escenario" data-campo="diasPesimista" />
      </div>
    </div>
    <p class="nota">
      <label class="interruptor">
        <input type="checkbox" data-accion="elastico" ${a.colchonElastico?"checked":""} />
        Usar el ahorro para adelantar metas
      </label>
      \u2014 apagado, el ahorro no se toca y las fechas son las conservadoras.
      ${a.colchonElastico?`<br /><span class="rango">Encendido: si recortando el ahorro se CIERRA una meta, se
           recorta \u2014 pero nunca por debajo de ${m(a.colchonMinimo)}. Solo para cerrar, nunca
           para abonar a medias.</span>`:""}
    </p>
    ${a.diasPesimista>a.diasOptimista?`<p class="nota rango">
      Los dos campos de d\xEDas son <strong>de pago a pago</strong>, no un retraso de una vez.
      Con ${a.diasPesimista} d\xEDas, el pago ${oe(w())?10:12} caer\xEDa
      ${(()=>{let e=w();return`<strong>${Math.round(11*(a.diasPesimista-a.diasOptimista)/30)} meses</strong> m\xE1s tarde que si fueran puntuales`})()}.
    </p>`:""}
  </section>`}var Gt={cada_pago:"Cada pago",primer_pago:"Solo el primer pago",puntual:"Puntual: cuando yo la marque"},Ho={siempre:"asumo que la pago siempre",cada_dos_pagos:"asumo un pago s\xED y otro no",nunca:"asumo que no la pago"};function Bo(a,e,o){let t=a??1,n=_(q(t,w()).optimista);return`<input type="number" min="1" step="1" value="${t}" class="corto"
             data-accion="${e}" data-id="${o}" data-campo="desdePago" />
          <span class="rango mes-de-pago">${t<=1?"desde el primero":p(n)}</span>`}function Za(){let a=c.cuentas.filter(e=>e.montoEsperado>0);if(a.length>0){let e=a.reduce((o,t)=>t.periodo.localeCompare(o.periodo)>0?t:o);return{monto:e.montoEsperado,de:e.periodo,esReal:!0}}return{monto:c.escenario.ingresoEsperado,de:"lo que esperas por pago",esReal:!1}}function Qt(a){let e=Za();if(e.monto<=0)return'<span class="rango">\u2014</span>';let o=a.tipo==="porcentaje"?ca(e.monto,a.valor):a.valor;return`<span class="calculado">${m(o)}</span>`}function Yt(a){let e=a.cambios??[];if(e.length===0)return"";let o=a.tipo==="porcentaje",t=(n,s)=>{let i=_(q(Math.max(1,n.desdePago),w()).optimista);return`<span class="cambio">
      <span class="rango">desde el pago</span>
      <input type="number" min="1" step="1" value="${n.desdePago}" class="corto"
        data-accion="cambio" data-id="${a.id}" data-i="${s}" data-campo="desdePago" />
      <span class="rango">(${p(i)}) pasa a</span>
      ${o?`<input type="number" min="0" max="100" step="0.5" value="${n.valor*100}" class="corto"
             data-accion="cambio" data-id="${a.id}" data-i="${s}" data-campo="valor" /><span class="rango">%</span>`:`<input type="text" inputmode="numeric" data-dinero value="${A(n.valor)}"
             class="corto-dinero" data-accion="cambio" data-id="${a.id}" data-i="${s}" data-campo="valor" />`}
      <button class="icono" data-accion="borrar-cambio" data-id="${a.id}" data-i="${s}"
        title="Quitar este cambio">\u2715</button>
    </span>`};return`<tr class="fila-cambios" data-hija-de="${a.id}">
    <td colspan="9"><span class="rango">${p(a.nombre)} \xB7</span>
      ${e.map(t).join("")}</td>
  </tr>`}function Ut(a){let e=a.modo==="puntual",o=Za(),t=o.monto>0&&a.tipo==="porcentaje"?ca(o.monto,a.valor):null;return`
  <tr data-id-fila="${a.id}" data-resumen="${p(Co(a,t))}"
      class="${a.id===Ka?"abierta":""}">
    <td><input class="ancho" value="${p(a.nombre)}" data-accion="oblig" data-id="${a.id}" data-campo="nombre" /></td>
    <td><input value="${p(a.grupo??"")}" placeholder="ninguno"
        data-accion="oblig" data-id="${a.id}" data-campo="grupo" /></td>
    <td>
      <select data-accion="oblig" data-id="${a.id}" data-campo="tipo">
        <option value="porcentaje" ${a.tipo==="porcentaje"?"selected":""}>% del ingreso</option>
        <option value="fijo" ${a.tipo==="fijo"?"selected":""}>Monto fijo</option>
      </select>
    </td>
    <td class="num">
      ${a.tipo==="porcentaje"?`<input type="number" step="0.5" min="0" max="100" value="${a.valor*100}"
             data-accion="oblig" data-id="${a.id}" data-campo="valor" />`:`<input type="text" inputmode="numeric" data-dinero value="${A(a.valor)}"
             data-accion="oblig" data-id="${a.id}" data-campo="valor" />`}
      <button class="chico" data-accion="nuevo-cambio" data-id="${a.id}"
        title="A partir de cierto pago, esto pasa a valer otra cosa">+ cambio</button>
    </td>
    <td class="num">${Qt(a)}</td>
    <td class="desde">${Bo(a.desdePago,"oblig",a.id)}</td>
    <td>
      <select data-accion="oblig" data-id="${a.id}" data-campo="modo">
        ${Object.entries(Gt).map(([n,s])=>`<option value="${n}" ${a.modo===n?"selected":""}>${s}</option>`).join("")}
      </select>
    </td>
    <td>
      ${e?`<select data-accion="oblig" data-id="${a.id}" data-campo="supuesto">
        ${Object.entries(Ho).map(([n,s])=>`<option value="${n}" ${(a.supuesto??"siempre")===n?"selected":""}>${s}</option>`).join("")}
      </select>`:'<span class="rango">\u2014</span>'}
    </td>
    <td class="num"><button class="icono" data-accion="borrar-oblig" data-id="${a.id}" title="Quitar">\u2715</button></td>
  </tr>`}function Ee(a,e){return Z(a,e,c.obligaciones,{nombre:"",base:0,minimo:0,elastico:!1},[],new Map,0).obligaciones.reduce((t,n)=>t+n.monto,0)}function Jt(){let a=Za();if(a.monto<=0)return"";let e=Ee(1,a.monto),o=Ee(2,a.monto),t=(s,i)=>`
    <div><span class="rotulo">${s}</span>
      <span class="valor">${m(a.monto-i)}</span>
      <span class="rotulo">libre para metas \xB7 se van ${m(i)}</span></div>`,n=a.esReal?`Calculado sobre <strong>${p(a.de)}</strong>: ${m(a.monto)}, que es lo que
       esperas cobrar de verdad. Si no hubiera cuenta de cobro registrada, saldr\xEDa del
       escenario de arriba.`:`Calculado sobre el escenario de arriba (${m(a.monto)}), que es una <em>suposici\xF3n</em>.
       En cuanto registres una cuenta de cobro, esta cifra sale de ah\xED.`;return`<div class="resumen resumen-oblig">
    ${t("En el primer pago",e)}
    ${e!==o?t("En los siguientes",o):""}
  </div>
  <p class="nota ${a.esReal?"":"aviso"}">${n}</p>`}function Xt(){let a=c.obligaciones.filter(e=>e.modo==="puntual");return c.obligaciones.length===0?`
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
        <tbody>${c.obligaciones.map(e=>Ut(e)+Yt(e)).join("")}</tbody>
      </table>
    </div>
    ${Jt()}
    <p class="nota"><button data-accion="nueva-oblig">+ Agregar obligaci\xF3n</button>
      ${Go("obligaciones")}
      ${Vo("obligaciones")}</p>
    ${a.length?`<p class="nota aviso">
      Las puntuales no se pueden adivinar. Para calcular las fechas
      ${a.map(e=>`<strong>${p(e.nombre)}</strong>: ${Ho[e.supuesto??"siempre"]}`).join(" \xB7 ")}.
    </p>`:""}
  </section>`}function Wt(a){if(!a.compra)return`<button data-accion="comprada" data-id="${a.id}">Ya la compr\xE9</button>`;let e=a.compra.precioReal-a.valor;return`<span class="completa">${p(qa(a.compra.mes))}</span>
    <span class="rango">${m(a.compra.precioReal)}${e===0?"":e<0?` \xB7 ${m(-e)} menos`:` \xB7 ${m(e)} m\xE1s`}</span>
    <button class="icono" data-accion="no-comprada" data-id="${a.id}" title="No la compr\xE9">\u2715</button>`}function Kt(a){let e=pa(c.metas,c.repartos).get(a.id),o=e.previo>0&&e.real>0&&Math.abs(e.previo-e.real)<=Math.max(1e3,e.real*.05),t=`<input type="text" inputmode="numeric" data-dinero value="${A(e.previo)}"
      title="Lo que ya le hab\xEDas abonado a esta meta ANTES de empezar a usar el programa"
      data-accion="meta" data-id="${a.id}" data-campo="abonado" />`;return e.real===0?t:`${t}
    <span class="rango">+ ${m(e.real)} de lo real</span>
    <span class="${e.falta===0?"completa":""}">= ${m(e.total)}</span>
    ${o?`<span class="aviso">\u26A0\uFE0F ${m(e.previo)} escrito a mano y ${m(e.real)}
      registrado: \xBFes el mismo dinero?
      <button class="icono" data-accion="quitar-previo" data-id="${a.id}"
        title="S\xED, dejar solo lo registrado">\u2713</button></span>`:""}`}function Vo(a){return`<span class="solo-telefono plegado-todo">
    <button class="chico" data-accion="desplegar-todo" data-lista="${a}">Desplegar todo</button>
    <button class="chico" data-accion="plegar-todo" data-lista="${a}">Plegar todo</button>
  </span>`}function Go(a){if((a==="metas"?c.metas.length:c.obligaciones.length)<2)return"";let o=a==="metas"?' title="Ojo: en las metas el orden es la prioridad de pago, as\xED que esto cambia el plan"':"";return`&nbsp; <span class="rango">Ordenar por</span>
    <button class="chico-linea" data-accion="ordenar" data-lista="${a}" data-por="nombre"${o}>nombre</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${a}" data-por="valor"${o}>valor</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${a}" data-por="grupo"${o}>grupo</button>`}function Zt(a,e,o,t,n){return`
  <tr data-fila="${e}" data-id-fila="${a.id}"
      data-resumen="${p(Ro(a,n,t))}"
      class="${a.clase==="deuda"?"es-deuda":""} ${a.id===Ka?"abierta":""}">
    <td class="orden">
      <span class="asa" title="Arrastra para moverla de sitio">\u283F</span>
      <button class="icono" data-accion="subir" data-i="${e}" ${e===0?"disabled":""} title="Subir">\u2191</button>
      <button class="icono" data-accion="bajar" data-i="${e}" ${e===o-1?"disabled":""} title="Bajar">\u2193</button>
    </td>
    <td><input class="ancho" value="${p(a.nombre)}" data-accion="meta" data-id="${a.id}" data-campo="nombre" />
      <select class="clase-meta" data-accion="meta" data-id="${a.id}" data-campo="clase"
        title="Solo para distinguirlas de un vistazo: no cambia el orden ni el reparto">
        <option value="compra" ${a.clase!=="deuda"?"selected":""}>\u{1F6D2} quiero comprarla</option>
        <option value="deuda" ${a.clase==="deuda"?"selected":""}>\u26A0\uFE0F ya la debo</option>
      </select></td>
    <td class="num"><input type="text" inputmode="numeric" data-dinero value="${A(a.valor)}"
        data-accion="meta" data-id="${a.id}" data-campo="valor" /></td>
    <td><input value="${p(a.grupo??"")}" placeholder="ninguno"
        data-accion="meta" data-id="${a.id}" data-campo="grupo" /></td>
    <td class="desde">${Bo(a.desdePago,"meta",a.id)}
      <div class="plazo"><span class="rango">la quiero antes del</span>
        <input type="number" min="0" step="1" class="corto" value="${a.antesDelPago??""}"
          placeholder="\u2014" title="Solo para avisarte: no cambia el orden de pago"
          data-accion="meta" data-id="${a.id}" data-campo="antesDelPago" />
        ${a.antesDelPago&&a.antesDelPago>0?`<span class="rango">${p(_(q(a.antesDelPago,w()).optimista))}</span>`:""}</div>
    </td>
    <td class="num ritmo">
      <input type="text" inputmode="numeric" data-dinero
        value="${a.maximoPorPago?A(a.maximoPorPago):""}" placeholder="sin tope"
        title="M\xE1ximo que puede recibir en un pago"
        data-accion="meta" data-id="${a.id}" data-campo="maximoPorPago" />
      <span class="rango">o en <input type="number" min="0" step="1" class="corto"
        value="${a.enCuotas??""}" placeholder="\u2014"
        title="Reunirla en tantos pagos: la cuota la calculo yo"
        data-accion="meta" data-id="${a.id}" data-campo="enCuotas" /> pagos
        ${a.enCuotas&&a.enCuotas>0&&!a.maximoPorPago?`\xB7 ${m(Math.ceil(a.valor/Math.round(a.enCuotas)))} c/u`:""}</span>
    </td>
    <td class="num pagado">${Kt(a)}</td>
    <td class="compra">${Wt(a)}</td>
    <td class="num">
      <button class="icono" data-accion="duplicar-meta" data-id="${a.id}" title="Duplicar">\u29C9</button>
      <button class="icono" data-accion="borrar-meta" data-id="${a.id}" title="Quitar">\u2715</button>
    </td>
  </tr>`}function an(a){let e=w(),o=new Map((a?.metas??[]).map(n=>[n.metaId,{res:n,cuando:n.pagoFin!==null?da(q(n.pagoFin,e)):null}]));if(c.metas.length===0)return`
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
        <tbody>${c.metas.map((n,s)=>{let i=o.get(n.id);return Zt(n,s,c.metas.length,i?.cuando??null,i?.res??null)}).join("")}</tbody>
      </table>
    </div>
    <p class="nota">
      <button data-accion="nueva-meta">+ Agregar meta</button>
      ${Go("metas")}
      ${Vo("metas")}
      &nbsp; Suma de todas: <strong>${m(t)}</strong>
      ${(()=>{let n=He(c.metas,c.repartos);return n===0?"":` &nbsp; Llevas pagado: <strong class="completa">${m(n)}</strong>
          <span class="rango">\xB7 te faltan ${m(Math.max(0,t-n))}</span>`})()}
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
  </section>`}var Qo={tranquilo:"",pronto:"aviso",hoy:"urgente",vencido:"malo"};function en(){let a=new Date,e=c.soportesMarcados[La(a)]??[],o=ue(a,e),t=Qo[o.urgencia],n=i=>{let r=e.includes(i.id);return`<li class="soporte ${r?"listo":""}">
      <label class="interruptor">
        <input type="checkbox" data-accion="soporte" data-id="${i.id}" ${r?"checked":""} />
        <span>${p(i.nombre)}${i.obligatorioExplicito?' <strong class="pendiente">OBLIGATORIO</strong>':""}</span>
      </label>
      ${i.detalle?`<p class="nota">${p(i.detalle)}</p>`:""}
    </li>`},s=de.filter(i=>i.frecuencia!=="cada_mes");return`
  <section class="panel radicacion ${t}">
    <h2><span class="etiqueta real">Real</span> Radicar la cuenta de cobro
      <span class="sufijo">\u2014 qu\xE9 d\xEDa y con qu\xE9 papeles</span></h2>
    <p class="titular ${t}">${p(o.titular)}</p>
    <p class="nota">${p(Xe(o.limite))}
      ${o.limite.usoUltimoDiaDelMes?`<br /><span class="rango">${p(Ue)}</span>`:""}
    </p>
    <ul class="soportes">${Ta().map(n).join("")}</ul>
    <p class="nota">
      Ya entregados una sola vez y no hay que repetirlos:
      ${s.filter(i=>i.frecuencia==="una_sola_vez").map(i=>p(i.nombre)).join(" \xB7 ")}.
      La constancia firmada por el paciente es solo para personal asistencial.
    </p>
  </section>`}function on(){let a=la(c.cuentas,c.ingresos),e=qe(a);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> Lo que te deben y lo que te han pagado
      <span class="sufijo">\u2014 una fila por mes cobrado</span></h2>
    ${c.cuentas.length===0?`<div class="vacio">A\xFAn no has registrado ninguna cuenta de cobro.<br />
         Sirve para llevar cu\xE1nto te deben cuando te pagan a medias.
         <p><button data-accion="nueva-cuenta">+ Registrar una cuenta de cobro</button></p></div>`:`<div class="tabla-ancha"><table>
          <thead><tr><th>Periodo</th><th class="num">Esperado</th><th class="num">Recibido</th>
            <th class="num">Falta</th><th>Estado</th><th></th></tr></thead>
          <tbody>${a.map(o=>`
            <tr>
              <td><input class="ancho" value="${p(o.cuenta.periodo)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="periodo" /></td>
              <td class="num"><input type="text" inputmode="numeric" data-dinero value="${A(o.cuenta.montoEsperado)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="montoEsperado" /></td>
              <td class="num">${m(o.recibido)}</td>
              <td class="num ${o.pendiente>0?"pendiente":"completa"}">
                ${o.pendiente>0?m(o.pendiente):"\u2014"}</td>
              <td class="rango">${p(Ae(o).split(": ").slice(1).join(": "))}</td>
              <td class="num">
                <button data-accion="abonar" data-id="${o.cuenta.id}">+ Registrar pago</button>
                <button class="icono" data-accion="borrar-cuenta" data-id="${o.cuenta.id}">\u2715</button>
              </td>
            </tr>
            ${o.ingresos.map(t=>`<tr class="componente">
              <td>${p(t.fecha)}</td><td class="num"></td><td class="num">${m(t.monto)}</td>
              <td colspan="2" class="rango">pago recibido</td>
              <td class="num"><button class="icono" data-accion="borrar-ingreso" data-id="${t.id}">\u2715</button></td>
            </tr>`).join("")}`).join("")}
          </tbody>
        </table></div>
        <p class="nota"><button data-accion="nueva-cuenta">+ Registrar otra cuenta</button>
        ${e.length?` &nbsp; <span class="pendiente">Te deben en total ${m(Pa(a))}</span>`:""}</p>`}
  </section>`}function Lo(a,e,o,t,n,s,i,r,l=""){let u=w(),d=o===null||t===null?"\u2014":`pago ${o}${t!==o?` - ${t}`:""}${n===null?"":` (${n})`}`,f=t!==null?q(t,u):null,g=t!==null?K(q(t,u)):r?"ya la ten\xEDas pagada":"sin terminar",b=i?`<span class="completa">${m(e)}</span>`:`<span class="pendiente">${m(s)} de ${m(e)}</span>`;return`<tr class="${l}">
    <td class="meta-nombre">${p(a)}</td>
    <td class="num">${b}</td>
    <td class="rango">${d}</td>
    <td class="cuando">${f?`<span class="fecha-larga-meta">${p(g)}</span><span class="fecha-corta-meta">${p(da(f))}</span>`:p(g)}</td>
  </tr>`}function tn(){if(c.metas.length===0)return null;try{return ma(zo())}catch{return null}}function nn(a){if(c.metas.length===0)return`<section class="panel simulado">
      <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
      <div class="vacio">Agrega tus metas arriba y aqu\xED aparecen las fechas.</div>
    </section>`;if(!a)return`<section class="panel simulado"><h2>Simulaci\xF3n</h2>
      <p class="nota aviso">No pude calcular la proyecci\xF3n con estos datos.</p></section>`;let e=new Map(Be(a).map(u=>[u.grupo,u])),o=[],t=new Set,n=(u,d="")=>Lo(u.nombre,u.valor,u.pagoInicio,u.pagoFin,u.cantidadPagos,u.totalAbonado,u.completada,u.yaEstabaPagada,d);for(let u of a.metas){if(!u.grupo){o.push(n(u));continue}if(t.has(u.grupo))continue;t.add(u.grupo);let d=e.get(u.grupo);o.push(Lo(d.grupo,d.valor,d.pagoInicio,d.pagoFin,null,d.totalAbonado,d.completado,d.yaEstabaPagado,"grupo"));for(let f of a.metas)f.grupo===u.grupo&&o.push(n(f,"componente"))}let s=a.pagos.length,i=c.escenario,r=w(),l=K(q(s,r));return`
  <section class="panel simulado">
    <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
    <div class="resumen">
      <div><span class="valor">${a.totalPagos}</span><span class="rotulo">pagos hasta terminarlo todo</span></div>
      <div><span class="valor cuando">${p(l)}</span><span class="rotulo">termina la \xFAltima meta</span></div>
      <div><span class="valor">${m(a.ahorroFinal)}</span><span class="rotulo">ahorro acumulado al final</span></div>
    </div>
    <div class="tabla-ancha">
      <table class="compacta">
        <thead><tr><th>Meta</th><th class="num">Abonado</th><th>Pagos</th><th>Cu\xE1ndo</th></tr></thead>
        <tbody>${o.join("")}</tbody>
      </table>
    </div>
    <p class="nota aviso">
      Esto es una simulaci\xF3n, no un hecho: supone que te entran ${m(i.ingresoEsperado)} por pago.
      ${oe(r)?`Las fechas son de <strong>una sola posibilidad</strong>: pagos puntuales cada
           ${i.diasOptimista} d\xEDas, sin contar atrasos. Sube \xABd\xEDas si se atrasan\xBB
           por encima de ${i.diasOptimista} y vuelven a salir como rango.`:`El \xABcu\xE1ndo\xBB va de puntual (cada ${i.diasOptimista} d\xEDas) a atrasado (cada ${i.diasPesimista}).`}
      ${a.incompleta?"<br /><strong>Con ese ingreso no alcanza a terminar.</strong>":""}
    </p>
    ${rn(a)}
    ${sn()}
  </section>`}function sn(){let a=Pa(la(c.cuentas,c.ingresos));if(a<=0)return"";let e=Ge(zo(),a);if(!e)return"";let o=w(),t=n=>K(q(Math.max(1,n),o));return`<p class="nota ${e.seAdelanta>0?"":"rango"}">
    Te deben <strong class="pendiente">${m(e.pendiente)}</strong>.
    ${e.seAdelanta>0?`Si te los pagaran de una vez, terminar\xEDas <strong>${e.seAdelanta}
         ${e.seAdelanta===1?"pago":"pagos"} antes</strong>: la \xFAltima meta pasar\xEDa de
         ${p(t(e.pagosAhora))} a ${p(t(e.pagosSiPagan))}.`:`Aunque te los pagaran de una vez, las fechas no se mover\xEDan \u2014 el ritmo lo marcan los
         topes por pago que pusiste arriba, no lo que entra.`}
    <br /><span class="rango">Esto es aparte: la proyecci\xF3n de arriba NO cuenta ese dinero
    hasta que lo registres como pago recibido.</span>
  </p>`}function rn(a){let e=Ve(a,c.metas);if(e.length===0)return"";let o=w(),t=s=>_(q(Math.max(1,s),o).optimista),n=s=>s.termina===null?`<li class="mal"><strong>${p(s.nombre)}</strong> la quer\xEDas para
        ${p(t(s.queria))} y <strong>no alcanza a terminar</strong> con este ingreso.</li>`:s.seRetrasa===0?`<li class="bien"><strong>${p(s.nombre)}</strong> la quer\xEDas para
        ${p(t(s.queria))} y llega ${s.termina===0?"ya pagada":`en ${p(t(s.termina))}`}.</li>`:`<li class="mal"><strong>${p(s.nombre)}</strong> la quer\xEDas para
      ${p(t(s.queria))} y va para <strong>${p(t(s.termina))}</strong>
      \u2014 ${s.seRetrasa} ${s.seRetrasa===1?"pago":"pagos"} tarde.
      S\xFAbela de posici\xF3n o dale m\xE1s por pago.</li>`;return`<div class="plazos">
    <h3 class="titulo-total">Lo que quer\xEDas para cierta fecha</h3>
    <ul>${e.map(n).join("")}</ul>
    <p class="nota rango">Esto solo avisa: el orden de pago lo pones t\xFA arriba, y el programa
      no lo cambia por su cuenta.</p>
  </div>`}function ia(a){let e=Ca(c.metas),o=c.ingresos.filter(s=>s.fecha<=a.fecha&&s.id!==a.id).sort((s,i)=>s.fecha.localeCompare(i.fecha));for(let s of o){let i=c.repartos.find(r=>r.ingresoId===s.id);for(let r of i?.abonos??[])r.refId&&e.set(r.refId,Math.max(0,(e.get(r.refId)??0)-r.monto))}let t=a.cuentaDeCobroId?!o.some(s=>s.cuentaDeCobroId===a.cuentaDeCobroId):!0,n=c.escenario;return Te(a,Aa(a,o),c.obligaciones,{nombre:"Otros / Ahorro",base:n.colchonBase,minimo:n.colchonMinimo,elastico:!1},c.metas,e,t)}function cn(){let a=ne(c.ingresos,c.repartos);if(a.length===0)return`<section class="panel">
      <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
        <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
      <div class="vacio">
        <strong>Todav\xEDa no has registrado ninguna entrada de plata.</strong>
        Registra un pago en \xABCuentas de cobro\xBB y aqu\xED aparece, mes a mes, en qu\xE9 se fue.
        <p><button data-accion="aporte-externo">+ Meter plata de otro lado</button></p>
      </div>
    </section>`;let e=a.slice().reverse().map(t=>{let n=c.ingresos.filter(s=>s.fecha.slice(0,7)===t.mes).sort((s,i)=>s.fecha.localeCompare(i.fecha));return`
    <div class="mes-real">
      <div class="mes-cabecera">
        <h3>${p(qa(t.mes))}</h3>
        <span class="valor">${m(t.entro)}</span>
        <span class="rotulo">entr\xF3${t.deFuera>0?` \xB7 ${m(t.deFuera)} los pusiste t\xFA`:""}</span>
      </div>
      ${n.map(ln).join("")}
      ${n.length>1?`<div class="total-mes">
        <span>Ese mes: ${m(t.aObligaciones)} en obligaciones \xB7 ${m(t.aMetas)} a metas
        ${t.alAhorro>0?` \xB7 ${m(t.alAhorro)} guardado`:""}</span></div>`:""}
    </div>`}).join(""),o=Oe(c.repartos);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
      <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
    ${e}
    ${o.length>1?`
      <h3 class="titulo-total">En todo lo que llevas</h3>
      <div class="tabla-ancha"><table><tbody>
        ${o.map(t=>`<tr><td class="meta-nombre">${p(t.nombre)}</td>
          <td class="num">${m(t.monto)}</td></tr>`).join("")}
      </tbody></table></div>`:""}
    <p class="nota"><button data-accion="aporte-externo">+ Meter plata de otro lado</button>
      &nbsp; <span class="rango">Para cuando pones de tu bolsillo (Nequi, efectivo) y no viene del trabajo.</span></p>
  </section>`}function ln(a){let e=c.repartos.find(r=>r.ingresoId===a.id),o=c.cuentas.find(r=>r.id===a.cuentaDeCobroId),t=p(o?o.periodo:a.nota??"de otro lado");if(!e)return`<div class="ingreso-real">
      <div class="ingreso-cabecera">
        <span class="meta-nombre">${m(a.monto)}</span>
        <span class="rango">${p(a.fecha)} \xB7 ${t}</span>
      </div>
      <p class="nota aviso">No est\xE1 dicho en qu\xE9 se fue este dinero.
        <button data-accion="proponer" data-id="${a.id}">Calcularlo por m\xED</button></p>
    </div>`;let n=ua(e,a),s=(r,l,u)=>`
    <tr>
      <td class="meta-nombre">${p(r.nombre)}
        ${r.movidoDesdeGasto?'<span class="rango">\xB7 ven\xEDa de un gasto</span>':""}</td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${A(r.monto)}" class="corto-dinero"
        data-accion="editar-reparto" data-id="${e.id}" data-tipo="${l}" data-i="${u}" /></td>
      <td class="num">${r.movidoDesdeGasto?`<button class="icono" data-accion="abono-a-gasto" data-id="${e.id}" data-i="${u}"
             title="Devolverlo a gastos">\u21A9</button>`:""}</td>
    </tr>`,i=(r,l)=>`
    <tr class="gasto-suelto">
      <td><input value="${p(r.nombre)}" placeholder="\xBFen qu\xE9 se fue?"
        data-accion="editar-gasto" data-id="${e.id}" data-i="${l}" data-campo="nombre" /></td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${A(r.monto)}" class="corto-dinero"
        data-accion="editar-gasto" data-id="${e.id}" data-i="${l}" data-campo="monto" /></td>
      <td class="num"><button class="icono" data-accion="borrar-gasto"
        data-id="${e.id}" data-i="${l}" title="Quitar">\u2715</button></td>
    </tr>`;return`<div class="ingreso-real ${e.propuesto?"propuesto":""}">
    <div class="ingreso-cabecera">
      <span class="meta-nombre">${m(a.monto)}</span>
      <span class="rango">${p(a.fecha)} \xB7 ${t}</span>
      ${e.propuesto?`<button class="primario" data-accion="confirmar-reparto" data-id="${e.id}">As\xED fue</button>`:'<span class="completa">confirmado</span>'}
    </div>
    ${e.propuesto?`<p class="nota aviso">Esto es lo que el programa <em>calcula</em> que
      hiciste. Corrige lo que no fue as\xED y dale a \xABAs\xED fue\xBB.</p>`:""}
    <div class="tabla-ancha">
      <table>
        <tbody>
          ${e.obligaciones.map((r,l)=>[r,l]).filter(([r])=>r.monto!==0).map(([r,l])=>s(r,"obligaciones",l)).join("")}
          ${e.abonos.map((r,l)=>[r,l]).filter(([r])=>r.monto!==0).map(([r,l])=>s(r,"abonos",l)).join("")}
          ${(e.gastos??[]).map(i).join("")}
          <tr class="grupo">
            <td class="meta-nombre">Qued\xF3 guardado</td>
            <td class="num"><input type="text" inputmode="numeric" data-dinero
              value="${A(e.alAhorro)}" class="corto-dinero"
              data-accion="editar-reparto" data-id="${e.id}" data-tipo="ahorro" data-i="0" /></td>
            <td class="num"></td>
          </tr>
        </tbody>
      </table>
    </div>
    ${(()=>{let r=ze(e,c.metas);return r.length===0?"":r.map(l=>`<p class="nota aviso">
        Tienes <strong>${p(l.gasto.nombre)}</strong> (${m(l.gasto.monto)}) anotado aqu\xED como
        un gasto cualquiera, pero <strong>${p(l.metaNombre)}</strong> es una de tus metas.
        <br />Si ese dinero se lo metiste a la meta, m\xE1rcalo: as\xED el programa sabe que ya llevas
        ${m(l.gasto.monto)} pagados y deja de calcular las fechas como si te faltara el precio
        entero. Si fue otra cosa que se llama parecido, d\xE9jalo como est\xE1.
        <br /><button data-accion="gasto-a-abono" data-id="${e.id}"
          data-meta="${l.metaId}" data-nombre="${p(l.gasto.nombre)}">S\xED, fue abono a ${p(l.metaNombre)}</button>
      </p>`).join("")})()}
    ${(()=>{let r=Fe(e,ia(a));if(r.length===0)return"";let l=w(),u=g=>_(q(Math.max(1,g),l).optimista),d=Aa(a,c.ingresos.filter(g=>g.fecha<=a.fecha&&g.id!==a.id)),f=r.map(g=>{let b=Ne(g,re(c.metas,c.repartos),c.obligaciones,d),x=b.tipo==="ya-no-esta"?"ya no est\xE1 en tu lista":b.tipo==="ya-comprada"?"la marcaste como ya comprada":b.tipo==="ya-pagada"?"ya est\xE1 pagada":b.tipo==="empieza-despues"?`ahora empieza en el pago ${b.pago} (${u(b.pago)})`:b.tipo==="solo-el-primer-pago"?"es solo del primer pago":b.tipo==="puntual"?"es puntual, no de todos los pagos":b.tipo==="en-cero"?"est\xE1 en $0":"no sabr\xEDa decirte por qu\xE9";return`<li><strong>${p(g)}</strong> \u2014 ${p(x)}</li>`}).join("");return`<div class="nota aviso">
        Con la configuraci\xF3n de hoy, ${r.length===1?"esto ya no entrar\xEDa":"estas cosas ya no entrar\xEDan"}
        en este mes:
        <ul class="motivos">${f}</ul>
        Si el mes fue as\xED de verdad, d\xE9jalo como est\xE1; si no, dale a \xABVolver a calcular\xBB.
      </div>`})()}
    <p class="nota">
      <button data-accion="nuevo-gasto" data-id="${e.id}">+ Se fue en algo m\xE1s</button>
      <button data-accion="recalcular" data-id="${e.id}">Volver a calcular</button>
      <span class="rango">Lo primero es para lo que sali\xF3 de lo guardado \u2014prestado, comida,
      un tr\xE1mite\u2014. Lo segundo rehace el c\xE1lculo con las obligaciones de ahora
      <strong>y borra lo que hayas corregido a mano</strong>.</span>
    </p>
    ${n!==0?`<p class="nota ${n>0?"aviso":"malo"}">
      ${n>0?`Faltan <strong>${m(n)}</strong> por decir a d\xF3nde fueron.`:`Repartiste <strong>${m(-n)}</strong> m\xE1s de lo que entr\xF3.`}
      <button data-accion="cuadrar" data-id="${e.id}">Mandarlos a lo guardado</button>
    </p>`:""}
  </div>`}function Yo(a){let e=w(),o=a?je(a.pagos,e.desde,e.diasOptimista,c.metas):[],t=ne(c.ingresos,c.repartos),n=[...new Set([...o.map(i=>i.mes),...t.map(i=>i.mes)])],s=ke(c.cuentas,c.ingresos,c.escenario.ingresoEsperado,n);return _e(o,t,sa().slice(0,7),s)}function dn(a){let e=Yo(a);if(e.length===0)return`<section class="panel">
      <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
      <div class="vacio">Agrega tus metas y registra un pago: aqu\xED se ve el calendario entero.</div>
    </section>`;pn(e);let o=se(e);return`
  <section class="panel">
    <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
    <div class="resumen">
      <div><span class="valor real">${m(o.entroDeVerdad)}</span>
        <span class="rotulo">ha entrado de verdad \xB7 ${o.mesesConDatos} ${o.mesesConDatos===1?"mes":"meses"}</span></div>
      <div><span class="valor">${m(o.guardadoDeVerdad)}</span>
        <span class="rotulo">llevas guardado</span></div>
      ${o.mesesQueFaltan>0?`<div><span class="valor cuando">${m(o.faltaPorEntrar)}</span>
            <span class="rotulo">faltar\xEDan por entrar \xB7 ${o.mesesQueFaltan} ${o.mesesQueFaltan===1?"mes":"meses"}</span></div>`:`<div><span class="valor">${m(o.gastadoDeVerdad)}</span>
            <span class="rotulo">llevas gastado</span></div>`}
    </div>
    <p class="nota">
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="1">Desplegar todos</button>
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="0">Plegar todos</button>
      <span class="rango">&nbsp; ${e.length} ${e.length===1?"mes":"meses"} \xB7
        pulsa uno para ver en qu\xE9 se va</span>
    </p>
    <div class="linea-tiempo">${e.map(mn).join("")}</div>
    <p class="nota">
      <span class="etiqueta real">Real</span> lo que pas\xF3 \xB7
      <span class="etiqueta simulacion">Simulaci\xF3n</span> lo que pasar\xEDa si entra lo que supone
      el escenario. Nunca se mezclan en una sola cifra.
    </p>
  </section>`}function un(a){let e=(n,s)=>n.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")===s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),o=c.obligaciones.find(n=>e(n.nombre,a));if(o)return`<span class="que-es obligacion">fijo${o.grupo?` \xB7 ${p(o.grupo)}`:""}</span>`;let t=c.metas.find(n=>e(n.nombre,a));return t?`<span class="que-es meta">meta${t.grupo?` \xB7 ${p(t.grupo)}`:""}</span>`:a==="Qued\xF3 guardado"||a==="Se guardar\xEDa"?"":'<span class="que-es suelto">de una vez</span>'}var ra=new Set,Oo=!1;function pn(a){if(Oo)return;Oo=!0;let e=a.findIndex(t=>t.estado==="actual"),o=e>=0?e:0;for(let t of a.slice(o,o+2))ra.add(t.mes)}function mn(a){let e=a.real!==null,o=a.real??a.simulado;if(!o)return"";let t=e?o.entro:a.esperado?.monto??o.entro,n=!e&&a.simulado!==null&&a.esperado!==null&&a.esperado.monto!==a.simulado.entro,s=a.real?a.real.detalle:G(a.simulado?.detalle),i=a.estado==="actual"?'<span class="chip ahora">este mes</span>':a.estado==="futuro"?'<span class="chip futuro">viene</span>':"",r=[o.aObligaciones>0?`${m(o.aObligaciones)} fijos`:"",o.aMetas>0?`${m(o.aMetas)} a metas`:"",e&&a.real.enGastos>0?`${m(a.real.enGastos)} sueltos`:"",o.alAhorro>0?`${m(o.alAhorro)} guardado`:""].filter(Boolean).join(" \xB7 ");return`
  <details class="mes-vista ${a.estado} ${e?"es-real":"es-simulado"}"
           data-mes="${a.mes}" ${ra.has(a.mes)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${p(qa(a.mes))}</h3>
      ${i}
      <span class="etiqueta ${e?"real":"simulacion"}">${e?"Real":"Simulaci\xF3n"}</span>
      <span class="valor">${m(t)}</span>
      ${r?`<span class="resumen-plegado">${r}</span>`:""}
    </summary>
    ${a.esperado?.segun==="cuenta_de_cobro"&&!e?`<p class="nota rango">
      Seg\xFAn tu cuenta de cobro de este mes, no seg\xFAn el escenario.</p>`:""}
    ${n?`<p class="nota aviso">
      El desglose de abajo est\xE1 calculado con el escenario (${m(a.simulado.entro)}).
      Si de verdad esperas ${m(a.esperado.monto)} este mes, cambia \xABLo que espero por pago\xBB
      para que las cifras cuadren.</p>`:""}
    ${a.diferencia!==null&&a.diferencia!==0?`<p class="nota ${a.diferencia<0?"aviso":""}">
      ${a.diferencia<0?`Entraron ${m(-a.diferencia)} menos de lo esperado para ese mes (${m(a.esperado.monto)}${a.esperado.segun==="cuenta_de_cobro"?", seg\xFAn tu cuenta de cobro":""}).`:`Entraron ${m(a.diferencia)} m\xE1s de lo esperado para ese mes.`}</p>`:""}
    ${a.estado==="actual"&&a.real&&a.esperado?`<p class="nota">
      ${a.esperado.segun==="cuenta_de_cobro"?`Tu cuenta de cobro de este mes es de <strong>${m(a.esperado.monto)}</strong>`:`El escenario supone <strong>${m(a.esperado.monto)}</strong> este mes`}.
      ${a.real.entro<a.esperado.monto?`Llevas ${m(a.real.entro)}: faltar\xEDan ${m(a.esperado.monto-a.real.entro)} por entrar.`:"Ya entr\xF3 todo."}</p>`:""}
    ${s.length===0?'<p class="nota rango">Sin movimientos.</p>':`
      <div class="tabla-ancha"><table><tbody>
        ${s.map(l=>`<tr>
          <td class="meta-nombre">${p(l.nombre)} ${un(l.nombre)}</td>
          <td class="num">${m(l.monto)}</td></tr>`).join("")}
        ${o.alAhorro>0?`<tr class="grupo">
          <td class="meta-nombre">${e?"Qued\xF3 guardado":"Se guardar\xEDa"}</td>
          <td class="num">${m(o.alAhorro)}</td></tr>`:""}
      </tbody></table></div>`}
    ${a.real&&a.real.sinAsignar>0?`<p class="nota aviso">
      Hay ${m(a.real.sinAsignar)} sin decir en qu\xE9 se fueron.</p>`:""}
  </details>`}var j=[],V=go(),L=!1,O=null,gn={escenario:"Escenario",obligaciones:"Obligaciones",metas:"Metas",cuentas:"Cuentas de cobro",ingresos:"Registrar \xB7 pagos recibidos",repartos:"Registrar \xB7 en qu\xE9 se fue la plata",soportes:"Soportes de radicaci\xF3n"};function bn(a){let e=a.datos,o=t=>typeof t=="number"?m(t):"";switch(a.tabla){case"metas":return`\xAB${String(e.nombre??"sin nombre")}\xBB`;case"obligaciones":return`\xAB${String(e.nombre??"sin nombre")}\xBB`;case"cuentas":return`la cuenta de ${String(e.periodo??"?")}`;case"ingresos":return`el pago del ${String(e.fecha??"?")} (${o(e.monto)})`;case"repartos":return Qa({tabla:"repartos",id:a.id},c);case"escenario":return"el escenario";case"soportes":return`los soportes de ${a.id}`}}function jo(a,e){if((a.campo==="ordenMetas"||a.campo==="ordenObligaciones")&&Array.isArray(e)&&O){let o=a.campo==="ordenMetas"?"metas":"obligaciones",t=new Map;for(let n of[...O.remotas[o],...O.locales[o]])t.set(n.datos.id,String(n.datos.nombre??n.datos.id));return e.map((n,s)=>`${s+1}. ${t.get(String(n))??"?"}`).join(" \xB7 ")}return fa(a.campo??"",e)}function fn(a){let e=O.elecciones[a.clave],o=(r,l)=>`
    <label class="opcion ${e===r?"elegida":""}">
      <input type="radio" name="${p(a.clave)}" value="${r}" ${e===r?"checked":""}
        data-accion="nube-elegir" data-clave="${p(a.clave)}" data-lado="${r}" />
      <span>${l}</span>
    </label>`,t=bn(a);if(a.tipo==="campo")return`<div class="diferencia">
      <div class="que"><strong>${p(t)}</strong> \u2014 ${p(Ya(a.campo??""))}
        ${a.confirmadoEn?'<span class="rango">(el que confirmaste viene marcado)</span>':""}</div>
      ${o("aqui",`<b>En este aparato:</b> ${p(jo(a,a.aqui))}`)}
      ${o("nube",`<b>En el otro aparato (la nube):</b> ${p(jo(a,a.nube))}`)}
    </div>`;let[n,s,i]=a.tipo==="solo-aqui"?[`${t} est\xE1 solo en este aparato`,"Conservarla","Quitarla de los dos"]:a.tipo==="solo-nube"?[`${t} est\xE1 solo en el otro aparato`,"No traerla (quitarla de los dos)","Traerla"]:[`${t} la borraste en el otro aparato`,"Conservarla","Borrarla tambi\xE9n aqu\xED"];return`<div class="diferencia fila-entera">
    <div class="que"><strong>${p(n)}</strong></div>
    ${o("aqui",p(s))}
    ${o("nube",p(i))}
  </div>`}function hn(){let a=O,e=[...new Set(a.difs.map(o=>o.tabla))];return`<div class="revision">
    <p><strong>${a.modo==="subir"?"Vas a SUBIR la versi\xF3n de este aparato.":"Vas a TRAER la \xFAltima versi\xF3n de la nube."}</strong>
      Hay ${a.difs.length} ${a.difs.length===1?"diferencia":"diferencias"} con el otro aparato.
      Viene marcado ${a.modo==="subir"?"lo de este aparato":"lo de la nube"}; cambia lo que quieras.
      <b>Todav\xEDa no se ha escrito nada</b>, ni aqu\xED ni en la nube.</p>
    ${e.map(o=>`<h3>${p(gn[o])}</h3>
      ${a.difs.filter(t=>t.tabla===o).map(fn).join("")}`).join("")}
    <p class="botones-revision">
      <button class="primario" data-accion="nube-aplicar" ${L?"disabled":""}>
        ${L?"Aplicando\u2026":"Aplicar lo elegido"}</button>
      <button data-accion="nube-cancelar">Cancelar, no cambiar nada</button>
    </p>
  </div>`}function vn(){let a=ka(),e=Ha();if(!a)return`
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
    </section>`;let o=j.length===0?"":`
    <div class="aviso-descartes">
      <strong>${j.length} ${j.length===1?"dato distinto":"datos distintos"} entre los dos aparatos.</strong>
      Se qued\xF3 el m\xE1s reciente. Aqu\xED est\xE1n los dos, para que compares:
      <table><thead><tr>
        <th>Qu\xE9</th><th>Lo que hab\xEDa en el otro aparato</th><th>Lo que qued\xF3</th><th></th>
      </tr></thead><tbody>
        ${j.map((t,n)=>`<tr>
          <td><strong>${p(Ya(t.campo))}</strong>
            <span class="rango">de ${p(Qa(t,c))}</span></td>
          <td class="descartado">${p(fa(t.campo,t.valor))}</td>
          <td class="completa">${p(fa(t.campo,t.gano))}</td>
          <td><button class="chico-linea" data-accion="nube-revertir" data-i="${n}">Quedarme con este</button></td>
        </tr>`).join("")}
      </tbody></table>
    </div>`;return`
    <section class="panel">
      <h2>Sincronizar con el tel\xE9fono
        <span class="sufijo">\u2014 ${p(a.correo)}</span></h2>
      <p class="nota">
        ${e?`\xDAltima vez: ${new Date(e).toLocaleString("es-CO")}.`:"Todav\xEDa no has sincronizado desde este aparato."}
      </p>
      ${O?hn():`
      <p class="nota">Nada se escribe sin que veas antes qu\xE9 cambia y elijas.</p>
      <p class="botones-nube">
        <button class="primario" data-accion="nube-preparar" data-modo="subir" ${L?"disabled":""}>
          \u2B06 Subir mi versi\xF3n</button>
        <button class="primario" data-accion="nube-preparar" data-modo="traer" ${L?"disabled":""}>
          \u2B07 Traer la \xFAltima versi\xF3n</button>
        <button class="chico-linea" data-accion="nube-salir">Salir de la cuenta</button>
      </p>
      <p class="rango">\xABSubir\xBB deja la nube como este aparato; \xABTraer\xBB deja este aparato como la nube.
        ${L?"<b>Comparando con la nube\u2026</b>":""}</p>`}
      ${o}
    </section>`}function $n(a){let e=new Date,o=e.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),t=Pa(la(c.cuentas,c.ingresos)),n=Za(),s=n.monto>0?Ee(2,n.monto):0,i=Yo(a),r=i.length>0?se(i).guardadoDeVerdad:0,l=w(),u=Io(c.metas,a?.metas??[]),d=u?.pagoFin!=null?K(q(u.pagoFin,l)):null,f=c.soportesMarcados[La(e)]??[],g=ue(e,f),b=Ta(),x=b.filter(S=>f.includes(S.id)).length,$=g.diasQueFaltan,E=(S,Ea,ya,xa,X,W)=>`
    <div class="cifra tono-${S}">
      <div class="cifra-cab"><span class="cifra-chip">${Ea}</span>${ya}</div>
      <div class="cifra-nombre">${xa}</div>
      <div class="cifra-valor">${X}</div>
      <div class="cifra-detalle">${W}</div>
    </div>`,M='<span class="etiqueta real">Real</span>',R='<span class="etiqueta simulacion">Simulaci\xF3n</span>',C=pa(c.metas,c.repartos),F=new Map((a?.metas??[]).map(S=>[S.metaId,S])),$a=S=>De(S,C.get(S.id)?.total??0)>=1,I=c.metas.filter(S=>!$a(S)),Ma=c.metas.length-I.length,Re=(I.length>0?I:c.metas).slice(0,5),Da=(I.length>0?I.length:c.metas.length)-Re.length,ot=Re.map(S=>{let Ea=F.get(S.id),ya=C.get(S.id)?.total??0,xa=De(S,ya),X=xa>=1,W=!S.compra&&!X&&Ea?.pagoFin!=null?q(Ea.pagoFin,l):null,Ce=S.compra?"ya la compraste":X?"\u2713 lista":W?K(W):"sin fecha todav\xEDa",tt=W?`<span class="fecha-larga-meta">${p(Ce)}</span><span class="fecha-corta-meta">${p(da(W))}</span>`:p(Ce);return`<li class="inicio-meta ${S.clase==="deuda"?"es-deuda":""} ${X?"lista":""}">
      <div class="inicio-meta-texto">
        <div class="inicio-meta-nombre">${p(S.nombre.trim()||"(sin nombre)")}
          ${S.clase==="deuda"?'<span class="marca-deuda">Ya la debo</span>':""}</div>
        <div class="rango">${m(ya)} de ${m(S.valor)}</div>
        <div class="barra-progreso"><i style="width:${Math.round(xa*100)}%"></i></div>
      </div>
      <div class="inicio-meta-der"><strong>${m(S.valor)}</strong>
        <span class="${X?"completa":"cuando"}">${tt}</span></div>
    </li>`}).join("");return`
  <section class="inicio">
    <div class="saludo">
      <h1>\xA1Hola!</h1>
      <p>As\xED va tu plata \xB7 <span class="fecha-larga">${p(o)}</span></p>
    </div>

    <div class="aviso-radicar ${Qo[g.urgencia]}">
      <div class="aviso-radicar-texto">
        ${M} <strong>${p(g.titular)}</strong>
        <div class="rango">${x} de ${b.length} soportes listos \xB7 la lista est\xE1 abajo</div>
        <div class="barra-progreso real"><i style="width:${b.length?Math.round(x/b.length*100):0}%"></i></div>
      </div>
      <div class="aviso-radicar-dias"><strong>${Math.abs($)}</strong>
        <span>${$<0?Math.abs($)===1?"d\xEDa tarde":"d\xEDas tarde":$===1?"d\xEDa":"d\xEDas"}</span></div>
    </div>

    <div class="cifras">
      ${E("real","\u{1F4B5}",M,"Te deben",t>0?m(t):"$0",t>0?"de cuentas de cobro sin pagar completas":"no tienes cuentas pendientes")}
      ${E("turquesa","\u{1F45B}","","Libre para metas, por pago",n.monto>0?m(n.monto-s):"\u2014",n.monto>0?`de ${m(n.monto)} \xB7 se van ${m(s)}`:"pon cu\xE1nto esperas por pago en Ajustes")}
      ${E("simulado","\u{1F3C1}",R,u?`Pr\xF3xima meta \xB7 ${p(u.meta.nombre.trim()||"(sin nombre)")}`:"Pr\xF3xima meta",u?d?p(d.replace(/^entre /,"").split(" y ")[0]):"Sin fecha":"\u2014",u?d?d.startsWith("entre ")?p(d):"seg\xFAn la proyecci\xF3n":"la proyecci\xF3n no alcanza a terminarla":"no hay metas pendientes")}
      ${E("morado","\u{1F437}","","Llevas guardado",m(r),"lo que ha quedado de verdad en el ahorro")}
    </div>

    <div class="inicio-doble">
    <div class="panel inicio-metas">
      <h2>Mis metas ${R}
        <button class="enlace" data-accion="seccion" data-seccion="metas">Ver todas \u2192</button></h2>
      ${c.metas.length===0?`<div class="vacio">Todav\xEDa no has puesto ninguna meta.
            <p><button class="primario" data-accion="seccion" data-seccion="metas">Ir a Metas</button></p></div>`:`<ul class="inicio-lista">${ot}</ul>
           ${Da>0||I.length>0&&Ma>0?`<p class="nota">${[Da>0?`${Da} ${Da===1?"pendiente m\xE1s":"pendientes m\xE1s"}`:"",I.length>0&&Ma>0?`${Ma} ya ${Ma===1?"lista":"listas"}`:""].filter(Boolean).join(" \xB7 ")} \u2014 todas en Metas.</p>`:""}`}
    </div>
    ${Mn(a)}
    </div>
  </section>`}function Mn(a){let e=a?qo(a.pagos):null;if(!e)return"";let o=52,t=2*Math.PI*o,n=[{nombre:"Obligaciones",valor:e.obligaciones,clase:"oblig"},{nombre:"Metas",valor:e.metas,clase:"metas"},{nombre:"Ahorro",valor:e.ahorro,clase:"ahorro"}],s=Ao(n.map(r=>r.valor),o),i=da(q(e.numero,w()));return`
  <div class="panel inicio-dona">
    <h2>En qu\xE9 se va un pago <span class="etiqueta simulacion">Simulaci\xF3n</span></h2>
    <p class="rango">El pago ${e.numero} de la proyecci\xF3n \xB7 ${p(i)}</p>
    <div class="dona">
      <svg viewBox="0 0 140 140" role="img" aria-label="Reparto de ${m(e.ingreso)}">
        <circle cx="70" cy="70" r="${o}" class="dona-fondo" />
        <g transform="rotate(-90 70 70)">
          ${n.map((r,l)=>s[l].largo>0?`<circle cx="70" cy="70" r="${o}" class="dona-${r.clase}"
                 stroke-dasharray="${s[l].largo.toFixed(2)} ${t.toFixed(2)}"
                 stroke-dashoffset="${(-s[l].desde).toFixed(2)}" />`:"").join("")}
        </g>
        <text x="70" y="68" class="dona-total">${m(e.ingreso)}</text>
        <text x="70" y="86" class="dona-rotulo">por pago</text>
      </svg>
      <ul>
        ${n.map(r=>`<li><i class="dona-${r.clase}"></i><span>${r.nombre}</span>
          <strong>${m(r.valor)}</strong></li>`).join("")}
      </ul>
    </div>
    <p><button class="primario" data-accion="seccion" data-seccion="registrar">+ Registrar un pago</button></p>
  </div>`}function ae(){let a=tn();return[["inicio",$n(a)],["radicacion",en()],["vista",dn(a)],["escenario",Vt()],["metas",an(a)],["proyeccion",nn(a)],["obligaciones",Xt()],["cuentas",on()],["real",cn()],["nube",vn()]]}function Uo(a){if(typeof a.querySelectorAll=="function")for(let e of Array.from(a.querySelectorAll("table"))){let o=Array.from(e.querySelectorAll("thead th")).map(t=>(t.textContent??"").trim());if(no(o)){e.classList.add("como-tarjetas");for(let t of Array.from(e.querySelectorAll("tbody tr"))){let n=Array.from(t.children),s=n.map(r=>Number(r.getAttribute("colspan")??1)||1),i=to(o,s);n.forEach((r,l)=>{let u=i[l];u?r.dataset.etiqueta=u:delete r.dataset.etiqueta})}}}}function xe(a,e){a.innerHTML=e,Uo(a)}function Jo(){return document.activeElement?.closest?.("[data-panel]")?.dataset.panel??null}function Se(a=Jo()){let e=new Set([a,ye].filter(Boolean));for(let[o,t]of ae()){if(e.has(o))continue;let n=document.getElementById(`panel-${o}`);n&&xe(n,t)}Xo()}function Xo(){let a=document.getElementById("mensaje");a&&(a.innerHTML=D?`<div class="mensaje ${D.malo?"malo":"bueno"}">${p(D.texto)}</div>`:"",D=null)}var Wo="gestiondinerotrabajo.seccion";function Dn(){try{return Ua(localStorage.getItem(Wo))}catch{return Ua(null)}}function En(a){try{localStorage.setItem(Wo,a)}catch{}}function yn(a){return`<nav class="barra-secciones">
    ${ha.map(e=>`<button data-accion="seccion" data-seccion="${e.id}"
      class="${e.id===a?"activa":""}" aria-current="${e.id===a?"page":"false"}">
      <span class="icono-seccion">${e.icono}</span>${p(e.rotulo)}</button>`).join("")}
  </nav>`}function xn(a){let e=ka(),o=Ha(),t=o?new Date(o).toLocaleString("es-CO",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):null;return`<aside class="lateral">
    <div class="marca"><span class="logo">$</span>
      <div><strong>Mi dinero</strong><span>Metas con ingreso variable</span></div></div>
    <nav class="nav-lateral">
      ${ha.map(n=>`<button data-accion="seccion" data-seccion="${n.id}"
        class="${n.id===a?"activa":""}" aria-current="${n.id===a?"page":"false"}">
        <span class="icono-seccion">${n.icono}</span><span class="rotulo-seccion">${p(n.rotulo)}</span></button>`).join("")}
    </nav>
    <div class="lateral-pie">
      <div class="estado-nube ${e?"conectada":""}"><span class="punto"></span>
        <div><strong>${e?"Sincronizado":"Solo en este aparato"}</strong>
          <span>${e?t?`\xFAltima vez ${p(t)}`:"todav\xEDa sin sincronizar":"la nube est\xE1 en Ajustes"}</span></div></div>
      <button class="chico-linea" data-accion="exportar">Exportar respaldo</button>
      <button class="chico-linea" data-accion="importar">Importar respaldo</button>
    </div>
  </aside>`}function P(){let a=document.getElementById("app"),e=Fo(document.activeElement),o=document.activeElement,t=o&&typeof o.selectionStart=="number"?o.selectionStart:null,n=window.scrollY,s=Dn();a.className=`seccion-${s}`,a.innerHTML=`
    ${xn(s)}
    <header class="cabecera">
      <h1>Gesti\xF3n del dinero del trabajo</h1>
      <div class="acciones">
        <button data-accion="exportar">Exportar respaldo</button>
        <button data-accion="importar">Importar respaldo</button>
      </div>
    </header>
    <div id="mensaje"></div>
    ${ae().map(([i,r])=>`<div id="panel-${i}" data-panel="${i}"
         data-seccion="${So(i)??""}">${r}</div>`).join("")}
    <input type="file" id="archivo" accept="application/json" hidden />
    ${yn(s)}`,Uo(a),Xo(),window.scrollTo({top:n,behavior:"instant"}),Ht(e,t)}function Ko(a){let e=Math.round(Number(a));if(!(!Number.isFinite(e)||e<=1))return e}h.set("escenario",a=>{let e=a.dataset.campo,o=a,t=o.value;if(c.escenario[e]=o.type==="date"?t:o.hasAttribute("data-dinero")?T(t):Number(t),e==="diasOptimista"||e==="diasPesimista"){let n=Math.round(Number(t));c.escenario[e]=Number.isFinite(n)&&n>0?n:1}z()});h.set("elastico",a=>{c.escenario.colchonElastico=a.checked,z()});h.set("oblig",a=>{let e=c.obligaciones.find(n=>n.id===a.dataset.id);if(!e)return;let o=a.dataset.campo,t=a.value;if(o==="valor")e.valor=e.tipo==="porcentaje"?Number(t)/100:T(t);else if(o==="tipo"){let n=t;n!==e.tipo&&(e.valor=n==="porcentaje"?.1:1e5),e.tipo=n}else o==="modo"?(e.modo=t,e.modo==="puntual"&&!e.supuesto&&(e.supuesto="siempre")):o==="grupo"?e.grupo=t.trim()||void 0:o==="desdePago"?e.desdePago=Ko(t):o==="supuesto"?e.supuesto=t:e.nombre=t;z()});h.set("nuevo-cambio",a=>{let e=c.obligaciones.find(t=>t.id===a.dataset.id);if(!e)return;let o=Math.max(1,...(e.cambios??[]).map(t=>t.desdePago));e.cambios=[...e.cambios??[],{desdePago:o+1,valor:e.valor}],y()});h.set("cambio",a=>{let e=c.obligaciones.find(n=>n.id===a.dataset.id),o=e?.cambios?.[Number(a.dataset.i)];if(!e||!o)return;let t=a.value;if(a.dataset.campo==="desdePago"){let n=Math.round(Number(t));o.desdePago=Number.isFinite(n)&&n>0?n:1}else o.valor=e.tipo==="porcentaje"?Number(t)/100:T(t);z()});h.set("borrar-cambio",a=>{let e=c.obligaciones.find(t=>t.id===a.dataset.id);if(!e?.cambios)return;let o=Number(a.dataset.i);e.cambios=e.cambios.filter((t,n)=>n!==o),y()});function Pe(a){return a==="ingreso"?"cambiosIngreso":"cambiosColchon"}h.set("nuevo-cambio-escenario",a=>{let e=Pe(a.dataset.cual),o=c.escenario[e]??[],t=Math.max(1,...o.map(s=>s.desdePago)),n=e==="cambiosIngreso"?c.escenario.ingresoEsperado:c.escenario.colchonBase;c.escenario[e]=[...o,{desdePago:t+1,valor:n}],y()});h.set("cambio-escenario",a=>{let e=c.escenario[Pe(a.dataset.cual)]?.[Number(a.dataset.i)];if(!e)return;let o=a.value;if(a.dataset.campo==="desdePago"){let t=Math.round(Number(o));e.desdePago=Number.isFinite(t)&&t>0?t:1}else e.valor=T(o);z()});h.set("borrar-cambio-escenario",a=>{let e=Number(a.dataset.i),o=Pe(a.dataset.cual);c.escenario[o]=(c.escenario[o]??[]).filter((t,n)=>n!==e),y()});h.set("nueva-oblig",()=>{let a=Y("ob");Ka=a,c.obligaciones.push({id:a,nombre:"Nueva obligaci\xF3n",tipo:"fijo",valor:1e5,modo:"cada_pago"}),y()});h.set("borrar-oblig",a=>{c.obligaciones=c.obligaciones.filter(e=>e.id!==a.dataset.id),y()});h.set("meta",a=>{let e=c.metas.find(n=>n.id===a.dataset.id);if(!e)return;let o=a.dataset.campo,t=a.value;if(o==="valor")e.valor=T(t);else if(o==="abonado")e.abonado=T(t);else if(o==="desdePago")e.desdePago=Ko(t);else if(o==="maximoPorPago"){let n=T(t);e.maximoPorPago=n>0?n:void 0}else if(o==="enCuotas"){let n=Math.round(Number(t));e.enCuotas=Number.isFinite(n)&&n>0?n:void 0}else if(o==="antesDelPago"){let n=Math.round(Number(t));e.antesDelPago=Number.isFinite(n)&&n>0?n:void 0}else if(o==="grupo")e.grupo=t.trim()||void 0;else if(o==="clase"){e.clase=t==="deuda"?"deuda":void 0,y();return}else e.nombre=t;z()});function Sn(a){let e=a.classList.toggle("abierta"),o=a.dataset.idFila;if(o)for(let t of document.querySelectorAll(`[data-hija-de="${CSS.escape(o)}"]`))t.classList.toggle("abierta",e)}function Zo(a,e){let o=document.getElementById(`panel-${a==="metas"?"metas":"obligaciones"}`);if(o){for(let t of o.querySelectorAll("tr[data-resumen]"))t.classList.toggle("abierta",e);for(let t of o.querySelectorAll("[data-hija-de]"))t.classList.toggle("abierta",e)}}h.set("desplegar-todo",a=>Zo(a.dataset.lista,!0));h.set("plegar-todo",a=>Zo(a.dataset.lista,!1));h.set("seccion",a=>{let e=Ua(a.dataset.seccion);En(e);let o=document.getElementById("app");o&&(o.className=`seccion-${e}`);for(let t of document.querySelectorAll(".barra-secciones button, .nav-lateral button")){let n=t.dataset.seccion===e;t.classList.toggle("activa",n),t.setAttribute("aria-current",n?"page":"false")}window.scrollTo({top:0,behavior:"instant"})});h.set("nueva-meta",()=>{let a=Y("meta");Ka=a,c.metas.push({id:a,nombre:"",valor:0}),y(),document.querySelector(`input[data-id="${a}"][data-campo="nombre"]`)?.focus()});h.set("plegar-meses",a=>{let e=a.dataset.abrir==="1";if(ra.clear(),e)for(let t of document.querySelectorAll("[data-mes]"))ra.add(t.dataset.mes);let o=document.getElementById("panel-vista");o&&xe(o,ae().find(([t])=>t==="vista")[1])});h.set("ordenar",a=>{let e=a.dataset.por,o=(n,s)=>n.localeCompare(s,"es",{sensitivity:"base",numeric:!0}),t=(n,s)=>e==="valor"?s.valor-n.valor:e==="grupo"&&o(n.grupo??"\uFFFF",s.grupo??"\uFFFF")||o(n.nombre,s.nombre);a.dataset.lista==="metas"?(c.metas=[...c.metas].sort(t),D={texto:`Metas ordenadas por ${e}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron. Si no era lo que quer\xEDas, reord\xE9nalas con las flechas.`,malo:!1}):c.obligaciones=[...c.obligaciones].sort(t),y()});h.set("duplicar-meta",a=>{let e=c.metas.findIndex(n=>n.id===a.dataset.id);if(e<0)return;let o=c.metas[e],t={...o,id:Y("meta"),nombre:`${o.nombre} (copia)`,abonado:0};delete t.compra,c.metas.splice(e+1,0,t),y()});h.set("borrar-meta",a=>{c.metas=c.metas.filter(e=>e.id!==a.dataset.id),y()});function at(a,e){let o=a+e;if(o<0||o>=c.metas.length)return;let t=c.metas.slice();[t[a],t[o]]=[t[o],t[a]],c.metas=t,y()}h.set("subir",a=>at(Number(a.dataset.i),-1));h.set("bajar",a=>at(Number(a.dataset.i),1));h.set("nueva-cuenta",()=>{let a=new Date,e=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];c.cuentas.push({id:Y("cta"),periodo:`${e[a.getMonth()]} de ${a.getFullYear()}`,montoEsperado:c.escenario.ingresoEsperado}),y()});h.set("cuenta",a=>{let e=c.cuentas.find(t=>t.id===a.dataset.id);if(!e)return;let o=a.value;a.dataset.campo==="montoEsperado"?e.montoEsperado=T(o):e.periodo=o,z()});h.set("borrar-cuenta",a=>{c.cuentas=c.cuentas.filter(o=>o.id!==a.dataset.id);let e=new Set(c.ingresos.filter(o=>o.cuentaDeCobroId===a.dataset.id).map(o=>o.id));c.ingresos=c.ingresos.filter(o=>o.cuentaDeCobroId!==a.dataset.id),c.repartos=c.repartos.filter(o=>!e.has(o.ingresoId)),y()});h.set("abonar",async a=>{let e=c.cuentas.find(r=>r.id===a.dataset.id);if(!e)return;let o=la([e],c.ingresos)[0],t=o.pendiente>0?o.pendiente:e.montoEsperado,n=await oa({titulo:`\xBFCu\xE1nto te pagaron de ${e.periodo}?`,detalle:o.pendiente>0&&o.recibido>0?`Ya te hab\xEDan pagado ${m(o.recibido)}. Faltan ${m(o.pendiente)}.`:void 0,valorInicial:A(t),dinero:!0,textoAceptar:"Registrar pago"});if(n===null)return;let s=T(n);if(!Number.isFinite(s)||s<=0)return D={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},P();let i={id:Y("ing"),cuentaDeCobroId:e.id,fecha:sa(),monto:s};c.ingresos.push(i),c.repartos.push(ia(i)),D={texto:"Registrado. Mira abajo en qu\xE9 se va ese dinero y corr\xEDgelo si no fue as\xED.",malo:!1},y()});h.set("comprada",async a=>{let e=c.metas.find(s=>s.id===a.dataset.id);if(!e)return;let o=await oa({titulo:`\xBFPor cu\xE1nto compraste ${e.nombre}?`,detalle:`La ten\xEDas en ${m(e.valor)}. Pon lo que pagaste de verdad, aunque sea distinto.`,valorInicial:A(e.valor),dinero:!0,textoAceptar:"Siguiente"});if(o===null)return;let t=await oa({titulo:"\xBFEn qu\xE9 mes la compraste?",detalle:"Escr\xEDbelo como AAAA-MM. Por ejemplo, 2026-08 para agosto de este a\xF1o.",valorInicial:sa().slice(0,7),textoAceptar:"Guardar"});if(t===null)return;let n=/^\d{4}-\d{2}$/.test(t.trim())?t.trim():sa().slice(0,7);e.compra={mes:n,precioReal:T(o)},y()});h.set("no-comprada",a=>{let e=c.metas.find(o=>o.id===a.dataset.id);e&&(delete e.compra,y())});h.set("proponer",a=>{let e=c.ingresos.find(o=>o.id===a.dataset.id);e&&(c.repartos=c.repartos.filter(o=>o.ingresoId!==e.id),c.repartos.push(ia(e)),y())});h.set("confirmar-reparto",a=>{let e=c.repartos.find(o=>o.id===a.dataset.id);e&&(e.propuesto=!1,y())});h.set("editar-reparto",a=>{let e=c.repartos.find(s=>s.id===a.dataset.id);if(!e)return;let o=T(a.value),t=a.dataset.tipo,n=Number(a.dataset.i);t==="ahorro"?e.alAhorro=o:t==="obligaciones"&&e.obligaciones[n]?e.obligaciones[n].monto=o:t==="abonos"&&e.abonos[n]&&(e.abonos[n].monto=o),e.propuesto=!1,z()});h.set("quitar-previo",a=>{let e=c.metas.find(t=>t.id===a.dataset.id);if(!e)return;let o=e.abonado??0;e.abonado=0,D={texto:`Quit\xE9 los ${m(o)} que estaban escritos a mano en ${e.nombre}. Ahora manda lo registrado en \xABen qu\xE9 se fue la plata\xBB, que es lo que de verdad pagaste.`,malo:!1},y()});h.set("gasto-a-abono",a=>{let e=c.repartos.find(s=>s.id===a.dataset.id),o=c.metas.find(s=>s.id===a.dataset.meta);if(!e||!o)return;let t=a.dataset.nombre,n=(e.gastos??[]).find(s=>s.nombre===t);n&&(e.gastos=e.gastos.filter(s=>s!==n),e.abonos.push({nombre:o.nombre,monto:n.monto,refId:o.id,movidoDesdeGasto:!0}),D={texto:`Listo: los ${m(n.monto)} de \xAB${n.nombre}\xBB ahora cuentan como abono a ${o.nombre}. El total del mes no cambi\xF3. Si te equivocaste, la l\xEDnea tiene un bot\xF3n \u21A9 para devolverla a gastos.`,malo:!1},y())});h.set("abono-a-gasto",a=>{let e=c.repartos.find(n=>n.id===a.dataset.id),o=Number(a.dataset.i),t=e?.abonos[o];!e||!t||(e.abonos=e.abonos.filter((n,s)=>s!==o),e.gastos=[...e.gastos??[],{nombre:t.nombre,monto:t.monto}],D={texto:`${t.nombre} volvi\xF3 a ser un gasto suelto.`,malo:!1},y())});h.set("nuevo-gasto",a=>{let e=c.repartos.find(s=>s.id===a.dataset.id),o=c.ingresos.find(s=>s.id===e?.ingresoId);if(!e||!o)return;let t=ua(e,o),n=t>0?t:Math.min(e.alAhorro,e.alAhorro);e.gastos=[...e.gastos??[],{nombre:"",monto:0}],n<=0&&(e.propuesto=!1),y()});h.set("editar-gasto",a=>{let e=c.repartos.find(s=>s.id===a.dataset.id),o=Number(a.dataset.i),t=e?.gastos?.[o];if(!e||!t)return;let n=a.value;if(a.dataset.campo==="nombre")t.nombre=n;else{let s=T(n);e.alAhorro=Math.max(0,e.alAhorro-(s-t.monto)),t.monto=s}e.propuesto=!1,z()});h.set("borrar-gasto",a=>{let e=c.repartos.find(n=>n.id===a.dataset.id),o=Number(a.dataset.i),t=e?.gastos?.[o];!e||!t||(e.alAhorro+=t.monto,e.gastos=e.gastos.filter((n,s)=>s!==o),y())});h.set("recalcular",a=>{let e=c.repartos.find(s=>s.id===a.dataset.id),o=c.ingresos.find(s=>s.id===e?.ingresoId);if(!e||!o)return;let t=e.gastos??[],n=ia(o);n.gastos=t,n.alAhorro=Math.max(0,n.alAhorro-t.reduce((s,i)=>s+i.monto,0)),c.repartos=c.repartos.map(s=>s.id===e.id?n:s),D={texto:"Recalculado con las obligaciones de ahora.",malo:!1},y()});h.set("cuadrar",a=>{let e=c.repartos.find(t=>t.id===a.dataset.id),o=c.ingresos.find(t=>t.id===e?.ingresoId);!e||!o||(e.alAhorro=Math.max(0,e.alAhorro+ua(e,o)),e.propuesto=!1,y())});h.set("aporte-externo",async a=>{let e=await oa({titulo:"\xBFCu\xE1nto vas a meter de tu bolsillo?",detalle:"Plata tuya que no viene del trabajo: Nequi, efectivo, lo que tengas guardado por otro lado.",valorInicial:"0",dinero:!0,textoAceptar:"Meterlo"});if(e===null)return;let o=T(e);if(o<=0)return D={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},P();let t=await oa({titulo:"\xBFDe d\xF3nde sali\xF3?",detalle:"Para que dentro de unos meses sepas qu\xE9 fue esto.",valorInicial:"Nequi",textoAceptar:"Guardar"}),n={id:Y("ing"),fecha:sa(),monto:o,nota:t?.trim()||"de otro lado"};c.ingresos.push(n),c.repartos.push(ia(n)),y()});h.set("soporte",a=>{let e=La(new Date),o=new Set(c.soportesMarcados[e]??[]),t=a.dataset.id;a.checked?o.add(t):o.delete(t),c.soportesMarcados={...c.soportesMarcados,[e]:[...o]},z()});h.set("borrar-ingreso",a=>{c.repartos=c.repartos.filter(e=>e.ingresoId!==a.dataset.id),c.ingresos=c.ingresos.filter(e=>e.id!==a.dataset.id),y()});function et(){let a=globalThis.__TAURI__;return a?.dialog&&a?.fs?{dialog:a.dialog,fs:a.fs}:null}h.set("exportar",async()=>{let a=ao(c),e=`respaldo-dinero-${sa()}.json`,o=et();if(!o){let t=new Blob([a],{type:"application/json"}),n=document.createElement("a");return n.href=URL.createObjectURL(t),n.download=e,n.click(),URL.revokeObjectURL(n.href),D={texto:`Respaldo guardado en tu carpeta de descargas como ${e}.`,malo:!1},P()}try{let t=await o.dialog.save({title:"\xBFD\xF3nde guardo el respaldo?",defaultPath:e,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!t)return;await o.fs.writeTextFile(t,a),D={texto:`Respaldo guardado en ${t}`,malo:!1}}catch(t){D={texto:`No pude guardar el respaldo: ${String(t)}`,malo:!0}}P()});h.set("importar",async()=>{let a=et();if(a)try{let o=await a.dialog.open({title:"\xBFQu\xE9 respaldo quieres cargar?",multiple:!1,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!o)return;let{estado:t,aviso:n}=pe(await a.fs.readTextFile(o));return t?(c=t,D={texto:"Respaldo importado.",malo:!1},y()):(D={texto:n.texto,malo:!0},P())}catch(o){return D={texto:`No pude leer ese archivo: ${String(o)}`,malo:!0},P()}let e=document.getElementById("archivo");e.onchange=async()=>{let o=e.files?.[0];if(!o)return;let{estado:t,aviso:n}=pe(await o.text());if(!t)return D={texto:n.texto,malo:!0},P();c=t,D={texto:"Respaldo importado.",malo:!1},y()},e.click()});document.addEventListener("input",a=>{let e=a.target;if(e instanceof HTMLInputElement&&(e.hasAttribute("data-dinero")&&oo(e),e.dataset.campo==="desdePago")){let o=e.parentElement?.querySelector(".mes-de-pago");if(o){let t=Math.max(1,Math.round(Number(e.value)||1));o.textContent=t<=1?"desde el primero":_(q(t,w()).optimista)}}});document.addEventListener("focusout",a=>{let e=a.target?.closest?.("[data-panel]");if(!e||a.relatedTarget?.closest?.("[data-panel]")===e)return;let t=e.dataset.panel;setTimeout(()=>{if(va||Jo()===t)return;let n=ae().find(([i])=>i===t)?.[1],s=document.getElementById(`panel-${t}`);n!==void 0&&s&&xe(s,n)},0)});document.addEventListener("toggle",a=>{let e=a.target,o=e?.dataset?.mes;o&&(e.open?ra.add(o):ra.delete(o))},!0);document.addEventListener("change",a=>{let e=a.target?.closest("[data-accion]");e&&h.get(e.dataset.accion)?.(e,a)});document.addEventListener("click",a=>{let e=a.target,o=e?.closest?.("tr[data-resumen]");if(Wa){Wa=!1;return}if(o&&!e?.closest("input, select, textarea, button, a")&&window.matchMedia("(max-width: 620px)").matches){Sn(o);return}let t=a.target?.closest("button[data-accion]");va=!1,t?(na=!1,h.get(t.dataset.accion)?.(t,a)):na&&(na=!1,Se())});"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(()=>{})});var Xa=Ze();c=Xa.estado;Xa.aviso&&(D={texto:Xa.aviso.texto,malo:Xa.aviso.grave});function Pn(){let a=new Set(c.repartos.map(o=>o.ingresoId)),e=c.ingresos.filter(o=>!a.has(o.id)).sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o of e)c.repartos.push(ia(o));return e.length>0}Pn()&&ea(c);P();globalThis.__estado=()=>c;globalThis.__reiniciar=()=>{c=Q(),y()};h.set("nube-entrar",async()=>{let a=document.getElementById("nube-correo")?.value??"",e=document.getElementById("nube-clave")?.value??"";if(!a.trim()||!e)return D={texto:"Escribe tu correo y tu contrase\xF1a.",malo:!0},P();try{D={texto:`Entraste como ${(await bo(a,e)).correo}. Ya puedes sincronizar.`,malo:!1}}catch(o){D={texto:o.message,malo:!0}}P()});h.set("nube-salir",()=>{he(),V=null,j=[],D={texto:"Saliste de la cuenta. Tus datos siguen aqu\xED, intactos.",malo:!1},P()});h.set("nube-preparar",async a=>{if(L)return;let e=a.dataset.modo==="traer"?"traer":"subir";L=!0,P();try{let o=await Do(),t=ta(c),n=yo(t,o);n.length===0?(V=JSON.parse(JSON.stringify(c)),za(V),D={texto:"Este aparato y la nube ya est\xE1n iguales. No hay nada que cambiar.",malo:!1}):O={modo:e,locales:t,remotas:o,difs:n,elecciones:$e(n,e)}}catch(o){D={texto:o.message,malo:!0}}L=!1,P()});h.set("nube-elegir",a=>{if(!O)return;let e=a.dataset.lado==="nube"?"nube":"aqui";O.elecciones[a.dataset.clave]=e;let o=a.dataset.clave;for(let t of document.querySelectorAll(`input[type="radio"][name="${CSS.escape(o)}"]`))t.closest(".opcion")?.classList.toggle("elegida",t.checked)});h.set("nube-cancelar",()=>{O=null,D={texto:"Cancelado. No se cambi\xF3 nada, ni aqu\xED ni en la nube.",malo:!1},P()});h.set("nube-aplicar",async()=>{if(!(!O||L)){L=!0,P();try{let a=O,e=xo(a.locales,a.remotas,a.difs,a.elecciones,new Date().toISOString());await Eo(e),c=Fa(e,c),ea(c),V=JSON.parse(JSON.stringify(c)),za(V),j=[],O=null,D={texto:`Listo: ${a.difs.length} ${a.difs.length===1?"diferencia resuelta":"diferencias resueltas"}. Este aparato y la nube quedaron iguales.`,malo:!1}}catch(a){D={texto:`No se aplic\xF3 nada: ${a.message}`,malo:!0}}L=!1,P()}});h.set("nube-sincronizar",async()=>{if(!L){L=!0,P();try{let a=await Mo(c,V,new Date().toISOString());c=a.estado,V=JSON.parse(JSON.stringify(a.estado)),j=a.descartes.map(e=>({tabla:e.tabla,id:e.id,campo:e.campo,valor:e.valor,gano:e.gano,nombre:e.nombre})),ea(c),za(V),D={texto:j.length===0?"Todo al d\xEDa. Nada que resolver.":`Listo. ${j.length} dato(s) distintos entre los dos aparatos: mira abajo.`,malo:!1}}catch(a){D={texto:a.message,malo:!0}}L=!1,P()}});h.set("nube-revertir",a=>{let e=Number(a.dataset.i),o=j[e];if(!o)return;let t=wo(c,o);if(!t.ok)return D={texto:t.motivo??"Eso no se puede deshacer desde aqu\xED.",malo:!0},P();j=j.filter((n,s)=>s!==e),ea(c),D={texto:`Listo: ${Qa(o,c)} se queda con ${fa(o.campo,o.valor)}. Sincroniza otra vez para que el otro aparato lo tome.`,malo:!1},P()});document.addEventListener("keydown",a=>{if(a.key!=="Enter"||a.isComposing)return;let e=a.target;!e||e.closest(".capa-dialogo")||!(e instanceof HTMLInputElement)||e.type==="checkbox"||(a.preventDefault(),e.blur())});
