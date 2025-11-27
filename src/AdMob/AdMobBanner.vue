<template>
  <div v-if="bannerVisible" class="admob-banner-container">
    <!-- Espaciador dinámico según el tamaño del banner -->
    <div class="banner-spacer" :style="{ height: alturaBanner }"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'
import {
  ADMOB_IDS,
  BANNER_GRANDE_CONFIG,
  BANNER_CHICO_CONFIG,
  ES_PRODUCCION,
} from '../constants/admob'
import { useCronometroStore } from 'src/stores/cronometro'

const cronometroStore = useCronometroStore()

// Estado del banner
const bannerVisible = ref(false)
const bannerActual = ref(null) // 'grande' o 'chico'

// Altura dinámica del espaciador
const alturaBanner = computed(() => {
  if (bannerActual.value === 'grande') return '250px' // MEDIUM_RECTANGLE
  if (bannerActual.value === 'chico') return '50px' // BANNER
  return '0px'
})

// Determinar qué banner mostrar según el estado
const tipoDebannerRequerido = computed(() => {
  if (cronometroStore.estadoCronometro === 'detenido') {
    return 'grande'
  } else if (
    cronometroStore.estadoCronometro === 'corriendo' ||
    cronometroStore.estadoCronometro === 'pausado'
  ) {
    return 'chico'
  }
  return null
})

// Inicializar AdMob al montar el componente
onMounted(async () => {
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ES_PRODUCCION ? [] : ['YOUR_DEVICE_ID'],
      initializeForTesting: !ES_PRODUCCION,
    })

    console.log('✅ AdMob inicializado correctamente')

    // Mostrar el banner inicial
    await cambiarBanner(tipoDebannerRequerido.value)
  } catch (error) {
    console.error('❌ Error al inicializar AdMob:', error)
  }
})

// Observar cambios en el estado del cronómetro
watch(tipoDebannerRequerido, async (nuevoTipo) => {
  await cambiarBanner(nuevoTipo)
})

// Función para cambiar el banner
async function cambiarBanner(tipo) {
  if (!tipo) {
    await ocultarBanner()
    return
  }

  // Si ya está mostrando el banner correcto, no hacer nada
  if (bannerActual.value === tipo) {
    return
  }

  try {
    // Ocultar el banner actual si existe
    if (bannerActual.value) {
      await AdMob.hideBanner()
      // IMPORTANTE: Delay para que AdMob procese el cambio
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Mostrar el nuevo banner
    if (tipo === 'grande') {
      await mostrarBannerGrande()
    } else if (tipo === 'chico') {
      await mostrarBannerChico()
    }

    bannerActual.value = tipo
    console.log(`✅ Banner ${tipo} mostrado`)
  } catch (error) {
    console.error(`❌ Error al cambiar a banner ${tipo}:`, error)
  }
}

// Mostrar banner GRANDE (300x250)
async function mostrarBannerGrande() {
  const opciones = {
    adId: ADMOB_IDS.bannerMedio,
    adSize: BannerAdSize.MEDIUM_RECTANGLE,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: BANNER_GRANDE_CONFIG.margenInferior,
    isTesting: !ES_PRODUCCION,
  }

  await AdMob.showBanner(opciones)
  bannerVisible.value = true
}

// Mostrar banner CHICO (320x50)
async function mostrarBannerChico() {
  const opciones = {
    adId: ADMOB_IDS.banner,
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: BANNER_CHICO_CONFIG.margenInferior,
    isTesting: !ES_PRODUCCION,
  }

  await AdMob.showBanner(opciones)
  bannerVisible.value = true
}

// Ocultar banner
async function ocultarBanner() {
  try {
    await AdMob.hideBanner()
    bannerVisible.value = false
    bannerActual.value = null
    console.log('✅ Banner ocultado')
  } catch (error) {
    console.error('❌ Error al ocultar banner:', error)
  }
}

// Limpiar al desmontar
onUnmounted(async () => {
  await ocultarBanner()
})
</script>

<style scoped>
.admob-banner-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
}

/* Espaciador dinámico según el tamaño del banner */
.banner-spacer {
  width: 100%;
  background: transparent;
  transition: height 0.3s ease;
}
</style>
