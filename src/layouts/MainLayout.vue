<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header-personalizado">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="alternarDrawerIzquierdo" />

        <q-toolbar-title class="titulo-centrado">
          <q-avatar size="32px">
            <img src="/favicon.ico" alt="Cronómetro" />
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
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
    var(--fondo-degradado-intenso-top),
    var(--fondo-degradado-intenso-bottom)
  ) !important;
}
</style>
