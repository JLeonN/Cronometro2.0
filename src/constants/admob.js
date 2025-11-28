// ============================================
// CONFIGURACIÓN DE ADMOB
// ============================================

/**
 * ⚠️ IMPORTANTE: Cambiar esto a true cuando subas a producción
 * Para pruebas, dejalo en false
 */
export const ES_PRODUCCION = true

// ============================================
// IDs DE PRUEBA (Google AdMob)
// ============================================
const IDS_PRUEBA = {
  // Banner chico (320x50px) - Siempre visible
  banner: 'ca-app-pub-3940256099942544/9214589741',

  // Para futuro (interstitial, rewarded, etc.)
  intersticial: 'ca-app-pub-3940256099942544/1033173712',
  recompensado: 'ca-app-pub-3940256099942544/5224354917',
}

// ============================================
// IDs DE PRODUCCIÓN (REALES)
// ============================================
const IDS_PRODUCCION = {
  // Banner chico (320x50px) - Siempre visible
  banner: 'ca-app-pub-7620083100302566/3673223523',
}

// ============================================
// EXPORTACIÓN DINÁMICA
// ============================================
export const ADMOB_IDS = ES_PRODUCCION ? IDS_PRODUCCION : IDS_PRUEBA

// ============================================
// CONFIGURACIÓN DEL BANNER
// ============================================
export const BANNER_CONFIG = {
  adSize: 'BANNER', // 320x50px
  position: 'BOTTOM_CENTER',
  margenInferior: 0,
}
