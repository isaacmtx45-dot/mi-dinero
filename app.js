var We=Number.MAX_SAFE_INTEGER;function D(e){let a=typeof e=="number"?e:Number(e);return Number.isFinite(a)?Math.abs(a)>We?a<0?-We:We:Math.round(a):0}function se(e,a){return ye(e*a)}function ye(e){let a=D(e);return a<=0?a:Math.min(Math.ceil(a/1e3)*1e3,We)}var Oa=100;function ds(e,a){return a<=0?"sin_pagar":a>=e+Oa?"pagaron_de_mas":a>=e-Oa?"completa":"parcial"}function xe(e,a){let o=new Map;for(let t of a){let n=o.get(t.cuentaDeCobroId)??[];n.push(t),o.set(t.cuentaDeCobroId,n)}return e.map(t=>{let n=(o.get(t.id)??[]).slice().sort((i,c)=>i.fecha.localeCompare(c.fecha)),s=n.reduce((i,c)=>i+D(c.monto),0),r=ds(D(t.montoEsperado),s);return{cuenta:t,ingresos:n,recibido:s,pendiente:r==="completa"?0:Math.max(0,D(t.montoEsperado)-s),estado:r,ultimoPago:n.length?n[n.length-1].fecha:null}})}function Vo(e){return e.filter(a=>a.pendiente>0)}function Uo(e){return e.cuenta.noHubo?!1:D(e.cuenta.montoEsperado)<=0||e.pendiente>0}function ea(e){return e.reduce((a,o)=>a+o.pendiente,0)}var Ke=new Intl.NumberFormat("es-CO");function Go(e){let a=`$${Ke.format(e.cuenta.montoEsperado)}`,o=`$${Ke.format(e.recibido)}`;if(e.cuenta.noHubo)return`${e.cuenta.periodo}: ese mes no hubo cuenta`;switch(e.estado){case"sin_pagar":return`${e.cuenta.periodo}: sin pagar \xB7 te deben ${a}`;case"parcial":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 faltan $${Ke.format(e.pendiente)}`;case"completa":return`${e.cuenta.periodo}: pagada completa (${o})`;case"pagaron_de_mas":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 $${Ke.format(e.recibido-e.cuenta.montoEsperado)} de mas`}}function Fa(e,a){let o=Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10)),t=Date.UTC(+a.slice(0,4),+a.slice(5,7)-1,+a.slice(8,10));return Math.round((t-o)/864e5)}function Na(e){return e.filter(a=>!!a.cuenta.fechaRadicacion).map(a=>{let o=a.cuenta.fechaRadicacion,t=a.ingresos[0]?.fecha??null,n=null;if((a.estado==="completa"||a.estado==="pagaron_de_mas")&&D(a.cuenta.montoEsperado)>0){let s=0;for(let r of a.ingresos)if(s+=D(r.monto),s>=D(a.cuenta.montoEsperado)-Oa){n=r.fecha;break}}return{cuentaId:a.cuenta.id,periodo:a.cuenta.periodo,radicada:o,primerPago:t,completo:n,diasPrimero:t?Fa(o,t):null,diasCompleto:n?Fa(o,n):null}})}function _a(e){let a=o=>o.length?Math.round(o.reduce((t,n)=>t+n,0)/o.length):null;return{pagadas:e.filter(o=>o.diasPrimero!==null).length,primero:a(e.map(o=>o.diasPrimero).filter(o=>o!==null)),completo:a(e.map(o=>o.diasCompleto).filter(o=>o!==null))}}var Ze=60;function ka(e,a){let o=_a(Na(e));if(o.primero===null)return[];let t=o.primero;return e.filter(n=>n.estado==="sin_pagar"&&!n.cuenta.noHubo&&!!n.cuenta.fechaRadicacion).map(n=>({r:n,dias:Fa(n.cuenta.fechaRadicacion,a)})).filter(({dias:n})=>n>t).map(({r:n,dias:s})=>({cuentaId:n.cuenta.id,periodo:n.cuenta.periodo,dias:s,normal:t,medidas:o.pagadas,pasoElMaximo:s>Ze}))}function Bo(e){let a=n=>`${n} ${n===1?"d\xEDa":"d\xEDas"}`,o=`La cuenta de ${e.periodo} lleva ${a(e.dias)} radicada sin pago \xB7 lo normal en ti: ${a(e.normal)} (medido en ${e.medidas} ${e.medidas===1?"cuenta":"cuentas"})`;if(e.pasoElMaximo)return`${o} \xB7 ya pas\xF3 los ${Ze} d\xEDas que avis\xF3 la empresa`;let t=Ze-e.dias;return`${o} \xB7 la empresa avis\xF3 que puede tardar hasta ${Ze}: `+(t===0?"hoy se cumplen":`${t===1?"falta":"faltan"} ${a(t)}`)}function za(e,a){let o=e.trim();return!/^\d{4}-\d{2}-\d{2}$/.test(o)||Number.isNaN(Date.parse(o+"T00:00:00"))?{error:"Esa fecha no se entiende."}:o>a?{error:"Esa fecha todav\xEDa no ha llegado: un pago recibido no puede ser del futuro."}:{fecha:o}}function us(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function aa(e,a,o){return o>0&&o%30===0?ps(a,(e-1)*(o/30)):us(a,(e-1)*o)}function ps(e,a){let o=e.getFullYear(),t=e.getMonth()+a,n=new Date(o,t+1,0).getDate();return new Date(o,t,Math.min(e.getDate(),n),e.getHours(),e.getMinutes(),e.getSeconds())}function L(e,a){let o=Math.max(1,a.diasOptimista);return{optimista:aa(e,a.desde,o),pesimista:aa(e,a.desde,Math.max(o,a.diasPesimista))}}function Va(e){return e.diasPesimista<=e.diasOptimista}var ms=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function B(e){return`${ms[e.getMonth()]} de ${e.getFullYear()}`}var Ha=["ene.","feb.","mar.","abr.","mayo","jun.","jul.","ago.","sept.","oct.","nov.","dic."];function H(e){return Ha[Number(e.slice(5,7))-1]??e}function re(e){let[a,o]=[e.optimista,e.pesimista],t=Ha[a.getMonth()],n=Ha[o.getMonth()];return a.getFullYear()!==o.getFullYear()?`${t} ${a.getFullYear()} \u2013 ${n} ${o.getFullYear()}`:a.getMonth()===o.getMonth()?`${t} ${a.getFullYear()}`:`${t} \u2013 ${n} ${o.getFullYear()}`}function Se(e){let a=B(e.optimista),o=B(e.pesimista);return a===o?a:`entre ${a} y ${o}`}function oa(e){return new Map(e.map(a=>[a.id,Math.max(0,D(a.valor)-D(a.abonado??0))]))}function gs(e){return e.baseCobro??(e.tipo==="porcentaje"?"cada_ingreso":"una_vez_por_cuenta")}function fs(e,a,o){if(!o&&gs(e)==="una_vez_por_cuenta")return!1;if(e.modo==="primer_pago")return a===1&&o;if(a<(e.desdePago??1))return!1;if(e.modo==="cada_pago")return!0;let t=e.supuesto??"siempre";return t==="nunca"?!1:t==="cada_dos_pagos"?a%2===1:!0}function Z(e,a,o){let t=e,n=0;for(let s of a??[]){let r=Math.max(1,Math.round(s.desdePago));o>=r&&r>=n&&(t=s.valor,n=r)}return t}function bs(e,a,o){let t=Z(e.valor,e.cambios,o);return e.tipo==="porcentaje"?se(a,t):D(t)}function qe(e,a){return Math.max(1,ye(Math.ceil(D(e)/Math.round(a))))}function Yo(e,a){let o=D(e);if(o<=0||a<=0)return;let t=o%a;return t===0?void 0:t}function Ua(e,a){return e.maximoPorPago&&e.maximoPorPago>0?D(e.maximoPorPago):e.enCuotas&&e.enCuotas>0?qe(e.valor,e.enCuotas):a}function vs(e,a,o){if(!e.fechaFija||!e.antesDelPago||o<=0)return 0;let t=Math.round(e.antesDelPago);return a<(e.desdePago??1)||a>t?0:Math.min(o,qe(o,t-a+1),Ua(e,o))}function Qo(e,a,o){let t=e.find(n=>n.metaId===a);t?t.monto+=o:e.push({metaId:a,monto:o})}function $s(e,a,o,t){for(let n of[!0,!1])for(let s of a){if(e<=0)return 0;let r=o.get(s.id)??0;if(r<=0)continue;let i=t.find(p=>p.metaId===s.id),c=i?.monto??0,d=n?Ua(s,r+c)-c:r,u=Math.min(r,e,d);u<=0||(i?(i.monto+=u,i.deLoQueSobro=(i.deLoQueSobro??0)+u):t.push({metaId:s.id,monto:u,deLoQueSobro:u}),o.set(s.id,r-u),e-=u)}return e}function hs(e){return e.some(a=>a.puedeEsperar)?[...e.filter(a=>!a.puedeEsperar),...e.filter(a=>a.puedeEsperar)]:e}function Re(e,a,o,t,n,s,r,i=!0){let c=D(a),d=[];for(let $ of o){if(!fs($,e,i))continue;let R=Math.min(bs($,a,e),c);R<=0||(d.push({nombre:$.nombre,monto:R}),c-=R)}let u=Z(t.base,t.cambios,e),p=Math.min(D(u),c);c-=p;let m=[],v=0,x=hs(n),S=!1;for(let $ of x){if(c<=0)break;let R=s.get($.id)??0,C=Math.min(vs($,e,R),c);C<=0||(Qo(m,$.id,C),s.set($.id,R-C),c-=C,S=!0)}for(let $ of x){let R=s.get($.id)??0;if(R<=0||e<($.desdePago??1))continue;let C=m.find(w=>w.metaId===$.id)?.monto??0,k=Ua($,R+C)-C,N=Math.min(R,c,k);if(t.elastico&&N<R&&k>=R){let w=Math.max(0,p-D(t.minimo)),ne=R-N;ne<=w&&(p-=ne,v+=ne,N=R)}if(!(N<=0)&&(Qo(m,$.id,N),s.set($.id,R-N),c-=Math.min(N,c),c<=0))break}if(t.sobranteAMetas&&c>0&&(c=$s(c,x,s,m)),S){let $=new Map(x.map((R,C)=>[R.id,C]));m.sort((R,C)=>($.get(R.metaId)??0)-($.get(C.metaId)??0))}let h=c;return{numero:e,ingreso:a,obligaciones:d,aColchon:p,recorteColchon:v,abonos:m,sobrante:h,saldoAhorro:r+p+h}}function Jo(e,a,o,t,n,s,r=!0){let i=e.cuentaDeCobroId===void 0||e.cuentaDeCobroId==="",c=Re(a,D(e.monto),i?[]:o,i?{...t,base:0,minimo:0}:t,n,s,0,r),d=new Map(n.map(u=>[u.id,u]));return{id:`rep-${e.id}`,ingresoId:e.id,obligaciones:c.obligaciones.map(u=>({nombre:u.nombre,monto:u.monto})),abonos:c.abonos.map(u=>({nombre:d.get(u.metaId)?.nombre??"(meta borrada)",monto:u.monto,refId:u.metaId})),alAhorro:c.aColchon+c.sobrante,propuesto:!0}}function Ds(e){let a=o=>o.reduce((t,n)=>t+D(n.monto),0);return a(e.obligaciones)+a(e.abonos)+a(e.gastos??[])+D(e.alAhorro)}function we(e,a){return D(a.monto)-Ds(e)}var Ga=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Xo(e){return e.slice(0,7)}function Ce(e,a){let o=D(a.monto);if(o===0)return;let t=a.refId?`meta:${a.refId}`:`nombre:${a.nombre}`,n=e.get(t);if(!n){e.set(t,{...a,monto:o});return}n.monto+=o,a.deLoQueSobro&&(n.deLoQueSobro=(n.deLoQueSobro??0)+a.deLoQueSobro)}function Ba(e,a){let o=new Map(a.map(n=>[n.ingresoId,n])),t=new Map;for(let n of e){let s=Xo(n.fecha),r=t.get(s);r||(r={mes:s,entro:0,deTrabajo:0,deFuera:0,aObligaciones:0,aMetas:0,enGastos:0,alAhorro:0,detalle:[],sinAsignar:0,_detalle:new Map},t.set(s,r));let i=D(n.monto);r.entro+=i,n.cuentaDeCobroId===void 0||n.cuentaDeCobroId===""?r.deFuera+=i:r.deTrabajo+=i;let d=o.get(n.id);if(!d){r.sinAsignar+=i;continue}for(let u of d.obligaciones)r.aObligaciones+=D(u.monto),Ce(r._detalle,u);for(let u of d.abonos)r.aMetas+=D(u.monto),Ce(r._detalle,u);for(let u of d.gastos??[])r.enGastos+=D(u.monto),Ce(r._detalle,u);r.alAhorro+=D(d.alAhorro),r.sinAsignar+=we(d,n)}return[...t.values()].map(({_detalle:n,...s})=>({...s,detalle:[...n.values()].sort((r,i)=>i.monto-r.monto)})).sort((n,s)=>n.mes.localeCompare(s.mes))}function Wo(e){let a=new Map;for(let o of e)for(let t of[...o.obligaciones,...o.abonos,...o.gastos??[]])Ce(a,t);return[...a.values()].sort((o,t)=>t.monto-o.monto)}function j(e){let[a,o]=e.split("-"),t=Number(o)-1;return Ga[t]?`${Ga[t]} de ${a}`:e}function Ko(e,a,o,t=[]){let n=new Map,s=new Map,r=new Map(t.map(c=>[c.id,c.nombre])),i=c=>r.get(c)??c;for(let c of e){let d=aa(c.numero,a,Math.max(1,o)),u=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,p=n.get(u);p||(p={mes:u,entro:0,aObligaciones:0,aMetas:0,alAhorro:0,detalle:[],pagos:[]},n.set(u,p),s.set(u,new Map));let m=s.get(u);p.pagos.push(c.numero),p.entro+=D(c.ingreso);for(let v of c.obligaciones)p.aObligaciones+=D(v.monto),Ce(m,{nombre:v.nombre,monto:v.monto});for(let v of c.abonos)p.aMetas+=D(v.monto),Ce(m,{nombre:i(v.metaId),monto:v.monto,refId:v.metaId,...v.deLoQueSobro?{deLoQueSobro:v.deLoQueSobro}:{}});p.alAhorro+=D(c.aColchon)+D(c.sobrante)}return[...n.values()].map(c=>({...c,detalle:[...s.get(c.mes).values()].sort((d,u)=>u.monto-d.monto)})).sort((c,d)=>c.mes.localeCompare(d.mes))}function je(e,a,o){let t=new Set(a.map(s=>s.cuentaDeCobroId).filter(s=>!!s));if(e.cuentaDeCobroId){let s=o?.(e.cuentaDeCobroId);return s||(t.has(e.cuentaDeCobroId)?t.size:t.size+1)}let n=[...t].map(s=>o?.(s)).filter(s=>!!s);return Math.max(1,n.length>0?Math.max(...n):t.size)}function ie(e){return(e??[]).filter(a=>D(a.monto)!==0)}function Zo(e,a){let o=new Set([...ie(a.obligaciones),...ie(a.abonos)].map(t=>t.nombre));return[...ie(e.obligaciones),...ie(e.abonos)].map(t=>t.nombre).filter(t=>!o.has(t))}function et(e,a,o,t){let n=a.find(r=>r.nombre.trim()===e.trim());if(n)return n.compra?{tipo:"ya-comprada"}:D(n.abonado??0)>=D(n.valor)?{tipo:"ya-pagada"}:(n.desdePago??1)>t?{tipo:"empieza-despues",pago:n.desdePago}:{tipo:"no-se-sabe"};let s=o.find(r=>r.nombre.trim()===e.trim());return s?s.valor<=0?{tipo:"en-cero"}:s.modo==="primer_pago"&&t>1?{tipo:"solo-el-primer-pago"}:(s.desdePago??1)>t?{tipo:"empieza-despues",pago:s.desdePago}:s.modo==="puntual"?{tipo:"puntual"}:{tipo:"no-se-sabe"}:{tipo:"ya-no-esta"}}function at(e,a,o,t=new Map,n=new Map){let s=[...n.keys()].filter(i=>i<o&&!a.some(c=>c.mes===i)&&!e.some(c=>c.mes===i));return[...new Set([...e.map(i=>i.mes),...a.map(i=>i.mes),...s])].sort().map(i=>{let c=e.find(m=>m.mes===i)??null,d=a.find(m=>m.mes===i)??null,u=i<o?"pasado":i===o?"actual":"futuro",p=t.get(i)??(c?{monto:c.entro,segun:"escenario"}:null);return{mes:i,estado:u,real:d,simulado:c,esperado:p,diferencia:u==="pasado"&&p&&d?d.entro-p.monto:null,...s.includes(i)?{sinPagar:n.get(i)}:{}}})}function ot(e,a){let o=new Map;for(let t of e){if(t.noHubo||a.some(s=>s.cuentaDeCobroId===t.id))continue;let n=ce(t.periodo,[]);n&&o.set(n,(o.get(n)??0)+D(t.montoEsperado))}return o}function ta(e,a){let[o,t]=e.split("-").map(Number),[n,s]=a.split("-").map(Number);if(!o||!t||!n||!s)return null;let r=o*12+t-(n*12+s)+1;return r>=1?r:null}function Ms(e){let[a,o]=e.split("-").map(Number);return o===12?`${a+1}-01`:`${a}-${String(o+1).padStart(2,"0")}`}function tt(e,a,o){let t=new Set;for(let r of e){let i=ce(r.periodo,a.filter(c=>c.cuentaDeCobroId===r.id));i&&/^\d{4}-(0[1-9]|1[0-2])$/.test(i)&&t.add(i)}if(t.size===0)return[];let n=[],s=[...t].sort()[0];for(let r=0;s<o&&r<240;r++,s=Ms(s))t.has(s)||n.push(s);return n}function Qa(e,a,o){return Math.max(e,ta(a,o)??1)}function Ya(e){let a=0,o=0,t=0,n=0,s=0,r=0;for(let i of e)i.real&&(n+=1,a+=i.real.entro,o+=i.real.aObligaciones+i.real.aMetas+i.real.enGastos,t+=i.real.alAhorro),i.estado==="futuro"&&i.simulado&&(r+=1,s+=i.esperado?.monto??i.simulado.entro);return{mesesConDatos:n,entroDeVerdad:a,gastadoDeVerdad:o,guardadoDeVerdad:t,faltaPorEntrar:s,mesesQueFaltan:r}}var Es=new Map(Ga.map((e,a)=>[e,String(a+1).padStart(2,"0")]));function ce(e,a){let o=e.toLowerCase().trim(),t=o.match(/^(\d{4})-(\d{2})/);if(t)return`${t[1]}-${t[2]}`;let n=o.match(/([a-záéíóú]+)\D+(\d{4})/);if(n){let r=Es.get(n[1]);if(r)return`${n[2]}-${r}`}let s=a.slice().sort((r,i)=>r.fecha.localeCompare(i.fecha))[0];return s?Xo(s.fecha):null}function nt(e,a,o,t){let n=new Map;for(let s of e){let r=a.filter(c=>c.cuentaDeCobroId!==void 0),i=ce(s.periodo,r);i&&n.set(i,D(s.montoEsperado))}return new Map(t.map(s=>{let r=n.get(s);return[s,r!==void 0?{monto:r,segun:"cuenta_de_cobro"}:{monto:D(o),segun:"escenario"}]}))}function st(e,a){let o=s=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=new Map(a.map(s=>[o(s.nombre),s])),n=[];for(let s of ie(e.gastos)){let r=t.get(o(s.nombre));r&&n.push({gasto:s,metaId:r.id,metaNombre:r.nombre})}return n}function V(e,a){let o=new Map;for(let t of a)for(let n of t.abonos)n.refId&&o.set(n.refId,(o.get(n.refId)??0)+D(n.monto));return new Map(e.map(t=>{let n=D(t.valor),s=D(t.abonado??0),r=o.get(t.id)??0,i=(t.reservaRetiros??[]).reduce((d,u)=>d+D(u.monto),0),c=Math.max(0,Math.min(s+r-i,n));return[t.id,{previo:s,real:r,total:c,falta:Math.max(0,n-c)}]}))}function Ja(e,a){let o=V(e,a);return e.map(t=>({...t,abonado:o.get(t.id).total}))}function rt(e,a){let o=0;for(let t of V(e,a).values())o+=t.total;return o}var ys=600;function le(e){let a=oa(e.metas),o=e.maxPagos??ys,t=[],n=new Map,s=new Map,r=new Map,i=new Map,c=0,u=Math.max(1,Math.round(e.desdePago??1))-1;for(;t.length<o&&[...a.values()].some(m=>m>0);){u+=1;let m=Re(u,D(Z(e.ingresoEsperado,e.cambiosIngreso,u)),e.obligaciones,e.colchon,e.metas,a,c);c=m.saldoAhorro,t.push(m);for(let v of m.abonos)n.has(v.metaId)||n.set(v.metaId,u),r.set(v.metaId,(r.get(v.metaId)??0)+1),i.set(v.metaId,(i.get(v.metaId)??0)+v.monto),(a.get(v.metaId)??0)<=0&&s.set(v.metaId,u)}let p=e.metas.map(m=>{let v=Math.min(D(m.abonado??0),D(m.valor)),x=i.get(m.id)??0;return{metaId:m.id,nombre:m.nombre,grupo:m.grupo,valor:m.valor,pagoInicio:n.get(m.id)??null,pagoFin:s.get(m.id)??null,cantidadPagos:r.get(m.id)??0,totalAbonado:v+x,completada:(a.get(m.id)??0)<=0,yaEstabaPagada:v>=D(m.valor)}});return{escenario:e.nombre,pagos:t,metas:p,totalPagos:u,ahorroFinal:c,incompleta:t.length>=o&&p.some(m=>!m.completada)}}function it(e){let a=new Map;for(let o of e.metas){if(!o.grupo)continue;let t=a.get(o.grupo)??[];t.push(o),a.set(o.grupo,t)}return[...a.entries()].map(([o,t])=>{let n=t.map(i=>i.pagoInicio).filter(i=>i!==null),s=t.map(i=>i.pagoFin).filter(i=>i!==null),r=t.every(i=>i.completada);return{grupo:o,valor:t.reduce((i,c)=>i+c.valor,0),pagoInicio:n.length?Math.min(...n):null,pagoFin:r&&s.length?Math.max(...s):null,totalAbonado:t.reduce((i,c)=>i+c.totalAbonado,0),completado:r,yaEstabaPagado:t.every(i=>i.yaEstabaPagada)}})}function ct(e,a){return a.filter(t=>t.antesDelPago&&t.antesDelPago>0).map(t=>{let n=e.metas.find(i=>i.metaId===t.id),s=n?.pagoFin??null,r=n?.yaEstabaPagada?0:s;return{metaId:t.id,nombre:t.nombre,queria:Math.round(t.antesDelPago),termina:r,seRetrasa:r===null?null:Math.max(0,r-Math.round(t.antesDelPago))}})}function lt(e,a){let o=D(a);if(o<=0)return null;let t=le(e),n=le({...e,ingresoEsperado:D(e.ingresoEsperado)+o,maxPagos:1}),s=new Map(n.metas.map(c=>[c.metaId,c.totalAbonado])),i=1+le({...e,metas:e.metas.map(c=>({...c,abonado:Math.max(D(c.abonado??0),s.get(c.id)??0)}))}).totalPagos;return{pendiente:o,pagosAhora:t.totalPagos,pagosSiPagan:i,seAdelanta:Math.max(0,t.totalPagos-i)}}function Xa(e,a,o){return new Date(e,a-1,o)}function na(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function xs(e){let a=e.getDay();return a===1?e:na(e,(8-a)%7)}function Ss(e){let a=e%19,o=Math.floor(e/100),t=e%100,n=Math.floor(o/4),s=o%4,r=Math.floor((o+8)/25),i=Math.floor((o-r+1)/3),c=(19*a+o-n-i+15)%30,d=Math.floor(t/4),u=t%4,p=(32+2*s+2*d-c-u)%7,m=Math.floor((a+11*c+22*p)/451),v=Math.floor((c+p-7*m+114)/31),x=(c+p-7*m+114)%31+1;return Xa(e,v,x)}function Rs(e){let a=Ss(e),o=s=>na(a,s),t=[[1,1,"A\xF1o Nuevo"],[5,1,"D\xEDa del Trabajo"],[7,20,"Independencia de Colombia"],[8,7,"Batalla de Boyac\xE1"],[12,8,"Inmaculada Concepci\xF3n"],[12,25,"Navidad"]],n=[[1,6,"Reyes Magos"],[3,19,"San Jos\xE9"],[6,29,"San Pedro y San Pablo"],[8,15,"Asunci\xF3n de la Virgen"],[10,12,"D\xEDa de la Raza"],[11,1,"Todos los Santos"],[11,11,"Independencia de Cartagena"]];return[...t.map(([s,r,i])=>({fecha:Xa(e,s,r),nombre:i})),...n.map(([s,r,i])=>({fecha:xs(Xa(e,s,r)),nombre:i})),{fecha:o(-3),nombre:"Jueves Santo"},{fecha:o(-2),nombre:"Viernes Santo"},{fecha:o(43),nombre:"Ascensi\xF3n del Se\xF1or"},{fecha:o(64),nombre:"Corpus Christi"},{fecha:o(71),nombre:"Sagrado Coraz\xF3n de Jes\xFAs"}].sort((s,r)=>s.fecha.getTime()-r.fecha.getTime())}var Oe=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;function Wa(e){return Rs(e.getFullYear()).find(a=>Oe(a.fecha)===Oe(e))?.nombre??null}function Cs(e){return Wa(e)!==null}function Ka(e){return e.getDay()===0}function dt(e){let a=new Date(e.getTime());for(let o=0;o<15&&(Ka(a)||Cs(a));o++)a=na(a,-1);return a}var ut=30,pt="Febrero no tiene 30: se radica el \xFAltimo d\xEDa del mes (28, o 29 si es bisiesto), y si ese d\xEDa cae domingo o festivo se retrocede igual que siempre.";function Za(e,a){let o=new Date(e,a,0).getDate(),t=o<ut,n=new Date(e,a-1,Math.min(ut,o)),s=dt(n),r=null;if(Oe(s)!==Oe(n)){let i=Wa(n);r=i?`el ${n.getDate()} es festivo (${i})`:Ka(n)?`el ${n.getDate()} cae domingo`:`el ${n.getDate()} no es d\xEDa h\xE1bil`}return{fecha:s,fechaOriginal:n,motivoDelCambio:r,usoUltimoDiaDelMes:t}}var eo=[{id:"cuenta",nombre:"Cuenta de cobro diligenciada",frecuencia:"cada_mes",detalle:"Con una descripci\xF3n del servicio prestado."},{id:"informe",nombre:"Informe de actividades",frecuencia:"cada_mes",detalle:"Detallando espec\xEDficamente las funciones o actividades realizadas."},{id:"conformidad",nombre:"Certificado de conformidad del servicio",frecuencia:"cada_mes",detalle:"Lo entrega el coordinador o l\xEDder del \xE1rea: hay que ped\xEDrselo con tiempo."},{id:"seguridad_social",nombre:"Planilla de seguridad social",frecuencia:"cada_mes",obligatorioExplicito:!0,detalle:"Liquidada del mes VENCIDO al que se est\xE1 cobrando. La circular la marca como obligatoria."},{id:"constancia",nombre:"Constancia de prestaci\xF3n de servicio firmada por el paciente",frecuencia:"solo_asistencial",detalle:"Solo personal asistencial. Como t\xE9cnico de sistemas, no aplica."},{id:"rut",nombre:"RUT actualizado",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez."},{id:"bancaria",nombre:"Certificaci\xF3n bancaria",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez, o si cambia de cuenta."}];function de(){return eo.filter(e=>e.frecuencia==="cada_mes")}var As=5;function Ps(e,a){let o=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),t=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return Math.round((t-o)/864e5)}var mt=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function ao(e,a=[]){let o=Za(e.getFullYear(),e.getMonth()+1),t=Ps(e,o.fecha),n=t<0?"vencido":t===0?"hoy":t<=As?"pronto":"tranquilo",s=o.fecha.getDate(),r=mt[o.fecha.getMonth()],i=n==="vencido"?`Se pas\xF3 la fecha: hab\xEDa que radicar el ${s} de ${r}`:n==="hoy"?"HOY es el \xFAltimo d\xEDa para radicar la cuenta de cobro":n==="pronto"?`Faltan ${t} d\xEDas: radicas el ${s} de ${r}`:`La cuenta de cobro se radica el ${s} de ${r}`,c=de().filter(d=>!a.includes(d.id)).map(d=>d.id);return{limite:o,diasQueFaltan:t,urgencia:n,titular:i,soportesPendientes:c}}function gt(e){let a=e.fecha.getDate(),o=mt[e.fecha.getMonth()];return e.motivoDelCambio?`Se radica el ${a} de ${o}, no el ${e.fechaOriginal.getDate()}, porque ${e.motivoDelCambio}.`:`Se radica el ${a} de ${o}.`}function Fe(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function Ls(){return new Date().toISOString().slice(0,10)}function Ts(){return[]}function ue(){return{version:1,escenario:{nombre:"Mi escenario",ingresoEsperado:2e6,colchonBase:1e5,colchonMinimo:0,colchonElastico:!1,fechaPrimerPago:Ls(),diasOptimista:30,diasPesimista:60},obligaciones:Ts(),metas:[],cuentas:[],ingresos:[],repartos:[],soportesMarcados:{}}}function X(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}var ft="gestiondinerotrabajo.estado";function bt(e){let a=ue();if(typeof e!="object"||e===null)return a;let o=e;return{version:1,escenario:{...a.escenario,...o.escenario??{}},obligaciones:o.obligaciones??a.obligaciones,metas:o.metas??a.metas,cuentas:o.cuentas??a.cuentas,ingresos:o.ingresos??a.ingresos,repartos:o.repartos??a.repartos,soportesMarcados:o.soportesMarcados??a.soportesMarcados,notasDelMes:o.notasDelMes??{}}}function vt(){let e=null;try{e=localStorage.getItem(ft)}catch{return{estado:ue(),aviso:{texto:"No pude leer los datos guardados. Est\xE1s viendo un inicio en blanco.",grave:!0}}}if(!e)return{estado:ue(),aviso:null};try{return{estado:bt(JSON.parse(e)),aviso:null}}catch{return{estado:ue(),aviso:{texto:"Los datos guardados est\xE1n da\xF1ados. No los borr\xE9: sigue ah\xED el archivo por si se puede recuperar.",grave:!0}}}}function ee(e){try{return localStorage.setItem(ft,JSON.stringify(e)),null}catch(a){return a instanceof Error?a.message:"no se pudo guardar"}}function oo(e){return JSON.stringify(e,null,2)}function to(e){try{return{estado:bt(JSON.parse(e)),aviso:null}}catch{return{estado:null,aviso:{texto:"Ese archivo no es un respaldo v\xE1lido. No cambi\xE9 nada de lo que ten\xEDas.",grave:!0}}}}var Ae=null;function O(e){return Ae?.(),new Promise(a=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${Q(e.titulo)}</h3>
        ${e.detalle?`<p class="dlg-detalle">${Q(e.detalle)}</p>`:""}
        ${e.largo?`<textarea class="dlg-campo" rows="6">${Q(e.valorInicial??"")}</textarea>`:e.fecha?`<input class="dlg-campo" type="date" ${e.fecha.max?`max="${Q(e.fecha.max)}"`:""}
               value="${Q(e.valorInicial??"")}" />`:`<input class="dlg-campo" type="text" ${e.dinero?'inputmode="numeric" data-dinero':""}
               value="${Q(e.valorInicial??"")}" />`}
        <div class="dlg-botones">
          <button class="dlg-cancelar">Cancelar</button>
          <button class="primario dlg-aceptar">${Q(e.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=o.querySelector(".dlg-campo"),n=i=>{document.removeEventListener("keydown",r,!0),o.remove(),Ae=null,a(i)},s=()=>n(t.value);function r(i){i.key==="Escape"&&(i.preventDefault(),n(null));let c=e.largo?i.ctrlKey:!0;i.key==="Enter"&&c&&document.activeElement===t&&(i.preventDefault(),s())}o.querySelector(".dlg-aceptar").addEventListener("click",s),o.querySelector(".dlg-cancelar").addEventListener("click",()=>n(null)),o.addEventListener("mousedown",i=>{i.target===o&&n(null)}),document.addEventListener("keydown",r,!0),document.body.appendChild(o),Ae=()=>n(null),t.focus(),e.fecha||t.select()})}function $t(e){return Ae?.(),new Promise(a=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${Q(e.titulo)}</h3>
        ${e.detalle?`<p class="dlg-detalle">${Q(e.detalle)}</p>`:""}
        <div class="dlg-botones">
          <button class="dlg-cancelar">${Q(e.textoCancelar??"Cancelar")}</button>
          <button class="primario dlg-aceptar">${Q(e.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=s=>{document.removeEventListener("keydown",n,!0),o.remove(),Ae=null,a(s)};function n(s){s.key==="Escape"&&(s.preventDefault(),t(!1))}o.querySelector(".dlg-aceptar").addEventListener("click",()=>t(!0)),o.querySelector(".dlg-cancelar").addEventListener("click",()=>t(!1)),o.addEventListener("mousedown",s=>{s.target===o&&t(!1)}),document.addEventListener("keydown",n,!0),document.body.appendChild(o),Ae=()=>t(!1),o.querySelector(".dlg-cancelar").focus()})}function Q(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var ht=new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});function no(e){return e.replace(/\D/g,"")}function qs(e){let a=no(e);if(a==="")return"";let o=a.replace(/^0+(?=\d)/,"");return ht.format(Number(o))}function F(e){let a=no(e);return a===""?0:Number(a)}function so(e){return String(Math.round(e*1e4)/100)}function T(e){return ht.format(Math.round(e))}function Dt(e){let a=e.value,o=e.selectionStart??a.length,t=no(a.slice(0,o)).length,n=qs(a);if(n===a)return;e.value=n;let s=0,r=0;for(;r<n.length&&s<t;)/\d/.test(n[r])&&s++,r++;e.setSelectionRange(r,r)}function ro(e){let a=e?.trim();if(!a)return null;try{let o=new URL(/^[a-z][a-z0-9+.-]*:/i.test(a)?a:`https://${a}`);return o.protocol==="http:"||o.protocol==="https:"?o.href:null}catch{return null}}function Mt(e,a,o=[]){let t=[],n=0;return a.forEach((s,r)=>{let i=Math.max(1,Math.round(s)||1),c=e[n],d=o[r];t.push(d!==void 0?d.trim()||null:i>1||!c?null:c),n+=i}),t}var ws=4;function Et(e){return e.length>=ws}var J="__borrado";function Ne(e,a){return e[a]??""}function W(e){if(e==null)return"null";if(Array.isArray(e))return`[${e.map(W).join(",")}]`;if(typeof e=="object"){let a=e;return`{${Object.keys(a).filter(t=>a[t]!==void 0).sort().map(t=>`${JSON.stringify(t)}:${W(a[t])}`).join(",")}}`}return JSON.stringify(e)}function sa(e,a){return W(e)===W(a)}function yt(e,a,o,t){return e!==o?e>o:W(a)>=W(t)}function xt(e,a,o,t={}){let n={...t},s=new Set([...Object.keys(e??{}),...Object.keys(a)]);for(let r of s){if(r==="id")continue;let i=e===null?void 0:e[r],c=a[r];sa(i,c)||(n[r]=o)}return n}function js(e,a){if(e.datos.id!==a.datos.id)throw new Error(`No se pueden fusionar dos filas distintas: ${e.datos.id} y ${a.datos.id}.`);let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t={id:e.datos.id},n={},s=[];for(let p of o){if(p==="id")continue;let m=e.datos[p],v=a.datos[p],x=Ne(e.tocado,p),S=Ne(a.tocado,p),h=yt(x,m,S,v),$=h?m:v,R=h?v:m;$!==void 0&&(t[p]=$);let C=x>S?x:S;C!==""&&(n[p]=C),sa(m,v)||s.push({id:e.datos.id,campo:p,valor:R,cuando:h?S:x,gano:$})}let r=Ne(e.tocado,J),i=Ne(a.tocado,J),c=yt(r,e.borradoEn,i,a.borradoEn),d=c?e.borradoEn:a.borradoEn,u=r>i?r:i;return u!==""&&(n[J]=u),sa(e.borradoEn,a.borradoEn)||s.push({id:e.datos.id,campo:J,valor:c?a.borradoEn:e.borradoEn,cuando:c?i:r,gano:d}),{fila:{datos:t,tocado:n,borradoEn:d??null},descartes:s}}function Os(e,a){let o=e.datos.propuesto,t=a.datos.propuesto;return o===!1&&t===!0?e:t===!1&&o===!0?a:null}function Fs(e,a){let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t=[];for(let n of o){if(n==="id")continue;let s=e.datos[n],r=a.datos[n];JSON.stringify(s)!==JSON.stringify(r)&&t.push({id:e.datos.id,campo:n,valor:r,cuando:Ne(a.tocado,n),gano:s})}return t}function St(e,a){let o=new Map(a.map(s=>[s.datos.id,s])),t=[],n=[];for(let s of e){let r=o.get(s.datos.id);if(!r){t.push(s);continue}let i=Os(s,r);if(i){t.push(i),n.push(...Fs(i,i===s?r:s)),o.delete(s.datos.id);continue}let c=js(s,r);t.push(c.fila),n.push(...c.descartes),o.delete(s.datos.id)}for(let s of a)o.has(s.datos.id)&&t.push(s);return{filas:t,descartes:n}}function Rt(e,a){return a?e.filter(o=>{let t=a.get(o.id);if(!t)return!0;let n=o.campo===J?t.borradoEn:t.datos[o.campo];return!sa(o.valor,n)}):e}var ae=["escenario","obligaciones","metas","cuentas","ingresos","repartos","soportes"],Ns="escenario";function pe(e,a){return{datos:{...a,id:e},tocado:{},borradoEn:null}}var _s=["ordenMetas","ordenObligaciones"];function Ct(e,a){if(!Array.isArray(a))return e;let o=new Map(a.map((n,s)=>[String(n),s]));return[...e.filter(n=>o.has(n.id)).sort((n,s)=>o.get(n.id)-o.get(s.id)),...e.filter(n=>!o.has(n.id))]}function Pe(e){return{escenario:[pe(Ns,{...e.escenario,ordenMetas:e.metas.map(a=>a.id),ordenObligaciones:e.obligaciones.map(a=>a.id)})],obligaciones:e.obligaciones.map(a=>pe(a.id,{...a})),metas:e.metas.map(a=>pe(a.id,{...a})),cuentas:e.cuentas.map(a=>pe(a.id,{...a})),ingresos:e.ingresos.map(a=>pe(a.id,{...a})),repartos:e.repartos.map(a=>pe(a.id,{...a})),soportes:ks(e)}}function ks(e){let a=e.notasDelMes??{};return[...new Set([...Object.keys(e.soportesMarcados),...Object.keys(a).filter(t=>a[t].trim()!=="")])].sort().map(t=>pe(t,{...t in e.soportesMarcados?{marcados:e.soportesMarcados[t]}:{},...a[t]?.trim()?{nota:a[t]}:{}}))}function ra(e,a){let o=c=>(e[c]??[]).filter(d=>d.borradoEn===null),t=c=>e[c]!==void 0&&e[c].length>0,n=t("escenario")?{...a.escenario,...o("escenario")[0]?.datos}:a.escenario;n&&"id"in n&&delete n.id;let s=(t("escenario")?o("escenario")[0]?.datos:void 0)??{};for(let c of _s)delete n[c];let r={},i={};for(let c of o("soportes")){let{marcados:d,nota:u}=c.datos;Array.isArray(d)&&(r[c.datos.id]=d),typeof u=="string"&&u.trim()!==""&&(i[c.datos.id]=u)}return{version:a.version,escenario:n,obligaciones:Ct(t("obligaciones")?o("obligaciones").map(c=>c.datos):a.obligaciones,s.ordenObligaciones),metas:Ct(t("metas")?o("metas").map(c=>c.datos):a.metas,s.ordenMetas),cuentas:t("cuentas")?o("cuentas").map(c=>c.datos):a.cuentas,ingresos:t("ingresos")?o("ingresos").map(c=>c.datos):a.ingresos,repartos:t("repartos")?o("repartos").map(c=>c.datos):a.repartos,soportesMarcados:t("soportes")?r:a.soportesMarcados,notasDelMes:t("soportes")?i:a.notasDelMes??{}}}function At(e){return{id:e.datos.id,datos:e.datos,tocado:e.tocado,borrado_en:e.borradoEn}}function Pt(e){let a=e.datos??{};return{datos:{...a,id:String(e.id??a.id??"")},tocado:e.tocado??{},borradoEn:e.borrado_en??null}}function Lt(e,a,o,t={}){let n=Pe(e),s=a?Pe(a):null,r={};for(let i of ae){let c=new Map((s?.[i]??[]).map(m=>[m.datos.id,m])),d=t[i]??new Map,u=n[i].map(m=>({...m,tocado:xt(c.get(m.datos.id)?.datos??null,m.datos,o,d.get(m.datos.id)??{})})),p=new Set(n[i].map(m=>m.datos.id));for(let[m,v]of c)p.has(m)||u.push({datos:v.datos,tocado:{...d.get(m)??{},[J]:o},borradoEn:o});r[i]=u}return r}var me={url:"https://voncmkjcxzgxfloehovb.supabase.co",clave:"sb_publishable_Ev68VoFXNXqvcVOjgXoknw_vAFK-iHn"},io="gestiondinerotrabajo.sesion",ca="gestiondinerotrabajo.ultimaSincronizacion",ia="gestiondinerotrabajo.nube.sincronizado";function la(){try{let e=localStorage.getItem(io);return e?JSON.parse(e):null}catch{return null}}function co(e){try{e?localStorage.setItem(io,JSON.stringify(e)):localStorage.removeItem(io)}catch{}}function lo(){co(null);try{localStorage.removeItem(ca),localStorage.removeItem(ia)}catch{}}function Tt(){try{let e=localStorage.getItem(ia);return e?JSON.parse(e):null}catch{return null}}function da(e){try{e?localStorage.setItem(ia,JSON.stringify(e)):localStorage.removeItem(ia)}catch{}}async function It(e,a){let o=await fetch(`${me.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:me.clave,"Content-Type":"application/json"},body:JSON.stringify({email:e.trim(),password:a})}),t=await o.json().catch(()=>({}));if(!o.ok)throw new Error(zs(o.status,t));let n={token:t.access_token,refresco:t.refresh_token,usuarioId:t.user?.id??"",correo:t.user?.email??e.trim(),caduca:Date.now()+(Number(t.expires_in)||3600)*1e3};if(!n.token||!n.usuarioId)throw new Error("Supabase respondi\xF3 sin sesi\xF3n. Revisa la direcci\xF3n del proyecto.");return co(n),n}function zs(e,a){let o=String(a.error_description??a.msg??a.message??"");return e===400&&/invalid login|credentials/i.test(o)?"Correo o contrase\xF1a incorrectos.":e===400&&/email not confirmed/i.test(o)?"Falta confirmar el correo: mira el mensaje que te mand\xF3 Supabase.":e===422?"Ese correo no tiene un formato v\xE1lido.":e===429?"Demasiados intentos seguidos. Espera un momento.":o||`No se pudo entrar (error ${e}).`}async function uo(){let e=la();if(!e)throw new Error("No has entrado con tu correo.");if(Date.now()<e.caduca-6e4)return e;let a=await fetch(`${me.url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:me.clave,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e.refresco})});if(!a.ok)throw lo(),new Error("La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.");let o=await a.json(),t={...e,token:o.access_token,refresco:o.refresh_token??e.refresco,caduca:Date.now()+(Number(o.expires_in)||3600)*1e3};return co(t),t}function qt(e){return{apikey:me.clave,Authorization:`Bearer ${e.token}`,"Content-Type":"application/json"}}async function wt(e,a,o){let t=o?`&actualizado_en=gt.${encodeURIComponent(o)}`:"",n=await fetch(`${me.url}/rest/v1/${a}?select=*${t}`,{headers:qt(e)});if(!n.ok)throw new Error(await Ot(n,a,"bajar"));return(await n.json()).map(Pt)}async function jt(e,a,o){if(o.length===0)return;let t=o.map(s=>({...At(s),usuario_id:e.usuarioId})),n=await fetch(`${me.url}/rest/v1/${a}?on_conflict=usuario_id,id`,{method:"POST",headers:{...qt(e),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(t)});if(!n.ok)throw new Error(await Ot(n,a,"subir"))}async function Ot(e,a,o){let t=await e.text().catch(()=>"");return e.status===401?"La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.":e.status===404||/does not exist/i.test(t)?`Falta la tabla \xAB${a}\xBB en Supabase: ejecuta supabase/esquema.sql.`:e.status===403||/permission denied/i.test(t)?`Sin permiso sobre \xAB${a}\xBB. Revisa los grants del esquema.`:`No se pudo ${o} \xAB${a}\xBB (error ${e.status}).`}async function Ft(e,a,o){let t=await uo(),n=ua(),s=Lt(e,a,o),r=a?Pe(a):null,i={},c=[];for(let u of ae){let p=s[u],m=await wt(t,u,n),v=St(p,m);i[u]=v.filas;let x=r?new Map(r[u].map($=>[$.datos.id,{datos:$.datos,borradoEn:$.borradoEn}])):null,S=new Map(v.filas.map($=>[$.datos.id,$.datos]));c.push(...Rt(v.descartes,x).map($=>{let R=S.get($.id),C=typeof R?.nombre=="string"?R.nombre:typeof R?.periodo=="string"?R.periodo:void 0;return{...$,tabla:u,nombre:C}}));let h=new Set(p.filter($=>Object.keys($.tocado).length>0).map($=>$.datos.id));for(let $ of v.descartes)h.add($.id);await jt(t,u,v.filas.filter($=>h.has($.datos.id)))}let d=new Date().toISOString();try{localStorage.setItem(ca,d)}catch{}return{estado:ra(i,e),descartes:c,cuando:d}}async function Nt(){let e=await uo(),a={};for(let o of ae)a[o]=await wt(e,o,null);return a}async function _t(e){let a=await uo();for(let t of ae)await jt(a,t,e[t]??[]);let o=new Date().toISOString();try{localStorage.setItem(ca,o)}catch{}return o}function ua(){try{return localStorage.getItem(ca)}catch{return null}}function kt(e,a){let o=[];for(let t of ae){let n=new Map((e[t]??[]).map(i=>[i.datos.id,i])),s=new Map((a[t]??[]).map(i=>[i.datos.id,i])),r=[...n.keys(),...[...s.keys()].filter(i=>!n.has(i))];for(let i of r){let c=n.get(i),d=s.get(i),u={tabla:t,id:i};if(c&&!d){o.push({...u,clave:`${t}|${i}|fila`,tipo:"solo-aqui",aqui:c.datos,nube:void 0,datos:c.datos});continue}if(!c&&d){if(d.borradoEn)continue;o.push({...u,clave:`${t}|${i}|fila`,tipo:"solo-nube",aqui:void 0,nube:d.datos,datos:d.datos});continue}if(!c||!d)continue;if(d.borradoEn){o.push({...u,clave:`${t}|${i}|fila`,tipo:"borrada-en-la-nube",aqui:c.datos,nube:null,datos:c.datos});continue}let p=c.datos.propuesto===!1&&d.datos.propuesto===!0?"aqui":d.datos.propuesto===!1&&c.datos.propuesto===!0?"nube":void 0,m=new Set([...Object.keys(c.datos),...Object.keys(d.datos)]);for(let v of m){if(v==="id")continue;let x=c.datos[v],S=d.datos[v];W(x)!==W(S)&&o.push({...u,clave:`${t}|${i}|${v}`,tipo:"campo",campo:v,aqui:x,nube:S,datos:c.datos,confirmadoEn:p})}}}return o}function po(e,a){let o={};for(let t of e)o[t.clave]=t.tipo==="solo-aqui"?"aqui":t.tipo==="solo-nube"?"nube":t.tipo==="borrada-en-la-nube"?"aqui":t.confirmadoEn??(a==="subir"?"aqui":"nube");return o}function zt(e,a,o,t,n){let s=u=>t[u.clave]??po([u],"subir")[u.clave],r=new Map;for(let u of o){let p=`${u.tabla}|${u.id}`;r.set(p,[...r.get(p)??[],u])}let i=u=>({datos:u.datos,tocado:{...u.tocado,[J]:n},borradoEn:n}),c={};for(let u of ae){let p=new Map((e[u]??[]).map(S=>[S.datos.id,S])),m=new Map((a[u]??[]).map(S=>[S.datos.id,S])),v=[...p.keys(),...[...m.keys()].filter(S=>!p.has(S))],x=[];for(let S of v){let h=p.get(S),$=m.get(S),R=r.get(`${u}|${S}`)??[],C=R.find(k=>k.tipo!=="campo");if(h&&!$)x.push(C&&s(C)==="nube"?i(h):h);else if(!h&&$)$.borradoEn?x.push($):x.push(C&&s(C)==="aqui"?i($):$);else if(h&&$&&$.borradoEn)x.push(C&&s(C)==="nube"?$:{datos:h.datos,tocado:{...$.tocado,...h.tocado,[J]:n},borradoEn:null});else if(h&&$){let k={...h.datos},N={...$.tocado,...h.tocado};for(let w of R)w.tipo!=="campo"||!w.campo||(s(w)==="nube"&&($.datos[w.campo]===void 0?delete k[w.campo]:k[w.campo]=$.datos[w.campo]),N[w.campo]=n);x.push({datos:k,tocado:N,borradoEn:null})}}c[u]=x}let d=c.escenario[0];if(d){let u={...d.datos};for(let[p,m]of[["ordenMetas","metas"],["ordenObligaciones","obligaciones"]]){let v=c[m].filter(S=>!S.borradoEn).map(S=>S.datos.id),x=Array.isArray(u[p])?u[p]:[];u[p]=[...x.filter(S=>v.includes(S)),...v.filter(S=>!x.includes(S))]}c.escenario[0]={...d,datos:u}}return c}var ma="__borrado",pa=new Intl.NumberFormat("es-CO"),Hs={obligaciones:"obligaciones",abonos:"abonos a metas",gastos:"gastos",cambios:"cambios de valor",valor:"valor",nombre:"nombre",grupo:"grupo",abonado:"ya pagado antes",alAhorro:"al ahorro",monto:"monto",fecha:"fecha",ingresoEsperado:"ingreso esperado",fechaPrimerPago:"fecha del primer pago",marcados:"soportes marcados",clase:"compra o deuda",puedeEsperar:"puede esperar",fechaFija:"fecha fija (\u{1F4CC})",reservaMeses:"meses de la reserva",reservaExtras:"cosas extra de la reserva",reservaRetiros:"lo que usaste de la reserva",precioRevisado:"fecha en que revisaste el precio",enDolares:"marcada en d\xF3lares (US$)",precioUSD:"precio en d\xF3lares (US$)",tasaDolar:"tasa del d\xF3lar",tasaDolarDe:"fecha de la tasa del d\xF3lar",fechaRadicacion:"fecha de radicaci\xF3n",noHubo:"ese mes no hubo cuenta",ordenMetas:"orden (prioridad) de las metas",ordenObligaciones:"orden de las obligaciones",desdePago:"empieza en",maximoPorPago:"m\xE1ximo por pago",enCuotas:"reunirla en",antesDelPago:"la quiero antes de",colchonBase:"otros / ahorro por pago",colchonMinimo:"del ahorro no bajar de",colchonElastico:"usar el ahorro para adelantar metas",sobranteAMetas:"usar lo que sobra del mes en las metas siguientes",cambiosColchon:"cambios del ahorro",cambiosIngreso:"cambios del pago",diasOptimista:"d\xEDas entre pagos, si son puntuales",diasPesimista:"d\xEDas entre pagos, si se atrasan",tipo:"c\xF3mo se calcula",modo:"cada cu\xE1ndo",montoEsperado:"monto esperado",periodo:"periodo",propuesto:"sin confirmar",compra:"ya la compraste",nota:"nota",link:"enlace",cuentaDeCobroId:"cuenta de cobro",ingresoId:"pago",supuesto:"supuesto",baseCobro:"sobre qu\xE9 se cobra",maxPagos:"m\xE1ximo de pagos a proyectar",deLoQueSobro:"con lo que sobr\xF3 del mes",movidoDesdeGasto:"pasado desde un gasto"},Ht=new Intl.NumberFormat("es-CO",{maximumFractionDigits:2});function Vt(e,a){return a?a(e):`el pago ${e}`}function ga(e,a){switch(e.tabla){case"metas":{let o=a.metas.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la meta \xAB${o}\xBB`:"una meta que ya no est\xE1"}case"obligaciones":{let o=a.obligaciones.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la obligaci\xF3n \xAB${o}\xBB`:"una obligaci\xF3n que ya no est\xE1"}case"cuentas":{let o=a.cuentas.find(t=>t.id===e.id);return o?`la cuenta de cobro de ${o.periodo}`:"una cuenta de cobro que ya no est\xE1"}case"ingresos":{let o=a.ingresos.find(t=>t.id===e.id);return o?`el pago del ${o.fecha} (${pa.format(o.monto)})`:"un pago que ya no est\xE1"}case"repartos":{let o=a.repartos.find(n=>n.id===e.id),t=o?a.ingresos.find(n=>n.id===o.ingresoId):void 0;return t?`el reparto del pago del ${t.fecha} (${pa.format(t.monto)})`:"un reparto de un pago que ya no est\xE1"}case"escenario":return"el escenario";case"soportes":return`el mes ${j(e.id)}`}}function _e(e){return e===ma?"borrado":Hs[e]??e}function Le(e,a,o){if(e===ma)return a?"borrada":"sin borrar";if(typeof a=="number"){if(e==="desdePago"||e==="antesDelPago")return Vt(a,o);if(e==="enCuotas")return`${a} ${a===1?"mes":"meses"}`;if(e==="precioUSD")return`US$ ${Ht.format(a)}`;if(e==="tasaDolar")return`${Ht.format(a)} pesos por d\xF3lar`}return mo(a,o)}function mo(e,a){if(e==null||e==="")return"\u2014";if(typeof e=="number")return pa.format(e);if(typeof e=="boolean")return e?"s\xED":"no";if(typeof e=="string")return e;if(Array.isArray(e))return e.length===0?"nada":e.map(o=>mo(o,a)).join(" \xB7 ");if(typeof e=="object"){let o=e;if(typeof o.nombre=="string"&&typeof o.monto=="number")return`${o.nombre} ${pa.format(o.monto)}`;if(typeof o.desdePago=="number"&&"valor"in o)return`desde ${Vt(o.desdePago,a)}: ${mo(o.valor)}`;let t=Object.keys(o).sort().filter(n=>o[n]!==void 0).map(n=>`${_e(n)}: ${Le(n,o[n],a)}`);return t.length?t.join(", "):"\u2014"}return String(e)}var ke=[{id:"inicio",rotulo:"Inicio",icono:"\u{1F3E0}",paneles:["inicio","radicacion"]},{id:"calendario",rotulo:"Calendario",icono:"\u{1F5D3}\uFE0F",paneles:["vista"]},{id:"metas",rotulo:"Metas",icono:"\u{1F3AF}",paneles:["metas","proyeccion"]},{id:"registrar",rotulo:"Registrar",icono:"\u{1F4B5}",paneles:["cuentas","real"]},{id:"ajustes",rotulo:"Ajustes",icono:"\u2699\uFE0F",paneles:["escenario","obligaciones","nube","respaldo","calendario","dolar","tema"]}],Vs="inicio";function Ut(e){return ke.find(a=>a.paneles.includes(e))?.id??null}function fa(e){return ke.some(a=>a.id===e)?e:Vs}function go(e,a){let o=[],t="",n=0;for(let s=1;s<=e;s++){let r=a(s),i=B(r);n=i===t?n+1:1,t=i;let c=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`,d=n===1?"":`${n}.\xBA pago`,u=`${H(c)} ${r.getFullYear()}`;o.push({numero:s,rotulo:d?`${i} (${d})`:i,mes:H(c),anio:String(r.getFullYear()),vez:d,corto:d?`${u} (${d})`:u})}return o}function Gt(e,...a){return Math.max(36,e+12,...a.map(o=>o??0))}var fo=null;function Bt(e){let a=e.parentElement?.querySelector("select");if(!a)return;fo?.();let o=[...a.options],t=o.filter(d=>!d.dataset.anio),n=new Map;for(let d of o){if(!d.dataset.anio)continue;let u=n.get(d.dataset.anio)??[];u.push(d),n.set(d.dataset.anio,u)}let s=(d,u,p="")=>`<button type="button" class="opcion-mes ${p} ${d.selected?"elegido":""}" data-valor="${oe(d.value)}"
       title="${oe(d.text)}">${u}</button>`,r=document.createElement("div");r.className="capa-dialogo capa-meses",r.innerHTML=`
    <div class="dialogo dialogo-meses" role="dialog" aria-modal="true" aria-label="${oe(a.dataset.titulo??"Elegir mes")}">
      <h3>${oe(a.dataset.titulo??"Elegir mes")}</h3>
      ${t.map(d=>s(d,oe(d.text),"suelta")).join("")}
      <div class="meses-cuerpo">
        ${[...n].map(([d,u])=>`
          <div class="meses-anio"><h4>${oe(d)}</h4>
            <div class="rejilla-meses">${u.map(p=>s(p,`${oe(p.dataset.mes??p.text)}${p.dataset.vez?`<small>${oe(p.dataset.vez)}</small>`:""}`)).join("")}</div>
          </div>`).join("")}
      </div>
      <div class="dlg-botones"><button type="button" class="dlg-cancelar">Cancelar</button></div>
    </div>`;let i=()=>{document.removeEventListener("keydown",c,!0),r.remove(),fo=null,e.focus()};function c(d){d.key==="Escape"&&(d.preventDefault(),i())}r.addEventListener("click",d=>{let u=d.target;if(d.stopPropagation(),u===r||u.closest(".dlg-cancelar"))return i();let p=u.closest(".opcion-mes");if(!p)return;let m=a.isConnected?a:Gs(a)??a,v=m.parentElement?.querySelector(".boton-mes")??e;m.value=p.dataset.valor??"",Us(v,m),i(),m.dispatchEvent(new Event("change",{bubbles:!0}))}),document.addEventListener("keydown",c,!0),document.body.appendChild(r),fo=i,r.querySelector(".opcion-mes.elegido")?.scrollIntoView({block:"center"}),(r.querySelector(".opcion-mes.elegido")??r.querySelector(".opcion-mes"))?.focus()}function Us(e,a){let o=a.selectedOptions[0],t=e.querySelector(".mes-largo"),n=e.querySelector(".mes-corto");t&&(t.textContent=o?.text??"\u2014"),n&&(n.textContent=o?.dataset.corto??o?.text??"\u2014")}function Gs(e){let o="select"+Object.entries(e.dataset).filter(([t])=>t!=="titulo").map(([t,n])=>`[data-${t.replace(/[A-Z]/g,s=>"-"+s.toLowerCase())}="${CSS.escape(n??"")}"]`).join("");return document.querySelector(o)}function oe(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function bo(e,a){let o=()=>({valor:0,pagado:0,cuantas:0}),t={deudas:o(),compras:o()};for(let n of e){if(n.clase==="reserva")continue;let s=n.clase==="deuda"?t.deudas:t.compras;s.valor+=n.valor,s.pagado+=Math.min(n.valor,a.get(n.id)??0),s.cuantas++}return t}function ba(e,a){let o=new Map(a.map(t=>[t.metaId,t.pagoFin]));return e.filter(t=>!t.yaEstabaPagada).map(t=>({metaId:t.metaId,nombre:t.nombre,antes:t.pagoFin,despues:o.get(t.metaId)??null}))}function Qt(e){return e.antes===null||e.despues===null?null:e.despues-e.antes}function Yt(e,a,o){let t=[...e];if(a<0||a>=t.length)return t;let[n]=t.splice(a,1);return t.splice(Math.max(0,Math.min(o,t.length)),0,n),t}function Bs(e,a){return(a.getFullYear()-e.getFullYear())*12+(a.getMonth()-e.getMonth())}function Jt(e,a,o){return ba(e.metas,a.metas).filter(t=>t.antes!==t.despues).map(t=>({...t,meses:t.antes!==null&&t.despues!==null?Bs(o(t.antes),o(t.despues)):null}))}var va=(e,a,o)=>`${e} ${e===1?a:o}`;function Qs(e){return e.length<=1?e[0]??"":`${e.slice(0,-1).join(", ")} y ${e.at(-1)}`}function Xt(e,a,o){let t=a.find(m=>m.metaId===e);if(!t||t.despues===null)return null;let n;if(t.antes===null)n=`Si la subes al 1.\xBA puesto s\xED la terminas: ${o(t.despues)}`;else if(t.meses!==null&&t.meses<=-1)n=`Si la subes al 1.\xBA puesto la tienes ${o(t.despues)}, ${va(-t.meses,"mes","meses")} antes`;else return null;let s=a.filter(m=>m.metaId!==e&&(m.antes!==null&&m.despues===null||m.meses!==null&&m.meses>=1)).sort((m,v)=>(v.meses??1/0)-(m.meses??1/0));if(!s.length)return`${n}, y ninguna otra se atrasa de mes.`;let r=m=>m.meses===null?`\xAB${m.nombre}\xBB se queda sin terminar`:`\xAB${m.nombre}\xBB se atrasa ${va(m.meses,"mes","meses")}`;if(s.length<=vo+1)return`${n}; a cambio, ${Qs(s.map(r))}.`;let i=s.slice(vo),c=i.map(m=>m.meses).filter(m=>m!==null),[d,u]=[Math.min(...c),Math.max(...c)],p=c.length?d===u?`se atrasan ${va(u,"mes","meses")}`:`se atrasan de ${d} a ${va(u,"mes","meses")}`:"se quedan sin terminar";return`${n}; a cambio, ${s.slice(0,vo).map(r).join(", ")} y otras ${i.length} ${p}.`}var vo=3;var Wt=e=>Number(e.slice(0,4))*12+Number(e.slice(5,7))-1;function Kt(e,a,o,t,n,s=2){let r=new Map(o.map(d=>[d.id,d.fecha.slice(0,7)])),i=new Map;for(let d of a){let u=r.get(d.ingresoId);if(u)for(let p of d.abonos)!p.refId||p.monto<=0||(i.get(p.refId)??"")<u&&i.set(p.refId,u)}let c=[];for(let d of e){if(d.compra||(t.get(d.id)??0)>=d.valor)continue;let u=i.get(d.id);if(!u)continue;let p=Wt(n)-Wt(u);p>=s&&c.push({metaId:d.id,nombre:d.nombre,ultimoMes:u,meses:p})}return c}function $o(e,a,o,t=3){let n=new Date(`${o}T12:00:00`);n.setMonth(n.getMonth()-t);let s=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;return e.filter(r=>r.clase!=="deuda"&&r.clase!=="reserva"&&!r.compra&&r.valor>0&&(a.get(r.id)??0)<r.valor).filter(r=>!r.precioRevisado||r.precioRevisado<=s).map(r=>({metaId:r.id,nombre:r.nombre,revisado:r.precioRevisado??null,enDolares:r.enDolares===!0}))}var ho="gestiondinerotrabajo.respaldo-github",Ys="respaldo.json";function $a(){try{let e=localStorage.getItem(ho);return e?JSON.parse(e):null}catch{return null}}function ze(e){try{e?localStorage.setItem(ho,JSON.stringify(e)):localStorage.removeItem(ho)}catch{}}function en(e,a){return!!e&&!!e.repo.trim()&&!!e.token.trim()&&e.ultimo!==a}function Js(e){let a=new TextEncoder().encode(e),o="";for(let t=0;t<a.length;t+=32768)o+=String.fromCharCode(...a.subarray(t,t+32768));return btoa(o)}function Zt(e){return e===401?"la llave de GitHub no sirve o ya venci\xF3: crea otra y p\xE9gala en Ajustes":e===403?"la llave no tiene permiso para escribir en ese repositorio (Contents: Read and write)":e===404?"no encuentro el repositorio: revisa el nombre, o que la llave tenga acceso a \xE9l":e===409||e===422?"GitHub rechaz\xF3 la copia; se intenta otra vez ma\xF1ana":`GitHub respondi\xF3 ${e}`}async function an(e,a,o,t=fetch){let n=`https://api.github.com/repos/${e.repo.trim()}/contents/${Ys}`,s={Authorization:`Bearer ${e.token.trim()}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},r=await t(n,{headers:s}),i;if(r.ok)i=(await r.json()).sha;else if(r.status!==404)throw new Error(Zt(r.status));let c=await t(n,{method:"PUT",headers:{...s,"Content-Type":"application/json"},body:JSON.stringify({message:`Respaldo ${o}`,content:Js(a),...i?{sha:i}:{}})});if(!c.ok)throw new Error(Zt(c.status))}var Xs=3,Ws=45,Do=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`,on=(e,a)=>{let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o};function Mo(e,a,o,t,n=12){let s=new Set(a.filter(c=>!!c.fechaRadicacion).map(c=>ce(c.periodo,o.filter(d=>d.cuentaDeCobroId===c.id))).filter(c=>!!c)),r=de().length,i=[];for(let c=-1;c<n;c++){let d=new Date(e.getFullYear(),e.getMonth()+c,1),u=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,p=Za(d.getFullYear(),d.getMonth()+1).fecha;i.push({periodo:u,mes:d.toLocaleDateString("es-CO",{month:"long",year:"numeric"}),fechaLimite:Do(p),fechaLimiteTexto:p.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long"}),desde:Do(on(p,-Xs)),hasta:Do(on(p,Ws)),radicada:s.has(u),soportesListos:(t[u]??[]).filter(m=>de().some(v=>v.id===m)).length,soportesTotal:r})}return i}var tn=e=>e.replace(/-/g,"");function ha(e){return e.replaceAll("\\",String.raw`\\`).replaceAll(";",String.raw`\;`).replaceAll(",",String.raw`\,`).replaceAll(`
`,String.raw`\n`)}function nn(e,a){let o=`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`;e=e.filter(s=>!s.radicada&&s.fechaLimite>=o);let t=`${tn(a.toISOString().slice(0,10))}T${String(a.getUTCHours()).padStart(2,"0")}0000Z`,n=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Mi dinero//Radicar cuenta de cobro//ES","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Mi dinero \u2014 radicar"];for(let s of e){let r=tn(s.fechaLimite);n.push("BEGIN:VEVENT",`UID:radicar-${s.periodo}@mi-dinero`,`DTSTAMP:${t}`,`DTSTART:${r}T${String(13).padStart(2,"0")}0000Z`,`DTEND:${r}T${String(13).padStart(2,"0")}3000Z`,`SUMMARY:${ha(`Radicar la cuenta de cobro de ${s.mes}`)}`,`DESCRIPTION:${ha(`Se radica el ${s.fechaLimiteTexto}. Soportes: ${s.soportesTotal}. Si ya la radicaste, ponle la fecha en Mi dinero.`)}`,"BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:-P3D",`DESCRIPTION:${ha(`Faltan 3 d\xEDas para radicar la cuenta de cobro de ${s.mes}`)}`,"END:VALARM","BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:PT0M",`DESCRIPTION:${ha(`Hoy se radica la cuenta de cobro de ${s.mes}`)}`,"END:VALARM","END:VEVENT")}return n.push("END:VCALENDAR"),n.join(`\r
`)+`\r
`}var Ks=["marino","negro"],sn="gestiondinerotrabajo.tema";function He(e){return Ks.includes(e)?e:"marino"}function Eo(){try{return He(localStorage.getItem(sn))}catch{return"marino"}}function rn(e){try{localStorage.setItem(sn,He(e))}catch{}}function yo(e){let a=document.documentElement;a&&(a.dataset.tema=He(e))}function Ve(e,a){return!(e>0)||!(a>0)?0:ye(e*a)}function cn(e,a){if(!(e>0)||!(a>0))return 0;let o=Math.floor(e/a*100)/100;return Ve(o,a)>=ye(e)?o:Math.ceil(e/a*100)/100}function xo(e){let a=String(e).replace(/[^\d.,]/g,"");if(!a)return 0;let o=Math.max(a.lastIndexOf(","),a.lastIndexOf(".")),t=o>=0?a.length-o-1:0,n=(o>=0&&t>=1&&t<=2?a.slice(0,o):a).replace(/[.,]/g,""),s=o>=0&&t>=1&&t<=2?a.slice(o+1):"",r=+`${n||"0"}.${s||"0"}`;return Number.isFinite(r)&&r>0?Math.round(r*100)/100:0}function ln(e){if(!(e>0))return"";let a=Math.round(e*100)/100;return Number.isInteger(a)?String(a):a.toFixed(2).replace(".",",")}function Da(e){if(!(e>0))return"";let a=Math.round(e*100)/100,[o,t]=a.toFixed(2).split("."),n=o.replace(/\B(?=(\d{3})+(?!\d))/g,".");return t==="00"?n:`${n},${t}`}function So(e){return xo(e)}function dn(e,a){if(!/^\d{4}-\d{2}-\d{2}$/.test(e)||!/^\d{4}-\d{2}-\d{2}$/.test(a))return 0;let o=t=>Date.UTC(Number(t.slice(0,4)),Number(t.slice(5,7))-1,Number(t.slice(8,10)));return Math.max(0,Math.round((o(a)-o(e))/864e5))}function Ro(e,a){if(!(a&&a>0))return 0;let o=0;for(let t of e){if(!t.enDolares||!(t.precioUSD&&t.precioUSD>0))continue;let n=Ve(t.precioUSD,a);n!==t.valor&&(t.valor=n,o++)}return o}function un(e){let a=0;for(let o of e)o.enDolares&&o.precioUSD===void 0&&o.valor>0&&(o.precioUSD=Math.round(o.valor*100)/100,a++);return a}var Zs="https://www.datos.gov.co/resource/32sa-8pi3.json";async function pn(e=fetch){let a=`${Zs}?$limit=1&$order=vigenciadesde%20DESC`,o;try{o=await e(a,{headers:{accept:"application/json"}})}catch{throw new Error("No hubo forma de conectarse. \xBFHay se\xF1al?")}if(!o.ok)throw new Error(`El portal de datos del Estado respondi\xF3 ${o.status}.`);let t=await o.json().catch(()=>null),n=Array.isArray(t)?t[0]:null,s=Number(n?.valor);if(!n||!Number.isFinite(s)||s<=0)throw new Error("El portal respondi\xF3, pero sin una tasa que se pueda leer.");let r=String(n.vigenciadesde??"").slice(0,10);return{valor:Math.round(s*100)/100,de:/^\d{4}-\d{2}-\d{2}$/.test(r)?r:""}}function er(e,a){return e.filter(o=>o.tipo==="fijo"&&(o.desdePago??1)<=a).filter(o=>!(o.modo==="puntual"&&o.supuesto==="nunca")&&!(o.modo==="primer_pago"&&a>1)).map(o=>({nombre:o.nombre,monto:D(Z(o.valor,o.cambios,a)),extra:!1})).filter(o=>o.monto>0)}function Te(e,a,o){let t=(e.reservaExtras??[]).filter(n=>D(n.monto)>0).map(n=>({nombre:n.nombre,monto:D(n.monto),extra:!0}));return[...er(a,o),...t]}function Ue(e){return e.reduce((a,o)=>a+o.monto,0)}function Co(e){return Math.max(1,Math.round(e.reservaMeses??1))}function ar(e,a,o){return Ue(Te(e,a,o))*Co(e)}function Ma(e,a,o){let t=0;for(let n of e){if(n.clase!=="reserva")continue;let s=ar(n,a,o);n.valor!==s&&(n.valor=s,t++)}return t}function Ao(e,a){return a<=0?null:Math.floor(Math.max(0,e)/a*10)/10}function Po(e){return`${Number.isInteger(e)?String(e):e.toFixed(1).replace(".",",")} ${e===1?"mes":"meses"}`}var mn=new Intl.NumberFormat("es-CO"),Lo=e=>`$${mn.format(Math.round(e))}`;function gn(e,a,o){let t=[];return t.push(`${e.clase==="deuda"?"\u26A0\uFE0F ":e.clase==="reserva"?"\u{1F6DF} ":""}${e.puedeEsperar?"\u23F3 ":""}${e.fechaFija&&e.antesDelPago?"\u{1F4CC} ":""}${e.nombre.trim()||"(sin nombre)"}`),t.push(Lo(e.valor)),e.compra?t.push("ya la compraste"):a?.yaEstabaPagada?t.push("ya est\xE1 pagada"):o?t.push(o):t.push("sin fecha todav\xEDa"),t.join(" \xB7 ")}function fn(e,a){let o=e.tipo==="porcentaje"?`${or(e.valor*100)} %${a?` = ${Lo(a)}`:""}`:Lo(e.valor),t=e.modo==="cada_pago"?"cada pago":e.modo==="puntual"?"puntual":e.modo==="primer_pago"?"solo el primero":String(e.modo),n=[e.nombre.trim()||"(sin nombre)",o,t];return(e.cambios?.length??0)>0&&n.push(`${e.cambios.length} cambio${e.cambios.length===1?"":"s"}`),n.join(" \xB7 ")}function or(e){return Number.isInteger(e)?String(e):mn.format(Math.round(e*100)/100)}function vn(e,a){let o=new Map(a.map(s=>[s.metaId,s])),t=e.filter(s=>!s.compra&&!o.get(s.id)?.yaEstabaPagada&&s.valor>0),n=null;for(let s of t){let r=o.get(s.id)?.pagoFin??null;r!==null&&(!n||r<n.pagoFin)&&(n={meta:s,pagoFin:r})}return n||(t.length>0?{meta:t[0],pagoFin:null}:null)}function Ea(e,a){return e.compra||e.valor<=0?1:Math.max(0,Math.min(1,a/e.valor))}function $n(e,a){let o=2*Math.PI*a,t=e.reduce((s,r)=>s+Math.max(0,r),0),n=0;return e.map(s=>{let r=t>0?Math.max(0,s)/t*o:0,i={largo:r,desde:n};return n+=r,i})}var bn={obligacion:0,meta:1,gasto:2,ahorro:3,"sin-asignar":4};function hn(e,a,o){let t=new Set(o.map(u=>u.id)),n=new Set(o.map(u=>u.nombre)),s=(u,p)=>u&&a.has(u)?"meta":u&&t.has(u)||n.has(p)?"obligacion":u?"meta":"gasto",r=e.real??e.simulado;if(!r)return null;let i=e.real!==null,c=r.detalle.filter(u=>u.monto>0).map(u=>({nombre:u.nombre,monto:u.monto,tipo:i?s(u.refId,u.nombre):u.refId?"meta":"obligacion"}));r.alAhorro>0&&c.push({nombre:"Queda guardado",monto:r.alAhorro,tipo:"ahorro"}),e.real&&e.real.sinAsignar>0&&c.push({nombre:"Sin repartir todav\xEDa",monto:e.real.sinAsignar,tipo:"sin-asignar"}),c.sort((u,p)=>bn[u.tipo]-bn[p.tipo]||p.monto-u.monto);let d=c.reduce((u,p)=>u+p.monto,0);return d<=0?null:{mes:e.mes,esReal:i,total:d,trozos:c}}function Dn(e){let a=e.filter(o=>o.real||o.simulado);return(a.find(o=>o.estado==="actual")??a.find(o=>o.estado==="futuro")??a[a.length-1])?.mes??null}function Mn(e,a,o,t,n){let s=new Map(a.map(c=>[c.metaId,c])),r=new Map,i=new Map;for(let c of[...t].sort((d,u)=>d.mes.localeCompare(u.mes)))for(let d of c.real?.detalle??[])!d.refId||d.monto<=0||(r.has(d.refId)||r.set(d.refId,c.mes),i.set(d.refId,c.mes));return e.map(c=>{let d=s.get(c.id),u={metaId:c.id,nombre:c.nombre.trim()||"(sin nombre)",esDeuda:c.clase==="deuda"},p=d?.pagoInicio!=null?n(d.pagoInicio):null,m=r.get(c.id)??p;if(c.compra)return{...u,desde:null,hasta:c.compra.mes,estado:"comprada"};if(Ea(c,o.get(c.id)??0)>=1){let v=i.get(c.id)??null;return{...u,desde:r.get(c.id)??v,hasta:v,estado:"lista"}}return d?.pagoFin!=null?{...u,desde:m,hasta:n(d.pagoFin),estado:"en-curso"}:{...u,desde:m,hasta:null,estado:m?"no-alcanza":"sin-fecha"}})}function En(e,a){if(e>a)return[];let o=[],[t,n]=e.split("-").map(Number);for(let s=0;s<240;s++){let r=`${t}-${String(n).padStart(2,"0")}`;if(o.push(r),r===a)break;n++,n>12&&(n=1,t++)}return o}function yn(e,a){if(a.campo===ma)return{ok:!1,motivo:"Un borrado no se puede deshacer desde aqu\xED: vuelve a crear esa fila."};if(a.campo==="id")return{ok:!1,motivo:"El identificador de una fila no se cambia."};let o=nr(e,a);if(!o)return{ok:!1,motivo:"Eso ya no est\xE1 en este aparato."};let t=tr(a);return a.valor===void 0?delete o[t]:o[t]=a.valor,{ok:!0}}function tr(e){return e.tabla==="soportes"?e.id:e.campo}function nr(e,a){let o=t=>t.find(n=>n.id===a.id)??null;switch(a.tabla){case"escenario":return e.escenario;case"metas":return o(e.metas);case"obligaciones":return o(e.obligaciones);case"cuentas":return o(e.cuentas);case"ingresos":return o(e.ingresos);case"repartos":return o(e.repartos);case"soportes":return a.campo==="nota"?e.notasDelMes??={}:a.campo!=="marcados"?null:e.soportesMarcados;default:return null}}var To="2026-11-17 15:30";function xn(e,a=To){if(a==="desarrollo"||!e||typeof e!="object")return!1;let o=e.version;return typeof o=="string"&&o.trim()!==""&&o!==a}var sr=new Intl.NumberFormat("es-CO"),f=e=>`$${sr.format(Math.round(e))}`,l,M=null;function P(e=new Date){let a=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${a}-${o}`}function g(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var b=new Map;function Tn(e){if(!(e instanceof HTMLInputElement)&&!(e instanceof HTMLSelectElement))return null;let a=[e.id&&`#${e.id}`,e.dataset.accion&&`[data-accion="${e.dataset.accion}"]`,e.dataset.id&&`[data-id="${e.dataset.id}"]`,e.dataset.campo&&`[data-campo="${e.dataset.campo}"]`,e.dataset.tipo&&`[data-tipo="${e.dataset.tipo}"]`,e.dataset.i!==void 0&&`[data-i="${e.dataset.i}"]`].filter(Boolean);return a.length>0?a.join(""):null}var ya=null,wo=null,Ye=!1,Ie=!1;var La=null,I=null,rr=6,Ra=!1;function ir(e){let o=window.innerHeight;e<90?window.scrollBy({top:-Math.max(6,(90-e)/3),behavior:"instant"}):e>o-90&&window.scrollBy({top:Math.max(6,(e-(o-90))/3),behavior:"instant"})}function In(e,a){return document.elementFromPoint(e,a)?.closest?.("tr[data-fila]")??null}function cr(e){for(let a of document.querySelectorAll(".destino"))a.classList.remove("destino");e&&Number(e.dataset.fila)!==I?.desde&&e.classList.add("destino")}function qn(e,a,o){if(!o||e===a)return[];try{let t=Ia(),n=q();return Jt(o,le({...t,metas:Yt(t.metas,e,a)}),s=>L(s,n).optimista)}catch{return[]}}function lr(e){if(e.despues===null)return"\u2192 sin terminar";let a=re(L(e.despues,q()));if(e.meses===null)return`\u2192 ${a}`;if(e.meses===0)return null;let o=Math.abs(e.meses);return`\u2192 ${a} \xB7 ${o} ${o===1?"mes":"meses"} ${e.meses<0?"antes":"despu\xE9s"}`}function wn(e){for(let a of document.querySelectorAll(".marquita-orden"))a.remove();for(let a of document.querySelectorAll("#panel-metas tr[data-resumen-original]"))a.dataset.resumen=a.dataset.resumenOriginal,delete a.dataset.resumenOriginal;for(let a of e){let o=lr(a),t=document.querySelector(`#panel-metas tr[data-id-fila="${CSS.escape(a.metaId)}"]`);if(!o||!t)continue;let n=document.createElement("span");n.className=`marquita-orden ${a.meses!==null&&a.meses<0?"antes":"despues"}`,n.textContent=o,t.children[1]?.appendChild(n),t.dataset.resumen!==void 0&&(t.dataset.resumenOriginal=t.dataset.resumen,t.dataset.resumen=`${t.dataset.resumen} ${o}`)}}function jn(){wn([]),I?.fila.classList.remove("arrastrando");for(let e of document.querySelectorAll(".destino"))e.classList.remove("destino");I=null,Je()}document.addEventListener("pointerdown",e=>{let a=e.target?.closest?.(".asa"),o=a?.closest("tr[data-fila]");!a||!o||(I={desde:Number(o.dataset.fila),fila:o,movido:!1,y0:e.clientY,hasta:null},o.classList.add("arrastrando"),a.setPointerCapture?.(e.pointerId),e.preventDefault())});document.addEventListener("pointermove",e=>{if(!I||!I.movido&&Math.abs(e.clientY-I.y0)<rr)return;if(!I.movido)for(let t of document.querySelectorAll("tr.comentario-orden"))t.remove();I.movido=!0,e.preventDefault(),ir(e.clientY);let a=In(e.clientX,e.clientY);cr(a);let o=a?Number(a.dataset.fila):NaN;Number.isInteger(o)&&o!==I.hasta&&(I.hasta=o,I.ahora===void 0&&(I.ahora=jo()),wn(qn(I.desde,o,I.ahora)))});document.addEventListener("pointerup",e=>{if(!I)return;let{desde:a,movido:o}=I,t=In(e.clientX,e.clientY);if(jn(),!o||!t)return;Ra=!0,setTimeout(()=>{Ra=!1},0);let n=Number(t.dataset.fila);if(!Number.isInteger(n)||n===a)return;let[s]=l.metas.splice(a,1);l.metas.splice(n,0,s),M={texto:`\xAB${s.nombre}\xBB qued\xF3 en la posici\xF3n ${n+1}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron.`,malo:!1},E()});document.addEventListener("pointercancel",()=>{I&&(jn(),y())});document.addEventListener("mousedown",e=>{let a=e.target;Ye=a?.closest("button[data-accion]")!==null&&a?.closest("button[data-accion]")!==void 0,ya=Tn(a?.closest("input, select")??null),wo=a?.closest?.("[data-panel]")?.dataset.panel??null},!0);document.addEventListener("mouseup",()=>{setTimeout(()=>{Ye=!1,wo=null,Ie&&(Ie=!1,Qe())},0)},!0);function dr(e,a){let o=ya!==null,t=ya??e;if(ya=null,!t)return;let n=document.querySelector(t);if(n&&(n.focus(),!o&&a!==null&&typeof n.setSelectionRange=="function"))try{n.setSelectionRange(a,a)}catch{}}function Y(){On()||Qe()}function E(){On()||y()}function fe(){return Qa(Fn(),P().slice(0,7),l.escenario.fechaPrimerPago)}function On(){Ma(l.metas,l.obligaciones,fe());let e=ee(l);return e&&(M={texto:`No pude guardar: ${e}`,malo:!0}),Ye?(Ie=!0,!0):!1}function q(){let e=l.escenario;return{desde:new Date(`${e.fechaPrimerPago}T12:00:00`),diasOptimista:e.diasOptimista,diasPesimista:e.diasPesimista}}function Fn(){let e=0,a=[...l.ingresos].sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o=0;o<a.length;o++)e=Math.max(e,je(a[o],a.slice(0,o),Ta));return e+1}function Ta(e){let a=l.cuentas.find(t=>t.id===e);if(!a)return null;let o=ce(a.periodo,l.ingresos.filter(t=>t.cuentaDeCobroId===e));return o?ta(o,l.escenario.fechaPrimerPago):null}function Ia(){let e=l.escenario;return{nombre:e.nombre,desdePago:Qa(Fn(),P().slice(0,7),e.fechaPrimerPago),ingresoEsperado:e.ingresoEsperado,cambiosIngreso:e.cambiosIngreso,obligaciones:l.obligaciones,colchon:{nombre:"Otros / Ahorro",base:e.colchonBase,minimo:e.colchonMinimo,elastico:e.colchonElastico,sobranteAMetas:e.sobranteAMetas!==!1,cambios:e.cambiosColchon},metas:Ja(l.metas,l.repartos)}}function Sn(e){return`${((e==="ahorro"?l.escenario.cambiosColchon:l.escenario.cambiosIngreso)??[]).map((t,n)=>`<div class="cambio">
      <span class="rango">desde</span>
      ${qa(t.desdePago,`data-accion="cambio-escenario" data-cual="${e}" data-i="${n}" data-campo="desdePago"`,"Desde qu\xE9 mes")}
      <input type="text" inputmode="numeric" data-dinero value="${T(t.valor)}"
        class="corto-dinero" data-accion="cambio-escenario" data-cual="${e}" data-i="${n}" data-campo="valor" />
      <button class="icono" data-accion="borrar-cambio-escenario" data-cual="${e}" data-i="${n}" title="Quitar">\u2715</button>
    </div>`).join("")}<button class="chico" data-accion="nuevo-cambio-escenario" data-cual="${e}">+ cambio</button>`}function ur(){let e=l.escenario;return`
  <section class="panel">
    <h2>Escenario <span class="sufijo">\u2014 el supuesto sobre lo que va a entrar</span></h2>
    <div class="campos">
      <div class="campo">
        <label for="ingreso">Lo que espero por pago</label>
        <input id="ingreso" type="text" inputmode="numeric" data-dinero
               value="${T(e.ingresoEsperado)}"
               data-accion="escenario" data-campo="ingresoEsperado" />
      </div>
      <div class="campo">
        <label>El pago cambia</label>
        ${Sn("ingreso")}
      </div>
      <div class="campo">
        <label for="colchon">Otros / Ahorro por pago</label>
        <input id="colchon" type="text" inputmode="numeric" data-dinero
               value="${T(e.colchonBase)}"
               data-accion="escenario" data-campo="colchonBase" />
      </div>
      <div class="campo">
        <label for="minimo">Del ahorro no bajar de</label>
        <input id="minimo" type="text" inputmode="numeric" data-dinero
               value="${T(e.colchonMinimo)}"
               title="Solo aplica con el interruptor de abajo encendido"
               data-accion="escenario" data-campo="colchonMinimo" />
      </div>
      <div class="campo">
        <label>El ahorro cambia</label>
        ${Sn("ahorro")}
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
      Con ${e.diasPesimista} d\xEDas, el pago ${Va(q())?10:12} caer\xEDa
      ${(()=>{let a=q();return`<strong>${Math.round(11*(e.diasPesimista-e.diasOptimista)/30)} meses</strong> m\xE1s tarde que si fueran puntuales`})()}.
    </p>`:""}
  </section>`}var pr={cada_pago:"Cada pago",primer_pago:"Solo el primer pago",puntual:"Puntual: cuando yo la marque"},Nn={siempre:"asumo que la pago siempre",cada_dos_pagos:"asumo un pago s\xED y otro no",nunca:"asumo que no la pago"},_n=0;function qa(e,a,o,t){let n=q(),s=go(Gt(_n,e),i=>L(i,n).optimista),r=s.find(i=>i.numero===e);return kn(`<select class="lista-meses" tabindex="-1" data-titulo="${g(o)}" ${a}>
    ${t!==void 0?`<option value="" data-corto="${g(t)}" ${e?"":"selected"}>${g(t)}</option>`:""}
    ${s.map(i=>`<option value="${i.numero}" data-anio="${i.anio}" data-mes="${g(i.mes)}"
        data-vez="${g(i.vez)}" data-corto="${g(i.corto)}" ${i.numero===e?"selected":""}>${g(i.rotulo)}</option>`).join("")}
  </select>`,r?.rotulo??t??"\u2014",r?.corto??t??"\u2014")}function kn(e,a,o){return`<span class="selector-mes">${e}<button type="button" class="boton-mes" data-accion="abrir-meses">
    <span class="mes-largo">${g(a)}</span><span class="mes-corto">${g(o)}</span><i>\u25BE</i></button></span>`}function zn(e,a,o){return qa(e??1,`data-accion="${a}" data-id="${o}" data-campo="desdePago"`,"Empieza en")}function wa(){let e=l.cuentas.filter(a=>a.montoEsperado>0);if(e.length>0){let a=e.reduce((o,t)=>t.periodo.localeCompare(o.periodo)>0?t:o);return{monto:a.montoEsperado,de:a.periodo,esReal:!0}}return{monto:l.escenario.ingresoEsperado,de:"lo que esperas por pago",esReal:!1}}function mr(e){let a=wa();return a.monto<=0?'<span class="rango">\u2014</span>':e.tipo!=="porcentaje"?`<span class="calculado">${f(e.valor)}</span>`:`<span class="calculado" data-sale-de="${e.id}" data-base="${a.monto}">${f(se(a.monto,e.valor))}</span>`}function Hn(e){let a=l.escenario;return D(Z(a.ingresoEsperado,a.cambiosIngreso,e))}function gr(e){let a=e.dataset.accion==="oblig"?`[data-sale-de="${e.dataset.id}"]`:`[data-sale-de="${e.dataset.id}"][data-i="${e.dataset.i}"]`,o=document.querySelector(a);if(!o)return;let t=Number(e.value),n=Number.isFinite(t)?se(Number(o.dataset.base),t/100):0;o.textContent=(o.dataset.prefijo??"")+f(n)}function fr(e,a,o){if(o<=0)return"";let t=l.obligaciones.find(n=>n.id===e)?.cambios?.[a];return t?`<span class="calculado" data-sale-de="${e}" data-i="${a}" data-base="${o}" data-prefijo="= "
    title="Sobre ${f(o)}, lo que esperas cobrar desde ese mes">= ${f(se(o,t.valor))}</span>`:""}function br(e){let a=e.cambios??[];if(a.length===0)return"";let o=e.tipo==="porcentaje",t=(n,s)=>`<span class="cambio">
      <span class="rango">desde</span>
      ${qa(n.desdePago,`data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="desdePago"`,"Desde qu\xE9 mes")}
      <span class="rango">pasa a</span>
      ${o?`<input type="number" min="0" max="100" step="any" value="${so(n.valor)}" class="corto"
             data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" /><span class="rango">%</span>
           ${fr(e.id,s,Hn(n.desdePago))}`:`<input type="text" inputmode="numeric" data-dinero value="${T(n.valor)}"
             class="corto-dinero" data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" />`}
      <button class="icono" data-accion="borrar-cambio" data-id="${e.id}" data-i="${s}"
        title="Quitar este cambio">\u2715</button>
    </span>`;return`<tr class="fila-cambios" data-hija-de="${e.id}">
    <td colspan="9"><span class="rango">${g(e.nombre)} \xB7</span>
      ${a.map(t).join("")}</td>
  </tr>`}function Vn(e,a,o){let t=a?.trim(),n=ro(o);return!t&&!n?"":`<tr class="fila-nota" data-hija-de="${e}">
    <td colspan="9">
      ${t?`<span class="texto-nota">\u{1F4DD} ${g(t)}</span>`:""}
      ${n?`${t?"<br />":""}<a href="${g(n)}" target="_blank" rel="noopener noreferrer"
        data-enlace>\u{1F517} ${g(new URL(n).hostname.replace(/^www\./,""))}</a>`:""}
    </td>
  </tr>`}function vr(e){let a=e.modo==="puntual",o=wa(),t=o.monto>0&&e.tipo==="porcentaje"?se(o.monto,e.valor):null;return`
  <tr data-id-fila="${e.id}" data-resumen="${g(fn(e,t)+(e.nota?.trim()?" \xB7 \u{1F4DD}":""))}"
      class="${e.id===La?"abierta":""}">
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
      ${e.tipo==="porcentaje"?`<input type="number" step="any" min="0" max="100" value="${so(e.valor)}"
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`:`<input type="text" inputmode="numeric" data-dinero value="${T(e.valor)}"
             data-accion="oblig" data-id="${e.id}" data-campo="valor" />`}
      <button class="chico" data-accion="nuevo-cambio" data-id="${e.id}"
        title="A partir de cierto pago, esto pasa a valer otra cosa">+ cambio</button>
    </td>
    <td class="num">${mr(e)}</td>
    <td class="desde">${zn(e.desdePago,"oblig",e.id)}</td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="modo">
        ${Object.entries(pr).map(([n,s])=>`<option value="${n}" ${e.modo===n?"selected":""}>${s}</option>`).join("")}
      </select>
    </td>
    <td>
      ${a?`<select data-accion="oblig" data-id="${e.id}" data-campo="supuesto">
        ${Object.entries(Nn).map(([n,s])=>`<option value="${n}" ${(e.supuesto??"siempre")===n?"selected":""}>${s}</option>`).join("")}
      </select>`:'<span class="rango">\u2014</span>'}
    </td>
    <td class="num">
      <button class="icono ${e.nota?.trim()?"con-nota":""}" data-accion="nota-oblig" data-id="${e.id}"
        title="${e.nota?.trim()?"Editar la nota":"Escribir una nota"}">\u{1F4DD}</button>
      <button class="icono" data-accion="borrar-oblig" data-id="${e.id}" title="Quitar">\u2715</button></td>
  </tr>`}function Io(e,a){return Re(e,a,l.obligaciones,{nombre:"",base:0,minimo:0,elastico:!1},[],new Map,0).obligaciones.reduce((t,n)=>t+n.monto,0)}function $r(){let e=wa();if(e.monto<=0)return"";let a=Io(1,e.monto),o=Io(2,e.monto),t=(s,r)=>`
    <div><span class="rotulo">${s}</span>
      <span class="valor">${f(e.monto-r)}</span>
      <span class="rotulo">libre para metas \xB7 se van ${f(r)}</span></div>`,n=e.esReal?`Calculado sobre <strong>${g(e.de)}</strong>: ${f(e.monto)}, que es lo que
       esperas cobrar de verdad. Si no hubiera cuenta de cobro registrada, saldr\xEDa del
       escenario de arriba.`:`Calculado sobre el escenario de arriba (${f(e.monto)}), que es una <em>suposici\xF3n</em>.
       En cuanto registres una cuenta de cobro, esta cifra sale de ah\xED.`;return`<div class="resumen resumen-oblig">
    ${t("En el primer pago",a)}
    ${a!==o?t("En los siguientes",o):""}
  </div>
  <p class="nota ${e.esReal?"":"aviso"}">${n}</p>`}function hr(){let e=l.obligaciones.filter(a=>a.modo==="puntual");return l.obligaciones.length===0?`
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
        <tbody>${l.obligaciones.map(a=>vr(a)+br(a)+Vn(a.id,a.nota)).join("")}</tbody>
      </table>
    </div>
    ${$r()}
    <p class="nota"><button data-accion="nueva-oblig">+ Agregar obligaci\xF3n</button>
      ${Bn("obligaciones")}
      ${Gn("obligaciones")}</p>
    ${e.length?`<p class="nota aviso">
      Las puntuales no se pueden adivinar. Para calcular las fechas
      ${e.map(a=>`<strong>${g(a.nombre)}</strong>: ${Nn[a.supuesto??"siempre"]}`).join(" \xB7 ")}.
    </p>`:""}
  </section>`}function Dr(e){if(e.clase==="reserva")return"";if(!e.compra)return`<button data-accion="comprada" data-id="${e.id}">Ya la compr\xE9</button>`;let a=e.compra.precioReal-e.valor;return`<span class="completa">${g(j(e.compra.mes))}</span>
    <span class="rango">${f(e.compra.precioReal)}${a===0?"":a<0?` \xB7 ${f(-a)} menos`:` \xB7 ${f(a)} m\xE1s`}</span>
    <button class="icono" data-accion="no-comprada" data-id="${e.id}" title="No la compr\xE9">\u2715</button>`}var qo=new Map;function Mr(e){if(!e.enDolares)return`<input type="text" inputmode="numeric" data-dinero value="${T(e.valor)}"
      data-accion="meta" data-id="${e.id}" data-campo="valor" />`;let a=l.escenario.tasaDolar;return`<input type="text" inputmode="decimal" class="en-dolares" value="${ln(e.precioUSD??0)}"
      data-accion="meta" data-id="${e.id}" data-campo="precioUSD"
      title="El precio en d\xF3lares, como est\xE1 en la tienda" />
    <div class="en-pesos">${a&&e.precioUSD?`= $${T(Ve(e.precioUSD,a))}`:"\u26A0\uFE0F falta la tasa del d\xF3lar"}</div>`}function Er(e){if(e.clase==="deuda"||e.compra||(qo.get(e.id)??0)>=e.valor)return"";let a=$o([e],qo,P()).length>0,o=e.precioRevisado?`revisado ${H(e.precioRevisado.slice(0,7))} ${e.precioRevisado.slice(0,4)}`:"sin revisar";return`<div class="marca-precio ${a?"vieja":""}">
    <span>${a?"\u26A0\uFE0F ":""}${g(o)}</span>
    ${a?`<button class="chico" data-accion="precio-sigue" data-id="${e.id}" title="El precio sigue igual: marcarlo revisado hoy">\u2713 sigue igual</button>`:""}
    <button class="chico ${e.enDolares?"activo":""}" data-accion="meta-dolares" data-id="${e.id}"
      title="${e.enDolares?"Est\xE1 en d\xF3lares: se mueve con la tasa":"Marcar que el precio es en d\xF3lares"}">US$</button>
  </div>`}function Un(){let e=new Map([...V(l.metas,l.repartos)].map(([n,s])=>[n,s.total])),a=Kt(l.metas,l.repartos,l.ingresos,e,P().slice(0,7)),o=$o(l.metas,e,P());if(a.length===0&&o.length===0)return"";let t=o.filter(n=>!n.revisado).length;return`<div class="avisos-metas">
    ${a.map(n=>`<p class="aviso-meta quieta">\u23F8\uFE0F <strong>${g(n.nombre)}</strong> lleva ${n.meses} meses sin recibir
      <span class="rango">\xB7 \xFAltimo abono en ${g(j(n.ultimoMes))}</span></p>`).join("")}
    ${o.length?`<p class="aviso-meta precio">\u{1F3F7}\uFE0F ${o.length} ${o.length===1?"precio":"precios"} para revisar
      <span class="rango">\xB7 ${t?`${t} sin revisar nunca`:""}${t&&o.length>t?" \xB7 ":""}${o.length>t?`${o.length-t} de hace m\xE1s de 3 meses`:""}
      ${o.some(n=>n.enDolares)?" \xB7 los de d\xF3lares dependen de la tasa":""}</span></p>`:""}
  </div>`}function yr(e,a){let o=qe(e.valor,a),t=V(l.metas,l.repartos).get(e.id)?.falta??0,n=Yo(t,o);return`<span class="cuota">\xB7 ${f(o)} c/u</span>${n!==void 0?` <span class="cuota">\xB7 el \xFAltimo ${f(n)}</span>`:""}`}function xr(e){let a=V(l.metas,l.repartos).get(e.id),o=a.previo>0&&a.real>0&&Math.abs(a.previo-a.real)<=Math.max(1e3,a.real*.05),t=`<input type="text" inputmode="numeric" data-dinero value="${T(a.previo)}"
      title="Lo que ya le hab\xEDas abonado a esta meta ANTES de empezar a usar el programa"
      data-accion="meta" data-id="${e.id}" data-campo="abonado" />`,n=(e.reservaRetiros??[]).reduce((s,r)=>s+D(r.monto),0);return a.real===0&&n===0?t:`${t}
    ${a.real>0?`<span class="rango">+ ${f(a.real)} de lo real</span>`:""}
    ${n>0?`<span class="rango">\u2212 ${f(n)} usado</span>`:""}
    <span class="${a.falta===0?"completa":""}">= ${f(a.total)}</span>
    ${o?`<span class="aviso">\u26A0\uFE0F ${f(a.previo)} escrito a mano y ${f(a.real)}
      registrado: \xBFes el mismo dinero?
      <button class="icono" data-accion="quitar-previo" data-id="${e.id}"
        title="S\xED, dejar solo lo registrado">\u2713</button></span>`:""}`}function Gn(e){return`<span class="solo-telefono plegado-todo">
    <button class="chico" data-accion="desplegar-todo" data-lista="${e}">Desplegar todo</button>
    <button class="chico" data-accion="plegar-todo" data-lista="${e}">Plegar todo</button>
  </span>`}function Bn(e){if((e==="metas"?l.metas.length:l.obligaciones.length)<2)return"";let o=e==="metas"?' title="Ojo: en las metas el orden es la prioridad de pago, as\xED que esto cambia el plan"':"";return`&nbsp; <span class="rango">Ordenar por</span>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="nombre"${o}>nombre</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="valor"${o}>valor</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="grupo"${o}>grupo</button>`}function Sr(e,a,o,t,n){return`
  <tr data-fila="${a}" data-id-fila="${e.id}"
      data-resumen="${g(gn(e,n,t)+(e.nota?.trim()||e.link?" \xB7 \u{1F4DD}":""))}"
      class="${e.clase==="deuda"?"es-deuda":""} ${e.id===La?"abierta":""}">
    <td class="orden">
      <span class="asa" title="Arrastra para moverla de sitio">\u283F</span>
      <button class="icono" data-accion="subir" data-i="${a}" ${a===0?"disabled":""} title="Subir">\u2191</button>
      <button class="icono" data-accion="bajar" data-i="${a}" ${a===o-1?"disabled":""} title="Bajar">\u2193</button>
    </td>
    <td><input class="ancho" value="${g(e.nombre)}" data-accion="meta" data-id="${e.id}" data-campo="nombre" />
      ${e.clase==="reserva"?'<span class="marca-reserva" title="Su precio se calcula solo: lo fijo de un mes">\u{1F6DF} reserva</span>':`<select class="clase-meta" data-accion="meta" data-id="${e.id}" data-campo="clase"
        title="Solo para distinguirlas de un vistazo: no cambia el orden ni el reparto">
        <option value="compra" ${e.clase!=="deuda"?"selected":""}>\u{1F6D2} quiero comprarla</option>
        <option value="deuda" ${e.clase==="deuda"?"selected":""}>\u26A0\uFE0F ya la debo</option>
      </select>`}
      <button class="icono ${e.puedeEsperar?"con-nota":""}" data-accion="esperar-meta" data-id="${e.id}"
        aria-pressed="${e.puedeEsperar?"true":"false"}"
        title="${e.puedeEsperar?"Puede esperar: va despu\xE9s de las dem\xE1s en el reparto. Toca para quitarlo":"Marcar \xABpuede esperar\xBB: si el mes no alcanza, va despu\xE9s de las dem\xE1s"}">\u23F3</button>
      <!-- Aqui y no en la columna de botones: alli se apilaban y la tabla se pasaba del panel. -->
      <button class="icono ${e.nota?.trim()?"con-nota":""}" data-accion="nota-meta" data-id="${e.id}"
        title="${e.nota?.trim()?"Editar la nota":"Escribir una nota"}">\u{1F4DD}</button>
      <button class="icono ${e.link?.trim()?"con-nota":""}" data-accion="link-meta" data-id="${e.id}"
        title="${e.link?.trim()?"Cambiar el enlace":"Poner el enlace de d\xF3nde comprarla"}">\u{1F517}</button></td>
    <td class="num">${e.clase==="reserva"?`<strong class="precio-reserva">${f(e.valor)}</strong><div class="rango">se calcula sola \xB7 el detalle, abajo</div>`:Mr(e)+Er(e)}</td>
    <td><input value="${g(e.grupo??"")}" placeholder="ninguno"
        data-accion="meta" data-id="${e.id}" data-campo="grupo" /></td>
    <td class="desde">${zn(e.desdePago,"meta",e.id)}
      <div class="plazo"><span class="rango">la quiero antes de</span>
        ${qa(e.antesDelPago,`data-accion="meta" data-id="${e.id}" data-campo="antesDelPago" title="Solo para avisarte: no cambia el orden de pago"`,"La quiero antes de","\u2014")}
        ${e.antesDelPago?`<button class="icono ${e.fechaFija?"con-nota":""}" data-accion="fecha-fija-meta" data-id="${e.id}"
          aria-pressed="${e.fechaFija?"true":"false"}"
          title="${e.fechaFija?"Fecha fija: cada mes aparta lo justo para llegar a tiempo, antes que las dem\xE1s. Toca para quitarla":"Marcar fecha fija: no se puede correr; cada mes aparta lo justo para llegar a tiempo"}">\u{1F4CC}</button>`:""}</div>
    </td>
    <td class="num ritmo">
      <input type="text" inputmode="numeric" data-dinero
        value="${e.maximoPorPago?T(e.maximoPorPago):""}" placeholder="sin tope"
        title="M\xE1ximo que puede recibir en un pago"
        data-accion="meta" data-id="${e.id}" data-campo="maximoPorPago" />
      <span class="rango">o en <input type="number" min="0" step="1" class="corto"
        value="${e.enCuotas??""}" placeholder="\u2014"
        title="Reunirla en tantos meses: la cuota la calculo yo"
        data-accion="meta" data-id="${e.id}" data-campo="enCuotas" /> meses
        ${e.enCuotas&&e.enCuotas>0&&!e.maximoPorPago?yr(e,e.enCuotas):""}</span>
    </td>
    <td class="num pagado">${xr(e)}</td>
    <td class="compra">${Dr(e)}</td>
    <td class="num">
      <button class="icono" data-accion="duplicar-meta" data-id="${e.id}" title="Duplicar">\u29C9</button>
      <button class="icono" data-accion="borrar-meta" data-id="${e.id}" title="Quitar">\u2715</button>
    </td>
  </tr>
  ${Vn(e.id,e.nota,e.link)}`}function Rr(e){let a=new Map([...V(l.metas,l.repartos)].map(([n,s])=>[n,s.total])),o=bo(l.metas,a),t=(n,s,r="")=>`<span class="total-clase ${r}">${n}
    <strong>${f(s.valor)}</strong>${s.pagado>0?` <span class="rango">\xB7 llevas <strong class="completa">${f(s.pagado)}</strong> \xB7 faltan ${f(Math.max(0,s.valor-s.pagado))}</span>`:""}</span>`;if(o.deudas.cuantas===0){let n=rt(l.metas,l.repartos);return` &nbsp; Suma de todas: <strong>${f(e)}</strong>${n===0?"":` &nbsp; Llevas pagado:
      <strong class="completa">${f(n)}</strong> <span class="rango">\xB7 te faltan ${f(Math.max(0,e-n))}</span>`}`}return`<span class="totales-clase">${t("Debes",o.deudas,"es-deuda")}${t("Quieres comprar",o.compras)}</span>`}function Cr(e){qo=new Map([...V(l.metas,l.repartos)].map(([n,s])=>[n,s.total]));let a=q(),o=new Map((e?.metas??[]).map(n=>[n.metaId,{res:n,cuando:n.pagoFin!==null?re(L(n.pagoFin,a)):null}]));if(l.metas.length===0)return`
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
        <tbody>${l.metas.map((n,s)=>{let r=o.get(n.id);return Sr(n,s,l.metas.length,r?.cuando??null,r?.res??null)}).join("")}</tbody>
      </table>
    </div>
    <p class="nota">
      <button data-accion="nueva-meta">+ Agregar meta</button>
      ${l.metas.some(n=>n.clase==="reserva")?"":`<button data-accion="nueva-reserva"
        title="Una meta para tener lo fijo de un mes guardado, por si un mes no te pagan">\u{1F6DF} + Reserva para meses sin pago</button>`}
      ${Bn("metas")}
      ${Gn("metas")}
      ${Rr(t)}
      ${Un()}
      ${l.metas.length>1?`<br /><span class="rango">
        <strong>Ritmo de pago</strong>: para reunir para dos cosas a la vez. Pon un
        <strong>tope</strong> en pesos, o di <strong>en cu\xE1ntos meses</strong> la quieres reunir
        y yo calculo la cuota. Si pones los dos, manda el tope. Lo que no pase baja a la meta
        siguiente; en blanco, esa meta se lleva todo lo que haya.</span>`:""}
      <br /><span class="rango">
        <strong>Ya pagado antes</strong>: solo lo que YA le hab\xEDas abonado a esa meta
        <strong>antes de empezar a usar el programa</strong>. Lo que pagues de aqu\xED en
        adelante sale solo de los repartos reales y no se teclea aqu\xED.</span>
    </p>
    ${Ar()}
  </section>`}function Ar(){let e=l.metas.find(c=>c.clase==="reserva");if(!e)return"";let a=Te({...e,reservaExtras:[]},l.obligaciones,fe()),o=Ue(Te(e,l.obligaciones,fe())),t=Co(e),n=V(l.metas,l.repartos).get(e.id)?.total??0,s=Ao(n,o),r=(e.reservaExtras??[]).map((c,d)=>`<li><span>${g(c.nombre)} <span class="rango">\xB7 lo sumaste t\xFA</span></span>
      <strong>${f(c.monto)}</strong>
      <button class="icono" data-accion="reserva-quitar" data-id="${e.id}" data-i="${d}" title="Quitar">\u2715</button></li>`),i=[...a.map(c=>`<li><span>${g(c.nombre)} <span class="rango">\xB7 obligaci\xF3n fija</span></span><strong>${f(c.monto)}</strong></li>`),...r];return`<div class="reserva-detalle">
    <h3>\u{1F6DF} ${g(e.nombre.trim()||"Reserva")} <span class="sufijo">\u2014 lo fijo de un mes, por si no te pagan</span></h3>
    <ul>${i.join("")||'<li class="rango">No tienes obligaciones de monto fijo: suma aqu\xED lo que pagas cada mes.</li>'}</ul>
    <p><button data-accion="reserva-extra" data-id="${e.id}">+ Agregar otra cosa</button>
      ${n>0?`<button data-accion="reserva-usar" data-id="${e.id}"
        title="Un mes que no te pagaron: lo que sacaste de la reserva. Se vuelve a llenar sola">Us\xE9 la reserva</button>`:""}</p>
    ${(e.reservaRetiros??[]).length?`<ul class="reserva-usos">${(e.reservaRetiros??[]).map((c,d)=>`<li>
      <span>Usaste ${f(c.monto)} en ${g(j(c.fecha.slice(0,7)))}${c.nota?` <span class="rango">\xB7 ${g(c.nota)}</span>`:""}</span>
      <button class="icono" data-accion="reserva-deshacer-uso" data-id="${e.id}" data-i="${d}" title="Me equivoqu\xE9: deshacer">\u21A9</button></li>`).join("")}</ul>`:""}
    <p class="rango">Un mes: <strong>${f(o)}</strong> \xD7 para
      <input type="number" min="1" max="12" step="1" class="corto" value="${t}"
        data-accion="reserva-meses" data-id="${e.id}" title="Para cu\xE1ntos meses sin pago" />
      ${t===1?"mes":"meses"} = <strong>${f(e.valor)}</strong>.
      ${s===null?"":`Llevas ${f(n)}: <strong>cubres ${Po(s)} sin pago</strong>.`}
      Los porcentajes (diezmo, padres) no entran: salen de lo que te pagan, y sin pago son $0.</p>
  </div>`}var Qn={tranquilo:"",pronto:"aviso",hoy:"urgente",vencido:"malo"};function Pr(){let e=new Date,a=l.soportesMarcados[Fe(e)]??[],o=ao(e,a),t=Qn[o.urgencia],n=r=>{let i=a.includes(r.id);return`<li class="soporte ${i?"listo":""}">
      <label class="interruptor">
        <input type="checkbox" data-accion="soporte" data-id="${r.id}" ${i?"checked":""} />
        <span>${g(r.nombre)}${r.obligatorioExplicito?' <strong class="pendiente">OBLIGATORIO</strong>':""}</span>
      </label>
      ${r.detalle?`<p class="nota">${g(r.detalle)}</p>`:""}
    </li>`},s=eo.filter(r=>r.frecuencia!=="cada_mes");return`
  <section class="panel radicacion ${t}">
    <h2><span class="etiqueta real">Real</span> Radicar la cuenta de cobro
      <span class="sufijo">\u2014 qu\xE9 d\xEDa y con qu\xE9 papeles</span></h2>
    <p class="titular ${t}">${g(o.titular)}</p>
    <p class="nota">${g(gt(o.limite))}
      ${o.limite.usoUltimoDiaDelMes?`<br /><span class="rango">${g(pt)}</span>`:""}
    </p>
    <ul class="soportes">${de().map(n).join("")}</ul>
    <p class="nota">
      Ya entregados una sola vez y no hay que repetirlos:
      ${s.filter(r=>r.frecuencia==="una_sola_vez").map(r=>g(r.nombre)).join(" \xB7 ")}.
      La constancia firmada por el paciente es solo para personal asistencial.
    </p>
  </section>`}function Yn(){return tt(l.cuentas,l.ingresos,P().slice(0,7)).map(e=>`
    <div class="aviso-radicar aviso pregunta-mes">
      <div class="aviso-radicar-texto">
        <span class="etiqueta real">Real</span> <strong>\xBFTe pagaron ${g(j(e))}?</strong>
        <div class="rango">El mes ya termin\xF3 y no hay ni cuenta ni pago registrados de ese mes.</div>
        <div class="aviso-botones">
          <button class="primario" data-accion="mes-pagado" data-mes="${e}">S\xED, registrar el pago</button>
          <button data-accion="mes-me-deben" data-mes="${e}">No, me lo deben</button>
          <button data-accion="mes-sin-cuenta" data-mes="${e}">Ese mes no hubo cuenta</button>
        </div>
      </div>
    </div>`).join("")}function Lr(){return ka(xe(l.cuentas,l.ingresos),P()).map(e=>`
    <div class="aviso-radicar ${e.pasoElMaximo?"urgente":"aviso"} aviso-atraso">
      <div class="aviso-radicar-texto">
        <span class="etiqueta real">Real</span> <strong>Se est\xE1 demorando m\xE1s de lo normal</strong>
        <div class="rango">${g(Bo(e))}</div>
      </div>
      <div class="aviso-radicar-dias"><strong>${e.dias}</strong><span>d\xEDas</span></div>
    </div>`).join("")}function Tr(){let e=xe(l.cuentas,l.ingresos),a=Na(e),o=new Map(a.map(r=>[r.cuentaId,r])),t=_a(a),n=Vo(e),s=new Map(ka(e,P()).map(r=>[r.cuentaId,r]));return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> Lo que te deben y lo que te han pagado
      <span class="sufijo">\u2014 una fila por mes cobrado</span></h2>
    ${Yn()}
    ${l.cuentas.length===0?`<div class="vacio">A\xFAn no has registrado ninguna cuenta de cobro.<br />
         Sirve para llevar cu\xE1nto te deben cuando te pagan a medias.
         <p><button data-accion="nueva-cuenta">+ Registrar una cuenta de cobro</button></p></div>`:`<div class="tabla-ancha"><table>
          <thead><tr><th>Periodo</th><th class="num">Esperado</th><th class="num">Recibido</th>
            <th class="num">Falta</th><th>Estado</th><th></th></tr></thead>
          <tbody>${e.map(r=>`
            <tr>
              <td><input class="ancho" value="${g(r.cuenta.periodo)}"
                    data-accion="cuenta" data-id="${r.cuenta.id}" data-campo="periodo" />
                  <div class="radicada"><span class="rango">radicada el</span>
                    <input type="date" value="${g(r.cuenta.fechaRadicacion??"")}"
                      data-accion="cuenta" data-id="${r.cuenta.id}" data-campo="fechaRadicacion" /></div></td>
              <td class="num"><input type="text" inputmode="numeric" data-dinero value="${T(r.cuenta.montoEsperado)}"
                    data-accion="cuenta" data-id="${r.cuenta.id}" data-campo="montoEsperado" /></td>
              <td class="num">${f(r.recibido)}</td>
              <td class="num ${r.pendiente>0?"pendiente":"completa"}">
                ${r.pendiente>0?f(r.pendiente):"\u2014"}</td>
              <td class="rango">${g(Go(r).split(": ").slice(1).join(": "))}${(()=>{let i=o.get(r.cuenta.id);return!i||i.diasPrimero===null?"":`<br /><span class="demora">primer pago a los ${i.diasPrimero} d\xEDas${i.diasCompleto!==null&&i.diasCompleto!==i.diasPrimero?` \xB7 completa a los ${i.diasCompleto}`:""}</span>`})()}${(()=>{let i=s.get(r.cuenta.id);return i?`<br /><span class="demora atrasada ${i.pasoElMaximo?"malo":""}">\u23F0 lleva ${i.dias} d\xEDas sin pago \xB7 lo normal en ti: ${i.normal}</span>`:""})()}</td>
              <td class="num">
                ${Uo(r)?`<button data-accion="abonar" data-id="${r.cuenta.id}">+ Registrar pago</button>`:r.cuenta.noHubo?"":'<span class="completa">\u2713 completa</span>'}
                <button class="icono" data-accion="borrar-cuenta" data-id="${r.cuenta.id}">\u2715</button>
              </td>
            </tr>
            ${r.ingresos.map(i=>`<tr class="componente">
              <!-- Etiquetas propias en el tel\xE9fono (\xA79.K.1): esta fila no lleva un periodo ni
                   un \xABesperado\xBB, y copiarlas de la cabecera dec\xEDa \xABPeriodo\xBB junto a una fecha. -->
              <td data-etiqueta-fila="Pagado el"><div class="radicada"><span class="rango">pagado el</span>
                <input type="date" value="${g(i.fecha)}" max="${P()}"
                  data-accion="ingreso" data-id="${i.id}" data-campo="fecha" /></div></td>
              <td class="num vacia-en-tarjeta" data-etiqueta-fila=""></td>
              <td class="num" data-etiqueta-fila="Monto">${f(i.monto)}</td>
              <td colspan="2" class="rango">pago recibido</td>
              <td class="num"><button class="icono" data-accion="borrar-ingreso" data-id="${i.id}">\u2715</button></td>
            </tr>`).join("")}`).join("")}
          </tbody>
        </table></div>
        ${t.primero!==null?`<p class="nota demoras">\u23F1\uFE0F Con ${t.pagadas} ${t.pagadas===1?"cuenta pagada":"cuentas pagadas"},
          el primer pago te llega en promedio a los <strong>${t.primero} d\xEDas</strong> de radicar${t.completo!==null?` y la cuenta queda completa a los <strong>${t.completo}</strong>`:""}.</p>`:a.length===0?'<p class="nota rango">Pon la fecha en que radicaste cada cuenta y aqu\xED ver\xE1s cu\xE1nto se demoran de verdad en pagarte.</p>':""}
        <p class="nota"><button data-accion="nueva-cuenta">+ Registrar otra cuenta</button>
        ${n.length?` &nbsp; <span class="pendiente">Te deben en total ${f(ea(e))}</span>`:""}</p>`}
  </section>`}function Rn(e,a,o,t,n,s,r,i,c=""){let d=q(),u=o===null||t===null?"\u2014":`${re({optimista:L(o,d).optimista,pesimista:L(t,d).optimista})}${n===null?"":` \xB7 ${n} ${n===1?"pago":"pagos"}`}`,p=t!==null?L(t,d):null,m=t!==null?Se(L(t,d)):i?"ya la ten\xEDas pagada":"sin terminar",v=r?`<span class="completa">${f(a)}</span>`:`<span class="pendiente">${f(s)} de ${f(a)}</span>`;return`<tr class="${c}">
    <td class="meta-nombre">${g(e)}</td>
    <td class="num">${v}</td>
    <td class="rango">${u}</td>
    <td class="cuando">${p?`<span class="fecha-larga-meta">${g(m)}</span><span class="fecha-corta-meta">${g(re(p))}</span>`:g(m)}</td>
  </tr>`}function jo(){if(l.metas.length===0)return null;try{return le(Ia())}catch{return null}}function Ir(e){if(l.metas.length===0)return`<section class="panel simulado">
      <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
      <div class="vacio">Agrega tus metas arriba y aqu\xED aparecen las fechas.</div>
    </section>`;if(!e)return`<section class="panel simulado"><h2>Simulaci\xF3n</h2>
      <p class="nota aviso">No pude calcular la proyecci\xF3n con estos datos.</p></section>`;let a=new Map(it(e).map(d=>[d.grupo,d])),o=[],t=new Set,n=(d,u="")=>Rn(d.nombre,d.valor,d.pagoInicio,d.pagoFin,d.cantidadPagos,d.totalAbonado,d.completada,d.yaEstabaPagada,u);for(let d of e.metas){if(!d.grupo){o.push(n(d));continue}if(t.has(d.grupo))continue;t.add(d.grupo);let u=a.get(d.grupo);o.push(Rn(u.grupo,u.valor,u.pagoInicio,u.pagoFin,null,u.totalAbonado,u.completado,u.yaEstabaPagado,"grupo"));for(let p of e.metas)p.grupo===d.grupo&&o.push(n(p,"componente"))}let s=e.totalPagos,r=l.escenario,i=q(),c=Se(L(s,i));return`
  <section class="panel simulado">
    <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
    <div class="resumen">
      <div><span class="valor">${e.totalPagos}</span><span class="rotulo">pagos hasta terminarlo todo</span></div>
      <div><span class="valor cuando">${g(c)}</span><span class="rotulo">termina la \xFAltima meta</span></div>
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
      ${Va(i)?`Las fechas son de <strong>una sola posibilidad</strong>: pagos puntuales cada
           ${r.diasOptimista} d\xEDas, sin contar atrasos. Sube \xABd\xEDas si se atrasan\xBB
           por encima de ${r.diasOptimista} y vuelven a salir como rango.`:`El \xABcu\xE1ndo\xBB va de puntual (cada ${r.diasOptimista} d\xEDas) a atrasado (cada ${r.diasPesimista}).`}
      ${e.incompleta?"<br /><strong>Con ese ingreso no alcanza a terminar.</strong>":""}
    </p>
    ${jr(e)}
    ${wr()}
    ${qr(e)}
  </section>`}var ge=null;function qr(e){let a=q(),o=n=>n===null?"no alcanza":re({optimista:L(n,a).optimista,pesimista:L(n,a).optimista}),t="";if(ge!==null){let n=null;try{n=le({...Ia(),ingresoEsperado:ge,cambiosIngreso:void 0})}catch{n=null}if(!n)t='<p class="nota aviso">Con esa cifra no pude calcular la proyecci\xF3n.</p>';else{let s=ba(e.metas,n.metas),r=s.filter(i=>i.antes!==i.despues);t=`
        <p class="rango">La \xFAltima meta: <strong>${g(o(e.totalPagos||null))}</strong> \u2192
          <strong>${g(n.incompleta?"no alcanza":o(n.totalPagos||null))}</strong>
          \xB7 ${r.length===0?"ninguna meta cambia de mes":`${r.length} ${r.length===1?"meta cambia":"metas cambian"}, ${s.length-r.length} igual`}</p>
        ${r.length?`<ul class="lista-si">${r.map(i=>{let c=Qt(i);return`<li class="${c===null?"mal":c>0?"tarde":"antes"}"><strong>${g(i.nombre)}</strong>
            <span>${g(o(i.antes))} \u2192 ${g(o(i.despues))}</span>
            <em>${c===null?"":c>0?`+${c} ${c===1?"mes":"meses"}`:`${c} ${c===-1?"mes":"meses"}`}</em></li>`}).join("")}</ul>`:""}`}}return`
    <div class="si-me-entran">
      <h3>\xBFY si me entran otra cifra?</h3>
      <p class="rango">Solo para mirar: no cambia tu escenario ni se guarda.</p>
      <p class="si-campo">Si me entran
        <input type="text" inputmode="numeric" data-dinero data-accion="si-me-entran"
          value="${ge!==null?T(ge):""}" placeholder="${T(l.escenario.ingresoEsperado)}" />
        por pago ${ge!==null?'<button class="chico-linea" data-accion="si-me-entran-quitar">Quitar</button>':""}</p>
      ${t}
    </div>`}function wr(){let e=ea(xe(l.cuentas,l.ingresos));if(e<=0)return"";let a=lt(Ia(),e);if(!a)return"";let o=q(),t=n=>Se(L(Math.max(1,n),o));return`<p class="nota ${a.seAdelanta>0?"":"rango"}">
    Te deben <strong class="pendiente">${f(a.pendiente)}</strong>.
    ${a.seAdelanta>0?`Si te los pagaran de una vez, terminar\xEDas <strong>${a.seAdelanta}
         ${a.seAdelanta===1?"pago":"pagos"} antes</strong>: la \xFAltima meta pasar\xEDa de
         ${g(t(a.pagosAhora))} a ${g(t(a.pagosSiPagan))}.`:`Aunque te los pagaran de una vez, las fechas no se mover\xEDan \u2014 el ritmo lo marcan los
         topes por pago que pusiste arriba, no lo que entra.`}
    <br /><span class="rango">Esto es aparte: la proyecci\xF3n de arriba NO cuenta ese dinero
    hasta que lo registres como pago recibido.</span>
  </p>`}function jr(e){let a=ct(e,l.metas);if(a.length===0)return"";let o=q(),t=s=>B(L(Math.max(1,s),o).optimista),n=s=>s.termina===null?`<li class="mal"><strong>${g(s.nombre)}</strong> la quer\xEDas para
        ${g(t(s.queria))} y <strong>no alcanza a terminar</strong> con este ingreso.</li>`:s.seRetrasa===0?`<li class="bien"><strong>${g(s.nombre)}</strong> la quer\xEDas para
        ${g(t(s.queria))} y llega ${s.termina===0?"ya pagada":`en ${g(t(s.termina))}`}.</li>`:`<li class="mal"><strong>${g(s.nombre)}</strong> la quer\xEDas para
      ${g(t(s.queria))} y va para <strong>${g(t(s.termina))}</strong>
      \u2014 ${s.seRetrasa} ${s.seRetrasa===1?"pago":"pagos"} tarde.
      S\xFAbela de posici\xF3n o dale m\xE1s por pago.</li>`;return`<div class="plazos">
    <h3 class="titulo-total">Lo que quer\xEDas para cierta fecha</h3>
    <ul>${a.map(n).join("")}</ul>
    <p class="nota rango">Esto solo avisa: el orden de pago lo pones t\xFA arriba, y el programa
      no lo cambia por su cuenta.</p>
  </div>`}function $e(e){let a=oa(l.metas),o=l.ingresos.filter(s=>s.fecha<=e.fecha&&s.id!==e.id).sort((s,r)=>s.fecha.localeCompare(r.fecha));for(let s of o){let r=l.repartos.find(i=>i.ingresoId===s.id);for(let i of r?.abonos??[])i.refId&&a.set(i.refId,Math.max(0,(a.get(i.refId)??0)-i.monto))}for(let s of l.metas){let r=(s.reservaRetiros??[]).filter(i=>i.fecha<=e.fecha).reduce((i,c)=>i+D(c.monto),0);r>0&&a.set(s.id,Math.min(D(s.valor),(a.get(s.id)??0)+r))}let t=e.cuentaDeCobroId?!o.some(s=>s.cuentaDeCobroId===e.cuentaDeCobroId):!0,n=l.escenario;return Jo(e,je(e,o,Ta),l.obligaciones,{nombre:"Otros / Ahorro",base:n.colchonBase,minimo:n.colchonMinimo,elastico:!1,sobranteAMetas:n.sobranteAMetas!==!1},l.metas,a,t)}function Or(){let e=Ba(l.ingresos,l.repartos);if(e.length===0)return`<section class="panel">
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
        <h3>${g(j(t.mes))}</h3>
        <span class="valor">${f(t.entro)}</span>
        <span class="rotulo">entr\xF3${t.deFuera>0?` \xB7 ${f(t.deFuera)} los pusiste t\xFA`:""}</span>
      </div>
      ${n.map(Fr).join("")}
      ${n.length>1?`<div class="total-mes">
        <span>Ese mes: ${f(t.aObligaciones)} en obligaciones \xB7 ${f(t.aMetas)} a metas
        ${t.alAhorro>0?` \xB7 ${f(t.alAhorro)} guardado`:""}</span></div>`:""}
    </div>`}).join(""),o=Wo(l.repartos);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
      <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
    ${a}
    ${o.length>1?`
      <h3 class="titulo-total">En todo lo que llevas</h3>
      <div class="tabla-ancha"><table><tbody>
        ${o.map(t=>`<tr><td class="meta-nombre">${g(t.nombre)}</td>
          <td class="num">${f(t.monto)}</td></tr>`).join("")}
      </tbody></table></div>`:""}
    <p class="nota"><button data-accion="aporte-externo">+ Meter plata de otro lado</button>
      &nbsp; <span class="rango">Para cuando pones de tu bolsillo (Nequi, efectivo) y no viene del trabajo.</span></p>
  </section>`}function Fr(e){let a=l.repartos.find(i=>i.ingresoId===e.id),o=l.cuentas.find(i=>i.id===e.cuentaDeCobroId),t=g(o?o.periodo:e.nota??"de otro lado");if(!a)return`<div class="ingreso-real">
      <div class="ingreso-cabecera">
        <span class="meta-nombre">${f(e.monto)}</span>
        <span class="rango">${g(e.fecha)} \xB7 ${t}</span>
      </div>
      <p class="nota aviso">No est\xE1 dicho en qu\xE9 se fue este dinero.
        <button data-accion="proponer" data-id="${e.id}">Calcularlo por m\xED</button></p>
    </div>`;let n=we(a,e),s=(i,c,d)=>`
    <tr>
      <td class="meta-nombre">${g(i.nombre)}
        ${i.movidoDesdeGasto?'<span class="rango">\xB7 ven\xEDa de un gasto</span>':""}</td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${T(i.monto)}" class="corto-dinero"
        data-accion="editar-reparto" data-id="${a.id}" data-tipo="${c}" data-i="${d}" /></td>
      <td class="num">${i.movidoDesdeGasto?`<button class="icono" data-accion="abono-a-gasto" data-id="${a.id}" data-i="${d}"
             title="Devolverlo a gastos">\u21A9</button>`:c==="abonos"&&i.refId&&l.metas.some(u=>u.id===i.refId)?`<button class="icono" data-accion="pasar-al-otro-mes" data-id="${a.id}" data-i="${d}"
               title="La pago el otro mes: este pago no le da nada y el programa la planea para el mes siguiente">\u23ED</button>`:""}</td>
    </tr>`,r=(i,c)=>`
    <tr class="gasto-suelto">
      <td><input value="${g(i.nombre)}" placeholder="\xBFen qu\xE9 se fue?"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${c}" data-campo="nombre" /></td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${T(i.monto)}" class="corto-dinero"
        data-accion="editar-gasto" data-id="${a.id}" data-i="${c}" data-campo="monto" /></td>
      <td class="num"><button class="icono" data-accion="borrar-gasto"
        data-id="${a.id}" data-i="${c}" title="Quitar">\u2715</button></td>
    </tr>`;return`<div class="ingreso-real ${a.propuesto?"propuesto":""}">
    <div class="ingreso-cabecera">
      <span class="meta-nombre">${f(e.monto)}</span>
      <span class="rango">${g(e.fecha)} \xB7 ${t}</span>
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
              value="${T(a.alAhorro)}" class="corto-dinero"
              data-accion="editar-reparto" data-id="${a.id}" data-tipo="ahorro" data-i="0" /></td>
            <td class="num"></td>
          </tr>
        </tbody>
      </table>
    </div>
    ${(()=>{let i=st(a,l.metas);return i.length===0?"":i.map(c=>`<p class="nota aviso">
        Tienes <strong>${g(c.gasto.nombre)}</strong> (${f(c.gasto.monto)}) anotado aqu\xED como
        un gasto cualquiera, pero <strong>${g(c.metaNombre)}</strong> es una de tus metas.
        <br />Si ese dinero se lo metiste a la meta, m\xE1rcalo: as\xED el programa sabe que ya llevas
        ${f(c.gasto.monto)} pagados y deja de calcular las fechas como si te faltara el precio
        entero. Si fue otra cosa que se llama parecido, d\xE9jalo como est\xE1.
        <br /><button data-accion="gasto-a-abono" data-id="${a.id}"
          data-meta="${c.metaId}" data-nombre="${g(c.gasto.nombre)}">S\xED, fue abono a ${g(c.metaNombre)}</button>
      </p>`).join("")})()}
    ${(()=>{let i=Zo(a,$e(e));if(i.length===0)return"";let c=q(),d=m=>B(L(Math.max(1,m),c).optimista),u=je(e,l.ingresos.filter(m=>m.fecha<=e.fecha&&m.id!==e.id),Ta),p=i.map(m=>{let v=et(m,Ja(l.metas,l.repartos),l.obligaciones,u),x=v.tipo==="ya-no-esta"?"ya no est\xE1 en tu lista":v.tipo==="ya-comprada"?"la marcaste como ya comprada":v.tipo==="ya-pagada"?"ya est\xE1 pagada":v.tipo==="empieza-despues"?`ahora empieza en ${d(v.pago)}`:v.tipo==="solo-el-primer-pago"?"es solo del primer pago":v.tipo==="puntual"?"es puntual, no de todos los pagos":v.tipo==="en-cero"?"est\xE1 en $0":"no sabr\xEDa decirte por qu\xE9";return`<li><strong>${g(m)}</strong> \u2014 ${g(x)}</li>`}).join("");return`<div class="nota aviso">
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
  </div>`}function Jn(e){let a=q(),o=e?Ko(e.pagos,a.desde,a.diasOptimista,l.metas):[],t=Ba(l.ingresos,l.repartos),n=[...new Set([...o.map(r=>r.mes),...t.map(r=>r.mes)])],s=nt(l.cuentas,l.ingresos,l.escenario.ingresoEsperado,n);return at(o,t,P().slice(0,7),s,ot(l.cuentas,l.ingresos))}function Nr(e){let a=Jn(e);if(a.length===0)return`<section class="panel">
      <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
      <div class="vacio">Agrega tus metas y registra un pago: aqu\xED se ve el calendario entero.</div>
    </section>`;kr(a);let o=Ya(a);return`
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
    <div class="linea-tiempo">${a.map(zr).join("")}</div>
    <p class="nota">
      <span class="etiqueta real">Real</span> lo que pas\xF3 \xB7
      <span class="etiqueta simulacion">Simulaci\xF3n</span> lo que pasar\xEDa si entra lo que supone
      el escenario. Nunca se mezclan en una sola cifra.
    </p>
  </section>`}function _r(e,a){let o=(s,r)=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")===r.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=l.obligaciones.find(s=>o(s.nombre,e));if(t)return`<span class="que-es obligacion">fijo${t.grupo?` \xB7 ${g(t.grupo)}`:""}</span>`;let n=(a?l.metas.find(s=>s.id===a):void 0)??l.metas.find(s=>o(s.nombre,e));return n?`<span class="que-es meta">meta${n.grupo?` \xB7 ${g(n.grupo)}`:""}</span>`:e==="Qued\xF3 guardado"||e==="Se guardar\xEDa"?"":'<span class="que-es suelto">de una vez</span>'}var be=new Set,Cn=!1;function kr(e){if(Cn)return;Cn=!0;let a=e.findIndex(t=>t.estado==="actual"),o=a>=0?a:0;for(let t of e.slice(o,o+2))be.add(t.mes)}function zr(e){let a=e.real!==null,o=e.real??e.simulado;if(!o)return e.sinPagar?Hr(e.mes,e.sinPagar):"";let t=a?o.entro:e.esperado?.monto??o.entro,n=!a&&e.simulado!==null&&e.esperado!==null&&e.esperado.monto!==e.simulado.entro,s=e.real?e.real.detalle:ie(e.simulado?.detalle),r=l.notasDelMes?.[e.mes]?.trim()??"",i=e.estado==="actual"?'<span class="chip ahora">este mes</span>':e.estado==="futuro"?'<span class="chip futuro">viene</span>':"",c=[o.aObligaciones>0?`${f(o.aObligaciones)} fijos`:"",o.aMetas>0?`${f(o.aMetas)} a metas`:"",a&&e.real.enGastos>0?`${f(e.real.enGastos)} sueltos`:"",o.alAhorro>0?`${f(o.alAhorro)} guardado`:""].filter(Boolean).join(" \xB7 ");return`
  <details class="mes-vista ${e.estado} ${a?"es-real":"es-simulado"}"
           data-mes="${e.mes}" ${be.has(e.mes)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${g(j(e.mes))}</h3>
      ${i}
      <span class="etiqueta ${a?"real":"simulacion"}">${a?"Real":"Simulaci\xF3n"}</span>
      <span class="valor">${f(t)}</span>
      ${c?`<span class="resumen-plegado">${c}</span>`:""}
      ${r?'<span class="rango" title="Este mes tiene una nota">\u{1F4DD}</span>':""}
    </summary>
    <p class="nota">
      ${r?`<span class="nota-del-mes">\u{1F4DD} ${g(r)}</span><br />`:""}
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
        ${s.map(d=>`<tr>
          <td class="meta-nombre">${g(d.nombre)} ${_r(d.nombre,d.refId)}
            ${d.deLoQueSobro?`<span class="rango">\xB7 ${f(d.deLoQueSobro)} con lo que sobr\xF3 del mes</span>`:""}</td>
          <td class="num">${f(d.monto)}</td></tr>`).join("")}
        ${o.alAhorro>0?`<tr class="grupo">
          <td class="meta-nombre">${a?"Qued\xF3 guardado":"Se guardar\xEDa"}</td>
          <td class="num">${f(o.alAhorro)}</td></tr>`:""}
      </tbody></table></div>`}
    ${e.real&&e.real.sinAsignar>0?`<p class="nota aviso">
      Hay ${f(e.real.sinAsignar)} sin decir en qu\xE9 se fueron.</p>`:""}
  </details>`}function Hr(e,a){return`
  <details class="mes-vista pasado es-real sin-pagar" data-mes="${e}" ${be.has(e)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${g(j(e))}</h3>
      <span class="etiqueta real">Real</span>
      <span class="valor">${f(0)}</span>
      <span class="resumen-plegado">no entr\xF3 nada \xB7 te deben ${f(a)}</span>
    </summary>
    <p class="nota aviso">La empresa no pag\xF3 este mes: tu cuenta de cobro de ${f(a)} sigue
      sin un peso. Si te la pagan despu\xE9s, reg\xEDstrala con esa cuenta y se cuenta en este mes.</p>
  </details>`}var U=[],te=Tt(),z=!1,_=null,G=null,Vr={escenario:"Escenario",obligaciones:"Obligaciones",metas:"Metas",cuentas:"Cuentas de cobro",ingresos:"Registrar \xB7 pagos recibidos",repartos:"Registrar \xB7 en qu\xE9 se fue la plata",soportes:"Soportes de radicaci\xF3n"};function Xn(e){let a=e.datos,o=t=>typeof t=="number"?f(t):"";switch(e.tabla){case"metas":return`\xAB${String(a.nombre??"sin nombre")}\xBB`;case"obligaciones":return`\xAB${String(a.nombre??"sin nombre")}\xBB`;case"cuentas":return`la cuenta de ${String(a.periodo??"?")}`;case"ingresos":return`el pago del ${String(a.fecha??"?")} (${o(a.monto)})`;case"repartos":return ga({tabla:"repartos",id:e.id},l);case"escenario":return"el escenario";case"soportes":return`los soportes de ${e.id}`}}function Ca(e){let a=Math.max(1,Math.round(e)),o=q();return go(a,t=>L(t,o).optimista)[a-1].rotulo}function Aa(e,a){if((e.campo==="ordenMetas"||e.campo==="ordenObligaciones")&&Array.isArray(a)&&_){let o=e.campo==="ordenMetas"?"metas":"obligaciones",t=new Map;for(let n of[..._.remotas[o],..._.locales[o]])t.set(n.datos.id,String(n.datos.nombre??n.datos.id));return a.map((n,s)=>`${s+1}. ${t.get(String(n))??"?"}`).join(" \xB7 ")}return Le(e.campo??"",a,Ca)}function Wn(e){let a=Xn(e);return e.tipo==="campo"?[`${a} \u2014 ${_e(e.campo??"")}`,Aa(e,e.aqui),Aa(e,e.nube)]:e.tipo==="solo-aqui"?[`${a} est\xE1 solo en este aparato`,"Conservarla","Quitarla de los dos"]:e.tipo==="solo-nube"?[`${a} est\xE1 solo en el otro aparato`,"No traerla (quitarla de los dos)","Traerla"]:[`${a} la borraste en el otro aparato`,"Conservarla","Borrarla tambi\xE9n aqu\xED"]}function Ur(e,a){let[o,t,n]=Wn(e),s=a==="aqui"?t:n;return e.tipo==="campo"?`${o}: qued\xF3 ${s}`:`${o} \u2192 ${s.toLowerCase()}`}function Gr(e){let a=_.elecciones[e.clave],o=(i,c)=>`
    <label class="opcion ${a===i?"elegida":""}">
      <input type="radio" name="${g(e.clave)}" value="${i}" ${a===i?"checked":""}
        data-accion="nube-elegir" data-clave="${g(e.clave)}" data-lado="${i}" />
      <span>${c}</span>
    </label>`,t=Xn(e),[n,s,r]=Wn(e);return e.tipo==="campo"?`<div class="diferencia">
      <div class="que"><strong>${g(t)}</strong> \u2014 ${g(_e(e.campo??""))}
        ${e.confirmadoEn?'<span class="rango">(el que confirmaste viene marcado)</span>':""}</div>
      ${o("aqui",`<b>En este aparato:</b> ${g(Aa(e,e.aqui))}`)}
      ${o("nube",`<b>En el otro aparato (la nube):</b> ${g(Aa(e,e.nube))}`)}
    </div>`:`<div class="diferencia fila-entera">
    <div class="que"><strong>${g(n)}</strong></div>
    ${o("aqui",g(s))}
    ${o("nube",g(r))}
  </div>`}function Br(){let e=_,a=[...new Set(e.difs.map(o=>o.tabla))];return`<div class="revision">
    <h3 class="titulo-ventana">${e.modo==="subir"?"\u2B06 Subir mi versi\xF3n":"\u2B07 Traer la \xFAltima versi\xF3n"}</h3>
    <p><strong>${e.modo==="subir"?"Vas a SUBIR la versi\xF3n de este aparato.":"Vas a TRAER la \xFAltima versi\xF3n de la nube."}</strong>
      Hay ${e.difs.length} ${e.difs.length===1?"diferencia":"diferencias"} con el otro aparato.
      Viene marcado ${e.modo==="subir"?"lo de este aparato":"lo de la nube"}; cambia lo que quieras.
      <b>Todav\xEDa no se ha escrito nada</b>, ni aqu\xED ni en la nube.</p>
    ${a.map(o=>`<h3>${g(Vr[o])}</h3>
      ${e.difs.filter(t=>t.tabla===o).map(Gr).join("")}`).join("")}
    <p class="botones-revision">
      <button class="primario" data-accion="nube-aplicar" ${z?"disabled":""}>
        ${z?"Aplicando\u2026":"Aplicar lo elegido"}</button>
      <button data-accion="nube-cancelar">Cancelar, no cambiar nada</button>
    </p>
  </div>`}function Qr(){if(G){let e=G;return`<div class="capa-dialogo capa-nube cerrable">
      <div class="dialogo dialogo-nube" role="dialog" aria-modal="true">
        <h3 class="titulo-ventana ${e.malo?"pendiente":""}">${g(e.titulo)}</h3>
        ${e.lineas.length?`<ul class="lista-resultado">${e.lineas.map(a=>`<li>${g(a)}</li>`).join("")}</ul>`:""}
        <div class="dlg-botones"><button class="primario" data-accion="nube-cerrar-ventana">Cerrar</button></div>
      </div></div>`}return _?`<div class="capa-dialogo capa-nube">
      <div class="dialogo dialogo-nube" role="dialog" aria-modal="true">${Br()}</div></div>`:""}function Yr(){return`
    <section class="panel">
      <h2>Aviso en el tel\xE9fono <span class="sufijo">\u2014 por tu calendario</span></h2>
      <p class="nota">Genera un archivo con los d\xEDas de radicar de los pr\xF3ximos 12 meses y lo importas UNA vez en
        Google Calendar. De ah\xED en adelante el tel\xE9fono te avisa <strong>3 d\xEDas antes y el mismo d\xEDa</strong>, aunque
        la app est\xE9 cerrada. Los pasos est\xE1n en <code>docs/PASOS_CALENDARIO_TELEFONO.md</code>.</p>
      <p><button class="primario" data-accion="calendario-descargar">Generar el archivo del calendario</button></p>
      <p class="rango">\u26A0\uFE0F El calendario no sabe si ya radicaste: te avisa igual. El aviso del PC s\xED se apaga cuando le
        pones la fecha a esa cuenta.</p>
    </section>`}function Jr(){let e=Eo(),a=(o,t,n)=>`
    <button data-accion="tema" data-tema="${o}" class="${e===o?"activo":""}">
      <i class="muestra-tema ${o}"></i>${t} <span class="rango">${n}</span></button>`;return`
    <section class="panel">
      <h2>Tema <span class="sufijo">\u2014 c\xF3mo se ve la app</span></h2>
      <div class="temas">
        ${a("marino","Azul marino","el de siempre")}
        ${a("negro","Negro","gasta menos bater\xEDa en el tel\xE9fono")}
      </div>
      <p class="rango">Se queda guardado en este aparato: el PC y el tel\xE9fono pueden tener temas distintos.</p>
      <p class="rango">Versi\xF3n de la app: <strong>${g(To)}</strong></p>
    </section>`}var Ge=!1;function Xr(){let e=l.escenario,a=l.metas.filter(n=>n.enDolares),o=e.tasaDolarDe&&/^\d{4}-\d{2}-\d{2}$/.test(e.tasaDolarDe)?`${Number(e.tasaDolarDe.slice(8,10))} de ${j(e.tasaDolarDe.slice(0,7))}`:"",t=e.tasaDolarDe?dn(e.tasaDolarDe,P()):0;return`
    <section class="panel">
      <h2>D\xF3lar <span class="sufijo">\u2014 para las metas marcadas US$</span></h2>
      <div class="fila-dolar">
        <label>1 d\xF3lar = <input type="text" inputmode="decimal" class="corto-dinero"
          value="${Da(e.tasaDolar??0)}" placeholder="3.209,78"
          data-accion="tasa-dolar" /> pesos</label>
        <button data-accion="tasa-dolar-traer" ${Ge?"disabled":""}
          title="Trae la TRM oficial del d\xEDa (datos.gov.co). Necesita se\xF1al.">
          ${Ge?"Buscando\u2026":"Traer la tasa de hoy"}</button>
      </div>
      ${e.tasaDolar?`<p class="rango">${o?`Tasa del ${g(o)}`:"Tasa que escribiste t\xFA"}${t>7?` \xB7 \u26A0\uFE0F hace ${t} d\xEDas`:""}
            \xB7 ${a.length===0?"ninguna meta est\xE1 en d\xF3lares todav\xEDa":`${a.length} ${a.length===1?"meta":"metas"} en d\xF3lares: ${a.map(n=>g(n.nombre)).join(", ")}`}</p>`:'<p class="rango">Sin tasa, una meta en d\xF3lares no se puede pasar a pesos y la proyecci\xF3n la cuenta mal.</p>'}
      <p class="rango">Al cambiarla se vuelven a calcular los precios en pesos de esas metas. El resto no se toca.</p>
      <p class="rango">Los precios en d\xF3lares se redondean hacia arriba, a miles: 381.964 queda en 382.000. Nunca te quedas corto.</p>
    </section>`}var Be=!1;function Wr(){let e=$a();if(!e)return`
    <section class="panel">
      <h2>Respaldo autom\xE1tico en GitHub <span class="sufijo">\u2014 una copia al d\xEDa, privada</span></h2>
      <p class="nota">Cada d\xEDa, al abrir el programa, sube una copia de tus datos a tu repositorio privado. GitHub
        guarda todas las versiones: puedes volver a la de cualquier d\xEDa. La llave se queda solo en este aparato.</p>
      <div class="campos">
        <div class="campo"><label for="resp-repo">Repositorio (usuario/nombre)</label>
          <input id="resp-repo" class="ancho" value="isaacmtx45-dot/mi-dinero-respaldo" autocomplete="off" /></div>
        <div class="campo"><label for="resp-token">Llave de GitHub</label>
          <input id="resp-token" type="password" class="ancho" placeholder="github_pat_\u2026" autocomplete="off" /></div>
      </div>
      <p><button class="primario" data-accion="respaldo-guardar">Guardar y respaldar ahora</button></p>
    </section>`;let a=e.ultimo?new Date(`${e.ultimo}T12:00:00`).toLocaleDateString("es-CO",{day:"numeric",month:"long"}):null;return`
    <section class="panel">
      <h2>Respaldo autom\xE1tico en GitHub <span class="sufijo">\u2014 ${g(e.repo)}</span></h2>
      ${e.error?`<p class="nota aviso">\u26A0\uFE0F El \xFAltimo respaldo fall\xF3: ${g(e.error)}.</p>`:`<p class="nota">${a?`\u2713 \xDAltimo respaldo: <strong>${g(a)}</strong>.`:"Todav\xEDa no ha salido ning\xFAn respaldo."}
            Se hace solo, una vez al d\xEDa, al abrir el programa.</p>`}
      <p class="botones-nube">
        <button class="primario" data-accion="respaldo-ahora" ${Be?"disabled":""}>${Be?"Respaldando\u2026":"Respaldar ahora"}</button>
        <button class="chico-linea" data-accion="respaldo-quitar">Quitar el respaldo de este aparato</button>
      </p>
      <p class="rango">La llave est\xE1 guardada en este aparato y no se vuelve a mostrar. Si vence, pega una nueva quitando y
        volviendo a poner el respaldo.</p>
    </section>`}async function Oo(){let e=$a();if(!e||Be)return;Be=!0,Qe();let a=P();try{await an(e,oo(l),a),ze({...e,ultimo:a,error:void 0})}catch(o){let t=o instanceof TypeError?"no hay conexi\xF3n con GitHub; se intenta otra vez al abrir":o.message;ze({...e,error:t})}Be=!1,Qe()}function Kr(){let e=la(),a=ua();if(!e)return`
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
    </section>`;let o=U.length===0?"":`
    <div class="aviso-descartes">
      <strong>${U.length} ${U.length===1?"dato distinto":"datos distintos"} entre los dos aparatos.</strong>
      Se qued\xF3 el m\xE1s reciente. Aqu\xED est\xE1n los dos, para que compares:
      <table><thead><tr>
        <th>Qu\xE9</th><th>Lo que hab\xEDa en el otro aparato</th><th>Lo que qued\xF3</th><th></th>
      </tr></thead><tbody>
        ${U.map((t,n)=>`<tr>
          <td><strong>${g(_e(t.campo))}</strong>
            <span class="rango">de ${g(ga(t,l))}</span></td>
          <td class="descartado">${g(Le(t.campo,t.valor,Ca))}</td>
          <td class="completa">${g(Le(t.campo,t.gano,Ca))}</td>
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
      <p class="nota">Nada se escribe sin que veas antes qu\xE9 cambia y elijas.</p>
      <p class="botones-nube">
        <button class="primario" data-accion="nube-preparar" data-modo="subir" ${z||_?"disabled":""}>
          \u2B06 Subir mi versi\xF3n</button>
        <button class="primario" data-accion="nube-preparar" data-modo="traer" ${z||_?"disabled":""}>
          \u2B07 Traer la \xFAltima versi\xF3n</button>
        <button class="chico-linea" data-accion="nube-salir">Salir de la cuenta</button>
      </p>
      <p class="rango">\xABSubir\xBB deja la nube como este aparato; \xABTraer\xBB deja este aparato como la nube.
        ${z&&!_?"<b>Comparando con la nube\u2026</b>":""}</p>
      ${o}
    </section>`}function Zr(e){let a=new Date,o=a.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),t=ea(xe(l.cuentas,l.ingresos)),n=wa(),s=n.monto>0?Io(2,n.monto):0,r=Jn(e),i=r.length>0?Ya(r).guardadoDeVerdad:0,c=q(),d=vn(l.metas,e?.metas??[]),u=d?.pagoFin!=null?Se(L(d.pagoFin,c)):null,p=l.soportesMarcados[Fe(a)]??[],m=ao(a,p),v=de(),x=v.filter(A=>p.includes(A.id)).length,S=m.diasQueFaltan,h=(A,he,De,Xe,Me,Ee)=>`
    <div class="cifra tono-${A}">
      <div class="cifra-cab"><span class="cifra-chip">${he}</span>${De}</div>
      <div class="cifra-nombre">${Xe}</div>
      <div class="cifra-valor">${Me}</div>
      <div class="cifra-detalle">${Ee}</div>
    </div>`,$='<span class="etiqueta real">Real</span>',R='<span class="etiqueta simulacion">Simulaci\xF3n</span>',C=V(l.metas,l.repartos),k=new Map((e?.metas??[]).map(A=>[A.metaId,A])),N=A=>Ea(A,C.get(A.id)?.total??0)>=1,w=l.metas.filter(A=>!N(A)),ne=l.metas.length-w.length,cs=[...w,...l.metas.filter(N)].map(A=>{let he=k.get(A.id),De=C.get(A.id)?.total??0,Xe=Ea(A,De),Me=Xe>=1,Ee=!A.compra&&!Me&&he?.pagoFin!=null?L(he.pagoFin,c):null,Ho=A.compra?"ya la compraste":Me?"\u2713 lista":Ee?Se(Ee):"sin fecha todav\xEDa",ls=Ee?`<span class="fecha-larga-meta">${g(Ho)}</span><span class="fecha-corta-meta">${g(re(Ee))}</span>`:g(Ho);return`<li class="inicio-meta ${A.clase==="deuda"?"es-deuda":""} ${Me?"lista":""}">
      <div class="inicio-meta-texto">
        <div class="inicio-meta-nombre">${g(A.nombre.trim()||"(sin nombre)")}
          ${A.clase==="deuda"?'<span class="marca-deuda">Ya la debo</span>':""}</div>
        <div class="rango">${f(De)} de ${f(A.valor)}</div>
        <div class="barra-progreso"><i style="width:${Math.round(Xe*100)}%"></i></div>
      </div>
      <div class="inicio-meta-der"><strong>${f(A.valor)}</strong>
        <span class="${Me?"completa":"cuando"}">${ls}</span></div>
    </li>`}).join("");return`
  <section class="inicio">
    <div class="saludo">
      <h1>\xA1Hola!</h1>
      <p>As\xED va tu plata \xB7 <span class="fecha-larga">${g(o)}</span></p>
    </div>

    <div class="aviso-radicar ${Qn[m.urgencia]}">
      <div class="aviso-radicar-texto">
        ${$} <strong>${g(m.titular)}</strong>
        <div class="rango">${x} de ${v.length} soportes listos \xB7 la lista est\xE1 abajo</div>
        <div class="barra-progreso real"><i style="width:${v.length?Math.round(x/v.length*100):0}%"></i></div>
      </div>
      <div class="aviso-radicar-dias"><strong>${Math.abs(S)}</strong>
        <span>${S<0?Math.abs(S)===1?"d\xEDa tarde":"d\xEDas tarde":S===1?"d\xEDa":"d\xEDas"}</span></div>
    </div>
    ${Yn()}
    ${Lr()}

    <div class="cifras">
      ${h("real","\u{1F4B5}",$,"Te deben",t>0?f(t):"$0",t>0?"de cuentas de cobro sin pagar completas":"no tienes cuentas pendientes")}
      ${h("turquesa","\u{1F45B}","","Libre para metas, por pago",n.monto>0?f(n.monto-s):"\u2014",n.monto>0?`de ${f(n.monto)} \xB7 se van ${f(s)}`:"pon cu\xE1nto esperas por pago en Ajustes")}
      ${h("simulado","\u{1F3C1}",R,d?`Pr\xF3xima meta \xB7 ${g(d.meta.nombre.trim()||"(sin nombre)")}`:"Pr\xF3xima meta",d?u?g(u.replace(/^entre /,"").split(" y ")[0]):"Sin fecha":"\u2014",d?u?u.startsWith("entre ")?g(u):"seg\xFAn la proyecci\xF3n":"la proyecci\xF3n no alcanza a terminarla":"no hay metas pendientes")}
      ${h("morado","\u{1F437}","","Llevas guardado",f(i),"lo que ha quedado de verdad en el ahorro")}
    </div>
    ${ei(C)}

    <div class="inicio-doble">
    <div class="panel inicio-metas">
      <h2>Mis metas ${R}
        <button class="enlace" data-accion="seccion" data-seccion="metas">Ver todas \u2192</button></h2>
      ${l.metas.length===0?`<div class="vacio">Todav\xEDa no has puesto ninguna meta.
            <p><button class="primario" data-accion="seccion" data-seccion="metas">Ir a Metas</button></p></div>`:`<p class="rango">${w.length} por pagar${ne>0?` \xB7 ${ne} ya ${ne===1?"lista":"listas"}`:""}${(()=>{let A=bo(l.metas,new Map([...C].map(([he,De])=>[he,De.total])));return A.deudas.cuantas===0?"":`<br /><span class="es-deuda-texto">Debes ${f(Math.max(0,A.deudas.valor-A.deudas.pagado))}</span>
               \xB7 por comprar ${f(Math.max(0,A.compras.valor-A.compras.pagado))}`})()}</p>
           ${Un()}
           <ul class="inicio-lista">${cs}</ul>`}
    </div>
    ${oi(r)}
    </div>
    ${ni(e,r,C)}
  </section>`}function ei(e){let a=l.metas.find(s=>s.clase==="reserva");if(!a)return"";let o=Ue(Te(a,l.obligaciones,fe())),t=e.get(a.id)?.total??0,n=Ao(t,o);return`<div class="aviso-radicar reserva-inicio">
    <div class="aviso-radicar-texto">
      <span class="etiqueta real">Real</span> <strong>\u{1F6DF} Tu reserva para meses sin pago</strong>
      <div class="rango">${f(t)} de ${f(a.valor)} \xB7 lo fijo de un mes: ${f(o)}</div>
      <div class="barra-progreso real"><i style="width:${a.valor>0?Math.min(100,Math.round(t/a.valor*100)):0}%"></i></div>
    </div>
    <div class="aviso-radicar-dias"><strong>${n===null?"\u2014":Po(n).split(" ")[0]}</strong>
      <span>${n===1?"mes cubierto":"meses cubiertos"}</span></div>
  </div>`}var xa=null,An=["#f472b6","#a78bfa","#2dd4bf","#fb923c","#e879f9","#4ade80","#f87171","#c4b5fd","#5eead4","#fda4af","#bef264","#fdba74"],ai={ahorro:"#94a3b8","sin-asignar":"rgba(255,255,255,.22)"},Pn={obligacion:"obligaci\xF3n",meta:"meta",gasto:"gasto suelto",ahorro:"","sin-asignar":""};function oi(e){let a=e.filter(p=>p.real||p.simulado).map(p=>p.mes);if(a.length===0)return"";let o=xa&&a.includes(xa)?xa:Dn(e),t=a.indexOf(o),n=hn(e.find(p=>p.mes===o),new Set(l.metas.map(p=>p.id)),l.obligaciones),s=52,r=2*Math.PI*s,i=0,c=(n?.trozos??[]).map(p=>ai[p.tipo]??An[i++%An.length]),d=$n((n?.trozos??[]).map(p=>p.monto),s),u=(p,m,v)=>a[p]?`<button class="icono" data-accion="dona-mes" data-mes="${a[p]}" title="${v}">${m}</button>`:`<button class="icono" disabled>${m}</button>`;return`
  <div class="panel inicio-dona">
    <h2>En qu\xE9 se va el mes
      ${n?n.esReal?'<span class="etiqueta real">Real</span>':'<span class="etiqueta simulacion">Simulaci\xF3n</span>':""}</h2>
    <div class="dona-meses">
      ${u(t-1,"\u25C0","Mes anterior")}
      ${kn(`<select class="lista-meses" tabindex="-1" data-accion="dona-mes" data-titulo="Qu\xE9 mes ver">
        ${a.map(p=>`<option value="${p}" data-anio="${p.slice(0,4)}" data-mes="${H(p)}"
            data-corto="${H(p)} ${p.slice(0,4)}" ${p===o?"selected":""}>${g(j(p))}</option>`).join("")}
      </select>`,j(o),`${H(o)} ${o.slice(0,4)}`)}
      ${u(t+1,"\u25B6","Mes siguiente")}
    </div>
    <p class="rango">${n?n.esReal?"Lo que pas\xF3 de verdad ese mes":"Lo que se piensa gastar, seg\xFAn la proyecci\xF3n":"Ese mes no tiene nada repartido."}</p>
    ${n?`<div class="dona">
      <svg viewBox="0 0 140 140" role="img" aria-label="Reparto de ${f(n.total)} en ${g(j(o))}">
        <circle cx="70" cy="70" r="${s}" class="dona-fondo" />
        <g transform="rotate(-90 70 70)">
          ${n.trozos.map((p,m)=>d[m].largo>0?`<circle cx="70" cy="70" r="${s}" style="stroke:${c[m]}"
                 stroke-dasharray="${d[m].largo.toFixed(2)} ${r.toFixed(2)}"
                 stroke-dashoffset="${(-d[m].desde).toFixed(2)}" />`:"").join("")}
        </g>
        <text x="70" y="68" class="dona-total">${f(n.total)}</text>
        <text x="70" y="86" class="dona-rotulo">${n.esReal?"entr\xF3":"se espera"}</text>
      </svg>
      <ul>
        ${n.trozos.map((p,m)=>`<li><i style="background:${c[m]}"></i>
          <span>${g(p.nombre)}${Pn[p.tipo]?` <em class="tipo-trozo">${Pn[p.tipo]}</em>`:""}</span>
          <strong>${f(p.monto)}</strong></li>`).join("")}
      </ul>
    </div>`:""}
    <p><button class="primario" data-accion="seccion" data-seccion="registrar">+ Registrar un pago</button></p>
  </div>`}var ti={lista:"\u2713 lista",comprada:"ya la compraste","en-curso":"","no-alcanza":"no alcanza a terminar","sin-fecha":"sin fecha todav\xEDa"};function ni(e,a,o){if(l.metas.length===0)return"";let t=q(),n=h=>Fe(L(Math.max(1,h),t).optimista),s=Mn(l.metas,e?.metas??[],new Map([...o].map(([h,$])=>[h,$.total])),a,n),r=P().slice(0,7),i=s.flatMap(h=>[h.desde,h.hasta]).filter(h=>!!h),c=[r,...i].reduce((h,$)=>$<h?$:h),d=e?.pagos.length?n(e.pagos[e.pagos.length-1].numero):r,u=[r,d,...i].reduce((h,$)=>$>h?$:h),p=En(c,u),m=h=>p.indexOf(h)+2,v=p.map((h,$)=>`<div class="lt-mes ${h===r?"hoy":""}" style="grid-column:${$+2};grid-row:1">
      ${H(h)}${$===0||h.endsWith("-01")?`<b>${h.slice(0,4)}</b>`:""}</div>`).join(""),x=s.map((h,$)=>{let R=$+2,C=h.desde??h.hasta,k=h.estado==="no-alcanza"?u:h.hasta??h.desde,N=h.estado==="en-curso"&&h.desde&&h.hasta?`${H(h.desde)} ${h.desde.slice(0,4)} \u2192 ${H(h.hasta)} ${h.hasta.slice(0,4)}`:h.estado==="lista"&&h.hasta?`\u2713 lista \xB7 ${H(h.hasta)} ${h.hasta.slice(0,4)}`:ti[h.estado],w=C&&k&&p.includes(C)&&p.includes(k)?`<i class="lt-barra ${h.estado} ${h.esDeuda?"es-deuda":""}" style="grid-column:${m(C)} / ${m(k)+1};grid-row:${R}"
           title="${g(h.nombre)}: ${g(N)}"></i>`:"";return`<div class="lt-nombre ${h.estado}" style="grid-row:${R}"><strong>${g(h.nombre)}</strong>
        <span class="rango">${g(N)}</span></div>
      <div class="lt-carril" style="grid-column:2 / ${p.length+2};grid-row:${R}"></div>
      ${w}`}).join(""),S=p.includes(r)?`<div class="lt-hoy" style="grid-column:${m(r)};grid-row:1 / ${s.length+2}"></div>`:"";return`
  <div class="panel inicio-tiempo">
    <h2>Cu\xE1ndo termino cada meta <span class="etiqueta simulacion">Simulaci\xF3n</span></h2>
    <p class="rango">De cuando empezaste a pagarla a cuando queda saldada. La columna marcada es este mes.</p>
    <div class="lt-marco"><div class="lt" style="--meses:${p.length}">
      ${S}${v}${x}
    </div></div>
  </div>`}function ja(){let e=jo();return _n=e?.totalPagos??0,[["inicio",Zr(e)],["radicacion",Pr()],["vista",Nr(e)],["escenario",ur()],["metas",Cr(e)],["proyeccion",Ir(e)],["obligaciones",hr()],["cuentas",Tr()],["real",Or()],["nube",Kr()],["respaldo",Wr()],["calendario",Yr()],["dolar",Xr()],["tema",Jr()]]}function Kn(e){if(typeof e.querySelectorAll=="function")for(let a of Array.from(e.querySelectorAll("table"))){let o=Array.from(a.querySelectorAll("thead th")).map(t=>(t.textContent??"").trim());if(Et(o)){a.classList.add("como-tarjetas");for(let t of Array.from(a.querySelectorAll("tbody tr"))){let n=Array.from(t.children),s=n.map(i=>Number(i.getAttribute("colspan")??1)||1),r=Mt(o,s,n.map(i=>i.dataset.etiquetaFila));n.forEach((i,c)=>{let d=r[c];d?i.dataset.etiqueta=d:delete i.dataset.etiqueta})}}}}function Fo(e,a){e.innerHTML=a,Kn(e),_o()}function Zn(){return document.activeElement?.closest?.("[data-panel]")?.dataset.panel??null}function Qe(e=Zn()){let a=new Set([e,wo].filter(Boolean));for(let[o,t]of ja()){if(a.has(o))continue;let n=document.getElementById(`panel-${o}`);n&&Fo(n,t)}_o(),Je(),es()}function es(){let e=document.getElementById("mensaje");e&&(e.innerHTML=M?`<div class="mensaje ${M.malo?"malo":"bueno"}">${g(M.texto)}</div>`:"",M=null)}var si="gestiondinerotrabajo.seccion",as=fa(null);try{localStorage.removeItem(si)}catch{}function ri(){return as}function ii(e){as=fa(e)}function ci(e){return`<nav class="barra-secciones">
    ${ke.map(a=>`<button data-accion="seccion" data-seccion="${a.id}"
      class="${a.id===e?"activa":""}" aria-current="${a.id===e?"page":"false"}">
      <span class="icono-seccion">${a.icono}</span>${g(a.rotulo)}</button>`).join("")}
  </nav>`}function li(e){let a=la(),o=ua(),t=o?new Date(o).toLocaleString("es-CO",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):null;return`<aside class="lateral">
    <div class="marca"><span class="logo">$</span>
      <div><strong>Mi dinero</strong><span>Metas con ingreso variable</span></div></div>
    <nav class="nav-lateral">
      ${ke.map(n=>`<button data-accion="seccion" data-seccion="${n.id}"
        class="${n.id===e?"activa":""}" aria-current="${n.id===e?"page":"false"}">
        <span class="icono-seccion">${n.icono}</span><span class="rotulo-seccion">${g(n.rotulo)}</span></button>`).join("")}
    </nav>
    <div class="lateral-pie">
      <div class="estado-nube ${a?"conectada":""}"><span class="punto"></span>
        <div><strong>${a?"Sincronizado":"Solo en este aparato"}</strong>
          <span>${a?t?`\xFAltima vez ${g(t)}`:"todav\xEDa sin sincronizar":"la nube est\xE1 en Ajustes"}</span></div></div>
      <button class="chico-linea" data-accion="exportar">Exportar respaldo</button>
      <button class="chico-linea" data-accion="importar">Importar respaldo</button>
    </div>
  </aside>`}function y(){let e=document.getElementById("app"),a=Tn(document.activeElement),o=document.activeElement,t=o&&typeof o.selectionStart=="number"?o.selectionStart:null,n=window.scrollY,s=ri();e.className=`seccion-${s}`,e.innerHTML=`
    ${li(s)}
    <header class="cabecera">
      <h1>Gesti\xF3n del dinero del trabajo</h1>
      <div class="acciones">
        <button data-accion="exportar">Exportar respaldo</button>
        <button data-accion="importar">Importar respaldo</button>
      </div>
    </header>
    <div id="mensaje"></div>
    ${ja().map(([r,i])=>`<div id="panel-${r}" data-panel="${r}"
         data-seccion="${Ut(r)??""}">${i}</div>`).join("")}
    <input type="file" id="archivo" accept="application/json" hidden />
    ${ci(s)}
    <div id="ventana-nube">${Qr()}</div>`,Kn(e),_o(),Je(),es(),pi(),window.scrollTo({top:n,behavior:"instant"}),dr(a,t)}function os(e){let a=Math.round(Number(e));if(!(!Number.isFinite(a)||a<=1))return a}b.set("escenario",e=>{let a=e.dataset.campo,o=e,t=o.value;if(l.escenario[a]=o.type==="date"?t:o.hasAttribute("data-dinero")?F(t):Number(t),a==="diasOptimista"||a==="diasPesimista"){let n=Math.round(Number(t));l.escenario[a]=Number.isFinite(n)&&n>0?n:1}Y()});async function ts(e,a){let o=await O({titulo:a,detalle:"Lo que quieras recordar. Enter hace un salto de l\xEDnea; Ctrl+Enter guarda.",valorInicial:e.nota??"",textoAceptar:"Guardar",largo:!0});o!==null&&(o.trim()?e.nota=o.trim():delete e.nota,E())}b.set("esperar-meta",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&(a.puedeEsperar=a.puedeEsperar?void 0:!0,a.puedeEsperar&&a.fechaFija&&(a.fechaFija=void 0,M={texto:`${a.nombre} ahora puede esperar, as\xED que le quit\xE9 la fecha fija (\u{1F4CC}): no puede hacer las dos cosas.`,malo:!1}),E())});b.set("fecha-fija-meta",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);!a||!a.antesDelPago||(a.fechaFija=a.fechaFija?void 0:!0,a.fechaFija&&a.puedeEsperar&&(a.puedeEsperar=void 0,M={texto:`${a.nombre} tiene ahora fecha fija, as\xED que le quit\xE9 \xABpuede esperar\xBB (\u23F3): no puede hacer las dos cosas.`,malo:!1}),E())});b.set("nota-meta",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&ts(a,`Nota de \xAB${a.nombre}\xBB`)});b.set("nota-oblig",e=>{let a=l.obligaciones.find(o=>o.id===e.dataset.id);a&&ts(a,`Nota de \xAB${a.nombre}\xBB`)});b.set("nota-mes",async e=>{let a=e.dataset.mes,o=l.notasDelMes??={},t=await O({titulo:`Nota de ${j(a)}`,detalle:"Lo que quieras recordar de este mes. Enter hace un salto de l\xEDnea; Ctrl+Enter guarda.",valorInicial:o[a]??"",textoAceptar:"Guardar",largo:!0});t!==null&&(t.trim()?o[a]=t.trim():delete o[a],E())});b.set("link-meta",async e=>{let a=l.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=await O({titulo:`Enlace de \xAB${a.nombre}\xBB`,detalle:"Pega la direcci\xF3n de la p\xE1gina donde la vas a comprar. D\xE9jalo vac\xEDo para quitarlo.",valorInicial:a.link??"",textoAceptar:"Guardar"});if(o===null)return;if(!o.trim())return delete a.link,E();let t=ro(o);if(!t)return M={texto:"Esa direcci\xF3n no se entiende como p\xE1gina web. No cambi\xE9 el enlace.",malo:!0},y();a.link=t,E()});b.set("sobrante-a-metas",e=>{l.escenario.sobranteAMetas=e.checked,Y()});b.set("elastico",e=>{l.escenario.colchonElastico=e.checked,Y()});b.set("oblig",e=>{let a=l.obligaciones.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=a.tipo==="porcentaje"?Number(t)/100:F(t);else if(o==="tipo"){let n=t;n!==a.tipo&&(a.valor=n==="porcentaje"?.1:1e5),a.tipo=n}else o==="modo"?(a.modo=t,a.modo==="puntual"&&!a.supuesto&&(a.supuesto="siempre")):o==="grupo"?a.grupo=t.trim()||void 0:o==="desdePago"?a.desdePago=os(t):o==="supuesto"?a.supuesto=t:a.nombre=t;Y()});b.set("nuevo-cambio",e=>{let a=l.obligaciones.find(t=>t.id===e.dataset.id);if(!a)return;let o=Math.max(1,...(a.cambios??[]).map(t=>t.desdePago));a.cambios=[...a.cambios??[],{desdePago:o+1,valor:a.valor}],E()});b.set("cambio",e=>{let a=l.obligaciones.find(n=>n.id===e.dataset.id),o=a?.cambios?.[Number(e.dataset.i)];if(!a||!o)return;let t=e.value;if(e.dataset.campo==="desdePago"){let n=Math.round(Number(t));o.desdePago=Number.isFinite(n)&&n>0?n:1}else o.valor=a.tipo==="porcentaje"?Number(t)/100:F(t);Y()});b.set("borrar-cambio",e=>{let a=l.obligaciones.find(t=>t.id===e.dataset.id);if(!a?.cambios)return;let o=Number(e.dataset.i);a.cambios=a.cambios.filter((t,n)=>n!==o),E()});function No(e){return e==="ingreso"?"cambiosIngreso":"cambiosColchon"}b.set("nuevo-cambio-escenario",e=>{let a=No(e.dataset.cual),o=l.escenario[a]??[],t=Math.max(1,...o.map(s=>s.desdePago)),n=a==="cambiosIngreso"?l.escenario.ingresoEsperado:l.escenario.colchonBase;l.escenario[a]=[...o,{desdePago:t+1,valor:n}],E()});b.set("cambio-escenario",e=>{let a=l.escenario[No(e.dataset.cual)]?.[Number(e.dataset.i)];if(!a)return;let o=e.value;if(e.dataset.campo==="desdePago"){let t=Math.round(Number(o));a.desdePago=Number.isFinite(t)&&t>0?t:1}else a.valor=F(o);Y()});b.set("borrar-cambio-escenario",e=>{let a=Number(e.dataset.i),o=No(e.dataset.cual);l.escenario[o]=(l.escenario[o]??[]).filter((t,n)=>n!==a),E()});b.set("nueva-oblig",()=>{let e=X("ob");La=e,ve.add(e),l.obligaciones.push({id:e,nombre:"Nueva obligaci\xF3n",tipo:"fijo",valor:1e5,modo:"cada_pago"}),E()});b.set("borrar-oblig",e=>{l.obligaciones=l.obligaciones.filter(a=>a.id!==e.dataset.id),E()});b.set("meta",e=>{let a=l.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor"){let n=F(t);n!==a.valor&&n>0&&(a.precioRevisado=P()),a.valor=n}else if(o==="precioUSD"){let n=xo(t);n!==a.precioUSD&&n>0&&(a.precioRevisado=P()),a.precioUSD=n>0?n:void 0;let s=l.escenario.tasaDolar;s&&(a.valor=Ve(a.precioUSD??0,s));let r=e.parentElement?.querySelector(".en-pesos");r&&(r.textContent=s&&a.precioUSD?`= $${T(a.valor)}`:"\u26A0\uFE0F falta la tasa del d\xF3lar")}else if(o==="abonado")a.abonado=F(t);else if(o==="desdePago")a.desdePago=os(t);else if(o==="maximoPorPago"){let n=F(t);a.maximoPorPago=n>0?n:void 0}else if(o==="enCuotas"){let n=Math.round(Number(t));a.enCuotas=Number.isFinite(n)&&n>0?n:void 0}else if(o==="antesDelPago"){let n=Math.round(Number(t));a.antesDelPago=Number.isFinite(n)&&n>0?n:void 0,a.antesDelPago||(a.fechaFija=void 0)}else if(o==="grupo")a.grupo=t.trim()||void 0;else if(o==="clase"){a.clase=t==="deuda"?"deuda":void 0,E();return}else a.nombre=t;Y()});var ve=new Set;function _o(){for(let e of ve){document.querySelector(`tr[data-id-fila="${CSS.escape(e)}"]`)?.classList.add("abierta");for(let o of document.querySelectorAll(`[data-hija-de="${CSS.escape(e)}"]`))o.classList.add("abierta")}}var K=null;function di(e){let a=L(e,q()),[o,t]=[B(a.optimista),B(a.pesimista)];return o===t?`en ${o}`:`entre ${o} y ${t}`}function Je(){for(let s of document.querySelectorAll("tr.comentario-orden"))s.remove();if(!K||I)return;let e=l.metas.findIndex(s=>s.id===K);if(e<=0)return;let a=document.querySelector(`#panel-metas tr[data-id-fila="${CSS.escape(K)}"]`);if(!a)return;let o=Xt(K,qn(e,0,jo()),di);if(!o)return;let t=document.createElement("tr");t.className=`comentario-orden${a.classList.contains("abierta")?" abierta":""}`,t.dataset.hijaDe=K;let n=document.createElement("td");n.colSpan=a.children.length,n.textContent=`\u{1F4A1} ${o}`,t.appendChild(n),a.after(t)}function Pa(e){e===K&&document.querySelector("tr.comentario-orden")||(K=e,Je())}function ui(e){let a=e.classList.toggle("abierta"),o=e.dataset.idFila;if(o){a?ve.add(o):ve.delete(o);for(let t of document.querySelectorAll(`[data-hija-de="${CSS.escape(o)}"]`))t.classList.toggle("abierta",a);e.closest("#panel-metas")&&(a?Pa(o):K===o&&Pa(null))}}function ns(e,a){let o=document.getElementById(`panel-${e==="metas"?"metas":"obligaciones"}`);if(o){for(let t of o.querySelectorAll("tr[data-resumen]")){t.classList.toggle("abierta",a);let n=t.dataset.idFila;n&&(a?ve.add(n):ve.delete(n))}for(let t of o.querySelectorAll("[data-hija-de]"))t.classList.toggle("abierta",a)}}b.set("desplegar-todo",e=>ns(e.dataset.lista,!0));b.set("plegar-todo",e=>ns(e.dataset.lista,!1));b.set("seccion",e=>{let a=fa(e.dataset.seccion);ii(a);let o=document.getElementById("app");o&&(o.className=`seccion-${a}`);for(let t of document.querySelectorAll(".barra-secciones button, .nav-lateral button")){let n=t.dataset.seccion===a;t.classList.toggle("activa",n),t.setAttribute("aria-current",n?"page":"false")}window.scrollTo({top:0,behavior:"instant"})});b.set("nueva-meta",()=>{let e=X("meta");La=e,ve.add(e),l.metas.push({id:e,nombre:"",valor:0}),E(),document.querySelector(`input[data-id="${e}"][data-campo="nombre"]`)?.focus()});b.set("nueva-reserva",()=>{if(l.metas.some(o=>o.clase==="reserva"))return;let e=X("meta");l.metas.push({id:e,nombre:"Reserva para meses sin pago",valor:0,clase:"reserva",reservaMeses:1}),Ma(l.metas,l.obligaciones,fe());let a=l.metas.find(o=>o.id===e);M={texto:`Lista: tu reserva es lo fijo de un mes, ${f(a.valor)}. Qued\xF3 de \xFAltima en tu lista: s\xFAbela hasta donde quieras que se llene. Abajo puedes sumarle otra cosa por si acaso.`,malo:!1},E()});b.set("reserva-meses",e=>{let a=l.metas.find(t=>t.id===e.dataset.id&&t.clase==="reserva");if(!a)return;let o=Math.round(Number(e.value));a.reservaMeses=Number.isFinite(o)&&o>=1?Math.min(o,12):1,E()});b.set("reserva-extra",async e=>{let a=l.metas.find(s=>s.id===e.dataset.id&&s.clase==="reserva");if(!a)return;let o=await O({titulo:"\xBFQu\xE9 m\xE1s quieres tener cubierto?",detalle:"Algo que pagas cada mes aunque no sea una obligaci\xF3n del programa: mercado, transporte, arriendo\u2026",valorInicial:"",textoAceptar:"Siguiente"});if(o===null||!o.trim())return;let t=await O({titulo:`\xBFCu\xE1nto es \xAB${o.trim()}\xBB al mes?`,valorInicial:"",dinero:!0,textoAceptar:"Agregar"});if(t===null)return;let n=F(t);if(!Number.isFinite(n)||n<=0)return M={texto:"Ese monto no se entiende. No agregu\xE9 nada.",malo:!0},y();(a.reservaExtras??=[]).push({nombre:o.trim(),monto:D(n)}),E()});b.set("reserva-usar",async e=>{let a=l.metas.find(d=>d.id===e.dataset.id&&d.clase==="reserva");if(!a)return;let o=V(l.metas,l.repartos).get(a.id)?.total??0,t=Ue(Te(a,l.obligaciones,fe())),n=await O({titulo:"\xBFCu\xE1nto sacaste de la reserva?",detalle:`Tiene ${f(o)}. Un mes de lo fijo son ${f(t)}.`,valorInicial:T(Math.min(o,t)||o),dinero:!0,textoAceptar:"Siguiente"});if(n===null)return;let s=F(n);if(!Number.isFinite(s)||s<=0)return M={texto:"Ese monto no se entiende. No anot\xE9 nada.",malo:!0},y();if(s>o)return M={texto:`La reserva solo tiene ${f(o)}: no puedes sacar ${f(s)}. No anot\xE9 nada.`,malo:!0},y();let r=P(),i=await O({titulo:`\xBFQu\xE9 d\xEDa sacaste esos ${f(s)}?`,valorInicial:r,fecha:{max:r},textoAceptar:"Siguiente"});if(i===null||!/^\d{4}-\d{2}-\d{2}$/.test(i)||i>r)return M={texto:"Cancelado: no anot\xE9 nada.",malo:!1},y();let c=await O({titulo:"\xBFEn qu\xE9 se fue? (opcional)",detalle:"Por ejemplo: la luz y el mercado de octubre.",valorInicial:"",textoAceptar:"Anotar"});if(c===null)return M={texto:"Cancelado: no anot\xE9 nada.",malo:!1},y();(a.reservaRetiros??=[]).push({fecha:i,monto:D(s),...c.trim()?{nota:c.trim()}:{}}),M={texto:`Anotado: usaste ${f(s)} de la reserva. Ahora le faltan ${f(a.valor-o+s)}, y el programa la vuelve a llenar en el sitio de tu lista donde est\xE1.`,malo:!1},E()});b.set("reserva-deshacer-uso",e=>{let a=l.metas.find(t=>t.id===e.dataset.id&&t.clase==="reserva"),o=Number(e.dataset.i);!a?.reservaRetiros||!(o>=0&&o<a.reservaRetiros.length)||(a.reservaRetiros.splice(o,1),a.reservaRetiros.length===0&&(a.reservaRetiros=void 0),E())});b.set("reserva-quitar",e=>{let a=l.metas.find(t=>t.id===e.dataset.id&&t.clase==="reserva"),o=Number(e.dataset.i);!a?.reservaExtras||!(o>=0&&o<a.reservaExtras.length)||(a.reservaExtras.splice(o,1),a.reservaExtras.length===0&&(a.reservaExtras=void 0),E())});b.set("plegar-meses",e=>{let a=e.dataset.abrir==="1";if(be.clear(),a)for(let t of document.querySelectorAll("[data-mes]"))be.add(t.dataset.mes);let o=document.getElementById("panel-vista");o&&Fo(o,ja().find(([t])=>t==="vista")[1])});b.set("ordenar",e=>{let a=e.dataset.por,o=(n,s)=>n.localeCompare(s,"es",{sensitivity:"base",numeric:!0}),t=(n,s)=>a==="valor"?s.valor-n.valor:a==="grupo"&&o(n.grupo??"\uFFFF",s.grupo??"\uFFFF")||o(n.nombre,s.nombre);e.dataset.lista==="metas"?(l.metas=[...l.metas].sort(t),M={texto:`Metas ordenadas por ${a}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron. Si no era lo que quer\xEDas, reord\xE9nalas con las flechas.`,malo:!1}):l.obligaciones=[...l.obligaciones].sort(t),E()});b.set("duplicar-meta",e=>{let a=l.metas.findIndex(n=>n.id===e.dataset.id);if(a<0)return;let o=l.metas[a],t={...o,id:X("meta"),nombre:`${o.nombre} (copia)`,abonado:0};delete t.compra,l.metas.splice(a+1,0,t),E()});b.set("borrar-meta",e=>{l.metas=l.metas.filter(a=>a.id!==e.dataset.id),E()});function ss(e,a){let o=e+a;if(o<0||o>=l.metas.length)return;let t=l.metas.slice();[t[e],t[o]]=[t[o],t[e]],l.metas=t,E()}b.set("subir",e=>ss(Number(e.dataset.i),-1));b.set("bajar",e=>ss(Number(e.dataset.i),1));b.set("nueva-cuenta",()=>{let e=new Date,a=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];l.cuentas.push({id:X("cta"),periodo:`${a[e.getMonth()]} de ${e.getFullYear()}`,montoEsperado:l.escenario.ingresoEsperado}),E()});function ko(e,a={}){let o=ta(e,l.escenario.fechaPrimerPago),t={id:X("cta"),periodo:j(e),montoEsperado:o?Hn(o):l.escenario.ingresoEsperado,...a};return l.cuentas.push(t),t}b.set("mes-pagado",async e=>{let a=e.dataset.mes;if(!a)return;let o=ko(a);await b.get("abonar")({dataset:{id:o.id}}),l.ingresos.some(t=>t.cuentaDeCobroId===o.id)||(l.cuentas=l.cuentas.filter(t=>t!==o),M={texto:`Cancelado: no registr\xE9 nada de ${o.periodo}.`,malo:!1},y())});b.set("mes-me-deben",async e=>{let a=e.dataset.mes;if(!a)return;let o=await O({titulo:`\xBFQu\xE9 d\xEDa radicaste la cuenta de ${j(a)}?`,detalle:"Sirve para avisarte si se demora m\xE1s de lo normal. Si no te acuerdas, d\xE9jalo vac\xEDo.",valorInicial:"",fecha:{max:P()},textoAceptar:"Guardar"});if(o===null)return;let t=ko(a,/^\d{4}-\d{2}-\d{2}$/.test(o)?{fechaRadicacion:o}:{});M={texto:`Listo: ${t.periodo} queda como \xABte deben ${f(t.montoEsperado)}\xBB. Cuando te paguen, reg\xEDstralo en su fila de \xABLo que te deben\xBB.`,malo:!1},E()});b.set("mes-sin-cuenta",e=>{let a=e.dataset.mes;if(!a)return;M={texto:`Anotado: en ${ko(a,{montoEsperado:0,noHubo:!0}).periodo} no hubo cuenta. Si te equivocaste, borra esa fila en \xABLo que te deben\xBB.`,malo:!1},E()});b.set("cuenta",e=>{let a=l.cuentas.find(t=>t.id===e.dataset.id);if(!a)return;let o=e.value;e.dataset.campo==="montoEsperado"?a.montoEsperado=F(o):e.dataset.campo==="fechaRadicacion"?a.fechaRadicacion=/^\d{4}-\d{2}-\d{2}$/.test(o)?o:void 0:e.dataset.campo==="periodo"&&(a.periodo=o),Y()});b.set("ingreso",e=>{let a=l.ingresos.find(t=>t.id===e.dataset.id);if(!a||e.dataset.campo!=="fecha")return;let o=za(e.value,P());if("error"in o)return e.value=a.fecha,M={texto:`${o.error} La dej\xE9 en ${a.fecha}.`,malo:!0},y();o.fecha!==a.fecha&&(a.fecha=o.fecha,E())});b.set("borrar-cuenta",e=>{l.cuentas=l.cuentas.filter(o=>o.id!==e.dataset.id);let a=new Set(l.ingresos.filter(o=>o.cuentaDeCobroId===e.dataset.id).map(o=>o.id));l.ingresos=l.ingresos.filter(o=>o.cuentaDeCobroId!==e.dataset.id),l.repartos=l.repartos.filter(o=>!a.has(o.ingresoId)),E()});b.set("abonar",async e=>{let a=l.cuentas.find(u=>u.id===e.dataset.id);if(!a)return;let o=xe([a],l.ingresos)[0],t=o.pendiente>0?o.pendiente:a.montoEsperado,n=await O({titulo:`\xBFCu\xE1nto te pagaron de ${a.periodo}?`,detalle:o.pendiente>0&&o.recibido>0?`Ya te hab\xEDan pagado ${f(o.recibido)}. Faltan ${f(o.pendiente)}.`:void 0,valorInicial:T(t),dinero:!0,textoAceptar:"Registrar pago"});if(n===null)return;let s=F(n);if(!Number.isFinite(s)||s<=0)return M={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},y();let r=P(),i=await O({titulo:`\xBFQu\xE9 d\xEDa te pagaron esos ${f(s)}?`,detalle:"El d\xEDa en que te entr\xF3 la plata. Si fue hoy, solo dale a Registrar.",valorInicial:r,fecha:{max:r},textoAceptar:"Registrar pago"});if(i===null)return M={texto:"Cancelado: no registr\xE9 el pago.",malo:!1},y();let c=za(i,r);if("error"in c)return M={texto:`${c.error} No registr\xE9 nada.`,malo:!0},y();let d={id:X("ing"),cuentaDeCobroId:a.id,fecha:c.fecha,monto:s};l.ingresos.push(d),l.repartos.push($e(d)),M={texto:"Registrado. Mira abajo en qu\xE9 se va ese dinero y corr\xEDgelo si no fue as\xED.",malo:!1},E()});b.set("comprada",async e=>{let a=l.metas.find(s=>s.id===e.dataset.id);if(!a)return;let o=await O({titulo:`\xBFPor cu\xE1nto compraste ${a.nombre}?`,detalle:`La ten\xEDas en ${f(a.valor)}. Pon lo que pagaste de verdad, aunque sea distinto.`,valorInicial:T(a.valor),dinero:!0,textoAceptar:"Siguiente"});if(o===null)return;let t=await O({titulo:"\xBFEn qu\xE9 mes la compraste?",detalle:"Escr\xEDbelo como AAAA-MM. Por ejemplo, 2026-08 para agosto de este a\xF1o.",valorInicial:P().slice(0,7),textoAceptar:"Guardar"});if(t===null)return;let n=/^\d{4}-\d{2}$/.test(t.trim())?t.trim():P().slice(0,7);a.compra={mes:n,precioReal:F(o)},E()});b.set("no-comprada",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&(delete a.compra,E())});b.set("proponer",e=>{let a=l.ingresos.find(o=>o.id===e.dataset.id);a&&(l.repartos=l.repartos.filter(o=>o.ingresoId!==a.id),l.repartos.push($e(a)),E())});b.set("confirmar-reparto",e=>{let a=l.repartos.find(o=>o.id===e.dataset.id);a&&(a.propuesto=!1,E())});b.set("editar-reparto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id);if(!a)return;let o=F(e.value),t=e.dataset.tipo,n=Number(e.dataset.i);t==="ahorro"?a.alAhorro=o:t==="obligaciones"&&a.obligaciones[n]?a.obligaciones[n].monto=o:t==="abonos"&&a.abonos[n]&&(a.abonos[n].monto=o),a.propuesto=!1,Y()});b.set("quitar-previo",e=>{let a=l.metas.find(t=>t.id===e.dataset.id);if(!a)return;let o=a.abonado??0;a.abonado=0,M={texto:`Quit\xE9 los ${f(o)} que estaban escritos a mano en ${a.nombre}. Ahora manda lo registrado en \xABen qu\xE9 se fue la plata\xBB, que es lo que de verdad pagaste.`,malo:!1},E()});b.set("gasto-a-abono",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.metas.find(s=>s.id===e.dataset.meta);if(!a||!o)return;let t=e.dataset.nombre,n=(a.gastos??[]).find(s=>s.nombre===t);n&&(a.gastos=a.gastos.filter(s=>s!==n),a.abonos.push({nombre:o.nombre,monto:n.monto,refId:o.id,movidoDesdeGasto:!0}),M={texto:`Listo: los ${f(n.monto)} de \xAB${n.nombre}\xBB ahora cuentan como abono a ${o.nombre}. El total del mes no cambi\xF3. Si te equivocaste, la l\xEDnea tiene un bot\xF3n \u21A9 para devolverla a gastos.`,malo:!1},E())});b.set("pasar-al-otro-mes",async e=>{let a=l.repartos.find(c=>c.id===e.dataset.id),o=a?.abonos[Number(e.dataset.i)],t=l.ingresos.find(c=>c.id===a?.ingresoId),n=l.metas.find(c=>c.id===o?.refId);if(!a||!o||!t||!n)return;let s=l.ingresos.filter(c=>c.fecha<=t.fecha&&c.id!==t.id),r=je(t,s,Ta)+1;if(n.fechaFija&&n.antesDelPago){let c=n.antesDelPago,d=x=>B(L(x,q()).optimista),u=V(l.metas,l.repartos.filter(x=>x!==a)).get(n.id)?.falta??n.valor,p=c-r+1,m=p<=0?`La quieres antes de ${d(c)}. Si la pasas a ${d(r)} llega tarde. Su fecha no se mueve: el aviso de fechas te dir\xE1 que no llega.`:p===1?`La quieres antes de ${d(c)}. Si la pasas a ${d(r)}, ese mes tendr\xEDa que recibir ${f(u)} de una vez.`:`La quieres antes de ${d(c)}. Si la pasas a ${d(r)}, le quedan ${p} meses: unos ${f(qe(u,p))} cada uno.`;if(!await $t({titulo:`${n.nombre} tiene fecha fija (\u{1F4CC}). \xBFLa pasas igual?`,detalle:m,textoAceptar:"S\xED, p\xE1sala",textoCancelar:"No, d\xE9jala"}))return M={texto:`No mov\xED ${n.nombre}: sigue en este pago.`,malo:!1},y()}n.desdePago=Math.max(n.desdePago??1,r),!n.fechaFija&&n.antesDelPago&&n.antesDelPago<n.desdePago&&(n.antesDelPago=n.desdePago);let i=B(L(n.desdePago,q()).optimista);if(a.propuesto)l.repartos=l.repartos.map(c=>c===a?$e(t):c),M={texto:`${n.nombre} queda para ${i}: este pago ya no le da nada y lo que le tocaba baj\xF3 a las metas de abajo. Revisa el reparto y dale a \xABAs\xED fue\xBB.`,malo:!1};else{let c=o.monto;o.monto=0,a.alAhorro+=c,M={texto:`${n.nombre} queda para ${i}. Los ${f(c)} que le hab\xEDas puesto pasaron a \xABQued\xF3 guardado\xBB: mu\xE9velos a lo que s\xED pagaste con este pago.`,malo:!1}}E()});b.set("abono-a-gasto",e=>{let a=l.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.abonos[o];!a||!t||(a.abonos=a.abonos.filter((n,s)=>s!==o),a.gastos=[...a.gastos??[],{nombre:t.nombre,monto:t.monto}],M={texto:`${t.nombre} volvi\xF3 a ser un gasto suelto.`,malo:!1},E())});b.set("nuevo-gasto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=we(a,o),n=t>0?t:Math.min(a.alAhorro,a.alAhorro);a.gastos=[...a.gastos??[],{nombre:"",monto:0}],n<=0&&(a.propuesto=!1),E()});b.set("editar-gasto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];if(!a||!t)return;let n=e.value;if(e.dataset.campo==="nombre")t.nombre=n;else{let s=F(n);a.alAhorro=Math.max(0,a.alAhorro-(s-t.monto)),t.monto=s}a.propuesto=!1,Y()});b.set("borrar-gasto",e=>{let a=l.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];!a||!t||(a.alAhorro+=t.monto,a.gastos=a.gastos.filter((n,s)=>s!==o),E())});b.set("recalcular",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=a.gastos??[],n=$e(o);n.gastos=t,n.alAhorro=Math.max(0,n.alAhorro-t.reduce((s,r)=>s+r.monto,0)),l.repartos=l.repartos.map(s=>s.id===a.id?n:s),M={texto:"Recalculado con las obligaciones de ahora.",malo:!1},E()});b.set("cuadrar",e=>{let a=l.repartos.find(t=>t.id===e.dataset.id),o=l.ingresos.find(t=>t.id===a?.ingresoId);!a||!o||(a.alAhorro=Math.max(0,a.alAhorro+we(a,o)),a.propuesto=!1,E())});b.set("aporte-externo",async e=>{let a=await O({titulo:"\xBFCu\xE1nto vas a meter de tu bolsillo?",detalle:"Plata tuya que no viene del trabajo: Nequi, efectivo, lo que tengas guardado por otro lado.",valorInicial:"0",dinero:!0,textoAceptar:"Meterlo"});if(a===null)return;let o=F(a);if(o<=0)return M={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},y();let t=await O({titulo:"\xBFDe d\xF3nde sali\xF3?",detalle:"Para que dentro de unos meses sepas qu\xE9 fue esto.",valorInicial:"Nequi",textoAceptar:"Guardar"}),n={id:X("ing"),fecha:P(),monto:o,nota:t?.trim()||"de otro lado"};l.ingresos.push(n),l.repartos.push($e(n)),E()});b.set("soporte",e=>{let a=Fe(new Date),o=new Set(l.soportesMarcados[a]??[]),t=e.dataset.id;e.checked?o.add(t):o.delete(t),l.soportesMarcados={...l.soportesMarcados,[a]:[...o]},Y()});b.set("borrar-ingreso",e=>{l.repartos=l.repartos.filter(a=>a.ingresoId!==e.dataset.id),l.ingresos=l.ingresos.filter(a=>a.id!==e.dataset.id),E()});var Ln="";async function pi(){let e=globalThis.__TAURI__;if(!e?.fs?.writeTextFile||!e?.path?.localDataDir)return;let a=JSON.stringify({version:1,entradas:Mo(new Date,l.cuentas,l.ingresos,l.soportesMarcados)});if(a!==Ln)try{let o=await e.path.localDataDir();await e.fs.writeTextFile(`${o.replace(/[\\/]+$/,"")}\\GestionDineroTrabajo-aviso-radicacion.json`,a),Ln=a}catch{}}function zo(){let e=globalThis.__TAURI__;return e?.dialog&&e?.fs?{dialog:e.dialog,fs:e.fs}:null}b.set("exportar",async()=>{let e=oo(l),a=`respaldo-dinero-${P()}.json`,o=zo();if(!o){let t=new Blob([e],{type:"application/json"}),n=document.createElement("a");return n.href=URL.createObjectURL(t),n.download=a,n.click(),URL.revokeObjectURL(n.href),M={texto:`Respaldo guardado en tu carpeta de descargas como ${a}.`,malo:!1},y()}try{let t=await o.dialog.save({title:"\xBFD\xF3nde guardo el respaldo?",defaultPath:a,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!t)return;await o.fs.writeTextFile(t,e),M={texto:`Respaldo guardado en ${t}`,malo:!1}}catch(t){M={texto:`No pude guardar el respaldo: ${String(t)}`,malo:!0}}y()});b.set("importar",async()=>{let e=zo();if(e)try{let o=await e.dialog.open({title:"\xBFQu\xE9 respaldo quieres cargar?",multiple:!1,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!o)return;let{estado:t,aviso:n}=to(await e.fs.readTextFile(o));return t?(l=t,M={texto:"Respaldo importado.",malo:!1},E()):(M={texto:n.texto,malo:!0},y())}catch(o){return M={texto:`No pude leer ese archivo: ${String(o)}`,malo:!0},y()}let a=document.getElementById("archivo");a.onchange=async()=>{let o=a.files?.[0];if(!o)return;let{estado:t,aviso:n}=to(await o.text());if(!t)return M={texto:n.texto,malo:!0},y();l=t,M={texto:"Respaldo importado.",malo:!1},E()},a.click()});document.addEventListener("input",e=>{let a=e.target;a instanceof HTMLInputElement&&(a.hasAttribute("data-dinero")&&Dt(a),a.type==="number"&&a.dataset.campo==="valor"&&(a.dataset.accion==="oblig"||a.dataset.accion==="cambio")&&gr(a))});document.addEventListener("focusout",e=>{let a=e.target?.closest?.("[data-panel]");if(!a||e.relatedTarget?.closest?.("[data-panel]")===a)return;let t=a.dataset.panel;setTimeout(()=>{if(Ye||Zn()===t)return;let n=ja().find(([r])=>r===t)?.[1],s=document.getElementById(`panel-${t}`);n!==void 0&&s&&(Fo(s,n),Je())},0)});document.addEventListener("toggle",e=>{let a=e.target,o=a?.dataset?.mes;o&&(a.open?be.add(o):be.delete(o))},!0);document.addEventListener("click",e=>{G&&e.target?.classList?.contains("cerrable")&&(G=null,y())});document.addEventListener("keydown",e=>{e.key==="Escape"&&G&&(G=null,y())});document.addEventListener("change",e=>{let a=e.target?.closest("[data-accion]");a&&b.get(a.dataset.accion)?.(a,e)});document.addEventListener("click",e=>{let a=e.target,o=a?.closest?.("a[data-enlace]"),t=globalThis.__TAURI__?.opener;if(o&&t?.openUrl){e.preventDefault(),t.openUrl(o.href).catch(()=>{M={texto:"No pude abrir el enlace en el navegador.",malo:!0},y()});return}let n=a?.closest?.("tr[data-resumen]");if(Ra){Ra=!1;return}let s=a?.closest?.("#panel-metas tr[data-id-fila]");if(s&&!window.matchMedia("(max-width: 620px)").matches&&Pa(s.dataset.idFila??null),n&&!a?.closest("input, select, textarea, button, a")&&window.matchMedia("(max-width: 620px)").matches){ui(n);return}let r=e.target?.closest("button[data-accion]");Ye=!1,r?(Ie=!1,b.get(r.dataset.accion)?.(r,e)):Ie&&(Ie=!1,Qe())});"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{rs(),navigator.serviceWorker.register("./sw.js").catch(()=>{})});async function rs(){if(document.getElementById("aviso-version"))return;let e;try{let o=await fetch("version.json",{cache:"no-store"});if(!o.ok)return;e=await o.json()}catch{return}if(!xn(e))return;let a=document.createElement("div");a.id="aviso-version",a.setAttribute("role","status"),a.innerHTML=`<span>Hay una versi\xF3n nueva de la app.</span>
    <button class="primario" type="button">Actualizar</button>`,a.querySelector("button").addEventListener("click",()=>location.reload()),document.body.append(a)}typeof location<"u"&&location.protocol.startsWith("http")&&document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&rs()});yo(Eo());var Sa=vt();l=Sa.estado;Sa.aviso&&(M={texto:Sa.aviso.texto,malo:Sa.aviso.grave});un(l.metas);Ro(l.metas,l.escenario.tasaDolar)>0&&ee(l);Ma(l.metas,l.obligaciones,fe())>0&&ee(l);function mi(){let e=new Set(l.repartos.map(o=>o.ingresoId)),a=l.ingresos.filter(o=>!e.has(o.id)).sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o of a)l.repartos.push($e(o));return a.length>0}mi()&&ee(l);y();en($a(),P())&&Oo();globalThis.__estado=()=>l;globalThis.__reiniciar=()=>{l=ue(),E()};b.set("nube-entrar",async()=>{let e=document.getElementById("nube-correo")?.value??"",a=document.getElementById("nube-clave")?.value??"";if(!e.trim()||!a)return M={texto:"Escribe tu correo y tu contrase\xF1a.",malo:!0},y();try{M={texto:`Entraste como ${(await It(e,a)).correo}. Ya puedes sincronizar.`,malo:!1}}catch(o){M={texto:o.message,malo:!0}}y()});b.set("nube-salir",()=>{lo(),te=null,U=[],M={texto:"Saliste de la cuenta. Tus datos siguen aqu\xED, intactos.",malo:!1},y()});b.set("nube-preparar",async e=>{if(z)return;let a=e.dataset.modo==="traer"?"traer":"subir";z=!0,y();try{let o=await Nt(),t=Pe(l),n=kt(t,o);n.length===0?(te=JSON.parse(JSON.stringify(l)),da(te),G={titulo:"Este aparato y la nube ya est\xE1n iguales",lineas:["No hab\xEDa nada que cambiar."],malo:!1}):_={modo:a,locales:t,remotas:o,difs:n,elecciones:po(n,a)}}catch(o){G={titulo:"No se pudo comparar con la nube",lineas:[o.message,"No se cambi\xF3 nada."],malo:!0}}z=!1,y()});b.set("abrir-meses",e=>Bt(e));b.set("respaldo-guardar",()=>{let e=document.getElementById("resp-repo")?.value.trim()??"",a=document.getElementById("resp-token")?.value.trim()??"";if(!/^[\w.-]+\/[\w.-]+$/.test(e)||!a)return M={texto:"Falta el repositorio (usuario/nombre) o la llave.",malo:!0},y();ze({repo:e,token:a}),y(),Oo()});b.set("calendario-descargar",async()=>{let e=nn(Mo(new Date,l.cuentas,l.ingresos,l.soportesMarcados),new Date),a="mi-dinero-radicar.ics",o=zo();if(!o){let t=document.createElement("a");return t.href=URL.createObjectURL(new Blob([e],{type:"text/calendar"})),t.download=a,t.click(),URL.revokeObjectURL(t.href),M={texto:`Listo: ${a}. Imp\xF3rtalo en Google Calendar (una sola vez).`,malo:!1},y()}try{let t=await o.dialog.save({defaultPath:a,filters:[{name:"Calendario",extensions:["ics"]}]});if(!t)return;await o.fs.writeTextFile(t,e),M={texto:"Calendario guardado. Imp\xF3rtalo en Google Calendar (una sola vez) y el tel\xE9fono te avisa.",malo:!1}}catch(t){M={texto:`No pude guardar el calendario: ${t.message}`,malo:!0}}y()});b.set("tema",e=>{let a=He(e.dataset.tema);rn(a),yo(a),y()});b.set("respaldo-ahora",()=>{Oo()});b.set("respaldo-quitar",()=>{ze(null),y()});b.set("si-me-entran",e=>{let a=F(e.value);ge=a>0?a:null,y()});b.set("si-me-entran-quitar",()=>{ge=null,y()});b.set("precio-sigue",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&(a.precioRevisado=P(),E())});function is(e,a){l.escenario.tasaDolar=e,l.escenario.tasaDolarDe=a;let o=Ro(l.metas,e);M={texto:o===0?`Tasa guardada: $${Da(e)} por d\xF3lar.`:`Tasa guardada: $${Da(e)} por d\xF3lar \xB7 ${o} ${o===1?"meta cambi\xF3":"metas cambiaron"} de precio.`,malo:!1},E()}b.set("tasa-dolar",e=>{let a=So(e.value);a>0&&is(a,P())});b.set("tasa-dolar-traer",()=>{Ge||(Ge=!0,y(),pn().then(e=>is(e.valor,e.de||P())).catch(e=>{M={texto:`No se pudo traer la tasa: ${e instanceof Error?e.message:String(e)} Puedes escribirla a mano.`,malo:!0},y()}).finally(()=>{Ge=!1,y()}))});b.set("meta-dolares",e=>{let a=l.metas.find(n=>n.id===e.dataset.id);if(!a)return;if(a.enDolares){a.enDolares=void 0,a.precioUSD=void 0,E();return}let o=n=>{a.enDolares=!0,a.precioUSD=cn(a.valor,n),E()},t=l.escenario.tasaDolar;if(t&&t>0){o(t);return}O({titulo:"\xBFA cu\xE1ntos pesos est\xE1 el d\xF3lar?",detalle:"Se usa para todas las metas en d\xF3lares. Despu\xE9s se cambia en Ajustes, y ah\xED hay un bot\xF3n que trae la tasa oficial del d\xEDa.",valorInicial:"",textoAceptar:"Guardar"}).then(n=>{if(n===null)return;let s=So(n);if(!(s>0)){M={texto:"Esa tasa no se entiende. Escribe solo el n\xFAmero, por ejemplo 3.209,78.",malo:!0},y();return}l.escenario.tasaDolar=s,l.escenario.tasaDolarDe=P(),o(s)})});b.set("dona-mes",e=>{xa=e instanceof HTMLSelectElement?e.value:e.dataset.mes??null,y()});b.set("nube-cerrar-ventana",()=>{G=null,y()});b.set("nube-elegir",e=>{if(!_)return;let a=e.dataset.lado==="nube"?"nube":"aqui";_.elecciones[e.dataset.clave]=a;let o=e.dataset.clave;for(let t of document.querySelectorAll(`input[type="radio"][name="${CSS.escape(o)}"]`))t.closest(".opcion")?.classList.toggle("elegida",t.checked)});b.set("nube-cancelar",()=>{_=null,G={titulo:"Cancelado",lineas:["No se cambi\xF3 nada, ni aqu\xED ni en la nube."],malo:!1},y()});b.set("nube-aplicar",async()=>{if(!(!_||z)){z=!0,y();try{let e=_,a=zt(e.locales,e.remotas,e.difs,e.elecciones,new Date().toISOString()),o=e.difs.map(t=>Ur(t,e.elecciones[t.clave]??"aqui"));await _t(a),l=ra(a,l),ee(l),te=JSON.parse(JSON.stringify(l)),da(te),U=[],_=null,G={titulo:`Listo: ${e.modo==="subir"?"subido":"tra\xEDdo"}. Este aparato y la nube quedaron iguales`,lineas:o,malo:!1}}catch(e){G={titulo:"No se aplic\xF3 nada",lineas:[e.message],malo:!0}}z=!1,y()}});b.set("nube-sincronizar",async()=>{if(!z){z=!0,y();try{let e=await Ft(l,te,new Date().toISOString());l=e.estado,te=JSON.parse(JSON.stringify(e.estado)),U=e.descartes.map(a=>({tabla:a.tabla,id:a.id,campo:a.campo,valor:a.valor,gano:a.gano,nombre:a.nombre})),ee(l),da(te),M={texto:U.length===0?"Todo al d\xEDa. Nada que resolver.":`Listo. ${U.length} dato(s) distintos entre los dos aparatos: mira abajo.`,malo:!1}}catch(e){M={texto:e.message,malo:!0}}z=!1,y()}});b.set("nube-revertir",e=>{let a=Number(e.dataset.i),o=U[a];if(!o)return;let t=yn(l,o);if(!t.ok)return M={texto:t.motivo??"Eso no se puede deshacer desde aqu\xED.",malo:!0},y();U=U.filter((n,s)=>s!==a),ee(l),M={texto:`Listo: ${ga(o,l)} se queda con ${Le(o.campo,o.valor,Ca)}. Sincroniza otra vez para que el otro aparato lo tome.`,malo:!1},y()});document.addEventListener("keydown",e=>{if(e.key!=="Enter"||e.isComposing)return;let a=e.target;!a||a.closest(".capa-dialogo")||!(a instanceof HTMLInputElement)||a.type==="checkbox"||(e.preventDefault(),a.blur())});document.addEventListener("focusin",e=>{let a=e.target?.closest?.("#panel-metas tr[data-id-fila]");a?.dataset.idFila&&a.dataset.idFila!==K&&Pa(a.dataset.idFila)});
