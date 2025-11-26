<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header-personalizado">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="alternarDrawerIzquierdo" />

        <q-toolbar-title class="titulo-centrado">
          <q-avatar size="28px" class="avatar-icono-personalizado">
            <img src="public/icons/Cronometro2.0-512x512.png" alt="Cronómetro" />
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
            <SelectorIdioma />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="page-container-con-banner">
      <router-view />
    </q-page-container>

    <!-- Banner de AdMob -->
    <AdMobBanner />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import AdMobBanner from 'src/AdMob/AdMobBanner.vue'
import SelectorIdioma from 'src/components/SelectorIdioma.vue'

const drawerIzquierdoAbierto = ref(false)

function alternarDrawerIzquierdo() {
  drawerIzquierdoAbierto.value = !drawerIzquierdoAbierto.value
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
  padding-top: 20px;
}
.titulo-centrado .q-avatar {
  position: absolute;
  left: 0;
}
/* Padding inferior para que el banner no tape contenido */
.page-container-con-banner {
  padding-bottom: 50px;
}
.drawer-personalizado {
  background: linear-gradient(
    to bottom,
    var(--fondo-degradado-intenso-top),
    var(--fondo-degradado-intenso-bottom)
  ) !important;
}
.text-weight-bold {
  padding-top: 20px;
}
.header-personalizado .q-btn {
  margin-top: 20px;
}
.avatar-icono-personalizado {
  overflow: hidden;
  border-radius: 8px;
}
</style>
