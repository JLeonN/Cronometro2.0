import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Preferences } from '@capacitor/preferences'

const CLAVE_ALMACENAMIENTO = 'cronometro_marcas'

export const useCronometroStore = defineStore('cronometro', () => {
  // ========================================
  // ESTADO
  // ========================================
  const tiempoTranscurrido = ref(0) // milisegundos
  const estadoCronometro = ref('detenido') // 'detenido' | 'corriendo' | 'pausado'
  const marcas = ref([]) // Array de marcas
  const listaEnContinuacion = ref(null)
  const cargandoMarcas = ref(true)
  const idIntervalo = ref(null)
  const tiempoInicio = ref(0)
  const tiempoAcumulado = ref(0)
  const tiempoUltimaMarca = ref(0)
  let operacionAlmacenamiento = Promise.resolve()

  // ========================================
  // COMPUTED
  // ========================================
  const tiempoFormateado = computed(() => {
    return formatearTiempo(tiempoTranscurrido.value)
  })

  const totalMarcas = computed(() => marcas.value.length)
  const marcasNuevas = computed(() => {
    if (!listaEnContinuacion.value) return []
    const idsOriginales = new Set(listaEnContinuacion.value.idsMarcasOriginales)
    return marcas.value.filter((marca) => !idsOriginales.has(marca.id))
  })

  const promedioMarcas = computed(() => {
    if (marcas.value.length === 0) return 0
    const suma = marcas.value.reduce((acc, marca) => acc + marca.intervalo, 0)
    return Math.round(suma / marcas.value.length)
  })

  const promedioFormateado = computed(() => {
    return formatearTiempo(promedioMarcas.value)
  })

  const tiempoMarcaActual = computed(() => {
    return tiempoTranscurrido.value - tiempoUltimaMarca.value
  })

  const tiempoMarcaActualFormateado = computed(() => {
    return formatearTiempo(tiempoMarcaActual.value)
  })

  // ========================================
  // ACCIONES
  // ========================================
  function iniciar() {
    if (estadoCronometro.value === 'corriendo') return

    if (estadoCronometro.value === 'detenido' && !listaEnContinuacion.value) {
      tiempoUltimaMarca.value = 0
    }

    estadoCronometro.value = 'corriendo'
    tiempoInicio.value = Date.now()

    idIntervalo.value = setInterval(() => {
      tiempoTranscurrido.value = tiempoAcumulado.value + (Date.now() - tiempoInicio.value)
    }, 10)
  }

  function pausar() {
    if (estadoCronometro.value !== 'corriendo') return

    estadoCronometro.value = 'pausado'
    tiempoAcumulado.value = tiempoTranscurrido.value
    clearInterval(idIntervalo.value)
    idIntervalo.value = null
  }

  function reanudar() {
    if (estadoCronometro.value !== 'pausado') return
    iniciar()
  }

  async function detener() {
    estadoCronometro.value = 'detenido'
    const tiempoRestaurado = listaEnContinuacion.value ? tiempoUltimaMarca.value : 0
    tiempoTranscurrido.value = tiempoRestaurado
    tiempoAcumulado.value = tiempoRestaurado
    tiempoUltimaMarca.value = tiempoRestaurado
    clearInterval(idIntervalo.value)
    idIntervalo.value = null
  }

  function guardarMarca() {
    if (estadoCronometro.value !== 'corriendo') return

    const tiempoMarcaActualTotal = tiempoTranscurrido.value
    const intervalo = tiempoMarcaActualTotal - tiempoUltimaMarca.value

    const nuevaMarca = {
      numero: marcas.value.length + 1,
      tiempoMarca: tiempoMarcaActualTotal,
      intervalo: intervalo,
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    }

    // Agregar al inicio (última marca arriba)
    marcas.value.unshift(nuevaMarca)
    tiempoUltimaMarca.value = tiempoMarcaActualTotal

    // Guardar en almacenamiento
    guardarMarcasEnAlmacenamiento()
  }

  async function guardarMarcasEnAlmacenamiento(
    marcasAGuardar = marcas.value,
    listaAGuardar = listaEnContinuacion.value,
  ) {
    const valor = JSON.stringify({ marcas: marcasAGuardar, listaEnContinuacion: listaAGuardar })
    const operacion = operacionAlmacenamiento.then(() =>
      Preferences.set({ key: CLAVE_ALMACENAMIENTO, value: valor }),
    )
    operacionAlmacenamiento = operacion.catch(() => {})
    try {
      await operacion
      return true
    } catch (error) {
      console.error('Error al guardar marcas:', error)
      return false
    }
  }

  async function cargarMarcasDesdeAlmacenamiento() {
    try {
      const resultado = await Preferences.get({ key: CLAVE_ALMACENAMIENTO })
      if (resultado.value) {
        const datos = JSON.parse(resultado.value)
        const marcasGuardadas = Array.isArray(datos) ? datos : datos?.marcas
        if (!Array.isArray(marcasGuardadas)) throw new Error('Las marcas guardadas no son válidas')
        marcas.value = marcasGuardadas
        const continuacion = Array.isArray(datos) ? null : datos.listaEnContinuacion
        if (
          continuacion &&
          typeof continuacion.idLista === 'string' &&
          Array.isArray(continuacion.idsMarcasOriginales) &&
          marcas.value.length > 0
        ) {
          listaEnContinuacion.value = continuacion
          const ultimaMarca = marcas.value.reduce(
            (maximo, marca) => Math.max(maximo, marca.tiempoMarca),
            0,
          )
          tiempoTranscurrido.value = ultimaMarca
          tiempoAcumulado.value = ultimaMarca
          tiempoUltimaMarca.value = ultimaMarca
          estadoCronometro.value = 'pausado'
        }
      }
    } catch (error) {
      console.error('Error al cargar marcas:', error)
    } finally {
      cargandoMarcas.value = false
    }
  }

  async function eliminarTodasLasMarcas() {
    marcas.value = []
    tiempoTranscurrido.value = 0
    tiempoAcumulado.value = 0
    tiempoUltimaMarca.value = 0
    listaEnContinuacion.value = null
    await guardarMarcasEnAlmacenamiento()
  }

  async function continuarLista(lista) {
    await cargaInicial
    if (!lista?.id || !Array.isArray(lista.marcas) || lista.marcas.length === 0) {
      throw new Error('La lista no tiene marcas para continuar')
    }
    const marcasRestauradas = lista.marcas.map((marca) => ({ ...marca }))
    const continuacion = {
      idLista: lista.id,
      idsMarcasOriginales: marcasRestauradas.map((marca) => marca.id),
    }
    const guardado = await guardarMarcasEnAlmacenamiento(marcasRestauradas, continuacion)
    if (!guardado) throw new Error('No se pudo restaurar la lista')

    clearInterval(idIntervalo.value)
    idIntervalo.value = null
    const ultimaMarca = marcasRestauradas.reduce(
      (maximo, marca) => Math.max(maximo, marca.tiempoMarca),
      0,
    )
    marcas.value = marcasRestauradas
    listaEnContinuacion.value = continuacion
    tiempoTranscurrido.value = ultimaMarca
    tiempoAcumulado.value = ultimaMarca
    tiempoUltimaMarca.value = ultimaMarca
    tiempoInicio.value = 0
    estadoCronometro.value = 'pausado'
  }

  async function reiniciarSesion() {
    const guardado = await guardarMarcasEnAlmacenamiento([], null)
    if (!guardado) throw new Error('No se pudo limpiar la sesión actual')

    clearInterval(idIntervalo.value)
    idIntervalo.value = null
    estadoCronometro.value = 'detenido'
    tiempoTranscurrido.value = 0
    tiempoInicio.value = 0
    tiempoAcumulado.value = 0
    tiempoUltimaMarca.value = 0
    marcas.value = []
    listaEnContinuacion.value = null
  }

  async function eliminarMarca(idMarca) {
    marcas.value = marcas.value.filter((marca) => marca.id !== idMarca)
    // Recalcular números
    marcas.value = marcas.value.map((marca, index) => ({
      ...marca,
      numero: marcas.value.length - index,
    }))
    tiempoUltimaMarca.value = marcas.value[0]?.tiempoMarca ?? 0
    await guardarMarcasEnAlmacenamiento()
  }

  // ========================================
  // UTILIDADES
  // ========================================
  function formatearTiempo(milisegundos) {
    const totalSegundos = Math.floor(milisegundos / 1000)
    const minutos = Math.floor(totalSegundos / 60)
    const segundos = totalSegundos % 60
    const centesimas = Math.floor((milisegundos % 1000) / 10)

    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}.${String(centesimas).padStart(2, '0')}`
  }

  // ========================================
  // INICIALIZACIÓN
  // ========================================
  // Cargar marcas al iniciar
  const cargaInicial = cargarMarcasDesdeAlmacenamiento()

  return {
    // Estado
    tiempoTranscurrido,
    estadoCronometro,
    marcas,
    listaEnContinuacion,
    cargandoMarcas,

    // Computed
    tiempoFormateado,
    totalMarcas,
    marcasNuevas,
    promedioMarcas,
    promedioFormateado,
    tiempoMarcaActual,
    tiempoMarcaActualFormateado,

    // Acciones
    iniciar,
    pausar,
    reanudar,
    detener,
    guardarMarca,
    eliminarTodasLasMarcas,
    reiniciarSesion,
    continuarLista,
    eliminarMarca,
    formatearTiempo,
  }
})
