---
title: Closures a fondo en JavaScript
description: Aprende qué son las closures y otros conceptos del lenguaje JavaScript que hacen posibles su funcionamiento.
pubDate: 2026-09-07T00:00:00-06:00
image: /r2/images/blog/02-closures-a-fondo-en-js.webp
minRead: 20
categories:
  - javascript
---

Cuando comencé a aprender sobre las closures, escuché y leí muchas veces explicaciones como esta: *"Una closure es una función
que retorna otra función, y la función que se retorna usa variables que se definieron en el cuerpo de la función padre"*, o
varias explicaciones que prácticamente se referían a algo similar a esta definición, y aunque en el escenario que se expone en
esta definición se forma una closure, la definición como tal no es 100% correcta y hay muchas otras cosas que podemos aprender
para profundizar en el uso y comportamiento de las closures.

En este artículo exploramos a fondo qué son las closures, así como otros conceptos del lenguaje JavaScript, como el entorno léxico,
que nos ayudarán a comprender el funcionamiento interno de las mismas. Aprenderemos cómo es que estos conceptos se relacionan
directamente con los alcances de bloque(scopes) introducidos en la especificación ECMAScript 6, así como la relación que tienen
con las closures, y cómo el entender estos mecanismos nos ayudarán a comprender cómo es que al usar closures se pueden mantener
"vivas" variables, constantes, parámetros y demás dentro de su alcance, incluso cuando la función donde fueron creadas hayan
terminado su ejecución. Si te interesa conocer todo esto te invito a leer hasta al final porque hay mucha información interesante y
seguro que algo nuevo aprendes hoy.


## ¿Qué son las closures?

Un closure es la combinación de una función agrupada dentro de otra con referencias a su estado adyacente. Veamos el siguiente
ejemplo para entenderlo un poco mejor:

``` js
function padre() {
  let nombre = 'pemid'

  function hijo() {
	  // hijo es la función interna que forma el closure
    console.log(nombre) // Podemos acceder a la variable nombre
  }

  hijo()
}

padre() // Se muestra en la consola 'pemid'
```

En este ejemplo podemos ver que en la función `hijo` se lee la variable declarada en la función `padre`, prácticamente, en este
ejemplo la closure se crea entre al función `hijo` y la variable declarada en la función `padre`. Si has programado con JavaScript
o TypeScript durante un tiempo te habrás percatado de que realmente esto se relaciona directamente con otro concepto que también
es muy importante desde inicio que es el ***scope*** o alcance, y esto mismo se relaciona con los conceptos de ***Ámbito Léxico***
y ***Entorno Léxico***.


### Alcance con `let` y `const`

Antes de conocer lo que son el Ámbito Léxico y el Entorno Léxico, conozcamos el contexto en que estos conceptos fueron concebidos
en JavaScript. En JavaScript tradicional, antes de la llegada de la especificación ECMAScript 6(ES6), las variables eran declaradas
con la palabra reservada `var`, con estas variables, JavaScript hacia un proceso de ***hoisting***, el cual *"elevaba"* la
declaración de las variables al inicio de la ejecución del archivo o módulo, lo cual hacía que pudieras usarlas incluso antes de su
declaración o inicialización explícita, tal y como se muestra en el siguiente ejemplo:

``` js
var x // declarada, inicializada con undefined

console.log(x) // undefined
console.log(y) // undefined
// la variable "y" se puede usar antes de su declaración debido al proceso de hoisting 

x = 5

if (true) {
  var y // Declarada, "hoisteada" e inicializada en undefined
  console.log(x) // 5
}

y = 10

console.log(y) // 10
```

Esto como te puedes imaginar, podía causar bugs muy complicados de encontrar. Con la llegada de ES6, JavaScript introdujo nuevas
formas de declarar variables y constantes, esto como sabemos es con las palabras reservadas `let` y `const`, con esto llegaron
nuevos conceptos, entre los cuales están las ***Temporal Dead Zones(TDZ)*** o zonas muertas temporales, y los ***scopes*** o
alcances de bloque.

La TDZ es la zona entre el inicio del bloque y la declaración de una variable, la cual prácticamente solo la vemos cuando declaramos
una variable con `let`, ya que al momento de declarar una constante con `const` debemos obligatoriamente inicializarlas con un
valor. Gracias a esto, si intentamos hacer algo parecido a nuestro ejemplo anterior, pero ahora declarando la variable con `let` en
lugar de `var`, tendremos el siguiente error:

``` js
console.log(x) // ReferenceError: Cannot access 'x' before initialization

let x

x = 5
```

Gracias a la TDZ, ahora si intentamos usar una variable antes de su declaración tendremos este error de
***`Reference Error: cannot access 'x' before initialization`***. Es importante que sepamos que la TDZ solo es un mecanismo que
hace que no se pueda acceder a una variable antes de su declaración, mas no de su inicialización, puesto que como ocurre con las
variables declaradas con `var`, si podemos acceder a ellas incluso antes de su inicialización ya que también JavaScript las
inicializa en `undefined` como se muestra a continuación:

``` js
let x

console.log(x) // undefined

x = 5

console.log(x) // 5
```

Otro concepto importante que llegó junto con ES6 es el ***scope*** o alcance por bloque. Como vimos en nuestro ejemplo usando `var`,
la variable `y`, declarada dentro de un bloque, podía ser accedida desde fuera de las llaves --las llaves delimitan el bloque(este
comportamiento sigue existiendo en JavaScript moderno, por eso ya no se recomienda declarar variables con `var`). El alcance por
bloque se refiere a que las variables o constantes declaradas con `let` o `const`, solo pueden ser leídas en el mismo bloque o en
bloques adyacentes *"hijos"*, pero las variables declaradas en bloques *"hijos"* no pueden ser leídas o accedidas desde bloques
*"padres"* o superiores, veamos el siguiente ejemplo para enterderlo mejor:

``` js
let var1 = 'outer'

if (true) {
  let var2 = 'inner'
  console.log(var1) // 'outer'
  console.log(var2) // 'inner'
}

console.log(var1) // 'outer'
console.log(var2) // ReferenceError: var2 is not defined
```

En este último ejemplo, la variable `var1` puede ser accedida desde el bloque del `if` puesto que es una variable que se declaró
en un bloque *"padre"*(también se puede decir que se declaró en el ámbito externo), sin embargo como vemos al final, cuando
intentamos acceder a `var2`, que está declarada dentro del bloque *"hijo"*(dentro de las llaves del `if`), JavaScript nos arroja
un *ReferenceError*, pues como mencionamos antes, los bloques *"padre"* no pueden acceder a las variables declaradas en los bloques
(o ámbitos) *"hijo"*.

Con esto, ahora los bloques en JavaScript crean ámbitos o *scopes*, como lo vimos en este último ejemplo, el alcance de la variable
`var2`, sólo es dentro del bloque entre las llaves de la sentencia `if`, por este comportamiento llegaron otros conceptos nuevos que
debemos conocer para comprender a fondo las closures, los cuales son el ***Ámbito/Alcance Léxico***(o *lexical scope*) y el
***Entorno Léxico***(o *lexical environment*).


### Ámbito Léxico y Entorno Léxico

Con la llegada de `let` y `const` en ES6, como mencionamos, los bloques crean *scopes*, con esto, podemos definir el
***Ámbito Léxico*** como un concepto o regla del lenguaje JavaScript que determina la visibilidad y accesibilidad de las variables
según donde se escribieron *"físicamente"* en el código; por otro lado, el ***Entorno Léxico*** es la implementación física que usa
el motor de JavaScript para almacenar esas variables y mantener la referencia al ámbito padre.

En otras palabras, el ***Ámbito Léxico*** son las reglas del estándar ECMAScript que determinan cuál es el alcance o *scope* de las
variables, mientras que el ***Entorno Léxico*** es el lugar físico en memoria donde se almacena la estructura de datos de las
variables de una función, el ***Entorno Léxico*** se compone de dos elementos:
- El ***Registro de Entorno***(o *Environment Record*): Es donde se almacenan las variables, constantes, funciones y parámetros
  locales o declarados directamente dentro del scope de la función
- Una referencia externa: La referencia o enlace al *entorno léxico* adyacente superior (*Outer Lexical Environment*).

Prácticamente es el *entorno léxico* lo que permite que las closures puedan crearse y lo que explica cómo funciona a más bajo nivel
el alcance de las variables y constantes.

Un dato interesante y curioso es que algunas fuentes en internet mencionan que el entorno léxico de una función es almacenado en una
variable oculta llamada `[[Environment]]`.


## Funciones que retornan funciones

Veamos de nuevo nuestro primer ejemplo:

``` js
function padre() {
  let nombre = 'pemid'

  function hijo() {
	  // hijo es la función interna que forma el closure
    console.log(nombre) // Podemos acceder a la variable nombre
  }

  hijo()
}

padre() // Se muestra en la consola 'pemid'
```

En este ejemplo, la variable `nombre` solo es usada dentro de la función `hijo` y solo se imprime en consola, una vez la función
`padre` termina de ejecutarse, la variable `nombre` es marcada como lista para limpieza por el recolector de basura(*garbage collector*)
y la liberación de su espacio en memoria, lo que hace que una vez terminada de ejecutarse ya no se pueda volver a acceder a la
variable `nombre` de ninguna manera.

Ahora bien, llegamos a la parte que se suele enseñar comúnmente cuando se explican las closures en JavaScript, las funciones que
retornan funciones que tienen una referencia a una variable o constante declarada en la función padre, veamos este ejemplo:

``` js
function padre() {
  let nombre = 'pemid'

  function hijo() {
    console.log(nombre)
  }

  return hijo
}

const funcionHijo = padre() // guardamos la referencia a la función hijo
funcionHijo() // 'pemid'
funcionHijo() // 'pemid'
funcionHijo() // 'pemid'
```

Podemos acceder a la variable `nombre` incluso cuando la función donde fue declarada ya terminó su ejecución!!! 🤯

Puede que esto te sorprenda, o puede que no porque es algo que ya has visto muchas veces y sabes que es el comportamiento que tienen
las closures, pero, ¿sabes realmente por qué podemos seguir accediendo a la variable `nombre` incluso después de que termina de
ejecutarse la función `padre`?

Ahora que hemos aprendido lo que es el *entorno léxico*, no es tan complicado entender esto, prácticamente podemos resumir lo que
está pasando con lo siguiente:

1. Se declara la función `padre`, la cual en su cuerpo declara la variable `nombre`.
2. Dentro de la función `padre` también se declara la función `hijo`, como vimos antes, en la función `hijo` se crea un
   *entorno léxico*, en el cual hay una referencia hacia el *entorno léxico* superior(el de la función `padre`) y dentro de este
   último está la variable `nombre` que está siendo usada dentro de la función `hijo`.
3. La función `hijo` es retornada por la función `padre`.
4. Se declara la constante `funcionHijo`(`const funcionHijo = padre()`), ahora en esta constante se guarda lo que retorna la función
   `padre`, que es la referencia a la función `hijo` que fue declarada dentro de la función `padre`.
5. Se termina de ejecutar la función `padre`, JavaScript intente hacer la limpieza o recolección de las variables declaradas en la
   función `padre` porque ya terminó su ejecución, sin embargo, al ver la variable `nombre` se da cuenta que esta sigue siendo
   referenciada dentro del *entorno léxico* de la función `hijo`, la cual sigue teniendo una referencia *"viva"*, la constante
   `funcionHijo`, por lo que al no poderla destruir, la pasa a la memoria heap, donde vivirá hasta que ya no sea utilizada ni
   referenciada en ningún lugar.
6. Gracias a que esta referencia ahora se queda *"viva"*, al ejecutar `funcionHijo()` más adelante, podemos seguir viendo en la
   consola `'pemid'`.

Con esto ahora ya conoces más a fondo cómo es que funcionan las closures, ahora bien, solo para complementar esto, podríamos hacer
una limpieza manual de la referencia a la variable `nombre` de la siguiente manera:

``` js
function padre() {
  let nombre = 'pemid'

  function hijo() {
    console.log(nombre)
  }

  return hijo
}

// reemplazamos const por let para poder cambiar su valor más adelante
let funcionHijo = padre()

funcionHijo() // 'pemid'
funcionHijo() // 'pemid'
funcionHijo() // 'pemid'

// Al cambiar ahora el valor guardado en la variable funcionHijo por undefined
// se pierde la referencia de la función hijo y su entorno léxico, por lo que
// ahora la variable nombre no se usa en ningún lugar por lo que puede ser
// destruida por el garbage collector
funcionHijo = undefined
```


## Usando Closures

Hagamos algunos ejemplos de uso de closures para entender mejor algunas formas de usar closures.

### Creando fábricas de funciones

Veamos esta función:

``` js
function crearTablaDeMultiplicar(factor) {
  return function (multiplier) {
    console.log(factor * multiplier)
  }
}
```

La función `crearTablaDeMultiplicar` recibe el parámetro `factor`, el cual se usa en la función anónima que retorno, esta función
que retorna también recibe un parámetro `multiplier`, como podemos ver en el código, se imprimirá en consola el producto resultante
entre `factor` y `multiplier`, lo cual podemos usar de la siguiente manera:

``` js
// Tabla del 5
const _5x = crearTablaDeMultiplicar(5)

_5x(1) // 5
_5x(2) // 10
_5x(3) // 15
_5x(4) // 20
_5x(5) // 25
_5x(6) // 30
_5x(7) // 35
_5x(8) // 40
_5x(9) // 45
_5x(10) // 50

// Tabla del 7
const _7x = crearTablaDeMultiplicar(7)

_7x(1) // 7
_7x(2) // 14
_7x(3) // 21
_7x(4) // 28
_7x(5) // 35
_7x(6) // 42
_7x(7) // 49
_7x(8) // 56
_7x(9) // 63
_7x(10) // 70
```

En este ejemplo, la función `crearTablaDeMultiplicar` es una fábrica de funciones, ya que su ejecución crea nuevas funciones con
algunas *"configuraciones predeterminadas"* que serán compartidas las veces que se ejecute la función, en este caso, la
*"configuración predeterminada"* es lo que se envía como argumento al parámetro `factor`.

Como podemos ver, los *entornos léxicos* no se mezclan, si no que se crea uno cada vez que se guarda una nueva referencia de la
función interna que forma el closure, y de esta forma manteniendo su independencia. De esta manera en la declaración
`const _5x = crearTablaDeMultiplicar(5)`, en *entorno léxico* de la función interna guarda el valor de `5`, que fue el que se le
mandó como argumento al parámetro `factor`, mientras que en la declaración `const _7x = crearTablaDeMultiplicar(7)`, el
*entorno léxico* guarda el valor de `7`, pues ese fue el valor que se envió como argumento al parámetro `factor`.


### Ejemplo de uso con HTML

Imaginemos que tenemos estos elementos HTML:

``` html
<button id="size-12">12</button>
<button id="size-14">14</button>
<button id="size-16">16</button>
```

La finalidad de estos botones es que al presionarlos cambien el tamaño de la fuente según corresponda, hay muchas formas en las que
podríamos abordar este problema, sin embargo, en esta ocasión intentaremos resolverlo con closures, vemos el siguiente código:

``` js
function makeSizer(size) {
  return function () {
    document.body.style.fontSize = `${size}px`;
  };
}

const setSize12 = makeSizer(12);
const setSize14 = makeSizer(14);
const setSize16 = makeSizer(16);
```

En la función `makeSizer`, como podemos ver, se forma un closure, puesto que en la función interna se hace referencia al parámetro
`size` que nos llega en la función padre. Con esto podemos ver que la función `setSize12` guarda en su *entorno léxico* el valor
de `12`, por lo que al ejecutar esta función el tamaño de fuente del *body* se cambiará a `12px`, lo mismo pasará con las funciones
`setSize14` y `setSize16` con los valores `14px` y `16px` respectivamente.

Ahora podemos *"bindear"* estas funciones en los eventos `onclick` de los botones de la siguiente manera:

``` js
document.getElementById("size-12").onclick = size12;
document.getElementById("size-14").onclick = size14;
document.getElementById("size-16").onclick = size16;
```

En este ejemplo, las closures nos ayudaron a crear una fábrica de funciones y poder reutilizar nuestra lógica para distintos valores.


### Propiedades privadas con ayuda de closures

En lenguajes cuyo paradigma es la programación orientada a objetos(POO), se pueden crear propiedades privadas, lo que significa que no
se puede acceder a ellas más que dentro de la propia clase.

Antes de ES6 no existían las clases en JavaScript, una forma que se usaba como *workaround* es emular estas propiedades privadas
creando closures, un ejemplo lo podemos ver a continuación, este ejemplo usa el *patrón de diseño de módulo*:

``` js
const counter = (function () {
  let privateCounter = 0

  const changeBy = (value) => {
    privateCounter += value
  }

  return {
    increment() {
      changeBy(1)
    },
    decrement() {
      changeBy(-1)
    },
    getCounter() {
      return privateCounter
    }
  }
})()

console.log(counter.getCounter()) // 0
counter.increment()
counter.increment()
counter.increment()
console.log(counter.getCounter()) // 3
counter.decrement()
console.log(counter.getCounter()) // 2
console.log(counter.privateCounter) // undefined
```

Como podemos observar, en este ejemplo estamos usando una IIFE(*Immediately Invoked Function Expression*), lo que hace que en la
constante `counter` se guarde *"en automático"* lo que retorna esta función. Con este ejemplo podemos ver que realmente las closures
no solo son *"funciones que retornan otras funciones..."*, sino que como vemos, estamos retornando un objeto con distintos métodos
que a través de las closures mantienen viva la referencia a la variable `privateCounter` y a la constante `changeBy`, que a su vez
internamente crea también una closure con la variable `privateCounter` y como podemos observar en la última línea, no podemos acceder
directamente a `privateCounter`, sólo a través de la función `getCounter`, así, emulamos comportamientos de la POO, como el
encapsulamiento, con ayuda de las closures.


### Closures sobre módulos

Las closures también pueden generarse en distintos módulos, por ejemplo veamos lo siguiente:

``` js [fooModule.js]
let foo = 5
export const getFoo = () => foo
export const setFoo = (value) => {
  foo = value
}
```

Este módulo crea un par de funciones *setter* y *getter* sobre la variable `foo`, lo que hace que aunque esta variable no sea
accesible desde otros módulos, porque no está exportada, sí pueda ser alcanzada y modificada a través de las funciones `getFoo` y
`setFoo`, que como podemos ver, han creado un closure con la variable `foo`:

``` js [main.js]
import { getFoo, setFoo } from "./fooModule.js"

console.log(getFoo()) // 5
setFoo(6)
console.log(getFoo()) // 6
```

Las closures también pueden ser creadas sobre valores importados y que se consideren *"enlazados en vivo"*, ya que al cambiar el
valor original cambia el valor importado en consecuencia, esto también es gracias a que los módulos en JavaScript se crean como un
*singleton*, es decir, en todos los lugares donde se importe el módulo, realmente se estará usando la misma instancia del mismo,
veamos el siguiente ejemplo para comprenderlo mejor:

``` js [barModule.js]
export let bar = 1
export const setBar = (value) => {
  bar = value
}
```

``` js [closureCreator.js]
import { bar } from "./barModule.js"

// Se crea el closure sobre un enlace en vivo importado
export const getBar = () => bar 
```

``` js [index.js]
import { getBar } from "./closureCreator.js"
import { setBar } from "./barModule.js"

console.log(getBar()) // 1
setBar(2);
console.log(getBar()) // 2
```

En este ejemplo vemos que la variable `bar` se crea en `barModule.js`, y en este mismo módulo se exporta la función `setBar` para
poder cambiar su valor; en el módulo `closureCreator.js` se crea el closure dentro de la función `getBar` y estas dos funciones
exportadas por módulos distintos pueden ser usadas en un tercer módulo `index.js`, y al modificar la variable con la función `setBar`
y volver a ejecutar la función `getBar`, podemos ver que el valor original de `bar` ha cambiado y la función `getBar` tiene acceso
al nuevo valor actualizado.


## Cadena de alcance de las closures

Gracias al *entorno léxico* que existe dentro de cada función cada vez que se crea una, los bloques anidados pueden acceder hasta
las variables que estén en *entornos léxicos* de niveles superiores, miremos el siguiente ejemplo:

``` js
const globalValue = 10

function padre() {
  return function hija() {
    console.log(globalValue)
  }
}

padre()() // 10
```

Lo que pasa en este ejemplo es lo siguiente:

- Se declara la constante `globalValue` en el *entorno léxico* global.
- La función `padre` guarda en su *entorno léxico* dos cosas, el *registro de entorno*(que en este caso está vacío porque no hay
  variables ni parámetros locales de la función `padre`) y la referencia al *entorno léxico* externo, que en este caso es el
  *entorno léxico* global.
- Dentro de la función `padre` se crea una nueva función, la función `hija`, esta función también tiene su propio *entorno léxico*,
  que al igual que la función `padre`, tiene el *registro de entorno*, que también está vacío al no haber variables ni parámetros
  en el ámbito local de la función `hija`, y la referencia al *entorno léxico* superior, que es el de la función `padre`.
- Dentro de la función `hija` se intente leer la variable `globalValue`:
  - JavaScript primero mira en el *registro de entorno* de la propia función `hija`, como no la encuentra, usa la referencia externa
    guardada dentro de su *entorno léxico* para acceder al *entorno léxico* de la función `padre`.
  - Busca la variable `globalValue` en el *registro de entorno* de la función `padre` pero tampoco la encuentra ahí, así que usa la
    referencia externa que tiene el *entorno léxico* de la función `padre` para acceder al siguiente nivel, que en nuestro ejemplo
    es el *entorno léxico global*.
  - Al llegar al *entorno léxico global*, busca en el *registro de entorno* de este *entono léxico* la variable `globalValue`, en
    este *registro de entorno* sí existe, por lo que accede a ela, lee su valor y opera con el mismo, en nuestro ejemplo simplemente
    muestra el valor guardado en la consola.

Es de esta manera como las funciones o bloques que están muy anidados pueden llegar a leer variables que se encuentren en
*registros de entorno* de niveles superiores. Un modelo mental que podemos tener al momento de intentar entender este comportamiento
es mirarlo como una lista simplemente enlazada(*single linked list*), cuyos valores se van enlazando desde el bloque más anidado
hasta el de nivel superior.

Algo que me ayudó a comprender cómo estos valores se van enlazando es viéndolo de la siguiente manera, en nuestro ejemplo:

``` js
const entornoLexicoDeFuncionHija = {
  // vacío porque no hay variables ni parámetros declarados en la función hija
  registroDeEntorno: {},

  // referencia al entorno léxico de la función padre
  referenciaExterna: {
    // vacío porque no hay variables ni parámetros declarados en la función padre
    registroDeEntorno: {},

    // referencia al entorno léxico global
    referenciaExterna: {
      // en este entorno léxico si está declarada la variable globalValue
      registroDeEntorno: {
        globalValue: 10
      },

      referenciaExterna: null // ya no hay porque este es el entorno léxico global
    }
  }
}
```

Aunque esto es un resumen muy abstracto de cómo se van enlazando los *entornos léxicos*, puede ayudarnos a comprender cómo es que
desde funciones o bloques muy anidados JavaScript puede acceder a variables de entornos superiores.

De manera general y resumida podemos decir que cada bloque tiene 3 alcances:

- El alcance local (Registro de Entorno)
- El alcance adyacente o envolvente (a través de las referencias externas del *entorno léxico*)
- El alcance global (gracias a los enlaces que existen en los *entornos léxicos* adyacentes)

Esto mismo es lo que pasa cuando tenemos muchas closures anidadas de la siguiente manera:

``` js
const e = 10

function sum(a) {
  return function sum1(b) {
    return function sum2(c) {
      return function sum3(d) {
        return a + b + c + d + e
      }
    }
  } 
}

console.log(suma(1)(2)(3)(4)) // 20
```

Gracias a los *entornos léxicos* enlazados es que la función `sum3` puede acceder y leer todos los valores de `a`, `b`, `c`, `d` y `e`,
a esto es a lo que se conoce como ***cadena de alcance de las closures***, lo cual ahora ya sabemos por qué funciona.

Como dato adicional, la expresión que escribimos en el ejemplo anterior `suma(1)(2)(3)(4)` está usando una técnica que se llama
***Currying***, la cual, en JavaScript, también depende de las closures para poder funcionar.

## Recomendaciones y buenas prácticas al usar closures

Aunque las closures son una característica poderosa y nos pueden ayudar a resolver varios problemas, es necesario tener en cuenta
algunas recomendaciones y buenas prácticas al usarlas, recuerda, un gran poder conlleva una gran responsabilidad.

- **Privatizar datos y variables**: Usa closures para ocultar variables del alcance global. Esto evita que otros scripts modifiquen
  tus datos accidentalmente. Define variables dentro de una función y expón solo los métodos para interactuar con ellas.
- **Evitar fugas de memoria(Memory Leaks)**: Los closures mantienen vivas las variables de su entorno externo, lo que puede impedir
  que el recolector de basura libere esa memoria. Limpia las referencias asignando `null` o `undefined` a las variables o funciones
  que ya no vayas a utilizar.
- **Crear fábricas de funciones(Factory Functions)**: Aprovecha los closures para generar funciones personalizadas basadas en
  argumentos iniciales. Esto promueve la reutilización de código. Pasa un parámetro a la función principal para configurar el entorno
  y retorna una nueva función adaptada.
- **Mantener la legibilidad y evitar el abuso**: Anidar demasiados closures puede hacer que el código sea difícil de leer, depurar
  y mantener. Usa closures cuando aporten un beneficio claro(como el encapsulamiento), no por defecto en cada función.


## Cierre

Ahora ya conoces realmente lo que son las closures y cómo funciona a más bajo nivel esta característica del lenguaje JavaScript, sin
embargo, no significa que ahora tengas que usar closures en todas partes, siempre ten en mente que cada nuevo concepto que aprendemos
es una herramienta nueva que agregamos a nuestro arsenal, de esta manera, cuando estemos resolviendo un problema sepamos que esa
herramienta existe y podemos hacer uso de ella para llegar a algunas soluciones si es necesario, aunque también siempre recuerda que
es nuestra labor y responsabilidad como ingenieros de software saber cuando sí usar una herramienta y cuando no, así como las
ventajas y desventajas frente a otras posibles soluciones con otras herramientas distintas.

Espero que este artículo te haya gustado y hayas aprendido algo nuevo, sin más me despido, nos vemos en la próxima entrega.
