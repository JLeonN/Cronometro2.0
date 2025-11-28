import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob'
import { ADMOB_IDS, ES_PRODUCCION } from '../constants/admob'

class AdMobRewardedInterstitialService {
  constructor() {
    this.anuncioListo = false
    this.anuncioCargando = false
  }

  /**
   * Prepara el anuncio Rewarded Interstitial
   */
  async prepararAnuncio() {
    if (this.anuncioCargando || this.anuncioListo) {
      console.log('⏳ Anuncio ya está cargando o listo')
      return
    }

    try {
      this.anuncioCargando = true
      console.log('🔄 Preparando Rewarded Interstitial...')

      await AdMob.prepareRewardVideoAd({
        adId: ADMOB_IDS.rewardedInterstitial,
        isTesting: !ES_PRODUCCION,
      })

      this.anuncioListo = true
      this.anuncioCargando = false
      console.log('✅ Rewarded Interstitial listo')
    } catch (error) {
      this.anuncioCargando = false
      this.anuncioListo = false
      console.error('❌ Error al preparar Rewarded Interstitial:', error)
    }
  }

  /**
   * Muestra el anuncio Rewarded Interstitial
   * @returns {Promise<boolean>} true si se mostró correctamente
   */
  async mostrarAnuncio() {
    if (!this.anuncioListo) {
      console.log('⚠️ Anuncio no está listo. Preparando...')
      await this.prepararAnuncio()
    }

    try {
      console.log('📺 Mostrando Rewarded Interstitial...')

      // Escuchar eventos del anuncio
      this.escucharEventos()

      await AdMob.showRewardVideoAd()

      // Preparar el siguiente anuncio
      this.anuncioListo = false
      this.prepararAnuncio()

      return true
    } catch (error) {
      console.error('❌ Error al mostrar Rewarded Interstitial:', error)
      this.anuncioListo = false
      return false
    }
  }

  /**
   * Escuchar eventos del anuncio
   */
  escucharEventos() {
    // Cuando el usuario ve el video completo
    AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
      console.log('🎁 Usuario completó el video:', reward)
    })

    // Cuando el anuncio se cierra
    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log('🚪 Anuncio cerrado')
    })

    // Cuando falla el anuncio
    AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error) => {
      console.error('❌ Error al mostrar anuncio:', error)
    })
  }

  /**
   * Limpiar listeners
   */
  limpiarListeners() {
    AdMob.removeAllListeners()
  }
}

// Exportar instancia única (Singleton)
export default new AdMobRewardedInterstitialService()
