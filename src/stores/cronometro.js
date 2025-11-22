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
  const idIntervalo = ref(null)
  const tiempoInicio = ref(0)
  const tiempoAcumulado = ref(0)

  // ========================================
  // COMPUTED
  // ========================================
  const tiempoFormateado = computed(() => {
    return formatearTiempo(tiempoTranscurrido.value)
  })

  const totalMarcas = computed(() => marcas.value.length)

  const promedioMarcas = computed(() => {
    if (marcas.value.length === 0) return 0
    const suma = marcas.value.reduce((acc, marca) => acc + marca.intervalo, 0)
    return Math.round(suma / marcas.value.length)
  })

  const promedioFormateado = computed(() => {
    return formatearTiempo(promedioMarcas.value)
  })

  // ========================================
  // ACCIONES
  // ========================================
  function iniciar() {
    if (estadoCronometro.value === 'corriendo') return

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

  function detener() {
    estadoCronometro.value = 'detenido'
    tiempoTranscurrido.value = 0
    tiempoAcumulado.value = 0
    clearInterval(idIntervalo.value)
    idIntervalo.value = null
    marcas.value = []
  }

  function guardarMarca() {
    if (estadoCronometro.value !== 'corriendo') return

    const tiempoMarcaActual = tiempoTranscurrido.value
    const tiempoUltimaMarca = marcas.value.length > 0 ? marcas.value[0].tiempoMarca : 0
    const intervalo = tiempoMarcaActual - tiempoUltimaMarca

    const nuevaMarca = {
      numero: marcas.value.length + 1,
      tiempoMarca: tiempoMarcaActual,
      intervalo: intervalo,
      id: Date.now(), // Para key única
    }

    // Agregar al inicio (última marca arriba)
    marcas.value.unshift(nuevaMarca)

    // Guardar en almacenamiento
    guardarMarcasEnAlmacenamiento()
  }

  async function guardarMarcasEnAlmacenamiento() {
    try {
      await Preferences.set({
        key: CLAVE_ALMACENAMIENTO,
        value: JSON.stringify(marcas.value),
      })
    } catch (error) {
      console.error('Error al guardar marcas:', error)
    }
  }

  async function cargarMarcasDesdeAlmacenamiento() {
    try {
      const resultado = await Preferences.get({ key: CLAVE_ALMACENAMIENTO })
      if (resultado.value) {
        marcas.value = JSON.parse(resultado.value)
      }
    } catch (error) {
      console.error('Error al cargar marcas:', error)
    }
  }

  async function eliminarTodasLasMarcas() {
    marcas.value = []
    await guardarMarcasEnAlmacenamiento()
  }

  async function eliminarMarca(idMarca) {
    marcas.value = marcas.value.filter((marca) => marca.id !== idMarca)
    // Recalcular números
    marcas.value = marcas.value.map((marca, index) => ({
      ...marca,
      numero: marcas.value.length - index,
    }))
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
  cargarMarcasDesdeAlmacenamiento()

  return {
    // Estado
    tiempoTranscurrido,
    estadoCronometro,
    marcas,

    // Computed
    tiempoFormateado,
    totalMarcas,
    promedioMarcas,
    promedioFormateado,

    // Acciones
    iniciar,
    pausar,
    reanudar,
    detener,
    guardarMarca,
    eliminarTodasLasMarcas,
    eliminarMarca,
    formatearTiempo,
  }
})
