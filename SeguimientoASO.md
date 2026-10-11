# Seguimiento ASO del cronómetro

## Objetivo

Mejorar el descubrimiento de la app en Google Play, la claridad de su ficha y la proporción de visitantes que deciden instalarla. Registrar cada cambio junto con sus métricas para evaluar su efecto.

## Ficha pública inicial

- Fecha de revisión: 11 de octubre de 2026.
- Enlace: https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto
- Nombre visible en la versión en inglés consultada: **Stopwatch - Timer & Laps**.
- Descripción breve visible: **Precise stopwatch for sports, study and tasks. With lap recording feature.**
- Categoría visible: **Sports**.
- Descargas públicas: **100+**. Esta cifra es un rango de la tienda, no el total exacto de instalaciones.
- Última actualización visible: **27 de julio de 2026**.
- Fuente: ficha pública de Google Play consultada en inglés. La presentación puede variar según país e idioma.

## Funciones comprobadas en el código

El código actual implementa cronómetro ascendente, pausa, reanudación, marcas, intervalos entre marcas, total de marcas, promedio de intervalos, eliminación de marcas y selección de idioma español o inglés. Guarda las marcas localmente. Muestra centésimas en pantalla.

No se encontró cuenta regresiva, temporizador Pomodoro, programación de intervalos ni guardado de sesiones completas. La ficha vigente usa «Timer», propone Pomodoro y habla de «precisión milimétrica» o «millisecond precision». Recomiendo retirar o corregir esas promesas en ambos idiomas.

## Datos de Play Console revisados el 11 de octubre de 2026

| Informe y período visible | Métrica | Valor | Observación |
| --- | --- | ---: | --- |
| Fichas de Play Store, 8 sep–5 oct 2026 | Visitantes de la ficha predeterminada | 48 | El informe de fichas muestra este período al seleccionar «Últimos 28 días». |
| Fichas de Play Store, 8 sep–5 oct 2026 | Conversión a instalaciones | 25,0 % | No equivale a la tasa de clics. |
| Fichas de Play Store, 8 sep–5 oct 2026 | Visitantes del panel de rendimiento | 34 | Desglose: 27 por navegación en Google Play y 7 por anuncios o referencias. El panel y la tabla de la ficha muestran totales distintos; no mezclarlos. |
| Fichas de Play Store, 8 sep–5 oct 2026 | Clics únicos de instalación | 18 | Métrica de intención, no instalaciones completadas. |
| Fichas de Play Store, 8 sep–5 oct 2026 | Tasa de clics | 53 % | Calculada en el panel de rendimiento. |
| Aumenta la cantidad de usuarios, últimos 28 días al 11 oct 2026 | Impresiones de dispositivos | 647 | −71 % frente al período anterior. |
| Aumenta la cantidad de usuarios, últimos 28 días al 11 oct 2026 | Adquisiciones de dispositivos | 14 | −50 % frente al período anterior. |
| Aumenta la cantidad de usuarios, últimos 28 días al 11 oct 2026 | Adquisiciones por navegación en Google Play | 5 | Otras 3 pagadas/directas y 6 sin atribuir. |
| Aumenta la cantidad de usuarios, últimos 28 días al 11 oct 2026 | Primer acceso de dispositivos | 7 | 0 % frente al período anterior. |
| Aumenta la cantidad de usuarios, últimos 28 días al 11 oct 2026 | Dispositivos activos por mes | 18 | +13 % frente al período anterior. |
| Estadísticas, 9 oct 2026 | Usuarios con la app instalada | 75 | México 19, Brasil 10, Perú 10 y Colombia 7. Es una foto de un día, no adquisiciones del período. |

La retención al día 7, la tasa de fallas y la tasa de ANR figuran sin datos disponibles. La ficha predeterminada solo tiene tres capturas por idioma y no hay experimentos A/B registrados.

En el desglose por términos de búsqueda, los 27 visitantes de navegación aparecen agrupados como «Otro»; no hay consultas individuales visibles para elegir palabras clave a partir de datos propios. En el desglose por idioma del dispositivo destacan inglés de EE. UU. (8 visitantes), portugués de Brasil (5), español de EE. UU. (4) y español de Latinoamérica (1); otros idiomas tienen volúmenes menores. La calificación predeterminada visible es 5,000 basada en 2 usuarios; no hubo calificaciones coincidentes con el filtro de los últimos 28 días.

**API de Android:** el commit `86dc73e` del 27 de julio de 2026 elevó `compileSdkVersion` y `targetSdkVersion` de 35 a 36. Play Console confirma que el App Bundle de producción **35 (2.1.4)**, publicado ese mismo día, tiene **SDK de destino 36**. El paquete anterior 34 (2.1.3), con SDK de destino 35, figura desactivado. Por tanto, no hace falta otra versión para cumplir el requisito de API 36. Un aviso observado durante la revisión parecía indicar lo contrario; el detalle del paquete publicado corrige esa interpretación. Los cambios de ficha siguen guardados como borrador y aún no se publicaron.

## Propuesta de texto en español latinoamericano

- Nombre: **Cronómetro: vueltas y marcas**
- Descripción breve: **Registra vueltas, intervalos y tiempos con un cronómetro fácil de usar.**
- Estado en Play Console: **guardado como borrador el 11 de octubre de 2026**; aún no publicado.

```text
Mide el tiempo de tus entrenamientos y actividades con un cronómetro claro y fácil de usar.

Inicia, pausa y reanuda con un toque. Guarda marcas mientras el cronómetro avanza y consulta el tiempo total, el intervalo de cada marca y el promedio de los intervalos.

FUNCIONES
• Cronómetro ascendente con visualización de centésimas.
• Registro de vueltas y tiempos parciales.
• Tiempo acumulado e intervalo de cada marca.
• Total de marcas y promedio de intervalos.
• Pausa y reanudación.
• Eliminación de marcas individuales o de todas las marcas.
• Marcas guardadas localmente en el dispositivo.
• Interfaz en español e inglés.

Úsalo para correr, entrenar, estudiar o medir cualquier actividad en la que necesites registrar tiempos y vueltas.
```

## Proposed text in English

- App name: **Stopwatch: Laps & Splits**
- Short description: **Track laps, split times and intervals with a simple stopwatch.**
- Estado en Play Console: **guardado como borrador el 11 de octubre de 2026**; aún no publicado.

```text
Time your workouts and everyday activities with a clear, easy-to-use stopwatch.

Start, pause and resume with one tap. Record laps while the stopwatch runs, then view your total time, each lap interval and the average interval.

FEATURES
• Count-up stopwatch displaying hundredths of a second.
• Lap and split time recording.
• Total elapsed time and individual lap intervals.
• Lap count and average interval.
• Pause and resume controls.
• Delete individual laps or clear all laps.
• Laps saved locally on your device.
• Spanish and English interface.

Use it for running, workouts, study sessions or any activity where you want to track elapsed time and laps.
```

## Material visual

- El 11 de octubre de 2026 se instalaron en el teléfono de prueba los cambios actuales de la app. La compilación se hizo con publicidad de prueba y el código de producción quedó restaurado después.
- Se crearon gráficos destacados nuevos para español e inglés. Ambos quedaron guardados como borradores en Play Console; aún no publicados.
- Se tomaron capturas reales de la compilación actual en `es-419` y `en-US`, procesadas a 1080 × 1920 px. Se recortaron únicamente las zonas de barra de estado y publicidad de prueba. Se descartaron tomas con anuncios superpuestos y una animación de marca en transición.
- Hay cuatro capturas nuevas por idioma en los borradores: pantalla inicial, cronómetro en marcha, marcas con promedio y menú de idioma. Google Play indica que cuatro capturas con al menos 1080 px por lado permiten participar de la promoción.
- Los archivos finales están en `F:\Programación\Cronometro 2.0\Español` y `F:\Programación\Cronometro 2.0\Inglés`, con nombres `Tienda*.png` y `GraficoFunciones*.png`. Los originales y materiales de trabajo se movieron a `F:\Programación\Cronometro 2.0\MaterialASO`; no quedaron imágenes en el repositorio.
- El teléfono no aceptó «Depuración USB (ajustes de seguridad)» porque MIUI solicitó una SIM. Se controló la WebView de la compilación de prueba por depuración. Al terminar, se restauraron las tres marcas originales y el idioma español.
- Revisar en una iteración posterior si el ícono vigente representa bien la app.
- Evitar texto incrustado que prometa temporizador o cuenta regresiva.

## Datos pendientes de Play Console

Usar siempre el mismo período al comparar métricas, preferentemente los últimos 28 días, y anotar fecha, país, idioma y fuente de tráfico.

| Período | País e idioma | Fuente | Visitantes de ficha | Clics en instalar | CTR de ficha | Instaladores nuevos | Términos de búsqueda principales | Nota |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| 8 sep–5 oct 2026 | Todos, ficha predeterminada | Todas | 48 | Pendiente | Pendiente | Pendiente | Pendiente | La tasa de instalación y la de clics son distintas. |

Registrar también, cuando estén disponibles: desinstalaciones, retención a 7 y 30 días, calificación, cantidad de reseñas y fallos/ANR. Esos datos ayudan a interpretar si las instalaciones se convierten en uso sostenido.

## Historial de cambios y experimentos

| Fecha | País e idioma | Elemento modificado | Hipótesis | Métrica de referencia | Resultado | Decisión |
| --- | --- | --- | --- | --- | --- | --- |
| 11 oct 2026 | es-419 y en-US | Textos, gráfico destacado y cuatro capturas por idioma | Explicar vueltas y marcas con precisión para mejorar los clics y las instalaciones | 48 visitantes y 25 % de conversión en el informe de ficha del 8 sep–5 oct | Pendiente; cambios guardados como borrador | Revisar y publicar la ficha; después medir 28 días comparables |

## Fuentes para las métricas

- Ficha pública: https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto
- Rendimiento de la ficha en Play Console: https://support.google.com/googleplay/android-developer/answer/9859173
- Estadísticas de la app en Play Console: https://support.google.com/googleplay/android-developer/answer/139628

Desde julio de 2026, el informe principal de rendimiento de la ficha se centra en los clics de intención de instalar o abrir. Registrar por separado los clics y las instalaciones completadas; no tratarlos como la misma métrica.
