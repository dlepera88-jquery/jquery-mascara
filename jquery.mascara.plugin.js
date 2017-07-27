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

/* global Set */

// Verificar se o jQuery foi inicializado
if (jQuery === undefined) {
    console.error('[Plugin $.mascara] O jQuery ainda não foi inciado.\nPara utilizar esse plugin é necessário inicializar o jQuery antes.');
} // Fim if

(function ($) {
    /**
     * Funções para controlar a máscara
     * @type {Object}
     */
    var fMask = {
        /**
         * Mapear as posições da máscara que podem ser editadas
         * @param  {String} mascara    Máscara a ser analisada
         * @param  {Object} mapeamento Mapeamento usado para aplicar a máscara
         * @return {Object}            Objeto com o mapeamento encontrado. A chave
         * do objeto representa a posição e o valor um booleano indicando se essa
         * posição pode ser editada (true) ou não (false)
         */
        mapearMascara: function (mascara, mapeamento) {
            var editaveis = Object.keys(mapeamento);
            var mapa = {};
            var tm_mask = mascara.length;

            for (var caractere = 0; caractere < tm_mask; caractere++) {
                mapa[caractere] = $.inArray(mascara[caractere], editaveis) > -1;
            } // Fim for

            return mapa;
        }, // Fim function mapearMascara

        /**
         * Remover a máscara de um determinado valor
         * @param  {String} valor      Valor a ser limpo
         * @param  {String} mascara    Máscara que foi aplicada ao valor
         * @param  {Object} mapeamento Mapeamento usado para aplicar a máscara
         * @return {String}            Valor sem a máscara
         */
        limparValor: function (valor, mascara, mapeamento) {
            var mask_fixos = [];
            var mapa = fMask.mapearMascara(mascara, mapeamento);

            for (var posicao in mapa) {
                if (!mapa[posicao]) {
                    mask_fixos.push(mascara[posicao]);
                } // Fim if
            } // Fim for

            return valor.replace(new RegExp('[' + Array.from(new Set(mask_fixos)).join('') + ']', 'g'), '');
        }, // Fim function limparValor

        /**
         * Aplicar a máscara ao valor informado
         * @param  {String}  valor          Valor para aplicar a máscara
         * @param  {String}  mascara        Máscara a ser aplicada ao valor
         * @param  {Object}  mapeamento     Mapeamento a ser considerado para a
         * aplicação da máscara
         * @param  {Boolean} [limitar]      Se true, limita o valor do campo ao tamanho
         * da máscara
         * @return {String}                 Valor com a máscara aplicada
         */
        aplicarMascara: function (valor, mascara, mapeamento, limitar) {
            var valor_limpo = fMask.limparValor(valor, mascara, mapeamento),
                valor_mask = '',
                mapa = fMask.mapearMascara(mascara, mapeamento),
                letra = 0, prox_posicao;

            for (var posicao in mapa) {
                if (typeof valor_limpo[letra] === 'undefined') {
                    break;
                } // Fim if

                if (mapa[posicao]) {
                    if (mapeamento[mascara[posicao]].test(valor_limpo[letra])) {
                        valor_mask += valor_limpo[letra];
                    } // Fim if

                    letra++;
                } else {
                    valor_mask += mascara[posicao];
                } // Fim if
            } // Fim for

            while ((prox_posicao = posicao + 1) && mapa[posicao] === false) {
                // console.log(prox_posicao, mapa[posicao]);
                valor_mask += mascara[posicao++];
            }

            if (!limitar && letra < valor_limpo.length) {
                valor_mask += valor_limpo.substring(letra);
            } // Fim if

            return valor_mask;
        }, // Fim function aplicarMascar

        /**
         * Exibir um indicativo da máscara com underline _ no lugar dos editáveis
         * @param  {String} mascara    Máscara a ser analisada
         * @param  {Object} mapeamento Mapeamento a ser aplicado a máscara
         * @return {String}            Indicativo com a máscara aplicada
         */
        criarPlaceholder: function (mascara, mapeamento) {
            var placeholder = '';
            var mapa = fMask.mapearMascara(mascara, mapeamento);

            for (var posicao in mapa) {
                placeholder += mapa[posicao] ? '_' : mascara[posicao];
            } // Fim for

            return placeholder;
        } // Fim function criarPlaceholder
    };


    /**
     * Funções para controlar o cursor
     * @type {Object}
     */
    var fCursor = {
        /**
         * Obter a posição do cursor dentro do controle
         * @param  {DOM} elemento Identificador DOM do elemento
         * @return {Int}          Posição atual do cursor (zero based)
         */
        obter: function (elemento) {
            try {
                return elemento.selectionStart || 0;
            } catch (ex) {
                console.error(ex);
            } // Fim try
        },

        /**
         * Mover o cursor para uma posição específica
         * @param  {DOM} elemento Identificador DOM do elemento
         * @param  {Int} posicao  Posição para colocar o cursor (zero based)
         * @return {Void}
         */
        mover: function (elemento, posicao) {
            try {
                // Firefox, Safari, Chrome... :D
                if (elemento.setSelectionRange) {
                    elemento.setSelectionRange(posicao, posicao);
                } else { // IE :P
                    var range = elemento.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', posicao);
                        range.moveStart('character', posicao);
                        range.select();
                } // Fim if ... else
            } catch (ex) {
                console.error(ex);
            } // Fim try
        }
    };


    /**
     * Iniciar o plugin para uma instância do jQuery
     * @param  {String} mascara Configuração da máscara a ser aplicada
     * @param  {Object} opcoes  Opções extras a serem consideradas para aplicar
     * a máscara
     * @return {Object.jQuery}  Instância jQuery modificada
     */
    $.fn.mascara = function (mascara, opcoes) {
        /**
         * Mapeamento dos caracteres chaves da máscara. Esses caracteres serão
         * substituídos de acordo com a digitação do usuário, desde que sejam
         * compatíveis com a expressão regular correspondente
         * @type {Object}
         */
        var mapeamento = {
            '0': /[\d]/,
            'A': /[A-Z]/,
            'a': /[a-z]/,
            'w': /[A-Za-z]/
        };

        /**
         * Opcões padrão. Esses valores serão usados quando o desenvolvedor
         * não indicar outros através do parâmetro 'opcoes' do plugin
         * @type {Object}
         */
        opcoes = $.extend(true, {
            /**
             * Define se o valor do campo deve se limitar ao tamanho da máscara
             * @type {Boolean}
             */
            limitar: true,

            /**
             * Mostrar um placeholder indicativo da máscara.
             * Obs: Não substitui placeholder configurado no HTML
             * @type {Boolean}
             */
            placeholder: true,

            /**
             * Array com os códigos ASCII das teclas a serem ignoradas
             * @type {Array}
             */
            ignorarTeclas: [
                8,  // Backspace / delete
                9,  // TAB
                37, // Seta para esquerda
                38, // Seta para cima
                39, // Seta para direita
                40  // Seta para baixo
            ]
        }, opcoes);

        return this.each(function () {
            /**
             * Instância jQuery a ser modificada
             * @type {Object.jQuery}
             */
            var $this = $(this);

            if (typeof opcoes.mapeamento !== 'undefined') {
                mapeamento = $.extend(true, {}, mapeamento, opcoes.mapeamento);
            } // Fim if

            // Criar e exibir o placeholder da máscara
            if (opcoes.placeholder && !$this.is('[placeholder]')) {
                $this.attr('placeholder', fMask.criarPlaceholder(mascara, mapeamento));
            } // Fim if

            // Limitar o tamanho do campo de acordo com o tamanho da máscara
            if (opcoes.limitar) {
                $this.attr('maxlength', mascara.length);
            } // Fim if

            // Remover os eventos da máscara anterior para evitar conflitos
            $this.off('.' + $.fn.mascara.evt_ns)

            // Aplicar a máscara durante a digitação
            .on('keyup.' + $.fn.mascara.evt_ns, $.extend(true, {}, {msk: mascara, map: mapeamento}, opcoes), function (evt) {
                var $_this = $(this),
                    opcoes = evt.data,
                    kc = evt.keyCode || evt.which,
                    kmod = evt.metaKey || evt.ctrlKey,
                    posicao_atual;

                /*
                 * A máscara apenas será aplicada quando a tecla pressionada não estiver
                 * configurada para ser ignorada
                 */
                if (!kmod && $.inArray(kc, opcoes.ignorarTeclas) < 0) {
                    posicao_atual = fCursor.obter(this);
                    $_this.val(fMask.aplicarMascara($_this.val(), opcoes.msk, opcoes.map, opcoes.limitar));
                    fCursor.mover(this, posicao_atual + (posicao_atual >= $_this.val().length - 1));
                } // Fim if
            })

            // Alguns navegadores disparam o evento oninput ao preencher automaticamente
            // um campo. Por isso, uso esse evento para aplicar a máscara
            .on('input.' + $.fn.mascara.evt_ns, $.extend(true, {}, {msk: mascara, map: mapeamento}, opcoes), function (evt) {
                var $_this = $(this), opcoes = evt.data;
                $_this.val(fMask.aplicarMascara($_this.val(), opcoes.msk, opcoes.map, opcoes.limitar));
            });
        });
    };

    /**
     * Nome do namespace usado para criar e utilizar os eventos do plugin
     * @type {String}
     */
    $.fn.mascara.evt_ns = '__msk';

    $(window).on('load.' + $.fn.mascara.evt_ns, function () {
        // Iniciar o plugin automaticamente em elementos que solicitam a máscara
        $('[data-mask]').each(function () {
            var $this = $(this),
                mask = $this.data('mask'),
                atributos, attr_data = {},
                nome, valor;

            if (typeof mask !== 'undefined') {
                /*
                 * Identificar todos os atributos data- do campo para incluir como opcoes
                 */
                atributos = this.attributes;

                for (var attr in atributos) {
                    nome = atributos[attr].name;

                    if (/^data\-/.test(nome)) {
                        valor = atributos[attr].value;

                        /*
                         * Os valores dos atributos vem como string. Portanto,
                         * é necssário converter os valores 0 e 1 para false e
                         * true respectivamente.
                         *
                         * Obs: 'eval is evil' e não funcionou bem quando foi utilizado
                         */
                        if (valor === '0') {
                            valor = false;
                        } else if (valor === '1') {
                            valor = true;
                        } // Fim if

                        attr_data[nome.replace(/^data\-/, '')] = valor;
                    } // Fim if
                } // Fim for

                $this.mascara(mask, attr_data);
            } // Fim if
        });
    });
})(jQuery);
