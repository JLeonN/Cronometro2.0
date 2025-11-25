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
  // Banner adaptativo
  banner: 'ca-app-pub-3940256099942544/9214589741',

  // Para futuro (interstitial, rewarded, etc.)
  intersticial: 'ca-app-pub-3940256099942544/1033173712',
  recompensado: 'ca-app-pub-3940256099942544/5224354917',
}

// ============================================
// IDs DE PRODUCCIÓN
// ============================================
const IDS_PRODUCCION = {
  // Banner adaptativo
  banner: 'TU_ID_REAL_DE_BANNER_AQUI',

  // Para futuro
  intersticial: 'TU_ID_REAL_DE_INTERSTICIAL_AQUI',
  recompensado: 'TU_ID_REAL_DE_RECOMPENSADO_AQUI',
}

// ============================================
// EXPORTACIÓN DINÁMICA
// ============================================
export const ADMOB_IDS = ES_PRODUCCION ? IDS_PRODUCCION : IDS_PRUEBA

// ============================================
// CONFIGURACIÓN DEL BANNER
// ============================================
export const BANNER_CONFIG = {
  // Posición: 'TOP_CENTER' | 'CENTER' | 'BOTTOM_CENTER'
  posicion: 'BOTTOM_CENTER',

  // Tamaño: true = adaptativo (recomendado) | false = estándar
  adaptativo: true,

  // Margen extra en píxeles (opcional)
  margenInferior: 0,
}
