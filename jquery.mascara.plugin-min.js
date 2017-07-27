/** @preserve
 * jquery.mascara.plugin.js
 * @version: v1.17.07-r1
 * @author: Diego Lepera
 *
 * Created by Diego Lepera on 2017-07-11. Please report any bug at
 * https://github.com/dlepera88-jquery/jquery-mascara/issues
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 Diego Lepera http://diegolepera.xyz/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
void 0===jQuery&&console.error("[Plugin $.mascara] O jQuery ainda não foi inciado.\nPara utilizar esse plugin é necessário inicializar o jQuery antes."),function($){var a={mapearMascara:function(a,r){for(var e=Object.keys(r),t={},n=a.length,i=0;i<n;i++)t[i]=$.inArray(a[i],e)>-1;return t},limparValor:function(r,e,t){var n=[],i=a.mapearMascara(e,t);for(var c in i)i[c]||n.push(e[c]);return r.replace(new RegExp("["+Array.from(new Set(n)).join("")+"]","g"),"")},aplicarMascara:function(r,e,t,n){var i=a.limparValor(r,e,t),c="",o=a.mapearMascara(e,t),s=0,l;for(var m in o){if(void 0===i[s])break;o[m]?(t[e[m]].test(i[s])&&(c+=i[s]),s++):c+=e[m]}for(;(l=m+1)&&!1===o[m];)c+=e[m++];return!n&&s<i.length&&(c+=i.substring(s)),c},criarPlaceholder:function(r,e){var t="",n=a.mapearMascara(r,e);for(var i in n)t+=n[i]?"_":r[i];return t}},r={obter:function(a){try{return a.selectionStart||0}catch(a){console.error(a)}},mover:function(a,r){try{if(a.setSelectionRange)a.setSelectionRange(r,r);else{var e=a.createTextRange();e.collapse(!0),e.moveEnd("character",r),e.moveStart("character",r),e.select()}}catch(a){console.error(a)}}};$.fn.mascara=function(e,t){var n={0:/[\d]/,A:/[A-Z]/,a:/[a-z]/,w:/[A-Za-z]/};return t=$.extend(!0,{limitar:!0,placeholder:!0,ignorarTeclas:[8,9,37,38,39,40]},t),this.each(function(){var i=$(this);void 0!==t.mapeamento&&(n=$.extend(!0,{},n,t.mapeamento)),t.placeholder&&!i.is("[placeholder]")&&i.attr("placeholder",a.criarPlaceholder(e,n)),t.limitar&&i.attr("maxlength",e.length),i.off("."+$.fn.mascara.evt_ns).on("keyup."+$.fn.mascara.evt_ns,$.extend(!0,{},{msk:e,map:n},t),function(e){var t=$(this),n=e.data,i=e.keyCode||e.which,c=e.metaKey||e.ctrlKey,o;!c&&$.inArray(i,n.ignorarTeclas)<0&&(o=r.obter(this),t.val(a.aplicarMascara(t.val(),n.msk,n.map,n.limitar)),r.mover(this,o+(o>=t.val().length-1)))}).on("input."+$.fn.mascara.evt_ns,$.extend(!0,{},{msk:e,map:n},t),function(r){var e=$(this),t=r.data;e.val(a.aplicarMascara(e.val(),t.msk,t.map,t.limitar))})})},$.fn.mascara.evt_ns="__msk",$(window).on("load."+$.fn.mascara.evt_ns,function(){$("[data-mask]").each(function(){var a=$(this),r=a.data("mask"),e,t={},n,i;if(void 0!==r){e=this.attributes;for(var c in e)n=e[c].name,/^data\-/.test(n)&&(i=e[c].value,"0"===i?i=!1:"1"===i&&(i=!0),t[n.replace(/^data\-/,"")]=i);a.mascara(r,t)}})})}(jQuery);