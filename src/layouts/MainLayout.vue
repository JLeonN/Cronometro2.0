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

        <q-item v-if="hayActualizacionDisponible" clickable @click="mostrarModalActualizacion = true">
          <q-item-section avatar>
            <q-icon name="system_update" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ $t('actualizacion.indicador') }}</q-item-label>
            <q-item-label caption>
              {{ $t('actualizacion.versionDisponible') }} {{ versionDisponible }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator v-if="hayActualizacionDisponible" />

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

    <q-dialog v-model="mostrarModalActualizacion">
      <q-card class="modal-actualizacion">
        <q-card-section class="modal-actualizacion-encabezado">
          <div class="text-h6">{{ $t('actualizacion.titulo') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="versiones-actualizacion">
            <div>
              <span class="texto-version">{{ $t('actualizacion.versionInstalada') }}</span>
              <strong>{{ versionInstalada }}</strong>
            </div>
            <div>
              <span class="texto-version">{{ $t('actualizacion.versionDisponible') }}</span>
              <strong>{{ versionDisponible }}</strong>
            </div>
          </div>

          <q-banner dense class="aviso-actualizacion">
            {{ $t('actualizacion.avisoPlayStore') }}
          </q-banner>

          <!-- Notas de parche: cargar desde version.json como grupos con apartado y novedades. -->
          <!-- La IA debe agrupar las novedades con subtítulos según los apartados afectados de la app. -->
          <!-- Si una mejora es compartida, nombrar todos los apartados afectados antes de describirla. -->
          <!-- Usar texto corto y claro; Leo decide qué líneas conservar antes de publicar. -->
          <div v-if="cambiosActualizacion.length" class="novedades-actualizacion">
            <div class="text-subtitle2">{{ $t('actualizacion.novedades') }}</div>
            <div
              v-for="grupoCambio in cambiosActualizacion"
              :key="`${grupoCambio.apartado}-${grupoCambio.novedades.join('|')}`"
              class="grupo-novedades"
            >
              <div v-if="grupoCambio.apartado" class="apartado-novedades">
                {{ grupoCambio.apartado }}
              </div>
              <ul class="lista-novedades">
                <li v-for="novedad in grupoCambio.novedades" :key="novedad">
                  {{ novedad }}
                </li>
              </ul>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="primary" :label="$t('actualizacion.cancelar')" v-close-popup />
          <q-btn color="primary" :label="$t('actualizacion.actualizar')" @click="irAPlayStore" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Banner de AdMob -->
    <AdMobBanner />
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCronometroStore } from 'src/stores/cronometro'
import SelectorIdioma from 'src/components/Idiomas/SelectorIdioma.vue'
import AdMobBanner from 'src/AdMob/AdMobBanner.vue'
import {
  abrirActualizacionEnTienda,
  obtenerEstadoActualizacion,
} from 'src/components/Actualizacion/ServicioActualizacionApp'

const cronometroStore = useCronometroStore()
const drawerIzquierdoAbierto = ref(false)
const hayActualizacionDisponible = ref(false)
const mostrarModalActualizacion = ref(false)
const versionDisponible = ref('')
const versionInstalada = ref('')
const urlPlayStoreActualizacion = ref('')
const cambiosActualizacion = ref([])

function alternarDrawerIzquierdo() {
  drawerIzquierdoAbierto.value = !drawerIzquierdoAbierto.value
}

async function verificarActualizacion() {
  const estadoActualizacion = await obtenerEstadoActualizacion()

  hayActualizacionDisponible.value = estadoActualizacion.hayActualizacion
  mostrarModalActualizacion.value = estadoActualizacion.hayActualizacion
  versionDisponible.value = estadoActualizacion.versionDisponible
  versionInstalada.value = estadoActualizacion.versionInstalada
  urlPlayStoreActualizacion.value = estadoActualizacion.urlPlayStore
  cambiosActualizacion.value = estadoActualizacion.cambios
}

function irAPlayStore() {
  abrirActualizacionEnTienda(urlPlayStoreActualizacion.value)
}

onMounted(() => {
  verificarActualizacion()
})

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
.modal-actualizacion {
  width: min(92vw, 420px);
}
.modal-actualizacion-encabezado {
  color: var(--color-texto-principal);
}
.versiones-actualizacion {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}
.texto-version {
  display: block;
  color: var(--color-texto-secundario);
  font-size: 12px;
}
.aviso-actualizacion {
  background: var(--color-info-claro);
  color: var(--color-texto-principal);
  border-radius: 8px;
  margin-bottom: 14px;
}
.novedades-actualizacion {
  color: var(--color-texto-principal);
}
.grupo-novedades {
  margin-top: 10px;
}
.apartado-novedades {
  color: var(--color-azul-oscuro);
  font-weight: 600;
  margin-bottom: 4px;
}
.lista-novedades {
  margin: 0;
  padding-left: 18px;
  color: var(--color-texto-secundario);
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
</style>
<style>
.drawer-personalizado {
  background: linear-gradient(
    to bottom,
    var(--fondo-degradado-intenso-top),
    var(--fondo-degradado-intenso-bottom)
  ) !important;
  padding: 20px;
}
</style>
