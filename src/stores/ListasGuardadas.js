import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

const CLAVE_LISTAS_GUARDADAS = 'cronometro_listas_guardadas'

export const useListasGuardadasStore = defineStore('listasGuardadas', () => {
  const listas = ref([])
  const cargando = ref(true)
  const errorCarga = ref(false)
  let operacionPendiente = Promise.resolve()

  function ordenarListas(listasAOrdenar) {
    return [...listasAOrdenar].sort((primera, segunda) => {
      const diferenciaFecha = primera.fechaCreacion.localeCompare(segunda.fechaCreacion)
      return diferenciaFecha || (primera.ordenCreacion ?? 0) - (segunda.ordenCreacion ?? 0)
    })
  }

  async function cargarListas() {
    cargando.value = true
    errorCarga.value = false
    try {
      const resultado = await Preferences.get({ key: CLAVE_LISTAS_GUARDADAS })
      const datos = resultado.value ? JSON.parse(resultado.value) : []
      if (
        !Array.isArray(datos) ||
        datos.some(
          (lista) =>
            typeof lista.id !== 'string' ||
            typeof lista.titulo !== 'string' ||
            typeof lista.fechaCreacion !== 'string' ||
            !Array.isArray(lista.marcas),
        )
      ) {
        throw new Error('El historial de listas no es válido')
      }
      listas.value = ordenarListas(datos)
    } catch (error) {
      errorCarga.value = true
      console.error('Error al cargar listas guardadas:', error)
    } finally {
      cargando.value = false
    }
  }

  const cargaInicial = cargarListas()
  const totalListas = computed(() => listas.value.length)

  function ejecutarCambio(prepararCambio) {
    const operacion = operacionPendiente.then(async () => {
      await cargaInicial
      if (errorCarga.value) throw new Error('No se pudieron cargar las listas guardadas')
      const { nuevasListas, resultado } = prepararCambio(listas.value)
      await Preferences.set({
        key: CLAVE_LISTAS_GUARDADAS,
        value: JSON.stringify(nuevasListas),
      })
      listas.value = ordenarListas(nuevasListas)
      return resultado
    })
    operacionPendiente = operacion.catch(() => {})
    return operacion
  }

  function guardarLista({ titulo, descripcion, marcas }) {
    const tituloLimpio = titulo?.trim() ?? ''
    if (!tituloLimpio) throw new Error('El título es obligatorio')
    if (!Array.isArray(marcas) || marcas.length === 0) {
      throw new Error('La lista debe tener al menos una marca')
    }

    const marcasCopiadas = marcas.map((marca) => ({
      id: marca.id,
      numero: marca.numero,
      tiempoMarca: marca.tiempoMarca,
      intervalo: marca.intervalo,
      nota: '',
    }))

    return ejecutarCambio((listasActuales) => {
      const siguienteOrden =
        listasActuales.reduce((maximo, lista) => Math.max(maximo, lista.ordenCreacion ?? 0), 0) + 1
      const nuevaLista = {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        titulo: tituloLimpio,
        descripcion: descripcion?.trim() ?? '',
        fechaCreacion: new Date().toISOString(),
        ordenCreacion: siguienteOrden,
        marcas: marcasCopiadas,
      }
      return { nuevasListas: [...listasActuales, nuevaLista], resultado: nuevaLista }
    })
  }

  function eliminarLista(idLista) {
    return ejecutarCambio((listasActuales) => {
      const nuevasListas = listasActuales.filter((lista) => lista.id !== idLista)
      if (nuevasListas.length === listasActuales.length) throw new Error('La lista no existe')
      return { nuevasListas, resultado: true }
    })
  }

  function guardarNotaMarca(idLista, idMarca, nota) {
    return ejecutarCambio((listasActuales) => {
      const lista = listasActuales.find((elemento) => elemento.id === idLista)
      if (!lista) throw new Error('La lista no existe')
      if (!lista.marcas.some((marca) => marca.id === idMarca)) {
        throw new Error('La marca no existe')
      }

      const nuevasListas = listasActuales.map((elemento) => {
        if (elemento.id !== idLista) return elemento
        return {
          ...elemento,
          marcas: elemento.marcas.map((marca) =>
            marca.id === idMarca ? { ...marca, nota: nota.trim() } : marca,
          ),
        }
      })
      return { nuevasListas, resultado: true }
    })
  }

  return {
    listas,
    cargando,
    errorCarga,
    totalListas,
    cargarListas,
    guardarLista,
    eliminarLista,
    guardarNotaMarca,
  }
})
