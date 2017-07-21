/** @preserve
 * jquery.mascara.plugin.js
 * @version: v1.17.07
 * @author: Diego Lepera
 *
 * Created by Diego Lepera on 2017-07-11. Please report any bug at
 * http://diegolepera.xyz/contato
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
void 0===jQuery&&console.error("[Plugin $.mascara] O jQuery ainda não foi inciado.\nPara utilizar esse plugin é necessário inicializar o jQuery antes."),function($){var fMask={mapearMascara:function(a,r){for(var e=Object.keys(r),t={},o=a.length,n=0;n<o;n++)t[n]=$.inArray(a[n],e)>-1;return t},limparValor:function(a,r,e){var t=[],o=fMask.mapearMascara(r,e);for(var n in o)o[n]||t.push(r[n]);return a.replace(new RegExp("["+Array.from(new Set(t)).join("")+"]","g"),"")},aplicarMascara:function(a,r,e,t){var o=fMask.limparValor(a,r,e),n="",s=fMask.mapearMascara(r,e),i=0,c;for(var l in s){if(void 0===o[i])break;s[l]?(e[r[l]].test(o[i])&&(n+=o[i]),i++):n+=r[l]}for(;(c=l+1)&&!1===s[l];)n+=r[l++];return!t&&i<o.length&&(n+=o.substring(i)),n},criarPlaceholder:function(a,r){var e="",t=fMask.mapearMascara(a,r);for(var o in t)e+=t[o]?"_":a[o];return e}},fCursor={obter:function(a){try{return a.selectionStart||0}catch(a){console.error(a)}},mover:function(a,r){try{if(a.setSelectionRange)a.setSelectionRange(r,r);else{var e=a.createTextRange();e.collapse(!0),e.moveEnd("character",r),e.moveStart("character",r),e.select()}}catch(a){console.error(a)}}};$.fn.mascara=function(mascara,opcoes){var evt_ns="__msk",mapeamento={0:/[\d]/,A:/[A-Z]/,a:/[a-z]/,w:/[A-Za-z]/};return opcoes=$.extend(!0,{limitar:!0,placeholder:!0,ignorarTeclas:[8,9,37,38,39,40]},opcoes),$(window).on("load.__msk",function(){$("[data-mask]").each(function(){var $this=$(this),mask=$this.data("mask"),atributos,attr_data={},nome,valor;if(void 0!==mask){atributos=this.attributes;for(var attr in atributos)nome=atributos[attr].name,/^data\-/.test(nome)&&(valor=atributos[attr].value,attr_data[nome.replace(/^data\-/,"")]=eval(valor));$this.mascara(mask,attr_data)}})}),this.each(function(){var a=$(this);void 0!==opcoes.mapeamento&&(mapeamento=$.extend(!0,{},mapeamento,opcoes.mapeamento)),opcoes.placeholder&&!a.is("[placeholder]")&&a.attr("placeholder",fMask.criarPlaceholder(mascara,mapeamento)),opcoes.limitar&&a.attr("maxlength",mascara.length),a.off("."+evt_ns).on("keyup."+evt_ns,$.extend(!0,{},{msk:mascara,map:mapeamento},opcoes),function(a){var r=$(this),e=a.data,t=a.keyCode||a.which,o=a.metaKey||a.ctrlKey,n;!o&&$.inArray(t,e.ignorarTeclas)<0&&(n=fCursor.obter(this),r.val(fMask.aplicarMascara(r.val(),e.msk,e.map,e.limitar)),fCursor.mover(this,n+(n>=r.val().length-1)))})})}}(jQuery);