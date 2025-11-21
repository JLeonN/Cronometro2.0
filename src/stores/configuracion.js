import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export const useConfiguracionStore = defineStore('configuracion', () => {
  const idiomaActual = ref('es-419')

  // Cargar idioma guardado o detectar del dispositivo
  async function inicializarIdioma() {
    try {
      const { value } = await Preferences.get({ key: 'idioma' })

      if (value) {
        idiomaActual.value = value
      } else {
        // Detectar idioma del dispositivo
        const idiomaDispositivo = navigator.language || navigator.userLanguage

        if (idiomaDispositivo.startsWith('es')) {
          idiomaActual.value = 'es-419'
        } else {
          idiomaActual.value = 'en-US'
        }

        await guardarIdioma(idiomaActual.value)
      }
    } catch (error) {
      console.error('Error al inicializar idioma:', error)
      idiomaActual.value = 'es-419'
    }
  }

  // Guardar idioma seleccionado
  async function guardarIdioma(idioma) {
    try {
      await Preferences.set({
        key: 'idioma',
        value: idioma,
      })
      idiomaActual.value = idioma
    } catch (error) {
      console.error('Error al guardar idioma:', error)
    }
  }

  return {
    idiomaActual,
    inicializarIdioma,
    guardarIdioma,
  }
})
