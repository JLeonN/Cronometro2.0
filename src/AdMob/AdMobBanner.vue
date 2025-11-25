<template>
  <div v-if="bannerVisible" class="admob-banner-container">
    <!-- Espaciador invisible para que el contenido no quede tapado -->
    <div class="banner-spacer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'
import { ADMOB_IDS, BANNER_CONFIG, ES_PRODUCCION } from '../constants/admob'

// Estado del banner
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
    await mostrarBanner()
  } catch (error) {
    console.error('❌ Error al inicializar AdMob:', error)
  }
})

// Mostrar el banner
async function mostrarBanner() {
  try {
    const opciones = {
      adId: ADMOB_IDS.banner,
      adSize: BANNER_CONFIG.adaptativo ? BannerAdSize.ADAPTIVE_BANNER : BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: BANNER_CONFIG.margenInferior,
      isTesting: !ES_PRODUCCION,
    }

    await AdMob.showBanner(opciones)
    bannerVisible.value = true

    console.log('✅ Banner mostrado:', ES_PRODUCCION ? 'PRODUCCIÓN' : 'PRUEBA')
  } catch (error) {
    console.error('❌ Error al mostrar banner:', error)
  }
}

// Ocultar banner al desmontar el componente
onUnmounted(async () => {
  try {
    await AdMob.hideBanner()
    bannerVisible.value = false
    console.log('✅ Banner ocultado')
  } catch (error) {
    console.error('❌ Error al ocultar banner:', error)
  }
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

/* Espaciador para que el banner no tape contenido */
.banner-spacer {
  height: 50px;
  width: 100%;
  background: transparent;
}
</style>
