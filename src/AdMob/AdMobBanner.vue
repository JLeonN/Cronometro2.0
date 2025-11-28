<template>
  <div v-if="bannerVisible" class="admob-banner-container">
    <!-- Espaciador fijo para el banner -->
    <div class="banner-spacer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'
import { ADMOB_IDS, BANNER_CONFIG, ES_PRODUCCION } from '../constants/admob'

const bannerVisible = ref(false)

// Inicializar AdMob al montar el componente
onMounted(async () => {
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ES_PRODUCCION ? [] : ['YOUR_DEVICE_ID'],
      initializeForTesting: !ES_PRODUCCION,
    })

    console.log('✅ AdMob inicializado correctamente')

    // Mostrar el banner
    await mostrarBanner()
  } catch (error) {
    console.error('❌ Error al inicializar AdMob:', error)
  }
})

// Mostrar banner chico (320x50)
async function mostrarBanner() {
  try {
    const opciones = {
      adId: ADMOB_IDS.banner,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: BANNER_CONFIG.margenInferior,
      isTesting: !ES_PRODUCCION,
    }

    await AdMob.showBanner(opciones)
    bannerVisible.value = true
    console.log('✅ Banner 320x50 mostrado')
  } catch (error) {
    console.error('❌ Error al mostrar banner:', error)
  }
}

// Ocultar banner
async function ocultarBanner() {
  try {
    await AdMob.hideBanner()
    bannerVisible.value = false
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

/* Espaciador fijo de 50px para el banner chico */
.banner-spacer {
  width: 100%;
  height: 50px;
  background: transparent;
}
</style>
