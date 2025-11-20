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
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

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
    var(--color-azul-suave),
    var(--color-fondo-blanco)
  ) !important;
}
</style>
