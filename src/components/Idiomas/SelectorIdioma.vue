<template>
  <q-select
    v-model="idiomaSeleccionado"
    :options="opcionesIdioma"
    emit-value
    map-options
    outlined
    dense
    behavior="menu"
    @update:model-value="cambiarIdioma"
    class="selector-idioma"
    popup-content-class="menu-idioma"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" class="opcion-idioma">
        <q-item-section avatar>
          <span class="emoji-bandera">{{ scope.opt.emoji }}</span>
        </q-item-section>
        <q-item-section>
          <q-item-label class="texto-idioma">{{ scope.opt.label }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="scope.opt.value === idiomaSeleccionado">
          <q-icon name="check" class="icono-seleccionado" size="20px" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIdiomaStore } from 'src/stores/storeIdioma'
import adMobRewardedInterstitialService from 'src/AdMob/AdMobRewardedInterstitial.js'

const { t, locale } = useI18n()
const idiomaStore = useIdiomaStore()

const idiomaSeleccionado = computed({
  get: () => idiomaStore.idiomaActual,
  set: (valor) => valor,
})

const opcionesIdioma = computed(() => [
  { label: t('configuracion.idioma.espanol'), value: 'es-419', emoji: '🇪🇸' },
  { label: t('configuracion.idioma.ingles'), value: 'en-US', emoji: '🇺🇸' },
])

async function cambiarIdioma(nuevoIdioma) {
  console.log('🔄 Iniciando cambio de idioma a:', nuevoIdioma)

  // 1. Cambiar idioma en Vue i18n PRIMERO
  locale.value = nuevoIdioma
  console.log('✅ locale.value actualizado a:', locale.value)

  // 2. Guardar en Capacitor Preferences
  await idiomaStore.guardarIdioma(nuevoIdioma)
  console.log('✅ Idioma guardado en store:', idiomaStore.idiomaActual)

  // 3. Mostrar video publicitario
  console.log('📺 Mostrando video...')
  await adMobRewardedInterstitialService.mostrarAnuncio()
  console.log('✅ Proceso completo')
}
</script>

<style scoped>
.selector-idioma {
  transition: all 0.3s ease;
}
.selector-idioma :deep(.q-field__control) {
  background: var(--color-azul-oscuro);
  border-radius: 8px;
}
.selector-idioma :deep(.q-field__control::before) {
  border-color: var(--color-azul-claro);
}
.selector-idioma:hover :deep(.q-field__control::before),
.selector-idioma:focus-within :deep(.q-field__control::before) {
  border-color: var(--color-texto-blanco);
}
.selector-idioma :deep(.q-field__native),
.selector-idioma :deep(.q-field__input) {
  color: var(--color-texto-blanco);
  font-weight: 500;
}
.selector-idioma :deep(.q-field__append) {
  color: var(--color-azul-claro);
}
.emoji-bandera {
  font-size: 28px;
  filter: drop-shadow(var(--sombra-suave));
}
.texto-idioma {
  font-weight: 500;
  color: var(--color-texto-principal);
}
</style>
<style>
.menu-idioma {
  background: var(--color-azul-oscuro) !important;
  border: 1px solid var(--color-azul-claro) !important;
  border-radius: 8px !important;
  box-shadow: var(--sombra-fuerte) !important;
  margin-top: 4px !important;
}
.menu-idioma .opcion-idioma {
  min-height: 56px;
  padding: 10px 14px;
  color: var(--color-texto-blanco);
  transition: background 0.2s ease;
}
.menu-idioma .texto-idioma {
  color: var(--color-texto-blanco);
}
.menu-idioma .icono-seleccionado {
  color: var(--color-azul-claro);
}
.menu-idioma .opcion-idioma:hover,
.menu-idioma .opcion-idioma:active {
  background: var(--color-activo-azul) !important;
}
</style>
