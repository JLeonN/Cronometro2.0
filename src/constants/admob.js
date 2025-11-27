// ============================================
// CONFIGURACIÓN DE ADMOB
// ============================================

/**
 * ⚠️ IMPORTANTE: Cambiar esto a true cuando subas a producción
 */
export const ES_PRODUCCION = false

// ============================================
// IDs DE PRUEBA (Google AdMob)
// ============================================
const IDS_PRUEBA = {
  // Banner adaptativo (abajo de todo)
  banner: 'ca-app-pub-3940256099942544/9214589741',

  // Banner medio (300x250px) - Para cuando está detenido
  bannerMedio: 'ca-app-pub-3940256099942544/9214589741',

  // Para futuro (interstitial, rewarded, etc.)
  intersticial: 'ca-app-pub-3940256099942544/1033173712',
  recompensado: 'ca-app-pub-3940256099942544/5224354917',
}

// ============================================
// IDs DE PRODUCCIÓN
// ============================================
const IDS_PRODUCCION = {
  // Banner adaptativo (abajo de todo)
  banner: 'TU_ID_REAL_DE_BANNER_AQUI',

  // Banner medio (300x250px) - Para cuando está detenido
  bannerMedio: 'TU_ID_REAL_DE_BANNER_MEDIO_AQUI',

  // Para futuro
  intersticial: 'TU_ID_REAL_DE_INTERSTICIAL_AQUI',
  recompensado: 'TU_ID_REAL_DE_RECOMPENSADO_AQUI',
}

// ============================================
// EXPORTACIÓN DINÁMICA
// ============================================
export const ADMOB_IDS = ES_PRODUCCION ? IDS_PRODUCCION : IDS_PRUEBA

// ============================================
// CONFIGURACIÓN DE LOS BANNERS
// ============================================

// Banner GRANDE (cuando cronómetro está detenido)
export const BANNER_GRANDE_CONFIG = {
  adSize: 'MEDIUM_RECTANGLE', // 300x250px
  position: 'BOTTOM_CENTER',
  margenInferior: 0,
}

// Banner CHICO (cuando cronómetro está corriendo/pausado)
export const BANNER_CHICO_CONFIG = {
  adSize: 'BANNER', // 320x50px
  position: 'BOTTOM_CENTER',
  margenInferior: 0,
}
