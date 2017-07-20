# Plugin jQuery Mascara
Esse plugin aplica uma máscara ao campo / controle ao qual é referenciado. Além da máscara, também controla o conteúdo digitado.

# Pré-requisitos
Esse plugin necessita do jQuery (https://jquery.com/).

## Desenvolvedor
Diego Lepera
dlepera88@gmail.com
http://diegolepera.xyz/

## Opções
### placeholder
boolean default true

Quando definido como **true**, o plugin gera um placeholder demonstrativo da máscara,
substituíndo os caracteres editáveis por underlines.

Ex:
```
$('#celular-9').mascara('(00) 9 0000-0000', {placeholder: true});
Placeholder: (_\_) 9 \_\_\_\_-\_\_\_\_
```

### limitar
boolean default true

Quando definido como **true**, o plugin bloqueia a digitação no campo ao atingir o
limite máximo da máscara. Quando **false**, permite que a digitação continue.

Ex:

Valor digitado no campo: 3001198800

```
$('#data').mascara('00/00/0000', {limitar: true});
Valor do campo: 30/01/1988
```

```
$('#data').mascara('00/00/0000', {limitar: false});
Valor do campo: 30/01/198800
```

## Exemplos
### Telefone com DDD e 8 dígitos
```
$('#telefone').mascara('(00) 0000-0000');
```

### CNPJ
```
$('#cnpj').mascara('00.000.000/0000-00');
```

### CPF
```
$('#cpf').mascara('000.000.000-00');
```
