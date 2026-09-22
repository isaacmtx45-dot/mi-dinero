var pa=Number.MAX_SAFE_INTEGER;function D(e){let a=typeof e=="number"?e:Number(e);return Number.isFinite(a)?Math.abs(a)>pa?a<0?-pa:pa:Math.round(a):0}function De(e,a){return D(e*a)}var ma=100;function Kt(e,a){return a<=0?"sin_pagar":a>=e+ma?"pagaron_de_mas":a>=e-ma?"completa":"parcial"}function Me(e,a){let o=new Map;for(let t of a){let n=o.get(t.cuentaDeCobroId)??[];n.push(t),o.set(t.cuentaDeCobroId,n)}return e.map(t=>{let n=(o.get(t.id)??[]).slice().sort((i,c)=>i.fecha.localeCompare(c.fecha)),s=n.reduce((i,c)=>i+D(c.monto),0),r=Kt(D(t.montoEsperado),s);return{cuenta:t,ingresos:n,recibido:s,pendiente:r==="completa"?0:Math.max(0,D(t.montoEsperado)-s),estado:r,ultimoPago:n.length?n[n.length-1].fecha:null}})}function Ka(e){return e.filter(a=>a.pendiente>0)}function Za(e){return D(e.cuenta.montoEsperado)<=0||e.pendiente>0}function je(e){return e.reduce((a,o)=>a+o.pendiente,0)}var Oe=new Intl.NumberFormat("es-CO");function eo(e){let a=`$${Oe.format(e.cuenta.montoEsperado)}`,o=`$${Oe.format(e.recibido)}`;switch(e.estado){case"sin_pagar":return`${e.cuenta.periodo}: sin pagar \xB7 te deben ${a}`;case"parcial":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 faltan $${Oe.format(e.pendiente)}`;case"completa":return`${e.cuenta.periodo}: pagada completa (${o})`;case"pagaron_de_mas":return`${e.cuenta.periodo}: te pagaron ${o} de ${a} \xB7 $${Oe.format(e.recibido-e.cuenta.montoEsperado)} de mas`}}function Wa(e,a){let o=Date.UTC(+e.slice(0,4),+e.slice(5,7)-1,+e.slice(8,10)),t=Date.UTC(+a.slice(0,4),+a.slice(5,7)-1,+a.slice(8,10));return Math.round((t-o)/864e5)}function ao(e){return e.filter(a=>!!a.cuenta.fechaRadicacion).map(a=>{let o=a.cuenta.fechaRadicacion,t=a.ingresos[0]?.fecha??null,n=null;if((a.estado==="completa"||a.estado==="pagaron_de_mas")&&D(a.cuenta.montoEsperado)>0){let s=0;for(let r of a.ingresos)if(s+=D(r.monto),s>=D(a.cuenta.montoEsperado)-ma){n=r.fecha;break}}return{cuentaId:a.cuenta.id,periodo:a.cuenta.periodo,radicada:o,primerPago:t,completo:n,diasPrimero:t?Wa(o,t):null,diasCompleto:n?Wa(o,n):null}})}function oo(e){let a=o=>o.length?Math.round(o.reduce((t,n)=>t+n,0)/o.length):null;return{cuentas:e.length,primero:a(e.map(o=>o.diasPrimero).filter(o=>o!==null)),completo:a(e.map(o=>o.diasCompleto).filter(o=>o!==null))}}function Zt(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function Fe(e,a,o){return o>0&&o%30===0?en(a,(e-1)*(o/30)):Zt(a,(e-1)*o)}function en(e,a){let o=e.getFullYear(),t=e.getMonth()+a,n=new Date(o,t+1,0).getDate();return new Date(o,t,Math.min(e.getDate(),n),e.getHours(),e.getMinutes(),e.getSeconds())}function T(e,a){let o=Math.max(1,a.diasOptimista);return{optimista:Fe(e,a.desde,o),pesimista:Fe(e,a.desde,Math.max(o,a.diasPesimista))}}function ba(e){return e.diasPesimista<=e.diasOptimista}var an=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function K(e){return`${an[e.getMonth()]} de ${e.getFullYear()}`}var ga=["ene.","feb.","mar.","abr.","mayo","jun.","jul.","ago.","sept.","oct.","nov.","dic."];function N(e){return ga[Number(e.slice(5,7))-1]??e}function de(e){let[a,o]=[e.optimista,e.pesimista],t=ga[a.getMonth()],n=ga[o.getMonth()];return a.getFullYear()!==o.getFullYear()?`${t} ${a.getFullYear()} \u2013 ${n} ${o.getFullYear()}`:a.getMonth()===o.getMonth()?`${t} ${a.getFullYear()}`:`${t} \u2013 ${n} ${o.getFullYear()}`}function ue(e){let a=K(e.optimista),o=K(e.pesimista);return a===o?a:`entre ${a} y ${o}`}function Ne(e){return new Map(e.map(a=>[a.id,Math.max(0,D(a.valor)-D(a.abonado??0))]))}function on(e){return e.baseCobro??(e.tipo==="porcentaje"?"cada_ingreso":"una_vez_por_cuenta")}function tn(e,a,o){if(!o&&on(e)==="una_vez_por_cuenta")return!1;if(e.modo==="primer_pago")return a===1&&o;if(a<(e.desdePago??1))return!1;if(e.modo==="cada_pago")return!0;let t=e.supuesto??"siempre";return t==="nunca"?!1:t==="cada_dos_pagos"?a%2===1:!0}function _e(e,a,o){let t=e,n=0;for(let s of a??[]){let r=Math.max(1,Math.round(s.desdePago));o>=r&&r>=n&&(t=s.valor,n=r)}return t}function nn(e,a,o){let t=_e(e.valor,e.cambios,o);return e.tipo==="porcentaje"?De(a,t):D(t)}function to(e,a){return e.maximoPorPago&&e.maximoPorPago>0?D(e.maximoPorPago):e.enCuotas&&e.enCuotas>0?Math.max(1,Math.ceil(D(e.valor)/Math.round(e.enCuotas))):a}function sn(e,a,o,t){for(let n of[!0,!1])for(let s of a){if(e<=0)return 0;let r=o.get(s.id)??0;if(r<=0)continue;let i=t.find(p=>p.metaId===s.id),c=i?.monto??0,d=n?to(s,r+c)-c:r,u=Math.min(r,e,d);u<=0||(i?(i.monto+=u,i.deLoQueSobro=(i.deLoQueSobro??0)+u):t.push({metaId:s.id,monto:u,deLoQueSobro:u}),o.set(s.id,r-u),e-=u)}return e}function pe(e,a,o,t,n,s,r,i=!0){let c=D(a),d=[];for(let M of o){if(!tn(M,e,i))continue;let f=Math.min(nn(M,a,e),c);f<=0||(d.push({nombre:M.nombre,monto:f}),c-=f)}let u=_e(t.base,t.cambios,e),p=Math.min(D(u),c);c-=p;let g=[],h=0;for(let M of n){let f=s.get(M.id)??0;if(f<=0||e<(M.desdePago??1))continue;let $=to(M,f),C=Math.min(f,c,$);if(t.elastico&&C<f&&$>=f){let P=Math.max(0,p-D(t.minimo)),A=f-C;A<=P&&(p-=A,h+=A,C=f)}if(!(C<=0)&&(g.push({metaId:M.id,monto:C}),s.set(M.id,f-C),c-=Math.min(C,c),c<=0))break}t.sobranteAMetas&&c>0&&(c=sn(c,n,s,g));let S=c;return{numero:e,ingreso:a,obligaciones:d,aColchon:p,recorteColchon:h,abonos:g,sobrante:S,saldoAhorro:r+p+S}}function no(e,a,o,t,n,s,r=!0){let i=e.cuentaDeCobroId===void 0||e.cuentaDeCobroId==="",c=pe(a,D(e.monto),i?[]:o,i?{...t,base:0,minimo:0}:t,n,s,0,r),d=new Map(n.map(u=>[u.id,u]));return{id:`rep-${e.id}`,ingresoId:e.id,obligaciones:c.obligaciones.map(u=>({nombre:u.nombre,monto:u.monto})),abonos:c.abonos.map(u=>({nombre:d.get(u.metaId)?.nombre??"(meta borrada)",monto:u.monto,refId:u.metaId})),alAhorro:c.aColchon+c.sobrante,propuesto:!0}}function rn(e){let a=o=>o.reduce((t,n)=>t+D(n.monto),0);return a(e.obligaciones)+a(e.abonos)+a(e.gastos??[])+D(e.alAhorro)}function Ee(e,a){return D(a.monto)-rn(e)}var fa=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function so(e){return e.slice(0,7)}function me(e,a){let o=D(a.monto);if(o===0)return;let t=e.get(a.nombre);if(!t){e.set(a.nombre,{...a,monto:o});return}t.monto+=o,a.deLoQueSobro&&(t.deLoQueSobro=(t.deLoQueSobro??0)+a.deLoQueSobro)}function ha(e,a){let o=new Map(a.map(n=>[n.ingresoId,n])),t=new Map;for(let n of e){let s=so(n.fecha),r=t.get(s);r||(r={mes:s,entro:0,deTrabajo:0,deFuera:0,aObligaciones:0,aMetas:0,enGastos:0,alAhorro:0,detalle:[],sinAsignar:0,_detalle:new Map},t.set(s,r));let i=D(n.monto);r.entro+=i,n.cuentaDeCobroId===void 0||n.cuentaDeCobroId===""?r.deFuera+=i:r.deTrabajo+=i;let d=o.get(n.id);if(!d){r.sinAsignar+=i;continue}for(let u of d.obligaciones)r.aObligaciones+=D(u.monto),me(r._detalle,u);for(let u of d.abonos)r.aMetas+=D(u.monto),me(r._detalle,u);for(let u of d.gastos??[])r.enGastos+=D(u.monto),me(r._detalle,u);r.alAhorro+=D(d.alAhorro),r.sinAsignar+=Ee(d,n)}return[...t.values()].map(({_detalle:n,...s})=>({...s,detalle:[...n.values()].sort((r,i)=>i.monto-r.monto)})).sort((n,s)=>n.mes.localeCompare(s.mes))}function ro(e){let a=new Map;for(let o of e)for(let t of[...o.obligaciones,...o.abonos,...o.gastos??[]])me(a,t);return[...a.values()].sort((o,t)=>t.monto-o.monto)}function z(e){let[a,o]=e.split("-"),t=Number(o)-1;return fa[t]?`${fa[t]} de ${a}`:e}function io(e,a,o,t=[]){let n=new Map,s=new Map,r=new Map(t.map(c=>[c.id,c.nombre])),i=c=>r.get(c)??c;for(let c of e){let d=Fe(c.numero,a,Math.max(1,o)),u=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,p=n.get(u);p||(p={mes:u,entro:0,aObligaciones:0,aMetas:0,alAhorro:0,detalle:[],pagos:[]},n.set(u,p),s.set(u,new Map));let g=s.get(u);p.pagos.push(c.numero),p.entro+=D(c.ingreso);for(let h of c.obligaciones)p.aObligaciones+=D(h.monto),me(g,{nombre:h.nombre,monto:h.monto});for(let h of c.abonos)p.aMetas+=D(h.monto),me(g,{nombre:i(h.metaId),monto:h.monto,refId:h.metaId,...h.deLoQueSobro?{deLoQueSobro:h.deLoQueSobro}:{}});p.alAhorro+=D(c.aColchon)+D(c.sobrante)}return[...n.values()].map(c=>({...c,detalle:[...s.get(c.mes).values()].sort((d,u)=>u.monto-d.monto)})).sort((c,d)=>c.mes.localeCompare(d.mes))}function ke(e,a){let o=new Set(a.map(t=>t.cuentaDeCobroId).filter(t=>!!t));return e.cuentaDeCobroId?o.has(e.cuentaDeCobroId)?o.size:o.size+1:Math.max(1,o.size)}function Z(e){return(e??[]).filter(a=>D(a.monto)!==0)}function co(e,a){let o=new Set([...Z(a.obligaciones),...Z(a.abonos)].map(t=>t.nombre));return[...Z(e.obligaciones),...Z(e.abonos)].map(t=>t.nombre).filter(t=>!o.has(t))}function lo(e,a,o,t){let n=a.find(r=>r.nombre.trim()===e.trim());if(n)return n.compra?{tipo:"ya-comprada"}:D(n.abonado??0)>=D(n.valor)?{tipo:"ya-pagada"}:(n.desdePago??1)>t?{tipo:"empieza-despues",pago:n.desdePago}:{tipo:"no-se-sabe"};let s=o.find(r=>r.nombre.trim()===e.trim());return s?s.valor<=0?{tipo:"en-cero"}:s.modo==="primer_pago"&&t>1?{tipo:"solo-el-primer-pago"}:(s.desdePago??1)>t?{tipo:"empieza-despues",pago:s.desdePago}:s.modo==="puntual"?{tipo:"puntual"}:{tipo:"no-se-sabe"}:{tipo:"ya-no-esta"}}function uo(e,a,o,t=new Map){return[...new Set([...e.map(s=>s.mes),...a.map(s=>s.mes)])].sort().map(s=>{let r=e.find(u=>u.mes===s)??null,i=a.find(u=>u.mes===s)??null,c=s<o?"pasado":s===o?"actual":"futuro",d=t.get(s)??(r?{monto:r.entro,segun:"escenario"}:null);return{mes:s,estado:c,real:i,simulado:r,esperado:d,diferencia:c==="pasado"&&d&&i?i.entro-d.monto:null}})}function va(e){let a=0,o=0,t=0,n=0,s=0,r=0;for(let i of e)i.real&&(n+=1,a+=i.real.entro,o+=i.real.aObligaciones+i.real.aMetas+i.real.enGastos,t+=i.real.alAhorro),i.estado==="futuro"&&i.simulado&&(r+=1,s+=i.esperado?.monto??i.simulado.entro);return{mesesConDatos:n,entroDeVerdad:a,gastadoDeVerdad:o,guardadoDeVerdad:t,faltaPorEntrar:s,mesesQueFaltan:r}}var cn=new Map(fa.map((e,a)=>[e,String(a+1).padStart(2,"0")]));function $a(e,a){let o=e.toLowerCase().trim(),t=o.match(/^(\d{4})-(\d{2})/);if(t)return`${t[1]}-${t[2]}`;let n=o.match(/([a-záéíóú]+)\D+(\d{4})/);if(n){let r=cn.get(n[1]);if(r)return`${n[2]}-${r}`}let s=a.slice().sort((r,i)=>r.fecha.localeCompare(i.fecha))[0];return s?so(s.fecha):null}function po(e,a,o,t){let n=new Map;for(let s of e){let r=a.filter(c=>c.cuentaDeCobroId!==void 0),i=$a(s.periodo,r);i&&n.set(i,D(s.montoEsperado))}return new Map(t.map(s=>{let r=n.get(s);return[s,r!==void 0?{monto:r,segun:"cuenta_de_cobro"}:{monto:D(o),segun:"escenario"}]}))}function mo(e,a){let o=s=>s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),t=new Map(a.map(s=>[o(s.nombre),s])),n=[];for(let s of Z(e.gastos)){let r=t.get(o(s.nombre));r&&n.push({gasto:s,metaId:r.id,metaNombre:r.nombre})}return n}function U(e,a){let o=new Map;for(let t of a)for(let n of t.abonos)n.refId&&o.set(n.refId,(o.get(n.refId)??0)+D(n.monto));return new Map(e.map(t=>{let n=D(t.valor),s=D(t.abonado??0),r=o.get(t.id)??0,i=Math.min(s+r,n);return[t.id,{previo:s,real:r,total:i,falta:Math.max(0,n-i)}]}))}function Da(e,a){let o=U(e,a);return e.map(t=>({...t,abonado:o.get(t.id).total}))}function go(e,a){let o=0;for(let t of U(e,a).values())o+=t.total;return o}var ln=600;function ge(e){let a=Ne(e.metas),o=e.maxPagos??ln,t=[],n=new Map,s=new Map,r=new Map,i=new Map,c=0,u=Math.max(1,Math.round(e.desdePago??1))-1;for(;t.length<o&&[...a.values()].some(g=>g>0);){u+=1;let g=pe(u,D(_e(e.ingresoEsperado,e.cambiosIngreso,u)),e.obligaciones,e.colchon,e.metas,a,c);c=g.saldoAhorro,t.push(g);for(let h of g.abonos)n.has(h.metaId)||n.set(h.metaId,u),r.set(h.metaId,(r.get(h.metaId)??0)+1),i.set(h.metaId,(i.get(h.metaId)??0)+h.monto),(a.get(h.metaId)??0)<=0&&s.set(h.metaId,u)}let p=e.metas.map(g=>{let h=Math.min(D(g.abonado??0),D(g.valor)),S=i.get(g.id)??0;return{metaId:g.id,nombre:g.nombre,grupo:g.grupo,valor:g.valor,pagoInicio:n.get(g.id)??null,pagoFin:s.get(g.id)??null,cantidadPagos:r.get(g.id)??0,totalAbonado:h+S,completada:(a.get(g.id)??0)<=0,yaEstabaPagada:h>=D(g.valor)}});return{escenario:e.nombre,pagos:t,metas:p,totalPagos:u,ahorroFinal:c,incompleta:t.length>=o&&p.some(g=>!g.completada)}}function bo(e){let a=new Map;for(let o of e.metas){if(!o.grupo)continue;let t=a.get(o.grupo)??[];t.push(o),a.set(o.grupo,t)}return[...a.entries()].map(([o,t])=>{let n=t.map(i=>i.pagoInicio).filter(i=>i!==null),s=t.map(i=>i.pagoFin).filter(i=>i!==null),r=t.every(i=>i.completada);return{grupo:o,valor:t.reduce((i,c)=>i+c.valor,0),pagoInicio:n.length?Math.min(...n):null,pagoFin:r&&s.length?Math.max(...s):null,totalAbonado:t.reduce((i,c)=>i+c.totalAbonado,0),completado:r,yaEstabaPagado:t.every(i=>i.yaEstabaPagada)}})}function fo(e,a){return a.filter(t=>t.antesDelPago&&t.antesDelPago>0).map(t=>{let n=e.metas.find(i=>i.metaId===t.id),s=n?.pagoFin??null,r=n?.yaEstabaPagada?0:s;return{metaId:t.id,nombre:t.nombre,queria:Math.round(t.antesDelPago),termina:r,seRetrasa:r===null?null:Math.max(0,r-Math.round(t.antesDelPago))}})}function ho(e,a){let o=D(a);if(o<=0)return null;let t=ge(e),n=ge({...e,ingresoEsperado:D(e.ingresoEsperado)+o,maxPagos:1}),s=new Map(n.metas.map(c=>[c.metaId,c.totalAbonado])),i=1+ge({...e,metas:e.metas.map(c=>({...c,abonado:Math.max(D(c.abonado??0),s.get(c.id)??0)}))}).totalPagos;return{pendiente:o,pagosAhora:t.totalPagos,pagosSiPagan:i,seAdelanta:Math.max(0,t.totalPagos-i)}}function Ma(e,a,o){return new Date(e,a-1,o)}function ze(e,a){let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o}function dn(e){let a=e.getDay();return a===1?e:ze(e,(8-a)%7)}function un(e){let a=e%19,o=Math.floor(e/100),t=e%100,n=Math.floor(o/4),s=o%4,r=Math.floor((o+8)/25),i=Math.floor((o-r+1)/3),c=(19*a+o-n-i+15)%30,d=Math.floor(t/4),u=t%4,p=(32+2*s+2*d-c-u)%7,g=Math.floor((a+11*c+22*p)/451),h=Math.floor((c+p-7*g+114)/31),S=(c+p-7*g+114)%31+1;return Ma(e,h,S)}function pn(e){let a=un(e),o=s=>ze(a,s),t=[[1,1,"A\xF1o Nuevo"],[5,1,"D\xEDa del Trabajo"],[7,20,"Independencia de Colombia"],[8,7,"Batalla de Boyac\xE1"],[12,8,"Inmaculada Concepci\xF3n"],[12,25,"Navidad"]],n=[[1,6,"Reyes Magos"],[3,19,"San Jos\xE9"],[6,29,"San Pedro y San Pablo"],[8,15,"Asunci\xF3n de la Virgen"],[10,12,"D\xEDa de la Raza"],[11,1,"Todos los Santos"],[11,11,"Independencia de Cartagena"]];return[...t.map(([s,r,i])=>({fecha:Ma(e,s,r),nombre:i})),...n.map(([s,r,i])=>({fecha:dn(Ma(e,s,r)),nombre:i})),{fecha:o(-3),nombre:"Jueves Santo"},{fecha:o(-2),nombre:"Viernes Santo"},{fecha:o(43),nombre:"Ascensi\xF3n del Se\xF1or"},{fecha:o(64),nombre:"Corpus Christi"},{fecha:o(71),nombre:"Sagrado Coraz\xF3n de Jes\xFAs"}].sort((s,r)=>s.fecha.getTime()-r.fecha.getTime())}var ye=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;function Ea(e){return pn(e.getFullYear()).find(a=>ye(a.fecha)===ye(e))?.nombre??null}function mn(e){return Ea(e)!==null}function ya(e){return e.getDay()===0}function vo(e){let a=new Date(e.getTime());for(let o=0;o<15&&(ya(a)||mn(a));o++)a=ze(a,-1);return a}var $o=30,Do="Febrero no tiene 30: se radica el \xFAltimo d\xEDa del mes (28, o 29 si es bisiesto), y si ese d\xEDa cae domingo o festivo se retrocede igual que siempre.";function Sa(e,a){let o=new Date(e,a,0).getDate(),t=o<$o,n=new Date(e,a-1,Math.min($o,o)),s=vo(n),r=null;if(ye(s)!==ye(n)){let i=Ea(n);r=i?`el ${n.getDate()} es festivo (${i})`:ya(n)?`el ${n.getDate()} cae domingo`:`el ${n.getDate()} no es d\xEDa h\xE1bil`}return{fecha:s,fechaOriginal:n,motivoDelCambio:r,usoUltimoDiaDelMes:t}}var xa=[{id:"cuenta",nombre:"Cuenta de cobro diligenciada",frecuencia:"cada_mes",detalle:"Con una descripci\xF3n del servicio prestado."},{id:"informe",nombre:"Informe de actividades",frecuencia:"cada_mes",detalle:"Detallando espec\xEDficamente las funciones o actividades realizadas."},{id:"conformidad",nombre:"Certificado de conformidad del servicio",frecuencia:"cada_mes",detalle:"Lo entrega el coordinador o l\xEDder del \xE1rea: hay que ped\xEDrselo con tiempo."},{id:"seguridad_social",nombre:"Planilla de seguridad social",frecuencia:"cada_mes",obligatorioExplicito:!0,detalle:"Liquidada del mes VENCIDO al que se est\xE1 cobrando. La circular la marca como obligatoria."},{id:"constancia",nombre:"Constancia de prestaci\xF3n de servicio firmada por el paciente",frecuencia:"solo_asistencial",detalle:"Solo personal asistencial. Como t\xE9cnico de sistemas, no aplica."},{id:"rut",nombre:"RUT actualizado",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez."},{id:"bancaria",nombre:"Certificaci\xF3n bancaria",frecuencia:"una_sola_vez",detalle:"No superior a 30 d\xEDas. Solo la primera vez, o si cambia de cuenta."}];function ee(){return xa.filter(e=>e.frecuencia==="cada_mes")}var gn=5;function bn(e,a){let o=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),t=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return Math.round((t-o)/864e5)}var Mo=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ra(e,a=[]){let o=Sa(e.getFullYear(),e.getMonth()+1),t=bn(e,o.fecha),n=t<0?"vencido":t===0?"hoy":t<=gn?"pronto":"tranquilo",s=o.fecha.getDate(),r=Mo[o.fecha.getMonth()],i=n==="vencido"?`Se pas\xF3 la fecha: hab\xEDa que radicar el ${s} de ${r}`:n==="hoy"?"HOY es el \xFAltimo d\xEDa para radicar la cuenta de cobro":n==="pronto"?`Faltan ${t} d\xEDas: radicas el ${s} de ${r}`:`La cuenta de cobro se radica el ${s} de ${r}`,c=ee().filter(d=>!a.includes(d.id)).map(d=>d.id);return{limite:o,diasQueFaltan:t,urgencia:n,titular:i,soportesPendientes:c}}function Eo(e){let a=e.fecha.getDate(),o=Mo[e.fecha.getMonth()];return e.motivoDelCambio?`Se radica el ${a} de ${o}, no el ${e.fechaOriginal.getDate()}, porque ${e.motivoDelCambio}.`:`Se radica el ${a} de ${o}.`}function Se(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}`}function fn(){return new Date().toISOString().slice(0,10)}function hn(){return[]}function ae(){return{version:1,escenario:{nombre:"Mi escenario",ingresoEsperado:2e6,colchonBase:1e5,colchonMinimo:0,colchonElastico:!1,fechaPrimerPago:fn(),diasOptimista:30,diasPesimista:60},obligaciones:hn(),metas:[],cuentas:[],ingresos:[],repartos:[],soportesMarcados:{}}}function oe(e){return`${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}var yo="gestiondinerotrabajo.estado";function So(e){let a=ae();if(typeof e!="object"||e===null)return a;let o=e;return{version:1,escenario:{...a.escenario,...o.escenario??{}},obligaciones:o.obligaciones??a.obligaciones,metas:o.metas??a.metas,cuentas:o.cuentas??a.cuentas,ingresos:o.ingresos??a.ingresos,repartos:o.repartos??a.repartos,soportesMarcados:o.soportesMarcados??a.soportesMarcados,notasDelMes:o.notasDelMes??{}}}function xo(){let e=null;try{e=localStorage.getItem(yo)}catch{return{estado:ae(),aviso:{texto:"No pude leer los datos guardados. Est\xE1s viendo un inicio en blanco.",grave:!0}}}if(!e)return{estado:ae(),aviso:null};try{return{estado:So(JSON.parse(e)),aviso:null}}catch{return{estado:ae(),aviso:{texto:"Los datos guardados est\xE1n da\xF1ados. No los borr\xE9: sigue ah\xED el archivo por si se puede recuperar.",grave:!0}}}}function be(e){try{return localStorage.setItem(yo,JSON.stringify(e)),null}catch(a){return a instanceof Error?a.message:"no se pudo guardar"}}function Ca(e){return JSON.stringify(e,null,2)}function Pa(e){try{return{estado:So(JSON.parse(e)),aviso:null}}catch{return{estado:null,aviso:{texto:"Ese archivo no es un respaldo v\xE1lido. No cambi\xE9 nada de lo que ten\xEDas.",grave:!0}}}}var Ia=null;function G(e){return Ia?.(),new Promise(a=>{let o=document.createElement("div");o.className="capa-dialogo",o.innerHTML=`
      <div class="dialogo" role="dialog" aria-modal="true" aria-labelledby="dlg-titulo">
        <h3 id="dlg-titulo">${xe(e.titulo)}</h3>
        ${e.detalle?`<p class="dlg-detalle">${xe(e.detalle)}</p>`:""}
        ${e.largo?`<textarea class="dlg-campo" rows="6">${xe(e.valorInicial??"")}</textarea>`:`<input class="dlg-campo" type="text" ${e.dinero?'inputmode="numeric" data-dinero':""}
               value="${xe(e.valorInicial??"")}" />`}
        <div class="dlg-botones">
          <button class="dlg-cancelar">Cancelar</button>
          <button class="primario dlg-aceptar">${xe(e.textoAceptar??"Aceptar")}</button>
        </div>
      </div>`;let t=o.querySelector(".dlg-campo"),n=i=>{document.removeEventListener("keydown",r,!0),o.remove(),Ia=null,a(i)},s=()=>n(t.value);function r(i){i.key==="Escape"&&(i.preventDefault(),n(null));let c=e.largo?i.ctrlKey:!0;i.key==="Enter"&&c&&document.activeElement===t&&(i.preventDefault(),s())}o.querySelector(".dlg-aceptar").addEventListener("click",s),o.querySelector(".dlg-cancelar").addEventListener("click",()=>n(null)),o.addEventListener("mousedown",i=>{i.target===o&&n(null)}),document.addEventListener("keydown",r,!0),document.body.appendChild(o),Ia=()=>n(null),t.focus(),t.select()})}function xe(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var Ro=new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});function Ta(e){return e.replace(/\D/g,"")}function $n(e){let a=Ta(e);if(a==="")return"";let o=a.replace(/^0+(?=\d)/,"");return Ro.format(Number(o))}function q(e){let a=Ta(e);return a===""?0:Number(a)}function I(e){return Ro.format(Math.round(e))}function Co(e){let a=e.value,o=e.selectionStart??a.length,t=Ta(a.slice(0,o)).length,n=$n(a);if(n===a)return;e.value=n;let s=0,r=0;for(;r<n.length&&s<t;)/\d/.test(n[r])&&s++,r++;e.setSelectionRange(r,r)}function La(e){let a=e?.trim();if(!a)return null;try{let o=new URL(/^[a-z][a-z0-9+.-]*:/i.test(a)?a:`https://${a}`);return o.protocol==="http:"||o.protocol==="https:"?o.href:null}catch{return null}}function Po(e,a){let o=[],t=0;for(let n of a){let s=Math.max(1,Math.round(n)||1),r=e[t];o.push(s>1||!r?null:r),t+=s}return o}var Dn=4;function Io(e){return e.length>=Dn}var B="__borrado";function Re(e,a){return e[a]??""}function Q(e){if(e==null)return"null";if(Array.isArray(e))return`[${e.map(Q).join(",")}]`;if(typeof e=="object"){let a=e;return`{${Object.keys(a).filter(t=>a[t]!==void 0).sort().map(t=>`${JSON.stringify(t)}:${Q(a[t])}`).join(",")}}`}return JSON.stringify(e)}function He(e,a){return Q(e)===Q(a)}function To(e,a,o,t){return e!==o?e>o:Q(a)>=Q(t)}function Lo(e,a,o,t={}){let n={...t},s=new Set([...Object.keys(e??{}),...Object.keys(a)]);for(let r of s){if(r==="id")continue;let i=e===null?void 0:e[r],c=a[r];He(i,c)||(n[r]=o)}return n}function Mn(e,a){if(e.datos.id!==a.datos.id)throw new Error(`No se pueden fusionar dos filas distintas: ${e.datos.id} y ${a.datos.id}.`);let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t={id:e.datos.id},n={},s=[];for(let p of o){if(p==="id")continue;let g=e.datos[p],h=a.datos[p],S=Re(e.tocado,p),M=Re(a.tocado,p),f=To(S,g,M,h),$=f?g:h,C=f?h:g;$!==void 0&&(t[p]=$);let P=S>M?S:M;P!==""&&(n[p]=P),He(g,h)||s.push({id:e.datos.id,campo:p,valor:C,cuando:f?M:S,gano:$})}let r=Re(e.tocado,B),i=Re(a.tocado,B),c=To(r,e.borradoEn,i,a.borradoEn),d=c?e.borradoEn:a.borradoEn,u=r>i?r:i;return u!==""&&(n[B]=u),He(e.borradoEn,a.borradoEn)||s.push({id:e.datos.id,campo:B,valor:c?a.borradoEn:e.borradoEn,cuando:c?i:r,gano:d}),{fila:{datos:t,tocado:n,borradoEn:d??null},descartes:s}}function En(e,a){let o=e.datos.propuesto,t=a.datos.propuesto;return o===!1&&t===!0?e:t===!1&&o===!0?a:null}function yn(e,a){let o=new Set([...Object.keys(e.datos),...Object.keys(a.datos)]),t=[];for(let n of o){if(n==="id")continue;let s=e.datos[n],r=a.datos[n];JSON.stringify(s)!==JSON.stringify(r)&&t.push({id:e.datos.id,campo:n,valor:r,cuando:Re(a.tocado,n),gano:s})}return t}function Ao(e,a){let o=new Map(a.map(s=>[s.datos.id,s])),t=[],n=[];for(let s of e){let r=o.get(s.datos.id);if(!r){t.push(s);continue}let i=En(s,r);if(i){t.push(i),n.push(...yn(i,i===s?r:s)),o.delete(s.datos.id);continue}let c=Mn(s,r);t.push(c.fila),n.push(...c.descartes),o.delete(s.datos.id)}for(let s of a)o.has(s.datos.id)&&t.push(s);return{filas:t,descartes:n}}function qo(e,a){return a?e.filter(o=>{let t=a.get(o.id);if(!t)return!0;let n=o.campo===B?t.borradoEn:t.datos[o.campo];return!He(o.valor,n)}):e}var J=["escenario","obligaciones","metas","cuentas","ingresos","repartos","soportes"],Sn="escenario";function te(e,a){return{datos:{...a,id:e},tocado:{},borradoEn:null}}var xn=["ordenMetas","ordenObligaciones"];function wo(e,a){if(!Array.isArray(a))return e;let o=new Map(a.map((n,s)=>[String(n),s]));return[...e.filter(n=>o.has(n.id)).sort((n,s)=>o.get(n.id)-o.get(s.id)),...e.filter(n=>!o.has(n.id))]}function fe(e){return{escenario:[te(Sn,{...e.escenario,ordenMetas:e.metas.map(a=>a.id),ordenObligaciones:e.obligaciones.map(a=>a.id)})],obligaciones:e.obligaciones.map(a=>te(a.id,{...a})),metas:e.metas.map(a=>te(a.id,{...a})),cuentas:e.cuentas.map(a=>te(a.id,{...a})),ingresos:e.ingresos.map(a=>te(a.id,{...a})),repartos:e.repartos.map(a=>te(a.id,{...a})),soportes:Rn(e)}}function Rn(e){let a=e.notasDelMes??{};return[...new Set([...Object.keys(e.soportesMarcados),...Object.keys(a).filter(t=>a[t].trim()!=="")])].sort().map(t=>te(t,{...t in e.soportesMarcados?{marcados:e.soportesMarcados[t]}:{},...a[t]?.trim()?{nota:a[t]}:{}}))}function Ve(e,a){let o=c=>(e[c]??[]).filter(d=>d.borradoEn===null),t=c=>e[c]!==void 0&&e[c].length>0,n=t("escenario")?{...a.escenario,...o("escenario")[0]?.datos}:a.escenario;n&&"id"in n&&delete n.id;let s=(t("escenario")?o("escenario")[0]?.datos:void 0)??{};for(let c of xn)delete n[c];let r={},i={};for(let c of o("soportes")){let{marcados:d,nota:u}=c.datos;Array.isArray(d)&&(r[c.datos.id]=d),typeof u=="string"&&u.trim()!==""&&(i[c.datos.id]=u)}return{version:a.version,escenario:n,obligaciones:wo(t("obligaciones")?o("obligaciones").map(c=>c.datos):a.obligaciones,s.ordenObligaciones),metas:wo(t("metas")?o("metas").map(c=>c.datos):a.metas,s.ordenMetas),cuentas:t("cuentas")?o("cuentas").map(c=>c.datos):a.cuentas,ingresos:t("ingresos")?o("ingresos").map(c=>c.datos):a.ingresos,repartos:t("repartos")?o("repartos").map(c=>c.datos):a.repartos,soportesMarcados:t("soportes")?r:a.soportesMarcados,notasDelMes:t("soportes")?i:a.notasDelMes??{}}}function Oo(e){return{id:e.datos.id,datos:e.datos,tocado:e.tocado,borrado_en:e.borradoEn}}function jo(e){let a=e.datos??{};return{datos:{...a,id:String(e.id??a.id??"")},tocado:e.tocado??{},borradoEn:e.borrado_en??null}}function Fo(e,a,o,t={}){let n=fe(e),s=a?fe(a):null,r={};for(let i of J){let c=new Map((s?.[i]??[]).map(g=>[g.datos.id,g])),d=t[i]??new Map,u=n[i].map(g=>({...g,tocado:Lo(c.get(g.datos.id)?.datos??null,g.datos,o,d.get(g.datos.id)??{})})),p=new Set(n[i].map(g=>g.datos.id));for(let[g,h]of c)p.has(g)||u.push({datos:h.datos,tocado:{...d.get(g)??{},[B]:o},borradoEn:o});r[i]=u}return r}var ne={url:"https://voncmkjcxzgxfloehovb.supabase.co",clave:"sb_publishable_Ev68VoFXNXqvcVOjgXoknw_vAFK-iHn"},Aa="gestiondinerotrabajo.sesion",Ge="gestiondinerotrabajo.ultimaSincronizacion",Be="gestiondinerotrabajo.nube.sincronizado";function Qe(){try{let e=localStorage.getItem(Aa);return e?JSON.parse(e):null}catch{return null}}function qa(e){try{e?localStorage.setItem(Aa,JSON.stringify(e)):localStorage.removeItem(Aa)}catch{}}function wa(){qa(null);try{localStorage.removeItem(Ge),localStorage.removeItem(Be)}catch{}}function No(){try{let e=localStorage.getItem(Be);return e?JSON.parse(e):null}catch{return null}}function Ye(e){try{e?localStorage.setItem(Be,JSON.stringify(e)):localStorage.removeItem(Be)}catch{}}async function _o(e,a){let o=await fetch(`${ne.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:ne.clave,"Content-Type":"application/json"},body:JSON.stringify({email:e.trim(),password:a})}),t=await o.json().catch(()=>({}));if(!o.ok)throw new Error(Cn(o.status,t));let n={token:t.access_token,refresco:t.refresh_token,usuarioId:t.user?.id??"",correo:t.user?.email??e.trim(),caduca:Date.now()+(Number(t.expires_in)||3600)*1e3};if(!n.token||!n.usuarioId)throw new Error("Supabase respondi\xF3 sin sesi\xF3n. Revisa la direcci\xF3n del proyecto.");return qa(n),n}function Cn(e,a){let o=String(a.error_description??a.msg??a.message??"");return e===400&&/invalid login|credentials/i.test(o)?"Correo o contrase\xF1a incorrectos.":e===400&&/email not confirmed/i.test(o)?"Falta confirmar el correo: mira el mensaje que te mand\xF3 Supabase.":e===422?"Ese correo no tiene un formato v\xE1lido.":e===429?"Demasiados intentos seguidos. Espera un momento.":o||`No se pudo entrar (error ${e}).`}async function Oa(){let e=Qe();if(!e)throw new Error("No has entrado con tu correo.");if(Date.now()<e.caduca-6e4)return e;let a=await fetch(`${ne.url}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{apikey:ne.clave,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:e.refresco})});if(!a.ok)throw wa(),new Error("La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.");let o=await a.json(),t={...e,token:o.access_token,refresco:o.refresh_token??e.refresco,caduca:Date.now()+(Number(o.expires_in)||3600)*1e3};return qa(t),t}function ko(e){return{apikey:ne.clave,Authorization:`Bearer ${e.token}`,"Content-Type":"application/json"}}async function zo(e,a,o){let t=o?`&actualizado_en=gt.${encodeURIComponent(o)}`:"",n=await fetch(`${ne.url}/rest/v1/${a}?select=*${t}`,{headers:ko(e)});if(!n.ok)throw new Error(await Vo(n,a,"bajar"));return(await n.json()).map(jo)}async function Ho(e,a,o){if(o.length===0)return;let t=o.map(s=>({...Oo(s),usuario_id:e.usuarioId})),n=await fetch(`${ne.url}/rest/v1/${a}?on_conflict=usuario_id,id`,{method:"POST",headers:{...ko(e),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(t)});if(!n.ok)throw new Error(await Vo(n,a,"subir"))}async function Vo(e,a,o){let t=await e.text().catch(()=>"");return e.status===401?"La sesi\xF3n caduc\xF3. Vuelve a entrar con tu correo.":e.status===404||/does not exist/i.test(t)?`Falta la tabla \xAB${a}\xBB en Supabase: ejecuta supabase/esquema.sql.`:e.status===403||/permission denied/i.test(t)?`Sin permiso sobre \xAB${a}\xBB. Revisa los grants del esquema.`:`No se pudo ${o} \xAB${a}\xBB (error ${e.status}).`}async function Bo(e,a,o){let t=await Oa(),n=Ue(),s=Fo(e,a,o),r=a?fe(a):null,i={},c=[];for(let u of J){let p=s[u],g=await zo(t,u,n),h=Ao(p,g);i[u]=h.filas;let S=r?new Map(r[u].map($=>[$.datos.id,{datos:$.datos,borradoEn:$.borradoEn}])):null,M=new Map(h.filas.map($=>[$.datos.id,$.datos]));c.push(...qo(h.descartes,S).map($=>{let C=M.get($.id),P=typeof C?.nombre=="string"?C.nombre:typeof C?.periodo=="string"?C.periodo:void 0;return{...$,tabla:u,nombre:P}}));let f=new Set(p.filter($=>Object.keys($.tocado).length>0).map($=>$.datos.id));for(let $ of h.descartes)f.add($.id);await Ho(t,u,h.filas.filter($=>f.has($.datos.id)))}let d=new Date().toISOString();try{localStorage.setItem(Ge,d)}catch{}return{estado:Ve(i,e),descartes:c,cuando:d}}async function Go(){let e=await Oa(),a={};for(let o of J)a[o]=await zo(e,o,null);return a}async function Qo(e){let a=await Oa();for(let t of J)await Ho(a,t,e[t]??[]);let o=new Date().toISOString();try{localStorage.setItem(Ge,o)}catch{}return o}function Ue(){try{return localStorage.getItem(Ge)}catch{return null}}function Yo(e,a){let o=[];for(let t of J){let n=new Map((e[t]??[]).map(i=>[i.datos.id,i])),s=new Map((a[t]??[]).map(i=>[i.datos.id,i])),r=[...n.keys(),...[...s.keys()].filter(i=>!n.has(i))];for(let i of r){let c=n.get(i),d=s.get(i),u={tabla:t,id:i};if(c&&!d){o.push({...u,clave:`${t}|${i}|fila`,tipo:"solo-aqui",aqui:c.datos,nube:void 0,datos:c.datos});continue}if(!c&&d){if(d.borradoEn)continue;o.push({...u,clave:`${t}|${i}|fila`,tipo:"solo-nube",aqui:void 0,nube:d.datos,datos:d.datos});continue}if(!c||!d)continue;if(d.borradoEn){o.push({...u,clave:`${t}|${i}|fila`,tipo:"borrada-en-la-nube",aqui:c.datos,nube:null,datos:c.datos});continue}let p=c.datos.propuesto===!1&&d.datos.propuesto===!0?"aqui":d.datos.propuesto===!1&&c.datos.propuesto===!0?"nube":void 0,g=new Set([...Object.keys(c.datos),...Object.keys(d.datos)]);for(let h of g){if(h==="id")continue;let S=c.datos[h],M=d.datos[h];Q(S)!==Q(M)&&o.push({...u,clave:`${t}|${i}|${h}`,tipo:"campo",campo:h,aqui:S,nube:M,datos:c.datos,confirmadoEn:p})}}}return o}function ja(e,a){let o={};for(let t of e)o[t.clave]=t.tipo==="solo-aqui"?"aqui":t.tipo==="solo-nube"?"nube":t.tipo==="borrada-en-la-nube"?"aqui":t.confirmadoEn??(a==="subir"?"aqui":"nube");return o}function Uo(e,a,o,t,n){let s=u=>t[u.clave]??ja([u],"subir")[u.clave],r=new Map;for(let u of o){let p=`${u.tabla}|${u.id}`;r.set(p,[...r.get(p)??[],u])}let i=u=>({datos:u.datos,tocado:{...u.tocado,[B]:n},borradoEn:n}),c={};for(let u of J){let p=new Map((e[u]??[]).map(M=>[M.datos.id,M])),g=new Map((a[u]??[]).map(M=>[M.datos.id,M])),h=[...p.keys(),...[...g.keys()].filter(M=>!p.has(M))],S=[];for(let M of h){let f=p.get(M),$=g.get(M),C=r.get(`${u}|${M}`)??[],P=C.find(A=>A.tipo!=="campo");if(f&&!$)S.push(P&&s(P)==="nube"?i(f):f);else if(!f&&$)$.borradoEn?S.push($):S.push(P&&s(P)==="aqui"?i($):$);else if(f&&$&&$.borradoEn)S.push(P&&s(P)==="nube"?$:{datos:f.datos,tocado:{...$.tocado,...f.tocado,[B]:n},borradoEn:null});else if(f&&$){let A={...f.datos},Y={...$.tocado,...f.tocado};for(let w of C)w.tipo!=="campo"||!w.campo||(s(w)==="nube"&&($.datos[w.campo]===void 0?delete A[w.campo]:A[w.campo]=$.datos[w.campo]),Y[w.campo]=n);S.push({datos:A,tocado:Y,borradoEn:null})}}c[u]=S}let d=c.escenario[0];if(d){let u={...d.datos};for(let[p,g]of[["ordenMetas","metas"],["ordenObligaciones","obligaciones"]]){let h=c[g].filter(M=>!M.borradoEn).map(M=>M.datos.id),S=Array.isArray(u[p])?u[p]:[];u[p]=[...S.filter(M=>h.includes(M)),...h.filter(M=>!S.includes(M))]}c.escenario[0]={...d,datos:u}}return c}var We="__borrado",Xe=new Intl.NumberFormat("es-CO"),Pn={obligaciones:"obligaciones",abonos:"abonos a metas",gastos:"gastos",cambios:"cambios de valor",valor:"valor",nombre:"nombre",grupo:"grupo",abonado:"ya pagado antes",alAhorro:"al ahorro",monto:"monto",fecha:"fecha",ingresoEsperado:"ingreso esperado",fechaPrimerPago:"fecha del primer pago",marcados:"soportes marcados",clase:"compra o deuda",precioRevisado:"fecha en que revisaste el precio",enDolares:"precio en d\xF3lares",fechaRadicacion:"fecha de radicaci\xF3n",ordenMetas:"orden (prioridad) de las metas",ordenObligaciones:"orden de las obligaciones",desdePago:"empieza en el pago",maximoPorPago:"m\xE1ximo por pago",enCuotas:"reunirla en N pagos",antesDelPago:"la quiero antes del pago",colchonBase:"otros / ahorro por pago",colchonMinimo:"del ahorro no bajar de",colchonElastico:"usar el ahorro para adelantar metas",sobranteAMetas:"usar lo que sobra del mes en las metas siguientes",cambiosColchon:"cambios del ahorro",cambiosIngreso:"cambios del pago",diasOptimista:"d\xEDas entre pagos, si son puntuales",diasPesimista:"d\xEDas entre pagos, si se atrasan",tipo:"c\xF3mo se calcula",modo:"cada cu\xE1ndo",montoEsperado:"monto esperado",periodo:"periodo",propuesto:"sin confirmar",compra:"ya la compraste",nota:"nota",link:"enlace",cuentaDeCobroId:"cuenta de cobro",ingresoId:"pago"};function Ke(e,a){switch(e.tabla){case"metas":{let o=a.metas.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la meta \xAB${o}\xBB`:"una meta que ya no est\xE1"}case"obligaciones":{let o=a.obligaciones.find(t=>t.id===e.id)?.nombre??e.nombre;return o!==void 0?`la obligaci\xF3n \xAB${o}\xBB`:"una obligaci\xF3n que ya no est\xE1"}case"cuentas":{let o=a.cuentas.find(t=>t.id===e.id);return o?`la cuenta de cobro de ${o.periodo}`:"una cuenta de cobro que ya no est\xE1"}case"ingresos":{let o=a.ingresos.find(t=>t.id===e.id);return o?`el pago del ${o.fecha} (${Xe.format(o.monto)})`:"un pago que ya no est\xE1"}case"repartos":{let o=a.repartos.find(n=>n.id===e.id),t=o?a.ingresos.find(n=>n.id===o.ingresoId):void 0;return t?`el reparto del pago del ${t.fecha} (${Xe.format(t.monto)})`:"un reparto de un pago que ya no est\xE1"}case"escenario":return"el escenario";case"soportes":return`el mes ${z(e.id)}`}}function Ce(e){return e===We?"borrado":Pn[e]??e}function Pe(e,a){return e===We?a?"borrada":"sin borrar":Je(a)}function Je(e){if(e==null||e==="")return"\u2014";if(typeof e=="number")return Xe.format(e);if(typeof e=="boolean")return e?"s\xED":"no";if(typeof e=="string")return e;if(Array.isArray(e))return e.length===0?"nada":e.map(Je).join(" \xB7 ");if(typeof e=="object"){let a=e;if(typeof a.nombre=="string"&&typeof a.monto=="number")return`${a.nombre} ${Xe.format(a.monto)}`;if(typeof a.desdePago=="number"&&"valor"in a)return`desde el pago ${a.desdePago}: ${Je(a.valor)}`;let o=Object.keys(a).sort().filter(t=>a[t]!==void 0).map(t=>`${Ce(t)}: ${Je(a[t])}`);return o.length?o.join(", "):"\u2014"}return String(e)}var Ie=[{id:"inicio",rotulo:"Inicio",icono:"\u{1F3E0}",paneles:["inicio","radicacion"]},{id:"calendario",rotulo:"Calendario",icono:"\u{1F5D3}\uFE0F",paneles:["vista"]},{id:"metas",rotulo:"Metas",icono:"\u{1F3AF}",paneles:["metas","proyeccion"]},{id:"registrar",rotulo:"Registrar",icono:"\u{1F4B5}",paneles:["cuentas","real"]},{id:"ajustes",rotulo:"Ajustes",icono:"\u2699\uFE0F",paneles:["escenario","obligaciones","nube","respaldo"]}],In="inicio";function Jo(e){return Ie.find(a=>a.paneles.includes(e))?.id??null}function Ze(e){return Ie.some(a=>a.id===e)?e:In}function Xo(e,a){let o=[],t="",n=0;for(let s=1;s<=e;s++){let r=a(s),i=K(r);n=i===t?n+1:1,t=i;let c=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`,d=n===1?"":`${n}.\xBA pago`,u=`${N(c)} ${r.getFullYear()}`;o.push({numero:s,rotulo:d?`${i} (${d})`:i,mes:N(c),anio:String(r.getFullYear()),vez:d,corto:d?`${u} (${d})`:u})}return o}function Wo(e,...a){return Math.max(36,e+12,...a.map(o=>o??0))}var Fa=null;function Ko(e){let a=e.parentElement?.querySelector("select");if(!a)return;Fa?.();let o=[...a.options],t=o.filter(d=>!d.dataset.anio),n=new Map;for(let d of o){if(!d.dataset.anio)continue;let u=n.get(d.dataset.anio)??[];u.push(d),n.set(d.dataset.anio,u)}let s=(d,u,p="")=>`<button type="button" class="opcion-mes ${p} ${d.selected?"elegido":""}" data-valor="${X(d.value)}"
       title="${X(d.text)}">${u}</button>`,r=document.createElement("div");r.className="capa-dialogo capa-meses",r.innerHTML=`
    <div class="dialogo dialogo-meses" role="dialog" aria-modal="true" aria-label="${X(a.dataset.titulo??"Elegir mes")}">
      <h3>${X(a.dataset.titulo??"Elegir mes")}</h3>
      ${t.map(d=>s(d,X(d.text),"suelta")).join("")}
      <div class="meses-cuerpo">
        ${[...n].map(([d,u])=>`
          <div class="meses-anio"><h4>${X(d)}</h4>
            <div class="rejilla-meses">${u.map(p=>s(p,`${X(p.dataset.mes??p.text)}${p.dataset.vez?`<small>${X(p.dataset.vez)}</small>`:""}`)).join("")}</div>
          </div>`).join("")}
      </div>
      <div class="dlg-botones"><button type="button" class="dlg-cancelar">Cancelar</button></div>
    </div>`;let i=()=>{document.removeEventListener("keydown",c,!0),r.remove(),Fa=null,e.focus()};function c(d){d.key==="Escape"&&(d.preventDefault(),i())}r.addEventListener("click",d=>{let u=d.target;if(d.stopPropagation(),u===r||u.closest(".dlg-cancelar"))return i();let p=u.closest(".opcion-mes");if(!p)return;let g=a.isConnected?a:Ln(a)??a,h=g.parentElement?.querySelector(".boton-mes")??e;g.value=p.dataset.valor??"",Tn(h,g),i(),g.dispatchEvent(new Event("change",{bubbles:!0}))}),document.addEventListener("keydown",c,!0),document.body.appendChild(r),Fa=i,r.querySelector(".opcion-mes.elegido")?.scrollIntoView({block:"center"}),(r.querySelector(".opcion-mes.elegido")??r.querySelector(".opcion-mes"))?.focus()}function Tn(e,a){let o=a.selectedOptions[0],t=e.querySelector(".mes-largo"),n=e.querySelector(".mes-corto");t&&(t.textContent=o?.text??"\u2014"),n&&(n.textContent=o?.dataset.corto??o?.text??"\u2014")}function Ln(e){let o="select"+Object.entries(e.dataset).filter(([t])=>t!=="titulo").map(([t,n])=>`[data-${t.replace(/[A-Z]/g,s=>"-"+s.toLowerCase())}="${CSS.escape(n??"")}"]`).join("");return document.querySelector(o)}function X(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function Na(e,a){let o=()=>({valor:0,pagado:0,cuantas:0}),t={deudas:o(),compras:o()};for(let n of e){let s=n.clase==="deuda"?t.deudas:t.compras;s.valor+=n.valor,s.pagado+=Math.min(n.valor,a.get(n.id)??0),s.cuantas++}return t}function Zo(e,a){let o=new Map(a.map(t=>[t.metaId,t.pagoFin]));return e.filter(t=>!t.yaEstabaPagada).map(t=>({metaId:t.metaId,nombre:t.nombre,antes:t.pagoFin,despues:o.get(t.metaId)??null}))}function et(e){return e.antes===null||e.despues===null?null:e.despues-e.antes}var at=e=>Number(e.slice(0,4))*12+Number(e.slice(5,7))-1;function ot(e,a,o,t,n,s=2){let r=new Map(o.map(d=>[d.id,d.fecha.slice(0,7)])),i=new Map;for(let d of a){let u=r.get(d.ingresoId);if(u)for(let p of d.abonos)!p.refId||p.monto<=0||(i.get(p.refId)??"")<u&&i.set(p.refId,u)}let c=[];for(let d of e){if(d.compra||(t.get(d.id)??0)>=d.valor)continue;let u=i.get(d.id);if(!u)continue;let p=at(n)-at(u);p>=s&&c.push({metaId:d.id,nombre:d.nombre,ultimoMes:u,meses:p})}return c}function _a(e,a,o,t=3){let n=new Date(`${o}T12:00:00`);n.setMonth(n.getMonth()-t);let s=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;return e.filter(r=>r.clase!=="deuda"&&!r.compra&&r.valor>0&&(a.get(r.id)??0)<r.valor).filter(r=>!r.precioRevisado||r.precioRevisado<=s).map(r=>({metaId:r.id,nombre:r.nombre,revisado:r.precioRevisado??null,enDolares:r.enDolares===!0}))}var ka="gestiondinerotrabajo.respaldo-github",An="respaldo.json";function ea(){try{let e=localStorage.getItem(ka);return e?JSON.parse(e):null}catch{return null}}function Te(e){try{e?localStorage.setItem(ka,JSON.stringify(e)):localStorage.removeItem(ka)}catch{}}function nt(e,a){return!!e&&!!e.repo.trim()&&!!e.token.trim()&&e.ultimo!==a}function qn(e){let a=new TextEncoder().encode(e),o="";for(let t=0;t<a.length;t+=32768)o+=String.fromCharCode(...a.subarray(t,t+32768));return btoa(o)}function tt(e){return e===401?"la llave de GitHub no sirve o ya venci\xF3: crea otra y p\xE9gala en Ajustes":e===403?"la llave no tiene permiso para escribir en ese repositorio (Contents: Read and write)":e===404?"no encuentro el repositorio: revisa el nombre, o que la llave tenga acceso a \xE9l":e===409||e===422?"GitHub rechaz\xF3 la copia; se intenta otra vez ma\xF1ana":`GitHub respondi\xF3 ${e}`}async function st(e,a,o,t=fetch){let n=`https://api.github.com/repos/${e.repo.trim()}/contents/${An}`,s={Authorization:`Bearer ${e.token.trim()}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},r=await t(n,{headers:s}),i;if(r.ok)i=(await r.json()).sha;else if(r.status!==404)throw new Error(tt(r.status));let c=await t(n,{method:"PUT",headers:{...s,"Content-Type":"application/json"},body:JSON.stringify({message:`Respaldo ${o}`,content:qn(a),...i?{sha:i}:{}})});if(!c.ok)throw new Error(tt(c.status))}var wn=3,On=45,za=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`,rt=(e,a)=>{let o=new Date(e.getTime());return o.setDate(o.getDate()+a),o};function it(e,a,o,t,n=12){let s=new Set(a.filter(c=>!!c.fechaRadicacion).map(c=>$a(c.periodo,o.filter(d=>d.cuentaDeCobroId===c.id))).filter(c=>!!c)),r=ee().length,i=[];for(let c=-1;c<n;c++){let d=new Date(e.getFullYear(),e.getMonth()+c,1),u=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`,p=Sa(d.getFullYear(),d.getMonth()+1).fecha;i.push({periodo:u,mes:d.toLocaleDateString("es-CO",{month:"long",year:"numeric"}),fechaLimite:za(p),fechaLimiteTexto:p.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long"}),desde:za(rt(p,-wn)),hasta:za(rt(p,On)),radicada:s.has(u),soportesListos:(t[u]??[]).filter(g=>ee().some(h=>h.id===g)).length,soportesTotal:r})}return i}var ct=new Intl.NumberFormat("es-CO"),Ha=e=>`$${ct.format(Math.round(e))}`;function lt(e,a,o){let t=[];return t.push(`${e.clase==="deuda"?"\u26A0\uFE0F ":""}${e.nombre.trim()||"(sin nombre)"}`),t.push(Ha(e.valor)),e.compra?t.push("ya la compraste"):a?.yaEstabaPagada?t.push("ya est\xE1 pagada"):o?t.push(o):t.push("sin fecha todav\xEDa"),t.join(" \xB7 ")}function dt(e,a){let o=e.tipo==="porcentaje"?`${jn(e.valor*100)} %${a?` = ${Ha(a)}`:""}`:Ha(e.valor),t=e.modo==="cada_pago"?"cada pago":e.modo==="puntual"?"puntual":e.modo==="primer_pago"?"solo el primero":String(e.modo),n=[e.nombre.trim()||"(sin nombre)",o,t];return(e.cambios?.length??0)>0&&n.push(`${e.cambios.length} cambio${e.cambios.length===1?"":"s"}`),n.join(" \xB7 ")}function jn(e){return Number.isInteger(e)?String(e):ct.format(Math.round(e*10)/10)}function pt(e,a){let o=new Map(a.map(s=>[s.metaId,s])),t=e.filter(s=>!s.compra&&!o.get(s.id)?.yaEstabaPagada&&s.valor>0),n=null;for(let s of t){let r=o.get(s.id)?.pagoFin??null;r!==null&&(!n||r<n.pagoFin)&&(n={meta:s,pagoFin:r})}return n||(t.length>0?{meta:t[0],pagoFin:null}:null)}function aa(e,a){return e.compra||e.valor<=0?1:Math.max(0,Math.min(1,a/e.valor))}function mt(e,a){let o=2*Math.PI*a,t=e.reduce((s,r)=>s+Math.max(0,r),0),n=0;return e.map(s=>{let r=t>0?Math.max(0,s)/t*o:0,i={largo:r,desde:n};return n+=r,i})}var ut={obligacion:0,meta:1,gasto:2,ahorro:3,"sin-asignar":4};function gt(e,a,o){let t=new Set(o.map(u=>u.id)),n=new Set(o.map(u=>u.nombre)),s=(u,p)=>u&&a.has(u)?"meta":u&&t.has(u)||n.has(p)?"obligacion":u?"meta":"gasto",r=e.real??e.simulado;if(!r)return null;let i=e.real!==null,c=r.detalle.filter(u=>u.monto>0).map(u=>({nombre:u.nombre,monto:u.monto,tipo:i?s(u.refId,u.nombre):u.refId?"meta":"obligacion"}));r.alAhorro>0&&c.push({nombre:"Queda guardado",monto:r.alAhorro,tipo:"ahorro"}),e.real&&e.real.sinAsignar>0&&c.push({nombre:"Sin repartir todav\xEDa",monto:e.real.sinAsignar,tipo:"sin-asignar"}),c.sort((u,p)=>ut[u.tipo]-ut[p.tipo]||p.monto-u.monto);let d=c.reduce((u,p)=>u+p.monto,0);return d<=0?null:{mes:e.mes,esReal:i,total:d,trozos:c}}function bt(e){let a=e.filter(o=>o.real||o.simulado);return(a.find(o=>o.estado==="actual")??a.find(o=>o.estado==="futuro")??a[a.length-1])?.mes??null}function ft(e,a,o,t,n){let s=new Map(a.map(c=>[c.metaId,c])),r=new Map,i=new Map;for(let c of[...t].sort((d,u)=>d.mes.localeCompare(u.mes)))for(let d of c.real?.detalle??[])!d.refId||d.monto<=0||(r.has(d.refId)||r.set(d.refId,c.mes),i.set(d.refId,c.mes));return e.map(c=>{let d=s.get(c.id),u={metaId:c.id,nombre:c.nombre.trim()||"(sin nombre)",esDeuda:c.clase==="deuda"},p=d?.pagoInicio!=null?n(d.pagoInicio):null,g=r.get(c.id)??p;if(c.compra)return{...u,desde:null,hasta:c.compra.mes,estado:"comprada"};if(aa(c,o.get(c.id)??0)>=1){let h=i.get(c.id)??null;return{...u,desde:r.get(c.id)??h,hasta:h,estado:"lista"}}return d?.pagoFin!=null?{...u,desde:g,hasta:n(d.pagoFin),estado:"en-curso"}:{...u,desde:g,hasta:null,estado:g?"no-alcanza":"sin-fecha"}})}function ht(e,a){if(e>a)return[];let o=[],[t,n]=e.split("-").map(Number);for(let s=0;s<240;s++){let r=`${t}-${String(n).padStart(2,"0")}`;if(o.push(r),r===a)break;n++,n>12&&(n=1,t++)}return o}function vt(e,a){if(a.campo===We)return{ok:!1,motivo:"Un borrado no se puede deshacer desde aqu\xED: vuelve a crear esa fila."};if(a.campo==="id")return{ok:!1,motivo:"El identificador de una fila no se cambia."};let o=Nn(e,a);if(!o)return{ok:!1,motivo:"Eso ya no est\xE1 en este aparato."};let t=Fn(a);return a.valor===void 0?delete o[t]:o[t]=a.valor,{ok:!0}}function Fn(e){return e.tabla==="soportes"?e.id:e.campo}function Nn(e,a){let o=t=>t.find(n=>n.id===a.id)??null;switch(a.tabla){case"escenario":return e.escenario;case"metas":return o(e.metas);case"obligaciones":return o(e.obligaciones);case"cuentas":return o(e.cuentas);case"ingresos":return o(e.ingresos);case"repartos":return o(e.repartos);case"soportes":return a.campo==="nota"?e.notasDelMes??={}:a.campo!=="marcados"?null:e.soportesMarcados;default:return null}}var _n=new Intl.NumberFormat("es-CO"),b=e=>`$${_n.format(Math.round(e))}`,l,y=null;function j(e=new Date){let a=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${a}-${o}`}function m(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}var v=new Map;function xt(e){if(!(e instanceof HTMLInputElement)&&!(e instanceof HTMLSelectElement))return null;let a=[e.id&&`#${e.id}`,e.dataset.accion&&`[data-accion="${e.dataset.accion}"]`,e.dataset.id&&`[data-id="${e.dataset.id}"]`,e.dataset.campo&&`[data-campo="${e.dataset.campo}"]`,e.dataset.tipo&&`[data-tipo="${e.dataset.tipo}"]`,e.dataset.i!==void 0&&`[data-i="${e.dataset.i}"]`].filter(Boolean);return a.length>0?a.join(""):null}var oa=null,Ga=null,qe=!1,he=!1;var ia=null,H=null,kn=6,sa=!1;function zn(e){let o=window.innerHeight;e<90?window.scrollBy({top:-Math.max(6,(90-e)/3),behavior:"instant"}):e>o-90&&window.scrollBy({top:Math.max(6,(e-(o-90))/3),behavior:"instant"})}function Rt(e,a){return document.elementFromPoint(e,a)?.closest?.("tr[data-fila]")??null}function Hn(e){for(let a of document.querySelectorAll(".destino"))a.classList.remove("destino");e&&Number(e.dataset.fila)!==H?.desde&&e.classList.add("destino")}function Ct(){H?.fila.classList.remove("arrastrando");for(let e of document.querySelectorAll(".destino"))e.classList.remove("destino");H=null}document.addEventListener("pointerdown",e=>{let a=e.target?.closest?.(".asa"),o=a?.closest("tr[data-fila]");!a||!o||(H={desde:Number(o.dataset.fila),fila:o,movido:!1,y0:e.clientY},o.classList.add("arrastrando"),a.setPointerCapture?.(e.pointerId),e.preventDefault())});document.addEventListener("pointermove",e=>{H&&(!H.movido&&Math.abs(e.clientY-H.y0)<kn||(H.movido=!0,e.preventDefault(),zn(e.clientY),Hn(Rt(e.clientX,e.clientY))))});document.addEventListener("pointerup",e=>{if(!H)return;let{desde:a,movido:o}=H,t=Rt(e.clientX,e.clientY);if(Ct(),!o||!t)return;sa=!0,setTimeout(()=>{sa=!1},0);let n=Number(t.dataset.fila);if(!Number.isInteger(n)||n===a)return;let[s]=l.metas.splice(a,1);l.metas.splice(n,0,s),y={texto:`\xAB${s.nombre}\xBB qued\xF3 en la posici\xF3n ${n+1}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron.`,malo:!1},E()});document.addEventListener("pointercancel",()=>{H&&(Ct(),x())});document.addEventListener("mousedown",e=>{let a=e.target;qe=a?.closest("button[data-accion]")!==null&&a?.closest("button[data-accion]")!==void 0,oa=xt(a?.closest("input, select")??null),Ga=a?.closest?.("[data-panel]")?.dataset.panel??null},!0);document.addEventListener("mouseup",()=>{setTimeout(()=>{qe=!1,Ga=null,he&&(he=!1,Ae())},0)},!0);function Vn(e,a){let o=oa!==null,t=oa??e;if(oa=null,!t)return;let n=document.querySelector(t);if(n&&(n.focus(),!o&&a!==null&&typeof n.setSelectionRange=="function"))try{n.setSelectionRange(a,a)}catch{}}function V(){Pt()||Ae()}function E(){Pt()||x()}function Pt(){let e=be(l);return e&&(y={texto:`No pude guardar: ${e}`,malo:!0}),qe?(he=!0,!0):!1}function F(){let e=l.escenario;return{desde:new Date(`${e.fechaPrimerPago}T12:00:00`),diasOptimista:e.diasOptimista,diasPesimista:e.diasPesimista}}function Bn(){let e=0,a=[...l.ingresos].sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o=0;o<a.length;o++)e=Math.max(e,ke(a[o],a.slice(0,o)));return e+1}function Qa(){let e=l.escenario;return{nombre:e.nombre,desdePago:Bn(),ingresoEsperado:e.ingresoEsperado,cambiosIngreso:e.cambiosIngreso,obligaciones:l.obligaciones,colchon:{nombre:"Otros / Ahorro",base:e.colchonBase,minimo:e.colchonMinimo,elastico:e.colchonElastico,sobranteAMetas:e.sobranteAMetas!==!1,cambios:e.cambiosColchon},metas:Da(l.metas,l.repartos)}}function $t(e){return`${((e==="ahorro"?l.escenario.cambiosColchon:l.escenario.cambiosIngreso)??[]).map((t,n)=>`<div class="cambio">
      <span class="rango">desde</span>
      ${ca(t.desdePago,`data-accion="cambio-escenario" data-cual="${e}" data-i="${n}" data-campo="desdePago"`,"Desde qu\xE9 mes")}
      <input type="text" inputmode="numeric" data-dinero value="${I(t.valor)}"
        class="corto-dinero" data-accion="cambio-escenario" data-cual="${e}" data-i="${n}" data-campo="valor" />
      <button class="icono" data-accion="borrar-cambio-escenario" data-cual="${e}" data-i="${n}" title="Quitar">\u2715</button>
    </div>`).join("")}<button class="chico" data-accion="nuevo-cambio-escenario" data-cual="${e}">+ cambio</button>`}function Gn(){let e=l.escenario;return`
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
        ${$t("ingreso")}
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
        ${$t("ahorro")}
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
           recorta \u2014 pero nunca por debajo de ${b(e.colchonMinimo)}. Solo para cerrar, nunca
           para abonar a medias.</span>`:""}
    </p>
    ${e.diasPesimista>e.diasOptimista?`<p class="nota rango">
      Los dos campos de d\xEDas son <strong>de pago a pago</strong>, no un retraso de una vez.
      Con ${e.diasPesimista} d\xEDas, el pago ${ba(F())?10:12} caer\xEDa
      ${(()=>{let a=F();return`<strong>${Math.round(11*(e.diasPesimista-e.diasOptimista)/30)} meses</strong> m\xE1s tarde que si fueran puntuales`})()}.
    </p>`:""}
  </section>`}var Qn={cada_pago:"Cada pago",primer_pago:"Solo el primer pago",puntual:"Puntual: cuando yo la marque"},It={siempre:"asumo que la pago siempre",cada_dos_pagos:"asumo un pago s\xED y otro no",nunca:"asumo que no la pago"},Tt=0;function ca(e,a,o,t){let n=F(),s=Xo(Wo(Tt,e),i=>T(i,n).optimista),r=s.find(i=>i.numero===e);return Lt(`<select class="lista-meses" tabindex="-1" data-titulo="${m(o)}" ${a}>
    ${t!==void 0?`<option value="" data-corto="${m(t)}" ${e?"":"selected"}>${m(t)}</option>`:""}
    ${s.map(i=>`<option value="${i.numero}" data-anio="${i.anio}" data-mes="${m(i.mes)}"
        data-vez="${m(i.vez)}" data-corto="${m(i.corto)}" ${i.numero===e?"selected":""}>${m(i.rotulo)}</option>`).join("")}
  </select>`,r?.rotulo??t??"\u2014",r?.corto??t??"\u2014")}function Lt(e,a,o){return`<span class="selector-mes">${e}<button type="button" class="boton-mes" data-accion="abrir-meses">
    <span class="mes-largo">${m(a)}</span><span class="mes-corto">${m(o)}</span><i>\u25BE</i></button></span>`}function At(e,a,o){return ca(e??1,`data-accion="${a}" data-id="${o}" data-campo="desdePago"`,"Empieza en")}function la(){let e=l.cuentas.filter(a=>a.montoEsperado>0);if(e.length>0){let a=e.reduce((o,t)=>t.periodo.localeCompare(o.periodo)>0?t:o);return{monto:a.montoEsperado,de:a.periodo,esReal:!0}}return{monto:l.escenario.ingresoEsperado,de:"lo que esperas por pago",esReal:!1}}function Yn(e){let a=la();if(a.monto<=0)return'<span class="rango">\u2014</span>';let o=e.tipo==="porcentaje"?De(a.monto,e.valor):e.valor;return`<span class="calculado">${b(o)}</span>`}function Un(e){let a=e.cambios??[];if(a.length===0)return"";let o=e.tipo==="porcentaje",t=(n,s)=>`<span class="cambio">
      <span class="rango">desde</span>
      ${ca(n.desdePago,`data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="desdePago"`,"Desde qu\xE9 mes")}
      <span class="rango">pasa a</span>
      ${o?`<input type="number" min="0" max="100" step="0.5" value="${n.valor*100}" class="corto"
             data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" /><span class="rango">%</span>`:`<input type="text" inputmode="numeric" data-dinero value="${I(n.valor)}"
             class="corto-dinero" data-accion="cambio" data-id="${e.id}" data-i="${s}" data-campo="valor" />`}
      <button class="icono" data-accion="borrar-cambio" data-id="${e.id}" data-i="${s}"
        title="Quitar este cambio">\u2715</button>
    </span>`;return`<tr class="fila-cambios" data-hija-de="${e.id}">
    <td colspan="9"><span class="rango">${m(e.nombre)} \xB7</span>
      ${a.map(t).join("")}</td>
  </tr>`}function qt(e,a,o){let t=a?.trim(),n=La(o);return!t&&!n?"":`<tr class="fila-nota" data-hija-de="${e}">
    <td colspan="9">
      ${t?`<span class="texto-nota">\u{1F4DD} ${m(t)}</span>`:""}
      ${n?`${t?"<br />":""}<a href="${m(n)}" target="_blank" rel="noopener noreferrer"
        data-enlace>\u{1F517} ${m(new URL(n).hostname.replace(/^www\./,""))}</a>`:""}
    </td>
  </tr>`}function Jn(e){let a=e.modo==="puntual",o=la(),t=o.monto>0&&e.tipo==="porcentaje"?De(o.monto,e.valor):null;return`
  <tr data-id-fila="${e.id}" data-resumen="${m(dt(e,t)+(e.nota?.trim()?" \xB7 \u{1F4DD}":""))}"
      class="${e.id===ia?"abierta":""}">
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
    <td class="num">${Yn(e)}</td>
    <td class="desde">${At(e.desdePago,"oblig",e.id)}</td>
    <td>
      <select data-accion="oblig" data-id="${e.id}" data-campo="modo">
        ${Object.entries(Qn).map(([n,s])=>`<option value="${n}" ${e.modo===n?"selected":""}>${s}</option>`).join("")}
      </select>
    </td>
    <td>
      ${a?`<select data-accion="oblig" data-id="${e.id}" data-campo="supuesto">
        ${Object.entries(It).map(([n,s])=>`<option value="${n}" ${(e.supuesto??"siempre")===n?"selected":""}>${s}</option>`).join("")}
      </select>`:'<span class="rango">\u2014</span>'}
    </td>
    <td class="num">
      <button class="icono ${e.nota?.trim()?"con-nota":""}" data-accion="nota-oblig" data-id="${e.id}"
        title="${e.nota?.trim()?"Editar la nota":"Escribir una nota"}">\u{1F4DD}</button>
      <button class="icono" data-accion="borrar-oblig" data-id="${e.id}" title="Quitar">\u2715</button></td>
  </tr>`}function Va(e,a){return pe(e,a,l.obligaciones,{nombre:"",base:0,minimo:0,elastico:!1},[],new Map,0).obligaciones.reduce((t,n)=>t+n.monto,0)}function Xn(){let e=la();if(e.monto<=0)return"";let a=Va(1,e.monto),o=Va(2,e.monto),t=(s,r)=>`
    <div><span class="rotulo">${s}</span>
      <span class="valor">${b(e.monto-r)}</span>
      <span class="rotulo">libre para metas \xB7 se van ${b(r)}</span></div>`,n=e.esReal?`Calculado sobre <strong>${m(e.de)}</strong>: ${b(e.monto)}, que es lo que
       esperas cobrar de verdad. Si no hubiera cuenta de cobro registrada, saldr\xEDa del
       escenario de arriba.`:`Calculado sobre el escenario de arriba (${b(e.monto)}), que es una <em>suposici\xF3n</em>.
       En cuanto registres una cuenta de cobro, esta cifra sale de ah\xED.`;return`<div class="resumen resumen-oblig">
    ${t("En el primer pago",a)}
    ${a!==o?t("En los siguientes",o):""}
  </div>
  <p class="nota ${e.esReal?"":"aviso"}">${n}</p>`}function Wn(){let e=l.obligaciones.filter(a=>a.modo==="puntual");return l.obligaciones.length===0?`
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
        <tbody>${l.obligaciones.map(a=>Jn(a)+Un(a)+qt(a.id,a.nota)).join("")}</tbody>
      </table>
    </div>
    ${Xn()}
    <p class="nota"><button data-accion="nueva-oblig">+ Agregar obligaci\xF3n</button>
      ${jt("obligaciones")}
      ${Ot("obligaciones")}</p>
    ${e.length?`<p class="nota aviso">
      Las puntuales no se pueden adivinar. Para calcular las fechas
      ${e.map(a=>`<strong>${m(a.nombre)}</strong>: ${It[a.supuesto??"siempre"]}`).join(" \xB7 ")}.
    </p>`:""}
  </section>`}function Kn(e){if(!e.compra)return`<button data-accion="comprada" data-id="${e.id}">Ya la compr\xE9</button>`;let a=e.compra.precioReal-e.valor;return`<span class="completa">${m(z(e.compra.mes))}</span>
    <span class="rango">${b(e.compra.precioReal)}${a===0?"":a<0?` \xB7 ${b(-a)} menos`:` \xB7 ${b(a)} m\xE1s`}</span>
    <button class="icono" data-accion="no-comprada" data-id="${e.id}" title="No la compr\xE9">\u2715</button>`}var Ba=new Map;function Zn(e){if(e.clase==="deuda"||e.compra||(Ba.get(e.id)??0)>=e.valor)return"";let a=_a([e],Ba,j()).length>0,o=e.precioRevisado?`revisado ${N(e.precioRevisado.slice(0,7))} ${e.precioRevisado.slice(0,4)}`:"sin revisar";return`<div class="marca-precio ${a?"vieja":""}">
    <span>${a?"\u26A0\uFE0F ":""}${m(o)}</span>
    ${a?`<button class="chico" data-accion="precio-sigue" data-id="${e.id}" title="El precio sigue igual: marcarlo revisado hoy">\u2713 sigue igual</button>`:""}
    <button class="chico ${e.enDolares?"activo":""}" data-accion="meta-dolares" data-id="${e.id}"
      title="${e.enDolares?"Est\xE1 en d\xF3lares: se mueve con la tasa":"Marcar que el precio es en d\xF3lares"}">US$</button>
  </div>`}function wt(){let e=new Map([...U(l.metas,l.repartos)].map(([n,s])=>[n,s.total])),a=ot(l.metas,l.repartos,l.ingresos,e,j().slice(0,7)),o=_a(l.metas,e,j());if(a.length===0&&o.length===0)return"";let t=o.filter(n=>!n.revisado).length;return`<div class="avisos-metas">
    ${a.map(n=>`<p class="aviso-meta quieta">\u23F8\uFE0F <strong>${m(n.nombre)}</strong> lleva ${n.meses} meses sin recibir
      <span class="rango">\xB7 \xFAltimo abono en ${m(z(n.ultimoMes))}</span></p>`).join("")}
    ${o.length?`<p class="aviso-meta precio">\u{1F3F7}\uFE0F ${o.length} ${o.length===1?"precio":"precios"} para revisar
      <span class="rango">\xB7 ${t?`${t} sin revisar nunca`:""}${t&&o.length>t?" \xB7 ":""}${o.length>t?`${o.length-t} de hace m\xE1s de 3 meses`:""}
      ${o.some(n=>n.enDolares)?" \xB7 los de d\xF3lares dependen de la tasa":""}</span></p>`:""}
  </div>`}function es(e){let a=U(l.metas,l.repartos).get(e.id),o=a.previo>0&&a.real>0&&Math.abs(a.previo-a.real)<=Math.max(1e3,a.real*.05),t=`<input type="text" inputmode="numeric" data-dinero value="${I(a.previo)}"
      title="Lo que ya le hab\xEDas abonado a esta meta ANTES de empezar a usar el programa"
      data-accion="meta" data-id="${e.id}" data-campo="abonado" />`;return a.real===0?t:`${t}
    <span class="rango">+ ${b(a.real)} de lo real</span>
    <span class="${a.falta===0?"completa":""}">= ${b(a.total)}</span>
    ${o?`<span class="aviso">\u26A0\uFE0F ${b(a.previo)} escrito a mano y ${b(a.real)}
      registrado: \xBFes el mismo dinero?
      <button class="icono" data-accion="quitar-previo" data-id="${e.id}"
        title="S\xED, dejar solo lo registrado">\u2713</button></span>`:""}`}function Ot(e){return`<span class="solo-telefono plegado-todo">
    <button class="chico" data-accion="desplegar-todo" data-lista="${e}">Desplegar todo</button>
    <button class="chico" data-accion="plegar-todo" data-lista="${e}">Plegar todo</button>
  </span>`}function jt(e){if((e==="metas"?l.metas.length:l.obligaciones.length)<2)return"";let o=e==="metas"?' title="Ojo: en las metas el orden es la prioridad de pago, as\xED que esto cambia el plan"':"";return`&nbsp; <span class="rango">Ordenar por</span>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="nombre"${o}>nombre</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="valor"${o}>valor</button>
    <button class="chico-linea" data-accion="ordenar" data-lista="${e}" data-por="grupo"${o}>grupo</button>`}function as(e,a,o,t,n){return`
  <tr data-fila="${a}" data-id-fila="${e.id}"
      data-resumen="${m(lt(e,n,t)+(e.nota?.trim()||e.link?" \xB7 \u{1F4DD}":""))}"
      class="${e.clase==="deuda"?"es-deuda":""} ${e.id===ia?"abierta":""}">
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
        data-accion="meta" data-id="${e.id}" data-campo="valor" />${Zn(e)}</td>
    <td><input value="${m(e.grupo??"")}" placeholder="ninguno"
        data-accion="meta" data-id="${e.id}" data-campo="grupo" /></td>
    <td class="desde">${At(e.desdePago,"meta",e.id)}
      <div class="plazo"><span class="rango">la quiero antes de</span>
        ${ca(e.antesDelPago,`data-accion="meta" data-id="${e.id}" data-campo="antesDelPago" title="Solo para avisarte: no cambia el orden de pago"`,"La quiero antes de","\u2014")}</div>
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
        ${e.enCuotas&&e.enCuotas>0&&!e.maximoPorPago?`\xB7 ${b(Math.ceil(e.valor/Math.round(e.enCuotas)))} c/u`:""}</span>
    </td>
    <td class="num pagado">${es(e)}</td>
    <td class="compra">${Kn(e)}</td>
    <td class="num">
      <button class="icono" data-accion="duplicar-meta" data-id="${e.id}" title="Duplicar">\u29C9</button>
      <button class="icono" data-accion="borrar-meta" data-id="${e.id}" title="Quitar">\u2715</button>
    </td>
  </tr>
  ${qt(e.id,e.nota,e.link)}`}function os(e){let a=new Map([...U(l.metas,l.repartos)].map(([n,s])=>[n,s.total])),o=Na(l.metas,a),t=(n,s,r="")=>`<span class="total-clase ${r}">${n}
    <strong>${b(s.valor)}</strong>${s.pagado>0?` <span class="rango">\xB7 llevas <strong class="completa">${b(s.pagado)}</strong> \xB7 faltan ${b(Math.max(0,s.valor-s.pagado))}</span>`:""}</span>`;if(o.deudas.cuantas===0){let n=go(l.metas,l.repartos);return` &nbsp; Suma de todas: <strong>${b(e)}</strong>${n===0?"":` &nbsp; Llevas pagado:
      <strong class="completa">${b(n)}</strong> <span class="rango">\xB7 te faltan ${b(Math.max(0,e-n))}</span>`}`}return`<span class="totales-clase">${t("Debes",o.deudas,"es-deuda")}${t("Quieres comprar",o.compras)}</span>`}function ts(e){Ba=new Map([...U(l.metas,l.repartos)].map(([n,s])=>[n,s.total]));let a=F(),o=new Map((e?.metas??[]).map(n=>[n.metaId,{res:n,cuando:n.pagoFin!==null?de(T(n.pagoFin,a)):null}]));if(l.metas.length===0)return`
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
        <tbody>${l.metas.map((n,s)=>{let r=o.get(n.id);return as(n,s,l.metas.length,r?.cuando??null,r?.res??null)}).join("")}</tbody>
      </table>
    </div>
    <p class="nota">
      <button data-accion="nueva-meta">+ Agregar meta</button>
      ${jt("metas")}
      ${Ot("metas")}
      ${os(t)}
      ${wt()}
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
  </section>`}var Ft={tranquilo:"",pronto:"aviso",hoy:"urgente",vencido:"malo"};function ns(){let e=new Date,a=l.soportesMarcados[Se(e)]??[],o=Ra(e,a),t=Ft[o.urgencia],n=r=>{let i=a.includes(r.id);return`<li class="soporte ${i?"listo":""}">
      <label class="interruptor">
        <input type="checkbox" data-accion="soporte" data-id="${r.id}" ${i?"checked":""} />
        <span>${m(r.nombre)}${r.obligatorioExplicito?' <strong class="pendiente">OBLIGATORIO</strong>':""}</span>
      </label>
      ${r.detalle?`<p class="nota">${m(r.detalle)}</p>`:""}
    </li>`},s=xa.filter(r=>r.frecuencia!=="cada_mes");return`
  <section class="panel radicacion ${t}">
    <h2><span class="etiqueta real">Real</span> Radicar la cuenta de cobro
      <span class="sufijo">\u2014 qu\xE9 d\xEDa y con qu\xE9 papeles</span></h2>
    <p class="titular ${t}">${m(o.titular)}</p>
    <p class="nota">${m(Eo(o.limite))}
      ${o.limite.usoUltimoDiaDelMes?`<br /><span class="rango">${m(Do)}</span>`:""}
    </p>
    <ul class="soportes">${ee().map(n).join("")}</ul>
    <p class="nota">
      Ya entregados una sola vez y no hay que repetirlos:
      ${s.filter(r=>r.frecuencia==="una_sola_vez").map(r=>m(r.nombre)).join(" \xB7 ")}.
      La constancia firmada por el paciente es solo para personal asistencial.
    </p>
  </section>`}function ss(){let e=Me(l.cuentas,l.ingresos),a=ao(e),o=new Map(a.map(s=>[s.cuentaId,s])),t=oo(a),n=Ka(e);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> Lo que te deben y lo que te han pagado
      <span class="sufijo">\u2014 una fila por mes cobrado</span></h2>
    ${l.cuentas.length===0?`<div class="vacio">A\xFAn no has registrado ninguna cuenta de cobro.<br />
         Sirve para llevar cu\xE1nto te deben cuando te pagan a medias.
         <p><button data-accion="nueva-cuenta">+ Registrar una cuenta de cobro</button></p></div>`:`<div class="tabla-ancha"><table>
          <thead><tr><th>Periodo</th><th class="num">Esperado</th><th class="num">Recibido</th>
            <th class="num">Falta</th><th>Estado</th><th></th></tr></thead>
          <tbody>${e.map(s=>`
            <tr>
              <td><input class="ancho" value="${m(s.cuenta.periodo)}"
                    data-accion="cuenta" data-id="${s.cuenta.id}" data-campo="periodo" />
                  <div class="radicada"><span class="rango">radicada el</span>
                    <input type="date" value="${m(s.cuenta.fechaRadicacion??"")}"
                      data-accion="cuenta" data-id="${s.cuenta.id}" data-campo="fechaRadicacion" /></div></td>
              <td class="num"><input type="text" inputmode="numeric" data-dinero value="${I(s.cuenta.montoEsperado)}"
                    data-accion="cuenta" data-id="${s.cuenta.id}" data-campo="montoEsperado" /></td>
              <td class="num">${b(s.recibido)}</td>
              <td class="num ${s.pendiente>0?"pendiente":"completa"}">
                ${s.pendiente>0?b(s.pendiente):"\u2014"}</td>
              <td class="rango">${m(eo(s).split(": ").slice(1).join(": "))}${(()=>{let r=o.get(s.cuenta.id);return!r||r.diasPrimero===null?"":`<br /><span class="demora">primer pago a los ${r.diasPrimero} d\xEDas${r.diasCompleto!==null&&r.diasCompleto!==r.diasPrimero?` \xB7 completa a los ${r.diasCompleto}`:""}</span>`})()}</td>
              <td class="num">
                ${Za(s)?`<button data-accion="abonar" data-id="${s.cuenta.id}">+ Registrar pago</button>`:'<span class="completa">\u2713 completa</span>'}
                <button class="icono" data-accion="borrar-cuenta" data-id="${s.cuenta.id}">\u2715</button>
              </td>
            </tr>
            ${s.ingresos.map(r=>`<tr class="componente">
              <td>${m(r.fecha)}</td><td class="num"></td><td class="num">${b(r.monto)}</td>
              <td colspan="2" class="rango">pago recibido</td>
              <td class="num"><button class="icono" data-accion="borrar-ingreso" data-id="${r.id}">\u2715</button></td>
            </tr>`).join("")}`).join("")}
          </tbody>
        </table></div>
        ${t.primero!==null?`<p class="nota demoras">\u23F1\uFE0F Con ${t.cuentas} ${t.cuentas===1?"cuenta radicada":"cuentas radicadas"},
          el primer pago te llega en promedio a los <strong>${t.primero} d\xEDas</strong> de radicar${t.completo!==null?` y la cuenta queda completa a los <strong>${t.completo}</strong>`:""}.</p>`:a.length===0?'<p class="nota rango">Pon la fecha en que radicaste cada cuenta y aqu\xED ver\xE1s cu\xE1nto se demoran de verdad en pagarte.</p>':""}
        <p class="nota"><button data-accion="nueva-cuenta">+ Registrar otra cuenta</button>
        ${n.length?` &nbsp; <span class="pendiente">Te deben en total ${b(je(e))}</span>`:""}</p>`}
  </section>`}function Dt(e,a,o,t,n,s,r,i,c=""){let d=F(),u=o===null||t===null?"\u2014":`${de({optimista:T(o,d).optimista,pesimista:T(t,d).optimista})}${n===null?"":` \xB7 ${n} ${n===1?"pago":"pagos"}`}`,p=t!==null?T(t,d):null,g=t!==null?ue(T(t,d)):i?"ya la ten\xEDas pagada":"sin terminar",h=r?`<span class="completa">${b(a)}</span>`:`<span class="pendiente">${b(s)} de ${b(a)}</span>`;return`<tr class="${c}">
    <td class="meta-nombre">${m(e)}</td>
    <td class="num">${h}</td>
    <td class="rango">${u}</td>
    <td class="cuando">${p?`<span class="fecha-larga-meta">${m(g)}</span><span class="fecha-corta-meta">${m(de(p))}</span>`:m(g)}</td>
  </tr>`}function rs(){if(l.metas.length===0)return null;try{return ge(Qa())}catch{return null}}function is(e){if(l.metas.length===0)return`<section class="panel simulado">
      <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
      <div class="vacio">Agrega tus metas arriba y aqu\xED aparecen las fechas.</div>
    </section>`;if(!e)return`<section class="panel simulado"><h2>Simulaci\xF3n</h2>
      <p class="nota aviso">No pude calcular la proyecci\xF3n con estos datos.</p></section>`;let a=new Map(bo(e).map(d=>[d.grupo,d])),o=[],t=new Set,n=(d,u="")=>Dt(d.nombre,d.valor,d.pagoInicio,d.pagoFin,d.cantidadPagos,d.totalAbonado,d.completada,d.yaEstabaPagada,u);for(let d of e.metas){if(!d.grupo){o.push(n(d));continue}if(t.has(d.grupo))continue;t.add(d.grupo);let u=a.get(d.grupo);o.push(Dt(u.grupo,u.valor,u.pagoInicio,u.pagoFin,null,u.totalAbonado,u.completado,u.yaEstabaPagado,"grupo"));for(let p of e.metas)p.grupo===d.grupo&&o.push(n(p,"componente"))}let s=e.totalPagos,r=l.escenario,i=F(),c=ue(T(s,i));return`
  <section class="panel simulado">
    <h2><span class="etiqueta simulacion">Simulaci\xF3n</span> Cu\xE1ndo termino cada meta</h2>
    <div class="resumen">
      <div><span class="valor">${e.totalPagos}</span><span class="rotulo">pagos hasta terminarlo todo</span></div>
      <div><span class="valor cuando">${m(c)}</span><span class="rotulo">termina la \xFAltima meta</span></div>
      <div><span class="valor">${b(e.ahorroFinal)}</span><span class="rotulo">ahorro acumulado al final</span></div>
    </div>
    <div class="tabla-ancha">
      <table class="compacta">
        <thead><tr><th>Meta</th><th class="num">Abonado</th><th>Pagos</th><th>Cu\xE1ndo</th></tr></thead>
        <tbody>${o.join("")}</tbody>
      </table>
    </div>
    <p class="nota aviso">
      Esto es una simulaci\xF3n, no un hecho: supone que te entran ${b(r.ingresoEsperado)} por pago.
      ${ba(i)?`Las fechas son de <strong>una sola posibilidad</strong>: pagos puntuales cada
           ${r.diasOptimista} d\xEDas, sin contar atrasos. Sube \xABd\xEDas si se atrasan\xBB
           por encima de ${r.diasOptimista} y vuelven a salir como rango.`:`El \xABcu\xE1ndo\xBB va de puntual (cada ${r.diasOptimista} d\xEDas) a atrasado (cada ${r.diasPesimista}).`}
      ${e.incompleta?"<br /><strong>Con ese ingreso no alcanza a terminar.</strong>":""}
    </p>
    ${ds(e)}
    ${ls()}
    ${cs(e)}
  </section>`}var se=null;function cs(e){let a=F(),o=n=>n===null?"no alcanza":de({optimista:T(n,a).optimista,pesimista:T(n,a).optimista}),t="";if(se!==null){let n=null;try{n=ge({...Qa(),ingresoEsperado:se,cambiosIngreso:void 0})}catch{n=null}if(!n)t='<p class="nota aviso">Con esa cifra no pude calcular la proyecci\xF3n.</p>';else{let s=Zo(e.metas,n.metas),r=s.filter(i=>i.antes!==i.despues);t=`
        <p class="rango">La \xFAltima meta: <strong>${m(o(e.totalPagos||null))}</strong> \u2192
          <strong>${m(n.incompleta?"no alcanza":o(n.totalPagos||null))}</strong>
          \xB7 ${r.length===0?"ninguna meta cambia de mes":`${r.length} ${r.length===1?"meta cambia":"metas cambian"}, ${s.length-r.length} igual`}</p>
        ${r.length?`<ul class="lista-si">${r.map(i=>{let c=et(i);return`<li class="${c===null?"mal":c>0?"tarde":"antes"}"><strong>${m(i.nombre)}</strong>
            <span>${m(o(i.antes))} \u2192 ${m(o(i.despues))}</span>
            <em>${c===null?"":c>0?`+${c} ${c===1?"mes":"meses"}`:`${c} ${c===-1?"mes":"meses"}`}</em></li>`}).join("")}</ul>`:""}`}}return`
    <div class="si-me-entran">
      <h3>\xBFY si me entran otra cifra?</h3>
      <p class="rango">Solo para mirar: no cambia tu escenario ni se guarda.</p>
      <p class="si-campo">Si me entran
        <input type="text" inputmode="numeric" data-dinero data-accion="si-me-entran"
          value="${se!==null?I(se):""}" placeholder="${I(l.escenario.ingresoEsperado)}" />
        por pago ${se!==null?'<button class="chico-linea" data-accion="si-me-entran-quitar">Quitar</button>':""}</p>
      ${t}
    </div>`}function ls(){let e=je(Me(l.cuentas,l.ingresos));if(e<=0)return"";let a=ho(Qa(),e);if(!a)return"";let o=F(),t=n=>ue(T(Math.max(1,n),o));return`<p class="nota ${a.seAdelanta>0?"":"rango"}">
    Te deben <strong class="pendiente">${b(a.pendiente)}</strong>.
    ${a.seAdelanta>0?`Si te los pagaran de una vez, terminar\xEDas <strong>${a.seAdelanta}
         ${a.seAdelanta===1?"pago":"pagos"} antes</strong>: la \xFAltima meta pasar\xEDa de
         ${m(t(a.pagosAhora))} a ${m(t(a.pagosSiPagan))}.`:`Aunque te los pagaran de una vez, las fechas no se mover\xEDan \u2014 el ritmo lo marcan los
         topes por pago que pusiste arriba, no lo que entra.`}
    <br /><span class="rango">Esto es aparte: la proyecci\xF3n de arriba NO cuenta ese dinero
    hasta que lo registres como pago recibido.</span>
  </p>`}function ds(e){let a=fo(e,l.metas);if(a.length===0)return"";let o=F(),t=s=>K(T(Math.max(1,s),o).optimista),n=s=>s.termina===null?`<li class="mal"><strong>${m(s.nombre)}</strong> la quer\xEDas para
        ${m(t(s.queria))} y <strong>no alcanza a terminar</strong> con este ingreso.</li>`:s.seRetrasa===0?`<li class="bien"><strong>${m(s.nombre)}</strong> la quer\xEDas para
        ${m(t(s.queria))} y llega ${s.termina===0?"ya pagada":`en ${m(t(s.termina))}`}.</li>`:`<li class="mal"><strong>${m(s.nombre)}</strong> la quer\xEDas para
      ${m(t(s.queria))} y va para <strong>${m(t(s.termina))}</strong>
      \u2014 ${s.seRetrasa} ${s.seRetrasa===1?"pago":"pagos"} tarde.
      S\xFAbela de posici\xF3n o dale m\xE1s por pago.</li>`;return`<div class="plazos">
    <h3 class="titulo-total">Lo que quer\xEDas para cierta fecha</h3>
    <ul>${a.map(n).join("")}</ul>
    <p class="nota rango">Esto solo avisa: el orden de pago lo pones t\xFA arriba, y el programa
      no lo cambia por su cuenta.</p>
  </div>`}function $e(e){let a=Ne(l.metas),o=l.ingresos.filter(s=>s.fecha<=e.fecha&&s.id!==e.id).sort((s,r)=>s.fecha.localeCompare(r.fecha));for(let s of o){let r=l.repartos.find(i=>i.ingresoId===s.id);for(let i of r?.abonos??[])i.refId&&a.set(i.refId,Math.max(0,(a.get(i.refId)??0)-i.monto))}let t=e.cuentaDeCobroId?!o.some(s=>s.cuentaDeCobroId===e.cuentaDeCobroId):!0,n=l.escenario;return no(e,ke(e,o),l.obligaciones,{nombre:"Otros / Ahorro",base:n.colchonBase,minimo:n.colchonMinimo,elastico:!1,sobranteAMetas:n.sobranteAMetas!==!1},l.metas,a,t)}function us(){let e=ha(l.ingresos,l.repartos);if(e.length===0)return`<section class="panel">
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
        <h3>${m(z(t.mes))}</h3>
        <span class="valor">${b(t.entro)}</span>
        <span class="rotulo">entr\xF3${t.deFuera>0?` \xB7 ${b(t.deFuera)} los pusiste t\xFA`:""}</span>
      </div>
      ${n.map(ps).join("")}
      ${n.length>1?`<div class="total-mes">
        <span>Ese mes: ${b(t.aObligaciones)} en obligaciones \xB7 ${b(t.aMetas)} a metas
        ${t.alAhorro>0?` \xB7 ${b(t.alAhorro)} guardado`:""}</span></div>`:""}
    </div>`}).join(""),o=ro(l.repartos);return`
  <section class="panel">
    <h2><span class="etiqueta real">Real</span> En qu\xE9 se fue la plata
      <span class="sufijo">\u2014 hechos, no suposiciones</span></h2>
    ${a}
    ${o.length>1?`
      <h3 class="titulo-total">En todo lo que llevas</h3>
      <div class="tabla-ancha"><table><tbody>
        ${o.map(t=>`<tr><td class="meta-nombre">${m(t.nombre)}</td>
          <td class="num">${b(t.monto)}</td></tr>`).join("")}
      </tbody></table></div>`:""}
    <p class="nota"><button data-accion="aporte-externo">+ Meter plata de otro lado</button>
      &nbsp; <span class="rango">Para cuando pones de tu bolsillo (Nequi, efectivo) y no viene del trabajo.</span></p>
  </section>`}function ps(e){let a=l.repartos.find(i=>i.ingresoId===e.id),o=l.cuentas.find(i=>i.id===e.cuentaDeCobroId),t=m(o?o.periodo:e.nota??"de otro lado");if(!a)return`<div class="ingreso-real">
      <div class="ingreso-cabecera">
        <span class="meta-nombre">${b(e.monto)}</span>
        <span class="rango">${m(e.fecha)} \xB7 ${t}</span>
      </div>
      <p class="nota aviso">No est\xE1 dicho en qu\xE9 se fue este dinero.
        <button data-accion="proponer" data-id="${e.id}">Calcularlo por m\xED</button></p>
    </div>`;let n=Ee(a,e),s=(i,c,d)=>`
    <tr>
      <td class="meta-nombre">${m(i.nombre)}
        ${i.movidoDesdeGasto?'<span class="rango">\xB7 ven\xEDa de un gasto</span>':""}</td>
      <td class="num"><input type="text" inputmode="numeric" data-dinero
        value="${I(i.monto)}" class="corto-dinero"
        data-accion="editar-reparto" data-id="${a.id}" data-tipo="${c}" data-i="${d}" /></td>
      <td class="num">${i.movidoDesdeGasto?`<button class="icono" data-accion="abono-a-gasto" data-id="${a.id}" data-i="${d}"
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
      <span class="meta-nombre">${b(e.monto)}</span>
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
    ${(()=>{let i=mo(a,l.metas);return i.length===0?"":i.map(c=>`<p class="nota aviso">
        Tienes <strong>${m(c.gasto.nombre)}</strong> (${b(c.gasto.monto)}) anotado aqu\xED como
        un gasto cualquiera, pero <strong>${m(c.metaNombre)}</strong> es una de tus metas.
        <br />Si ese dinero se lo metiste a la meta, m\xE1rcalo: as\xED el programa sabe que ya llevas
        ${b(c.gasto.monto)} pagados y deja de calcular las fechas como si te faltara el precio
        entero. Si fue otra cosa que se llama parecido, d\xE9jalo como est\xE1.
        <br /><button data-accion="gasto-a-abono" data-id="${a.id}"
          data-meta="${c.metaId}" data-nombre="${m(c.gasto.nombre)}">S\xED, fue abono a ${m(c.metaNombre)}</button>
      </p>`).join("")})()}
    ${(()=>{let i=co(a,$e(e));if(i.length===0)return"";let c=F(),d=g=>K(T(Math.max(1,g),c).optimista),u=ke(e,l.ingresos.filter(g=>g.fecha<=e.fecha&&g.id!==e.id)),p=i.map(g=>{let h=lo(g,Da(l.metas,l.repartos),l.obligaciones,u),S=h.tipo==="ya-no-esta"?"ya no est\xE1 en tu lista":h.tipo==="ya-comprada"?"la marcaste como ya comprada":h.tipo==="ya-pagada"?"ya est\xE1 pagada":h.tipo==="empieza-despues"?`ahora empieza en ${d(h.pago)}`:h.tipo==="solo-el-primer-pago"?"es solo del primer pago":h.tipo==="puntual"?"es puntual, no de todos los pagos":h.tipo==="en-cero"?"est\xE1 en $0":"no sabr\xEDa decirte por qu\xE9";return`<li><strong>${m(g)}</strong> \u2014 ${m(S)}</li>`}).join("");return`<div class="nota aviso">
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
      ${n>0?`Faltan <strong>${b(n)}</strong> por decir a d\xF3nde fueron.`:`Repartiste <strong>${b(-n)}</strong> m\xE1s de lo que entr\xF3.`}
      <button data-accion="cuadrar" data-id="${a.id}">Mandarlos a lo guardado</button>
    </p>`:""}
  </div>`}function Nt(e){let a=F(),o=e?io(e.pagos,a.desde,a.diasOptimista,l.metas):[],t=ha(l.ingresos,l.repartos),n=[...new Set([...o.map(r=>r.mes),...t.map(r=>r.mes)])],s=po(l.cuentas,l.ingresos,l.escenario.ingresoEsperado,n);return uo(o,t,j().slice(0,7),s)}function ms(e){let a=Nt(e);if(a.length===0)return`<section class="panel">
      <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
      <div class="vacio">Agrega tus metas y registra un pago: aqu\xED se ve el calendario entero.</div>
    </section>`;bs(a);let o=va(a);return`
  <section class="panel">
    <h2>Vista general <span class="sufijo">\u2014 todo lo que llevas y todo lo que viene</span></h2>
    <div class="resumen">
      <div><span class="valor real">${b(o.entroDeVerdad)}</span>
        <span class="rotulo">ha entrado de verdad \xB7 ${o.mesesConDatos} ${o.mesesConDatos===1?"mes":"meses"}</span></div>
      <div><span class="valor">${b(o.guardadoDeVerdad)}</span>
        <span class="rotulo">llevas guardado</span></div>
      ${o.mesesQueFaltan>0?`<div><span class="valor cuando">${b(o.faltaPorEntrar)}</span>
            <span class="rotulo">faltar\xEDan por entrar \xB7 ${o.mesesQueFaltan} ${o.mesesQueFaltan===1?"mes":"meses"}</span></div>`:`<div><span class="valor">${b(o.gastadoDeVerdad)}</span>
            <span class="rotulo">llevas gastado</span></div>`}
    </div>
    <p class="nota">
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="1">Desplegar todos</button>
      <button class="chico-linea" data-accion="plegar-meses" data-abrir="0">Plegar todos</button>
      <span class="rango">&nbsp; ${a.length} ${a.length===1?"mes":"meses"} \xB7
        pulsa uno para ver en qu\xE9 se va</span>
    </p>
    <div class="linea-tiempo">${a.map(fs).join("")}</div>
    <p class="nota">
      <span class="etiqueta real">Real</span> lo que pas\xF3 \xB7
      <span class="etiqueta simulacion">Simulaci\xF3n</span> lo que pasar\xEDa si entra lo que supone
      el escenario. Nunca se mezclan en una sola cifra.
    </p>
  </section>`}function gs(e){let a=(n,s)=>n.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")===s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""),o=l.obligaciones.find(n=>a(n.nombre,e));if(o)return`<span class="que-es obligacion">fijo${o.grupo?` \xB7 ${m(o.grupo)}`:""}</span>`;let t=l.metas.find(n=>a(n.nombre,e));return t?`<span class="que-es meta">meta${t.grupo?` \xB7 ${m(t.grupo)}`:""}</span>`:e==="Qued\xF3 guardado"||e==="Se guardar\xEDa"?"":'<span class="que-es suelto">de una vez</span>'}var ve=new Set,Mt=!1;function bs(e){if(Mt)return;Mt=!0;let a=e.findIndex(t=>t.estado==="actual"),o=a>=0?a:0;for(let t of e.slice(o,o+2))ve.add(t.mes)}function fs(e){let a=e.real!==null,o=e.real??e.simulado;if(!o)return"";let t=a?o.entro:e.esperado?.monto??o.entro,n=!a&&e.simulado!==null&&e.esperado!==null&&e.esperado.monto!==e.simulado.entro,s=e.real?e.real.detalle:Z(e.simulado?.detalle),r=l.notasDelMes?.[e.mes]?.trim()??"",i=e.estado==="actual"?'<span class="chip ahora">este mes</span>':e.estado==="futuro"?'<span class="chip futuro">viene</span>':"",c=[o.aObligaciones>0?`${b(o.aObligaciones)} fijos`:"",o.aMetas>0?`${b(o.aMetas)} a metas`:"",a&&e.real.enGastos>0?`${b(e.real.enGastos)} sueltos`:"",o.alAhorro>0?`${b(o.alAhorro)} guardado`:""].filter(Boolean).join(" \xB7 ");return`
  <details class="mes-vista ${e.estado} ${a?"es-real":"es-simulado"}"
           data-mes="${e.mes}" ${ve.has(e.mes)?"open":""}>
    <summary class="mes-cabecera">
      <h3>${m(z(e.mes))}</h3>
      ${i}
      <span class="etiqueta ${a?"real":"simulacion"}">${a?"Real":"Simulaci\xF3n"}</span>
      <span class="valor">${b(t)}</span>
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
      El desglose de abajo est\xE1 calculado con el escenario (${b(e.simulado.entro)}).
      Si de verdad esperas ${b(e.esperado.monto)} este mes, cambia \xABLo que espero por pago\xBB
      para que las cifras cuadren.</p>`:""}
    ${e.diferencia!==null&&e.diferencia!==0?`<p class="nota ${e.diferencia<0?"aviso":""}">
      ${e.diferencia<0?`Entraron ${b(-e.diferencia)} menos de lo esperado para ese mes (${b(e.esperado.monto)}${e.esperado.segun==="cuenta_de_cobro"?", seg\xFAn tu cuenta de cobro":""}).`:`Entraron ${b(e.diferencia)} m\xE1s de lo esperado para ese mes.`}</p>`:""}
    ${e.estado==="actual"&&e.real&&e.esperado?`<p class="nota">
      ${e.esperado.segun==="cuenta_de_cobro"?`Tu cuenta de cobro de este mes es de <strong>${b(e.esperado.monto)}</strong>`:`El escenario supone <strong>${b(e.esperado.monto)}</strong> este mes`}.
      ${e.real.entro<e.esperado.monto?`Llevas ${b(e.real.entro)}: faltar\xEDan ${b(e.esperado.monto-e.real.entro)} por entrar.`:"Ya entr\xF3 todo."}</p>`:""}
    ${s.length===0?'<p class="nota rango">Sin movimientos.</p>':`
      <div class="tabla-ancha"><table><tbody>
        ${s.map(d=>`<tr>
          <td class="meta-nombre">${m(d.nombre)} ${gs(d.nombre)}
            ${d.deLoQueSobro?`<span class="rango">\xB7 ${b(d.deLoQueSobro)} con lo que sobr\xF3 del mes</span>`:""}</td>
          <td class="num">${b(d.monto)}</td></tr>`).join("")}
        ${o.alAhorro>0?`<tr class="grupo">
          <td class="meta-nombre">${a?"Qued\xF3 guardado":"Se guardar\xEDa"}</td>
          <td class="num">${b(o.alAhorro)}</td></tr>`:""}
      </tbody></table></div>`}
    ${e.real&&e.real.sinAsignar>0?`<p class="nota aviso">
      Hay ${b(e.real.sinAsignar)} sin decir en qu\xE9 se fueron.</p>`:""}
  </details>`}var _=[],W=No(),O=!1,L=null,k=null,hs={escenario:"Escenario",obligaciones:"Obligaciones",metas:"Metas",cuentas:"Cuentas de cobro",ingresos:"Registrar \xB7 pagos recibidos",repartos:"Registrar \xB7 en qu\xE9 se fue la plata",soportes:"Soportes de radicaci\xF3n"};function _t(e){let a=e.datos,o=t=>typeof t=="number"?b(t):"";switch(e.tabla){case"metas":return`\xAB${String(a.nombre??"sin nombre")}\xBB`;case"obligaciones":return`\xAB${String(a.nombre??"sin nombre")}\xBB`;case"cuentas":return`la cuenta de ${String(a.periodo??"?")}`;case"ingresos":return`el pago del ${String(a.fecha??"?")} (${o(a.monto)})`;case"repartos":return Ke({tabla:"repartos",id:e.id},l);case"escenario":return"el escenario";case"soportes":return`los soportes de ${e.id}`}}function ra(e,a){if((e.campo==="ordenMetas"||e.campo==="ordenObligaciones")&&Array.isArray(a)&&L){let o=e.campo==="ordenMetas"?"metas":"obligaciones",t=new Map;for(let n of[...L.remotas[o],...L.locales[o]])t.set(n.datos.id,String(n.datos.nombre??n.datos.id));return a.map((n,s)=>`${s+1}. ${t.get(String(n))??"?"}`).join(" \xB7 ")}return Pe(e.campo??"",a)}function kt(e){let a=_t(e);return e.tipo==="campo"?[`${a} \u2014 ${Ce(e.campo??"")}`,ra(e,e.aqui),ra(e,e.nube)]:e.tipo==="solo-aqui"?[`${a} est\xE1 solo en este aparato`,"Conservarla","Quitarla de los dos"]:e.tipo==="solo-nube"?[`${a} est\xE1 solo en el otro aparato`,"No traerla (quitarla de los dos)","Traerla"]:[`${a} la borraste en el otro aparato`,"Conservarla","Borrarla tambi\xE9n aqu\xED"]}function vs(e,a){let[o,t,n]=kt(e),s=a==="aqui"?t:n;return e.tipo==="campo"?`${o}: qued\xF3 ${s}`:`${o} \u2192 ${s.toLowerCase()}`}function $s(e){let a=L.elecciones[e.clave],o=(i,c)=>`
    <label class="opcion ${a===i?"elegida":""}">
      <input type="radio" name="${m(e.clave)}" value="${i}" ${a===i?"checked":""}
        data-accion="nube-elegir" data-clave="${m(e.clave)}" data-lado="${i}" />
      <span>${c}</span>
    </label>`,t=_t(e),[n,s,r]=kt(e);return e.tipo==="campo"?`<div class="diferencia">
      <div class="que"><strong>${m(t)}</strong> \u2014 ${m(Ce(e.campo??""))}
        ${e.confirmadoEn?'<span class="rango">(el que confirmaste viene marcado)</span>':""}</div>
      ${o("aqui",`<b>En este aparato:</b> ${m(ra(e,e.aqui))}`)}
      ${o("nube",`<b>En el otro aparato (la nube):</b> ${m(ra(e,e.nube))}`)}
    </div>`:`<div class="diferencia fila-entera">
    <div class="que"><strong>${m(n)}</strong></div>
    ${o("aqui",m(s))}
    ${o("nube",m(r))}
  </div>`}function Ds(){let e=L,a=[...new Set(e.difs.map(o=>o.tabla))];return`<div class="revision">
    <h3 class="titulo-ventana">${e.modo==="subir"?"\u2B06 Subir mi versi\xF3n":"\u2B07 Traer la \xFAltima versi\xF3n"}</h3>
    <p><strong>${e.modo==="subir"?"Vas a SUBIR la versi\xF3n de este aparato.":"Vas a TRAER la \xFAltima versi\xF3n de la nube."}</strong>
      Hay ${e.difs.length} ${e.difs.length===1?"diferencia":"diferencias"} con el otro aparato.
      Viene marcado ${e.modo==="subir"?"lo de este aparato":"lo de la nube"}; cambia lo que quieras.
      <b>Todav\xEDa no se ha escrito nada</b>, ni aqu\xED ni en la nube.</p>
    ${a.map(o=>`<h3>${m(hs[o])}</h3>
      ${e.difs.filter(t=>t.tabla===o).map($s).join("")}`).join("")}
    <p class="botones-revision">
      <button class="primario" data-accion="nube-aplicar" ${O?"disabled":""}>
        ${O?"Aplicando\u2026":"Aplicar lo elegido"}</button>
      <button data-accion="nube-cancelar">Cancelar, no cambiar nada</button>
    </p>
  </div>`}function Ms(){if(k){let e=k;return`<div class="capa-dialogo capa-nube cerrable">
      <div class="dialogo dialogo-nube" role="dialog" aria-modal="true">
        <h3 class="titulo-ventana ${e.malo?"pendiente":""}">${m(e.titulo)}</h3>
        ${e.lineas.length?`<ul class="lista-resultado">${e.lineas.map(a=>`<li>${m(a)}</li>`).join("")}</ul>`:""}
        <div class="dlg-botones"><button class="primario" data-accion="nube-cerrar-ventana">Cerrar</button></div>
      </div></div>`}return L?`<div class="capa-dialogo capa-nube">
      <div class="dialogo dialogo-nube" role="dialog" aria-modal="true">${Ds()}</div></div>`:""}var Le=!1;function Es(){let e=ea();if(!e)return`
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
      <h2>Respaldo autom\xE1tico en GitHub <span class="sufijo">\u2014 ${m(e.repo)}</span></h2>
      ${e.error?`<p class="nota aviso">\u26A0\uFE0F El \xFAltimo respaldo fall\xF3: ${m(e.error)}.</p>`:`<p class="nota">${a?`\u2713 \xDAltimo respaldo: <strong>${m(a)}</strong>.`:"Todav\xEDa no ha salido ning\xFAn respaldo."}
            Se hace solo, una vez al d\xEDa, al abrir el programa.</p>`}
      <p class="botones-nube">
        <button class="primario" data-accion="respaldo-ahora" ${Le?"disabled":""}>${Le?"Respaldando\u2026":"Respaldar ahora"}</button>
        <button class="chico-linea" data-accion="respaldo-quitar">Quitar el respaldo de este aparato</button>
      </p>
      <p class="rango">La llave est\xE1 guardada en este aparato y no se vuelve a mostrar. Si vence, pega una nueva quitando y
        volviendo a poner el respaldo.</p>
    </section>`}async function Ya(){let e=ea();if(!e||Le)return;Le=!0,Ae();let a=j();try{await st(e,Ca(l),a),Te({...e,ultimo:a,error:void 0})}catch(o){let t=o instanceof TypeError?"no hay conexi\xF3n con GitHub; se intenta otra vez al abrir":o.message;Te({...e,error:t})}Le=!1,Ae()}function ys(){let e=Qe(),a=Ue();if(!e)return`
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
    </section>`;let o=_.length===0?"":`
    <div class="aviso-descartes">
      <strong>${_.length} ${_.length===1?"dato distinto":"datos distintos"} entre los dos aparatos.</strong>
      Se qued\xF3 el m\xE1s reciente. Aqu\xED est\xE1n los dos, para que compares:
      <table><thead><tr>
        <th>Qu\xE9</th><th>Lo que hab\xEDa en el otro aparato</th><th>Lo que qued\xF3</th><th></th>
      </tr></thead><tbody>
        ${_.map((t,n)=>`<tr>
          <td><strong>${m(Ce(t.campo))}</strong>
            <span class="rango">de ${m(Ke(t,l))}</span></td>
          <td class="descartado">${m(Pe(t.campo,t.valor))}</td>
          <td class="completa">${m(Pe(t.campo,t.gano))}</td>
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
        <button class="primario" data-accion="nube-preparar" data-modo="subir" ${O||L?"disabled":""}>
          \u2B06 Subir mi versi\xF3n</button>
        <button class="primario" data-accion="nube-preparar" data-modo="traer" ${O||L?"disabled":""}>
          \u2B07 Traer la \xFAltima versi\xF3n</button>
        <button class="chico-linea" data-accion="nube-salir">Salir de la cuenta</button>
      </p>
      <p class="rango">\xABSubir\xBB deja la nube como este aparato; \xABTraer\xBB deja este aparato como la nube.
        ${O&&!L?"<b>Comparando con la nube\u2026</b>":""}</p>
      ${o}
    </section>`}function Ss(e){let a=new Date,o=a.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),t=je(Me(l.cuentas,l.ingresos)),n=la(),s=n.monto>0?Va(2,n.monto):0,r=Nt(e),i=r.length>0?va(r).guardadoDeVerdad:0,c=F(),d=pt(l.metas,e?.metas??[]),u=d?.pagoFin!=null?ue(T(d.pagoFin,c)):null,p=l.soportesMarcados[Se(a)]??[],g=Ra(a,p),h=ee(),S=h.filter(R=>p.includes(R.id)).length,M=g.diasQueFaltan,f=(R,re,ie,we,ce,le)=>`
    <div class="cifra tono-${R}">
      <div class="cifra-cab"><span class="cifra-chip">${re}</span>${ie}</div>
      <div class="cifra-nombre">${we}</div>
      <div class="cifra-valor">${ce}</div>
      <div class="cifra-detalle">${le}</div>
    </div>`,$='<span class="etiqueta real">Real</span>',C='<span class="etiqueta simulacion">Simulaci\xF3n</span>',P=U(l.metas,l.repartos),A=new Map((e?.metas??[]).map(R=>[R.metaId,R])),Y=R=>aa(R,P.get(R.id)?.total??0)>=1,w=l.metas.filter(R=>!Y(R)),ua=l.metas.length-w.length,Xt=[...w,...l.metas.filter(Y)].map(R=>{let re=A.get(R.id),ie=P.get(R.id)?.total??0,we=aa(R,ie),ce=we>=1,le=!R.compra&&!ce&&re?.pagoFin!=null?T(re.pagoFin,c):null,Xa=R.compra?"ya la compraste":ce?"\u2713 lista":le?ue(le):"sin fecha todav\xEDa",Wt=le?`<span class="fecha-larga-meta">${m(Xa)}</span><span class="fecha-corta-meta">${m(de(le))}</span>`:m(Xa);return`<li class="inicio-meta ${R.clase==="deuda"?"es-deuda":""} ${ce?"lista":""}">
      <div class="inicio-meta-texto">
        <div class="inicio-meta-nombre">${m(R.nombre.trim()||"(sin nombre)")}
          ${R.clase==="deuda"?'<span class="marca-deuda">Ya la debo</span>':""}</div>
        <div class="rango">${b(ie)} de ${b(R.valor)}</div>
        <div class="barra-progreso"><i style="width:${Math.round(we*100)}%"></i></div>
      </div>
      <div class="inicio-meta-der"><strong>${b(R.valor)}</strong>
        <span class="${ce?"completa":"cuando"}">${Wt}</span></div>
    </li>`}).join("");return`
  <section class="inicio">
    <div class="saludo">
      <h1>\xA1Hola!</h1>
      <p>As\xED va tu plata \xB7 <span class="fecha-larga">${m(o)}</span></p>
    </div>

    <div class="aviso-radicar ${Ft[g.urgencia]}">
      <div class="aviso-radicar-texto">
        ${$} <strong>${m(g.titular)}</strong>
        <div class="rango">${S} de ${h.length} soportes listos \xB7 la lista est\xE1 abajo</div>
        <div class="barra-progreso real"><i style="width:${h.length?Math.round(S/h.length*100):0}%"></i></div>
      </div>
      <div class="aviso-radicar-dias"><strong>${Math.abs(M)}</strong>
        <span>${M<0?Math.abs(M)===1?"d\xEDa tarde":"d\xEDas tarde":M===1?"d\xEDa":"d\xEDas"}</span></div>
    </div>

    <div class="cifras">
      ${f("real","\u{1F4B5}",$,"Te deben",t>0?b(t):"$0",t>0?"de cuentas de cobro sin pagar completas":"no tienes cuentas pendientes")}
      ${f("turquesa","\u{1F45B}","","Libre para metas, por pago",n.monto>0?b(n.monto-s):"\u2014",n.monto>0?`de ${b(n.monto)} \xB7 se van ${b(s)}`:"pon cu\xE1nto esperas por pago en Ajustes")}
      ${f("simulado","\u{1F3C1}",C,d?`Pr\xF3xima meta \xB7 ${m(d.meta.nombre.trim()||"(sin nombre)")}`:"Pr\xF3xima meta",d?u?m(u.replace(/^entre /,"").split(" y ")[0]):"Sin fecha":"\u2014",d?u?u.startsWith("entre ")?m(u):"seg\xFAn la proyecci\xF3n":"la proyecci\xF3n no alcanza a terminarla":"no hay metas pendientes")}
      ${f("morado","\u{1F437}","","Llevas guardado",b(i),"lo que ha quedado de verdad en el ahorro")}
    </div>

    <div class="inicio-doble">
    <div class="panel inicio-metas">
      <h2>Mis metas ${C}
        <button class="enlace" data-accion="seccion" data-seccion="metas">Ver todas \u2192</button></h2>
      ${l.metas.length===0?`<div class="vacio">Todav\xEDa no has puesto ninguna meta.
            <p><button class="primario" data-accion="seccion" data-seccion="metas">Ir a Metas</button></p></div>`:`<p class="rango">${w.length} por pagar${ua>0?` \xB7 ${ua} ya ${ua===1?"lista":"listas"}`:""}${(()=>{let R=Na(l.metas,new Map([...P].map(([re,ie])=>[re,ie.total])));return R.deudas.cuantas===0?"":`<br /><span class="es-deuda-texto">Debes ${b(Math.max(0,R.deudas.valor-R.deudas.pagado))}</span>
               \xB7 por comprar ${b(Math.max(0,R.compras.valor-R.compras.pagado))}`})()}</p>
           ${wt()}
           <ul class="inicio-lista">${Xt}</ul>`}
    </div>
    ${Rs(r)}
    </div>
    ${Ps(e,r,P)}
  </section>`}var ta=null,Et=["#f472b6","#a78bfa","#2dd4bf","#fb923c","#e879f9","#4ade80","#f87171","#c4b5fd","#5eead4","#fda4af","#bef264","#fdba74"],xs={ahorro:"#94a3b8","sin-asignar":"rgba(255,255,255,.22)"},yt={obligacion:"obligaci\xF3n",meta:"meta",gasto:"gasto suelto",ahorro:"","sin-asignar":""};function Rs(e){let a=e.filter(p=>p.real||p.simulado).map(p=>p.mes);if(a.length===0)return"";let o=ta&&a.includes(ta)?ta:bt(e),t=a.indexOf(o),n=gt(e.find(p=>p.mes===o),new Set(l.metas.map(p=>p.id)),l.obligaciones),s=52,r=2*Math.PI*s,i=0,c=(n?.trozos??[]).map(p=>xs[p.tipo]??Et[i++%Et.length]),d=mt((n?.trozos??[]).map(p=>p.monto),s),u=(p,g,h)=>a[p]?`<button class="icono" data-accion="dona-mes" data-mes="${a[p]}" title="${h}">${g}</button>`:`<button class="icono" disabled>${g}</button>`;return`
  <div class="panel inicio-dona">
    <h2>En qu\xE9 se va el mes
      ${n?n.esReal?'<span class="etiqueta real">Real</span>':'<span class="etiqueta simulacion">Simulaci\xF3n</span>':""}</h2>
    <div class="dona-meses">
      ${u(t-1,"\u25C0","Mes anterior")}
      ${Lt(`<select class="lista-meses" tabindex="-1" data-accion="dona-mes" data-titulo="Qu\xE9 mes ver">
        ${a.map(p=>`<option value="${p}" data-anio="${p.slice(0,4)}" data-mes="${N(p)}"
            data-corto="${N(p)} ${p.slice(0,4)}" ${p===o?"selected":""}>${m(z(p))}</option>`).join("")}
      </select>`,z(o),`${N(o)} ${o.slice(0,4)}`)}
      ${u(t+1,"\u25B6","Mes siguiente")}
    </div>
    <p class="rango">${n?n.esReal?"Lo que pas\xF3 de verdad ese mes":"Lo que se piensa gastar, seg\xFAn la proyecci\xF3n":"Ese mes no tiene nada repartido."}</p>
    ${n?`<div class="dona">
      <svg viewBox="0 0 140 140" role="img" aria-label="Reparto de ${b(n.total)} en ${m(z(o))}">
        <circle cx="70" cy="70" r="${s}" class="dona-fondo" />
        <g transform="rotate(-90 70 70)">
          ${n.trozos.map((p,g)=>d[g].largo>0?`<circle cx="70" cy="70" r="${s}" style="stroke:${c[g]}"
                 stroke-dasharray="${d[g].largo.toFixed(2)} ${r.toFixed(2)}"
                 stroke-dashoffset="${(-d[g].desde).toFixed(2)}" />`:"").join("")}
        </g>
        <text x="70" y="68" class="dona-total">${b(n.total)}</text>
        <text x="70" y="86" class="dona-rotulo">${n.esReal?"entr\xF3":"se espera"}</text>
      </svg>
      <ul>
        ${n.trozos.map((p,g)=>`<li><i style="background:${c[g]}"></i>
          <span>${m(p.nombre)}${yt[p.tipo]?` <em class="tipo-trozo">${yt[p.tipo]}</em>`:""}</span>
          <strong>${b(p.monto)}</strong></li>`).join("")}
      </ul>
    </div>`:""}
    <p><button class="primario" data-accion="seccion" data-seccion="registrar">+ Registrar un pago</button></p>
  </div>`}var Cs={lista:"\u2713 lista",comprada:"ya la compraste","en-curso":"","no-alcanza":"no alcanza a terminar","sin-fecha":"sin fecha todav\xEDa"};function Ps(e,a,o){if(l.metas.length===0)return"";let t=F(),n=f=>Se(T(Math.max(1,f),t).optimista),s=ft(l.metas,e?.metas??[],new Map([...o].map(([f,$])=>[f,$.total])),a,n),r=j().slice(0,7),i=s.flatMap(f=>[f.desde,f.hasta]).filter(f=>!!f),c=[r,...i].reduce((f,$)=>$<f?$:f),d=e?.pagos.length?n(e.pagos[e.pagos.length-1].numero):r,u=[r,d,...i].reduce((f,$)=>$>f?$:f),p=ht(c,u),g=f=>p.indexOf(f)+2,h=p.map((f,$)=>`<div class="lt-mes ${f===r?"hoy":""}" style="grid-column:${$+2};grid-row:1">
      ${N(f)}${$===0||f.endsWith("-01")?`<b>${f.slice(0,4)}</b>`:""}</div>`).join(""),S=s.map((f,$)=>{let C=$+2,P=f.desde??f.hasta,A=f.estado==="no-alcanza"?u:f.hasta??f.desde,Y=f.estado==="en-curso"&&f.desde&&f.hasta?`${N(f.desde)} ${f.desde.slice(0,4)} \u2192 ${N(f.hasta)} ${f.hasta.slice(0,4)}`:f.estado==="lista"&&f.hasta?`\u2713 lista \xB7 ${N(f.hasta)} ${f.hasta.slice(0,4)}`:Cs[f.estado],w=P&&A&&p.includes(P)&&p.includes(A)?`<i class="lt-barra ${f.estado} ${f.esDeuda?"es-deuda":""}" style="grid-column:${g(P)} / ${g(A)+1};grid-row:${C}"
           title="${m(f.nombre)}: ${m(Y)}"></i>`:"";return`<div class="lt-nombre ${f.estado}" style="grid-row:${C}"><strong>${m(f.nombre)}</strong>
        <span class="rango">${m(Y)}</span></div>
      <div class="lt-carril" style="grid-column:2 / ${p.length+2};grid-row:${C}"></div>
      ${w}`}).join(""),M=p.includes(r)?`<div class="lt-hoy" style="grid-column:${g(r)};grid-row:1 / ${s.length+2}"></div>`:"";return`
  <div class="panel inicio-tiempo">
    <h2>Cu\xE1ndo termino cada meta <span class="etiqueta simulacion">Simulaci\xF3n</span></h2>
    <p class="rango">De cuando empezaste a pagarla a cuando queda saldada. La columna marcada es este mes.</p>
    <div class="lt-marco"><div class="lt" style="--meses:${p.length}">
      ${M}${h}${S}
    </div></div>
  </div>`}function da(){let e=rs();return Tt=e?.totalPagos??0,[["inicio",Ss(e)],["radicacion",ns()],["vista",ms(e)],["escenario",Gn()],["metas",ts(e)],["proyeccion",is(e)],["obligaciones",Wn()],["cuentas",ss()],["real",us()],["nube",ys()],["respaldo",Es()]]}function zt(e){if(typeof e.querySelectorAll=="function")for(let a of Array.from(e.querySelectorAll("table"))){let o=Array.from(a.querySelectorAll("thead th")).map(t=>(t.textContent??"").trim());if(Io(o)){a.classList.add("como-tarjetas");for(let t of Array.from(a.querySelectorAll("tbody tr"))){let n=Array.from(t.children),s=n.map(i=>Number(i.getAttribute("colspan")??1)||1),r=Po(o,s);n.forEach((i,c)=>{let d=r[c];d?i.dataset.etiqueta=d:delete i.dataset.etiqueta})}}}}function Ua(e,a){e.innerHTML=a,zt(e)}function Ht(){return document.activeElement?.closest?.("[data-panel]")?.dataset.panel??null}function Ae(e=Ht()){let a=new Set([e,Ga].filter(Boolean));for(let[o,t]of da()){if(a.has(o))continue;let n=document.getElementById(`panel-${o}`);n&&Ua(n,t)}Vt()}function Vt(){let e=document.getElementById("mensaje");e&&(e.innerHTML=y?`<div class="mensaje ${y.malo?"malo":"bueno"}">${m(y.texto)}</div>`:"",y=null)}var Bt="gestiondinerotrabajo.seccion";function Is(){try{return Ze(localStorage.getItem(Bt))}catch{return Ze(null)}}function Ts(e){try{localStorage.setItem(Bt,e)}catch{}}function Ls(e){return`<nav class="barra-secciones">
    ${Ie.map(a=>`<button data-accion="seccion" data-seccion="${a.id}"
      class="${a.id===e?"activa":""}" aria-current="${a.id===e?"page":"false"}">
      <span class="icono-seccion">${a.icono}</span>${m(a.rotulo)}</button>`).join("")}
  </nav>`}function As(e){let a=Qe(),o=Ue(),t=o?new Date(o).toLocaleString("es-CO",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):null;return`<aside class="lateral">
    <div class="marca"><span class="logo">$</span>
      <div><strong>Mi dinero</strong><span>Metas con ingreso variable</span></div></div>
    <nav class="nav-lateral">
      ${Ie.map(n=>`<button data-accion="seccion" data-seccion="${n.id}"
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
  </aside>`}function x(){let e=document.getElementById("app"),a=xt(document.activeElement),o=document.activeElement,t=o&&typeof o.selectionStart=="number"?o.selectionStart:null,n=window.scrollY,s=Is();e.className=`seccion-${s}`,e.innerHTML=`
    ${As(s)}
    <header class="cabecera">
      <h1>Gesti\xF3n del dinero del trabajo</h1>
      <div class="acciones">
        <button data-accion="exportar">Exportar respaldo</button>
        <button data-accion="importar">Importar respaldo</button>
      </div>
    </header>
    <div id="mensaje"></div>
    ${da().map(([r,i])=>`<div id="panel-${r}" data-panel="${r}"
         data-seccion="${Jo(r)??""}">${i}</div>`).join("")}
    <input type="file" id="archivo" accept="application/json" hidden />
    ${Ls(s)}
    <div id="ventana-nube">${Ms()}</div>`,zt(e),Vt(),ws(),window.scrollTo({top:n,behavior:"instant"}),Vn(a,t)}function Gt(e){let a=Math.round(Number(e));if(!(!Number.isFinite(a)||a<=1))return a}v.set("escenario",e=>{let a=e.dataset.campo,o=e,t=o.value;if(l.escenario[a]=o.type==="date"?t:o.hasAttribute("data-dinero")?q(t):Number(t),a==="diasOptimista"||a==="diasPesimista"){let n=Math.round(Number(t));l.escenario[a]=Number.isFinite(n)&&n>0?n:1}V()});async function Qt(e,a){let o=await G({titulo:a,detalle:"Lo que quieras recordar. Enter hace un salto de l\xEDnea; Ctrl+Enter guarda.",valorInicial:e.nota??"",textoAceptar:"Guardar",largo:!0});o!==null&&(o.trim()?e.nota=o.trim():delete e.nota,E())}v.set("nota-meta",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&Qt(a,`Nota de \xAB${a.nombre}\xBB`)});v.set("nota-oblig",e=>{let a=l.obligaciones.find(o=>o.id===e.dataset.id);a&&Qt(a,`Nota de \xAB${a.nombre}\xBB`)});v.set("nota-mes",async e=>{let a=e.dataset.mes,o=l.notasDelMes??={},t=await G({titulo:`Nota de ${z(a)}`,detalle:"Lo que quieras recordar de este mes. Enter hace un salto de l\xEDnea; Ctrl+Enter guarda.",valorInicial:o[a]??"",textoAceptar:"Guardar",largo:!0});t!==null&&(t.trim()?o[a]=t.trim():delete o[a],E())});v.set("link-meta",async e=>{let a=l.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=await G({titulo:`Enlace de \xAB${a.nombre}\xBB`,detalle:"Pega la direcci\xF3n de la p\xE1gina donde la vas a comprar. D\xE9jalo vac\xEDo para quitarlo.",valorInicial:a.link??"",textoAceptar:"Guardar"});if(o===null)return;if(!o.trim())return delete a.link,E();let t=La(o);if(!t)return y={texto:"Esa direcci\xF3n no se entiende como p\xE1gina web. No cambi\xE9 el enlace.",malo:!0},x();a.link=t,E()});v.set("sobrante-a-metas",e=>{l.escenario.sobranteAMetas=e.checked,V()});v.set("elastico",e=>{l.escenario.colchonElastico=e.checked,V()});v.set("oblig",e=>{let a=l.obligaciones.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor")a.valor=a.tipo==="porcentaje"?Number(t)/100:q(t);else if(o==="tipo"){let n=t;n!==a.tipo&&(a.valor=n==="porcentaje"?.1:1e5),a.tipo=n}else o==="modo"?(a.modo=t,a.modo==="puntual"&&!a.supuesto&&(a.supuesto="siempre")):o==="grupo"?a.grupo=t.trim()||void 0:o==="desdePago"?a.desdePago=Gt(t):o==="supuesto"?a.supuesto=t:a.nombre=t;V()});v.set("nuevo-cambio",e=>{let a=l.obligaciones.find(t=>t.id===e.dataset.id);if(!a)return;let o=Math.max(1,...(a.cambios??[]).map(t=>t.desdePago));a.cambios=[...a.cambios??[],{desdePago:o+1,valor:a.valor}],E()});v.set("cambio",e=>{let a=l.obligaciones.find(n=>n.id===e.dataset.id),o=a?.cambios?.[Number(e.dataset.i)];if(!a||!o)return;let t=e.value;if(e.dataset.campo==="desdePago"){let n=Math.round(Number(t));o.desdePago=Number.isFinite(n)&&n>0?n:1}else o.valor=a.tipo==="porcentaje"?Number(t)/100:q(t);V()});v.set("borrar-cambio",e=>{let a=l.obligaciones.find(t=>t.id===e.dataset.id);if(!a?.cambios)return;let o=Number(e.dataset.i);a.cambios=a.cambios.filter((t,n)=>n!==o),E()});function Ja(e){return e==="ingreso"?"cambiosIngreso":"cambiosColchon"}v.set("nuevo-cambio-escenario",e=>{let a=Ja(e.dataset.cual),o=l.escenario[a]??[],t=Math.max(1,...o.map(s=>s.desdePago)),n=a==="cambiosIngreso"?l.escenario.ingresoEsperado:l.escenario.colchonBase;l.escenario[a]=[...o,{desdePago:t+1,valor:n}],E()});v.set("cambio-escenario",e=>{let a=l.escenario[Ja(e.dataset.cual)]?.[Number(e.dataset.i)];if(!a)return;let o=e.value;if(e.dataset.campo==="desdePago"){let t=Math.round(Number(o));a.desdePago=Number.isFinite(t)&&t>0?t:1}else a.valor=q(o);V()});v.set("borrar-cambio-escenario",e=>{let a=Number(e.dataset.i),o=Ja(e.dataset.cual);l.escenario[o]=(l.escenario[o]??[]).filter((t,n)=>n!==a),E()});v.set("nueva-oblig",()=>{let e=oe("ob");ia=e,l.obligaciones.push({id:e,nombre:"Nueva obligaci\xF3n",tipo:"fijo",valor:1e5,modo:"cada_pago"}),E()});v.set("borrar-oblig",e=>{l.obligaciones=l.obligaciones.filter(a=>a.id!==e.dataset.id),E()});v.set("meta",e=>{let a=l.metas.find(n=>n.id===e.dataset.id);if(!a)return;let o=e.dataset.campo,t=e.value;if(o==="valor"){let n=q(t);n!==a.valor&&n>0&&(a.precioRevisado=j()),a.valor=n}else if(o==="abonado")a.abonado=q(t);else if(o==="desdePago")a.desdePago=Gt(t);else if(o==="maximoPorPago"){let n=q(t);a.maximoPorPago=n>0?n:void 0}else if(o==="enCuotas"){let n=Math.round(Number(t));a.enCuotas=Number.isFinite(n)&&n>0?n:void 0}else if(o==="antesDelPago"){let n=Math.round(Number(t));a.antesDelPago=Number.isFinite(n)&&n>0?n:void 0}else if(o==="grupo")a.grupo=t.trim()||void 0;else if(o==="clase"){a.clase=t==="deuda"?"deuda":void 0,E();return}else a.nombre=t;V()});function qs(e){let a=e.classList.toggle("abierta"),o=e.dataset.idFila;if(o)for(let t of document.querySelectorAll(`[data-hija-de="${CSS.escape(o)}"]`))t.classList.toggle("abierta",a)}function Yt(e,a){let o=document.getElementById(`panel-${e==="metas"?"metas":"obligaciones"}`);if(o){for(let t of o.querySelectorAll("tr[data-resumen]"))t.classList.toggle("abierta",a);for(let t of o.querySelectorAll("[data-hija-de]"))t.classList.toggle("abierta",a)}}v.set("desplegar-todo",e=>Yt(e.dataset.lista,!0));v.set("plegar-todo",e=>Yt(e.dataset.lista,!1));v.set("seccion",e=>{let a=Ze(e.dataset.seccion);Ts(a);let o=document.getElementById("app");o&&(o.className=`seccion-${a}`);for(let t of document.querySelectorAll(".barra-secciones button, .nav-lateral button")){let n=t.dataset.seccion===a;t.classList.toggle("activa",n),t.setAttribute("aria-current",n?"page":"false")}window.scrollTo({top:0,behavior:"instant"})});v.set("nueva-meta",()=>{let e=oe("meta");ia=e,l.metas.push({id:e,nombre:"",valor:0}),E(),document.querySelector(`input[data-id="${e}"][data-campo="nombre"]`)?.focus()});v.set("plegar-meses",e=>{let a=e.dataset.abrir==="1";if(ve.clear(),a)for(let t of document.querySelectorAll("[data-mes]"))ve.add(t.dataset.mes);let o=document.getElementById("panel-vista");o&&Ua(o,da().find(([t])=>t==="vista")[1])});v.set("ordenar",e=>{let a=e.dataset.por,o=(n,s)=>n.localeCompare(s,"es",{sensitivity:"base",numeric:!0}),t=(n,s)=>a==="valor"?s.valor-n.valor:a==="grupo"&&o(n.grupo??"\uFFFF",s.grupo??"\uFFFF")||o(n.nombre,s.nombre);e.dataset.lista==="metas"?(l.metas=[...l.metas].sort(t),y={texto:`Metas ordenadas por ${a}. Ojo: en las metas el orden es la prioridad de pago, as\xED que las fechas de abajo cambiaron. Si no era lo que quer\xEDas, reord\xE9nalas con las flechas.`,malo:!1}):l.obligaciones=[...l.obligaciones].sort(t),E()});v.set("duplicar-meta",e=>{let a=l.metas.findIndex(n=>n.id===e.dataset.id);if(a<0)return;let o=l.metas[a],t={...o,id:oe("meta"),nombre:`${o.nombre} (copia)`,abonado:0};delete t.compra,l.metas.splice(a+1,0,t),E()});v.set("borrar-meta",e=>{l.metas=l.metas.filter(a=>a.id!==e.dataset.id),E()});function Ut(e,a){let o=e+a;if(o<0||o>=l.metas.length)return;let t=l.metas.slice();[t[e],t[o]]=[t[o],t[e]],l.metas=t,E()}v.set("subir",e=>Ut(Number(e.dataset.i),-1));v.set("bajar",e=>Ut(Number(e.dataset.i),1));v.set("nueva-cuenta",()=>{let e=new Date,a=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];l.cuentas.push({id:oe("cta"),periodo:`${a[e.getMonth()]} de ${e.getFullYear()}`,montoEsperado:l.escenario.ingresoEsperado}),E()});v.set("cuenta",e=>{let a=l.cuentas.find(t=>t.id===e.dataset.id);if(!a)return;let o=e.value;e.dataset.campo==="montoEsperado"?a.montoEsperado=q(o):e.dataset.campo==="fechaRadicacion"?a.fechaRadicacion=/^\d{4}-\d{2}-\d{2}$/.test(o)?o:void 0:e.dataset.campo==="periodo"&&(a.periodo=o),V()});v.set("borrar-cuenta",e=>{l.cuentas=l.cuentas.filter(o=>o.id!==e.dataset.id);let a=new Set(l.ingresos.filter(o=>o.cuentaDeCobroId===e.dataset.id).map(o=>o.id));l.ingresos=l.ingresos.filter(o=>o.cuentaDeCobroId!==e.dataset.id),l.repartos=l.repartos.filter(o=>!a.has(o.ingresoId)),E()});v.set("abonar",async e=>{let a=l.cuentas.find(i=>i.id===e.dataset.id);if(!a)return;let o=Me([a],l.ingresos)[0],t=o.pendiente>0?o.pendiente:a.montoEsperado,n=await G({titulo:`\xBFCu\xE1nto te pagaron de ${a.periodo}?`,detalle:o.pendiente>0&&o.recibido>0?`Ya te hab\xEDan pagado ${b(o.recibido)}. Faltan ${b(o.pendiente)}.`:void 0,valorInicial:I(t),dinero:!0,textoAceptar:"Registrar pago"});if(n===null)return;let s=q(n);if(!Number.isFinite(s)||s<=0)return y={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},x();let r={id:oe("ing"),cuentaDeCobroId:a.id,fecha:j(),monto:s};l.ingresos.push(r),l.repartos.push($e(r)),y={texto:"Registrado. Mira abajo en qu\xE9 se va ese dinero y corr\xEDgelo si no fue as\xED.",malo:!1},E()});v.set("comprada",async e=>{let a=l.metas.find(s=>s.id===e.dataset.id);if(!a)return;let o=await G({titulo:`\xBFPor cu\xE1nto compraste ${a.nombre}?`,detalle:`La ten\xEDas en ${b(a.valor)}. Pon lo que pagaste de verdad, aunque sea distinto.`,valorInicial:I(a.valor),dinero:!0,textoAceptar:"Siguiente"});if(o===null)return;let t=await G({titulo:"\xBFEn qu\xE9 mes la compraste?",detalle:"Escr\xEDbelo como AAAA-MM. Por ejemplo, 2026-08 para agosto de este a\xF1o.",valorInicial:j().slice(0,7),textoAceptar:"Guardar"});if(t===null)return;let n=/^\d{4}-\d{2}$/.test(t.trim())?t.trim():j().slice(0,7);a.compra={mes:n,precioReal:q(o)},E()});v.set("no-comprada",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&(delete a.compra,E())});v.set("proponer",e=>{let a=l.ingresos.find(o=>o.id===e.dataset.id);a&&(l.repartos=l.repartos.filter(o=>o.ingresoId!==a.id),l.repartos.push($e(a)),E())});v.set("confirmar-reparto",e=>{let a=l.repartos.find(o=>o.id===e.dataset.id);a&&(a.propuesto=!1,E())});v.set("editar-reparto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id);if(!a)return;let o=q(e.value),t=e.dataset.tipo,n=Number(e.dataset.i);t==="ahorro"?a.alAhorro=o:t==="obligaciones"&&a.obligaciones[n]?a.obligaciones[n].monto=o:t==="abonos"&&a.abonos[n]&&(a.abonos[n].monto=o),a.propuesto=!1,V()});v.set("quitar-previo",e=>{let a=l.metas.find(t=>t.id===e.dataset.id);if(!a)return;let o=a.abonado??0;a.abonado=0,y={texto:`Quit\xE9 los ${b(o)} que estaban escritos a mano en ${a.nombre}. Ahora manda lo registrado en \xABen qu\xE9 se fue la plata\xBB, que es lo que de verdad pagaste.`,malo:!1},E()});v.set("gasto-a-abono",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.metas.find(s=>s.id===e.dataset.meta);if(!a||!o)return;let t=e.dataset.nombre,n=(a.gastos??[]).find(s=>s.nombre===t);n&&(a.gastos=a.gastos.filter(s=>s!==n),a.abonos.push({nombre:o.nombre,monto:n.monto,refId:o.id,movidoDesdeGasto:!0}),y={texto:`Listo: los ${b(n.monto)} de \xAB${n.nombre}\xBB ahora cuentan como abono a ${o.nombre}. El total del mes no cambi\xF3. Si te equivocaste, la l\xEDnea tiene un bot\xF3n \u21A9 para devolverla a gastos.`,malo:!1},E())});v.set("abono-a-gasto",e=>{let a=l.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.abonos[o];!a||!t||(a.abonos=a.abonos.filter((n,s)=>s!==o),a.gastos=[...a.gastos??[],{nombre:t.nombre,monto:t.monto}],y={texto:`${t.nombre} volvi\xF3 a ser un gasto suelto.`,malo:!1},E())});v.set("nuevo-gasto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=Ee(a,o),n=t>0?t:Math.min(a.alAhorro,a.alAhorro);a.gastos=[...a.gastos??[],{nombre:"",monto:0}],n<=0&&(a.propuesto=!1),E()});v.set("editar-gasto",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];if(!a||!t)return;let n=e.value;if(e.dataset.campo==="nombre")t.nombre=n;else{let s=q(n);a.alAhorro=Math.max(0,a.alAhorro-(s-t.monto)),t.monto=s}a.propuesto=!1,V()});v.set("borrar-gasto",e=>{let a=l.repartos.find(n=>n.id===e.dataset.id),o=Number(e.dataset.i),t=a?.gastos?.[o];!a||!t||(a.alAhorro+=t.monto,a.gastos=a.gastos.filter((n,s)=>s!==o),E())});v.set("recalcular",e=>{let a=l.repartos.find(s=>s.id===e.dataset.id),o=l.ingresos.find(s=>s.id===a?.ingresoId);if(!a||!o)return;let t=a.gastos??[],n=$e(o);n.gastos=t,n.alAhorro=Math.max(0,n.alAhorro-t.reduce((s,r)=>s+r.monto,0)),l.repartos=l.repartos.map(s=>s.id===a.id?n:s),y={texto:"Recalculado con las obligaciones de ahora.",malo:!1},E()});v.set("cuadrar",e=>{let a=l.repartos.find(t=>t.id===e.dataset.id),o=l.ingresos.find(t=>t.id===a?.ingresoId);!a||!o||(a.alAhorro=Math.max(0,a.alAhorro+Ee(a,o)),a.propuesto=!1,E())});v.set("aporte-externo",async e=>{let a=await G({titulo:"\xBFCu\xE1nto vas a meter de tu bolsillo?",detalle:"Plata tuya que no viene del trabajo: Nequi, efectivo, lo que tengas guardado por otro lado.",valorInicial:"0",dinero:!0,textoAceptar:"Meterlo"});if(a===null)return;let o=q(a);if(o<=0)return y={texto:"Ese monto no se entiende. No registr\xE9 nada.",malo:!0},x();let t=await G({titulo:"\xBFDe d\xF3nde sali\xF3?",detalle:"Para que dentro de unos meses sepas qu\xE9 fue esto.",valorInicial:"Nequi",textoAceptar:"Guardar"}),n={id:oe("ing"),fecha:j(),monto:o,nota:t?.trim()||"de otro lado"};l.ingresos.push(n),l.repartos.push($e(n)),E()});v.set("soporte",e=>{let a=Se(new Date),o=new Set(l.soportesMarcados[a]??[]),t=e.dataset.id;e.checked?o.add(t):o.delete(t),l.soportesMarcados={...l.soportesMarcados,[a]:[...o]},V()});v.set("borrar-ingreso",e=>{l.repartos=l.repartos.filter(a=>a.ingresoId!==e.dataset.id),l.ingresos=l.ingresos.filter(a=>a.id!==e.dataset.id),E()});var St="";async function ws(){let e=globalThis.__TAURI__;if(!e?.fs?.writeTextFile||!e?.path?.localDataDir)return;let a=JSON.stringify({version:1,entradas:it(new Date,l.cuentas,l.ingresos,l.soportesMarcados)});if(a!==St)try{let o=await e.path.localDataDir();await e.fs.writeTextFile(`${o.replace(/[\\/]+$/,"")}\\GestionDineroTrabajo-aviso-radicacion.json`,a),St=a}catch{}}function Jt(){let e=globalThis.__TAURI__;return e?.dialog&&e?.fs?{dialog:e.dialog,fs:e.fs}:null}v.set("exportar",async()=>{let e=Ca(l),a=`respaldo-dinero-${j()}.json`,o=Jt();if(!o){let t=new Blob([e],{type:"application/json"}),n=document.createElement("a");return n.href=URL.createObjectURL(t),n.download=a,n.click(),URL.revokeObjectURL(n.href),y={texto:`Respaldo guardado en tu carpeta de descargas como ${a}.`,malo:!1},x()}try{let t=await o.dialog.save({title:"\xBFD\xF3nde guardo el respaldo?",defaultPath:a,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!t)return;await o.fs.writeTextFile(t,e),y={texto:`Respaldo guardado en ${t}`,malo:!1}}catch(t){y={texto:`No pude guardar el respaldo: ${String(t)}`,malo:!0}}x()});v.set("importar",async()=>{let e=Jt();if(e)try{let o=await e.dialog.open({title:"\xBFQu\xE9 respaldo quieres cargar?",multiple:!1,filters:[{name:"Respaldo del programa",extensions:["json"]}]});if(!o)return;let{estado:t,aviso:n}=Pa(await e.fs.readTextFile(o));return t?(l=t,y={texto:"Respaldo importado.",malo:!1},E()):(y={texto:n.texto,malo:!0},x())}catch(o){return y={texto:`No pude leer ese archivo: ${String(o)}`,malo:!0},x()}let a=document.getElementById("archivo");a.onchange=async()=>{let o=a.files?.[0];if(!o)return;let{estado:t,aviso:n}=Pa(await o.text());if(!t)return y={texto:n.texto,malo:!0},x();l=t,y={texto:"Respaldo importado.",malo:!1},E()},a.click()});document.addEventListener("input",e=>{let a=e.target;a instanceof HTMLInputElement&&a.hasAttribute("data-dinero")&&Co(a)});document.addEventListener("focusout",e=>{let a=e.target?.closest?.("[data-panel]");if(!a||e.relatedTarget?.closest?.("[data-panel]")===a)return;let t=a.dataset.panel;setTimeout(()=>{if(qe||Ht()===t)return;let n=da().find(([r])=>r===t)?.[1],s=document.getElementById(`panel-${t}`);n!==void 0&&s&&Ua(s,n)},0)});document.addEventListener("toggle",e=>{let a=e.target,o=a?.dataset?.mes;o&&(a.open?ve.add(o):ve.delete(o))},!0);document.addEventListener("click",e=>{k&&e.target?.classList?.contains("cerrable")&&(k=null,x())});document.addEventListener("keydown",e=>{e.key==="Escape"&&k&&(k=null,x())});document.addEventListener("change",e=>{let a=e.target?.closest("[data-accion]");a&&v.get(a.dataset.accion)?.(a,e)});document.addEventListener("click",e=>{let a=e.target,o=a?.closest?.("a[data-enlace]"),t=globalThis.__TAURI__?.opener;if(o&&t?.openUrl){e.preventDefault(),t.openUrl(o.href).catch(()=>{y={texto:"No pude abrir el enlace en el navegador.",malo:!0},x()});return}let n=a?.closest?.("tr[data-resumen]");if(sa){sa=!1;return}if(n&&!a?.closest("input, select, textarea, button, a")&&window.matchMedia("(max-width: 620px)").matches){qs(n);return}let s=e.target?.closest("button[data-accion]");qe=!1,s?(he=!1,v.get(s.dataset.accion)?.(s,e)):he&&(he=!1,Ae())});"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(()=>{})});var na=xo();l=na.estado;na.aviso&&(y={texto:na.aviso.texto,malo:na.aviso.grave});function Os(){let e=new Set(l.repartos.map(o=>o.ingresoId)),a=l.ingresos.filter(o=>!e.has(o.id)).sort((o,t)=>o.fecha.localeCompare(t.fecha));for(let o of a)l.repartos.push($e(o));return a.length>0}Os()&&be(l);x();nt(ea(),j())&&Ya();globalThis.__estado=()=>l;globalThis.__reiniciar=()=>{l=ae(),E()};v.set("nube-entrar",async()=>{let e=document.getElementById("nube-correo")?.value??"",a=document.getElementById("nube-clave")?.value??"";if(!e.trim()||!a)return y={texto:"Escribe tu correo y tu contrase\xF1a.",malo:!0},x();try{y={texto:`Entraste como ${(await _o(e,a)).correo}. Ya puedes sincronizar.`,malo:!1}}catch(o){y={texto:o.message,malo:!0}}x()});v.set("nube-salir",()=>{wa(),W=null,_=[],y={texto:"Saliste de la cuenta. Tus datos siguen aqu\xED, intactos.",malo:!1},x()});v.set("nube-preparar",async e=>{if(O)return;let a=e.dataset.modo==="traer"?"traer":"subir";O=!0,x();try{let o=await Go(),t=fe(l),n=Yo(t,o);n.length===0?(W=JSON.parse(JSON.stringify(l)),Ye(W),k={titulo:"Este aparato y la nube ya est\xE1n iguales",lineas:["No hab\xEDa nada que cambiar."],malo:!1}):L={modo:a,locales:t,remotas:o,difs:n,elecciones:ja(n,a)}}catch(o){k={titulo:"No se pudo comparar con la nube",lineas:[o.message,"No se cambi\xF3 nada."],malo:!0}}O=!1,x()});v.set("abrir-meses",e=>Ko(e));v.set("respaldo-guardar",()=>{let e=document.getElementById("resp-repo")?.value.trim()??"",a=document.getElementById("resp-token")?.value.trim()??"";if(!/^[\w.-]+\/[\w.-]+$/.test(e)||!a)return y={texto:"Falta el repositorio (usuario/nombre) o la llave.",malo:!0},x();Te({repo:e,token:a}),x(),Ya()});v.set("respaldo-ahora",()=>{Ya()});v.set("respaldo-quitar",()=>{Te(null),x()});v.set("si-me-entran",e=>{let a=q(e.value);se=a>0?a:null,x()});v.set("si-me-entran-quitar",()=>{se=null,x()});v.set("precio-sigue",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&(a.precioRevisado=j(),E())});v.set("meta-dolares",e=>{let a=l.metas.find(o=>o.id===e.dataset.id);a&&(a.enDolares=a.enDolares?void 0:!0,E())});v.set("dona-mes",e=>{ta=e instanceof HTMLSelectElement?e.value:e.dataset.mes??null,x()});v.set("nube-cerrar-ventana",()=>{k=null,x()});v.set("nube-elegir",e=>{if(!L)return;let a=e.dataset.lado==="nube"?"nube":"aqui";L.elecciones[e.dataset.clave]=a;let o=e.dataset.clave;for(let t of document.querySelectorAll(`input[type="radio"][name="${CSS.escape(o)}"]`))t.closest(".opcion")?.classList.toggle("elegida",t.checked)});v.set("nube-cancelar",()=>{L=null,k={titulo:"Cancelado",lineas:["No se cambi\xF3 nada, ni aqu\xED ni en la nube."],malo:!1},x()});v.set("nube-aplicar",async()=>{if(!(!L||O)){O=!0,x();try{let e=L,a=Uo(e.locales,e.remotas,e.difs,e.elecciones,new Date().toISOString()),o=e.difs.map(t=>vs(t,e.elecciones[t.clave]??"aqui"));await Qo(a),l=Ve(a,l),be(l),W=JSON.parse(JSON.stringify(l)),Ye(W),_=[],L=null,k={titulo:`Listo: ${e.modo==="subir"?"subido":"tra\xEDdo"}. Este aparato y la nube quedaron iguales`,lineas:o,malo:!1}}catch(e){k={titulo:"No se aplic\xF3 nada",lineas:[e.message],malo:!0}}O=!1,x()}});v.set("nube-sincronizar",async()=>{if(!O){O=!0,x();try{let e=await Bo(l,W,new Date().toISOString());l=e.estado,W=JSON.parse(JSON.stringify(e.estado)),_=e.descartes.map(a=>({tabla:a.tabla,id:a.id,campo:a.campo,valor:a.valor,gano:a.gano,nombre:a.nombre})),be(l),Ye(W),y={texto:_.length===0?"Todo al d\xEDa. Nada que resolver.":`Listo. ${_.length} dato(s) distintos entre los dos aparatos: mira abajo.`,malo:!1}}catch(e){y={texto:e.message,malo:!0}}O=!1,x()}});v.set("nube-revertir",e=>{let a=Number(e.dataset.i),o=_[a];if(!o)return;let t=vt(l,o);if(!t.ok)return y={texto:t.motivo??"Eso no se puede deshacer desde aqu\xED.",malo:!0},x();_=_.filter((n,s)=>s!==a),be(l),y={texto:`Listo: ${Ke(o,l)} se queda con ${Pe(o.campo,o.valor)}. Sincroniza otra vez para que el otro aparato lo tome.`,malo:!1},x()});document.addEventListener("keydown",e=>{if(e.key!=="Enter"||e.isComposing)return;let a=e.target;!a||a.closest(".capa-dialogo")||!(a instanceof HTMLInputElement)||a.type==="checkbox"||(e.preventDefault(),a.blur())});
