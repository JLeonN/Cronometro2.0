import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { useIdiomaStore } from 'src/stores/storeIdioma'
import { Preferences } from '@capacitor/preferences'

export default boot(async ({ app }) => {
  // 1. Primero cargar el idioma guardado ANTES de crear i18n
  let idiomaInicial = 'es-419'

  try {
    const { value } = await Preferences.get({ key: 'idioma_app' })
    if (value) {
      console.log('🔄 Idioma guardado encontrado:', value)
      idiomaInicial = value
    } else {
      console.log('⚠️ No hay idioma guardado, usando español')
    }
  } catch (error) {
    console.error('❌ Error al cargar idioma inicial:', error)
  }

  // 2. Crear i18n con el idioma correcto
  const i18n = createI18n({
    locale: idiomaInicial,
    legacy: false,
    globalInjection: true,
    messages,
  })

  app.use(i18n)

  // 3. Inicializar store (esto sincroniza el estado)
  const idiomaStore = useIdiomaStore()
  await idiomaStore.inicializarIdioma()

  // 4. Aplicar idioma del store (por si detectó del dispositivo)
  i18n.global.locale.value = idiomaStore.idiomaActual

  console.log('✅ i18n inicializado con idioma:', i18n.global.locale.value)
})
