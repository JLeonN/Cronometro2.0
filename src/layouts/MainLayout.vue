<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header-personalizado">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="alternarDrawerIzquierdo" />

        <q-toolbar-title class="titulo-centrado">
          <q-avatar size="32px">
            <img src="/favicon.ico" alt="Cronómetro" />
          </q-avatar>
          Cronómetro
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerIzquierdoAbierto"
      side="left"
      behavior="mobile"
      elevated
      class="drawer-personalizado"
    >
      <q-list>
        <!-- Encabezado del drawer -->
        <q-item-label header class="text-weight-bold">
          {{ $t('configuracion.titulo') }}
        </q-item-label>

        <q-separator />

        <!-- Sección de idioma -->
        <q-item>
          <q-item-section avatar>
            <q-icon class="ti ti-language" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ $t('configuracion.idioma.titulo') }}</q-item-label>
            <q-item-label caption>{{ $t('configuracion.idioma.descripcion') }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Selector de idioma -->
        <q-item>
          <q-item-section>
            <q-select
              v-model="idiomaSeleccionado"
              :options="opcionesIdioma"
              emit-value
              map-options
              outlined
              dense
              @update:model-value="cambiarIdioma"
            />
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Sección de sonido (para el futuro) -->
        <q-item>
          <q-item-section avatar>
            <q-icon class="ti ti-volume" color="grey" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ $t('configuracion.sonido.titulo') }}</q-item-label>
            <q-item-label caption>{{ $t('configuracion.sonido.descripcion') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfiguracionStore } from 'src/stores/configuracion'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const { t, locale } = useI18n()
const configuracionStore = useConfiguracionStore()

const drawerIzquierdoAbierto = ref(false)

const idiomaSeleccionado = computed({
  get: () => configuracionStore.idiomaActual,
  set: (valor) => valor,
})

const opcionesIdioma = computed(() => [
  { label: t('configuracion.idioma.espanol'), value: 'es-419' },
  { label: t('configuracion.idioma.ingles'), value: 'en-US' },
])

function alternarDrawerIzquierdo() {
  drawerIzquierdoAbierto.value = !drawerIzquierdoAbierto.value
}

async function cambiarIdioma(nuevoIdioma) {
  await configuracionStore.guardarIdioma(nuevoIdioma)
  locale.value = nuevoIdioma

  $q.notify({
    message: t('notificaciones.idiomaCambiado'),
    color: 'positive',
    icon: 'ti ti-check',
    position: 'top',
  })
}
</script>

<style scoped>
.header-personalizado {
  background: var(--color-azul-oscuro);
}
.titulo-centrado {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-texto-blanco);
  font-weight: 600;
  position: relative;
}
.titulo-centrado .q-avatar {
  position: absolute;
  left: 0;
}
</style>
<style>
.drawer-personalizado {
  background: linear-gradient(
    to bottom,
    var(--color-azul-suave),
    var(--color-fondo-blanco)
  ) !important;
}
</style>
