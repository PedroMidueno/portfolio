---
title: Unknown y Never en TypeScript
description: Una introducción a los tipos unknown y never, sus principales características y posibles usos.
date: 15 de Junio de 2026
imagePath: images/blog/01-never-unknown.png
minRead: 10
---

Regularmente cuando escribimos código TypeScript solemos usar muchos tipos que son muy conocidos como `string`, `number`, `boolean`, entre otros. Sin embargo existen otros tipos menos conocidos y usados, en este espacio hablaremos acerca de dos de ellos, que son `unknown` y `never`.


## `never`
El tipo `never` en TypeScript representa valores que nunca deben ocurrir. Se puede utilizar principalmente para tipar valores de retorno de funciones que nunca terminan su ejecución (ya sea porque lanzan un error o porque tienen un bucle infinito), otro de los usos de `never` purde ser para asegurar que todas las condiciones que una estructura `switch` o `if/else` esten cubiertas, a esto último lo llamamos ***Comprobacion Exhaustiva***.

```ts twoslash
// Lanza un error y nunca llega a su fin
function lanzarError(mensaje: string): never {
    throw new Error(mensaje);
}

// Bucle infinito que tampoco retorna
function bucleInfinito(): never {
    while (true) {
        console.log("Ejecutando...");
    }
}

// Comprobación exhaustiva
type Transporte = 'avion' | 'tren' | 'barco';

function calcularVelocidad(t: Transporte) {
  switch (t) {
    case 'avion': return 900;
    case 'tren':  return 200;
    case 'barco': return 40;
    default:
      // Si manejaste todos los casos, 't' aquí dentro debe ser 'never'
      const _checkExhaustivo: never = t;
      return _checkExhaustivo;
  }
}
```

Aunque ciertamente será muy extraño que los dos primeros ejemplos los lleguemos a usar alguna vez, sirven para visualizar situaciones en las cuales podemos tipar una función como `never`.

## `unknown`

Muchas veces me pasó que cuando recien comencé a trabajar con TypeScript, me llegaba a encontrar código que usaba este tipo, y realmente no entendía para qué servía, yo pensaba que si ya teníamos el tipo `any` - que se podría considerar que es de un tipo que desconocemos - ¿para qué se habrían molestado en agregar el tipo `unknown`? ¿No?

Pues para entender la razón de ser de este tipo, debemos recordar que el principal objetivo de TypeScript es ayudarnos a que no lleguen errores en tiempo de ejecución por el tipado dinámico que tiene JavaScript, y que podamos darnos cuenta de ellos en tiempo de compilación, esto lo hace agregando una capa encima de JavaScript para tener el ***"tipado estricto"***. Sin embargo tenemos muchas formas de poder engañar al compilador de TypeScript por ejemplo haciendo uso de `any` o las aserciones de tipo `as`.

Por esta situación es que existe el tipo `unknown`, ya que se podría considerar la ***"Versión Segura"*** del tipo `any`. Para entender cómo funciona y cómo nos ayuda, veamos este ejemplo de código.

```ts twoslash
function procesarDato(dato: any) {
  console.log(dato.toUpperCase())

  console.log(dato * 10)

  console.log(`Hola, mi nombre es ${dato.nombres}`)
}
```

Como podemos observar, a pesar de que estamos intentando hacer 3 operaciones diferentes que solo serían posibles con 3 tipos diferentes, TypeScript no nos avisa de nada de las implicaciones que un código como este llegue a producción, que podría causar errorer que en teoría el compilador nos debería de avisar, esto porque usamos `any`. Pero ahora veamos qué pasa si solo cambiamos el tipo a `unknown`.

```ts twoslash
// @errors: 18046
function procesarDato(dato: unknown) {
  console.log(dato.toUpperCase())

  console.log(dato * 10)

  console.log(`Hola, mi nombre es ${dato.nombres}`)
}
```

Como nos damos cuenta ahora, TypeScript nos está marcando un error de que el tipo de `dato` es `unknown` pero, ¿por qué?. La razón es porque al usar el tipo `unknown` TypeScript nos "obliga" a hacer comprobaciones previas para poder operar con la variable o constante que está tipada con `unknown`, en otras palabras, ***no podemos operar con una variable o constante que esté tipada con unknown hasta que le digamos a TypeScript o le demos "pistas" de con qué tipo de dato estamos operando***. Prácticamente necesitaremos aplicar los conceptos de **Type Guards** y **Type Narrowing** para usar el parámetro `dato`.

```ts twoslash
function procesarDato(dato: unknown) {
  if (typeof dato === 'string') {
    console.log(dato.toUpperCase())
  }

  if (typeof dato === 'number') {
    console.log(dato * 10)
  }

  if (typeof dato === 'object' && dato !== null && 'nombre' in dato) {
    console.log(`Hola, mi nombre es ${dato.nombre}`)
  }
}
```

Gracias a estas comprobaciones (*Type Guards*) que hicimos en nuestro código, podemos operar con total seguridad con el parámetro `dato`, asegurándonos también de que los posibles errores en tiempo de ejecución que podríamos haber tenido cuando tipamos con `any` los mitiguemos.

## Conclusión

Ahora que conocemos estos conceptos podemos comenzar a escribir código **TypeScript** más seguro y profesional, recuerda esto:

- Usa `unknown` en lugar de `any` para obligarte a validar el tipo de dato antes de operar si no conoces realmente el tipo de dato que tendrá un parámetro, un variable o constante.
- Puedes usar `never` para garantizar que tus estructuras lógicas manegen todos los casos posibles.

Si deseas conocer más acerca de estos temas te invito a que veas el video que te dejo a continuación.

::youtube-video{videoId="w--KT1DlDX4"}
::
