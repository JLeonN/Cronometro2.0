import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'

const CLAVE_IDIOMA = 'idioma_app'

export const useIdiomaStore = defineStore('idioma', () => {
  const idiomaActual = ref('es-419')
  const idiomaCargado = ref(false)

  // Cargar idioma guardado o detectar del dispositivo
  async function inicializarIdioma() {
    try {
      console.log('🔄 Inicializando idioma...')

      const { value } = await Preferences.get({ key: CLAVE_IDIOMA })

      if (value) {
        console.log('✅ Idioma encontrado en storage:', value)
        idiomaActual.value = value
      } else {
        console.log('⚠️ No hay idioma guardado, detectando del dispositivo...')

        // Detectar idioma del dispositivo
        const idiomaDispositivo = navigator.language || navigator.userLanguage
        console.log('📱 Idioma del dispositivo:', idiomaDispositivo)

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

      // Primero actualizar el estado
      idiomaActual.value = idioma

      // Luego guardar en Preferences
      await Preferences.set({
        key: CLAVE_IDIOMA,
        value: idioma,
      })

      // Verificar que se guardó correctamente
      const verificacion = await Preferences.get({ key: CLAVE_IDIOMA })
      console.log('✅ Verificación - Idioma guardado:', verificacion.value)

      if (verificacion.value !== idioma) {
        console.error('❌ ERROR: El idioma no se guardó correctamente!')
      }
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
