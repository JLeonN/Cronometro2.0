import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { useConfiguracionStore } from 'src/stores/storeIdioma'

export default boot(async ({ app }) => {
  // Crear instancia de i18n
  const i18n = createI18n({
    locale: 'es-419',
    legacy: false,
    globalInjection: true,
    messages,
  })

  app.use(i18n)

  // Inicializar store y detectar idioma
  const configuracionStore = useConfiguracionStore()
  await configuracionStore.inicializarIdioma()

  // Aplicar idioma detectado
  i18n.global.locale.value = configuracionStore.idiomaActual
})
