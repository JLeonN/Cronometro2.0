import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

export const useIdiomaStore = defineStore('idioma', () => {
  const idiomaActual = ref('es-419')
  const idiomaCargado = ref(false)

  // Cargar idioma guardado o detectar del dispositivo
  async function inicializarIdioma() {
    try {
      console.log('🔄 Inicializando idioma...')

      const { value } = await Preferences.get({ key: 'idioma' })

      if (value) {
        console.log('✅ Idioma encontrado en storage:', value)
        idiomaActual.value = value
      } else {
        console.log('⚠️ No hay idioma guardado, detectando del dispositivo...')

        // Detectar idioma del dispositivo
        const idiomaDispositivo = navigator.language || navigator.userLanguage

        if (idiomaDispositivo.startsWith('es')) {
          idiomaActual.value = 'es-419'
        } else {
          idiomaActual.value = 'en-US'
        }

        await guardarIdioma(idiomaActual.value)
        console.log('✅ Idioma por defecto guardado:', idiomaActual.value)
      }

      idiomaCargado.value = true
      console.log('✅ Idioma inicializado:', idiomaActual.value)
    } catch (error) {
      console.error('❌ Error al inicializar idioma:', error)
      idiomaActual.value = 'es-419'
      idiomaCargado.value = true
    }
  }

  // Guardar idioma seleccionado
  async function guardarIdioma(idioma) {
    try {
      console.log('💾 Guardando idioma:', idioma)

      await Preferences.set({
        key: 'idioma',
        value: idioma,
      })

      idiomaActual.value = idioma
      console.log('✅ Idioma guardado correctamente:', idioma)
    } catch (error) {
      console.error('❌ Error al guardar idioma:', error)
    }
  }

  return {
    idiomaActual,
    idiomaCargado,
    inicializarIdioma,
    guardarIdioma,
  }
})
