# PLAN PARA GUARDAR LISTAS DE MARCAS

## Descripción del plan

Agregar al cronómetro una pestaña para preparar una lista de marcas y una sección de listas guardadas. Una lista guardada es una copia fija de las marcas visibles en el momento de guardar. Guardar limpia la sesión actual; cancelar descarta solo el formulario. El cronómetro puede detenerse y volver a iniciar sin borrar las marcas no guardadas, de modo que una lista posterior incluya todas las marcas acumuladas hasta ese momento.

## Objetivo principal

- Permitir guardar marcas con un título obligatorio y una descripción opcional únicamente cuando el cronómetro esté detenido.
- Consultar y borrar listas guardadas, y añadir una nota persistente a cada marca de una lista.
- Mantener la presentación actual de las marcas del cronómetro y mostrar las listas guardadas desde la más antigua hasta la más reciente.

## Contexto técnico verificado

- El proyecto usa Quasar 2, Vue 3, Pinia, Vue Router y traducciones `es-419` y `en-US`.
- `src/pages/IndexPage.vue` muestra `CronometroDisplay`, `CronometroControles` y `CronometroMarcas`; el encabezado «Marcas» está en `CronometroMarcas.vue`.
- `src/stores/cronometro.js` mantiene las marcas en orden inverso al registro mediante `unshift`, las persiste con `@capacitor/preferences` bajo `cronometro_marcas` y actualmente las borra al ejecutar `detener()`.
- `CronometroControles.vue` asigna el botón derecho a marca, detener o borrar según el estado. El borrado individual usa `q-slide-item` con acción a la derecha en `CronometroMarcas.vue`.
- `src/layouts/MainLayout.vue` contiene el menú lateral y el selector de idiomas; `src/router/routes.js` solo tiene la página principal y la ruta de error.
- `src/css/Variables.css` define `--color-exito`, `--color-error`, `--color-deshabilitado` y los colores de la app. Los archivos nuevos deben usar PascalCase; variables y funciones, camelCase en español; archivos de texto, UTF-8. Mantener el CSS compacto y usar las variables de color existentes.
- `npm run lint` ejecuta ESLint. `npm run test` solo imprime «No test specified», por lo que no valida comportamiento. `npm run build` compila la aplicación Android mediante Quasar.

## Alcance

### Incluye

- Pestañas «Marcas» y «Guardar lista» en la línea indicada por Leo, con «Marcas» activa por defecto.
- Formulario con título obligatorio, descripción opcional, botón de confirmación verde y botón de cancelación rojo; textos y nombres accesibles además de los iconos.
- Bloqueo visual y funcional de «Guardar lista» mientras el cronómetro esté corriendo o pausado, o cuando no haya marcas.
- Listas locales persistentes, ordenadas por fecha de creación ascendente, con detalle de marcas y notas.
- Elemento «Listas guardadas» en el menú lateral, encima de la sección de idiomas; pantalla vacía con acceso al cronómetro y tutorial breve con ejemplos de gimnasio y de medición de distancias.
- Borrado de listas mediante deslizamiento de derecha a izquierda, siguiendo la interacción de borrado de marcas actual.

### No incluye

- Cuentas, sincronización en la nube, exportación, edición del título o la descripción después de guardar ni modificación de tiempos ya registrados.
- Cambio de orden de las marcas visibles en el cronómetro.

## Mapa de cambios

| Archivo | Acción | Símbolos principales | Propósito |
| --- | --- | --- | --- |
| `src/stores/cronometro.js` | Modificar | `detener`, `iniciar`, `guardarMarca`, `eliminarTodasLasMarcas`, nueva `reiniciarSesion` | Conservar marcas al detener, continuar acumulándolas al volver a iniciar y limpiar la sesión tras guardar. |
| `src/stores/ListasGuardadas.js` | Crear | `useListasGuardadasStore`, `cargarListas`, `guardarLista`, `eliminarLista`, `guardarNotaMarca` | Persistir copias de listas y notas sin mezclar ese historial con las marcas activas. |
| `src/pages/IndexPage.vue` | Modificar | `pestanaActiva`, `tituloLista`, `descripcionLista`, `guardarListaActual`, `cancelarFormulario` | Mostrar pestañas y formulario; coordinar guardado y limpieza. |
| `src/components/CronometroMarcas.vue` | Modificar | encabezado y lista existente | Dejar el encabezado de pestañas bajo control de `IndexPage` y conservar la lista actual. |
| `src/components/CronometroControles.vue` | Revisar y modificar si hace falta | `accionBotonIzquierdo`, `accionBotonDerecho` | Mantener los botones coherentes con el nuevo comportamiento de detener, iniciar y borrar. |
| `src/layouts/MainLayout.vue` | Modificar | menú lateral | Añadir «Listas guardadas» antes de Idioma y cerrar el menú al navegar. |
| `src/router/routes.js` | Modificar | rutas hijas del layout | Incorporar listado y detalle con identificador. |
| `src/pages/ListasGuardadasPage.vue` | Crear | vista de listas, estado vacío, deslizamiento | Consultar y borrar listas. |
| `src/pages/DetalleListaPage.vue` | Crear | vista de lista, editor de nota | Consultar marcas de una lista y guardar notas. |
| `src/i18n/es-419/index.js` y `src/i18n/en-US/index.js` | Modificar | textos de listas, formulario, errores y accesibilidad | Mantener ambos idiomas completos. |

## FASE 1: Ajustar el ciclo de marcas activas

### Objetivo

Las marcas no guardadas sobreviven a Detener y a un nuevo inicio; se borran únicamente al guardar correctamente una lista o al usar la acción existente de borrar.

### Pasos de ejecución

- [ ] Modificar `detener()` en `src/stores/cronometro.js` para parar el intervalo y poner el contador en cero sin vaciar `marcas`. Dejar las marcas persistidas bajo `cronometro_marcas`.
- [ ] Adaptar `iniciar()` y `guardarMarca()` para que, si se vuelve a iniciar desde `detenido` con marcas previas, las nuevas se agreguen a la misma colección sin alterar el orden visual actual. El contador y el intervalo de la primera marca de cada nueva tanda deben empezar desde cero; nunca generar intervalos negativos por restar el tiempo de una tanda anterior.
  - Conservar los identificadores únicos y una numeración coherente al agregar y borrar marcas. Una lista guardada debe conservar los números que tenía al copiarla.
  - No mezclar el tiempo reiniciado con el tiempo de la tanda anterior para calcular intervalos o promedios.
- [ ] Definir `reiniciarSesion()` en el store para detener cualquier intervalo, restaurar los tiempos y el estado inicial, vaciar `marcas` y persistir el arreglo vacío. Reutilizar esta acción tras un guardado exitoso; mantener el borrado manual disponible en el botón derecho cuando corresponda.
- [ ] Revisar `CronometroControles.vue` para que Detener conserve las marcas, Iniciar continúe el borrador de marcas y el botón de borrar siga limpiándolo sin crear ninguna lista.

## FASE 2: Persistir listas independientes

### Objetivo

Guardar una copia fija solo cuando exista al menos una marca y el cronómetro esté detenido; conservar las marcas actuales intactas si falla el almacenamiento.

### Pasos de ejecución

- [ ] Crear `src/stores/ListasGuardadas.js` como store Pinia independiente con `listas` inicializado a `[]` y `cargaInicial` para esperar la lectura de `@capacitor/preferences`. Usar una clave nueva, por ejemplo `cronometro_listas_guardadas`, sin modificar los datos existentes de `cronometro_marcas`.
- [ ] Definir cada lista con `id` estable, `titulo` sin espacios en extremos, `descripcion` opcional, `fechaCreacion` y `marcas` copiadas por valor. Cada marca copiada debe conservar `id`, `numero`, `tiempoMarca` e `intervalo`, y añadir `nota` inicialmente vacía. Una lista guardada no debe cambiar cuando se sigan agregando o borrando marcas activas.
- [ ] Implementar `guardarLista({ titulo, descripcion, marcas })`: esperar la carga inicial; rechazar título vacío tras recortarlo o ausencia de marcas; crear identificador único; persistir la nueva colección mediante `Preferences.set`; publicar el cambio en `listas` únicamente si la persistencia tuvo éxito. Devolver la lista creada o propagar el error para mostrar un mensaje. Mantener el orden de llegada de listas por `fechaCreacion` ascendente y usar un desempate estable si dos listas comparten fecha.
- [ ] Implementar `eliminarLista(idLista)` y `guardarNotaMarca(idLista, idMarca, nota)` con persistencia y manejo de fallos. No modificar otras listas ni el store de marcas activas. Evitar que una lectura inicial tardía reemplace una lista recién guardada.
- [ ] En `IndexPage.vue`, ejecutar `reiniciarSesion()` solo después de que `guardarLista()` termine correctamente. Si guardar falla, conservar formulario y marcas, e informar al usuario. Si la limpieza posterior falla, informar el problema de persistencia sin fingir que la sesión quedó vacía.

## FASE 3: Incorporar pestañas y formulario al cronómetro

### Objetivo

Hacer visible el flujo de guardado sin impedir el uso habitual del cronómetro.

### Pasos de ejecución

- [ ] Mover la responsabilidad del encabezado «Marcas» desde `CronometroMarcas.vue` a la zona inferior de `IndexPage.vue` y convertir esa línea en dos pestañas accesibles: «Marcas» y «Guardar lista». `pestanaActiva` inicia en `marcas` al abrir la página.
- [ ] Deshabilitar «Guardar lista» y darle apariencia gris con `--color-deshabilitado` si `estadoCronometro` es `corriendo` o `pausado`, o `totalMarcas` es cero. Además del aspecto visual, impedir que el formulario se abra o se guarde en esos estados, incluso si cambia el estado mientras está abierto. Mantener controles y cronómetro visibles al cambiar de pestaña.
- [ ] En la pestaña de guardado, añadir `tituloLista` y `descripcionLista` como borrador local, con título obligatorio y validación clara. Mostrar botones con iconos de check y ✕ usando `--color-exito` y `--color-error`, con etiqueta accesible y superficie táctil suficiente.
- [ ] Conservar el borrador local de título y descripción al volver temporalmente a «Marcas». `cancelarFormulario()` vacía ambos campos y vuelve a «Marcas», sin borrar las marcas. Tras guardar, vaciar el formulario, reiniciar sesión y volver a «Marcas». Al borrar todas las marcas sin guardar, descartar el borrador; al cerrar y volver a abrir la página, no restaurar un formulario que nunca se guardó.
- [ ] Mantener el área de marcas desplazable y usable con teclado abierto, encabezado y controles visibles en teléfono; en web y tablet, conservar el ancho máximo y una distribución legible. Usar variables de color de `Variables.css` y CSS compacto.

## FASE 4: Añadir listado, detalle y navegación

### Objetivo

Permitir encontrar listas, ver sus marcas, escribir notas y borrar listas guardadas.

### Pasos de ejecución

- [ ] Añadir en `routes.js` las rutas hijas `/listas` y `/listas/:id`, cargando `ListasGuardadasPage.vue` y `DetalleListaPage.vue`. Mantener `/` como cronómetro y la ruta de error al final.
- [ ] Añadir en `MainLayout.vue` una entrada «Listas guardadas» arriba de Idioma; navegar a `/listas` y cerrar el drawer. Proveer navegación clara de regreso al cronómetro y del detalle al listado.
- [ ] Crear `ListasGuardadasPage.vue` con dos estados:
  - Sin listas: botón «Ir al cronómetro» y mini tutorial localizado que explique cómo detener, abrir «Guardar lista», completar el título y guardar. Incluir ejemplos breves de vueltas de una rutina de gimnasio y de tiempos para recorrer distintas distancias.
  - Con listas: tarjetas en orden de creación ascendente con título, fecha y cantidad de marcas; descripción breve si existe. Al pulsar una tarjeta, abrir `/listas/:id`.
- [ ] Implementar el borrado de listas con `q-slide-item` y acción derecha, igual que en `CronometroMarcas.vue`. Deslizar de derecha a izquierda elimina la lista persistida; si la operación falla, mantenerla visible y mostrar error. Proporcionar una alternativa accesible al gesto para web, teclado y tecnologías de asistencia.
- [ ] Crear `DetalleListaPage.vue` que resuelva `id` desde la ruta; mostrar título, descripción, fecha y copia de marcas con el mismo formato de tiempo de `useCronometroStore().formatearTiempo()`. Mantener dentro del detalle el orden visual de marcas que ya utiliza el cronómetro; el orden cronológico ascendente se aplica a las listas guardadas en el listado, no a las marcas del cronómetro.
- [ ] Añadir un campo de nota opcional para cada marca guardada. Mostrar el valor persistido al entrar; guardar cambios al salir del campo o de la página, con estado de guardado y mensaje si hay error. No editar tiempos ni números. Resolver identificador inexistente con un estado claro y enlace al listado.
- [ ] Añadir textos nuevos en `es-419` y `en-US` para menú, pestañas, formulario, validaciones, pantalla vacía, tutorial, detalle, notas, borrado y errores. Revisar acentos y codificación UTF-8.
- [ ] Ajustar listado y detalle al espacio disponible sobre el banner y las áreas seguras. Permitir desplazamiento vertical, evitar que el teclado tape las notas y mantener legibilidad en teléfono estrecho, tablet y escritorio.

## FASE TESTING

### Objetivo

Comprobar el ciclo completo sin pérdida accidental de marcas ni modificación de listas ya guardadas.

### Pruebas automatizadas

- [ ] Ejecutar `npm run lint` y corregir los errores introducidos.
- [ ] Ejecutar `npm run build` y comprobar que las rutas, componentes y traducciones compilan. No presentar `npm run test` como prueba funcional, porque actualmente no contiene pruebas reales.

### Pruebas manuales

- [ ] Iniciar y pausar: «Guardar lista» aparece gris e inactiva; al detener con marcas se habilita. Sin marcas, permanece inactiva.
- [ ] Detener, escribir título, volver a «Marcas», iniciar otra vez y añadir marcas: el borrador de texto sigue disponible, las marcas anteriores y nuevas están presentes, y los intervalos de la nueva tanda son correctos y no negativos.
- [ ] Cancelar el formulario: se pierden título y descripción, pero quedan las marcas. Borrar las marcas manualmente: ya no se pueden guardar y el borrador desaparece.
- [ ] Intentar guardar sin título o con solo espacios: no se crea lista. Guardar con título válido: aparece una única lista con copia de todas las marcas actuales; cronómetro, marcas y formulario quedan vacíos. Añadir luego marcas nuevas: la lista anterior no cambia.
- [ ] Guardar dos o más listas: aparecen desde la más antigua hasta la más reciente. Cerrar y volver a abrir la app: listas y notas se conservan; el formulario no guardado no se convierte en lista.
- [ ] Abrir una lista, escribir notas en dos marcas, salir y regresar: ambas notas persisten. Eliminar una lista mediante gesto y mediante alternativa accesible: desaparece del listado y las demás siguen intactas.
- [ ] Simular fallo de `Preferences.set` durante el guardado: la lista no se confirma, las marcas y el formulario siguen disponibles y se muestra un error. Simular fallo al guardar nota o eliminar lista: los datos visibles no aparentan un éxito falso.
- [ ] Cambiar entre español e inglés: no quedan claves de traducción visibles ni textos truncados. Comprobar también el estado sin listas y el identificador de lista inexistente.

### Casos responsivos

- [ ] Revisar teléfono estrecho y alto, tablet y web/escritorio: pestañas pulsables, scroll independiente, tarjetas legibles y botones fuera de las áreas del header, teclado y banner.

## Progreso del plan

- [ ] Fase 1: Ajustar el ciclo de marcas activas
- [ ] Fase 2: Persistir listas independientes
- [ ] Fase 3: Incorporar pestañas y formulario al cronómetro
- [ ] Fase 4: Añadir listado, detalle y navegación
- [ ] Fase Testing

Fecha de creación: 12 de octubre de 2026
Fecha de última actualización: 12 de octubre de 2026
Estado: BORRADOR
