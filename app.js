var aa=Number.MAX_SAFE_INTEGER;function v(e){let a=typeof e=="number"?e:Number(e);return Number.isFinite(a)?Math.abs(a)>aa?a<0?-aa:aa:Math.round(a):0}function le(e,a){return v(e*a)}var qa=100;function ct(e,a){return a<=0?"sin_pagar":a>=e+qa?"pagaron_de_mas":a>=e-qa?"completa":"parcial"}function de(e,a){let o=new Map;for(let t of a){let n=o.get(t.cuentaDeCobroId)??[];n.push(t),o.set(t.cuentaDeCobroId,n)}return e.map(t=>{let n=(o.get(t.id)??[]).slice().sort((i,l)=>i.fecha.localeCompare(l.fecha)),s=n.reduce((i,l)=>i+v(l.monto),0),r=ct(v(t.montoEsperado),s);return{cuenta:t,ingresos:n,recibido:s,pendiente:r==="completa"?0:Math.max(0,v(t.montoEsperado)-s),estado:r,ultimoPago:n.length?n[n.length-1].fecha:null}})}function Ia(e){return e.filter(a=>a.pendiente>0)}function Ce(e){return e.reduce((a,o)=>a+o.pendiente,0)}var Re=new Intl.NumberFormat("es-CO");function wa(e){let a=`$${Re.format(e.cuenta.montoEsperado)}`,o=`$${Re.format(e.recibido)}`;switch(e.estado){case"sin_pagar":return`${e.cuenta.periodo}: sin pagar \xB7 te deben ${a}`;case"parcial":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 faltan $${Re.format(e.pendiente)}`;case"completa":return`${e.cuenta.periodo}: pagada completa (${o})`;case"pagaron_de_mas":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 $${Re.format(e.recibido-e.cuenta.montoEsperado)} de mas`}}function lt(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function Ae(e,a,o){return lt(a,(e-1)*o)}function q(e,a){let o=Math.max(1,a.diasOptimista);return{optimista:Ae(e,a.desde,o),pesimista:Ae(e,a.desde,Math.max(o,a.diasPesimista))}}function oa(e){return e.diasPesimista<=e.diasOptimista}var dt=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function k(e){return`${dt[e.getMonth()]} de ${e.getFullYear()}`}var La=["ene.","feb.","mar.","abr.","mayo","jun.","jul.","ago.","sept.","oct.","nov.","dic."];function ue(e){let[a,o]=[e.optimista,e.pesimista],t=La[a.getMonth()],n=La[o.getMonth()];return a.getFullYear()!==o.getFullYear()?`${t} ${a.getFullYear()} \u2013 ${n} ${o.getFullYear()}`:a.getMonth()===o.getMonth()?`${t} ${a.getFullYear()}`:`${t} \u2013 ${n} ${o.getFullYear()}`}function ee(e){let a=k(e.optimista),o=k(e.pesimista);return a===o?a:`entre ${a} y ${o}`}function qe(e){return new Map(e.map(a=>[a.id,Math.max(0,v(a.valor)-v(a.abonado??0))]))}function ut(e){return e.baseCobro??(e.tipo==="porcentaje"?"cada_ingreso":"una_vez_por_cuenta")}function pt(e,a,o){if(!o&&ut(e)==="una_vez_por_cuenta")return!1;if(e.modo==="primer_pago")return a===1&&o;if(a<(e.desdePago??1))return!1;if(e.modo==="cada_pago")return!0;let t=e.supuesto??"siempre";return t==="nunca"?!1:t==="cada_dos_pagos"?a%2===1:!0}function Ie(e,a,o){let t=e,n=0;for(let s of a??[]){let r=Math.max(1,Math.round(s.desdePago));o>=r&&r>=n&&(t=s.valor,n=r)}return t}function mt(e,a,o){let t=Ie(e.valor,e.cambios,o);return e.tipo==="porcentaje"?le(a,t):v(t)}function Ta(e,a){return e.maximoPorPago&&e.maximoPorPago>0?v(e.maximoPorPago):e.enCuotas&&e.enCuotas>0?Math.max(1,Math.ceil(v(e.valor)/Math.round(e.enCuotas))):a}function gt(e,a,o,t){for(let n of[!0,!1])for(let s of a){if(e<=0)return 0;let r=o.get(s.id)??0;if(r<=0)continue;let i=t.find(f=>f.metaId===s.id),l=i?.monto??0,u=n?Ta(s,r+l)-l:r,d=Math.min(r,e,u);d<=0||(i?(i.monto+=d,i.deLoQueSobro=(i.deLoQueSobro??0)+d):t.push({metaId:s.id,monto:d,deLoQueSobro:d}),o.set(s.id,r-d),e-=d)}return e}function ae(e,a,o,t,n,s,r,i=!0){let l=v(a),u=[];for(let $ of o){if(!pt($,e,i))continue;let y=Math.min(mt($,a,e),l);y<=0||(u.push({nombre:$.nombre,monto:y}),l-=y)}let d=Ie(t.base,t.cambios,e),f=Math.min(v(d),l);l-=f;let g=[],b=0;for(let $ of n){let y=s.get($.id)??0;if(y<=0||e<($.desdePago??1))continue;let M=Ta($,y),R=Math.min(y,l,M);if(t.elastico&&R<y&&M>=y){let C=Math.max(0,f-v(t.minimo)),F=y-R;F<=C&&(f-=F,b+=F,R=y)}if(!(R<=0)&&(g.push({metaId:$.id,monto:R}),s.set($.id,y-R),l-=Math.min(R,l),l<=0))break}t.sobranteAMetas&&l>0&&(l=gt(l,n,s,g));let x=l;return{numero:e,ingreso:a,obligaciones:u,aColchon:f,recorteColchon:b,abonos:g,sobrante:x,saldoAhorro:r+f+x}}function Oa(e,a,o,t,n,s,r=!0){let i=e.cuentaDeCobroId===void 0||e.cuentaDeCobroId==="",l=ae(a,v(e.monto),i?[]:o,i?{...t,base:0,minimo:0}:t,n,s,0,r),u=new Map(n.map(d=>[d.id,d]));return{id:`rep-${e.id}`,ingresoId:e.id,obligaciones:l.obligaciones.map(d=>({nombre:d.nombre,monto:d.monto})),abonos:l.abonos.map(d=>({nombre:u.get(d.metaId)?.nombre??"(meta borrada)",monto:d.monto,refId:d.metaId})),alAhorro:l.aColchon+l.sobrante,propuesto:!0}}function bt(e){let a=o=>o.reduce((t,n)=>t+v(n.monto),0);return a(e.obligaciones)+a(e.abonos)+a(e.gastos??[])+v(e.alAhorro)}function pe(e,a){return v(a.monto)-bt(e)}var ta=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function ja(e){return e.slice(0,7)}function oe(e,a){let o=v(a.monto);if(o===0)return;let t=e.get(a.nombre);if(!t){e.set(a.nombre,{...a,monto:o});return}t.monto+=o,a.deLoQueSobro&&(t.deLoQueSobro=(t.deLoQueSobro??0)+a.deLoQueSobro)}function na(e,a){let o=new Map(a.map(n=>[n.ingresoId,n])),t=new Map;for(let n of e){let s=ja(n.fecha),r=t.get(s);r||(r={mes:s,entro:0,deTrabajo:0,deFuera:0,aObligaciones:0,aMetas:0,enGastos:0,alAhorro:0,detalle:[],sinAsignar:0,_detalle:new Map},t.set(s,r));let i=v(n.monto);r.entro+=i,n.cuentaDeCobroId===void 0||n.cuentaDeCobroId===""?r.deFuera+=i:r.deTrabajo+=i;let u=o.get(n.id);if(!u){r.sinAsignar+=i;continue}for(let d of u.obligaciones)r.aObligaciones+=v(d.monto),oe(r._detalle,d);for(let d of u.abonos)r.aMetas+=v(d.monto),oe(r._detalle,d);for(let d of u.gastos??[])r.enGastos+=v(d.monto),oe(r._detalle,d);r.alAhorro+=v(u.alAhorro),r.sinAsignar+=pe(u,n)}return[...t.values()].map(({_detalle:n,...s})=>({...s,detalle:[...n.values()].sort((r,i)=>i.monto-r.monto)})).sort((n,s)=>n.mes.localeCompare(s.mes))}function Fa(e){let a=new Map;for(let o of e)for(let t of[...o.obligaciones,...o.abonos,...o.gastos??[]])oe(a,t);return[...a.values()].sort((o,t)=>t.monto-o.monto)}function U(e){let[a,o]=e.split("-"),t=Number(o)-1;return ta[t]?`${ta[t]} de ${a}`:e}function Na(e,a,o,t=[]){let n=new Map,s=new Map,r=new Map(t.map(l=>[l.id,l.nombre])),i=l=>r.get(l)??l;for(let l of e){let u=Ae(l.numero,a,Math.max(1,o)),d=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,f=n.get(d);f||(f={mes:d,entro:0,aObligaciones:0,aMetas:0,alAhorro:0,detalle:[],pagos:[]},n.set(d,f),s.set(d,new Map));let g=s.get(d);f.pagos.push(l.numero),f.entro+=v(l.ingreso);for(let b of l.obligaciones)f.aObligaciones+=v(b.monto),oe(g,{nombre:b.nombre,monto:b.monto});for(let b of l.abonos)f.aMetas+=v(b.monto),oe(g,{nombre:i(b.metaId),monto:b.monto,refId:b.metaId,...b.deLoQueSobro?{deLoQueSobro:b.deLoQueSobro}:{}});f.alAhorro+=v(l.aColchon)+v(l.sobrante)}return[...n.values()].map(l=>({...l,detalle:[...s.get(l.mes).values()].sort((u,d)=>d.monto-u.monto)})).sort((l,u)=>l.mes.localeCompare(u.mes))}function we(e,a){let o=new Set(a.map(t=>t.cuentaDeCobroId).filter(t=>!!t));return e.cuentaDeCobroId?o.has(e.cuentaDeCobroId)?o.size:o.size+1:Math.max(1,o.size)}function Q(e){return(e??[]).filter(a=>v(a.monto)!==0)}function _a(e,a){let o=new Set([...Q(a.obligaciones),...Q(a.abonos)].map(t=>t.nombre));return[...Q(e.obligaciones),...Q(e.abonos)].map(t=>t.nombre).filter(t=>!o.has(t))}function ka(e,a,o,t){let n=a.find(r=>r.nombre.trim()===e.trim());if(n)return n.compra?{tipo:"ya-comprada"}:v(n.abonado??0)>=v(n.valor)?{tipo:"ya-pagada"}:(n.desdePago??1)>t?{tipo:"empieza-despues",pago:n.desdePago}:{tipo:"no-se-sabe"};let s=o.find(r=>r.nombre.trim()===e.trim());return s?s.valor<=0?{tipo:"en-cero"}:s.modo==="primer_pago"&&t>1?{tipo:"solo-el-primer-pago"}:(s.desdePago??1)>t?{tipo:"empieza-despues",pago:s.desdePago}:s.modo==="puntual"?{tipo:"puntual"}:{tipo:"no-se-sabe"}:{tipo:"ya-no-esta"}}function za(e,a,o,t=new Map){return[...new Set([...e.map(s=>s.mes),...a.map(s=>s.mes)])].sort().map(s=>{let r=e.find(d=>d.mes===s)??null,i=a.find(d=>d.mes===s)??null,l=s<o?"pasado":s===o?"actual":"futuro",u=t.get(s)??(r?{monto:r.entro,segun:"escenario"}:null);return{mes:s,estado:l,real:i,simulado:r,esperado:u,diferencia:l==="pasado"&&u&&i?i.entro-u.monto:null}})}function sa(e){let a=0,o=0,t=0,n=0,s=0,r=0;for(let i of e)i.real&&(n+=1,a+=i.real.entro,o+=i.real.aObligaciones+i.real.aMetas+i.real.enGastos,t+=i.real.alAhorro),i.estado==="futuro"&&i.simulado&&(r+=1,s+=i.esperado?.monto??i.simulado.entro);return{mesesConDatos:n,entroDeVerdad:a,gastadoDeVerdad:o,guardadoDeVerdad:t,faltaPorEntrar:s,mesesQueFaltan:r}}var ft=new Map(ta.map((e,a)=>[e,String(a+1).padStart(2,"0")]));function ht(e,a){let o=e.toLowerCase().trim(),t=o.match(/^(\d{4})-(\d{2})/);if(t)return`${t[1]}-${t[2]}`;let n=o.match(/([a-záéíóú]+)\D+(\d{4})/);if(n){let r=ft.get(n[1]);if(r)return`${n[2]}-${r}`}let s=a.slice().sort((r,i)=>r.fecha.localeCompare(i.fecha))[0];return s?ja(s.fecha):null}function Ha(e,a,o,t){let n=new Map;for(let s of e){let r=a.filter(l=>l.cuentaDeCobroId!==void 0),i=ht(s.periodo,r);i&&n.set(i,v(s.montoEsperado))}return new Map(t.map(s=>{let r=n.get(s);return[s,r!==void 0?{monto:r,segun:"cuenta_de_cobro"}:{monto:v(o),segun:"escenario"}]}))}function Ba(e,a){let o=s=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=new Map(a.map(s=>[o(s.nombre),s])),n=[];for(let s of Q(e.gastos)){let r=t.get(o(s.nombre));r&&n.push({gasto:s,metaId:r.id,metaNombre:r.nombre})}return n}function me(e,a){let o=new Map;for(let t of a)for(let n of t.abonos)n.refId&&o.set(n.refId,(o.get(n.refId)??0)+v(n.monto));return new Map(e.map(t=>{let n=v(t.valor),s=v(t.abonado??0),r=o.get(t.id)??0,i=Math.min(s+r,n);return[t.id,{previo:s,real:r,total:i,falta:Math.max(0,n-i)}]}))}function ra(e,a){let o=me(e,a);return e.map(t=>({...t,abonado:o.get(t.id).total}))}function Va(e,a){let o=0;for(let t of me(e,a).values())o+=t.total;return o}var vt=600;function ge(e){let a=qe(e.metas),o=e.maxPagos??vt,t=[],n=new Map,s=new Map,r=new Map,i=new Map,l=0,d=Math.max(1,Math.round(e.desdePago??1))-1;for(;t.length<o&&[...a.values()].some(g=>g>0);){d+=1;let g=ae(d,v(Ie(e.ingresoEsperado,e.cambiosIngreso,d)),e.obligaciones,e.colchon,e.metas,a,l);l=g.saldoAhorro,t.push(g);for(let b of g.abonos)n.has(b.metaId)||n.set(b.metaId,d),r.set(b.metaId,(r.get(b.metaId)??0)+1),i.set(b.metaId,(i.get(b.metaId)??0)+b.monto),(a.get(b.metaId)??0)<=0&&s.set(b.metaId,d)}let f=e.metas.map(g=>{let b=Math.min(v(g.abonado??0),v(g.valor)),x=i.get(g.id)??0;return{metaId:g.id,nombre:g.nombre,grupo:g.grupo,valor:g.valor,pagoInicio:n.get(g.id)??null,pagoFin:s.get(g.id)??null,cantidadPagos:r.get(g.id)??0,totalAbonado:b+x,completada:(a.get(g.id)??0)<=0,yaEstabaPagada:b>=v(g.valor)}});return{escenario:e.nombre,pagos:t,metas:f,totalPagos:d,ahorroFinal:l,incompleta:t.length>=o&&f.some(g=>!g.completada)}}function Ga(e){let a=new Map;for(let o of e.metas){if(!o.grupo)continue;let t=a.get(o.grupo)??[];t.push(o),a.set(o.grupo,t)}return[...a.entries()].map(([o,t])=>{let n=t.map(i=>i.pagoInicio).filter(i=>i!==null),s=t.map(i=>i.pagoFin).filter(i=>i!==null),r=t.every(i=>i.completada);return{grupo:o,valor:t.reduce((i,l)=>i+l.valor,0),pagoInicio:n.length?Math.min(...n):null,pagoFin:r&&s.length?Math.max(...s):null,totalAbonado:t.reduce((i,l)=>i+l.totalAbonado,0),completado:r,yaEstabaPagado:t.every(i=>i.yaEstabaPagada)}})}function Qa(e,a){return a.filter(t=>t.antesDelPago&&t.antesDelPago>0).map(t=>{let n=e.metas.find(i=>i.metaId===t.id),s=n?.pagoFin??null,r=n?.yaEstabaPagada?0:s;return{metaId:t.id,nombre:t.nombre,queria:Math.round(t.antesDelPago),termina:r,seRetrasa:r===null?null:Math.max(0,r-Math.round(t.antesDelPago))}})}function Ua(e,a){let o=v(a);if(o<=0)return null;let t=ge(e),n=ge({...e,ingresoEsperado:v(e.ingresoEsperado)+o,maxPagos:1}),s=new Map(n.metas.map(l=>[l.metaId,l.totalAbonado])),i=1+ge({...e,metas:e.metas.map(l=>({...l,abonado:Math.max(v(l.abonado??0),s.get(l.id)??0)}))}).totalPagos;return{pendiente:o,pagosAhora:t.totalPagos,pagosSiPagan:i,seAdelanta:Math.max(0,t.totalPagos-i)}}function ia(e,a,o){return new Date(e,a-1,o)}function Le(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function $t(e){let a=e.getDay();return a===1?e:Le(e,(8-a)%7)}function Mt(e){let a=e%19,o=Math.floor(e/100),t=e%100,n=Math.floor(o/4),s=o%4,r=Math.floor((o+8)/25),i=Math.floor((o-r+1)/3),l=(19*a+o-n-i+15)%30,u=Math.floor(t/4),d=t%4,f=(32+2*s+2*u-l-d)%7,g=Math.floor((a+11*l+22*f)/451),b=Math.floor((l+f-7*g+114)/31),x=(l+f-7*g+114)%31+1;return ia(e,b,x)}function Dt(e){let a=Mt(e),o=s=>Le(a,s),t=[[1,1,"A\xF1o Nuevo"],[5,1,"D\xEDa del Trabajo"],[7,20,"Independencia de Colombia"],[8,7,"Batalla de Boyac\xE1"],[12,8,"Inmaculada Concepci\xF3n"],[12,25,"Navidad"]],n=[[1,6,"Reyes Magos"],[3,19,"San Jos\xE9"],[6,29,"San Pedro y San Pablo"],[8,15,"Asunci\xF3n de la Virgen"],[10,12,"D\xEDa de la Raza"],[11,1,"Todos los Santos"],[11,11,"Independencia de Cartagena"]];return[...t.map(([s,r,i])=>({fecha:ia(e,s,r),nombre:i})),...n.map(([s,r,i])=>({fecha:$t(ia(e,s,r)),nombre:i})),{fecha:o(-3),nombre:"Jueves Santo"},{fecha:o(-2),nombre:"Viernes Santo"},{fecha:o(43),nombre:"Ascensi\xF3n del Se\xF1or"},{fecha:o(64),nombre:"Corpus Christi"},{fecha:o(71),nombre:"Sagrado Coraz\xF3n de Jes\xFAs"}].sort((s,r)=>s.fecha.getTime()-r.fecha.getTime())}var be=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;function ca(e){return Dt(e.getFullYear()).find(a=>be(a.fecha)===be(e))?.nombre??null}function Et(e){return ca(e)!==null}function la(e){return e.getDay()===0}function Ya(e){let a=new Date(e.getTime());for(let o=0;o<15&&(la(a)||Et(a));o++)a=Le(a,-1);return a}var Ja=30,Xa="Febrero no tiene 30: se radica el \xFAltimo d\xEDa del mes (28, o 29 si es bisiesto), y si ese d\xEDa cae domingo o festivo se retrocede igual que siempre.";function yt(e,a){let o=new Date(e,a,0).getDate(),t=o<Ja,n=new Date(e,a-1,Math.min(Ja,o)),s=Ya(n),r=null;if(be(s)!==be(n)){let i=ca(n);r=i?`el ${n.getDate()} es festivo (${i})`:la(n)?`el ${n.getDate()} cae domingo`:`el ${n.getDate()} no es d\xEDa h\xE1bil`}return{fecha:s,fechaOriginal:n,motivoDelCambio:r,usoUltimoDiaDelMes:t}}var da=[{id:"cuenta",nombre:"Cuenta de cobro diligenciada",frecuencia:"cada_mes",detalle:"Con una descripci\xF3n del servicio prestado."},{id:"informe",nombre:"Informe de actividades",frecuencia:"cada_mes",detalle:"Detallando espec\xEDficamente las funciones o actividades realizadas."},{id:"conformidad",nombre:"Certificado de conformidad del servicio",frecuencia:"cada_mes",detalle:"Lo entrega el coordinador o l\xEDder del \xE1rea: hay que ped\xEDrselo con tiempo."},{id:"seguridad_social",nombre:"Planilla de seguridad social",frecuencia:"cada_mes",obligatorioExplicito:!0,detalle:"Liquidada del mes VENCIDO al que se est\xE1 cobrando. La circular la marca como obligatoria."},{id:"constancia",nombre:"Constancia de prestaci\xF3n de servicio firmada por el paciente",frecuencia:"solo_asistencial",detalle:"Solo personal asistencial. Como t\xE9cnico de sistemas, no aplica."},{id:"rut",nombre:"RUT actualizado",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez."},{id:"bancaria",nombre:"Certificaci\xF3n bancaria",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez, o si cambia de cuenta."}];function Te(){return da.filter(e=>e.frecuencia==="cada_mes")}var xt=5;function St(e,a){let o=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),t=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return Math.round((t-o)/864e5)}var Wa=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function ua(e,a=[]){let o=yt(e.getFullYear(),e.getMonth()+1),t=St(e,o.fecha),n=t<0?"vencido":t===0?"hoy":t<=xt?"pronto":"tranquilo",s=o.fecha.getDate(),r=Wa[o.fecha.getMonth()],i=n==="vencido"?`Se pas\xF3 la fecha: hab\xEDa que radicar el ${s} de ${r}`:n==="hoy"?"HOY es el \xFAltimo d\xEDa para radicar la cuenta de cobro":n==="pronto"?`Faltan ${t} d\xEDas: radicas el ${s} de ${r}`:`La cuenta de cobro se radica el ${s} de ${r}`,l=Te().filter(u=>!a.includes(u.id)).map(u=>u.id);return{limite:o,diasQueFaltan:t,urgencia:n,titular:i,soportesPendientes:l}}function Ka(e){let a=e.fecha.getDate(),o=Wa[e.fecha.getMonth()];return e.motivoDelCambio?`Se radica el ${a} de ${o}, no el ${e.fechaOriginal.getDate()}, porque ${e.motivoDelCambio}.`:`Se radica el ${a} de ${o}.`}function Oe(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function Pt(){return new Date().toISOString().slice(0,10)}function Rt(){return[]}function Y(){return{version:1,escenario:{nombre:"Mi escenario",ingresoEsperado:2e6,colchonBase:1e5,colchonMinimo:0,colchonElastico:!1,fechaPrimerPago:Pt(),diasOptimista:30,diasPesimista:60},obligaciones:Rt(),metas:[],cuentas:[],ingresos:[],repartos:[],soportesMarcados:{}}}function J(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}var Za="gestiondinerotrabajo.estado";function eo(e){let a=Y();if(typeof e!="object"||e===null)return a;let o=e;return{version:1,escenario:{...a.escenario,...o.escenario??{}},obligaciones:o.obligaciones??a.obligaciones,metas:o.metas??a.metas,cuentas:o.cuentas??a.cuentas,ingresos:o.ingresos??a.ingresos,repartos:o.repartos??a.repartos,soportesMarcados:o.soportesMarcados??a.soportesMarcados,notasDelMes:o.notasDelMes??{}}}function ao(){let e=null;try{e=localStorage.getItem(Za)}catch{return{estado:Y(),aviso:{texto:"No pude leer los datos guardados. Est\xE1s viendo un inicio en blanco.",grave:!0}}}if(!e)return{estado:Y(),aviso:null};try{return{estado:eo(JSON.parse(e)),aviso:null}}catch{return{estado:Y(),aviso:{texto:"Los datos guardados est\xE1n da\xF1ados. No los borr\xE9: sigue ah\xED el archivo por si se puede recuperar.",grave:!0}}}}function te(e){try{return localStorage.setItem(Za,JSON.stringify(e)),null}catch(a){return a instanceof Error?a.message:"no se pudo guardar"}}function oo(e){return JSON.stringify(e,null,2)}function pa(e){try{return{estado:eo(JSON.parse(e)),aviso:null}}catch{return{estado:null,aviso:{texto:"Ese archivo no es un respaldo v\xE1lido. No cambi\xE9 nada de lo que ten\xEDas.",grave:!0}}}}var ma=null;function H(e){return ma?.(),new Promise(a=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${fe(e.titulo)}</h3>
        ${e.detalle?`<p class="dlg-detalle">${fe(e.detalle)}</p>`:""}
        ${e.largo?`<textarea class="dlg-campo" rows="6">${fe(e.valorInicial??"")}</textarea>`:`<input class="dlg-campo" type="text" ${e.dinero?'inputmode="numeric" data-dinero':""}
               value="${fe(e.valorInicial??"")}" />`}
        <div class="dlg-botones">
          <button class="dlg-cancelar">Cancelar</button>
          <button class="primario dlg-aceptar">${fe(e.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=o.querySelector(".dlg-campo"),n=i=>{document.removeEventListener("keydown",r,!0),o.remove(),ma=null,a(i)},s=()=>n(t.value);function r(i){i.key==="Escape"&&(i.preventDefault(),n(null));let l=e.largo?i.ctrlKey:!0;i.key==="Enter"&&l&&document.activeElement===t&&(i.preventDefault(),s())}o.querySelector(".dlg-aceptar").addEventListener("click",s),o.querySelector(".dlg-cancelar").addEventListener("click",()=>n(null)),o.addEventListener("mousedown",i=>{i.target===o&&n(null)}),document.addEventListener("keydown",r,!0),document.body.appendChild(o),ma=()=>n(null),t.focus(),t.select()})}function fe(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var to=new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});function ga(e){return e.replace(/\D/g,"")}function At(e){let a=ga(e);if(a==="")return"";let o=a.replace(/^0+(?=\d)/,"");return to.format(Number(o))}function L(e){let a=ga(e);return a===""?0:Number(a)}function I(e){return to.format(Math.round(e))}function no(e){let a=e.value,o=e.selectionStart??a.length,t=ga(a.slice(0,o)).length,n=At(a);if(n===a)return;e.value=n;let s=0,r=0;for(;r<n.length&&s<t;)/\d/.test(n[r])&&s++,r++;e.setSelectionRange(r,r)}function ba(e){let a=e?.trim();if(!a)return null;try{let o=new URL(/^[a-z][a-z0-9+.-]*:/i.test(a)?a:`https://${a}`);return o.protocol==="http:"||o.protocol==="https:"?o.href:null}catch{return null}}function so(e,a){let o=[],t=0;for(let n of a){let s=Math.max(1,Math.round(n)||1),r=e[t];o.push(s>1||!r?null:r),t+=s}return o}var qt=4;function ro(e){return e.length>=qt}var z="__borrado";function he(e,a){return e[a]??""}function B(e){if(e==null)return"null";if(Array.isArray(e))return`[${e.map(B).join(",")}]`;if(typeof e=="object"){let a=e;return`{${Object.keys(a).filter(t=>a[t]!==void 0).sort().map(t=>`${JSON.stringify(t)}:${B(a[t])}`).join(",")}}`}return JSON.stringify(e)}function je(e,a){return B(e)===B(a)}function io(e,a,o,t){return e!==o?e>o:B(a)>=B(t)}function co(e,a,o,t={}){let n={...t},s=new Set([...Object.keys(e??{}),...Object.keys(a)]);for(let r of s){if(r==="id")continue;let i=e===null?void 0:e[r],l=a[r];je(i,l)||(n[r]=o)}return n}function It(e,a){if(e.datos.id!==a.datos.id)throw new Error(`No se pueden fusionar dos filas distintas: ${e.datos.id} y ${a.datos.id}.`);let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t={id:e.datos.id},n={},s=[];for(let f of o){if(f==="id")continue;let g=e.datos[f],b=a.datos[f],x=he(e.tocado,f),$=he(a.tocado,f),y=io(x,g,$,b),M=y?g:b,R=y?b:g;M!==void 0&&(t[f]=M);let C=x>$?x:$;C!==""&&(n[f]=C),je(g,b)||s.push({id:e.datos.id,campo:f,valor:R,cuando:y?$:x,gano:M})}let r=he(e.tocado,z),i=he(a.tocado,z),l=io(r,e.borradoEn,i,a.borradoEn),u=l?e.borradoEn:a.borradoEn,d=r>i?r:i;return d!==""&&(n[z]=d),je(e.borradoEn,a.borradoEn)||s.push({id:e.datos.id,campo:z,valor:l?a.borradoEn:e.borradoEn,cuando:l?i:r,gano:u}),{fila:{datos:t,tocado:n,borradoEn:u??null},descartes:s}}function wt(e,a){let o=e.datos.propuesto,t=a.datos.propuesto;return o===!1&&t===!0?e:t===!1&&o===!0?a:null}function Lt(e,a){let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t=[];for(let n of o){if(n==="id")continue;let s=e.datos[n],r=a.datos[n];JSON.stringify(s)!==JSON.stringify(r)&&t.push({id:e.datos.id,campo:n,valor:r,cuando:he(a.tocado,n),gano:s})}return t}function lo(e,a){let o=new Map(a.map(s=>[s.datos.id,s])),t=[],n=[];for(let s of e){let r=o.get(s.datos.id);if(!r){t.push(s);continue}let i=wt(s,r);if(i){t.push(i),n.push(...Lt(i,i===s?r:s)),o.delete(s.datos.id);continue}let l=It(s,r);t.push(l.fila),n.push(...l.descartes),o.delete(s.datos.id)}for(let s of a)o.has(s.datos.id)&&t.push(s);return{filas:t,descartes:n}}function uo(e,a){return a?e.filter(o=>{let t=a.get(o.id);if(!t)return!0;let n=o.campo===z?t.borradoEn:t.datos[o.campo];return!je(o.valor,n)}):e}var V=["escenario","obligaciones","metas","cuentas","ingresos","repartos","soportes"],Tt="escenario";function X(e,a){return{datos:{...a,id:e},tocado:{},borradoEn:null}}var Ot=["ordenMetas","ordenObligaciones"];function po(e,a){if(!Array.isArray(a))return e;let o=new Map(a.map((n,s)=>[String(n),s]));return[...e.filter(n=>o.has(n.id)).sort((n,s)=>o.get(n.id)-o.get(s.id)),...e.filter(n=>!o.has(n.id))]}function ne(e){return{escenario:[X(Tt,{...e.escenario,ordenMetas:e.metas.map(a=>a.id),ordenObligaciones:e.obligaciones.map(a=>a.id)})],obligaciones:e.obligaciones.map(a=>X(a.id,{...a})),metas:e.metas.map(a=>X(a.id,{...a})),cuentas:e.cuentas.map(a=>X(a.id,{...a})),ingresos:e.ingresos.map(a=>X(a.id,{...a})),repartos:e.repartos.map(a=>X(a.id,{...a})),soportes:jt(e)}}function jt(e){let a=e.notasDelMes??{};return[...new Set([...Object.keys(e.soportesMarcados),...Object.keys(a).filter(t=>a[t].trim()!=="")])].sort().map(t=>X(t,{...t in e.soportesMarcados?{marcados:e.soportesMarcados[t]}:{},...a[t]?.trim()?{nota:a[t]}:{}}))}function Fe(e,a){let o=l=>(e[l]??[]).filter(u=>u.borradoEn===null),t=l=>e[l]!==void 0&&e[l].length>0,n=t("escenario")?{...a.escenario,...o("escenario")[0]?.datos}:a.escenario;n&&"id"in n&&delete n.id;let s=(t("escenario")?o("escenario")[0]?.datos:void 0)??{};for(let l of Ot)delete n[l];let r={},i={};for(let l of o("soportes")){let{marcados:u,nota:d}=l.datos;Array.isArray(u)&&(r[l.datos.id]=u),typeof d=="string"&&d.trim()!==""&&(i[l.datos.id]=d)}return{version:a.version,escenario:n,obligaciones:po(t("obligaciones")?o("obligaciones").map(l=>l.datos):a.obligaciones,s.ordenObligaciones),metas:po(t("metas")?o("metas").map(l=>l.datos):a.metas,s.ordenMetas),cuentas:t("cuentas")?o("cuentas").map(l=>l.datos):a.cuentas,ingresos:t("ingresos")?o("ingresos").map(l=>l.datos):a.ingresos,repartos:t("repartos")?o("repartos").map(l=>l.datos):a.repartos,soportesMarcados:t("soportes")?r:a.soportesMarcados,notasDelMes:t("soportes")?i:a.notasDelMes??{}}}function mo(e){return{id:e.datos.id,datos:e.datos,tocado:e.tocado,borrado_en:e.borradoEn}}function go(e){let a=e.datos??{};return{datos:{...a,id:String(e.id??a.id??"")},tocado:e.tocado??{},borradoEn:e.borrado_en??null}}function bo(e,a,o,t={}){let n=ne(e),s=a?ne(a):null,r={};for(let i of V){let l=new Map((s?.[i]??[]).map(g=>[g.datos.id,g])),u=t[i]??new Map,d=n[i].map(g=>({...g,tocado:co(l.get(g.datos.id)?.datos??null,g.datos,o,u.get(g.datos.id)??{})})),f=new Set(n[i].map(g=>g.datos.id));for(let[g,b]of l)f.has(g)||d.push({datos:b.datos,tocado:{...u.get(g)??{},[z]:o},borradoEn:o});r[i]=d}return r}var W={url:"https://voncmkjcxzgxfloehovb.supabase.co",clave:"sb_publishable_Ev68VoFXNXqvcVOjgXoknw_vAFK-iHn"},fa="gestiondinerotrabajo.sesion",_e="gestiondinerotrabajo.ultimaSincronizacion",Ne="gestiondinerotrabajo.nube.sincronizado";function ke(){try{let e=localStorage.getItem(fa);return e?JSON.parse(e):null}catch{return null}}function ha(e){try{e?localStorage.setItem(fa,JSON.stringify(e)):localStorage.removeItem(fa)}catch{}}function va(){ha(null);try{localStorage.removeItem(_e),localStorage.removeItem(Ne)}catch{}}function fo(){try{let e=localStorage.getItem(Ne);return e?JSON.parse(e):null}catch{return null}}function ze(e){try{e?localStorage.setItem(Ne,JSON.stringify(e)):localStorage.removeItem(Ne)}catch{}}async function ho(e,a){let o=await fetch(`${W.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:W.clave,"Content-Type":"application/json"},body:JSON.stringify({email:e.trim(),password:a})}),t=await o.json().catch(()=>({}));if(!o.ok)throw new Error(Ft(o.status,t));let n={token:t.access_token,refresco:t.refresh_token,usuarioId:t.user?.id??"",correo:t.user?.email??e.trim(),caduca:Date.now()+(Number(t.expires_in)||3600)*1e3};if(!n.token||!n.usuarioId)throw new Error("Supabase respondi\xF3 sin sesi\xF3n. Revisa la direcci\xF3n del proyecto.");return ha(n),n}function Ft(e,a){let o=String(a.error_description??a.msg??a.message??"");return e===400&&/invalid login|credentials/i.test(o)?"Correo o contrase\xF1a incorrectos.":e===400&&/email not confirmed/i.test(o)?"Falta confirmar el correo: mira el mensaje que te mand\xF3 Supabase.":e===422?"Ese correo no tiene un formato v\xE1lido.":e===429?"Demasiados intentos seguidos. Espera un momento.":o||`No se pudo entrar (error ${e}).`}async function $a(){let e=ke();if(!e)throw new Error("No has entrado con tu correo.");if(Date.now()<e.caduca-6e4)return e;let a=await fetch(`${W.url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:W.clave,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e.refresco})});if(!a.ok)throw va(),new Error("La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.");let o=await a.json(),t={...e,token:o.access_token,refresco:o.refresh_token??e.refresco,caduca:Date.now()+(Number(o.expires_in)||3600)*1e3};return ha(t),t}function vo(e){return{apikey:W.clave,Authorization:`Bearer ${e.token}`,"Content-Type":"application/json"}}async function $o(e,a,o){let t=o?`&actualizado_en=gt.${encodeURIComponent(o)}`:"",n=await fetch(`${W.url}/rest/v1/${a}?select=*${t}`,{headers:vo(e)});if(!n.ok)throw new Error(await Do(n,a,"bajar"));return(await n.json()).map(go)}async function Mo(e,a,o){if(o.length===0)return;let t=o.map(s=>({...mo(s),usuario_id:e.usuarioId})),n=await fetch(`${W.url}/rest/v1/${a}?on_conflict=usuario_id,id`,{method:"POST",headers:{...vo(e),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(t)});if(!n.ok)throw new Error(await Do(n,a,"subir"))}async function Do(e,a,o){let t=await e.text().catch(()=>"");return e.status===401?"La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.":e.status===404||/does not exist/i.test(t)?`Falta la tabla \xAB${a}\xBB en Supabase: ejecuta supabase/esquema.sql.`:e.status===403||/permission denied/i.test(t)?`Sin permiso sobre \xAB${a}\xBB. Revisa los grants del esquema.`:`No se pudo ${o} \xAB${a}\xBB (error ${e.status}).`}async function Eo(e,a,o){let t=await $a(),n=He(),s=bo(e,a,o),r=a?ne(a):null,i={},l=[];for(let d of V){let f=s[d],g=await $o(t,d,n),b=lo(f,g);i[d]=b.filas;let x=r?new Map(r[d].map(M=>[M.datos.id,{datos:M.datos,borradoEn:M.borradoEn}])):null,$=new Map(b.filas.map(M=>[M.datos.id,M.datos]));l.push(...uo(b.descartes,x).map(M=>{let R=$.get(M.id),C=typeof R?.nombre=="string"?R.nombre:typeof R?.periodo=="string"?R.periodo:void 0;return{...M,tabla:d,nombre:C}}));let y=new Set(f.filter(M=>Object.keys(M.tocado).length>0).map(M=>M.datos.id));for(let M of b.descartes)y.add(M.id);await Mo(t,d,b.filas.filter(M=>y.has(M.datos.id)))}let u=new Date().toISOString();try{localStorage.setItem(_e,u)}catch{}return{estado:Fe(i,e),descartes:l,cuando:u}}async function yo(){let e=await $a(),a={};for(let o of V)a[o]=await $o(e,o,null);return a}async function xo(e){let a=await $a();for(let t of V)await Mo(a,t,e[t]??[]);let o=new Date().toISOString();try{localStorage.setItem(_e,o)}catch{}return o}function He(){try{return localStorage.getItem(_e)}catch{return null}}function So(e,a){let o=[];for(let t of V){let n=new Map((e[t]??[]).map(i=>[i.datos.id,i])),s=new Map((a[t]??[]).map(i=>[i.datos.id,i])),r=[...n.keys(),...[...s.keys()].filter(i=>!n.has(i))];for(let i of r){let l=n.get(i),u=s.get(i),d={tabla:t,id:i};if(l&&!u){o.push({...d,clave:`${t}|${i}|fila`,tipo:"solo-aqui",aqui:l.datos,nube:void 0,datos:l.datos});continue}if(!l&&u){if(u.borradoEn)continue;o.push({...d,clave:`${t}|${i}|fila`,tipo:"solo-nube",aqui:void 0,nube:u.datos,datos:u.datos});continue}if(!l||!u)continue;if(u.borradoEn){o.push({...d,clave:`${t}|${i}|fila`,tipo:"borrada-en-la-nube",aqui:l.datos,nube:null,datos:l.datos});continue}let f=l.datos.propuesto===!1&&u.datos.propuesto===!0?"aqui":u.datos.propuesto===!1&&l.datos.propuesto===!0?"nube":void 0,g=new Set([...Object.keys(l.datos),...Object.keys(u.datos)]);for(let b of g){if(b==="id")continue;let x=l.datos[b],$=u.datos[b];B(x)!==B($)&&o.push({...d,clave:`${t}|${i}|${b}`,tipo:"campo",campo:b,aqui:x,nube:$,datos:l.datos,confirmadoEn:f})}}}return o}function Ma(e,a){let o={};for(let t of e)o[t.clave]=t.tipo==="solo-aqui"?"aqui":t.tipo==="solo-nube"?"nube":t.tipo==="borrada-en-la-nube"?"aqui":t.confirmadoEn??(a==="subir"?"aqui":"nube");return o}function Po(e,a,o,t,n){let s=d=>t[d.clave]??Ma([d],"subir")[d.clave],r=new Map;for(let d of o){let f=`${d.tabla}|${d.id}`;r.set(f,[...r.get(f)??[],d])}let i=d=>({datos:d.datos,tocado:{...d.tocado,[z]:n},borradoEn:n}),l={};for(let d of V){let f=new Map((e[d]??[]).map($=>[$.datos.id,$])),g=new Map((a[d]??[]).map($=>[$.datos.id,$])),b=[...f.keys(),...[...g.keys()].filter($=>!f.has($))],x=[];for(let $ of b){let y=f.get($),M=g.get($),R=r.get(`${d}|${$}`)??[],C=R.find(F=>F.tipo!=="campo");if(y&&!M)x.push(C&&s(C)==="nube"?i(y):y);else if(!y&&M)M.borradoEn?x.push(M):x.push(C&&s(C)==="aqui"?i(M):M);else if(y&&M&&M.borradoEn)x.push(C&&s(C)==="nube"?M:{datos:y.datos,tocado:{...M.tocado,...y.tocado,[z]:n},borradoEn:null});else if(y&&M){let F={...y.datos},De={...M.tocado,...y.tocado};for(let A of R)A.tipo!=="campo"||!A.campo||(s(A)==="nube"&&(M.datos[A.campo]===void 0?delete F[A.campo]:F[A.campo]=M.datos[A.campo]),De[A.campo]=n);x.push({datos:F,tocado:De,borradoEn:null})}}l[d]=x}let u=l.escenario[0];if(u){let d={...u.datos};for(let[f,g]of[["ordenMetas","metas"],["ordenObligaciones","obligaciones"]]){let b=l[g].filter($=>!$.borradoEn).map($=>$.datos.id),x=Array.isArray(d[f])?d[f]:[];d[f]=[...x.filter($=>b.includes($)),...b.filter($=>!x.includes($))]}l.escenario[0]={...u,datos:d}}return l}var Ge="__borrado",Ve=new Intl.NumberFormat("es-CO"),Nt={obligaciones:"obligaciones",abonos:"abonos a metas",gastos:"gastos",cambios:"cambios de valor",valor:"valor",nombre:"nombre",grupo:"grupo",abonado:"ya pagado antes",alAhorro:"al ahorro",monto:"monto",fecha:"fecha",ingresoEsperado:"ingreso esperado",fechaPrimerPago:"fecha del primer pago",marcados:"soportes marcados",clase:"compra o deuda",ordenMetas:"orden (prioridad) de las metas",ordenObligaciones:"orden de las obligaciones",desdePago:"empieza en el pago",maximoPorPago:"m\xE1ximo por pago",enCuotas:"reunirla en N pagos",antesDelPago:"la quiero antes del pago",colchonBase:"otros / ahorro por pago",colchonMinimo:"del ahorro no bajar de",colchonElastico:"usar el ahorro para adelantar metas",sobranteAMetas:"usar lo que sobra del mes en las metas siguientes",cambiosColchon:"cambios del ahorro",cambiosIngreso:"cambios del pago",diasOptimista:"d\xEDas entre pagos, si son puntuales",diasPesimista:"d\xEDas entre pagos, si se atrasan",tipo:"c\xF3mo se calcula",modo:"cada cu\xE1ndo",montoEsperado:"monto esperado",periodo:"periodo",propuesto:"sin confirmar",compra:"ya la compraste",nota:"nota",link:"enlace",cuentaDeCobroId:"cuenta de cobro",ingresoId:"pago"};function Qe(e,a){switch(e.tabla){case"metas":{let o=a.metas.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la meta \xAB${o}\xBB`:"una meta que ya no est\xE1"}case"obligaciones":{let o=a.obligaciones.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la obligaci\xF3n \xAB${o}\xBB`:"una obligaci\xF3n que ya no est\xE1"}case"cuentas":{let o=a.cuentas.find(t=>t.id===e.id);return o?`la cuenta de cobro de ${o.periodo}`:"una cuenta de cobro que ya no est\xE1"}case"ingresos":{let o=a.ingresos.find(t=>t.id===e.id);return o?`el pago del ${o.fecha} (${Ve.format(o.monto)})`:"un pago que ya no est\xE1"}case"repartos":{let o=a.repartos.find(n=>n.id===e.id),t=o?a.ingresos.find(n=>n.id===o.ingresoId):void 0;return t?`el reparto del pago del ${t.fecha} (${Ve.format(t.monto)})`:"un reparto de un pago que ya no est\xE1"}case"escenario":return"el escenario";case"soportes":return`el mes ${U(e.id)}`}}function Ue(e){return e===Ge?"borrado":Nt[e]??e}function ve(e,a){return e===Ge?a?"borrada":"sin borrar":Be(a)}function Be(e){if(e==null||e==="")return"\u2014";if(typeof e=="number")return Ve.format(e);if(typeof e=="boolean")return e?"s\xED":"no";if(typeof e=="string")return e;if(Array.isArray(e))return e.length===0?"nada":e.map(Be).join(" \xB7 ");if(typeof e=="object"){let a=e;if(typeof a.nombre=="string"&&typeof a.monto=="number")return`${a.nombre} ${Ve.format(a.monto)}`;if(typeof a.desdePago=="number"&&"valor"in a)return`desde el pago ${a.desdePago}: ${Be(a.valor)}`;let o=Object.keys(a).sort().filter(t=>a[t]!==void 0).map(t=>`${Ue(t)}: ${Be(a[t])}`);return o.length?o.join(", "):"\u2014"}return String(e)}var $e=[{id:"inicio",rotulo:"Inicio",icono:"\u{1F3E0}",paneles:["inicio","radicacion"]},{id:"calendario",rotulo:"Calendario",icono:"\u{1F5D3}\uFE0F",paneles:["vista"]},{id:"metas",rotulo:"Metas",icono:"\u{1F3AF}",paneles:["metas","proyeccion"]},{id:"registrar",rotulo:"Registrar",icono:"\u{1F4B5}",paneles:["cuentas","real"]},{id:"ajustes",rotulo:"Ajustes",icono:"\u2699\uFE0F",paneles:["escenario","obligaciones","nube"]}],_t="inicio";function Ro(e){return $e.find(a=>a.paneles.includes(e))?.id??null}function Ye(e){return $e.some(a=>a.id===e)?e:_t}var Co=new Intl.NumberFormat("es-CO"),Da=e=>`$${Co.format(Math.round(e))}`;function Ao(e,a,o){let t=[];return t.push(`${e.clase==="deuda"?"\u26A0\uFE0F ":""}${e.nombre.trim()||"(sin nombre)"}`),t.push(Da(e.valor)),e.compra?t.push("ya la compraste"):a?.yaEstabaPagada?t.push("ya est\xE1 pagada"):o?t.push(o):t.push("sin fecha todav\xEDa"),t.join(" \xB7 ")}function qo(e,a){let o=e.tipo==="porcentaje"?`${kt(e.valor*100)} %${a?` = ${Da(a)}`:""}`:Da(e.valor),t=e.modo==="cada_pago"?"cada pago":e.modo==="puntual"?"puntual":e.modo==="primer_pago"?"solo el primero":String(e.modo),n=[e.nombre.trim()||"(sin nombre)",o,t];return(e.cambios?.length??0)>0&&n.push(`${e.cambios.length} cambio${e.cambios.length===1?"":"s"}`),n.join(" \xB7 ")}function kt(e){return Number.isInteger(e)?String(e):Co.format(Math.round(e*10)/10)}function Io(e,a){let o=new Map(a.map(s=>[s.metaId,s])),t=e.filter(s=>!s.compra&&!o.get(s.id)?.yaEstabaPagada&&s.valor>0),n=null;for(let s of t){let r=o.get(s.id)?.pagoFin??null;r!==null&&(!n||r<n.pagoFin)&&(n={meta:s,pagoFin:r})}return n||(t.length>0?{meta:t[0],pagoFin:null}:null)}function Ea(e,a){return e.compra||e.valor<=0?1:Math.max(0,Math.min(1,a/e.valor))}function wo(e){let a=e.find(n=>n.numero===2)??e[0];if(!a||a.ingreso<=0)return null;let o=a.obligaciones.reduce((n,s)=>n+s.monto,0),t=a.abonos.reduce((n,s)=>n+s.monto,0);return{numero:a.numero,ingreso:a.ingreso,obligaciones:o,metas:t,ahorro:a.aColchon+a.sobrante}}function Lo(e,a){let o=2*Math.PI*a,t=e.reduce((s,r)=>s+Math.max(0,r),0),n=0;return e.map(s=>{let r=t>0?Math.max(0,s)/t*o:0,i={largo:r,desde:n};return n+=r,i})}function To(e,a){if(a.campo===Ge)return{ok:!1,motivo:"Un borrado no se puede deshacer desde aqu\xED: vuelve a crear esa fila."};if(a.campo==="id")return{ok:!1,motivo:"El identificador de una fila no se cambia."};let o=Ht(e,a);if(!o)return{ok:!1,motivo:"Eso ya no est\xE1 en este aparato."};let t=zt(a);return a.valor===void 0?delete o[t]:o[t]=a.valor,{ok:!0}}function zt(e){return e.tabla==="soportes"?e.id:e.campo}function Ht(e,a){let o=t=>t.find(n=>n.id===a.id)??null;switch(a.tabla){case"escenario":return e.escenario;case"metas":return o(e.metas);case"obligaciones":return o(e.obligaciones);case"cuentas":return o(e.cuentas);case"ingresos":return o(e.ingresos);case"repartos":return o(e.repartos);case"soportes":return a.campo==="nota"?e.notasDelMes??={}:a.campo!=="marcados"?null:e.soportesMarcados;default:return null}}var Bt=new Intl.NumberFormat("es-CO"),m=e=>`$${Bt.format(Math.round(e))}`,c,D=null;function re(e=new Date){let a=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${a}-${o}`}function p(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var h=new Map;function _o(e){if(!(e instanceof HTMLInputElement)&&!(e instanceof HTMLSelectElement))return null;let a=[e.id&&`#${e.id}`,e.dataset.accion&&`[data-accion="${e.dataset.accion}"]`,e.dataset.id&&`[data-id="${e.dataset.id}"]`,e.dataset.campo&&`[data-campo="${e.dataset.campo}"]`,e.dataset.tipo&&`[data-tipo="${e.dataset.tipo}"]`,e.dataset.i!==void 0&&`[data-i="${e.dataset.i}"]`].filter(Boolean);return a.length>0?a.join(""):null}var Je=null,xa=null,Me=!1,se=!1;var Ke=null,N=null,Vt=6,We=!1;function Gt(e){let o=window.innerHeight;e<90?window.scrollBy({top:-Math.max(6,(90-e)/3),behavior:"instant"}):e>o-90&&window.scrollBy({top:Math.max(6,(e-(o-90))/3),behavior:"instant"})}function ko(e,a){return document.elementFromPoint(e,a)?.closest?.("tr[data-fila]")??null}function Qt(e){for(let a of document.querySelectorAll(".destino"))a.classList.remove("destino");e&&Number(e.dataset.fila)!==N?.desde&&e.classList.add("destino")}function zo(){N?.fila.classList.remove("arrastrando");for(let e of document.querySelectorAll(".destino"))e.classList.remove("destino");N=null}document.addEventListener("pointerdown",e=>{let a=e.target?.closest?.(".asa"),o=a?.closest("tr[data-fila]");!a||!o||(N={desde:Number(o.dataset.fila),fila:o,movido:!1,y0:e.clientY},o.classList.add("arrastrando"),a.setPointerCapture?.(e.pointerId),e.preventDefault())});document.addEventListener("pointermove",e=>{N&&(!N.movido&&Math.abs(e.clientY-N.y0)<Vt||(N.movido=!0,e.preventDefault(),Gt(e.clientY),Qt(ko(e.clientX,e.clientY))))});document.addEventListener("pointerup",e=>{if(!N)return;let{desde:a,movido:o}=N,t=ko(e.clientX,e.clientY);if(zo(),!o||!t)return;We=!0,setTimeout(()=>{We=!1},0);let n=Number(t.dataset.fila);if(!Number.isInteger(n)||n===a)return;let[s]=c.metas.splice(a,1);c.metas.splice(n,0,s),D={texto:`\xAB${s.nombre}\xBB qued\xF3 en la posici\xF3n ${n+1}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron.`,malo:!1},E()});document.addEventListener("pointercancel",()=>{N&&(zo(),S())});document.addEventListener("mousedown",e=>{let a=e.target;Me=a?.closest("button[data-accion]")!==null&&a?.closest("button[data-accion]")!==void 0,Je=_o(a?.closest("input, select")??null),xa=a?.closest?.("[data-panel]")?.dataset.panel??null},!0);document.addEventListener("mouseup",()=>{setTimeout(()=>{Me=!1,xa=null,se&&(se=!1,Pa())},0)},!0);function Ut(e,a){let o=Je!==null,t=Je??e;if(Je=null,!t)return;let n=document.querySelector(t);if(n&&(n.focus(),!o&&a!==null&&typeof n.setSelectionRange=="function"))try{n.setSelectionRange(a,a)}catch{}}function _(){Ho()||Pa()}function E(){Ho()||S()}function Ho(){let e=te(c);return e&&(D={texto:`No pude guardar: ${e}`,malo:!0}),Me?(se=!0,!0):!1}function w(){let e=c.escenario;return{desde:new Date(`${e.fechaPrimerPago}T12:00:00`),diasOptimista:e.diasOptimista,diasPesimista:e.diasPesimista}}function Yt(){let e=0,a=[...c.ingresos].sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o=0;o<a.length;o++)e=Math.max(e,we(a[o],a.slice(0,o)));return e+1}function Bo(){let e=c.escenario;return{nombre:e.nombre,desdePago:Yt(),ingresoEsperado:e.ingresoEsperado,cambiosIngreso:e.cambiosIngreso,obligaciones:c.obligaciones,colchon:{nombre:"Otros / Ahorro",base:e.colchonBase,minimo:e.colchonMinimo,elastico:e.colchonElastico,sobranteAMetas:e.sobranteAMetas!==!1,cambios:e.cambiosColchon},metas:ra(c.metas,c.repartos)}}function Oo(e){return`${((e==="ahorro"?c.escenario.cambiosColchon:c.escenario.cambiosIngreso)??[]).map((t,n)=>{let s=k(q(Math.max(1,t.desdePago),w()).optimista);return`<div class="cambio">
      <span class="rango">desde el</span>
      <input type="number" min="1" step="1" value="${t.desdePago}" class="corto"
        data-accion="cambio-escenario" data-cual="${e}" data-i="${n}" data-campo="desdePago" />
      <input type="text" inputmode="numeric" data-dinero value="${I(t.valor)}"
        class="corto-dinero" data-accion="cambio-escenario" data-cual="${e}" data-i="${n}" data-campo="valor" />
      <span class="rango">${p(s)}</span>
      <button class="icono" data-accion="borrar-cambio-escenario" data-cual="${e}" data-i="${n}" title="Quitar">\u2715</button>
    </div>`}).join("")}<button class="chico" data-accion="nuevo-cambio-escenario" data-cual="${e}">+ cambio</button>`}function Jt(){let e=c.escenario;return`
  <section class="panel">
    <h2>Escenario <span class="sufijo">\u2014 el supuesto sobre lo que va a entrar</span></h2>
    <div class="campos">
      <div class="campo">
        <label for="ingreso">Lo que espero por pago</label>
        <input id="ingreso" type="text" inputmode="numeric" data-dinero
               value="${I(e.ingresoEsperado)}"
               data-accion="escenario" data-campo="ingresoEsperado" />
      </div>
      <div class="campo">
        <label>El pago cambia</label>
        ${Oo("ingreso")}
      </div>
      <div class="campo">
        <label for="colchon">Otros / Ahorro por pago</label>
        <input id="colchon" type="text" inputmode="numeric" data-dinero
               value="${I(e.colchonBase)}"
               data-accion="escenario" data-campo="colchonBase" />
      </div>
      <div class="campo">
        <label for="minimo">Del ahorro no bajar de</label>
        <input id="minimo" type="text" inputmode="numeric" data-dinero
               value="${I(e.colchonMinimo)}"
               title="Solo aplica con el interruptor de abajo encendido"
               data-accion="escenario" data-campo="colchonMinimo" />
      </div>
      <div class="campo">
        <label>El ahorro cambia</label>
        ${Oo("ahorro")}
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
        <input type="checkbox" data-accion="sobrante-a-metas" ${e.sobranteAMetas!==!1?"checked":""} />
        Usar lo que sobra del mes en las metas siguientes
      </label>
      ${e.sobranteAMetas!==!1?`\u2014 lo que ninguna meta puede recibir adelanta las que tienen \xABempieza en\xBB un mes posterior y,
           si a\xFAn sobra, pasa por encima del tope. El ahorro por pago no se toca.`:"\u2014 apagado, lo que sobra se queda guardado."}
    </p>
    <p class="nota">
      <label class="interruptor">
        <input type="checkbox" data-accion="elastico" ${e.colchonElastico?"checked":""} />
        Usar el ahorro para adelantar metas
      </label>
      \u2014 apagado, el ahorro no se toca y las fechas son las conservadoras.
      ${e.colchonElastico?`<br /><span class="rango">Encendido: si recortando el ahorro se CIERRA una meta, se
           recorta \u2014 pero nunca por debajo de ${m(e.colchonMinimo)}. Solo para cerrar, nunca
           para abonar a medias.</span>`:""}
    </p>
    ${e.diasPesimista>e.diasOptimista?`<p class="nota rango">
      Los dos campos de d\xEDas son <strong>de pago a pago</strong>, no un retraso de una vez.
      Con ${e.diasPesimista} d\xEDas, el pago ${oa(w())?10:12} caer\xEDa
      ${(()=>{let a=w();return`<strong>${Math.round(11*(e.diasPesimista-e.diasOptimista)/30)} meses</strong> m\xE1s tarde que si fueran puntuales`})()}.
    </p>`:""}
  </section>`}var Xt={cada_pago:"Cada pago",primer_pago:"Solo el primer pago",puntual:"Puntual: cuando yo la marque"},Vo={siempre:"asumo que la pago siempre",cada_dos_pagos:"asumo un pago s\xED y otro no",nunca:"asumo que no la pago"};function Go(e,a,o){let t=e??1,n=k(q(t,w()).optimista);return`<input type="number" min="1" step="1" value="${t}" class="corto"
             data-accion="${a}" data-id="${o}" data-campo="desdePago" />
          <span class="rango mes-de-pago">${t<=1?"desde el primero":p(n)}</span>`}function Ze(){let e=c.cuentas.filter(a=>a.montoEsperado>0);if(e.length>0){let a=e.reduce((o,t)=>t.periodo.localeCompare(o.periodo)>0?t:o);return{monto:a.montoEsperado,de:a.periodo,esReal:!0}}return{monto:c.escenario.ingresoEsperado,de:"lo que esperas por pago",esReal:!1}}function Wt(e){let a=Ze();if(a.monto<=0)return'<span class="rango">\u2014</span>';let o=e.tipo==="porcentaje"?le(a.monto,e.valor):e.valor;return`<span class="calculado">${m(o)}</span>`}function Kt(e){let a=e.cambios??[];if(a.length===0)return"";let o=e.tipo==="porcentaje",t=(n,s)=>{let r=k(q(Math.max(1,n.desdePago),w()).optimista);return`<span class="cambio">
      <span class="rango">desde el pago</span>
      <input type="number" min="1" step="1" value="${n.desdePago}" class="corto"
        data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="desdePago" />
      <span class="rango">(${p(r)}) pasa a</span>
      ${o?`<input type="number" min="0" max="100" step="0.5" value="${n.valor*100}" class="corto"
             data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" /><span class="rango">%</span>`:`<input type="text" inputmode="numeric" data-dinero value="${I(n.valor)}"
             class="corto-dinero" data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" />`}
      <button class="icono" data-accion="borrar-cambio" data-id="${e.id}" data-i="${s}"
        title="Quitar este cambio">\u2715</button>
    </span>`};return`<tr class="fila-cambios" data-hija-de="${e.id}">
    <td colspan="9"><span class="rango">${p(e.nombre)} \xB7</span>
      ${a.map(t).join("")}</td>
  </tr>`}function Qo(e,a,o){let t=a?.trim(),n=ba(o);return!t&&!n?"":`<tr class="fila-nota" data-hija-de="${e}">
    <td colspan="9">
      ${t?`<span class="texto-nota">\u{1F4DD} ${p(t)}</span>`:""}
      ${n?`${t?"<br />":""}<a href="${p(n)}" target="_blank" rel="noopener noreferrer"
        data-enlace>\u{1F517} ${p(new URL(n).hostname.replace(/^www\./,""))}</a>`:""}
    </td>
  </tr>`}function Zt(e){let a=e.modo==="puntual",o=Ze(),t=o.monto>0&&e.tipo==="porcentaje"?le(o.monto,e.valor):null;return`
  <tr data-id-fila="${e.id}" data-resumen="${p(qo(e,t)+(e.nota?.trim()?" \xB7 \u{1F4DD}":""))}"
      class="${e.id===Ke?"abierta":""}">
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
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`:`<input type="text" inputmode="numeric" data-dinero value="${I(e.valor)}"
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`}
      <button class="chico" data-accion="nuevo-cambio" data-id="${e.id}"
        title="A partir de cierto pago, esto pasa a valer otra cosa">+ cambio</button>
    </td>
    <td class="num">${Wt(e)}</td>
    <td class="desde">${Go(e.desdePago,"oblig",e.id)}</td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="modo">
        ${Object.entries(Xt).map(([n,s])=>`<option value="${n}" ${e.modo===n?"selected":""}>${s}</option>`).join("")}
      </select>
    </td>
    <td>
      ${a?`<select data-accion="oblig" data-id="${e.id}" data-campo="supuesto">
        ${Object.entries(Vo).map(([n,s])=>`<option value="${n}" ${(e.supuesto??"siempre")===n?"selected":""}>${s}</option>`).join("")}
      </select>`:'<span class="rango">\u2014</span>'}
    </td>
    <td class="num">
      <button class="icono ${e.nota?.trim()?"con-nota":""}" data-accion="nota-oblig" data-id="${e.id}"
        title="${e.nota?.trim()?"Editar la nota":"Escribir una nota"}">\u{1F4DD}</button>
      <button class="icono" data-accion="borrar-oblig" data-id="${e.id}" title="Quitar">\u2715</button></td>
  </tr>`}function ya(e,a){return ae(e,a,c.obligaciones,{nombre:"",base:0,minimo:0,elastico:!1},[],new Map,0).obligaciones.reduce((t,n)=>t+n.monto,0)}function en(){let e=Ze();if(e.monto<=0)return"";let a=ya(1,e.monto),o=ya(2,e.monto),t=(s,r)=>`
    <div><span class="rotulo">${s}</span>
      <span class="valor">${m(e.monto-r)}</span>
      <span class="rotulo">libre para metas \xB7 se van ${m(r)}</span></div>`,n=e.esReal?`Calculado sobre <strong>${p(e.de)}</strong>: ${m(e.monto)}, que es lo que
       esperas cobrar de verdad. Si no hubiera cuenta de cobro registrada, saldr\xEDa del
       escenario de arriba.`:`Calculado sobre el escenario de arriba (${m(e.monto)}), que es una <em>suposici\xF3n</em>.
       En cuanto registres una cuenta de cobro, esta cifra sale de ah\xED.`;return`<div class="resumen resumen-oblig">
    ${t("En el primer pago",a)}
    ${a!==o?t("En los siguientes",o):""}
  </div>
  <p class="nota ${e.esReal?"":"aviso"}">${n}</p>`}function an(){let e=c.obligaciones.filter(a=>a.modo==="puntual");return c.obligaciones.length===0?`
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
        <tbody>${c.obligaciones.map(a=>Zt(a)+Kt(a)+Qo(a.id,a.nota)).join("")}</tbody>
      </table>
    </div>
    ${en()}
    <p class="nota"><button data-accion="nueva-oblig">+ Agregar obligaci\xF3n</button>
      ${Yo("obligaciones")}
      ${Uo("obligaciones")}</p>
    ${e.length?`<p class="nota aviso">
      Las puntuales no se pueden adivinar. Para calcular las fechas
      ${e.map(a=>`<strong>${p(a.nombre)}</strong>: ${Vo[a.supuesto??"siempre"]}`).join(" \xB7 ")}.
    </p>`:""}
  </section>`}function on(e){if(!e.compra)return`<button data-accion="comprada" data-id="${e.id}">Ya la compr\xE9</button>`;let a=e.compra.precioReal-e.valor;return`<span class="completa">${p(U(e.compra.mes))}</span>
    <span class="rango">${m(e.compra.precioReal)}${a===0?"":a<0?` \xB7 ${m(-a)} menos`:` \xB7 ${m(a)} m\xE1s`}</span>
    <button class="icono" data-accion="no-comprada" data-id="${e.id}" title="No la compr\xE9">\u2715</button>`}function tn(e){let a=me(c.metas,c.repartos).get(e.id),o=a.previo>0&&a.real>0&&Math.abs(a.previo-a.real)<=Math.max(1e3,a.real*.05),t=`<input type="text" inputmode="numeric" data-dinero value="${I(a.previo)}"
      title="Lo que ya le hab\xEDas abonado a esta meta ANTES de empezar a usar el programa"
      data-accion="meta" data-id="${e.id}" data-campo="abonado" />`;return a.real===0?t:`${t}
    <span class="rango">+ ${m(a.real)} de lo real</span>
    <span class="${a.falta===0?"completa":""}">= ${m(a.total)}</span>
    ${o?`<span class="aviso">\u26A0\uFE0F ${m(a.previo)} escrito a mano y ${m(a.real)}
      registrado: \xBFes el mismo dinero?
      <button class="icono" data-accion="quitar-previo" data-id="${e.id}"
        title="S\xED, dejar solo lo registrado">\u2713</button></span>`:""}`}function Uo(e){return`<span class="solo-telefono plegado-todo">
    <button class="chico" data-accion="desplegar-todo" data-lista="${e}">Desplegar todo</button>
    <button class="chico" data-accion="plegar-todo" data-lista="${e}">Plegar todo</button>
  </span>`}function Yo(e){if((e==="metas"?c.metas.length:c.obligaciones.length)<2)return"";let o=e==="metas"?' title="Ojo: en las metas el orden es la prioridad de pago, as\xED que esto cambia el plan"':"";return`&nbsp; <span class="rango">Ordenar por</span>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="nombre"${o}>nombre</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="valor"${o}>valor</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="grupo"${o}>grupo</button>`}function nn(e,a,o,t,n){return`
  <tr data-fila="${a}" data-id-fila="${e.id}"
      data-resumen="${p(Ao(e,n,t)+(e.nota?.trim()||e.link?" \xB7 \u{1F4DD}":""))}"
      class="${e.clase==="deuda"?"es-deuda":""} ${e.id===Ke?"abierta":""}">
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
      </select>
      <!-- Aqui y no en la columna de botones: alli se apilaban y la tabla se pasaba del panel. -->
      <button class="icono ${e.nota?.trim()?"con-nota":""}" data-accion="nota-meta" data-id="${e.id}"
        title="${e.nota?.trim()?"Editar la nota":"Escribir una nota"}">\u{1F4DD}</button>
      <button class="icono ${e.link?.trim()?"con-nota":""}" data-accion="link-meta" data-id="${e.id}"
        title="${e.link?.trim()?"Cambiar el enlace":"Poner el enlace de d\xF3nde comprarla"}">\u{1F517}</button></td>
    <td class="num"><input type="text" inputmode="numeric" data-dinero value="${I(e.valor)}"
        data-accion="meta" data-id="${e.id}" data-campo="valor" /></td>
    <td><input value="${p(e.grupo??"")}" placeholder="ninguno"
        data-accion="meta" data-id="${e.id}" data-campo="grupo" /></td>
    <td class="desde">${Go(e.desdePago,"meta",e.id)}
      <div class="plazo"><span class="rango">la quiero antes del</span>
        <input type="number" min="0" step="1" class="corto" value="${e.antesDelPago??""}"
          placeholder="\u2014" title="Solo para avisarte: no cambia el orden de pago"
          data-accion="meta" data-id="${e.id}" data-campo="antesDelPago" />
        ${e.antesDelPago&&e.antesDelPago>0?`<span class="rango">${p(k(q(e.antesDelPago,w()).optimista))}</span>`:""}</div>
    </td>
    <td class="num ritmo">
      <input type="text" inputmode="numeric" data-dinero
        value="${e.maximoPorPago?I(e.maximoPorPago):""}" placeholder="sin tope"
        title="M\xE1ximo que puede recibir en un pago"
        data-accion="meta" data-id="${e.id}" data-campo="maximoPorPago" />
      <span class="rango">o en <input type="number" min="0" step="1" class="corto"
        value="${e.enCuotas??""}" placeholder="\u2014"
        title="Reunirla en tantos pagos: la cuota la calculo yo"
        data-accion="meta" data-id="${e.id}" data-campo="enCuotas" /> pagos
        ${e.enCuotas&&e.enCuotas>0&&!e.maximoPorPago?`\xB7 ${m(Math.ceil(e.valor/Math.round(e.enCuotas)))} c/u`:""}</span>
    </td>
    <td class="num pagado">${tn(e)}</td>
    <td class="compra">${on(e)}</td>
    <td class="num">
      <button class="icono" data-accion="duplicar-meta" data-id="${e.id}" title="Duplicar">\u29C9</button>
      <button class="icono" data-accion="borrar-meta" data-id="${e.id}" title="Quitar">\u2715</button>
    </td>
  </tr>
  ${Qo(e.id,e.nota,e.link)}`}function sn(e){let a=w(),o=new Map((e?.metas??[]).map(n=>[n.metaId,{res:n,cuando:n.pagoFin!==null?ue(q(n.pagoFin,a)):null}]));if(c.metas.length===0)return`
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
        <tbody>${c.metas.map((n,s)=>{let r=o.get(n.id);return nn(n,s,c.metas.length,r?.cuando??null,r?.res??null)}).join("")}</tbody>
      </table>
    </div>
    <p class="nota">
      <button data-accion="nueva-meta">+ Agregar meta</button>
      ${Yo("metas")}
      ${Uo("metas")}
      &nbsp; Suma de todas: <strong>${m(t)}</strong>
      ${(()=>{let n=Va(c.metas,c.repartos);return n===0?"":` &nbsp; Llevas pagado: <strong class="completa">${m(n)}</strong>
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
  </section>`}var Jo={tranquilo:"",pronto:"aviso",hoy:"urgente",vencido:"malo"};function rn(){let e=new Date,a=c.soportesMarcados[Oe(e)]??[],o=ua(e,a),t=Jo[o.urgencia],n=r=>{let i=a.includes(r.id);return`<li class="soporte ${i?"listo":""}">
      <label class="interruptor">
        <input type="checkbox" data-accion="soporte" data-id="${r.id}" ${i?"checked":""} />
        <span>${p(r.nombre)}${r.obligatorioExplicito?' <strong class="pendiente">OBLIGATORIO</strong>':""}</span>
      </label>
      ${r.detalle?`<p class="nota">${p(r.detalle)}</p>`:""}
    </li>`},s=da.filter(r=>r.frecuencia!=="cada_mes");return`
  <section class="panel radicacion ${t}">
    <h2><span class="etiqueta real">Real</span> Radicar la cuenta de cobro
      <span class="sufijo">\u2014 qu\xE9 d\xEDa y con qu\xE9 papeles</span></h2>
    <p class="titular ${t}">${p(o.titular)}</p>
    <p class="nota">${p(Ka(o.limite))}
      ${o.limite.usoUltimoDiaDelMes?`<br /><span class="rango">${p(Xa)}</span>`:""}
    </p>
    <ul class="soportes">${Te().map(n).join("")}</ul>
    <p class="nota">
      Ya entregados una sola vez y no hay que repetirlos:
      ${s.filter(r=>r.frecuencia==="una_sola_vez").map(r=>p(r.nombre)).join(" \xB7 ")}.
      La constancia firmada por el paciente es solo para personal asistencial.
    </p>
  </section>`}function cn(){let e=de(c.cuentas,c.ingresos),a=Ia(e);return`
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
              <td class="num"><input type="text" inputmode="numeric" data-dinero value="${I(o.cuenta.montoEsperado)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="montoEsperado" /></td>
              <td class="num">${m(o.recibido)}</td>
              <td class="num ${o.pendiente>0?"pendiente":"completa"}">
                ${o.pendiente>0?m(o.pendiente):"\u2014"}</td>
              <td class="rango">${p(wa(o).split(": ").slice(1).join(": "))}</td>
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
        ${a.length?` &nbsp; <span class="pendiente">Te deben en total ${m(Ce(e))}</span>`:""}</p>`}
  </section>`}function jo(e,a,o,t,n,s,r,i,l=""){let u=w(),d=o===null||t===null?"\u2014":`pago ${o}${t!==o?` - ${t}`:""}${n===null?"":` (${n})`}`,f=t!==null?q(t,u):null,g=t!==null?ee(q(t,u)):i?"ya la ten\xEDas pagada":"sin terminar",b=r?`<span class="completa">${m(a)}</span>`:`<span class="pendiente">${m(s)} de ${m(a)}</span>`;return`<tr class="${l}">
    <td class="meta-nombre">${p(e)}</td>
    <td class="num">${b}</td>
    <td class="rango">${d}</td>
    <td class="cuando">${f?`<span class="fecha-larga-meta">${p(g)}</span><span class="fecha-corta-meta">${p(ue(f))}</span>`:p(g)}</td>
  </tr>`}function ln(){if(c.metas.length===0)return null;try{return ge(Bo())}catch{return null}}function dn(e){if(c.metas.length===0)return`<section class="panel simulado">
      <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
      <div class="vacio">Agrega tus metas arriba y aqu\xED aparecen las fechas.</div>
    </section>`;if(!e)return`<section class="panel simulado"><h2>Simulaci\xF3n</h2>
      <p class="nota aviso">No pude calcular la proyecci\xF3n con estos datos.</p></section>`;let a=new Map(Ga(e).map(u=>[u.grupo,u])),o=[],t=new Set,n=(u,d="")=>jo(u.nombre,u.valor,u.pagoInicio,u.pagoFin,u.cantidadPagos,u.totalAbonado,u.completada,u.yaEstabaPagada,d);for(let u of e.metas){if(!u.grupo){o.push(n(u));continue}if(t.has(u.grupo))continue;t.add(u.grupo);let d=a.get(u.grupo);o.push(jo(d.grupo,d.valor,d.pagoInicio,d.pagoFin,null,d.totalAbonado,d.completado,d.yaEstabaPagado,"grupo"));for(let f of e.metas)f.grupo===u.grupo&&o.push(n(f,"componente"))}let s=e.pagos.length,r=c.escenario,i=w(),l=ee(q(s,i));return`
  <section class="panel simulado">
    <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
    <div class="resumen">
      <div><span class="valor">${e.totalPagos}</span><span class="rotulo">pagos hasta terminarlo todo</span></div>
      <div><span class="valor cuando">${p(l)}</span><span class="rotulo">termina la \xFAltima meta</span></div>
      <div><span class="valor">${m(e.ahorroFinal)}</span><span class="rotulo">ahorro acumulado al final</span></div>
    </div>
    <div class="tabla-ancha">
      <table class="compacta">
        <thead><tr><th>Meta</th><th class="num">Abonado</th><th>Pagos</th><th>Cu\xE1ndo</th></tr></thead>
        <tbody>${o.join("")}</tbody>
      </table>
    </div>
    <p class="nota aviso">
      Esto es una simulaci\xF3n, no un hecho: supone que te entran ${m(r.ingresoEsperado)} por pago.
      ${oa(i)?`Las fechas son de <strong>una sola posibilidad</strong>: pagos puntuales cada
           ${r.diasOptimista} d\xEDas, sin contar atrasos. Sube \xABd\xEDas si se atrasan\xBB
           por encima de ${r.diasOptimista} y vuelven a salir como rango.`:`El \xABcu\xE1ndo\xBB va de puntual (cada ${r.diasOptimista} d\xEDas) a atrasado (cada ${r.diasPesimista}).`}
      ${e.incompleta?"<br /><strong>Con ese ingreso no alcanza a terminar.</strong>":""}
    </p>
    ${pn(e)}
    ${un()}
  </section>`}function un(){let e=Ce(de(c.cuentas,c.ingresos));if(e<=0)return"";let a=Ua(Bo(),e);if(!a)return"";let o=w(),t=n=>ee(q(Math.max(1,n),o));return`<p class="nota ${a.seAdelanta>0?"":"rango"}">
    Te deben <strong class="pendiente">${m(a.pendiente)}</strong>.
    ${a.seAdelanta>0?`Si te los pagaran de una vez, terminar\xEDas <strong>${a.seAdelanta}
         ${a.seAdelanta===1?"pago":"pagos"} antes</strong>: la \xFAltima meta pasar\xEDa de
         ${p(t(a.pagosAhora))} a ${p(t(a.pagosSiPagan))}.`:`Aunque te los pagaran de una vez, las fechas no se mover\xEDan \u2014 el ritmo lo marcan los
         topes por pago que pusiste arriba, no lo que entra.`}
    <br /><span class="rango">Esto es aparte: la proyecci\xF3n de arriba NO cuenta ese dinero
    hasta que lo registres como pago recibido.</span>
  </p>`}function pn(e){let a=Qa(e,c.metas);if(a.length===0)return"";let o=w(),t=s=>k(q(Math.max(1,s),o).optimista),n=s=>s.termina===null?`<li class="mal"><strong>${p(s.nombre)}</strong> la quer\xEDas para
        ${p(t(s.queria))} y <strong>no alcanza a terminar</strong> con este ingreso.</li>`:s.seRetrasa===0?`<li class="bien"><strong>${p(s.nombre)}</strong> la quer\xEDas para
        ${p(t(s.queria))} y llega ${s.termina===0?"ya pagada":`en ${p(t(s.termina))}`}.</li>`:`<li class="mal"><strong>${p(s.nombre)}</strong> la quer\xEDas para
      ${p(t(s.queria))} y va para <strong>${p(t(s.termina))}</strong>
      \u2014 ${s.seRetrasa} ${s.seRetrasa===1?"pago":"pagos"} tarde.
      S\xFAbela de posici\xF3n o dale m\xE1s por pago.</li>`;return`<div class="plazos">
    <h3 class="titulo-total">Lo que quer\xEDas para cierta fecha</h3>
    <ul>${a.map(n).join("")}</ul>
    <p class="nota rango">Esto solo avisa: el orden de pago lo pones t\xFA arriba, y el programa
      no lo cambia por su cuenta.</p>
  </div>`}function ce(e){let a=qe(c.metas),o=c.ingresos.filter(s=>s.fecha<=e.fecha&&s.id!==e.id).sort((s,r)=>s.fecha.localeCompare(r.fecha));for(let s of o){let r=c.repartos.find(i=>i.ingresoId===s.id);for(let i of r?.abonos??[])i.refId&&a.set(i.refId,Math.max(0,(a.get(i.refId)??0)-i.monto))}let t=e.cuentaDeCobroId?!o.some(s=>s.cuentaDeCobroId===e.cuentaDeCobroId):!0,n=c.escenario;return Oa(e,we(e,o),c.obligaciones,{nombre:"Otros / Ahorro",base:n.colchonBase,minimo:n.colchonMinimo,elastico:!1,sobranteAMetas:n.sobranteAMetas!==!1},c.metas,a,t)}function mn(){let e=na(c.ingresos,c.repartos);if(e.length===0)return`<section class="panel">
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
        <h3>${p(U(t.mes))}</h3>
        <span class="valor">${m(t.entro)}</span>
        <span class="rotulo">entr\xF3${t.deFuera>0?` \xB7 ${m(t.deFuera)} los pusiste t\xFA`:""}</span>
      </div>
      ${n.map(gn).join("")}
      ${n.length>1?`<div class="total-mes">
        <span>Ese mes: ${m(t.aObligaciones)} en obligaciones \xB7 ${m(t.aMetas)} a metas
        ${t.alAhorro>0?` \xB7 ${m(t.alAhorro)} guardado`:""}</span></div>`:""}
    </div>`}).join(""),o=Fa(c.repartos);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
      <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
    ${a}
    ${o.length>1?`
      <h3 class="titulo-total">En todo lo que llevas</h3>
      <div class="tabla-ancha"><table><tbody>
        ${o.map(t=>`<tr><td class="meta-nombre">${p(t.nombre)}</td>
          <td class="num">${m(t.monto)}</td></tr>`).join("")}
      </tbody></table></div>`:""}
    <p class="nota"><button data-accion="aporte-externo">+ Meter plata de otro lado</button>
      &nbsp; <span class="rango">Para cuando pones de tu bolsillo (Nequi, efectivo) y no viene del trabajo.</span></p>
  </section>`}function gn(e){let a=c.repartos.find(i=>i.ingresoId===e.id),o=c.cuentas.find(i=>i.id===e.cuentaDeCobroId),t=p(o?o.periodo:e.nota??"de otro lado");if(!a)return`<div class="ingreso-real">
      <div class="ingreso-cabecera">
        <span class="meta-nombre">${m(e.monto)}</span>
        <span class="rango">${p(e.fecha)} \xB7 ${t}</span>
      </div>
      <p class="nota aviso">No est\xE1 dicho en qu\xE9 se fue este dinero.
        <button data-accion="proponer" data-id="${e.id}">Calcularlo por m\xED</button></p>
    </div>`;let n=pe(a,e),s=(i,l,u)=>`
    <tr>
      <td class="meta-nombre">${p(i.nombre)}
        ${i.movidoDesdeGasto?'<span class="rango">\xB7 ven\xEDa de un gasto</span>':""}</td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${I(i.monto)}" class="corto-dinero"
        data-accion="editar-reparto" data-id="${a.id}" data-tipo="${l}" data-i="${u}" /></td>
      <td class="num">${i.movidoDesdeGasto?`<button class="icono" data-accion="abono-a-gasto" data-id="${a.id}" data-i="${u}"
             title="Devolverlo a gastos">\u21A9</button>`:""}</td>
    </tr>`,r=(i,l)=>`
    <tr class="gasto-suelto">
      <td><input value="${p(i.nombre)}" placeholder="\xBFen qu\xE9 se fue?"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${l}" data-campo="nombre" /></td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${I(i.monto)}" class="corto-dinero"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${l}" data-campo="monto" /></td>
      <td class="num"><button class="icono" data-accion="borrar-gasto"
        data-id="${a.id}" data-i="${l}" title="Quitar">\u2715</button></td>
    </tr>`;return`<div class="ingreso-real ${a.propuesto?"propuesto":""}">
    <div class="ingreso-cabecera">
      <span class="meta-nombre">${m(e.monto)}</span>
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
              value="${I(a.alAhorro)}" class="corto-dinero"
              data-accion="editar-reparto" data-id="${a.id}" data-tipo="ahorro" data-i="0" /></td>
            <td class="num"></td>
          </tr>
        </tbody>
      </table>
    </div>
    ${(()=>{let i=Ba(a,c.metas);return i.length===0?"":i.map(l=>`<p class="nota aviso">
        Tienes <strong>${p(l.gasto.nombre)}</strong> (${m(l.gasto.monto)}) anotado aqu\xED como
        un gasto cualquiera, pero <strong>${p(l.metaNombre)}</strong> es una de tus metas.
        <br />Si ese dinero se lo metiste a la meta, m\xE1rcalo: as\xED el programa sabe que ya llevas
        ${m(l.gasto.monto)} pagados y deja de calcular las fechas como si te faltara el precio
        entero. Si fue otra cosa que se llama parecido, d\xE9jalo como est\xE1.
        <br /><button data-accion="gasto-a-abono" data-id="${a.id}"
          data-meta="${l.metaId}" data-nombre="${p(l.gasto.nombre)}">S\xED, fue abono a ${p(l.metaNombre)}</button>
      </p>`).join("")})()}
    ${(()=>{let i=_a(a,ce(e));if(i.length===0)return"";let l=w(),u=g=>k(q(Math.max(1,g),l).optimista),d=we(e,c.ingresos.filter(g=>g.fecha<=e.fecha&&g.id!==e.id)),f=i.map(g=>{let b=ka(g,ra(c.metas,c.repartos),c.obligaciones,d),x=b.tipo==="ya-no-esta"?"ya no est\xE1 en tu lista":b.tipo==="ya-comprada"?"la marcaste como ya comprada":b.tipo==="ya-pagada"?"ya est\xE1 pagada":b.tipo==="empieza-despues"?`ahora empieza en el pago ${b.pago} (${u(b.pago)})`:b.tipo==="solo-el-primer-pago"?"es solo del primer pago":b.tipo==="puntual"?"es puntual, no de todos los pagos":b.tipo==="en-cero"?"est\xE1 en $0":"no sabr\xEDa decirte por qu\xE9";return`<li><strong>${p(g)}</strong> \u2014 ${p(x)}</li>`}).join("");return`<div class="nota aviso">
        Con la configuraci\xF3n de hoy, ${i.length===1?"esto ya no entrar\xEDa":"estas cosas ya no entrar\xEDan"}
        en este mes:
        <ul class="motivos">${f}</ul>
        Si el mes fue as\xED de verdad, d\xE9jalo como est\xE1; si no, dale a \xABVolver a calcular\xBB.
      </div>`})()}
    <p class="nota">
      <button data-accion="nuevo-gasto" data-id="${a.id}">+ Se fue en algo m\xE1s</button>
      <button data-accion="recalcular" data-id="${a.id}">Volver a calcular</button>
      <span class="rango">Lo primero es para lo que sali\xF3 de lo guardado \u2014prestado, comida,
      un tr\xE1mite\u2014. Lo segundo rehace el c\xE1lculo con las obligaciones de ahora
      <strong>y borra lo que hayas corregido a mano</strong>.</span>
    </p>
    ${n!==0?`<p class="nota ${n>0?"aviso":"malo"}">
      ${n>0?`Faltan <strong>${m(n)}</strong> por decir a d\xF3nde fueron.`:`Repartiste <strong>${m(-n)}</strong> m\xE1s de lo que entr\xF3.`}
      <button data-accion="cuadrar" data-id="${a.id}">Mandarlos a lo guardado</button>
    </p>`:""}
  </div>`}function Xo(e){let a=w(),o=e?Na(e.pagos,a.desde,a.diasOptimista,c.metas):[],t=na(c.ingresos,c.repartos),n=[...new Set([...o.map(r=>r.mes),...t.map(r=>r.mes)])],s=Ha(c.cuentas,c.ingresos,c.escenario.ingresoEsperado,n);return za(o,t,re().slice(0,7),s)}function bn(e){let a=Xo(e);if(a.length===0)return`<section class="panel">
      <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
      <div class="vacio">Agrega tus metas y registra un pago: aqu\xED se ve el calendario entero.</div>
    </section>`;hn(a);let o=sa(a);return`
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
      <span class="rango">&nbsp; ${a.length} ${a.length===1?"mes":"meses"} \xB7
        pulsa uno para ver en qu\xE9 se va</span>
    </p>
    <div class="linea-tiempo">${a.map(vn).join("")}</div>
    <p class="nota">
      <span class="etiqueta real">Real</span> lo que pas\xF3 \xB7
      <span class="etiqueta simulacion">Simulaci\xF3n</span> lo que pasar\xEDa si entra lo que supone
      el escenario. Nunca se mezclan en una sola cifra.
    </p>
  </section>`}function fn(e){let a=(n,s)=>n.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")===s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),o=c.obligaciones.find(n=>a(n.nombre,e));if(o)return`<span class="que-es obligacion">fijo${o.grupo?` \xB7 ${p(o.grupo)}`:""}</span>`;let t=c.metas.find(n=>a(n.nombre,e));return t?`<span class="que-es meta">meta${t.grupo?` \xB7 ${p(t.grupo)}`:""}</span>`:e==="Qued\xF3 guardado"||e==="Se guardar\xEDa"?"":'<span class="que-es suelto">de una vez</span>'}var ie=new Set,Fo=!1;function hn(e){if(Fo)return;Fo=!0;let a=e.findIndex(t=>t.estado==="actual"),o=a>=0?a:0;for(let t of e.slice(o,o+2))ie.add(t.mes)}function vn(e){let a=e.real!==null,o=e.real??e.simulado;if(!o)return"";let t=a?o.entro:e.esperado?.monto??o.entro,n=!a&&e.simulado!==null&&e.esperado!==null&&e.esperado.monto!==e.simulado.entro,s=e.real?e.real.detalle:Q(e.simulado?.detalle),r=c.notasDelMes?.[e.mes]?.trim()??"",i=e.estado==="actual"?'<span class="chip ahora">este mes</span>':e.estado==="futuro"?'<span class="chip futuro">viene</span>':"",l=[o.aObligaciones>0?`${m(o.aObligaciones)} fijos`:"",o.aMetas>0?`${m(o.aMetas)} a metas`:"",a&&e.real.enGastos>0?`${m(e.real.enGastos)} sueltos`:"",o.alAhorro>0?`${m(o.alAhorro)} guardado`:""].filter(Boolean).join(" \xB7 ");return`
  <details class="mes-vista ${e.estado} ${a?"es-real":"es-simulado"}"
           data-mes="${e.mes}" ${ie.has(e.mes)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${p(U(e.mes))}</h3>
      ${i}
      <span class="etiqueta ${a?"real":"simulacion"}">${a?"Real":"Simulaci\xF3n"}</span>
      <span class="valor">${m(t)}</span>
      ${l?`<span class="resumen-plegado">${l}</span>`:""}
      ${r?'<span class="rango" title="Este mes tiene una nota">\u{1F4DD}</span>':""}
    </summary>
    <p class="nota">
      ${r?`<span class="nota-del-mes">\u{1F4DD} ${p(r)}</span><br />`:""}
      <button class="chico" data-accion="nota-mes" data-mes="${e.mes}">
        ${r?"Editar la nota del mes":"\u{1F4DD} Escribir una nota de este mes"}</button>
    </p>
    ${e.esperado?.segun==="cuenta_de_cobro"&&!a?`<p class="nota rango">
      Seg\xFAn tu cuenta de cobro de este mes, no seg\xFAn el escenario.</p>`:""}
    ${n?`<p class="nota aviso">
      El desglose de abajo est\xE1 calculado con el escenario (${m(e.simulado.entro)}).
      Si de verdad esperas ${m(e.esperado.monto)} este mes, cambia \xABLo que espero por pago\xBB
      para que las cifras cuadren.</p>`:""}
    ${e.diferencia!==null&&e.diferencia!==0?`<p class="nota ${e.diferencia<0?"aviso":""}">
      ${e.diferencia<0?`Entraron ${m(-e.diferencia)} menos de lo esperado para ese mes (${m(e.esperado.monto)}${e.esperado.segun==="cuenta_de_cobro"?", seg\xFAn tu cuenta de cobro":""}).`:`Entraron ${m(e.diferencia)} m\xE1s de lo esperado para ese mes.`}</p>`:""}
    ${e.estado==="actual"&&e.real&&e.esperado?`<p class="nota">
      ${e.esperado.segun==="cuenta_de_cobro"?`Tu cuenta de cobro de este mes es de <strong>${m(e.esperado.monto)}</strong>`:`El escenario supone <strong>${m(e.esperado.monto)}</strong> este mes`}.
      ${e.real.entro<e.esperado.monto?`Llevas ${m(e.real.entro)}: faltar\xEDan ${m(e.esperado.monto-e.real.entro)} por entrar.`:"Ya entr\xF3 todo."}</p>`:""}
    ${s.length===0?'<p class="nota rango">Sin movimientos.</p>':`
      <div class="tabla-ancha"><table><tbody>
        ${s.map(u=>`<tr>
          <td class="meta-nombre">${p(u.nombre)} ${fn(u.nombre)}
            ${u.deLoQueSobro?`<span class="rango">\xB7 ${m(u.deLoQueSobro)} con lo que sobr\xF3 del mes</span>`:""}</td>
          <td class="num">${m(u.monto)}</td></tr>`).join("")}
        ${o.alAhorro>0?`<tr class="grupo">
          <td class="meta-nombre">${a?"Qued\xF3 guardado":"Se guardar\xEDa"}</td>
          <td class="num">${m(o.alAhorro)}</td></tr>`:""}
      </tbody></table></div>`}
    ${e.real&&e.real.sinAsignar>0?`<p class="nota aviso">
      Hay ${m(e.real.sinAsignar)} sin decir en qu\xE9 se fueron.</p>`:""}
  </details>`}var j=[],G=fo(),T=!1,O=null,$n={escenario:"Escenario",obligaciones:"Obligaciones",metas:"Metas",cuentas:"Cuentas de cobro",ingresos:"Registrar \xB7 pagos recibidos",repartos:"Registrar \xB7 en qu\xE9 se fue la plata",soportes:"Soportes de radicaci\xF3n"};function Mn(e){let a=e.datos,o=t=>typeof t=="number"?m(t):"";switch(e.tabla){case"metas":return`\xAB${String(a.nombre??"sin nombre")}\xBB`;case"obligaciones":return`\xAB${String(a.nombre??"sin nombre")}\xBB`;case"cuentas":return`la cuenta de ${String(a.periodo??"?")}`;case"ingresos":return`el pago del ${String(a.fecha??"?")} (${o(a.monto)})`;case"repartos":return Qe({tabla:"repartos",id:e.id},c);case"escenario":return"el escenario";case"soportes":return`los soportes de ${e.id}`}}function No(e,a){if((e.campo==="ordenMetas"||e.campo==="ordenObligaciones")&&Array.isArray(a)&&O){let o=e.campo==="ordenMetas"?"metas":"obligaciones",t=new Map;for(let n of[...O.remotas[o],...O.locales[o]])t.set(n.datos.id,String(n.datos.nombre??n.datos.id));return a.map((n,s)=>`${s+1}. ${t.get(String(n))??"?"}`).join(" \xB7 ")}return ve(e.campo??"",a)}function Dn(e){let a=O.elecciones[e.clave],o=(i,l)=>`
    <label class="opcion ${a===i?"elegida":""}">
      <input type="radio" name="${p(e.clave)}" value="${i}" ${a===i?"checked":""}
        data-accion="nube-elegir" data-clave="${p(e.clave)}" data-lado="${i}" />
      <span>${l}</span>
    </label>`,t=Mn(e);if(e.tipo==="campo")return`<div class="diferencia">
      <div class="que"><strong>${p(t)}</strong> \u2014 ${p(Ue(e.campo??""))}
        ${e.confirmadoEn?'<span class="rango">(el que confirmaste viene marcado)</span>':""}</div>
      ${o("aqui",`<b>En este aparato:</b> ${p(No(e,e.aqui))}`)}
      ${o("nube",`<b>En el otro aparato (la nube):</b> ${p(No(e,e.nube))}`)}
    </div>`;let[n,s,r]=e.tipo==="solo-aqui"?[`${t} est\xE1 solo en este aparato`,"Conservarla","Quitarla de los dos"]:e.tipo==="solo-nube"?[`${t} est\xE1 solo en el otro aparato`,"No traerla (quitarla de los dos)","Traerla"]:[`${t} la borraste en el otro aparato`,"Conservarla","Borrarla tambi\xE9n aqu\xED"];return`<div class="diferencia fila-entera">
    <div class="que"><strong>${p(n)}</strong></div>
    ${o("aqui",p(s))}
    ${o("nube",p(r))}
  </div>`}function En(){let e=O,a=[...new Set(e.difs.map(o=>o.tabla))];return`<div class="revision">
    <p><strong>${e.modo==="subir"?"Vas a SUBIR la versi\xF3n de este aparato.":"Vas a TRAER la \xFAltima versi\xF3n de la nube."}</strong>
      Hay ${e.difs.length} ${e.difs.length===1?"diferencia":"diferencias"} con el otro aparato.
      Viene marcado ${e.modo==="subir"?"lo de este aparato":"lo de la nube"}; cambia lo que quieras.
      <b>Todav\xEDa no se ha escrito nada</b>, ni aqu\xED ni en la nube.</p>
    ${a.map(o=>`<h3>${p($n[o])}</h3>
      ${e.difs.filter(t=>t.tabla===o).map(Dn).join("")}`).join("")}
    <p class="botones-revision">
      <button class="primario" data-accion="nube-aplicar" ${T?"disabled":""}>
        ${T?"Aplicando\u2026":"Aplicar lo elegido"}</button>
      <button data-accion="nube-cancelar">Cancelar, no cambiar nada</button>
    </p>
  </div>`}function yn(){let e=ke(),a=He();if(!e)return`
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
          <td><strong>${p(Ue(t.campo))}</strong>
            <span class="rango">de ${p(Qe(t,c))}</span></td>
          <td class="descartado">${p(ve(t.campo,t.valor))}</td>
          <td class="completa">${p(ve(t.campo,t.gano))}</td>
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
      ${O?En():`
      <p class="nota">Nada se escribe sin que veas antes qu\xE9 cambia y elijas.</p>
      <p class="botones-nube">
        <button class="primario" data-accion="nube-preparar" data-modo="subir" ${T?"disabled":""}>
          \u2B06 Subir mi versi\xF3n</button>
        <button class="primario" data-accion="nube-preparar" data-modo="traer" ${T?"disabled":""}>
          \u2B07 Traer la \xFAltima versi\xF3n</button>
        <button class="chico-linea" data-accion="nube-salir">Salir de la cuenta</button>
      </p>
      <p class="rango">\xABSubir\xBB deja la nube como este aparato; \xABTraer\xBB deja este aparato como la nube.
        ${T?"<b>Comparando con la nube\u2026</b>":""}</p>`}
      ${o}
    </section>`}function xn(e){let a=new Date,o=a.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),t=Ce(de(c.cuentas,c.ingresos)),n=Ze(),s=n.monto>0?ya(2,n.monto):0,r=Xo(e),i=r.length>0?sa(r).guardadoDeVerdad:0,l=w(),u=Io(c.metas,e?.metas??[]),d=u?.pagoFin!=null?ee(q(u.pagoFin,l)):null,f=c.soportesMarcados[Oe(a)]??[],g=ua(a,f),b=Te(),x=b.filter(P=>f.includes(P.id)).length,$=g.diasQueFaltan,y=(P,xe,Se,Pe,K,Z)=>`
    <div class="cifra tono-${P}">
      <div class="cifra-cab"><span class="cifra-chip">${xe}</span>${Se}</div>
      <div class="cifra-nombre">${Pe}</div>
      <div class="cifra-valor">${K}</div>
      <div class="cifra-detalle">${Z}</div>
    </div>`,M='<span class="etiqueta real">Real</span>',R='<span class="etiqueta simulacion">Simulaci\xF3n</span>',C=me(c.metas,c.repartos),F=new Map((e?.metas??[]).map(P=>[P.metaId,P])),De=P=>Ea(P,C.get(P.id)?.total??0)>=1,A=c.metas.filter(P=>!De(P)),Ee=c.metas.length-A.length,Ca=(A.length>0?A:c.metas).slice(0,5),ye=(A.length>0?A.length:c.metas.length)-Ca.length,rt=Ca.map(P=>{let xe=F.get(P.id),Se=C.get(P.id)?.total??0,Pe=Ea(P,Se),K=Pe>=1,Z=!P.compra&&!K&&xe?.pagoFin!=null?q(xe.pagoFin,l):null,Aa=P.compra?"ya la compraste":K?"\u2713 lista":Z?ee(Z):"sin fecha todav\xEDa",it=Z?`<span class="fecha-larga-meta">${p(Aa)}</span><span class="fecha-corta-meta">${p(ue(Z))}</span>`:p(Aa);return`<li class="inicio-meta ${P.clase==="deuda"?"es-deuda":""} ${K?"lista":""}">
      <div class="inicio-meta-texto">
        <div class="inicio-meta-nombre">${p(P.nombre.trim()||"(sin nombre)")}
          ${P.clase==="deuda"?'<span class="marca-deuda">Ya la debo</span>':""}</div>
        <div class="rango">${m(Se)} de ${m(P.valor)}</div>
        <div class="barra-progreso"><i style="width:${Math.round(Pe*100)}%"></i></div>
      </div>
      <div class="inicio-meta-der"><strong>${m(P.valor)}</strong>
        <span class="${K?"completa":"cuando"}">${it}</span></div>
    </li>`}).join("");return`
  <section class="inicio">
    <div class="saludo">
      <h1>\xA1Hola!</h1>
      <p>As\xED va tu plata \xB7 <span class="fecha-larga">${p(o)}</span></p>
    </div>

    <div class="aviso-radicar ${Jo[g.urgencia]}">
      <div class="aviso-radicar-texto">
        ${M} <strong>${p(g.titular)}</strong>
        <div class="rango">${x} de ${b.length} soportes listos \xB7 la lista est\xE1 abajo</div>
        <div class="barra-progreso real"><i style="width:${b.length?Math.round(x/b.length*100):0}%"></i></div>
      </div>
      <div class="aviso-radicar-dias"><strong>${Math.abs($)}</strong>
        <span>${$<0?Math.abs($)===1?"d\xEDa tarde":"d\xEDas tarde":$===1?"d\xEDa":"d\xEDas"}</span></div>
    </div>

    <div class="cifras">
      ${y("real","\u{1F4B5}",M,"Te deben",t>0?m(t):"$0",t>0?"de cuentas de cobro sin pagar completas":"no tienes cuentas pendientes")}
      ${y("turquesa","\u{1F45B}","","Libre para metas, por pago",n.monto>0?m(n.monto-s):"\u2014",n.monto>0?`de ${m(n.monto)} \xB7 se van ${m(s)}`:"pon cu\xE1nto esperas por pago en Ajustes")}
      ${y("simulado","\u{1F3C1}",R,u?`Pr\xF3xima meta \xB7 ${p(u.meta.nombre.trim()||"(sin nombre)")}`:"Pr\xF3xima meta",u?d?p(d.replace(/^entre /,"").split(" y ")[0]):"Sin fecha":"\u2014",u?d?d.startsWith("entre ")?p(d):"seg\xFAn la proyecci\xF3n":"la proyecci\xF3n no alcanza a terminarla":"no hay metas pendientes")}
      ${y("morado","\u{1F437}","","Llevas guardado",m(i),"lo que ha quedado de verdad en el ahorro")}
    </div>

    <div class="inicio-doble">
    <div class="panel inicio-metas">
      <h2>Mis metas ${R}
        <button class="enlace" data-accion="seccion" data-seccion="metas">Ver todas \u2192</button></h2>
      ${c.metas.length===0?`<div class="vacio">Todav\xEDa no has puesto ninguna meta.
            <p><button class="primario" data-accion="seccion" data-seccion="metas">Ir a Metas</button></p></div>`:`<ul class="inicio-lista">${rt}</ul>
           ${ye>0||A.length>0&&Ee>0?`<p class="nota">${[ye>0?`${ye} ${ye===1?"pendiente m\xE1s":"pendientes m\xE1s"}`:"",A.length>0&&Ee>0?`${Ee} ya ${Ee===1?"lista":"listas"}`:""].filter(Boolean).join(" \xB7 ")} \u2014 todas en Metas.</p>`:""}`}
    </div>
    ${Sn(e)}
    </div>
  </section>`}function Sn(e){let a=e?wo(e.pagos):null;if(!a)return"";let o=52,t=2*Math.PI*o,n=[{nombre:"Obligaciones",valor:a.obligaciones,clase:"oblig"},{nombre:"Metas",valor:a.metas,clase:"metas"},{nombre:"Ahorro",valor:a.ahorro,clase:"ahorro"}],s=Lo(n.map(i=>i.valor),o),r=ue(q(a.numero,w()));return`
  <div class="panel inicio-dona">
    <h2>En qu\xE9 se va un pago <span class="etiqueta simulacion">Simulaci\xF3n</span></h2>
    <p class="rango">El pago ${a.numero} de la proyecci\xF3n \xB7 ${p(r)}</p>
    <div class="dona">
      <svg viewBox="0 0 140 140" role="img" aria-label="Reparto de ${m(a.ingreso)}">
        <circle cx="70" cy="70" r="${o}" class="dona-fondo" />
        <g transform="rotate(-90 70 70)">
          ${n.map((i,l)=>s[l].largo>0?`<circle cx="70" cy="70" r="${o}" class="dona-${i.clase}"
                 stroke-dasharray="${s[l].largo.toFixed(2)} ${t.toFixed(2)}"
                 stroke-dashoffset="${(-s[l].desde).toFixed(2)}" />`:"").join("")}
        </g>
        <text x="70" y="68" class="dona-total">${m(a.ingreso)}</text>
        <text x="70" y="86" class="dona-rotulo">por pago</text>
      </svg>
      <ul>
        ${n.map(i=>`<li><i class="dona-${i.clase}"></i><span>${i.nombre}</span>
          <strong>${m(i.valor)}</strong></li>`).join("")}
      </ul>
    </div>
    <p><button class="primario" data-accion="seccion" data-seccion="registrar">+ Registrar un pago</button></p>
  </div>`}function ea(){let e=ln();return[["inicio",xn(e)],["radicacion",rn()],["vista",bn(e)],["escenario",Jt()],["metas",sn(e)],["proyeccion",dn(e)],["obligaciones",an()],["cuentas",cn()],["real",mn()],["nube",yn()]]}function Wo(e){if(typeof e.querySelectorAll=="function")for(let a of Array.from(e.querySelectorAll("table"))){let o=Array.from(a.querySelectorAll("thead th")).map(t=>(t.textContent??"").trim());if(ro(o)){a.classList.add("como-tarjetas");for(let t of Array.from(a.querySelectorAll("tbody tr"))){let n=Array.from(t.children),s=n.map(i=>Number(i.getAttribute("colspan")??1)||1),r=so(o,s);n.forEach((i,l)=>{let u=r[l];u?i.dataset.etiqueta=u:delete i.dataset.etiqueta})}}}}function Sa(e,a){e.innerHTML=a,Wo(e)}function Ko(){return document.activeElement?.closest?.("[data-panel]")?.dataset.panel??null}function Pa(e=Ko()){let a=new Set([e,xa].filter(Boolean));for(let[o,t]of ea()){if(a.has(o))continue;let n=document.getElementById(`panel-${o}`);n&&Sa(n,t)}Zo()}function Zo(){let e=document.getElementById("mensaje");e&&(e.innerHTML=D?`<div class="mensaje ${D.malo?"malo":"bueno"}">${p(D.texto)}</div>`:"",D=null)}var et="gestiondinerotrabajo.seccion";function Pn(){try{return Ye(localStorage.getItem(et))}catch{return Ye(null)}}function Rn(e){try{localStorage.setItem(et,e)}catch{}}function Cn(e){return`<nav class="barra-secciones">
    ${$e.map(a=>`<button data-accion="seccion" data-seccion="${a.id}"
      class="${a.id===e?"activa":""}" aria-current="${a.id===e?"page":"false"}">
      <span class="icono-seccion">${a.icono}</span>${p(a.rotulo)}</button>`).join("")}
  </nav>`}function An(e){let a=ke(),o=He(),t=o?new Date(o).toLocaleString("es-CO",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):null;return`<aside class="lateral">
    <div class="marca"><span class="logo">$</span>
      <div><strong>Mi dinero</strong><span>Metas con ingreso variable</span></div></div>
    <nav class="nav-lateral">
      ${$e.map(n=>`<button data-accion="seccion" data-seccion="${n.id}"
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
  </aside>`}function S(){let e=document.getElementById("app"),a=_o(document.activeElement),o=document.activeElement,t=o&&typeof o.selectionStart=="number"?o.selectionStart:null,n=window.scrollY,s=Pn();e.className=`seccion-${s}`,e.innerHTML=`
    ${An(s)}
    <header class="cabecera">
      <h1>Gesti\xF3n del dinero del trabajo</h1>
      <div class="acciones">
        <button data-accion="exportar">Exportar respaldo</button>
        <button data-accion="importar">Importar respaldo</button>
      </div>
    </header>
    <div id="mensaje"></div>
    ${ea().map(([r,i])=>`<div id="panel-${r}" data-panel="${r}"
         data-seccion="${Ro(r)??""}">${i}</div>`).join("")}
    <input type="file" id="archivo" accept="application/json" hidden />
    ${Cn(s)}`,Wo(e),Zo(),window.scrollTo({top:n,behavior:"instant"}),Ut(a,t)}function at(e){let a=Math.round(Number(e));if(!(!Number.isFinite(a)||a<=1))return a}h.set("escenario",e=>{let a=e.dataset.campo,o=e,t=o.value;if(c.escenario[a]=o.type==="date"?t:o.hasAttribute("data-dinero")?L(t):Number(t),a==="diasOptimista"||a==="diasPesimista"){let n=Math.round(Number(t));c.escenario[a]=Number.isFinite(n)&&n>0?n:1}_()});async function ot(e,a){let o=await H({titulo:a,detalle:"Lo que quieras recordar. Enter hace un salto de l\xEDnea; Ctrl+Enter guarda.",valorInicial:e.nota??"",textoAceptar:"Guardar",largo:!0});o!==null&&(o.trim()?e.nota=o.trim():delete e.nota,E())}h.set("nota-meta",e=>{let a=c.metas.find(o=>o.id===e.dataset.id);a&&ot(a,`Nota de \xAB${a.nombre}\xBB`)});h.set("nota-oblig",e=>{let a=c.obligaciones.find(o=>o.id===e.dataset.id);a&&ot(a,`Nota de \xAB${a.nombre}\xBB`)});h.set("nota-mes",async e=>{let a=e.dataset.mes,o=c.notasDelMes??={},t=await H({titulo:`Nota de ${U(a)}`,detalle:"Lo que quieras recordar de este mes. Enter hace un salto de l\xEDnea; Ctrl+Enter guarda.",valorInicial:o[a]??"",textoAceptar:"Guardar",largo:!0});t!==null&&(t.trim()?o[a]=t.trim():delete o[a],E())});h.set("link-meta",async e=>{let a=c.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=await H({titulo:`Enlace de \xAB${a.nombre}\xBB`,detalle:"Pega la direcci\xF3n de la p\xE1gina donde la vas a comprar. D\xE9jalo vac\xEDo para quitarlo.",valorInicial:a.link??"",textoAceptar:"Guardar"});if(o===null)return;if(!o.trim())return delete a.link,E();let t=ba(o);if(!t)return D={texto:"Esa direcci\xF3n no se entiende como p\xE1gina web. No cambi\xE9 el enlace.",malo:!0},S();a.link=t,E()});h.set("sobrante-a-metas",e=>{c.escenario.sobranteAMetas=e.checked,_()});h.set("elastico",e=>{c.escenario.colchonElastico=e.checked,_()});h.set("oblig",e=>{let a=c.obligaciones.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=a.tipo==="porcentaje"?Number(t)/100:L(t);else if(o==="tipo"){let n=t;n!==a.tipo&&(a.valor=n==="porcentaje"?.1:1e5),a.tipo=n}else o==="modo"?(a.modo=t,a.modo==="puntual"&&!a.supuesto&&(a.supuesto="siempre")):o==="grupo"?a.grupo=t.trim()||void 0:o==="desdePago"?a.desdePago=at(t):o==="supuesto"?a.supuesto=t:a.nombre=t;_()});h.set("nuevo-cambio",e=>{let a=c.obligaciones.find(t=>t.id===e.dataset.id);if(!a)return;let o=Math.max(1,...(a.cambios??[]).map(t=>t.desdePago));a.cambios=[...a.cambios??[],{desdePago:o+1,valor:a.valor}],E()});h.set("cambio",e=>{let a=c.obligaciones.find(n=>n.id===e.dataset.id),o=a?.cambios?.[Number(e.dataset.i)];if(!a||!o)return;let t=e.value;if(e.dataset.campo==="desdePago"){let n=Math.round(Number(t));o.desdePago=Number.isFinite(n)&&n>0?n:1}else o.valor=a.tipo==="porcentaje"?Number(t)/100:L(t);_()});h.set("borrar-cambio",e=>{let a=c.obligaciones.find(t=>t.id===e.dataset.id);if(!a?.cambios)return;let o=Number(e.dataset.i);a.cambios=a.cambios.filter((t,n)=>n!==o),E()});function Ra(e){return e==="ingreso"?"cambiosIngreso":"cambiosColchon"}h.set("nuevo-cambio-escenario",e=>{let a=Ra(e.dataset.cual),o=c.escenario[a]??[],t=Math.max(1,...o.map(s=>s.desdePago)),n=a==="cambiosIngreso"?c.escenario.ingresoEsperado:c.escenario.colchonBase;c.escenario[a]=[...o,{desdePago:t+1,valor:n}],E()});h.set("cambio-escenario",e=>{let a=c.escenario[Ra(e.dataset.cual)]?.[Number(e.dataset.i)];if(!a)return;let o=e.value;if(e.dataset.campo==="desdePago"){let t=Math.round(Number(o));a.desdePago=Number.isFinite(t)&&t>0?t:1}else a.valor=L(o);_()});h.set("borrar-cambio-escenario",e=>{let a=Number(e.dataset.i),o=Ra(e.dataset.cual);c.escenario[o]=(c.escenario[o]??[]).filter((t,n)=>n!==a),E()});h.set("nueva-oblig",()=>{let e=J("ob");Ke=e,c.obligaciones.push({id:e,nombre:"Nueva obligaci\xF3n",tipo:"fijo",valor:1e5,modo:"cada_pago"}),E()});h.set("borrar-oblig",e=>{c.obligaciones=c.obligaciones.filter(a=>a.id!==e.dataset.id),E()});h.set("meta",e=>{let a=c.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=L(t);else if(o==="abonado")a.abonado=L(t);else if(o==="desdePago")a.desdePago=at(t);else if(o==="maximoPorPago"){let n=L(t);a.maximoPorPago=n>0?n:void 0}else if(o==="enCuotas"){let n=Math.round(Number(t));a.enCuotas=Number.isFinite(n)&&n>0?n:void 0}else if(o==="antesDelPago"){let n=Math.round(Number(t));a.antesDelPago=Number.isFinite(n)&&n>0?n:void 0}else if(o==="grupo")a.grupo=t.trim()||void 0;else if(o==="clase"){a.clase=t==="deuda"?"deuda":void 0,E();return}else a.nombre=t;_()});function qn(e){let a=e.classList.toggle("abierta"),o=e.dataset.idFila;if(o)for(let t of document.querySelectorAll(`[data-hija-de="${CSS.escape(o)}"]`))t.classList.toggle("abierta",a)}function tt(e,a){let o=document.getElementById(`panel-${e==="metas"?"metas":"obligaciones"}`);if(o){for(let t of o.querySelectorAll("tr[data-resumen]"))t.classList.toggle("abierta",a);for(let t of o.querySelectorAll("[data-hija-de]"))t.classList.toggle("abierta",a)}}h.set("desplegar-todo",e=>tt(e.dataset.lista,!0));h.set("plegar-todo",e=>tt(e.dataset.lista,!1));h.set("seccion",e=>{let a=Ye(e.dataset.seccion);Rn(a);let o=document.getElementById("app");o&&(o.className=`seccion-${a}`);for(let t of document.querySelectorAll(".barra-secciones button, .nav-lateral button")){let n=t.dataset.seccion===a;t.classList.toggle("activa",n),t.setAttribute("aria-current",n?"page":"false")}window.scrollTo({top:0,behavior:"instant"})});h.set("nueva-meta",()=>{let e=J("meta");Ke=e,c.metas.push({id:e,nombre:"",valor:0}),E(),document.querySelector(`input[data-id="${e}"][data-campo="nombre"]`)?.focus()});h.set("plegar-meses",e=>{let a=e.dataset.abrir==="1";if(ie.clear(),a)for(let t of document.querySelectorAll("[data-mes]"))ie.add(t.dataset.mes);let o=document.getElementById("panel-vista");o&&Sa(o,ea().find(([t])=>t==="vista")[1])});h.set("ordenar",e=>{let a=e.dataset.por,o=(n,s)=>n.localeCompare(s,"es",{sensitivity:"base",numeric:!0}),t=(n,s)=>a==="valor"?s.valor-n.valor:a==="grupo"&&o(n.grupo??"\uFFFF",s.grupo??"\uFFFF")||o(n.nombre,s.nombre);e.dataset.lista==="metas"?(c.metas=[...c.metas].sort(t),D={texto:`Metas ordenadas por ${a}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron. Si no era lo que quer\xEDas, reord\xE9nalas con las flechas.`,malo:!1}):c.obligaciones=[...c.obligaciones].sort(t),E()});h.set("duplicar-meta",e=>{let a=c.metas.findIndex(n=>n.id===e.dataset.id);if(a<0)return;let o=c.metas[a],t={...o,id:J("meta"),nombre:`${o.nombre} (copia)`,abonado:0};delete t.compra,c.metas.splice(a+1,0,t),E()});h.set("borrar-meta",e=>{c.metas=c.metas.filter(a=>a.id!==e.dataset.id),E()});function nt(e,a){let o=e+a;if(o<0||o>=c.metas.length)return;let t=c.metas.slice();[t[e],t[o]]=[t[o],t[e]],c.metas=t,E()}h.set("subir",e=>nt(Number(e.dataset.i),-1));h.set("bajar",e=>nt(Number(e.dataset.i),1));h.set("nueva-cuenta",()=>{let e=new Date,a=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];c.cuentas.push({id:J("cta"),periodo:`${a[e.getMonth()]} de ${e.getFullYear()}`,montoEsperado:c.escenario.ingresoEsperado}),E()});h.set("cuenta",e=>{let a=c.cuentas.find(t=>t.id===e.dataset.id);if(!a)return;let o=e.value;e.dataset.campo==="montoEsperado"?a.montoEsperado=L(o):a.periodo=o,_()});h.set("borrar-cuenta",e=>{c.cuentas=c.cuentas.filter(o=>o.id!==e.dataset.id);let a=new Set(c.ingresos.filter(o=>o.cuentaDeCobroId===e.dataset.id).map(o=>o.id));c.ingresos=c.ingresos.filter(o=>o.cuentaDeCobroId!==e.dataset.id),c.repartos=c.repartos.filter(o=>!a.has(o.ingresoId)),E()});h.set("abonar",async e=>{let a=c.cuentas.find(i=>i.id===e.dataset.id);if(!a)return;let o=de([a],c.ingresos)[0],t=o.pendiente>0?o.pendiente:a.montoEsperado,n=await H({titulo:`\xBFCu\xE1nto te pagaron de ${a.periodo}?`,detalle:o.pendiente>0&&o.recibido>0?`Ya te hab\xEDan pagado ${m(o.recibido)}. Faltan ${m(o.pendiente)}.`:void 0,valorInicial:I(t),dinero:!0,textoAceptar:"Registrar pago"});if(n===null)return;let s=L(n);if(!Number.isFinite(s)||s<=0)return D={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},S();let r={id:J("ing"),cuentaDeCobroId:a.id,fecha:re(),monto:s};c.ingresos.push(r),c.repartos.push(ce(r)),D={texto:"Registrado. Mira abajo en qu\xE9 se va ese dinero y corr\xEDgelo si no fue as\xED.",malo:!1},E()});h.set("comprada",async e=>{let a=c.metas.find(s=>s.id===e.dataset.id);if(!a)return;let o=await H({titulo:`\xBFPor cu\xE1nto compraste ${a.nombre}?`,detalle:`La ten\xEDas en ${m(a.valor)}. Pon lo que pagaste de verdad, aunque sea distinto.`,valorInicial:I(a.valor),dinero:!0,textoAceptar:"Siguiente"});if(o===null)return;let t=await H({titulo:"\xBFEn qu\xE9 mes la compraste?",detalle:"Escr\xEDbelo como AAAA-MM. Por ejemplo, 2026-08 para agosto de este a\xF1o.",valorInicial:re().slice(0,7),textoAceptar:"Guardar"});if(t===null)return;let n=/^\d{4}-\d{2}$/.test(t.trim())?t.trim():re().slice(0,7);a.compra={mes:n,precioReal:L(o)},E()});h.set("no-comprada",e=>{let a=c.metas.find(o=>o.id===e.dataset.id);a&&(delete a.compra,E())});h.set("proponer",e=>{let a=c.ingresos.find(o=>o.id===e.dataset.id);a&&(c.repartos=c.repartos.filter(o=>o.ingresoId!==a.id),c.repartos.push(ce(a)),E())});h.set("confirmar-reparto",e=>{let a=c.repartos.find(o=>o.id===e.dataset.id);a&&(a.propuesto=!1,E())});h.set("editar-reparto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id);if(!a)return;let o=L(e.value),t=e.dataset.tipo,n=Number(e.dataset.i);t==="ahorro"?a.alAhorro=o:t==="obligaciones"&&a.obligaciones[n]?a.obligaciones[n].monto=o:t==="abonos"&&a.abonos[n]&&(a.abonos[n].monto=o),a.propuesto=!1,_()});h.set("quitar-previo",e=>{let a=c.metas.find(t=>t.id===e.dataset.id);if(!a)return;let o=a.abonado??0;a.abonado=0,D={texto:`Quit\xE9 los ${m(o)} que estaban escritos a mano en ${a.nombre}. Ahora manda lo registrado en \xABen qu\xE9 se fue la plata\xBB, que es lo que de verdad pagaste.`,malo:!1},E()});h.set("gasto-a-abono",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.metas.find(s=>s.id===e.dataset.meta);if(!a||!o)return;let t=e.dataset.nombre,n=(a.gastos??[]).find(s=>s.nombre===t);n&&(a.gastos=a.gastos.filter(s=>s!==n),a.abonos.push({nombre:o.nombre,monto:n.monto,refId:o.id,movidoDesdeGasto:!0}),D={texto:`Listo: los ${m(n.monto)} de \xAB${n.nombre}\xBB ahora cuentan como abono a ${o.nombre}. El total del mes no cambi\xF3. Si te equivocaste, la l\xEDnea tiene un bot\xF3n \u21A9 para devolverla a gastos.`,malo:!1},E())});h.set("abono-a-gasto",e=>{let a=c.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.abonos[o];!a||!t||(a.abonos=a.abonos.filter((n,s)=>s!==o),a.gastos=[...a.gastos??[],{nombre:t.nombre,monto:t.monto}],D={texto:`${t.nombre} volvi\xF3 a ser un gasto suelto.`,malo:!1},E())});h.set("nuevo-gasto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=pe(a,o),n=t>0?t:Math.min(a.alAhorro,a.alAhorro);a.gastos=[...a.gastos??[],{nombre:"",monto:0}],n<=0&&(a.propuesto=!1),E()});h.set("editar-gasto",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];if(!a||!t)return;let n=e.value;if(e.dataset.campo==="nombre")t.nombre=n;else{let s=L(n);a.alAhorro=Math.max(0,a.alAhorro-(s-t.monto)),t.monto=s}a.propuesto=!1,_()});h.set("borrar-gasto",e=>{let a=c.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];!a||!t||(a.alAhorro+=t.monto,a.gastos=a.gastos.filter((n,s)=>s!==o),E())});h.set("recalcular",e=>{let a=c.repartos.find(s=>s.id===e.dataset.id),o=c.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=a.gastos??[],n=ce(o);n.gastos=t,n.alAhorro=Math.max(0,n.alAhorro-t.reduce((s,r)=>s+r.monto,0)),c.repartos=c.repartos.map(s=>s.id===a.id?n:s),D={texto:"Recalculado con las obligaciones de ahora.",malo:!1},E()});h.set("cuadrar",e=>{let a=c.repartos.find(t=>t.id===e.dataset.id),o=c.ingresos.find(t=>t.id===a?.ingresoId);!a||!o||(a.alAhorro=Math.max(0,a.alAhorro+pe(a,o)),a.propuesto=!1,E())});h.set("aporte-externo",async e=>{let a=await H({titulo:"\xBFCu\xE1nto vas a meter de tu bolsillo?",detalle:"Plata tuya que no viene del trabajo: Nequi, efectivo, lo que tengas guardado por otro lado.",valorInicial:"0",dinero:!0,textoAceptar:"Meterlo"});if(a===null)return;let o=L(a);if(o<=0)return D={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},S();let t=await H({titulo:"\xBFDe d\xF3nde sali\xF3?",detalle:"Para que dentro de unos meses sepas qu\xE9 fue esto.",valorInicial:"Nequi",textoAceptar:"Guardar"}),n={id:J("ing"),fecha:re(),monto:o,nota:t?.trim()||"de otro lado"};c.ingresos.push(n),c.repartos.push(ce(n)),E()});h.set("soporte",e=>{let a=Oe(new Date),o=new Set(c.soportesMarcados[a]??[]),t=e.dataset.id;e.checked?o.add(t):o.delete(t),c.soportesMarcados={...c.soportesMarcados,[a]:[...o]},_()});h.set("borrar-ingreso",e=>{c.repartos=c.repartos.filter(a=>a.ingresoId!==e.dataset.id),c.ingresos=c.ingresos.filter(a=>a.id!==e.dataset.id),E()});function st(){let e=globalThis.__TAURI__;return e?.dialog&&e?.fs?{dialog:e.dialog,fs:e.fs}:null}h.set("exportar",async()=>{let e=oo(c),a=`respaldo-dinero-${re()}.json`,o=st();if(!o){let t=new Blob([e],{type:"application/json"}),n=document.createElement("a");return n.href=URL.createObjectURL(t),n.download=a,n.click(),URL.revokeObjectURL(n.href),D={texto:`Respaldo guardado en tu carpeta de descargas como ${a}.`,malo:!1},S()}try{let t=await o.dialog.save({title:"\xBFD\xF3nde guardo el respaldo?",defaultPath:a,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!t)return;await o.fs.writeTextFile(t,e),D={texto:`Respaldo guardado en ${t}`,malo:!1}}catch(t){D={texto:`No pude guardar el respaldo: ${String(t)}`,malo:!0}}S()});h.set("importar",async()=>{let e=st();if(e)try{let o=await e.dialog.open({title:"\xBFQu\xE9 respaldo quieres cargar?",multiple:!1,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!o)return;let{estado:t,aviso:n}=pa(await e.fs.readTextFile(o));return t?(c=t,D={texto:"Respaldo importado.",malo:!1},E()):(D={texto:n.texto,malo:!0},S())}catch(o){return D={texto:`No pude leer ese archivo: ${String(o)}`,malo:!0},S()}let a=document.getElementById("archivo");a.onchange=async()=>{let o=a.files?.[0];if(!o)return;let{estado:t,aviso:n}=pa(await o.text());if(!t)return D={texto:n.texto,malo:!0},S();c=t,D={texto:"Respaldo importado.",malo:!1},E()},a.click()});document.addEventListener("input",e=>{let a=e.target;if(a instanceof HTMLInputElement&&(a.hasAttribute("data-dinero")&&no(a),a.dataset.campo==="desdePago")){let o=a.parentElement?.querySelector(".mes-de-pago");if(o){let t=Math.max(1,Math.round(Number(a.value)||1));o.textContent=t<=1?"desde el primero":k(q(t,w()).optimista)}}});document.addEventListener("focusout",e=>{let a=e.target?.closest?.("[data-panel]");if(!a||e.relatedTarget?.closest?.("[data-panel]")===a)return;let t=a.dataset.panel;setTimeout(()=>{if(Me||Ko()===t)return;let n=ea().find(([r])=>r===t)?.[1],s=document.getElementById(`panel-${t}`);n!==void 0&&s&&Sa(s,n)},0)});document.addEventListener("toggle",e=>{let a=e.target,o=a?.dataset?.mes;o&&(a.open?ie.add(o):ie.delete(o))},!0);document.addEventListener("change",e=>{let a=e.target?.closest("[data-accion]");a&&h.get(a.dataset.accion)?.(a,e)});document.addEventListener("click",e=>{let a=e.target,o=a?.closest?.("a[data-enlace]"),t=globalThis.__TAURI__?.opener;if(o&&t?.openUrl){e.preventDefault(),t.openUrl(o.href).catch(()=>{D={texto:"No pude abrir el enlace en el navegador.",malo:!0},S()});return}let n=a?.closest?.("tr[data-resumen]");if(We){We=!1;return}if(n&&!a?.closest("input, select, textarea, button, a")&&window.matchMedia("(max-width: 620px)").matches){qn(n);return}let s=e.target?.closest("button[data-accion]");Me=!1,s?(se=!1,h.get(s.dataset.accion)?.(s,e)):se&&(se=!1,Pa())});"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(()=>{})});var Xe=ao();c=Xe.estado;Xe.aviso&&(D={texto:Xe.aviso.texto,malo:Xe.aviso.grave});function In(){let e=new Set(c.repartos.map(o=>o.ingresoId)),a=c.ingresos.filter(o=>!e.has(o.id)).sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o of a)c.repartos.push(ce(o));return a.length>0}In()&&te(c);S();globalThis.__estado=()=>c;globalThis.__reiniciar=()=>{c=Y(),E()};h.set("nube-entrar",async()=>{let e=document.getElementById("nube-correo")?.value??"",a=document.getElementById("nube-clave")?.value??"";if(!e.trim()||!a)return D={texto:"Escribe tu correo y tu contrase\xF1a.",malo:!0},S();try{D={texto:`Entraste como ${(await ho(e,a)).correo}. Ya puedes sincronizar.`,malo:!1}}catch(o){D={texto:o.message,malo:!0}}S()});h.set("nube-salir",()=>{va(),G=null,j=[],D={texto:"Saliste de la cuenta. Tus datos siguen aqu\xED, intactos.",malo:!1},S()});h.set("nube-preparar",async e=>{if(T)return;let a=e.dataset.modo==="traer"?"traer":"subir";T=!0,S();try{let o=await yo(),t=ne(c),n=So(t,o);n.length===0?(G=JSON.parse(JSON.stringify(c)),ze(G),D={texto:"Este aparato y la nube ya est\xE1n iguales. No hay nada que cambiar.",malo:!1}):O={modo:a,locales:t,remotas:o,difs:n,elecciones:Ma(n,a)}}catch(o){D={texto:o.message,malo:!0}}T=!1,S()});h.set("nube-elegir",e=>{if(!O)return;let a=e.dataset.lado==="nube"?"nube":"aqui";O.elecciones[e.dataset.clave]=a;let o=e.dataset.clave;for(let t of document.querySelectorAll(`input[type="radio"][name="${CSS.escape(o)}"]`))t.closest(".opcion")?.classList.toggle("elegida",t.checked)});h.set("nube-cancelar",()=>{O=null,D={texto:"Cancelado. No se cambi\xF3 nada, ni aqu\xED ni en la nube.",malo:!1},S()});h.set("nube-aplicar",async()=>{if(!(!O||T)){T=!0,S();try{let e=O,a=Po(e.locales,e.remotas,e.difs,e.elecciones,new Date().toISOString());await xo(a),c=Fe(a,c),te(c),G=JSON.parse(JSON.stringify(c)),ze(G),j=[],O=null,D={texto:`Listo: ${e.difs.length} ${e.difs.length===1?"diferencia resuelta":"diferencias resueltas"}. Este aparato y la nube quedaron iguales.`,malo:!1}}catch(e){D={texto:`No se aplic\xF3 nada: ${e.message}`,malo:!0}}T=!1,S()}});h.set("nube-sincronizar",async()=>{if(!T){T=!0,S();try{let e=await Eo(c,G,new Date().toISOString());c=e.estado,G=JSON.parse(JSON.stringify(e.estado)),j=e.descartes.map(a=>({tabla:a.tabla,id:a.id,campo:a.campo,valor:a.valor,gano:a.gano,nombre:a.nombre})),te(c),ze(G),D={texto:j.length===0?"Todo al d\xEDa. Nada que resolver.":`Listo. ${j.length} dato(s) distintos entre los dos aparatos: mira abajo.`,malo:!1}}catch(e){D={texto:e.message,malo:!0}}T=!1,S()}});h.set("nube-revertir",e=>{let a=Number(e.dataset.i),o=j[a];if(!o)return;let t=To(c,o);if(!t.ok)return D={texto:t.motivo??"Eso no se puede deshacer desde aqu\xED.",malo:!0},S();j=j.filter((n,s)=>s!==a),te(c),D={texto:`Listo: ${Qe(o,c)} se queda con ${ve(o.campo,o.valor)}. Sincroniza otra vez para que el otro aparato lo tome.`,malo:!1},S()});document.addEventListener("keydown",e=>{if(e.key!=="Enter"||e.isComposing)return;let a=e.target;!a||a.closest(".capa-dialogo")||!(a instanceof HTMLInputElement)||a.type==="checkbox"||(e.preventDefault(),a.blur())});
