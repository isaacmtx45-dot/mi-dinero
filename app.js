var sa=Number.MAX_SAFE_INTEGER;function D(e){let a=typeof e=="number"?e:Number(e);return Number.isFinite(a)?Math.abs(a)>sa?a<0?-sa:sa:Math.round(a):0}function ue(e,a){return D(e*a)}var La=100;function $t(e,a){return a<=0?"sin_pagar":a>=e+La?"pagaron_de_mas":a>=e-La?"completa":"parcial"}function pe(e,a){let o=new Map;for(let t of a){let n=o.get(t.cuentaDeCobroId)??[];n.push(t),o.set(t.cuentaDeCobroId,n)}return e.map(t=>{let n=(o.get(t.id)??[]).slice().sort((i,c)=>i.fecha.localeCompare(c.fecha)),s=n.reduce((i,c)=>i+D(c.monto),0),r=$t(D(t.montoEsperado),s);return{cuenta:t,ingresos:n,recibido:s,pendiente:r==="completa"?0:Math.max(0,D(t.montoEsperado)-s),estado:r,ultimoPago:n.length?n[n.length-1].fecha:null}})}function wa(e){return e.filter(a=>a.pendiente>0)}function Oa(e){return D(e.cuenta.montoEsperado)<=0||e.pendiente>0}function Ae(e){return e.reduce((a,o)=>a+o.pendiente,0)}var Ce=new Intl.NumberFormat("es-CO");function ja(e){let a=`$${Ce.format(e.cuenta.montoEsperado)}`,o=`$${Ce.format(e.recibido)}`;switch(e.estado){case"sin_pagar":return`${e.cuenta.periodo}: sin pagar \xB7 te deben ${a}`;case"parcial":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 faltan $${Ce.format(e.pendiente)}`;case"completa":return`${e.cuenta.periodo}: pagada completa (${o})`;case"pagaron_de_mas":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 $${Ce.format(e.recibido-e.cuenta.montoEsperado)} de mas`}}function vt(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function Ie(e,a,o){return vt(a,(e-1)*o)}function A(e,a){let o=Math.max(1,a.diasOptimista);return{optimista:Ie(e,a.desde,o),pesimista:Ie(e,a.desde,Math.max(o,a.diasPesimista))}}function ia(e){return e.diasPesimista<=e.diasOptimista}var Dt=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function z(e){return`${Dt[e.getMonth()]} de ${e.getFullYear()}`}var ra=["ene.","feb.","mar.","abr.","mayo","jun.","jul.","ago.","sept.","oct.","nov.","dic."];function me(e){return ra[Number(e.slice(5,7))-1]??e}function qe(e){let[a,o]=[e.optimista,e.pesimista],t=ra[a.getMonth()],n=ra[o.getMonth()];return a.getFullYear()!==o.getFullYear()?`${t} ${a.getFullYear()} \u2013 ${n} ${o.getFullYear()}`:a.getMonth()===o.getMonth()?`${t} ${a.getFullYear()}`:`${t} \u2013 ${n} ${o.getFullYear()}`}function te(e){let a=z(e.optimista),o=z(e.pesimista);return a===o?a:`entre ${a} y ${o}`}function Te(e){return new Map(e.map(a=>[a.id,Math.max(0,D(a.valor)-D(a.abonado??0))]))}function Mt(e){return e.baseCobro??(e.tipo==="porcentaje"?"cada_ingreso":"una_vez_por_cuenta")}function Et(e,a,o){if(!o&&Mt(e)==="una_vez_por_cuenta")return!1;if(e.modo==="primer_pago")return a===1&&o;if(a<(e.desdePago??1))return!1;if(e.modo==="cada_pago")return!0;let t=e.supuesto??"siempre";return t==="nunca"?!1:t==="cada_dos_pagos"?a%2===1:!0}function Le(e,a,o){let t=e,n=0;for(let s of a??[]){let r=Math.max(1,Math.round(s.desdePago));o>=r&&r>=n&&(t=s.valor,n=r)}return t}function yt(e,a,o){let t=Le(e.valor,e.cambios,o);return e.tipo==="porcentaje"?ue(a,t):D(t)}function Fa(e,a){return e.maximoPorPago&&e.maximoPorPago>0?D(e.maximoPorPago):e.enCuotas&&e.enCuotas>0?Math.max(1,Math.ceil(D(e.valor)/Math.round(e.enCuotas))):a}function xt(e,a,o,t){for(let n of[!0,!1])for(let s of a){if(e<=0)return 0;let r=o.get(s.id)??0;if(r<=0)continue;let i=t.find(p=>p.metaId===s.id),c=i?.monto??0,u=n?Fa(s,r+c)-c:r,d=Math.min(r,e,u);d<=0||(i?(i.monto+=d,i.deLoQueSobro=(i.deLoQueSobro??0)+d):t.push({metaId:s.id,monto:d,deLoQueSobro:d}),o.set(s.id,r-d),e-=d)}return e}function ne(e,a,o,t,n,s,r,i=!0){let c=D(a),u=[];for(let M of o){if(!Et(M,e,i))continue;let b=Math.min(yt(M,a,e),c);b<=0||(u.push({nombre:M.nombre,monto:b}),c-=b)}let d=Le(t.base,t.cambios,e),p=Math.min(D(d),c);c-=p;let g=[],h=0;for(let M of n){let b=s.get(M.id)??0;if(b<=0||e<(M.desdePago??1))continue;let v=Fa(M,b),R=Math.min(b,c,v);if(t.elastico&&R<b&&v>=b){let C=Math.max(0,p-D(t.minimo)),L=b-R;L<=C&&(p-=L,h+=L,R=b)}if(!(R<=0)&&(g.push({metaId:M.id,monto:R}),s.set(M.id,b-R),c-=Math.min(R,c),c<=0))break}t.sobranteAMetas&&c>0&&(c=xt(c,n,s,g));let y=c;return{numero:e,ingreso:a,obligaciones:u,aColchon:p,recorteColchon:h,abonos:g,sobrante:y,saldoAhorro:r+p+y}}function Na(e,a,o,t,n,s,r=!0){let i=e.cuentaDeCobroId===void 0||e.cuentaDeCobroId==="",c=ne(a,D(e.monto),i?[]:o,i?{...t,base:0,minimo:0}:t,n,s,0,r),u=new Map(n.map(d=>[d.id,d]));return{id:`rep-${e.id}`,ingresoId:e.id,obligaciones:c.obligaciones.map(d=>({nombre:d.nombre,monto:d.monto})),abonos:c.abonos.map(d=>({nombre:u.get(d.metaId)?.nombre??"(meta borrada)",monto:d.monto,refId:d.metaId})),alAhorro:c.aColchon+c.sobrante,propuesto:!0}}function St(e){let a=o=>o.reduce((t,n)=>t+D(n.monto),0);return a(e.obligaciones)+a(e.abonos)+a(e.gastos??[])+D(e.alAhorro)}function ge(e,a){return D(a.monto)-St(e)}var ca=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function _a(e){return e.slice(0,7)}function se(e,a){let o=D(a.monto);if(o===0)return;let t=e.get(a.nombre);if(!t){e.set(a.nombre,{...a,monto:o});return}t.monto+=o,a.deLoQueSobro&&(t.deLoQueSobro=(t.deLoQueSobro??0)+a.deLoQueSobro)}function la(e,a){let o=new Map(a.map(n=>[n.ingresoId,n])),t=new Map;for(let n of e){let s=_a(n.fecha),r=t.get(s);r||(r={mes:s,entro:0,deTrabajo:0,deFuera:0,aObligaciones:0,aMetas:0,enGastos:0,alAhorro:0,detalle:[],sinAsignar:0,_detalle:new Map},t.set(s,r));let i=D(n.monto);r.entro+=i,n.cuentaDeCobroId===void 0||n.cuentaDeCobroId===""?r.deFuera+=i:r.deTrabajo+=i;let u=o.get(n.id);if(!u){r.sinAsignar+=i;continue}for(let d of u.obligaciones)r.aObligaciones+=D(d.monto),se(r._detalle,d);for(let d of u.abonos)r.aMetas+=D(d.monto),se(r._detalle,d);for(let d of u.gastos??[])r.enGastos+=D(d.monto),se(r._detalle,d);r.alAhorro+=D(u.alAhorro),r.sinAsignar+=ge(u,n)}return[...t.values()].map(({_detalle:n,...s})=>({...s,detalle:[...n.values()].sort((r,i)=>i.monto-r.monto)})).sort((n,s)=>n.mes.localeCompare(s.mes))}function ka(e){let a=new Map;for(let o of e)for(let t of[...o.obligaciones,...o.abonos,...o.gastos??[]])se(a,t);return[...a.values()].sort((o,t)=>t.monto-o.monto)}function V(e){let[a,o]=e.split("-"),t=Number(o)-1;return ca[t]?`${ca[t]} de ${a}`:e}function za(e,a,o,t=[]){let n=new Map,s=new Map,r=new Map(t.map(c=>[c.id,c.nombre])),i=c=>r.get(c)??c;for(let c of e){let u=Ie(c.numero,a,Math.max(1,o)),d=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,p=n.get(d);p||(p={mes:d,entro:0,aObligaciones:0,aMetas:0,alAhorro:0,detalle:[],pagos:[]},n.set(d,p),s.set(d,new Map));let g=s.get(d);p.pagos.push(c.numero),p.entro+=D(c.ingreso);for(let h of c.obligaciones)p.aObligaciones+=D(h.monto),se(g,{nombre:h.nombre,monto:h.monto});for(let h of c.abonos)p.aMetas+=D(h.monto),se(g,{nombre:i(h.metaId),monto:h.monto,refId:h.metaId,...h.deLoQueSobro?{deLoQueSobro:h.deLoQueSobro}:{}});p.alAhorro+=D(c.aColchon)+D(c.sobrante)}return[...n.values()].map(c=>({...c,detalle:[...s.get(c.mes).values()].sort((u,d)=>d.monto-u.monto)})).sort((c,u)=>c.mes.localeCompare(u.mes))}function we(e,a){let o=new Set(a.map(t=>t.cuentaDeCobroId).filter(t=>!!t));return e.cuentaDeCobroId?o.has(e.cuentaDeCobroId)?o.size:o.size+1:Math.max(1,o.size)}function J(e){return(e??[]).filter(a=>D(a.monto)!==0)}function Ha(e,a){let o=new Set([...J(a.obligaciones),...J(a.abonos)].map(t=>t.nombre));return[...J(e.obligaciones),...J(e.abonos)].map(t=>t.nombre).filter(t=>!o.has(t))}function Va(e,a,o,t){let n=a.find(r=>r.nombre.trim()===e.trim());if(n)return n.compra?{tipo:"ya-comprada"}:D(n.abonado??0)>=D(n.valor)?{tipo:"ya-pagada"}:(n.desdePago??1)>t?{tipo:"empieza-despues",pago:n.desdePago}:{tipo:"no-se-sabe"};let s=o.find(r=>r.nombre.trim()===e.trim());return s?s.valor<=0?{tipo:"en-cero"}:s.modo==="primer_pago"&&t>1?{tipo:"solo-el-primer-pago"}:(s.desdePago??1)>t?{tipo:"empieza-despues",pago:s.desdePago}:s.modo==="puntual"?{tipo:"puntual"}:{tipo:"no-se-sabe"}:{tipo:"ya-no-esta"}}function Ba(e,a,o,t=new Map){return[...new Set([...e.map(s=>s.mes),...a.map(s=>s.mes)])].sort().map(s=>{let r=e.find(d=>d.mes===s)??null,i=a.find(d=>d.mes===s)??null,c=s<o?"pasado":s===o?"actual":"futuro",u=t.get(s)??(r?{monto:r.entro,segun:"escenario"}:null);return{mes:s,estado:c,real:i,simulado:r,esperado:u,diferencia:c==="pasado"&&u&&i?i.entro-u.monto:null}})}function da(e){let a=0,o=0,t=0,n=0,s=0,r=0;for(let i of e)i.real&&(n+=1,a+=i.real.entro,o+=i.real.aObligaciones+i.real.aMetas+i.real.enGastos,t+=i.real.alAhorro),i.estado==="futuro"&&i.simulado&&(r+=1,s+=i.esperado?.monto??i.simulado.entro);return{mesesConDatos:n,entroDeVerdad:a,gastadoDeVerdad:o,guardadoDeVerdad:t,faltaPorEntrar:s,mesesQueFaltan:r}}var Rt=new Map(ca.map((e,a)=>[e,String(a+1).padStart(2,"0")]));function Pt(e,a){let o=e.toLowerCase().trim(),t=o.match(/^(\d{4})-(\d{2})/);if(t)return`${t[1]}-${t[2]}`;let n=o.match(/([a-záéíóú]+)\D+(\d{4})/);if(n){let r=Rt.get(n[1]);if(r)return`${n[2]}-${r}`}let s=a.slice().sort((r,i)=>r.fecha.localeCompare(i.fecha))[0];return s?_a(s.fecha):null}function Qa(e,a,o,t){let n=new Map;for(let s of e){let r=a.filter(c=>c.cuentaDeCobroId!==void 0),i=Pt(s.periodo,r);i&&n.set(i,D(s.montoEsperado))}return new Map(t.map(s=>{let r=n.get(s);return[s,r!==void 0?{monto:r,segun:"cuenta_de_cobro"}:{monto:D(o),segun:"escenario"}]}))}function Ga(e,a){let o=s=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=new Map(a.map(s=>[o(s.nombre),s])),n=[];for(let s of J(e.gastos)){let r=t.get(o(s.nombre));r&&n.push({gasto:s,metaId:r.id,metaNombre:r.nombre})}return n}function be(e,a){let o=new Map;for(let t of a)for(let n of t.abonos)n.refId&&o.set(n.refId,(o.get(n.refId)??0)+D(n.monto));return new Map(e.map(t=>{let n=D(t.valor),s=D(t.abonado??0),r=o.get(t.id)??0,i=Math.min(s+r,n);return[t.id,{previo:s,real:r,total:i,falta:Math.max(0,n-i)}]}))}function ua(e,a){let o=be(e,a);return e.map(t=>({...t,abonado:o.get(t.id).total}))}function Ua(e,a){let o=0;for(let t of be(e,a).values())o+=t.total;return o}var Ct=600;function fe(e){let a=Te(e.metas),o=e.maxPagos??Ct,t=[],n=new Map,s=new Map,r=new Map,i=new Map,c=0,d=Math.max(1,Math.round(e.desdePago??1))-1;for(;t.length<o&&[...a.values()].some(g=>g>0);){d+=1;let g=ne(d,D(Le(e.ingresoEsperado,e.cambiosIngreso,d)),e.obligaciones,e.colchon,e.metas,a,c);c=g.saldoAhorro,t.push(g);for(let h of g.abonos)n.has(h.metaId)||n.set(h.metaId,d),r.set(h.metaId,(r.get(h.metaId)??0)+1),i.set(h.metaId,(i.get(h.metaId)??0)+h.monto),(a.get(h.metaId)??0)<=0&&s.set(h.metaId,d)}let p=e.metas.map(g=>{let h=Math.min(D(g.abonado??0),D(g.valor)),y=i.get(g.id)??0;return{metaId:g.id,nombre:g.nombre,grupo:g.grupo,valor:g.valor,pagoInicio:n.get(g.id)??null,pagoFin:s.get(g.id)??null,cantidadPagos:r.get(g.id)??0,totalAbonado:h+y,completada:(a.get(g.id)??0)<=0,yaEstabaPagada:h>=D(g.valor)}});return{escenario:e.nombre,pagos:t,metas:p,totalPagos:d,ahorroFinal:c,incompleta:t.length>=o&&p.some(g=>!g.completada)}}function Ya(e){let a=new Map;for(let o of e.metas){if(!o.grupo)continue;let t=a.get(o.grupo)??[];t.push(o),a.set(o.grupo,t)}return[...a.entries()].map(([o,t])=>{let n=t.map(i=>i.pagoInicio).filter(i=>i!==null),s=t.map(i=>i.pagoFin).filter(i=>i!==null),r=t.every(i=>i.completada);return{grupo:o,valor:t.reduce((i,c)=>i+c.valor,0),pagoInicio:n.length?Math.min(...n):null,pagoFin:r&&s.length?Math.max(...s):null,totalAbonado:t.reduce((i,c)=>i+c.totalAbonado,0),completado:r,yaEstabaPagado:t.every(i=>i.yaEstabaPagada)}})}function Ja(e,a){return a.filter(t=>t.antesDelPago&&t.antesDelPago>0).map(t=>{let n=e.metas.find(i=>i.metaId===t.id),s=n?.pagoFin??null,r=n?.yaEstabaPagada?0:s;return{metaId:t.id,nombre:t.nombre,queria:Math.round(t.antesDelPago),termina:r,seRetrasa:r===null?null:Math.max(0,r-Math.round(t.antesDelPago))}})}function Xa(e,a){let o=D(a);if(o<=0)return null;let t=fe(e),n=fe({...e,ingresoEsperado:D(e.ingresoEsperado)+o,maxPagos:1}),s=new Map(n.metas.map(c=>[c.metaId,c.totalAbonado])),i=1+fe({...e,metas:e.metas.map(c=>({...c,abonado:Math.max(D(c.abonado??0),s.get(c.id)??0)}))}).totalPagos;return{pendiente:o,pagosAhora:t.totalPagos,pagosSiPagan:i,seAdelanta:Math.max(0,t.totalPagos-i)}}function pa(e,a,o){return new Date(e,a-1,o)}function Oe(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function At(e){let a=e.getDay();return a===1?e:Oe(e,(8-a)%7)}function It(e){let a=e%19,o=Math.floor(e/100),t=e%100,n=Math.floor(o/4),s=o%4,r=Math.floor((o+8)/25),i=Math.floor((o-r+1)/3),c=(19*a+o-n-i+15)%30,u=Math.floor(t/4),d=t%4,p=(32+2*s+2*u-c-d)%7,g=Math.floor((a+11*c+22*p)/451),h=Math.floor((c+p-7*g+114)/31),y=(c+p-7*g+114)%31+1;return pa(e,h,y)}function qt(e){let a=It(e),o=s=>Oe(a,s),t=[[1,1,"A\xF1o Nuevo"],[5,1,"D\xEDa del Trabajo"],[7,20,"Independencia de Colombia"],[8,7,"Batalla de Boyac\xE1"],[12,8,"Inmaculada Concepci\xF3n"],[12,25,"Navidad"]],n=[[1,6,"Reyes Magos"],[3,19,"San Jos\xE9"],[6,29,"San Pedro y San Pablo"],[8,15,"Asunci\xF3n de la Virgen"],[10,12,"D\xEDa de la Raza"],[11,1,"Todos los Santos"],[11,11,"Independencia de Cartagena"]];return[...t.map(([s,r,i])=>({fecha:pa(e,s,r),nombre:i})),...n.map(([s,r,i])=>({fecha:At(pa(e,s,r)),nombre:i})),{fecha:o(-3),nombre:"Jueves Santo"},{fecha:o(-2),nombre:"Viernes Santo"},{fecha:o(43),nombre:"Ascensi\xF3n del Se\xF1or"},{fecha:o(64),nombre:"Corpus Christi"},{fecha:o(71),nombre:"Sagrado Coraz\xF3n de Jes\xFAs"}].sort((s,r)=>s.fecha.getTime()-r.fecha.getTime())}var he=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;function ma(e){return qt(e.getFullYear()).find(a=>he(a.fecha)===he(e))?.nombre??null}function Tt(e){return ma(e)!==null}function ga(e){return e.getDay()===0}function Wa(e){let a=new Date(e.getTime());for(let o=0;o<15&&(ga(a)||Tt(a));o++)a=Oe(a,-1);return a}var Ka=30,Za="Febrero no tiene 30: se radica el \xFAltimo d\xEDa del mes (28, o 29 si es bisiesto), y si ese d\xEDa cae domingo o festivo se retrocede igual que siempre.";function Lt(e,a){let o=new Date(e,a,0).getDate(),t=o<Ka,n=new Date(e,a-1,Math.min(Ka,o)),s=Wa(n),r=null;if(he(s)!==he(n)){let i=ma(n);r=i?`el ${n.getDate()} es festivo (${i})`:ga(n)?`el ${n.getDate()} cae domingo`:`el ${n.getDate()} no es d\xEDa h\xE1bil`}return{fecha:s,fechaOriginal:n,motivoDelCambio:r,usoUltimoDiaDelMes:t}}var ba=[{id:"cuenta",nombre:"Cuenta de cobro diligenciada",frecuencia:"cada_mes",detalle:"Con una descripci\xF3n del servicio prestado."},{id:"informe",nombre:"Informe de actividades",frecuencia:"cada_mes",detalle:"Detallando espec\xEDficamente las funciones o actividades realizadas."},{id:"conformidad",nombre:"Certificado de conformidad del servicio",frecuencia:"cada_mes",detalle:"Lo entrega el coordinador o l\xEDder del \xE1rea: hay que ped\xEDrselo con tiempo."},{id:"seguridad_social",nombre:"Planilla de seguridad social",frecuencia:"cada_mes",obligatorioExplicito:!0,detalle:"Liquidada del mes VENCIDO al que se est\xE1 cobrando. La circular la marca como obligatoria."},{id:"constancia",nombre:"Constancia de prestaci\xF3n de servicio firmada por el paciente",frecuencia:"solo_asistencial",detalle:"Solo personal asistencial. Como t\xE9cnico de sistemas, no aplica."},{id:"rut",nombre:"RUT actualizado",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez."},{id:"bancaria",nombre:"Certificaci\xF3n bancaria",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez, o si cambia de cuenta."}];function je(){return ba.filter(e=>e.frecuencia==="cada_mes")}var wt=5;function Ot(e,a){let o=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),t=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return Math.round((t-o)/864e5)}var eo=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function fa(e,a=[]){let o=Lt(e.getFullYear(),e.getMonth()+1),t=Ot(e,o.fecha),n=t<0?"vencido":t===0?"hoy":t<=wt?"pronto":"tranquilo",s=o.fecha.getDate(),r=eo[o.fecha.getMonth()],i=n==="vencido"?`Se pas\xF3 la fecha: hab\xEDa que radicar el ${s} de ${r}`:n==="hoy"?"HOY es el \xFAltimo d\xEDa para radicar la cuenta de cobro":n==="pronto"?`Faltan ${t} d\xEDas: radicas el ${s} de ${r}`:`La cuenta de cobro se radica el ${s} de ${r}`,c=je().filter(u=>!a.includes(u.id)).map(u=>u.id);return{limite:o,diasQueFaltan:t,urgencia:n,titular:i,soportesPendientes:c}}function ao(e){let a=e.fecha.getDate(),o=eo[e.fecha.getMonth()];return e.motivoDelCambio?`Se radica el ${a} de ${o}, no el ${e.fechaOriginal.getDate()}, porque ${e.motivoDelCambio}.`:`Se radica el ${a} de ${o}.`}function $e(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function jt(){return new Date().toISOString().slice(0,10)}function Ft(){return[]}function X(){return{version:1,escenario:{nombre:"Mi escenario",ingresoEsperado:2e6,colchonBase:1e5,colchonMinimo:0,colchonElastico:!1,fechaPrimerPago:jt(),diasOptimista:30,diasPesimista:60},obligaciones:Ft(),metas:[],cuentas:[],ingresos:[],repartos:[],soportesMarcados:{}}}function W(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}var oo="gestiondinerotrabajo.estado";function to(e){let a=X();if(typeof e!="object"||e===null)return a;let o=e;return{version:1,escenario:{...a.escenario,...o.escenario??{}},obligaciones:o.obligaciones??a.obligaciones,metas:o.metas??a.metas,cuentas:o.cuentas??a.cuentas,ingresos:o.ingresos??a.ingresos,repartos:o.repartos??a.repartos,soportesMarcados:o.soportesMarcados??a.soportesMarcados,notasDelMes:o.notasDelMes??{}}}function no(){let e=null;try{e=localStorage.getItem(oo)}catch{return{estado:X(),aviso:{texto:"No pude leer los datos guardados. Est\xE1s viendo un inicio en blanco.",grave:!0}}}if(!e)return{estado:X(),aviso:null};try{return{estado:to(JSON.parse(e)),aviso:null}}catch{return{estado:X(),aviso:{texto:"Los datos guardados est\xE1n da\xF1ados. No los borr\xE9: sigue ah\xED el archivo por si se puede recuperar.",grave:!0}}}}function re(e){try{return localStorage.setItem(oo,JSON.stringify(e)),null}catch(a){return a instanceof Error?a.message:"no se pudo guardar"}}function so(e){return JSON.stringify(e,null,2)}function ha(e){try{return{estado:to(JSON.parse(e)),aviso:null}}catch{return{estado:null,aviso:{texto:"Ese archivo no es un respaldo v\xE1lido. No cambi\xE9 nada de lo que ten\xEDas.",grave:!0}}}}var $a=null;function B(e){return $a?.(),new Promise(a=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${ve(e.titulo)}</h3>
        ${e.detalle?`<p class="dlg-detalle">${ve(e.detalle)}</p>`:""}
        ${e.largo?`<textarea class="dlg-campo" rows="6">${ve(e.valorInicial??"")}</textarea>`:`<input class="dlg-campo" type="text" ${e.dinero?'inputmode="numeric" data-dinero':""}
               value="${ve(e.valorInicial??"")}" />`}
        <div class="dlg-botones">
          <button class="dlg-cancelar">Cancelar</button>
          <button class="primario dlg-aceptar">${ve(e.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=o.querySelector(".dlg-campo"),n=i=>{document.removeEventListener("keydown",r,!0),o.remove(),$a=null,a(i)},s=()=>n(t.value);function r(i){i.key==="Escape"&&(i.preventDefault(),n(null));let c=e.largo?i.ctrlKey:!0;i.key==="Enter"&&c&&document.activeElement===t&&(i.preventDefault(),s())}o.querySelector(".dlg-aceptar").addEventListener("click",s),o.querySelector(".dlg-cancelar").addEventListener("click",()=>n(null)),o.addEventListener("mousedown",i=>{i.target===o&&n(null)}),document.addEventListener("keydown",r,!0),document.body.appendChild(o),$a=()=>n(null),t.focus(),t.select()})}function ve(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var ro=new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});function va(e){return e.replace(/\D/g,"")}function _t(e){let a=va(e);if(a==="")return"";let o=a.replace(/^0+(?=\d)/,"");return ro.format(Number(o))}function O(e){let a=va(e);return a===""?0:Number(a)}function I(e){return ro.format(Math.round(e))}function io(e){let a=e.value,o=e.selectionStart??a.length,t=va(a.slice(0,o)).length,n=_t(a);if(n===a)return;e.value=n;let s=0,r=0;for(;r<n.length&&s<t;)/\d/.test(n[r])&&s++,r++;e.setSelectionRange(r,r)}function Da(e){let a=e?.trim();if(!a)return null;try{let o=new URL(/^[a-z][a-z0-9+.-]*:/i.test(a)?a:`https://${a}`);return o.protocol==="http:"||o.protocol==="https:"?o.href:null}catch{return null}}function co(e,a){let o=[],t=0;for(let n of a){let s=Math.max(1,Math.round(n)||1),r=e[t];o.push(s>1||!r?null:r),t+=s}return o}var kt=4;function lo(e){return e.length>=kt}var H="__borrado";function De(e,a){return e[a]??""}function Q(e){if(e==null)return"null";if(Array.isArray(e))return`[${e.map(Q).join(",")}]`;if(typeof e=="object"){let a=e;return`{${Object.keys(a).filter(t=>a[t]!==void 0).sort().map(t=>`${JSON.stringify(t)}:${Q(a[t])}`).join(",")}}`}return JSON.stringify(e)}function Fe(e,a){return Q(e)===Q(a)}function uo(e,a,o,t){return e!==o?e>o:Q(a)>=Q(t)}function po(e,a,o,t={}){let n={...t},s=new Set([...Object.keys(e??{}),...Object.keys(a)]);for(let r of s){if(r==="id")continue;let i=e===null?void 0:e[r],c=a[r];Fe(i,c)||(n[r]=o)}return n}function zt(e,a){if(e.datos.id!==a.datos.id)throw new Error(`No se pueden fusionar dos filas distintas: ${e.datos.id} y ${a.datos.id}.`);let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t={id:e.datos.id},n={},s=[];for(let p of o){if(p==="id")continue;let g=e.datos[p],h=a.datos[p],y=De(e.tocado,p),M=De(a.tocado,p),b=uo(y,g,M,h),v=b?g:h,R=b?h:g;v!==void 0&&(t[p]=v);let C=y>M?y:M;C!==""&&(n[p]=C),Fe(g,h)||s.push({id:e.datos.id,campo:p,valor:R,cuando:b?M:y,gano:v})}let r=De(e.tocado,H),i=De(a.tocado,H),c=uo(r,e.borradoEn,i,a.borradoEn),u=c?e.borradoEn:a.borradoEn,d=r>i?r:i;return d!==""&&(n[H]=d),Fe(e.borradoEn,a.borradoEn)||s.push({id:e.datos.id,campo:H,valor:c?a.borradoEn:e.borradoEn,cuando:c?i:r,gano:u}),{fila:{datos:t,tocado:n,borradoEn:u??null},descartes:s}}function Ht(e,a){let o=e.datos.propuesto,t=a.datos.propuesto;return o===!1&&t===!0?e:t===!1&&o===!0?a:null}function Vt(e,a){let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t=[];for(let n of o){if(n==="id")continue;let s=e.datos[n],r=a.datos[n];JSON.stringify(s)!==JSON.stringify(r)&&t.push({id:e.datos.id,campo:n,valor:r,cuando:De(a.tocado,n),gano:s})}return t}function mo(e,a){let o=new Map(a.map(s=>[s.datos.id,s])),t=[],n=[];for(let s of e){let r=o.get(s.datos.id);if(!r){t.push(s);continue}let i=Ht(s,r);if(i){t.push(i),n.push(...Vt(i,i===s?r:s)),o.delete(s.datos.id);continue}let c=zt(s,r);t.push(c.fila),n.push(...c.descartes),o.delete(s.datos.id)}for(let s of a)o.has(s.datos.id)&&t.push(s);return{filas:t,descartes:n}}function go(e,a){return a?e.filter(o=>{let t=a.get(o.id);if(!t)return!0;let n=o.campo===H?t.borradoEn:t.datos[o.campo];return!Fe(o.valor,n)}):e}var U=["escenario","obligaciones","metas","cuentas","ingresos","repartos","soportes"],Bt="escenario";function K(e,a){return{datos:{...a,id:e},tocado:{},borradoEn:null}}var Qt=["ordenMetas","ordenObligaciones"];function bo(e,a){if(!Array.isArray(a))return e;let o=new Map(a.map((n,s)=>[String(n),s]));return[...e.filter(n=>o.has(n.id)).sort((n,s)=>o.get(n.id)-o.get(s.id)),...e.filter(n=>!o.has(n.id))]}function ie(e){return{escenario:[K(Bt,{...e.escenario,ordenMetas:e.metas.map(a=>a.id),ordenObligaciones:e.obligaciones.map(a=>a.id)})],obligaciones:e.obligaciones.map(a=>K(a.id,{...a})),metas:e.metas.map(a=>K(a.id,{...a})),cuentas:e.cuentas.map(a=>K(a.id,{...a})),ingresos:e.ingresos.map(a=>K(a.id,{...a})),repartos:e.repartos.map(a=>K(a.id,{...a})),soportes:Gt(e)}}function Gt(e){let a=e.notasDelMes??{};return[...new Set([...Object.keys(e.soportesMarcados),...Object.keys(a).filter(t=>a[t].trim()!=="")])].sort().map(t=>K(t,{...t in e.soportesMarcados?{marcados:e.soportesMarcados[t]}:{},...a[t]?.trim()?{nota:a[t]}:{}}))}function Ne(e,a){let o=c=>(e[c]??[]).filter(u=>u.borradoEn===null),t=c=>e[c]!==void 0&&e[c].length>0,n=t("escenario")?{...a.escenario,...o("escenario")[0]?.datos}:a.escenario;n&&"id"in n&&delete n.id;let s=(t("escenario")?o("escenario")[0]?.datos:void 0)??{};for(let c of Qt)delete n[c];let r={},i={};for(let c of o("soportes")){let{marcados:u,nota:d}=c.datos;Array.isArray(u)&&(r[c.datos.id]=u),typeof d=="string"&&d.trim()!==""&&(i[c.datos.id]=d)}return{version:a.version,escenario:n,obligaciones:bo(t("obligaciones")?o("obligaciones").map(c=>c.datos):a.obligaciones,s.ordenObligaciones),metas:bo(t("metas")?o("metas").map(c=>c.datos):a.metas,s.ordenMetas),cuentas:t("cuentas")?o("cuentas").map(c=>c.datos):a.cuentas,ingresos:t("ingresos")?o("ingresos").map(c=>c.datos):a.ingresos,repartos:t("repartos")?o("repartos").map(c=>c.datos):a.repartos,soportesMarcados:t("soportes")?r:a.soportesMarcados,notasDelMes:t("soportes")?i:a.notasDelMes??{}}}function fo(e){return{id:e.datos.id,datos:e.datos,tocado:e.tocado,borrado_en:e.borradoEn}}function ho(e){let a=e.datos??{};return{datos:{...a,id:String(e.id??a.id??"")},tocado:e.tocado??{},borradoEn:e.borrado_en??null}}function $o(e,a,o,t={}){let n=ie(e),s=a?ie(a):null,r={};for(let i of U){let c=new Map((s?.[i]??[]).map(g=>[g.datos.id,g])),u=t[i]??new Map,d=n[i].map(g=>({...g,tocado:po(c.get(g.datos.id)?.datos??null,g.datos,o,u.get(g.datos.id)??{})})),p=new Set(n[i].map(g=>g.datos.id));for(let[g,h]of c)p.has(g)||d.push({datos:h.datos,tocado:{...u.get(g)??{},[H]:o},borradoEn:o});r[i]=d}return r}var Z={url:"https://voncmkjcxzgxfloehovb.supabase.co",clave:"sb_publishable_Ev68VoFXNXqvcVOjgXoknw_vAFK-iHn"},Ma="gestiondinerotrabajo.sesion",ke="gestiondinerotrabajo.ultimaSincronizacion",_e="gestiondinerotrabajo.nube.sincronizado";function ze(){try{let e=localStorage.getItem(Ma);return e?JSON.parse(e):null}catch{return null}}function Ea(e){try{e?localStorage.setItem(Ma,JSON.stringify(e)):localStorage.removeItem(Ma)}catch{}}function ya(){Ea(null);try{localStorage.removeItem(ke),localStorage.removeItem(_e)}catch{}}function vo(){try{let e=localStorage.getItem(_e);return e?JSON.parse(e):null}catch{return null}}function He(e){try{e?localStorage.setItem(_e,JSON.stringify(e)):localStorage.removeItem(_e)}catch{}}async function Do(e,a){let o=await fetch(`${Z.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:Z.clave,"Content-Type":"application/json"},body:JSON.stringify({email:e.trim(),password:a})}),t=await o.json().catch(()=>({}));if(!o.ok)throw new Error(Ut(o.status,t));let n={token:t.access_token,refresco:t.refresh_token,usuarioId:t.user?.id??"",correo:t.user?.email??e.trim(),caduca:Date.now()+(Number(t.expires_in)||3600)*1e3};if(!n.token||!n.usuarioId)throw new Error("Supabase respondi\xF3 sin sesi\xF3n. Revisa la direcci\xF3n del proyecto.");return Ea(n),n}function Ut(e,a){let o=String(a.error_description??a.msg??a.message??"");return e===400&&/invalid login|credentials/i.test(o)?"Correo o contrase\xF1a incorrectos.":e===400&&/email not confirmed/i.test(o)?"Falta confirmar el correo: mira el mensaje que te mand\xF3 Supabase.":e===422?"Ese correo no tiene un formato v\xE1lido.":e===429?"Demasiados intentos seguidos. Espera un momento.":o||`No se pudo entrar (error ${e}).`}async function xa(){let e=ze();if(!e)throw new Error("No has entrado con tu correo.");if(Date.now()<e.caduca-6e4)return e;let a=await fetch(`${Z.url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:Z.clave,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e.refresco})});if(!a.ok)throw ya(),new Error("La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.");let o=await a.json(),t={...e,token:o.access_token,refresco:o.refresh_token??e.refresco,caduca:Date.now()+(Number(o.expires_in)||3600)*1e3};return Ea(t),t}function Mo(e){return{apikey:Z.clave,Authorization:`Bearer ${e.token}`,"Content-Type":"application/json"}}async function Eo(e,a,o){let t=o?`&actualizado_en=gt.${encodeURIComponent(o)}`:"",n=await fetch(`${Z.url}/rest/v1/${a}?select=*${t}`,{headers:Mo(e)});if(!n.ok)throw new Error(await xo(n,a,"bajar"));return(await n.json()).map(ho)}async function yo(e,a,o){if(o.length===0)return;let t=o.map(s=>({...fo(s),usuario_id:e.usuarioId})),n=await fetch(`${Z.url}/rest/v1/${a}?on_conflict=usuario_id,id`,{method:"POST",headers:{...Mo(e),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(t)});if(!n.ok)throw new Error(await xo(n,a,"subir"))}async function xo(e,a,o){let t=await e.text().catch(()=>"");return e.status===401?"La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.":e.status===404||/does not exist/i.test(t)?`Falta la tabla \xAB${a}\xBB en Supabase: ejecuta supabase/esquema.sql.`:e.status===403||/permission denied/i.test(t)?`Sin permiso sobre \xAB${a}\xBB. Revisa los grants del esquema.`:`No se pudo ${o} \xAB${a}\xBB (error ${e.status}).`}async function So(e,a,o){let t=await xa(),n=Ve(),s=$o(e,a,o),r=a?ie(a):null,i={},c=[];for(let d of U){let p=s[d],g=await Eo(t,d,n),h=mo(p,g);i[d]=h.filas;let y=r?new Map(r[d].map(v=>[v.datos.id,{datos:v.datos,borradoEn:v.borradoEn}])):null,M=new Map(h.filas.map(v=>[v.datos.id,v.datos]));c.push(...go(h.descartes,y).map(v=>{let R=M.get(v.id),C=typeof R?.nombre=="string"?R.nombre:typeof R?.periodo=="string"?R.periodo:void 0;return{...v,tabla:d,nombre:C}}));let b=new Set(p.filter(v=>Object.keys(v.tocado).length>0).map(v=>v.datos.id));for(let v of h.descartes)b.add(v.id);await yo(t,d,h.filas.filter(v=>b.has(v.datos.id)))}let u=new Date().toISOString();try{localStorage.setItem(ke,u)}catch{}return{estado:Ne(i,e),descartes:c,cuando:u}}async function Ro(){let e=await xa(),a={};for(let o of U)a[o]=await Eo(e,o,null);return a}async function Po(e){let a=await xa();for(let t of U)await yo(a,t,e[t]??[]);let o=new Date().toISOString();try{localStorage.setItem(ke,o)}catch{}return o}function Ve(){try{return localStorage.getItem(ke)}catch{return null}}function Co(e,a){let o=[];for(let t of U){let n=new Map((e[t]??[]).map(i=>[i.datos.id,i])),s=new Map((a[t]??[]).map(i=>[i.datos.id,i])),r=[...n.keys(),...[...s.keys()].filter(i=>!n.has(i))];for(let i of r){let c=n.get(i),u=s.get(i),d={tabla:t,id:i};if(c&&!u){o.push({...d,clave:`${t}|${i}|fila`,tipo:"solo-aqui",aqui:c.datos,nube:void 0,datos:c.datos});continue}if(!c&&u){if(u.borradoEn)continue;o.push({...d,clave:`${t}|${i}|fila`,tipo:"solo-nube",aqui:void 0,nube:u.datos,datos:u.datos});continue}if(!c||!u)continue;if(u.borradoEn){o.push({...d,clave:`${t}|${i}|fila`,tipo:"borrada-en-la-nube",aqui:c.datos,nube:null,datos:c.datos});continue}let p=c.datos.propuesto===!1&&u.datos.propuesto===!0?"aqui":u.datos.propuesto===!1&&c.datos.propuesto===!0?"nube":void 0,g=new Set([...Object.keys(c.datos),...Object.keys(u.datos)]);for(let h of g){if(h==="id")continue;let y=c.datos[h],M=u.datos[h];Q(y)!==Q(M)&&o.push({...d,clave:`${t}|${i}|${h}`,tipo:"campo",campo:h,aqui:y,nube:M,datos:c.datos,confirmadoEn:p})}}}return o}function Sa(e,a){let o={};for(let t of e)o[t.clave]=t.tipo==="solo-aqui"?"aqui":t.tipo==="solo-nube"?"nube":t.tipo==="borrada-en-la-nube"?"aqui":t.confirmadoEn??(a==="subir"?"aqui":"nube");return o}function Ao(e,a,o,t,n){let s=d=>t[d.clave]??Sa([d],"subir")[d.clave],r=new Map;for(let d of o){let p=`${d.tabla}|${d.id}`;r.set(p,[...r.get(p)??[],d])}let i=d=>({datos:d.datos,tocado:{...d.tocado,[H]:n},borradoEn:n}),c={};for(let d of U){let p=new Map((e[d]??[]).map(M=>[M.datos.id,M])),g=new Map((a[d]??[]).map(M=>[M.datos.id,M])),h=[...p.keys(),...[...g.keys()].filter(M=>!p.has(M))],y=[];for(let M of h){let b=p.get(M),v=g.get(M),R=r.get(`${d}|${M}`)??[],C=R.find(L=>L.tipo!=="campo");if(b&&!v)y.push(C&&s(C)==="nube"?i(b):b);else if(!b&&v)v.borradoEn?y.push(v):y.push(C&&s(C)==="aqui"?i(v):v);else if(b&&v&&v.borradoEn)y.push(C&&s(C)==="nube"?v:{datos:b.datos,tocado:{...v.tocado,...b.tocado,[H]:n},borradoEn:null});else if(b&&v){let L={...b.datos},G={...v.tocado,...b.tocado};for(let w of R)w.tipo!=="campo"||!w.campo||(s(w)==="nube"&&(v.datos[w.campo]===void 0?delete L[w.campo]:L[w.campo]=v.datos[w.campo]),G[w.campo]=n);y.push({datos:L,tocado:G,borradoEn:null})}}c[d]=y}let u=c.escenario[0];if(u){let d={...u.datos};for(let[p,g]of[["ordenMetas","metas"],["ordenObligaciones","obligaciones"]]){let h=c[g].filter(M=>!M.borradoEn).map(M=>M.datos.id),y=Array.isArray(d[p])?d[p]:[];d[p]=[...y.filter(M=>h.includes(M)),...h.filter(M=>!y.includes(M))]}c.escenario[0]={...u,datos:d}}return c}var Ge="__borrado",Qe=new Intl.NumberFormat("es-CO"),Yt={obligaciones:"obligaciones",abonos:"abonos a metas",gastos:"gastos",cambios:"cambios de valor",valor:"valor",nombre:"nombre",grupo:"grupo",abonado:"ya pagado antes",alAhorro:"al ahorro",monto:"monto",fecha:"fecha",ingresoEsperado:"ingreso esperado",fechaPrimerPago:"fecha del primer pago",marcados:"soportes marcados",clase:"compra o deuda",ordenMetas:"orden (prioridad) de las metas",ordenObligaciones:"orden de las obligaciones",desdePago:"empieza en el pago",maximoPorPago:"m\xE1ximo por pago",enCuotas:"reunirla en N pagos",antesDelPago:"la quiero antes del pago",colchonBase:"otros / ahorro por pago",colchonMinimo:"del ahorro no bajar de",colchonElastico:"usar el ahorro para adelantar metas",sobranteAMetas:"usar lo que sobra del mes en las metas siguientes",cambiosColchon:"cambios del ahorro",cambiosIngreso:"cambios del pago",diasOptimista:"d\xEDas entre pagos, si son puntuales",diasPesimista:"d\xEDas entre pagos, si se atrasan",tipo:"c\xF3mo se calcula",modo:"cada cu\xE1ndo",montoEsperado:"monto esperado",periodo:"periodo",propuesto:"sin confirmar",compra:"ya la compraste",nota:"nota",link:"enlace",cuentaDeCobroId:"cuenta de cobro",ingresoId:"pago"};function Ue(e,a){switch(e.tabla){case"metas":{let o=a.metas.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la meta \xAB${o}\xBB`:"una meta que ya no est\xE1"}case"obligaciones":{let o=a.obligaciones.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la obligaci\xF3n \xAB${o}\xBB`:"una obligaci\xF3n que ya no est\xE1"}case"cuentas":{let o=a.cuentas.find(t=>t.id===e.id);return o?`la cuenta de cobro de ${o.periodo}`:"una cuenta de cobro que ya no est\xE1"}case"ingresos":{let o=a.ingresos.find(t=>t.id===e.id);return o?`el pago del ${o.fecha} (${Qe.format(o.monto)})`:"un pago que ya no est\xE1"}case"repartos":{let o=a.repartos.find(n=>n.id===e.id),t=o?a.ingresos.find(n=>n.id===o.ingresoId):void 0;return t?`el reparto del pago del ${t.fecha} (${Qe.format(t.monto)})`:"un reparto de un pago que ya no est\xE1"}case"escenario":return"el escenario";case"soportes":return`el mes ${V(e.id)}`}}function Me(e){return e===Ge?"borrado":Yt[e]??e}function Ee(e,a){return e===Ge?a?"borrada":"sin borrar":Be(a)}function Be(e){if(e==null||e==="")return"\u2014";if(typeof e=="number")return Qe.format(e);if(typeof e=="boolean")return e?"s\xED":"no";if(typeof e=="string")return e;if(Array.isArray(e))return e.length===0?"nada":e.map(Be).join(" \xB7 ");if(typeof e=="object"){let a=e;if(typeof a.nombre=="string"&&typeof a.monto=="number")return`${a.nombre} ${Qe.format(a.monto)}`;if(typeof a.desdePago=="number"&&"valor"in a)return`desde el pago ${a.desdePago}: ${Be(a.valor)}`;let o=Object.keys(a).sort().filter(t=>a[t]!==void 0).map(t=>`${Me(t)}: ${Be(a[t])}`);return o.length?o.join(", "):"\u2014"}return String(e)}var ye=[{id:"inicio",rotulo:"Inicio",icono:"\u{1F3E0}",paneles:["inicio","radicacion"]},{id:"calendario",rotulo:"Calendario",icono:"\u{1F5D3}\uFE0F",paneles:["vista"]},{id:"metas",rotulo:"Metas",icono:"\u{1F3AF}",paneles:["metas","proyeccion"]},{id:"registrar",rotulo:"Registrar",icono:"\u{1F4B5}",paneles:["cuentas","real"]},{id:"ajustes",rotulo:"Ajustes",icono:"\u2699\uFE0F",paneles:["escenario","obligaciones","nube"]}],Jt="inicio";function Io(e){return ye.find(a=>a.paneles.includes(e))?.id??null}function Ye(e){return ye.some(a=>a.id===e)?e:Jt}var qo=new Intl.NumberFormat("es-CO"),Ra=e=>`$${qo.format(Math.round(e))}`;function To(e,a,o){let t=[];return t.push(`${e.clase==="deuda"?"\u26A0\uFE0F ":""}${e.nombre.trim()||"(sin nombre)"}`),t.push(Ra(e.valor)),e.compra?t.push("ya la compraste"):a?.yaEstabaPagada?t.push("ya est\xE1 pagada"):o?t.push(o):t.push("sin fecha todav\xEDa"),t.join(" \xB7 ")}function Lo(e,a){let o=e.tipo==="porcentaje"?`${Xt(e.valor*100)} %${a?` = ${Ra(a)}`:""}`:Ra(e.valor),t=e.modo==="cada_pago"?"cada pago":e.modo==="puntual"?"puntual":e.modo==="primer_pago"?"solo el primero":String(e.modo),n=[e.nombre.trim()||"(sin nombre)",o,t];return(e.cambios?.length??0)>0&&n.push(`${e.cambios.length} cambio${e.cambios.length===1?"":"s"}`),n.join(" \xB7 ")}function Xt(e){return Number.isInteger(e)?String(e):qo.format(Math.round(e*10)/10)}function Oo(e,a){let o=new Map(a.map(s=>[s.metaId,s])),t=e.filter(s=>!s.compra&&!o.get(s.id)?.yaEstabaPagada&&s.valor>0),n=null;for(let s of t){let r=o.get(s.id)?.pagoFin??null;r!==null&&(!n||r<n.pagoFin)&&(n={meta:s,pagoFin:r})}return n||(t.length>0?{meta:t[0],pagoFin:null}:null)}function Je(e,a){return e.compra||e.valor<=0?1:Math.max(0,Math.min(1,a/e.valor))}function jo(e,a){let o=2*Math.PI*a,t=e.reduce((s,r)=>s+Math.max(0,r),0),n=0;return e.map(s=>{let r=t>0?Math.max(0,s)/t*o:0,i={largo:r,desde:n};return n+=r,i})}var wo={obligacion:0,meta:1,gasto:2,ahorro:3,"sin-asignar":4};function Fo(e,a,o){let t=new Set(o.map(d=>d.id)),n=new Set(o.map(d=>d.nombre)),s=(d,p)=>d&&a.has(d)?"meta":d&&t.has(d)||n.has(p)?"obligacion":d?"meta":"gasto",r=e.real??e.simulado;if(!r)return null;let i=e.real!==null,c=r.detalle.filter(d=>d.monto>0).map(d=>({nombre:d.nombre,monto:d.monto,tipo:i?s(d.refId,d.nombre):d.refId?"meta":"obligacion"}));r.alAhorro>0&&c.push({nombre:"Queda guardado",monto:r.alAhorro,tipo:"ahorro"}),e.real&&e.real.sinAsignar>0&&c.push({nombre:"Sin repartir todav\xEDa",monto:e.real.sinAsignar,tipo:"sin-asignar"}),c.sort((d,p)=>wo[d.tipo]-wo[p.tipo]||p.monto-d.monto);let u=c.reduce((d,p)=>d+p.monto,0);return u<=0?null:{mes:e.mes,esReal:i,total:u,trozos:c}}function No(e){let a=e.filter(o=>o.real||o.simulado);return(a.find(o=>o.estado==="actual")??a.find(o=>o.estado==="futuro")??a[a.length-1])?.mes??null}function _o(e,a,o,t,n){let s=new Map(a.map(c=>[c.metaId,c])),r=new Map,i=new Map;for(let c of[...t].sort((u,d)=>u.mes.localeCompare(d.mes)))for(let u of c.real?.detalle??[])!u.refId||u.monto<=0||(r.has(u.refId)||r.set(u.refId,c.mes),i.set(u.refId,c.mes));return e.map(c=>{let u=s.get(c.id),d={metaId:c.id,nombre:c.nombre.trim()||"(sin nombre)",esDeuda:c.clase==="deuda"},p=u?.pagoInicio!=null?n(u.pagoInicio):null,g=r.get(c.id)??p;if(c.compra)return{...d,desde:null,hasta:c.compra.mes,estado:"comprada"};if(Je(c,o.get(c.id)??0)>=1){let h=i.get(c.id)??null;return{...d,desde:r.get(c.id)??h,hasta:h,estado:"lista"}}return u?.pagoFin!=null?{...d,desde:g,hasta:n(u.pagoFin),estado:"en-curso"}:{...d,desde:g,hasta:null,estado:g?"no-alcanza":"sin-fecha"}})}function ko(e,a){if(e>a)return[];let o=[],[t,n]=e.split("-").map(Number);for(let s=0;s<240;s++){let r=`${t}-${String(n).padStart(2,"0")}`;if(o.push(r),r===a)break;n++,n>12&&(n=1,t++)}return o}function zo(e,a){if(a.campo===Ge)return{ok:!1,motivo:"Un borrado no se puede deshacer desde aqu\xED: vuelve a crear esa fila."};if(a.campo==="id")return{ok:!1,motivo:"El identificador de una fila no se cambia."};let o=Kt(e,a);if(!o)return{ok:!1,motivo:"Eso ya no est\xE1 en este aparato."};let t=Wt(a);return a.valor===void 0?delete o[t]:o[t]=a.valor,{ok:!0}}function Wt(e){return e.tabla==="soportes"?e.id:e.campo}function Kt(e,a){let o=t=>t.find(n=>n.id===a.id)??null;switch(a.tabla){case"escenario":return e.escenario;case"metas":return o(e.metas);case"obligaciones":return o(e.obligaciones);case"cuentas":return o(e.cuentas);case"ingresos":return o(e.ingresos);case"repartos":return o(e.repartos);case"soportes":return a.campo==="nota"?e.notasDelMes??={}:a.campo!=="marcados"?null:e.soportesMarcados;default:return null}}var Zt=new Intl.NumberFormat("es-CO"),f=e=>`$${Zt.format(Math.round(e))}`,l,x=null;function ee(e=new Date){let a=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${a}-${o}`}function m(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var $=new Map;function Uo(e){if(!(e instanceof HTMLInputElement)&&!(e instanceof HTMLSelectElement))return null;let a=[e.id&&`#${e.id}`,e.dataset.accion&&`[data-accion="${e.dataset.accion}"]`,e.dataset.id&&`[data-id="${e.dataset.id}"]`,e.dataset.campo&&`[data-campo="${e.dataset.campo}"]`,e.dataset.tipo&&`[data-tipo="${e.dataset.tipo}"]`,e.dataset.i!==void 0&&`[data-i="${e.dataset.i}"]`].filter(Boolean);return a.length>0?a.join(""):null}var Xe=null,Ca=null,xe=!1,ce=!1;var aa=null,_=null,en=6,Ze=!1;function an(e){let o=window.innerHeight;e<90?window.scrollBy({top:-Math.max(6,(90-e)/3),behavior:"instant"}):e>o-90&&window.scrollBy({top:Math.max(6,(e-(o-90))/3),behavior:"instant"})}function Yo(e,a){return document.elementFromPoint(e,a)?.closest?.("tr[data-fila]")??null}function on(e){for(let a of document.querySelectorAll(".destino"))a.classList.remove("destino");e&&Number(e.dataset.fila)!==_?.desde&&e.classList.add("destino")}function Jo(){_?.fila.classList.remove("arrastrando");for(let e of document.querySelectorAll(".destino"))e.classList.remove("destino");_=null}document.addEventListener("pointerdown",e=>{let a=e.target?.closest?.(".asa"),o=a?.closest("tr[data-fila]");!a||!o||(_={desde:Number(o.dataset.fila),fila:o,movido:!1,y0:e.clientY},o.classList.add("arrastrando"),a.setPointerCapture?.(e.pointerId),e.preventDefault())});document.addEventListener("pointermove",e=>{_&&(!_.movido&&Math.abs(e.clientY-_.y0)<en||(_.movido=!0,e.preventDefault(),an(e.clientY),on(Yo(e.clientX,e.clientY))))});document.addEventListener("pointerup",e=>{if(!_)return;let{desde:a,movido:o}=_,t=Yo(e.clientX,e.clientY);if(Jo(),!o||!t)return;Ze=!0,setTimeout(()=>{Ze=!1},0);let n=Number(t.dataset.fila);if(!Number.isInteger(n)||n===a)return;let[s]=l.metas.splice(a,1);l.metas.splice(n,0,s),x={texto:`\xAB${s.nombre}\xBB qued\xF3 en la posici\xF3n ${n+1}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron.`,malo:!1},E()});document.addEventListener("pointercancel",()=>{_&&(Jo(),S())});document.addEventListener("mousedown",e=>{let a=e.target;xe=a?.closest("button[data-accion]")!==null&&a?.closest("button[data-accion]")!==void 0,Xe=Uo(a?.closest("input, select")??null),Ca=a?.closest?.("[data-panel]")?.dataset.panel??null},!0);document.addEventListener("mouseup",()=>{setTimeout(()=>{xe=!1,Ca=null,ce&&(ce=!1,Ia())},0)},!0);function tn(e,a){let o=Xe!==null,t=Xe??e;if(Xe=null,!t)return;let n=document.querySelector(t);if(n&&(n.focus(),!o&&a!==null&&typeof n.setSelectionRange=="function"))try{n.setSelectionRange(a,a)}catch{}}function k(){Xo()||Ia()}function E(){Xo()||S()}function Xo(){let e=re(l);return e&&(x={texto:`No pude guardar: ${e}`,malo:!0}),xe?(ce=!0,!0):!1}function T(){let e=l.escenario;return{desde:new Date(`${e.fechaPrimerPago}T12:00:00`),diasOptimista:e.diasOptimista,diasPesimista:e.diasPesimista}}function nn(){let e=0,a=[...l.ingresos].sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o=0;o<a.length;o++)e=Math.max(e,we(a[o],a.slice(0,o)));return e+1}function Wo(){let e=l.escenario;return{nombre:e.nombre,desdePago:nn(),ingresoEsperado:e.ingresoEsperado,cambiosIngreso:e.cambiosIngreso,obligaciones:l.obligaciones,colchon:{nombre:"Otros / Ahorro",base:e.colchonBase,minimo:e.colchonMinimo,elastico:e.colchonElastico,sobranteAMetas:e.sobranteAMetas!==!1,cambios:e.cambiosColchon},metas:ua(l.metas,l.repartos)}}function Ho(e){return`${((e==="ahorro"?l.escenario.cambiosColchon:l.escenario.cambiosIngreso)??[]).map((t,n)=>{let s=z(A(Math.max(1,t.desdePago),T()).optimista);return`<div class="cambio">
      <span class="rango">desde el</span>
      <input type="number" min="1" step="1" value="${t.desdePago}" class="corto"
        data-accion="cambio-escenario" data-cual="${e}" data-i="${n}" data-campo="desdePago" />
      <input type="text" inputmode="numeric" data-dinero value="${I(t.valor)}"
        class="corto-dinero" data-accion="cambio-escenario" data-cual="${e}" data-i="${n}" data-campo="valor" />
      <span class="rango">${m(s)}</span>
      <button class="icono" data-accion="borrar-cambio-escenario" data-cual="${e}" data-i="${n}" title="Quitar">\u2715</button>
    </div>`}).join("")}<button class="chico" data-accion="nuevo-cambio-escenario" data-cual="${e}">+ cambio</button>`}function sn(){let e=l.escenario;return`
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
        ${Ho("ingreso")}
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
        ${Ho("ahorro")}
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
           recorta \u2014 pero nunca por debajo de ${f(e.colchonMinimo)}. Solo para cerrar, nunca
           para abonar a medias.</span>`:""}
    </p>
    ${e.diasPesimista>e.diasOptimista?`<p class="nota rango">
      Los dos campos de d\xEDas son <strong>de pago a pago</strong>, no un retraso de una vez.
      Con ${e.diasPesimista} d\xEDas, el pago ${ia(T())?10:12} caer\xEDa
      ${(()=>{let a=T();return`<strong>${Math.round(11*(e.diasPesimista-e.diasOptimista)/30)} meses</strong> m\xE1s tarde que si fueran puntuales`})()}.
    </p>`:""}
  </section>`}var rn={cada_pago:"Cada pago",primer_pago:"Solo el primer pago",puntual:"Puntual: cuando yo la marque"},Ko={siempre:"asumo que la pago siempre",cada_dos_pagos:"asumo un pago s\xED y otro no",nunca:"asumo que no la pago"};function Zo(e,a,o){let t=e??1,n=z(A(t,T()).optimista);return`<input type="number" min="1" step="1" value="${t}" class="corto"
             data-accion="${a}" data-id="${o}" data-campo="desdePago" />
          <span class="rango mes-de-pago">${t<=1?"desde el primero":m(n)}</span>`}function oa(){let e=l.cuentas.filter(a=>a.montoEsperado>0);if(e.length>0){let a=e.reduce((o,t)=>t.periodo.localeCompare(o.periodo)>0?t:o);return{monto:a.montoEsperado,de:a.periodo,esReal:!0}}return{monto:l.escenario.ingresoEsperado,de:"lo que esperas por pago",esReal:!1}}function cn(e){let a=oa();if(a.monto<=0)return'<span class="rango">\u2014</span>';let o=e.tipo==="porcentaje"?ue(a.monto,e.valor):e.valor;return`<span class="calculado">${f(o)}</span>`}function ln(e){let a=e.cambios??[];if(a.length===0)return"";let o=e.tipo==="porcentaje",t=(n,s)=>{let r=z(A(Math.max(1,n.desdePago),T()).optimista);return`<span class="cambio">
      <span class="rango">desde el pago</span>
      <input type="number" min="1" step="1" value="${n.desdePago}" class="corto"
        data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="desdePago" />
      <span class="rango">(${m(r)}) pasa a</span>
      ${o?`<input type="number" min="0" max="100" step="0.5" value="${n.valor*100}" class="corto"
             data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" /><span class="rango">%</span>`:`<input type="text" inputmode="numeric" data-dinero value="${I(n.valor)}"
             class="corto-dinero" data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" />`}
      <button class="icono" data-accion="borrar-cambio" data-id="${e.id}" data-i="${s}"
        title="Quitar este cambio">\u2715</button>
    </span>`};return`<tr class="fila-cambios" data-hija-de="${e.id}">
    <td colspan="9"><span class="rango">${m(e.nombre)} \xB7</span>
      ${a.map(t).join("")}</td>
  </tr>`}function et(e,a,o){let t=a?.trim(),n=Da(o);return!t&&!n?"":`<tr class="fila-nota" data-hija-de="${e}">
    <td colspan="9">
      ${t?`<span class="texto-nota">\u{1F4DD} ${m(t)}</span>`:""}
      ${n?`${t?"<br />":""}<a href="${m(n)}" target="_blank" rel="noopener noreferrer"
        data-enlace>\u{1F517} ${m(new URL(n).hostname.replace(/^www\./,""))}</a>`:""}
    </td>
  </tr>`}function dn(e){let a=e.modo==="puntual",o=oa(),t=o.monto>0&&e.tipo==="porcentaje"?ue(o.monto,e.valor):null;return`
  <tr data-id-fila="${e.id}" data-resumen="${m(Lo(e,t)+(e.nota?.trim()?" \xB7 \u{1F4DD}":""))}"
      class="${e.id===aa?"abierta":""}">
    <td><input class="ancho" value="${m(e.nombre)}" data-accion="oblig" data-id="${e.id}" data-campo="nombre" /></td>
    <td><input value="${m(e.grupo??"")}" placeholder="ninguno"
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
    <td class="num">${cn(e)}</td>
    <td class="desde">${Zo(e.desdePago,"oblig",e.id)}</td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="modo">
        ${Object.entries(rn).map(([n,s])=>`<option value="${n}" ${e.modo===n?"selected":""}>${s}</option>`).join("")}
      </select>
    </td>
    <td>
      ${a?`<select data-accion="oblig" data-id="${e.id}" data-campo="supuesto">
        ${Object.entries(Ko).map(([n,s])=>`<option value="${n}" ${(e.supuesto??"siempre")===n?"selected":""}>${s}</option>`).join("")}
      </select>`:'<span class="rango">\u2014</span>'}
    </td>
    <td class="num">
      <button class="icono ${e.nota?.trim()?"con-nota":""}" data-accion="nota-oblig" data-id="${e.id}"
        title="${e.nota?.trim()?"Editar la nota":"Escribir una nota"}">\u{1F4DD}</button>
      <button class="icono" data-accion="borrar-oblig" data-id="${e.id}" title="Quitar">\u2715</button></td>
  </tr>`}function Pa(e,a){return ne(e,a,l.obligaciones,{nombre:"",base:0,minimo:0,elastico:!1},[],new Map,0).obligaciones.reduce((t,n)=>t+n.monto,0)}function un(){let e=oa();if(e.monto<=0)return"";let a=Pa(1,e.monto),o=Pa(2,e.monto),t=(s,r)=>`
    <div><span class="rotulo">${s}</span>
      <span class="valor">${f(e.monto-r)}</span>
      <span class="rotulo">libre para metas \xB7 se van ${f(r)}</span></div>`,n=e.esReal?`Calculado sobre <strong>${m(e.de)}</strong>: ${f(e.monto)}, que es lo que
       esperas cobrar de verdad. Si no hubiera cuenta de cobro registrada, saldr\xEDa del
       escenario de arriba.`:`Calculado sobre el escenario de arriba (${f(e.monto)}), que es una <em>suposici\xF3n</em>.
       En cuanto registres una cuenta de cobro, esta cifra sale de ah\xED.`;return`<div class="resumen resumen-oblig">
    ${t("En el primer pago",a)}
    ${a!==o?t("En los siguientes",o):""}
  </div>
  <p class="nota ${e.esReal?"":"aviso"}">${n}</p>`}function pn(){let e=l.obligaciones.filter(a=>a.modo==="puntual");return l.obligaciones.length===0?`
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
        <tbody>${l.obligaciones.map(a=>dn(a)+ln(a)+et(a.id,a.nota)).join("")}</tbody>
      </table>
    </div>
    ${un()}
    <p class="nota"><button data-accion="nueva-oblig">+ Agregar obligaci\xF3n</button>
      ${ot("obligaciones")}
      ${at("obligaciones")}</p>
    ${e.length?`<p class="nota aviso">
      Las puntuales no se pueden adivinar. Para calcular las fechas
      ${e.map(a=>`<strong>${m(a.nombre)}</strong>: ${Ko[a.supuesto??"siempre"]}`).join(" \xB7 ")}.
    </p>`:""}
  </section>`}function mn(e){if(!e.compra)return`<button data-accion="comprada" data-id="${e.id}">Ya la compr\xE9</button>`;let a=e.compra.precioReal-e.valor;return`<span class="completa">${m(V(e.compra.mes))}</span>
    <span class="rango">${f(e.compra.precioReal)}${a===0?"":a<0?` \xB7 ${f(-a)} menos`:` \xB7 ${f(a)} m\xE1s`}</span>
    <button class="icono" data-accion="no-comprada" data-id="${e.id}" title="No la compr\xE9">\u2715</button>`}function gn(e){let a=be(l.metas,l.repartos).get(e.id),o=a.previo>0&&a.real>0&&Math.abs(a.previo-a.real)<=Math.max(1e3,a.real*.05),t=`<input type="text" inputmode="numeric" data-dinero value="${I(a.previo)}"
      title="Lo que ya le hab\xEDas abonado a esta meta ANTES de empezar a usar el programa"
      data-accion="meta" data-id="${e.id}" data-campo="abonado" />`;return a.real===0?t:`${t}
    <span class="rango">+ ${f(a.real)} de lo real</span>
    <span class="${a.falta===0?"completa":""}">= ${f(a.total)}</span>
    ${o?`<span class="aviso">\u26A0\uFE0F ${f(a.previo)} escrito a mano y ${f(a.real)}
      registrado: \xBFes el mismo dinero?
      <button class="icono" data-accion="quitar-previo" data-id="${e.id}"
        title="S\xED, dejar solo lo registrado">\u2713</button></span>`:""}`}function at(e){return`<span class="solo-telefono plegado-todo">
    <button class="chico" data-accion="desplegar-todo" data-lista="${e}">Desplegar todo</button>
    <button class="chico" data-accion="plegar-todo" data-lista="${e}">Plegar todo</button>
  </span>`}function ot(e){if((e==="metas"?l.metas.length:l.obligaciones.length)<2)return"";let o=e==="metas"?' title="Ojo: en las metas el orden es la prioridad de pago, as\xED que esto cambia el plan"':"";return`&nbsp; <span class="rango">Ordenar por</span>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="nombre"${o}>nombre</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="valor"${o}>valor</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="grupo"${o}>grupo</button>`}function bn(e,a,o,t,n){return`
  <tr data-fila="${a}" data-id-fila="${e.id}"
      data-resumen="${m(To(e,n,t)+(e.nota?.trim()||e.link?" \xB7 \u{1F4DD}":""))}"
      class="${e.clase==="deuda"?"es-deuda":""} ${e.id===aa?"abierta":""}">
    <td class="orden">
      <span class="asa" title="Arrastra para moverla de sitio">\u283F</span>
      <button class="icono" data-accion="subir" data-i="${a}" ${a===0?"disabled":""} title="Subir">\u2191</button>
      <button class="icono" data-accion="bajar" data-i="${a}" ${a===o-1?"disabled":""} title="Bajar">\u2193</button>
    </td>
    <td><input class="ancho" value="${m(e.nombre)}" data-accion="meta" data-id="${e.id}" data-campo="nombre" />
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
    <td><input value="${m(e.grupo??"")}" placeholder="ninguno"
        data-accion="meta" data-id="${e.id}" data-campo="grupo" /></td>
    <td class="desde">${Zo(e.desdePago,"meta",e.id)}
      <div class="plazo"><span class="rango">la quiero antes del</span>
        <input type="number" min="0" step="1" class="corto" value="${e.antesDelPago??""}"
          placeholder="\u2014" title="Solo para avisarte: no cambia el orden de pago"
          data-accion="meta" data-id="${e.id}" data-campo="antesDelPago" />
        ${e.antesDelPago&&e.antesDelPago>0?`<span class="rango">${m(z(A(e.antesDelPago,T()).optimista))}</span>`:""}</div>
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
        ${e.enCuotas&&e.enCuotas>0&&!e.maximoPorPago?`\xB7 ${f(Math.ceil(e.valor/Math.round(e.enCuotas)))} c/u`:""}</span>
    </td>
    <td class="num pagado">${gn(e)}</td>
    <td class="compra">${mn(e)}</td>
    <td class="num">
      <button class="icono" data-accion="duplicar-meta" data-id="${e.id}" title="Duplicar">\u29C9</button>
      <button class="icono" data-accion="borrar-meta" data-id="${e.id}" title="Quitar">\u2715</button>
    </td>
  </tr>
  ${et(e.id,e.nota,e.link)}`}function fn(e){let a=T(),o=new Map((e?.metas??[]).map(n=>[n.metaId,{res:n,cuando:n.pagoFin!==null?qe(A(n.pagoFin,a)):null}]));if(l.metas.length===0)return`
    <section class="panel">
      <h2>Mis metas <span class="sufijo">\u2014 en el orden en que las quiero pagar</span></h2>
      <div class="vacio">
        <strong>Todav\xEDa no has puesto ninguna meta.</strong>
        Agrega lo que quieres comprar, con el precio de hoy.<br />
        El orden es el que t\xFA decidas: el programa paga de arriba hacia abajo.
        <p><button class="primario" data-accion="nueva-meta">+ Agregar mi primera meta</button></p>
      </div>
    </section>`;let t=l.metas.reduce((n,s)=>n+s.valor,0);return`
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
        <tbody>${l.metas.map((n,s)=>{let r=o.get(n.id);return bn(n,s,l.metas.length,r?.cuando??null,r?.res??null)}).join("")}</tbody>
      </table>
    </div>
    <p class="nota">
      <button data-accion="nueva-meta">+ Agregar meta</button>
      ${ot("metas")}
      ${at("metas")}
      &nbsp; Suma de todas: <strong>${f(t)}</strong>
      ${(()=>{let n=Ua(l.metas,l.repartos);return n===0?"":` &nbsp; Llevas pagado: <strong class="completa">${f(n)}</strong>
          <span class="rango">\xB7 te faltan ${f(Math.max(0,t-n))}</span>`})()}
      ${l.metas.length>1?`<br /><span class="rango">
        <strong>Ritmo de pago</strong>: para reunir para dos cosas a la vez. Pon un
        <strong>tope</strong> en pesos, o di <strong>en cu\xE1ntos pagos</strong> la quieres reunir
        y yo calculo la cuota. Si pones los dos, manda el tope. Lo que no pase baja a la meta
        siguiente; en blanco, esa meta se lleva todo lo que haya.</span>`:""}
      <br /><span class="rango">
        <strong>Ya pagado antes</strong>: solo lo que YA le hab\xEDas abonado a esa meta
        <strong>antes de empezar a usar el programa</strong>. Lo que pagues de aqu\xED en
        adelante sale solo de los repartos reales y no se teclea aqu\xED.</span>
    </p>
  </section>`}var tt={tranquilo:"",pronto:"aviso",hoy:"urgente",vencido:"malo"};function hn(){let e=new Date,a=l.soportesMarcados[$e(e)]??[],o=fa(e,a),t=tt[o.urgencia],n=r=>{let i=a.includes(r.id);return`<li class="soporte ${i?"listo":""}">
      <label class="interruptor">
        <input type="checkbox" data-accion="soporte" data-id="${r.id}" ${i?"checked":""} />
        <span>${m(r.nombre)}${r.obligatorioExplicito?' <strong class="pendiente">OBLIGATORIO</strong>':""}</span>
      </label>
      ${r.detalle?`<p class="nota">${m(r.detalle)}</p>`:""}
    </li>`},s=ba.filter(r=>r.frecuencia!=="cada_mes");return`
  <section class="panel radicacion ${t}">
    <h2><span class="etiqueta real">Real</span> Radicar la cuenta de cobro
      <span class="sufijo">\u2014 qu\xE9 d\xEDa y con qu\xE9 papeles</span></h2>
    <p class="titular ${t}">${m(o.titular)}</p>
    <p class="nota">${m(ao(o.limite))}
      ${o.limite.usoUltimoDiaDelMes?`<br /><span class="rango">${m(Za)}</span>`:""}
    </p>
    <ul class="soportes">${je().map(n).join("")}</ul>
    <p class="nota">
      Ya entregados una sola vez y no hay que repetirlos:
      ${s.filter(r=>r.frecuencia==="una_sola_vez").map(r=>m(r.nombre)).join(" \xB7 ")}.
      La constancia firmada por el paciente es solo para personal asistencial.
    </p>
  </section>`}function $n(){let e=pe(l.cuentas,l.ingresos),a=wa(e);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> Lo que te deben y lo que te han pagado
      <span class="sufijo">\u2014 una fila por mes cobrado</span></h2>
    ${l.cuentas.length===0?`<div class="vacio">A\xFAn no has registrado ninguna cuenta de cobro.<br />
         Sirve para llevar cu\xE1nto te deben cuando te pagan a medias.
         <p><button data-accion="nueva-cuenta">+ Registrar una cuenta de cobro</button></p></div>`:`<div class="tabla-ancha"><table>
          <thead><tr><th>Periodo</th><th class="num">Esperado</th><th class="num">Recibido</th>
            <th class="num">Falta</th><th>Estado</th><th></th></tr></thead>
          <tbody>${e.map(o=>`
            <tr>
              <td><input class="ancho" value="${m(o.cuenta.periodo)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="periodo" /></td>
              <td class="num"><input type="text" inputmode="numeric" data-dinero value="${I(o.cuenta.montoEsperado)}"
                    data-accion="cuenta" data-id="${o.cuenta.id}" data-campo="montoEsperado" /></td>
              <td class="num">${f(o.recibido)}</td>
              <td class="num ${o.pendiente>0?"pendiente":"completa"}">
                ${o.pendiente>0?f(o.pendiente):"\u2014"}</td>
              <td class="rango">${m(ja(o).split(": ").slice(1).join(": "))}</td>
              <td class="num">
                ${Oa(o)?`<button data-accion="abonar" data-id="${o.cuenta.id}">+ Registrar pago</button>`:'<span class="completa">\u2713 completa</span>'}
                <button class="icono" data-accion="borrar-cuenta" data-id="${o.cuenta.id}">\u2715</button>
              </td>
            </tr>
            ${o.ingresos.map(t=>`<tr class="componente">
              <td>${m(t.fecha)}</td><td class="num"></td><td class="num">${f(t.monto)}</td>
              <td colspan="2" class="rango">pago recibido</td>
              <td class="num"><button class="icono" data-accion="borrar-ingreso" data-id="${t.id}">\u2715</button></td>
            </tr>`).join("")}`).join("")}
          </tbody>
        </table></div>
        <p class="nota"><button data-accion="nueva-cuenta">+ Registrar otra cuenta</button>
        ${a.length?` &nbsp; <span class="pendiente">Te deben en total ${f(Ae(e))}</span>`:""}</p>`}
  </section>`}function Vo(e,a,o,t,n,s,r,i,c=""){let u=T(),d=o===null||t===null?"\u2014":`pago ${o}${t!==o?` - ${t}`:""}${n===null?"":` (${n})`}`,p=t!==null?A(t,u):null,g=t!==null?te(A(t,u)):i?"ya la ten\xEDas pagada":"sin terminar",h=r?`<span class="completa">${f(a)}</span>`:`<span class="pendiente">${f(s)} de ${f(a)}</span>`;return`<tr class="${c}">
    <td class="meta-nombre">${m(e)}</td>
    <td class="num">${h}</td>
    <td class="rango">${d}</td>
    <td class="cuando">${p?`<span class="fecha-larga-meta">${m(g)}</span><span class="fecha-corta-meta">${m(qe(p))}</span>`:m(g)}</td>
  </tr>`}function vn(){if(l.metas.length===0)return null;try{return fe(Wo())}catch{return null}}function Dn(e){if(l.metas.length===0)return`<section class="panel simulado">
      <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
      <div class="vacio">Agrega tus metas arriba y aqu\xED aparecen las fechas.</div>
    </section>`;if(!e)return`<section class="panel simulado"><h2>Simulaci\xF3n</h2>
      <p class="nota aviso">No pude calcular la proyecci\xF3n con estos datos.</p></section>`;let a=new Map(Ya(e).map(u=>[u.grupo,u])),o=[],t=new Set,n=(u,d="")=>Vo(u.nombre,u.valor,u.pagoInicio,u.pagoFin,u.cantidadPagos,u.totalAbonado,u.completada,u.yaEstabaPagada,d);for(let u of e.metas){if(!u.grupo){o.push(n(u));continue}if(t.has(u.grupo))continue;t.add(u.grupo);let d=a.get(u.grupo);o.push(Vo(d.grupo,d.valor,d.pagoInicio,d.pagoFin,null,d.totalAbonado,d.completado,d.yaEstabaPagado,"grupo"));for(let p of e.metas)p.grupo===u.grupo&&o.push(n(p,"componente"))}let s=e.pagos.length,r=l.escenario,i=T(),c=te(A(s,i));return`
  <section class="panel simulado">
    <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
    <div class="resumen">
      <div><span class="valor">${e.totalPagos}</span><span class="rotulo">pagos hasta terminarlo todo</span></div>
      <div><span class="valor cuando">${m(c)}</span><span class="rotulo">termina la \xFAltima meta</span></div>
      <div><span class="valor">${f(e.ahorroFinal)}</span><span class="rotulo">ahorro acumulado al final</span></div>
    </div>
    <div class="tabla-ancha">
      <table class="compacta">
        <thead><tr><th>Meta</th><th class="num">Abonado</th><th>Pagos</th><th>Cu\xE1ndo</th></tr></thead>
        <tbody>${o.join("")}</tbody>
      </table>
    </div>
    <p class="nota aviso">
      Esto es una simulaci\xF3n, no un hecho: supone que te entran ${f(r.ingresoEsperado)} por pago.
      ${ia(i)?`Las fechas son de <strong>una sola posibilidad</strong>: pagos puntuales cada
           ${r.diasOptimista} d\xEDas, sin contar atrasos. Sube \xABd\xEDas si se atrasan\xBB
           por encima de ${r.diasOptimista} y vuelven a salir como rango.`:`El \xABcu\xE1ndo\xBB va de puntual (cada ${r.diasOptimista} d\xEDas) a atrasado (cada ${r.diasPesimista}).`}
      ${e.incompleta?"<br /><strong>Con ese ingreso no alcanza a terminar.</strong>":""}
    </p>
    ${En(e)}
    ${Mn()}
  </section>`}function Mn(){let e=Ae(pe(l.cuentas,l.ingresos));if(e<=0)return"";let a=Xa(Wo(),e);if(!a)return"";let o=T(),t=n=>te(A(Math.max(1,n),o));return`<p class="nota ${a.seAdelanta>0?"":"rango"}">
    Te deben <strong class="pendiente">${f(a.pendiente)}</strong>.
    ${a.seAdelanta>0?`Si te los pagaran de una vez, terminar\xEDas <strong>${a.seAdelanta}
         ${a.seAdelanta===1?"pago":"pagos"} antes</strong>: la \xFAltima meta pasar\xEDa de
         ${m(t(a.pagosAhora))} a ${m(t(a.pagosSiPagan))}.`:`Aunque te los pagaran de una vez, las fechas no se mover\xEDan \u2014 el ritmo lo marcan los
         topes por pago que pusiste arriba, no lo que entra.`}
    <br /><span class="rango">Esto es aparte: la proyecci\xF3n de arriba NO cuenta ese dinero
    hasta que lo registres como pago recibido.</span>
  </p>`}function En(e){let a=Ja(e,l.metas);if(a.length===0)return"";let o=T(),t=s=>z(A(Math.max(1,s),o).optimista),n=s=>s.termina===null?`<li class="mal"><strong>${m(s.nombre)}</strong> la quer\xEDas para
        ${m(t(s.queria))} y <strong>no alcanza a terminar</strong> con este ingreso.</li>`:s.seRetrasa===0?`<li class="bien"><strong>${m(s.nombre)}</strong> la quer\xEDas para
        ${m(t(s.queria))} y llega ${s.termina===0?"ya pagada":`en ${m(t(s.termina))}`}.</li>`:`<li class="mal"><strong>${m(s.nombre)}</strong> la quer\xEDas para
      ${m(t(s.queria))} y va para <strong>${m(t(s.termina))}</strong>
      \u2014 ${s.seRetrasa} ${s.seRetrasa===1?"pago":"pagos"} tarde.
      S\xFAbela de posici\xF3n o dale m\xE1s por pago.</li>`;return`<div class="plazos">
    <h3 class="titulo-total">Lo que quer\xEDas para cierta fecha</h3>
    <ul>${a.map(n).join("")}</ul>
    <p class="nota rango">Esto solo avisa: el orden de pago lo pones t\xFA arriba, y el programa
      no lo cambia por su cuenta.</p>
  </div>`}function de(e){let a=Te(l.metas),o=l.ingresos.filter(s=>s.fecha<=e.fecha&&s.id!==e.id).sort((s,r)=>s.fecha.localeCompare(r.fecha));for(let s of o){let r=l.repartos.find(i=>i.ingresoId===s.id);for(let i of r?.abonos??[])i.refId&&a.set(i.refId,Math.max(0,(a.get(i.refId)??0)-i.monto))}let t=e.cuentaDeCobroId?!o.some(s=>s.cuentaDeCobroId===e.cuentaDeCobroId):!0,n=l.escenario;return Na(e,we(e,o),l.obligaciones,{nombre:"Otros / Ahorro",base:n.colchonBase,minimo:n.colchonMinimo,elastico:!1,sobranteAMetas:n.sobranteAMetas!==!1},l.metas,a,t)}function yn(){let e=la(l.ingresos,l.repartos);if(e.length===0)return`<section class="panel">
      <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
        <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
      <div class="vacio">
        <strong>Todav\xEDa no has registrado ninguna entrada de plata.</strong>
        Registra un pago en \xABCuentas de cobro\xBB y aqu\xED aparece, mes a mes, en qu\xE9 se fue.
        <p><button data-accion="aporte-externo">+ Meter plata de otro lado</button></p>
      </div>
    </section>`;let a=e.slice().reverse().map(t=>{let n=l.ingresos.filter(s=>s.fecha.slice(0,7)===t.mes).sort((s,r)=>s.fecha.localeCompare(r.fecha));return`
    <div class="mes-real">
      <div class="mes-cabecera">
        <h3>${m(V(t.mes))}</h3>
        <span class="valor">${f(t.entro)}</span>
        <span class="rotulo">entr\xF3${t.deFuera>0?` \xB7 ${f(t.deFuera)} los pusiste t\xFA`:""}</span>
      </div>
      ${n.map(xn).join("")}
      ${n.length>1?`<div class="total-mes">
        <span>Ese mes: ${f(t.aObligaciones)} en obligaciones \xB7 ${f(t.aMetas)} a metas
        ${t.alAhorro>0?` \xB7 ${f(t.alAhorro)} guardado`:""}</span></div>`:""}
    </div>`}).join(""),o=ka(l.repartos);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
      <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
    ${a}
    ${o.length>1?`
      <h3 class="titulo-total">En todo lo que llevas</h3>
      <div class="tabla-ancha"><table><tbody>
        ${o.map(t=>`<tr><td class="meta-nombre">${m(t.nombre)}</td>
          <td class="num">${f(t.monto)}</td></tr>`).join("")}
      </tbody></table></div>`:""}
    <p class="nota"><button data-accion="aporte-externo">+ Meter plata de otro lado</button>
      &nbsp; <span class="rango">Para cuando pones de tu bolsillo (Nequi, efectivo) y no viene del trabajo.</span></p>
  </section>`}function xn(e){let a=l.repartos.find(i=>i.ingresoId===e.id),o=l.cuentas.find(i=>i.id===e.cuentaDeCobroId),t=m(o?o.periodo:e.nota??"de otro lado");if(!a)return`<div class="ingreso-real">
      <div class="ingreso-cabecera">
        <span class="meta-nombre">${f(e.monto)}</span>
        <span class="rango">${m(e.fecha)} \xB7 ${t}</span>
      </div>
      <p class="nota aviso">No est\xE1 dicho en qu\xE9 se fue este dinero.
        <button data-accion="proponer" data-id="${e.id}">Calcularlo por m\xED</button></p>
    </div>`;let n=ge(a,e),s=(i,c,u)=>`
    <tr>
      <td class="meta-nombre">${m(i.nombre)}
        ${i.movidoDesdeGasto?'<span class="rango">\xB7 ven\xEDa de un gasto</span>':""}</td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${I(i.monto)}" class="corto-dinero"
        data-accion="editar-reparto" data-id="${a.id}" data-tipo="${c}" data-i="${u}" /></td>
      <td class="num">${i.movidoDesdeGasto?`<button class="icono" data-accion="abono-a-gasto" data-id="${a.id}" data-i="${u}"
             title="Devolverlo a gastos">\u21A9</button>`:""}</td>
    </tr>`,r=(i,c)=>`
    <tr class="gasto-suelto">
      <td><input value="${m(i.nombre)}" placeholder="\xBFen qu\xE9 se fue?"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${c}" data-campo="nombre" /></td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${I(i.monto)}" class="corto-dinero"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${c}" data-campo="monto" /></td>
      <td class="num"><button class="icono" data-accion="borrar-gasto"
        data-id="${a.id}" data-i="${c}" title="Quitar">\u2715</button></td>
    </tr>`;return`<div class="ingreso-real ${a.propuesto?"propuesto":""}">
    <div class="ingreso-cabecera">
      <span class="meta-nombre">${f(e.monto)}</span>
      <span class="rango">${m(e.fecha)} \xB7 ${t}</span>
      ${a.propuesto?`<button class="primario" data-accion="confirmar-reparto" data-id="${a.id}">As\xED fue</button>`:'<span class="completa">confirmado</span>'}
    </div>
    ${a.propuesto?`<p class="nota aviso">Esto es lo que el programa <em>calcula</em> que
      hiciste. Corrige lo que no fue as\xED y dale a \xABAs\xED fue\xBB.</p>`:""}
    <div class="tabla-ancha">
      <table>
        <tbody>
          ${a.obligaciones.map((i,c)=>[i,c]).filter(([i])=>i.monto!==0).map(([i,c])=>s(i,"obligaciones",c)).join("")}
          ${a.abonos.map((i,c)=>[i,c]).filter(([i])=>i.monto!==0).map(([i,c])=>s(i,"abonos",c)).join("")}
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
    ${(()=>{let i=Ga(a,l.metas);return i.length===0?"":i.map(c=>`<p class="nota aviso">
        Tienes <strong>${m(c.gasto.nombre)}</strong> (${f(c.gasto.monto)}) anotado aqu\xED como
        un gasto cualquiera, pero <strong>${m(c.metaNombre)}</strong> es una de tus metas.
        <br />Si ese dinero se lo metiste a la meta, m\xE1rcalo: as\xED el programa sabe que ya llevas
        ${f(c.gasto.monto)} pagados y deja de calcular las fechas como si te faltara el precio
        entero. Si fue otra cosa que se llama parecido, d\xE9jalo como est\xE1.
        <br /><button data-accion="gasto-a-abono" data-id="${a.id}"
          data-meta="${c.metaId}" data-nombre="${m(c.gasto.nombre)}">S\xED, fue abono a ${m(c.metaNombre)}</button>
      </p>`).join("")})()}
    ${(()=>{let i=Ha(a,de(e));if(i.length===0)return"";let c=T(),u=g=>z(A(Math.max(1,g),c).optimista),d=we(e,l.ingresos.filter(g=>g.fecha<=e.fecha&&g.id!==e.id)),p=i.map(g=>{let h=Va(g,ua(l.metas,l.repartos),l.obligaciones,d),y=h.tipo==="ya-no-esta"?"ya no est\xE1 en tu lista":h.tipo==="ya-comprada"?"la marcaste como ya comprada":h.tipo==="ya-pagada"?"ya est\xE1 pagada":h.tipo==="empieza-despues"?`ahora empieza en el pago ${h.pago} (${u(h.pago)})`:h.tipo==="solo-el-primer-pago"?"es solo del primer pago":h.tipo==="puntual"?"es puntual, no de todos los pagos":h.tipo==="en-cero"?"est\xE1 en $0":"no sabr\xEDa decirte por qu\xE9";return`<li><strong>${m(g)}</strong> \u2014 ${m(y)}</li>`}).join("");return`<div class="nota aviso">
        Con la configuraci\xF3n de hoy, ${i.length===1?"esto ya no entrar\xEDa":"estas cosas ya no entrar\xEDan"}
        en este mes:
        <ul class="motivos">${p}</ul>
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
      ${n>0?`Faltan <strong>${f(n)}</strong> por decir a d\xF3nde fueron.`:`Repartiste <strong>${f(-n)}</strong> m\xE1s de lo que entr\xF3.`}
      <button data-accion="cuadrar" data-id="${a.id}">Mandarlos a lo guardado</button>
    </p>`:""}
  </div>`}function nt(e){let a=T(),o=e?za(e.pagos,a.desde,a.diasOptimista,l.metas):[],t=la(l.ingresos,l.repartos),n=[...new Set([...o.map(r=>r.mes),...t.map(r=>r.mes)])],s=Qa(l.cuentas,l.ingresos,l.escenario.ingresoEsperado,n);return Ba(o,t,ee().slice(0,7),s)}function Sn(e){let a=nt(e);if(a.length===0)return`<section class="panel">
      <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
      <div class="vacio">Agrega tus metas y registra un pago: aqu\xED se ve el calendario entero.</div>
    </section>`;Pn(a);let o=da(a);return`
  <section class="panel">
    <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
    <div class="resumen">
      <div><span class="valor real">${f(o.entroDeVerdad)}</span>
        <span class="rotulo">ha entrado de verdad \xB7 ${o.mesesConDatos} ${o.mesesConDatos===1?"mes":"meses"}</span></div>
      <div><span class="valor">${f(o.guardadoDeVerdad)}</span>
        <span class="rotulo">llevas guardado</span></div>
      ${o.mesesQueFaltan>0?`<div><span class="valor cuando">${f(o.faltaPorEntrar)}</span>
            <span class="rotulo">faltar\xEDan por entrar \xB7 ${o.mesesQueFaltan} ${o.mesesQueFaltan===1?"mes":"meses"}</span></div>`:`<div><span class="valor">${f(o.gastadoDeVerdad)}</span>
            <span class="rotulo">llevas gastado</span></div>`}
    </div>
    <p class="nota">
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="1">Desplegar todos</button>
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="0">Plegar todos</button>
      <span class="rango">&nbsp; ${a.length} ${a.length===1?"mes":"meses"} \xB7
        pulsa uno para ver en qu\xE9 se va</span>
    </p>
    <div class="linea-tiempo">${a.map(Cn).join("")}</div>
    <p class="nota">
      <span class="etiqueta real">Real</span> lo que pas\xF3 \xB7
      <span class="etiqueta simulacion">Simulaci\xF3n</span> lo que pasar\xEDa si entra lo que supone
      el escenario. Nunca se mezclan en una sola cifra.
    </p>
  </section>`}function Rn(e){let a=(n,s)=>n.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")===s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),o=l.obligaciones.find(n=>a(n.nombre,e));if(o)return`<span class="que-es obligacion">fijo${o.grupo?` \xB7 ${m(o.grupo)}`:""}</span>`;let t=l.metas.find(n=>a(n.nombre,e));return t?`<span class="que-es meta">meta${t.grupo?` \xB7 ${m(t.grupo)}`:""}</span>`:e==="Qued\xF3 guardado"||e==="Se guardar\xEDa"?"":'<span class="que-es suelto">de una vez</span>'}var le=new Set,Bo=!1;function Pn(e){if(Bo)return;Bo=!0;let a=e.findIndex(t=>t.estado==="actual"),o=a>=0?a:0;for(let t of e.slice(o,o+2))le.add(t.mes)}function Cn(e){let a=e.real!==null,o=e.real??e.simulado;if(!o)return"";let t=a?o.entro:e.esperado?.monto??o.entro,n=!a&&e.simulado!==null&&e.esperado!==null&&e.esperado.monto!==e.simulado.entro,s=e.real?e.real.detalle:J(e.simulado?.detalle),r=l.notasDelMes?.[e.mes]?.trim()??"",i=e.estado==="actual"?'<span class="chip ahora">este mes</span>':e.estado==="futuro"?'<span class="chip futuro">viene</span>':"",c=[o.aObligaciones>0?`${f(o.aObligaciones)} fijos`:"",o.aMetas>0?`${f(o.aMetas)} a metas`:"",a&&e.real.enGastos>0?`${f(e.real.enGastos)} sueltos`:"",o.alAhorro>0?`${f(o.alAhorro)} guardado`:""].filter(Boolean).join(" \xB7 ");return`
  <details class="mes-vista ${e.estado} ${a?"es-real":"es-simulado"}"
           data-mes="${e.mes}" ${le.has(e.mes)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${m(V(e.mes))}</h3>
      ${i}
      <span class="etiqueta ${a?"real":"simulacion"}">${a?"Real":"Simulaci\xF3n"}</span>
      <span class="valor">${f(t)}</span>
      ${c?`<span class="resumen-plegado">${c}</span>`:""}
      ${r?'<span class="rango" title="Este mes tiene una nota">\u{1F4DD}</span>':""}
    </summary>
    <p class="nota">
      ${r?`<span class="nota-del-mes">\u{1F4DD} ${m(r)}</span><br />`:""}
      <button class="chico" data-accion="nota-mes" data-mes="${e.mes}">
        ${r?"Editar la nota del mes":"\u{1F4DD} Escribir una nota de este mes"}</button>
    </p>
    ${e.esperado?.segun==="cuenta_de_cobro"&&!a?`<p class="nota rango">
      Seg\xFAn tu cuenta de cobro de este mes, no seg\xFAn el escenario.</p>`:""}
    ${n?`<p class="nota aviso">
      El desglose de abajo est\xE1 calculado con el escenario (${f(e.simulado.entro)}).
      Si de verdad esperas ${f(e.esperado.monto)} este mes, cambia \xABLo que espero por pago\xBB
      para que las cifras cuadren.</p>`:""}
    ${e.diferencia!==null&&e.diferencia!==0?`<p class="nota ${e.diferencia<0?"aviso":""}">
      ${e.diferencia<0?`Entraron ${f(-e.diferencia)} menos de lo esperado para ese mes (${f(e.esperado.monto)}${e.esperado.segun==="cuenta_de_cobro"?", seg\xFAn tu cuenta de cobro":""}).`:`Entraron ${f(e.diferencia)} m\xE1s de lo esperado para ese mes.`}</p>`:""}
    ${e.estado==="actual"&&e.real&&e.esperado?`<p class="nota">
      ${e.esperado.segun==="cuenta_de_cobro"?`Tu cuenta de cobro de este mes es de <strong>${f(e.esperado.monto)}</strong>`:`El escenario supone <strong>${f(e.esperado.monto)}</strong> este mes`}.
      ${e.real.entro<e.esperado.monto?`Llevas ${f(e.real.entro)}: faltar\xEDan ${f(e.esperado.monto-e.real.entro)} por entrar.`:"Ya entr\xF3 todo."}</p>`:""}
    ${s.length===0?'<p class="nota rango">Sin movimientos.</p>':`
      <div class="tabla-ancha"><table><tbody>
        ${s.map(u=>`<tr>
          <td class="meta-nombre">${m(u.nombre)} ${Rn(u.nombre)}
            ${u.deLoQueSobro?`<span class="rango">\xB7 ${f(u.deLoQueSobro)} con lo que sobr\xF3 del mes</span>`:""}</td>
          <td class="num">${f(u.monto)}</td></tr>`).join("")}
        ${o.alAhorro>0?`<tr class="grupo">
          <td class="meta-nombre">${a?"Qued\xF3 guardado":"Se guardar\xEDa"}</td>
          <td class="num">${f(o.alAhorro)}</td></tr>`:""}
      </tbody></table></div>`}
    ${e.real&&e.real.sinAsignar>0?`<p class="nota aviso">
      Hay ${f(e.real.sinAsignar)} sin decir en qu\xE9 se fueron.</p>`:""}
  </details>`}var F=[],Y=vo(),j=!1,q=null,N=null,An={escenario:"Escenario",obligaciones:"Obligaciones",metas:"Metas",cuentas:"Cuentas de cobro",ingresos:"Registrar \xB7 pagos recibidos",repartos:"Registrar \xB7 en qu\xE9 se fue la plata",soportes:"Soportes de radicaci\xF3n"};function st(e){let a=e.datos,o=t=>typeof t=="number"?f(t):"";switch(e.tabla){case"metas":return`\xAB${String(a.nombre??"sin nombre")}\xBB`;case"obligaciones":return`\xAB${String(a.nombre??"sin nombre")}\xBB`;case"cuentas":return`la cuenta de ${String(a.periodo??"?")}`;case"ingresos":return`el pago del ${String(a.fecha??"?")} (${o(a.monto)})`;case"repartos":return Ue({tabla:"repartos",id:e.id},l);case"escenario":return"el escenario";case"soportes":return`los soportes de ${e.id}`}}function ea(e,a){if((e.campo==="ordenMetas"||e.campo==="ordenObligaciones")&&Array.isArray(a)&&q){let o=e.campo==="ordenMetas"?"metas":"obligaciones",t=new Map;for(let n of[...q.remotas[o],...q.locales[o]])t.set(n.datos.id,String(n.datos.nombre??n.datos.id));return a.map((n,s)=>`${s+1}. ${t.get(String(n))??"?"}`).join(" \xB7 ")}return Ee(e.campo??"",a)}function rt(e){let a=st(e);return e.tipo==="campo"?[`${a} \u2014 ${Me(e.campo??"")}`,ea(e,e.aqui),ea(e,e.nube)]:e.tipo==="solo-aqui"?[`${a} est\xE1 solo en este aparato`,"Conservarla","Quitarla de los dos"]:e.tipo==="solo-nube"?[`${a} est\xE1 solo en el otro aparato`,"No traerla (quitarla de los dos)","Traerla"]:[`${a} la borraste en el otro aparato`,"Conservarla","Borrarla tambi\xE9n aqu\xED"]}function In(e,a){let[o,t,n]=rt(e),s=a==="aqui"?t:n;return e.tipo==="campo"?`${o}: qued\xF3 ${s}`:`${o} \u2192 ${s.toLowerCase()}`}function qn(e){let a=q.elecciones[e.clave],o=(i,c)=>`
    <label class="opcion ${a===i?"elegida":""}">
      <input type="radio" name="${m(e.clave)}" value="${i}" ${a===i?"checked":""}
        data-accion="nube-elegir" data-clave="${m(e.clave)}" data-lado="${i}" />
      <span>${c}</span>
    </label>`,t=st(e),[n,s,r]=rt(e);return e.tipo==="campo"?`<div class="diferencia">
      <div class="que"><strong>${m(t)}</strong> \u2014 ${m(Me(e.campo??""))}
        ${e.confirmadoEn?'<span class="rango">(el que confirmaste viene marcado)</span>':""}</div>
      ${o("aqui",`<b>En este aparato:</b> ${m(ea(e,e.aqui))}`)}
      ${o("nube",`<b>En el otro aparato (la nube):</b> ${m(ea(e,e.nube))}`)}
    </div>`:`<div class="diferencia fila-entera">
    <div class="que"><strong>${m(n)}</strong></div>
    ${o("aqui",m(s))}
    ${o("nube",m(r))}
  </div>`}function Tn(){let e=q,a=[...new Set(e.difs.map(o=>o.tabla))];return`<div class="revision">
    <h3 class="titulo-ventana">${e.modo==="subir"?"\u2B06 Subir mi versi\xF3n":"\u2B07 Traer la \xFAltima versi\xF3n"}</h3>
    <p><strong>${e.modo==="subir"?"Vas a SUBIR la versi\xF3n de este aparato.":"Vas a TRAER la \xFAltima versi\xF3n de la nube."}</strong>
      Hay ${e.difs.length} ${e.difs.length===1?"diferencia":"diferencias"} con el otro aparato.
      Viene marcado ${e.modo==="subir"?"lo de este aparato":"lo de la nube"}; cambia lo que quieras.
      <b>Todav\xEDa no se ha escrito nada</b>, ni aqu\xED ni en la nube.</p>
    ${a.map(o=>`<h3>${m(An[o])}</h3>
      ${e.difs.filter(t=>t.tabla===o).map(qn).join("")}`).join("")}
    <p class="botones-revision">
      <button class="primario" data-accion="nube-aplicar" ${j?"disabled":""}>
        ${j?"Aplicando\u2026":"Aplicar lo elegido"}</button>
      <button data-accion="nube-cancelar">Cancelar, no cambiar nada</button>
    </p>
  </div>`}function Ln(){if(N){let e=N;return`<div class="capa-dialogo capa-nube cerrable">
      <div class="dialogo dialogo-nube" role="dialog" aria-modal="true">
        <h3 class="titulo-ventana ${e.malo?"pendiente":""}">${m(e.titulo)}</h3>
        ${e.lineas.length?`<ul class="lista-resultado">${e.lineas.map(a=>`<li>${m(a)}</li>`).join("")}</ul>`:""}
        <div class="dlg-botones"><button class="primario" data-accion="nube-cerrar-ventana">Cerrar</button></div>
      </div></div>`}return q?`<div class="capa-dialogo capa-nube">
      <div class="dialogo dialogo-nube" role="dialog" aria-modal="true">${Tn()}</div></div>`:""}function wn(){let e=ze(),a=Ve();if(!e)return`
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
    </section>`;let o=F.length===0?"":`
    <div class="aviso-descartes">
      <strong>${F.length} ${F.length===1?"dato distinto":"datos distintos"} entre los dos aparatos.</strong>
      Se qued\xF3 el m\xE1s reciente. Aqu\xED est\xE1n los dos, para que compares:
      <table><thead><tr>
        <th>Qu\xE9</th><th>Lo que hab\xEDa en el otro aparato</th><th>Lo que qued\xF3</th><th></th>
      </tr></thead><tbody>
        ${F.map((t,n)=>`<tr>
          <td><strong>${m(Me(t.campo))}</strong>
            <span class="rango">de ${m(Ue(t,l))}</span></td>
          <td class="descartado">${m(Ee(t.campo,t.valor))}</td>
          <td class="completa">${m(Ee(t.campo,t.gano))}</td>
          <td><button class="chico-linea" data-accion="nube-revertir" data-i="${n}">Quedarme con este</button></td>
        </tr>`).join("")}
      </tbody></table>
    </div>`;return`
    <section class="panel">
      <h2>Sincronizar con el tel\xE9fono
        <span class="sufijo">\u2014 ${m(e.correo)}</span></h2>
      <p class="nota">
        ${a?`\xDAltima vez: ${new Date(a).toLocaleString("es-CO")}.`:"Todav\xEDa no has sincronizado desde este aparato."}
      </p>
      <p class="nota">Nada se escribe sin que veas antes qu\xE9 cambia y elijas.</p>
      <p class="botones-nube">
        <button class="primario" data-accion="nube-preparar" data-modo="subir" ${j||q?"disabled":""}>
          \u2B06 Subir mi versi\xF3n</button>
        <button class="primario" data-accion="nube-preparar" data-modo="traer" ${j||q?"disabled":""}>
          \u2B07 Traer la \xFAltima versi\xF3n</button>
        <button class="chico-linea" data-accion="nube-salir">Salir de la cuenta</button>
      </p>
      <p class="rango">\xABSubir\xBB deja la nube como este aparato; \xABTraer\xBB deja este aparato como la nube.
        ${j&&!q?"<b>Comparando con la nube\u2026</b>":""}</p>
      ${o}
    </section>`}function On(e){let a=new Date,o=a.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),t=Ae(pe(l.cuentas,l.ingresos)),n=oa(),s=n.monto>0?Pa(2,n.monto):0,r=nt(e),i=r.length>0?da(r).guardadoDeVerdad:0,c=T(),u=Oo(l.metas,e?.metas??[]),d=u?.pagoFin!=null?te(A(u.pagoFin,c)):null,p=l.soportesMarcados[$e(a)]??[],g=fa(a,p),h=je(),y=h.filter(P=>p.includes(P.id)).length,M=g.diasQueFaltan,b=(P,Se,Re,Pe,ae,oe)=>`
    <div class="cifra tono-${P}">
      <div class="cifra-cab"><span class="cifra-chip">${Se}</span>${Re}</div>
      <div class="cifra-nombre">${Pe}</div>
      <div class="cifra-valor">${ae}</div>
      <div class="cifra-detalle">${oe}</div>
    </div>`,v='<span class="etiqueta real">Real</span>',R='<span class="etiqueta simulacion">Simulaci\xF3n</span>',C=be(l.metas,l.repartos),L=new Map((e?.metas??[]).map(P=>[P.metaId,P])),G=P=>Je(P,C.get(P.id)?.total??0)>=1,w=l.metas.filter(P=>!G(P)),na=l.metas.length-w.length,ft=[...w,...l.metas.filter(G)].map(P=>{let Se=L.get(P.id),Re=C.get(P.id)?.total??0,Pe=Je(P,Re),ae=Pe>=1,oe=!P.compra&&!ae&&Se?.pagoFin!=null?A(Se.pagoFin,c):null,Ta=P.compra?"ya la compraste":ae?"\u2713 lista":oe?te(oe):"sin fecha todav\xEDa",ht=oe?`<span class="fecha-larga-meta">${m(Ta)}</span><span class="fecha-corta-meta">${m(qe(oe))}</span>`:m(Ta);return`<li class="inicio-meta ${P.clase==="deuda"?"es-deuda":""} ${ae?"lista":""}">
      <div class="inicio-meta-texto">
        <div class="inicio-meta-nombre">${m(P.nombre.trim()||"(sin nombre)")}
          ${P.clase==="deuda"?'<span class="marca-deuda">Ya la debo</span>':""}</div>
        <div class="rango">${f(Re)} de ${f(P.valor)}</div>
        <div class="barra-progreso"><i style="width:${Math.round(Pe*100)}%"></i></div>
      </div>
      <div class="inicio-meta-der"><strong>${f(P.valor)}</strong>
        <span class="${ae?"completa":"cuando"}">${ht}</span></div>
    </li>`}).join("");return`
  <section class="inicio">
    <div class="saludo">
      <h1>\xA1Hola!</h1>
      <p>As\xED va tu plata \xB7 <span class="fecha-larga">${m(o)}</span></p>
    </div>

    <div class="aviso-radicar ${tt[g.urgencia]}">
      <div class="aviso-radicar-texto">
        ${v} <strong>${m(g.titular)}</strong>
        <div class="rango">${y} de ${h.length} soportes listos \xB7 la lista est\xE1 abajo</div>
        <div class="barra-progreso real"><i style="width:${h.length?Math.round(y/h.length*100):0}%"></i></div>
      </div>
      <div class="aviso-radicar-dias"><strong>${Math.abs(M)}</strong>
        <span>${M<0?Math.abs(M)===1?"d\xEDa tarde":"d\xEDas tarde":M===1?"d\xEDa":"d\xEDas"}</span></div>
    </div>

    <div class="cifras">
      ${b("real","\u{1F4B5}",v,"Te deben",t>0?f(t):"$0",t>0?"de cuentas de cobro sin pagar completas":"no tienes cuentas pendientes")}
      ${b("turquesa","\u{1F45B}","","Libre para metas, por pago",n.monto>0?f(n.monto-s):"\u2014",n.monto>0?`de ${f(n.monto)} \xB7 se van ${f(s)}`:"pon cu\xE1nto esperas por pago en Ajustes")}
      ${b("simulado","\u{1F3C1}",R,u?`Pr\xF3xima meta \xB7 ${m(u.meta.nombre.trim()||"(sin nombre)")}`:"Pr\xF3xima meta",u?d?m(d.replace(/^entre /,"").split(" y ")[0]):"Sin fecha":"\u2014",u?d?d.startsWith("entre ")?m(d):"seg\xFAn la proyecci\xF3n":"la proyecci\xF3n no alcanza a terminarla":"no hay metas pendientes")}
      ${b("morado","\u{1F437}","","Llevas guardado",f(i),"lo que ha quedado de verdad en el ahorro")}
    </div>

    <div class="inicio-doble">
    <div class="panel inicio-metas">
      <h2>Mis metas ${R}
        <button class="enlace" data-accion="seccion" data-seccion="metas">Ver todas \u2192</button></h2>
      ${l.metas.length===0?`<div class="vacio">Todav\xEDa no has puesto ninguna meta.
            <p><button class="primario" data-accion="seccion" data-seccion="metas">Ir a Metas</button></p></div>`:`<p class="rango">${w.length} por pagar${na>0?` \xB7 ${na} ya ${na===1?"lista":"listas"}`:""}</p>
           <ul class="inicio-lista">${ft}</ul>`}
    </div>
    ${Fn(r)}
    </div>
    ${_n(e,r,C)}
  </section>`}var We=null,Qo=["#f472b6","#a78bfa","#2dd4bf","#fb923c","#e879f9","#4ade80","#f87171","#c4b5fd","#5eead4","#fda4af","#bef264","#fdba74"],jn={ahorro:"#94a3b8","sin-asignar":"rgba(255,255,255,.22)"},Go={obligacion:"obligaci\xF3n",meta:"meta",gasto:"gasto suelto",ahorro:"","sin-asignar":""};function Fn(e){let a=e.filter(p=>p.real||p.simulado).map(p=>p.mes);if(a.length===0)return"";let o=We&&a.includes(We)?We:No(e),t=a.indexOf(o),n=Fo(e.find(p=>p.mes===o),new Set(l.metas.map(p=>p.id)),l.obligaciones),s=52,r=2*Math.PI*s,i=0,c=(n?.trozos??[]).map(p=>jn[p.tipo]??Qo[i++%Qo.length]),u=jo((n?.trozos??[]).map(p=>p.monto),s),d=(p,g,h)=>a[p]?`<button class="icono" data-accion="dona-mes" data-mes="${a[p]}" title="${h}">${g}</button>`:`<button class="icono" disabled>${g}</button>`;return`
  <div class="panel inicio-dona">
    <h2>En qu\xE9 se va el mes
      ${n?n.esReal?'<span class="etiqueta real">Real</span>':'<span class="etiqueta simulacion">Simulaci\xF3n</span>':""}</h2>
    <div class="dona-meses">
      ${d(t-1,"\u25C0","Mes anterior")}
      <select data-accion="dona-mes" aria-label="Mes">
        ${a.map(p=>`<option value="${p}" ${p===o?"selected":""}>${m(V(p))}</option>`).join("")}
      </select>
      ${d(t+1,"\u25B6","Mes siguiente")}
    </div>
    <p class="rango">${n?n.esReal?"Lo que pas\xF3 de verdad ese mes":"Lo que se piensa gastar, seg\xFAn la proyecci\xF3n":"Ese mes no tiene nada repartido."}</p>
    ${n?`<div class="dona">
      <svg viewBox="0 0 140 140" role="img" aria-label="Reparto de ${f(n.total)} en ${m(V(o))}">
        <circle cx="70" cy="70" r="${s}" class="dona-fondo" />
        <g transform="rotate(-90 70 70)">
          ${n.trozos.map((p,g)=>u[g].largo>0?`<circle cx="70" cy="70" r="${s}" style="stroke:${c[g]}"
                 stroke-dasharray="${u[g].largo.toFixed(2)} ${r.toFixed(2)}"
                 stroke-dashoffset="${(-u[g].desde).toFixed(2)}" />`:"").join("")}
        </g>
        <text x="70" y="68" class="dona-total">${f(n.total)}</text>
        <text x="70" y="86" class="dona-rotulo">${n.esReal?"entr\xF3":"se espera"}</text>
      </svg>
      <ul>
        ${n.trozos.map((p,g)=>`<li><i style="background:${c[g]}"></i>
          <span>${m(p.nombre)}${Go[p.tipo]?` <em class="tipo-trozo">${Go[p.tipo]}</em>`:""}</span>
          <strong>${f(p.monto)}</strong></li>`).join("")}
      </ul>
    </div>`:""}
    <p><button class="primario" data-accion="seccion" data-seccion="registrar">+ Registrar un pago</button></p>
  </div>`}var Nn={lista:"\u2713 lista",comprada:"ya la compraste","en-curso":"","no-alcanza":"no alcanza a terminar","sin-fecha":"sin fecha todav\xEDa"};function _n(e,a,o){if(l.metas.length===0)return"";let t=T(),n=b=>$e(A(Math.max(1,b),t).optimista),s=_o(l.metas,e?.metas??[],new Map([...o].map(([b,v])=>[b,v.total])),a,n),r=ee().slice(0,7),i=s.flatMap(b=>[b.desde,b.hasta]).filter(b=>!!b),c=[r,...i].reduce((b,v)=>v<b?v:b),u=e?.pagos.length?n(e.pagos[e.pagos.length-1].numero):r,d=[r,u,...i].reduce((b,v)=>v>b?v:b),p=ko(c,d),g=b=>p.indexOf(b)+2,h=p.map((b,v)=>`<div class="lt-mes ${b===r?"hoy":""}" style="grid-column:${v+2};grid-row:1">
      ${me(b)}${v===0||b.endsWith("-01")?`<b>${b.slice(0,4)}</b>`:""}</div>`).join(""),y=s.map((b,v)=>{let R=v+2,C=b.desde??b.hasta,L=b.estado==="no-alcanza"?d:b.hasta??b.desde,G=b.estado==="en-curso"&&b.desde&&b.hasta?`${me(b.desde)} ${b.desde.slice(0,4)} \u2192 ${me(b.hasta)} ${b.hasta.slice(0,4)}`:b.estado==="lista"&&b.hasta?`\u2713 lista \xB7 ${me(b.hasta)} ${b.hasta.slice(0,4)}`:Nn[b.estado],w=C&&L&&p.includes(C)&&p.includes(L)?`<i class="lt-barra ${b.estado} ${b.esDeuda?"es-deuda":""}" style="grid-column:${g(C)} / ${g(L)+1};grid-row:${R}"
           title="${m(b.nombre)}: ${m(G)}"></i>`:"";return`<div class="lt-nombre ${b.estado}" style="grid-row:${R}"><strong>${m(b.nombre)}</strong>
        <span class="rango">${m(G)}</span></div>
      <div class="lt-carril" style="grid-column:2 / ${p.length+2};grid-row:${R}"></div>
      ${w}`}).join(""),M=p.includes(r)?`<div class="lt-hoy" style="grid-column:${g(r)};grid-row:1 / ${s.length+2}"></div>`:"";return`
  <div class="panel inicio-tiempo">
    <h2>Cu\xE1ndo termino cada meta <span class="etiqueta simulacion">Simulaci\xF3n</span></h2>
    <p class="rango">De cuando empezaste a pagarla a cuando queda saldada. La columna marcada es este mes.</p>
    <div class="lt-marco"><div class="lt" style="grid-template-columns:minmax(120px, 190px) repeat(${p.length}, minmax(34px, 1fr))">
      ${M}${h}${y}
    </div></div>
  </div>`}function ta(){let e=vn();return[["inicio",On(e)],["radicacion",hn()],["vista",Sn(e)],["escenario",sn()],["metas",fn(e)],["proyeccion",Dn(e)],["obligaciones",pn()],["cuentas",$n()],["real",yn()],["nube",wn()]]}function it(e){if(typeof e.querySelectorAll=="function")for(let a of Array.from(e.querySelectorAll("table"))){let o=Array.from(a.querySelectorAll("thead th")).map(t=>(t.textContent??"").trim());if(lo(o)){a.classList.add("como-tarjetas");for(let t of Array.from(a.querySelectorAll("tbody tr"))){let n=Array.from(t.children),s=n.map(i=>Number(i.getAttribute("colspan")??1)||1),r=co(o,s);n.forEach((i,c)=>{let u=r[c];u?i.dataset.etiqueta=u:delete i.dataset.etiqueta})}}}}function Aa(e,a){e.innerHTML=a,it(e)}function ct(){return document.activeElement?.closest?.("[data-panel]")?.dataset.panel??null}function Ia(e=ct()){let a=new Set([e,Ca].filter(Boolean));for(let[o,t]of ta()){if(a.has(o))continue;let n=document.getElementById(`panel-${o}`);n&&Aa(n,t)}lt()}function lt(){let e=document.getElementById("mensaje");e&&(e.innerHTML=x?`<div class="mensaje ${x.malo?"malo":"bueno"}">${m(x.texto)}</div>`:"",x=null)}var dt="gestiondinerotrabajo.seccion";function kn(){try{return Ye(localStorage.getItem(dt))}catch{return Ye(null)}}function zn(e){try{localStorage.setItem(dt,e)}catch{}}function Hn(e){return`<nav class="barra-secciones">
    ${ye.map(a=>`<button data-accion="seccion" data-seccion="${a.id}"
      class="${a.id===e?"activa":""}" aria-current="${a.id===e?"page":"false"}">
      <span class="icono-seccion">${a.icono}</span>${m(a.rotulo)}</button>`).join("")}
  </nav>`}function Vn(e){let a=ze(),o=Ve(),t=o?new Date(o).toLocaleString("es-CO",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):null;return`<aside class="lateral">
    <div class="marca"><span class="logo">$</span>
      <div><strong>Mi dinero</strong><span>Metas con ingreso variable</span></div></div>
    <nav class="nav-lateral">
      ${ye.map(n=>`<button data-accion="seccion" data-seccion="${n.id}"
        class="${n.id===e?"activa":""}" aria-current="${n.id===e?"page":"false"}">
        <span class="icono-seccion">${n.icono}</span><span class="rotulo-seccion">${m(n.rotulo)}</span></button>`).join("")}
    </nav>
    <div class="lateral-pie">
      <div class="estado-nube ${a?"conectada":""}"><span class="punto"></span>
        <div><strong>${a?"Sincronizado":"Solo en este aparato"}</strong>
          <span>${a?t?`\xFAltima vez ${m(t)}`:"todav\xEDa sin sincronizar":"la nube est\xE1 en Ajustes"}</span></div></div>
      <button class="chico-linea" data-accion="exportar">Exportar respaldo</button>
      <button class="chico-linea" data-accion="importar">Importar respaldo</button>
    </div>
  </aside>`}function S(){let e=document.getElementById("app"),a=Uo(document.activeElement),o=document.activeElement,t=o&&typeof o.selectionStart=="number"?o.selectionStart:null,n=window.scrollY,s=kn();e.className=`seccion-${s}`,e.innerHTML=`
    ${Vn(s)}
    <header class="cabecera">
      <h1>Gesti\xF3n del dinero del trabajo</h1>
      <div class="acciones">
        <button data-accion="exportar">Exportar respaldo</button>
        <button data-accion="importar">Importar respaldo</button>
      </div>
    </header>
    <div id="mensaje"></div>
    ${ta().map(([r,i])=>`<div id="panel-${r}" data-panel="${r}"
         data-seccion="${Io(r)??""}">${i}</div>`).join("")}
    <input type="file" id="archivo" accept="application/json" hidden />
    ${Hn(s)}
    <div id="ventana-nube">${Ln()}</div>`,it(e),lt(),window.scrollTo({top:n,behavior:"instant"}),tn(a,t)}function ut(e){let a=Math.round(Number(e));if(!(!Number.isFinite(a)||a<=1))return a}$.set("escenario",e=>{let a=e.dataset.campo,o=e,t=o.value;if(l.escenario[a]=o.type==="date"?t:o.hasAttribute("data-dinero")?O(t):Number(t),a==="diasOptimista"||a==="diasPesimista"){let n=Math.round(Number(t));l.escenario[a]=Number.isFinite(n)&&n>0?n:1}k()});async function pt(e,a){let o=await B({titulo:a,detalle:"Lo que quieras recordar. Enter hace un salto de l\xEDnea; Ctrl+Enter guarda.",valorInicial:e.nota??"",textoAceptar:"Guardar",largo:!0});o!==null&&(o.trim()?e.nota=o.trim():delete e.nota,E())}$.set("nota-meta",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&pt(a,`Nota de \xAB${a.nombre}\xBB`)});$.set("nota-oblig",e=>{let a=l.obligaciones.find(o=>o.id===e.dataset.id);a&&pt(a,`Nota de \xAB${a.nombre}\xBB`)});$.set("nota-mes",async e=>{let a=e.dataset.mes,o=l.notasDelMes??={},t=await B({titulo:`Nota de ${V(a)}`,detalle:"Lo que quieras recordar de este mes. Enter hace un salto de l\xEDnea; Ctrl+Enter guarda.",valorInicial:o[a]??"",textoAceptar:"Guardar",largo:!0});t!==null&&(t.trim()?o[a]=t.trim():delete o[a],E())});$.set("link-meta",async e=>{let a=l.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=await B({titulo:`Enlace de \xAB${a.nombre}\xBB`,detalle:"Pega la direcci\xF3n de la p\xE1gina donde la vas a comprar. D\xE9jalo vac\xEDo para quitarlo.",valorInicial:a.link??"",textoAceptar:"Guardar"});if(o===null)return;if(!o.trim())return delete a.link,E();let t=Da(o);if(!t)return x={texto:"Esa direcci\xF3n no se entiende como p\xE1gina web. No cambi\xE9 el enlace.",malo:!0},S();a.link=t,E()});$.set("sobrante-a-metas",e=>{l.escenario.sobranteAMetas=e.checked,k()});$.set("elastico",e=>{l.escenario.colchonElastico=e.checked,k()});$.set("oblig",e=>{let a=l.obligaciones.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=a.tipo==="porcentaje"?Number(t)/100:O(t);else if(o==="tipo"){let n=t;n!==a.tipo&&(a.valor=n==="porcentaje"?.1:1e5),a.tipo=n}else o==="modo"?(a.modo=t,a.modo==="puntual"&&!a.supuesto&&(a.supuesto="siempre")):o==="grupo"?a.grupo=t.trim()||void 0:o==="desdePago"?a.desdePago=ut(t):o==="supuesto"?a.supuesto=t:a.nombre=t;k()});$.set("nuevo-cambio",e=>{let a=l.obligaciones.find(t=>t.id===e.dataset.id);if(!a)return;let o=Math.max(1,...(a.cambios??[]).map(t=>t.desdePago));a.cambios=[...a.cambios??[],{desdePago:o+1,valor:a.valor}],E()});$.set("cambio",e=>{let a=l.obligaciones.find(n=>n.id===e.dataset.id),o=a?.cambios?.[Number(e.dataset.i)];if(!a||!o)return;let t=e.value;if(e.dataset.campo==="desdePago"){let n=Math.round(Number(t));o.desdePago=Number.isFinite(n)&&n>0?n:1}else o.valor=a.tipo==="porcentaje"?Number(t)/100:O(t);k()});$.set("borrar-cambio",e=>{let a=l.obligaciones.find(t=>t.id===e.dataset.id);if(!a?.cambios)return;let o=Number(e.dataset.i);a.cambios=a.cambios.filter((t,n)=>n!==o),E()});function qa(e){return e==="ingreso"?"cambiosIngreso":"cambiosColchon"}$.set("nuevo-cambio-escenario",e=>{let a=qa(e.dataset.cual),o=l.escenario[a]??[],t=Math.max(1,...o.map(s=>s.desdePago)),n=a==="cambiosIngreso"?l.escenario.ingresoEsperado:l.escenario.colchonBase;l.escenario[a]=[...o,{desdePago:t+1,valor:n}],E()});$.set("cambio-escenario",e=>{let a=l.escenario[qa(e.dataset.cual)]?.[Number(e.dataset.i)];if(!a)return;let o=e.value;if(e.dataset.campo==="desdePago"){let t=Math.round(Number(o));a.desdePago=Number.isFinite(t)&&t>0?t:1}else a.valor=O(o);k()});$.set("borrar-cambio-escenario",e=>{let a=Number(e.dataset.i),o=qa(e.dataset.cual);l.escenario[o]=(l.escenario[o]??[]).filter((t,n)=>n!==a),E()});$.set("nueva-oblig",()=>{let e=W("ob");aa=e,l.obligaciones.push({id:e,nombre:"Nueva obligaci\xF3n",tipo:"fijo",valor:1e5,modo:"cada_pago"}),E()});$.set("borrar-oblig",e=>{l.obligaciones=l.obligaciones.filter(a=>a.id!==e.dataset.id),E()});$.set("meta",e=>{let a=l.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=O(t);else if(o==="abonado")a.abonado=O(t);else if(o==="desdePago")a.desdePago=ut(t);else if(o==="maximoPorPago"){let n=O(t);a.maximoPorPago=n>0?n:void 0}else if(o==="enCuotas"){let n=Math.round(Number(t));a.enCuotas=Number.isFinite(n)&&n>0?n:void 0}else if(o==="antesDelPago"){let n=Math.round(Number(t));a.antesDelPago=Number.isFinite(n)&&n>0?n:void 0}else if(o==="grupo")a.grupo=t.trim()||void 0;else if(o==="clase"){a.clase=t==="deuda"?"deuda":void 0,E();return}else a.nombre=t;k()});function Bn(e){let a=e.classList.toggle("abierta"),o=e.dataset.idFila;if(o)for(let t of document.querySelectorAll(`[data-hija-de="${CSS.escape(o)}"]`))t.classList.toggle("abierta",a)}function mt(e,a){let o=document.getElementById(`panel-${e==="metas"?"metas":"obligaciones"}`);if(o){for(let t of o.querySelectorAll("tr[data-resumen]"))t.classList.toggle("abierta",a);for(let t of o.querySelectorAll("[data-hija-de]"))t.classList.toggle("abierta",a)}}$.set("desplegar-todo",e=>mt(e.dataset.lista,!0));$.set("plegar-todo",e=>mt(e.dataset.lista,!1));$.set("seccion",e=>{let a=Ye(e.dataset.seccion);zn(a);let o=document.getElementById("app");o&&(o.className=`seccion-${a}`);for(let t of document.querySelectorAll(".barra-secciones button, .nav-lateral button")){let n=t.dataset.seccion===a;t.classList.toggle("activa",n),t.setAttribute("aria-current",n?"page":"false")}window.scrollTo({top:0,behavior:"instant"})});$.set("nueva-meta",()=>{let e=W("meta");aa=e,l.metas.push({id:e,nombre:"",valor:0}),E(),document.querySelector(`input[data-id="${e}"][data-campo="nombre"]`)?.focus()});$.set("plegar-meses",e=>{let a=e.dataset.abrir==="1";if(le.clear(),a)for(let t of document.querySelectorAll("[data-mes]"))le.add(t.dataset.mes);let o=document.getElementById("panel-vista");o&&Aa(o,ta().find(([t])=>t==="vista")[1])});$.set("ordenar",e=>{let a=e.dataset.por,o=(n,s)=>n.localeCompare(s,"es",{sensitivity:"base",numeric:!0}),t=(n,s)=>a==="valor"?s.valor-n.valor:a==="grupo"&&o(n.grupo??"\uFFFF",s.grupo??"\uFFFF")||o(n.nombre,s.nombre);e.dataset.lista==="metas"?(l.metas=[...l.metas].sort(t),x={texto:`Metas ordenadas por ${a}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron. Si no era lo que quer\xEDas, reord\xE9nalas con las flechas.`,malo:!1}):l.obligaciones=[...l.obligaciones].sort(t),E()});$.set("duplicar-meta",e=>{let a=l.metas.findIndex(n=>n.id===e.dataset.id);if(a<0)return;let o=l.metas[a],t={...o,id:W("meta"),nombre:`${o.nombre} (copia)`,abonado:0};delete t.compra,l.metas.splice(a+1,0,t),E()});$.set("borrar-meta",e=>{l.metas=l.metas.filter(a=>a.id!==e.dataset.id),E()});function gt(e,a){let o=e+a;if(o<0||o>=l.metas.length)return;let t=l.metas.slice();[t[e],t[o]]=[t[o],t[e]],l.metas=t,E()}$.set("subir",e=>gt(Number(e.dataset.i),-1));$.set("bajar",e=>gt(Number(e.dataset.i),1));$.set("nueva-cuenta",()=>{let e=new Date,a=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];l.cuentas.push({id:W("cta"),periodo:`${a[e.getMonth()]} de ${e.getFullYear()}`,montoEsperado:l.escenario.ingresoEsperado}),E()});$.set("cuenta",e=>{let a=l.cuentas.find(t=>t.id===e.dataset.id);if(!a)return;let o=e.value;e.dataset.campo==="montoEsperado"?a.montoEsperado=O(o):a.periodo=o,k()});$.set("borrar-cuenta",e=>{l.cuentas=l.cuentas.filter(o=>o.id!==e.dataset.id);let a=new Set(l.ingresos.filter(o=>o.cuentaDeCobroId===e.dataset.id).map(o=>o.id));l.ingresos=l.ingresos.filter(o=>o.cuentaDeCobroId!==e.dataset.id),l.repartos=l.repartos.filter(o=>!a.has(o.ingresoId)),E()});$.set("abonar",async e=>{let a=l.cuentas.find(i=>i.id===e.dataset.id);if(!a)return;let o=pe([a],l.ingresos)[0],t=o.pendiente>0?o.pendiente:a.montoEsperado,n=await B({titulo:`\xBFCu\xE1nto te pagaron de ${a.periodo}?`,detalle:o.pendiente>0&&o.recibido>0?`Ya te hab\xEDan pagado ${f(o.recibido)}. Faltan ${f(o.pendiente)}.`:void 0,valorInicial:I(t),dinero:!0,textoAceptar:"Registrar pago"});if(n===null)return;let s=O(n);if(!Number.isFinite(s)||s<=0)return x={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},S();let r={id:W("ing"),cuentaDeCobroId:a.id,fecha:ee(),monto:s};l.ingresos.push(r),l.repartos.push(de(r)),x={texto:"Registrado. Mira abajo en qu\xE9 se va ese dinero y corr\xEDgelo si no fue as\xED.",malo:!1},E()});$.set("comprada",async e=>{let a=l.metas.find(s=>s.id===e.dataset.id);if(!a)return;let o=await B({titulo:`\xBFPor cu\xE1nto compraste ${a.nombre}?`,detalle:`La ten\xEDas en ${f(a.valor)}. Pon lo que pagaste de verdad, aunque sea distinto.`,valorInicial:I(a.valor),dinero:!0,textoAceptar:"Siguiente"});if(o===null)return;let t=await B({titulo:"\xBFEn qu\xE9 mes la compraste?",detalle:"Escr\xEDbelo como AAAA-MM. Por ejemplo, 2026-08 para agosto de este a\xF1o.",valorInicial:ee().slice(0,7),textoAceptar:"Guardar"});if(t===null)return;let n=/^\d{4}-\d{2}$/.test(t.trim())?t.trim():ee().slice(0,7);a.compra={mes:n,precioReal:O(o)},E()});$.set("no-comprada",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&(delete a.compra,E())});$.set("proponer",e=>{let a=l.ingresos.find(o=>o.id===e.dataset.id);a&&(l.repartos=l.repartos.filter(o=>o.ingresoId!==a.id),l.repartos.push(de(a)),E())});$.set("confirmar-reparto",e=>{let a=l.repartos.find(o=>o.id===e.dataset.id);a&&(a.propuesto=!1,E())});$.set("editar-reparto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id);if(!a)return;let o=O(e.value),t=e.dataset.tipo,n=Number(e.dataset.i);t==="ahorro"?a.alAhorro=o:t==="obligaciones"&&a.obligaciones[n]?a.obligaciones[n].monto=o:t==="abonos"&&a.abonos[n]&&(a.abonos[n].monto=o),a.propuesto=!1,k()});$.set("quitar-previo",e=>{let a=l.metas.find(t=>t.id===e.dataset.id);if(!a)return;let o=a.abonado??0;a.abonado=0,x={texto:`Quit\xE9 los ${f(o)} que estaban escritos a mano en ${a.nombre}. Ahora manda lo registrado en \xABen qu\xE9 se fue la plata\xBB, que es lo que de verdad pagaste.`,malo:!1},E()});$.set("gasto-a-abono",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.metas.find(s=>s.id===e.dataset.meta);if(!a||!o)return;let t=e.dataset.nombre,n=(a.gastos??[]).find(s=>s.nombre===t);n&&(a.gastos=a.gastos.filter(s=>s!==n),a.abonos.push({nombre:o.nombre,monto:n.monto,refId:o.id,movidoDesdeGasto:!0}),x={texto:`Listo: los ${f(n.monto)} de \xAB${n.nombre}\xBB ahora cuentan como abono a ${o.nombre}. El total del mes no cambi\xF3. Si te equivocaste, la l\xEDnea tiene un bot\xF3n \u21A9 para devolverla a gastos.`,malo:!1},E())});$.set("abono-a-gasto",e=>{let a=l.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.abonos[o];!a||!t||(a.abonos=a.abonos.filter((n,s)=>s!==o),a.gastos=[...a.gastos??[],{nombre:t.nombre,monto:t.monto}],x={texto:`${t.nombre} volvi\xF3 a ser un gasto suelto.`,malo:!1},E())});$.set("nuevo-gasto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=ge(a,o),n=t>0?t:Math.min(a.alAhorro,a.alAhorro);a.gastos=[...a.gastos??[],{nombre:"",monto:0}],n<=0&&(a.propuesto=!1),E()});$.set("editar-gasto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];if(!a||!t)return;let n=e.value;if(e.dataset.campo==="nombre")t.nombre=n;else{let s=O(n);a.alAhorro=Math.max(0,a.alAhorro-(s-t.monto)),t.monto=s}a.propuesto=!1,k()});$.set("borrar-gasto",e=>{let a=l.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];!a||!t||(a.alAhorro+=t.monto,a.gastos=a.gastos.filter((n,s)=>s!==o),E())});$.set("recalcular",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=a.gastos??[],n=de(o);n.gastos=t,n.alAhorro=Math.max(0,n.alAhorro-t.reduce((s,r)=>s+r.monto,0)),l.repartos=l.repartos.map(s=>s.id===a.id?n:s),x={texto:"Recalculado con las obligaciones de ahora.",malo:!1},E()});$.set("cuadrar",e=>{let a=l.repartos.find(t=>t.id===e.dataset.id),o=l.ingresos.find(t=>t.id===a?.ingresoId);!a||!o||(a.alAhorro=Math.max(0,a.alAhorro+ge(a,o)),a.propuesto=!1,E())});$.set("aporte-externo",async e=>{let a=await B({titulo:"\xBFCu\xE1nto vas a meter de tu bolsillo?",detalle:"Plata tuya que no viene del trabajo: Nequi, efectivo, lo que tengas guardado por otro lado.",valorInicial:"0",dinero:!0,textoAceptar:"Meterlo"});if(a===null)return;let o=O(a);if(o<=0)return x={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},S();let t=await B({titulo:"\xBFDe d\xF3nde sali\xF3?",detalle:"Para que dentro de unos meses sepas qu\xE9 fue esto.",valorInicial:"Nequi",textoAceptar:"Guardar"}),n={id:W("ing"),fecha:ee(),monto:o,nota:t?.trim()||"de otro lado"};l.ingresos.push(n),l.repartos.push(de(n)),E()});$.set("soporte",e=>{let a=$e(new Date),o=new Set(l.soportesMarcados[a]??[]),t=e.dataset.id;e.checked?o.add(t):o.delete(t),l.soportesMarcados={...l.soportesMarcados,[a]:[...o]},k()});$.set("borrar-ingreso",e=>{l.repartos=l.repartos.filter(a=>a.ingresoId!==e.dataset.id),l.ingresos=l.ingresos.filter(a=>a.id!==e.dataset.id),E()});function bt(){let e=globalThis.__TAURI__;return e?.dialog&&e?.fs?{dialog:e.dialog,fs:e.fs}:null}$.set("exportar",async()=>{let e=so(l),a=`respaldo-dinero-${ee()}.json`,o=bt();if(!o){let t=new Blob([e],{type:"application/json"}),n=document.createElement("a");return n.href=URL.createObjectURL(t),n.download=a,n.click(),URL.revokeObjectURL(n.href),x={texto:`Respaldo guardado en tu carpeta de descargas como ${a}.`,malo:!1},S()}try{let t=await o.dialog.save({title:"\xBFD\xF3nde guardo el respaldo?",defaultPath:a,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!t)return;await o.fs.writeTextFile(t,e),x={texto:`Respaldo guardado en ${t}`,malo:!1}}catch(t){x={texto:`No pude guardar el respaldo: ${String(t)}`,malo:!0}}S()});$.set("importar",async()=>{let e=bt();if(e)try{let o=await e.dialog.open({title:"\xBFQu\xE9 respaldo quieres cargar?",multiple:!1,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!o)return;let{estado:t,aviso:n}=ha(await e.fs.readTextFile(o));return t?(l=t,x={texto:"Respaldo importado.",malo:!1},E()):(x={texto:n.texto,malo:!0},S())}catch(o){return x={texto:`No pude leer ese archivo: ${String(o)}`,malo:!0},S()}let a=document.getElementById("archivo");a.onchange=async()=>{let o=a.files?.[0];if(!o)return;let{estado:t,aviso:n}=ha(await o.text());if(!t)return x={texto:n.texto,malo:!0},S();l=t,x={texto:"Respaldo importado.",malo:!1},E()},a.click()});document.addEventListener("input",e=>{let a=e.target;if(a instanceof HTMLInputElement&&(a.hasAttribute("data-dinero")&&io(a),a.dataset.campo==="desdePago")){let o=a.parentElement?.querySelector(".mes-de-pago");if(o){let t=Math.max(1,Math.round(Number(a.value)||1));o.textContent=t<=1?"desde el primero":z(A(t,T()).optimista)}}});document.addEventListener("focusout",e=>{let a=e.target?.closest?.("[data-panel]");if(!a||e.relatedTarget?.closest?.("[data-panel]")===a)return;let t=a.dataset.panel;setTimeout(()=>{if(xe||ct()===t)return;let n=ta().find(([r])=>r===t)?.[1],s=document.getElementById(`panel-${t}`);n!==void 0&&s&&Aa(s,n)},0)});document.addEventListener("toggle",e=>{let a=e.target,o=a?.dataset?.mes;o&&(a.open?le.add(o):le.delete(o))},!0);document.addEventListener("click",e=>{N&&e.target?.classList?.contains("cerrable")&&(N=null,S())});document.addEventListener("keydown",e=>{e.key==="Escape"&&N&&(N=null,S())});document.addEventListener("change",e=>{let a=e.target?.closest("[data-accion]");a&&$.get(a.dataset.accion)?.(a,e)});document.addEventListener("click",e=>{let a=e.target,o=a?.closest?.("a[data-enlace]"),t=globalThis.__TAURI__?.opener;if(o&&t?.openUrl){e.preventDefault(),t.openUrl(o.href).catch(()=>{x={texto:"No pude abrir el enlace en el navegador.",malo:!0},S()});return}let n=a?.closest?.("tr[data-resumen]");if(Ze){Ze=!1;return}if(n&&!a?.closest("input, select, textarea, button, a")&&window.matchMedia("(max-width: 620px)").matches){Bn(n);return}let s=e.target?.closest("button[data-accion]");xe=!1,s?(ce=!1,$.get(s.dataset.accion)?.(s,e)):ce&&(ce=!1,Ia())});"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(()=>{})});var Ke=no();l=Ke.estado;Ke.aviso&&(x={texto:Ke.aviso.texto,malo:Ke.aviso.grave});function Qn(){let e=new Set(l.repartos.map(o=>o.ingresoId)),a=l.ingresos.filter(o=>!e.has(o.id)).sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o of a)l.repartos.push(de(o));return a.length>0}Qn()&&re(l);S();globalThis.__estado=()=>l;globalThis.__reiniciar=()=>{l=X(),E()};$.set("nube-entrar",async()=>{let e=document.getElementById("nube-correo")?.value??"",a=document.getElementById("nube-clave")?.value??"";if(!e.trim()||!a)return x={texto:"Escribe tu correo y tu contrase\xF1a.",malo:!0},S();try{x={texto:`Entraste como ${(await Do(e,a)).correo}. Ya puedes sincronizar.`,malo:!1}}catch(o){x={texto:o.message,malo:!0}}S()});$.set("nube-salir",()=>{ya(),Y=null,F=[],x={texto:"Saliste de la cuenta. Tus datos siguen aqu\xED, intactos.",malo:!1},S()});$.set("nube-preparar",async e=>{if(j)return;let a=e.dataset.modo==="traer"?"traer":"subir";j=!0,S();try{let o=await Ro(),t=ie(l),n=Co(t,o);n.length===0?(Y=JSON.parse(JSON.stringify(l)),He(Y),N={titulo:"Este aparato y la nube ya est\xE1n iguales",lineas:["No hab\xEDa nada que cambiar."],malo:!1}):q={modo:a,locales:t,remotas:o,difs:n,elecciones:Sa(n,a)}}catch(o){N={titulo:"No se pudo comparar con la nube",lineas:[o.message,"No se cambi\xF3 nada."],malo:!0}}j=!1,S()});$.set("dona-mes",e=>{We=e instanceof HTMLSelectElement?e.value:e.dataset.mes??null,S()});$.set("nube-cerrar-ventana",()=>{N=null,S()});$.set("nube-elegir",e=>{if(!q)return;let a=e.dataset.lado==="nube"?"nube":"aqui";q.elecciones[e.dataset.clave]=a;let o=e.dataset.clave;for(let t of document.querySelectorAll(`input[type="radio"][name="${CSS.escape(o)}"]`))t.closest(".opcion")?.classList.toggle("elegida",t.checked)});$.set("nube-cancelar",()=>{q=null,N={titulo:"Cancelado",lineas:["No se cambi\xF3 nada, ni aqu\xED ni en la nube."],malo:!1},S()});$.set("nube-aplicar",async()=>{if(!(!q||j)){j=!0,S();try{let e=q,a=Ao(e.locales,e.remotas,e.difs,e.elecciones,new Date().toISOString()),o=e.difs.map(t=>In(t,e.elecciones[t.clave]??"aqui"));await Po(a),l=Ne(a,l),re(l),Y=JSON.parse(JSON.stringify(l)),He(Y),F=[],q=null,N={titulo:`Listo: ${e.modo==="subir"?"subido":"tra\xEDdo"}. Este aparato y la nube quedaron iguales`,lineas:o,malo:!1}}catch(e){N={titulo:"No se aplic\xF3 nada",lineas:[e.message],malo:!0}}j=!1,S()}});$.set("nube-sincronizar",async()=>{if(!j){j=!0,S();try{let e=await So(l,Y,new Date().toISOString());l=e.estado,Y=JSON.parse(JSON.stringify(e.estado)),F=e.descartes.map(a=>({tabla:a.tabla,id:a.id,campo:a.campo,valor:a.valor,gano:a.gano,nombre:a.nombre})),re(l),He(Y),x={texto:F.length===0?"Todo al d\xEDa. Nada que resolver.":`Listo. ${F.length} dato(s) distintos entre los dos aparatos: mira abajo.`,malo:!1}}catch(e){x={texto:e.message,malo:!0}}j=!1,S()}});$.set("nube-revertir",e=>{let a=Number(e.dataset.i),o=F[a];if(!o)return;let t=zo(l,o);if(!t.ok)return x={texto:t.motivo??"Eso no se puede deshacer desde aqu\xED.",malo:!0},S();F=F.filter((n,s)=>s!==a),re(l),x={texto:`Listo: ${Ue(o,l)} se queda con ${Ee(o.campo,o.valor)}. Sincroniza otra vez para que el otro aparato lo tome.`,malo:!1},S()});document.addEventListener("keydown",e=>{if(e.key!=="Enter"||e.isComposing)return;let a=e.target;!a||a.closest(".capa-dialogo")||!(a instanceof HTMLInputElement)||a.type==="checkbox"||(e.preventDefault(),a.blur())});
