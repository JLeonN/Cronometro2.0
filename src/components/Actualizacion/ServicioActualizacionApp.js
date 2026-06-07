const URL_PLAY_STORE_POR_DEFECTO =
  process.env.URL_PLAY_STORE ||
  'https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto'
const URL_VERSION_REMOTA = process.env.URL_VERSION_REMOTA || '/version.json'
const VERSION_INSTALADA = process.env.VERSION_APP || '0.0.0'
const TIEMPO_MAXIMO_CONSULTA_MS = 8000

export function crearEstadoSinActualizacion() {
  return {
    hayActualizacion: false,
    versionInstalada: VERSION_INSTALADA,
    versionDisponible: VERSION_INSTALADA,
    urlPlayStore: URL_PLAY_STORE_POR_DEFECTO,
    cambios: [],
  }
}

function compararVersiones(versionActual, versionDisponible) {
  const segmentosActuales = String(versionActual || '0')
    .split('.')
    .map((segmento) => Number.parseInt(segmento, 10) || 0)
  const segmentosDisponibles = String(versionDisponible || '0')
    .split('.')
    .map((segmento) => Number.parseInt(segmento, 10) || 0)
  const cantidadSegmentos = Math.max(segmentosActuales.length, segmentosDisponibles.length)

  for (let indice = 0; indice < cantidadSegmentos; indice += 1) {
    const segmentoActual = segmentosActuales[indice] || 0
    const segmentoDisponible = segmentosDisponibles[indice] || 0

    if (segmentoDisponible > segmentoActual) {
      return 1
    }

    if (segmentoDisponible < segmentoActual) {
      return -1
    }
  }

  return 0
}

export function normalizarCambios(cambios) {
  if (!Array.isArray(cambios)) {
    return []
  }

  return cambios
    .map((grupo) => {
      if (typeof grupo === 'string') {
        const novedad = grupo.trim()
        return novedad ? { apartado: '', novedades: [novedad] } : null
      }

      if (!grupo || typeof grupo !== 'object' || !Array.isArray(grupo.novedades)) {
        return null
      }

      const novedades = grupo.novedades
        .filter((novedad) => typeof novedad === 'string')
        .map((novedad) => novedad.trim())
        .filter(Boolean)

      if (novedades.length === 0) {
        return null
      }

      return {
        apartado: typeof grupo.apartado === 'string' ? grupo.apartado.trim() : '',
        novedades,
      }
    })
    .filter(Boolean)
}

export async function obtenerEstadoActualizacion() {
  const controlador = new AbortController()
  const timeoutConsulta = window.setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_CONSULTA_MS)

  try {
    const respuesta = await fetch(URL_VERSION_REMOTA, {
      cache: 'no-store',
      signal: controlador.signal,
    })

    if (!respuesta.ok) {
      return crearEstadoSinActualizacion()
    }

    const versionRemota = await respuesta.json()
    const versionDisponible = String(versionRemota.versionDisponible || '').trim()
    const mostrarActualizacion = versionRemota.mostrarActualizacion === true
    const hayVersionMayor = compararVersiones(VERSION_INSTALADA, versionDisponible) > 0

    if (!mostrarActualizacion || !versionDisponible || !hayVersionMayor) {
      return crearEstadoSinActualizacion()
    }

    return {
      hayActualizacion: true,
      versionInstalada: VERSION_INSTALADA,
      versionDisponible,
      urlPlayStore: versionRemota.urlPlayStore || URL_PLAY_STORE_POR_DEFECTO,
      cambios: normalizarCambios(versionRemota.cambios),
    }
  } catch {
    return crearEstadoSinActualizacion()
  } finally {
    window.clearTimeout(timeoutConsulta)
  }
}

export function abrirActualizacionEnTienda(urlPlayStore) {
  const urlDestino = urlPlayStore || URL_PLAY_STORE_POR_DEFECTO
  const ventana = window.open(urlDestino, '_blank', 'noopener,noreferrer')

  if (!ventana) {
    window.location.href = urlDestino
  }
}
