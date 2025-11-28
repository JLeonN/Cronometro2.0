<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header-personalizado">
      <q-toolbar class="toolbar-con-padding">
        <q-btn dense flat round icon="menu" @click="alternarDrawerIzquierdo" />

        <q-toolbar-title class="titulo-centrado">
          <q-avatar size="32px">
            <img src="/icons/Cronometro2.0-512x512.png" alt="Cronómetro" />
          </q-avatar>
          {{ $t('layout.appName') }}
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
      <q-list class="q-pa-md">
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
            <SelectorIdioma />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container :class="clasePaddingBanner">
      <router-view />
    </q-page-container>

    <!-- Banner de AdMob -->
    <AdMobBanner />
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCronometroStore } from 'src/stores/cronometro'
import SelectorIdioma from 'src/components/Idiomas/SelectorIdioma.vue'
import AdMobBanner from 'src/AdMob/AdMobBanner.vue'

const cronometroStore = useCronometroStore()
const drawerIzquierdoAbierto = ref(false)

function alternarDrawerIzquierdo() {
  drawerIzquierdoAbierto.value = !drawerIzquierdoAbierto.value
}

// Padding dinámico según el estado del cronómetro
const clasePaddingBanner = computed(() => {
  if (cronometroStore.estadoCronometro === 'detenido') {
    return 'page-container-banner-grande'
  } else if (
    cronometroStore.estadoCronometro === 'corriendo' ||
    cronometroStore.estadoCronometro === 'pausado'
  ) {
    return 'page-container-banner-chico'
  }
  return 'page-container-sin-banner'
})
</script>

<style scoped>
.header-personalizado {
  background: var(--color-azul-oscuro);
}
.toolbar-con-padding {
  padding-top: 20px;
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
  border-radius: 8px;
  overflow: hidden;
}
/* Padding dinámico según el tamaño del banner */
.page-container-banner-grande {
  padding-bottom: 250px;
  transition: padding-bottom 0.3s ease;
}
.page-container-banner-chico {
  padding-bottom: 50px;
  transition: padding-bottom 0.3s ease;
}
.page-container-sin-banner {
  padding-bottom: 0;
  transition: padding-bottom 0.3s ease;
}
.drawer-personalizado {
  background: linear-gradient(
    to bottom,
    var(--fondo-degradado-intenso-top),
    var(--fondo-degradado-intenso-bottom)
  ) !important;
  padding: 20px;
}
</style>
