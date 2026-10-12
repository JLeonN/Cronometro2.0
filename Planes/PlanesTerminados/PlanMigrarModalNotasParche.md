# PLAN MIGRAR MODAL DE NOTAS DE PARCHE

## Descripción del plan

Migrar a otra app Quasar/Capacitor todo el flujo de notas de parche usado en Bitácora-2-App: desde la ejecución de la skill `$notas-modal`, la generación editable de novedades, el contrato de `public/version.json`, el servicio que detecta actualizaciones, el modal visible al usuario y las validaciones necesarias para publicar sin perder las notas.

El destino puede ser una app nueva o una app que todavía no tenga ningún sistema de actualización. La IA ejecutora debe diagnosticar la estructura real de la app destino antes de adaptar nombres, rutas o layouts.

## Objetivo principal

- Crear el flujo completo de notas de parche para que el usuario final vea novedades agrupadas por apartado dentro del modal de actualización.
- Mantener el contrato `version.json -> cambios -> servicio -> modal` listo para reutilizar en releases futuros.
- Dejar advertencias claras para que la IA ejecutora no borre notas, no invente cambios y no asuma que la app destino ya tiene archivos equivalentes.

## Reglas del plan

- Advertencia para la IA ejecutora: no asumir que la app destino ya tiene estructura de actualización. Crear carpetas, servicio, estado del modal, script y contrato de `version.json` desde cero si no existen.
- Antes de editar la app destino, leer su `AGENTS.md` si existe y respetar sus reglas por encima de este plan cuando no haya conflicto con el objetivo.
- Usar texto visible al usuario en español claro, corto y sin jerga técnica.
- No inventar notas de parche. Las novedades salen del historial real de Git, del diff o de decisiones confirmadas por Leo.
- Mostrar siempre a Leo un borrador editable antes de aplicar notas al modal.
- El aviso de demora de Play Store es texto fijo del modal, no parte dinámica de la skill `$notas-modal`.
- Agrupar las novedades por apartado visible de la app. Si una mejora afecta varios apartados, nombrar todos los apartados en el subtítulo.
- Mantener compatibilidad con notas antiguas en formato string cuando sea razonable.
- Preservar `cambios` cuando un script regenere `public/version.json`.
- No publicar grupos de ejemplo con `mostrarActualizacion: true`. Si se usan ejemplos durante desarrollo, mantener `mostrarActualizacion: false` hasta reemplazarlos por notas reales aprobadas por Leo.

## Datos confirmados para Cronómetro

- App destino: `cronometro2`.
- Framework confirmado: Quasar, Vue y Capacitor.
- Layout principal confirmado: `src/layouts/MainLayout.vue`.
- Package id confirmado en el repo y en Play Store: `com.yojorge.Nombredemiproyecto`.
- URL de Play Store confirmada: `https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto`.
- Versión actual confirmada en `package.json`: `2.1.2`.
- Versión Android actual confirmada en `src-capacitor/android/app/build.gradle`: `2.1.2`.
- Solución recomendada para versión instalada: inyectar `VERSION_APP` desde `package.json` en `quasar.config.js` y usar ese valor en `ServicioActualizacionApp.js`.
- Solución recomendada para URL remota: usar `URL_VERSION_REMOTA` desde variable de entorno cuando exista y dejar como valor configurable de desarrollo un `version.json` servido temporalmente para testing.

## FASE 1: Diagnosticar la app destino

### Objetivo

Identificar la estructura real de la app nueva antes de copiar el flujo.

- [x] Confirmar que la app destino usa Quasar, Vue y Capacitor.
- [x] Leer `AGENTS.md` de la app destino si existe.
- [x] Confirmar que existe `.git` para que `$notas-modal` pueda leer tags y commits.
- [x] Identificar el layout principal donde debe vivir el modal, por ejemplo `src/layouts/MainLayout.vue`.
- [x] Identificar si existe `public/` y crearla si falta.
- [x] Identificar si existe `Scripts/` y crearla si falta.
- [x] Identificar si `package.json` ya tiene scripts de build, prebuild o release que puedan regenerar archivos.
- [x] Usar el package id real confirmado: `com.yojorge.Nombredemiproyecto`.
- [x] Identificar si la app usa variables de entorno para versión instalada, URL remota o Play Store.

## FASE 2: Crear el contrato de versión remota

### Objetivo

Crear `public/version.json` como fuente de verdad de la versión disponible y las notas visibles al usuario.

- [x] Crear o actualizar `public/version.json`.
- [x] Agregar `versionDisponible` con la versión que debe detectar la app.
- [x] Agregar `urlPlayStore` con la URL real de la app destino.
- [x] Agregar `mostrarActualizacion` como booleano.
- [x] Agregar `cambios` como array.
- [x] Usar grupos con la forma `{ "apartado": "...", "novedades": ["..."] }`.
- [x] Incluir un grupo de ejemplo solo durante desarrollo y con `mostrarActualizacion: false`.
- [x] Reemplazar cualquier grupo de ejemplo por notas reales aprobadas por Leo antes de publicar.
- [x] Verificar que el JSON quede válido y en UTF-8.

Ejemplo de contrato:

```json
{
  "versionDisponible": "1.0.1",
  "urlPlayStore": "https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto",
  "mostrarActualizacion": false,
  "cambios": [
    {
      "apartado": "Cronómetro",
      "novedades": [
        "Ejemplo temporal para validar el modal."
      ]
    }
  ]
}
```

## FASE 3: Crear el servicio de actualización

### Objetivo

Crear la lógica que consulta la versión remota, compara versiones y normaliza las notas antes de enviarlas al modal.

- [x] Crear la carpeta `src/components/Actualizacion/` si no existe.
- [x] Crear `src/components/Actualizacion/ServicioActualizacionApp.js`.
- [x] Definir `URL_VERSION_REMOTA` desde variable de entorno y permitir un valor configurable para desarrollo.
- [x] Definir `URL_PLAY_STORE_POR_DEFECTO` con `https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto`.
- [x] Definir `VERSION_INSTALADA` desde `process.env.VERSION_APP`.
- [x] Implementar comparación de versiones por segmentos numéricos.
- [x] Implementar `crearEstadoSinActualizacion()` con `cambios: []`.
- [x] Implementar `normalizarCambios(cambios)`.
- [x] Aceptar cambios antiguos como strings y convertirlos a grupos sin apartado.
- [x] Aceptar grupos con `apartado` y `novedades`.
- [x] Filtrar novedades vacías y grupos mal formados.
- [x] Implementar `obtenerEstadoActualizacion()` con `fetch`, `cache: 'no-store'` y timeout razonable.
- [x] Validar `mostrarActualizacion === true` antes de mostrar el modal.
- [x] Mostrar el modal solo si `versionDisponible` es mayor que `VERSION_INSTALADA`.
- [x] Implementar `abrirActualizacionEnTienda(urlPlayStore)` con fallback si `window.open` falla.

## FASE 4: Integrar el modal en la UI

### Objetivo

Mostrar al usuario final el modal de actualización con versión, aviso fijo, novedades agrupadas y acción para abrir Play Store.

- [x] Abrir el layout principal real de la app destino, por ejemplo `src/layouts/MainLayout.vue`.
- [x] Importar `obtenerEstadoActualizacion` y `abrirActualizacionEnTienda`.
- [x] Crear estado reactivo para `hayActualizacionDisponible`.
- [x] Crear estado reactivo para `mostrarModalActualizacion`.
- [x] Crear estado reactivo para `versionDisponible`.
- [x] Crear estado reactivo para `versionInstalada`.
- [x] Crear estado reactivo para `urlPlayStoreActualizacion`.
- [x] Crear estado reactivo para `cambiosActualizacion`.
- [x] Ejecutar `verificarActualizacion()` al montar el layout.
- [x] Guardar en el estado el resultado de `obtenerEstadoActualizacion()`.
- [x] Agregar un `q-dialog` conectado a `mostrarModalActualizacion`.
- [x] Mostrar el título `Hay una actualización disponible`.
- [x] Mostrar `Tu versión` y `Nueva versión`.
- [x] Mostrar el aviso fijo de demora de Play Store.
- [x] Mostrar la sección `Novedades de esta versión` solo si hay cambios.
- [x] Renderizar cada grupo con subtítulo de apartado cuando exista.
- [x] Renderizar cada novedad como item de lista.
- [x] Agregar botón `Cancelar` que cierre el modal.
- [x] Agregar botón `Actualizar` que ejecute `irAPlayStore()`.
- [x] Agregar indicador de actualización en menú, drawer o botón equivalente si la app destino tiene un lugar claro para eso.

## FASE 5: Dejar comentarios para la IA futura

### Objetivo

Documentar el contrato en el punto real donde se renderizan las notas para que futuras ejecuciones no rompan el flujo.

- [x] Agregar comentarios breves junto a la sección de notas del modal.
- [x] Indicar que las notas de parche se cargan desde `version.json` como grupos con `apartado` y `novedades`.
- [x] Indicar que la IA debe agrupar novedades con subtítulos según los apartados afectados.
- [x] Indicar que si una mejora es compartida se deben nombrar todos los apartados afectados.
- [x] Indicar que se debe usar texto corto y claro para usuario final.
- [x] Indicar que Leo decide qué líneas conservar antes de publicar.

Comentario recomendado:

```vue
<!-- Notas de parche: cargar desde version.json como grupos con apartado y novedades. -->
<!-- La IA debe agrupar las novedades con subtítulos según los apartados afectados de la app. -->
<!-- Si una mejora es compartida, nombrar todos los apartados afectados antes de describirla. -->
<!-- Usar texto corto y claro; Leo decide qué líneas conservar antes de publicar. -->
```

## FASE 6: Crear el script que preserva las notas

### Objetivo

Evitar que builds, releases o scripts automáticos borren `cambios` de `public/version.json`.

- [x] Crear `Scripts/GenerarVersionJson.js` si no existe.
- [x] Leer `package.json` para tomar la versión actual.
- [x] Leer `public/version.json` existente si ya existe.
- [x] Mantener `urlPlayStore` existente si ya estaba definido.
- [x] Mantener `mostrarActualizacion` existente si ya estaba definido.
- [x] Preservar `cambios` si es un array.
- [x] Escribir `public/version.json` con `JSON.stringify(..., null, 2)` y salto final.
- [x] Guardar el archivo en UTF-8.
- [x] Agregar o ajustar el script correspondiente en `package.json` si la app destino usa `prebuild`, `build`, `cel` o release automatizado.
- [x] Ejecutar el script y confirmar que no borra las novedades.

## FASE 7: Integrar el flujo de la skill notas-modal

### Objetivo

Usar `$notas-modal` como inicio del proceso editorial y dejar el resultado listo para `public/version.json`.

Pendiente editorial: esta fase se ejecuta cuando Leo pida preparar notas reales del modal. No se aplican novedades inventadas.

- [ ] Ejecutar la skill `$notas-modal` cuando Leo pida preparar notas del modal.
- [ ] Confirmar la raíz del repo destino y que existe `.git`.
- [ ] Ejecutar el comando de borrador del skill contra el repo destino.
- [ ] Mostrar primero a Leo un bloque editable con base, rango y novedades sugeridas.
- [ ] Esperar que Leo decida qué líneas mantener, quitar o reescribir.
- [ ] No aplicar notas al archivo antes de la aprobación de Leo.
- [ ] Si Leo pide limpiar notas viejas, buscar archivos de notas viejas con el comando del skill.
- [ ] Mostrar los archivos encontrados antes de borrar.
- [ ] Borrar notas viejas solo con confirmación explícita de Leo.
- [ ] Entregar las notas finales en bloque de código listo para pegar en `public/version.json`.
- [ ] Si Leo pide aplicar las notas, actualizar `public/version.json` respetando el formato agrupado.

## FASE 8: Ajustar versionado y variables de entorno

### Objetivo

Conectar el sistema con la versión real instalada y la URL remota que la app consultará.

- [x] Leer la versión desde `package.json`.
- [x] Configurar `VERSION_APP` en `quasar.config.js` con la versión de `package.json`.
- [x] Configurar `URL_VERSION_REMOTA` en `quasar.config.js` desde variable de entorno o valor configurable para desarrollo.
- [x] Configurar `URL_PLAY_STORE` con `https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto` si se usa variable de entorno.
- [x] Confirmar que `versionDisponible` de `public/version.json` queda alineada con `package.json`.
- [x] Si la app tiene Android, confirmar si también hay que alinear `android/app/build.gradle`.
- [x] Si existe `package-lock.json`, confirmar que la versión queda alineada cuando corresponda.

## FASE TESTING

### Objetivo

Validar de forma ejecutable por IA y revisable por humano que el flujo completo funciona desde la generación de notas hasta el modal visible al usuario.

- [x] Ejecutar `npm run lint` si existe.
- [x] Ejecutar el build disponible de la app destino.
- [x] Ejecutar `Scripts/GenerarVersionJson.js` y confirmar que `cambios` sigue presente.
- [x] Servir o publicar temporalmente un `version.json` con `versionDisponible` mayor a la instalada.
- [x] Configurar `URL_VERSION_REMOTA` para apuntar a ese `version.json`.
- [x] Abrir la app y verificar que el modal aparece.
- [x] Confirmar que el modal muestra versión instalada y versión disponible.
- [x] Confirmar que el aviso fijo de demora de Play Store se ve siempre dentro del modal.
- [x] Confirmar que `Novedades de esta versión` aparece solo cuando `cambios` tiene contenido.
- [x] Confirmar que los apartados se renderizan como subtítulos y no como bullets comunes.
- [x] Confirmar que las novedades se renderizan como lista dentro de cada apartado.
- [x] Probar un `version.json` con cambios antiguos en formato string y confirmar que no rompe el modal.
- [x] Probar un `version.json` sin `cambios` y confirmar que el modal sigue funcionando.
- [x] Probar `mostrarActualizacion: false` y confirmar que no aparece el modal.
- [x] Probar una `versionDisponible` igual o menor a la instalada y confirmar que no aparece el modal.
- [x] Pulsar `Cancelar` y confirmar que el modal se cierra.
- [x] Pulsar `Actualizar` y confirmar que abre la URL correcta de Play Store.
- [x] Confirmar que no hay texto con caracteres corruptos de acentos o eñes.

## Progreso del plan

- [x] Fase 1: Diagnosticar la app destino
- [x] Fase 2: Crear el contrato de versión remota
- [x] Fase 3: Crear el servicio de actualización
- [x] Fase 4: Integrar el modal en la UI
- [x] Fase 5: Dejar comentarios para la IA futura
- [x] Fase 6: Crear el script que preserva las notas
- [ ] Fase 7: Integrar el flujo de la skill notas-modal
- [x] Fase 8: Ajustar versionado y variables de entorno
- [x] Fase Testing

Fecha de creación: 7 de Junio 2026
Fecha de última actualización: 7 de Junio 2026
Estado: EN PROCESO
