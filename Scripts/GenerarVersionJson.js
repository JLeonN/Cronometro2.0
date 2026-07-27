import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const carpetaScript = dirname(fileURLToPath(import.meta.url))
const raizProyecto = resolve(carpetaScript, '..')
const rutaPackageJson = resolve(raizProyecto, 'package.json')
const rutaVersionJson = resolve(raizProyecto, 'public', 'version.json')
const URL_PLAY_STORE_POR_DEFECTO =
  'https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto'
const CODIGOS_IDIOMA = ['es-419', 'en-US']

function leerJson(rutaArchivo, valorPorDefecto) {
  try {
    return JSON.parse(readFileSync(rutaArchivo, 'utf8'))
  } catch {
    return valorPorDefecto
  }
}

const packageJson = leerJson(rutaPackageJson, {})
const versionJsonActual = leerJson(rutaVersionJson, {})
const cambiosActuales =
  versionJsonActual.cambios && typeof versionJsonActual.cambios === 'object'
    ? versionJsonActual.cambios
    : {}
const cambiosPorIdioma = Object.fromEntries(
  CODIGOS_IDIOMA.map((codigoIdioma) => [codigoIdioma, cambiosActuales[codigoIdioma] ?? []]),
)

const versionJsonNuevo = {
  ...versionJsonActual,
  versionDisponible: packageJson.version || versionJsonActual.versionDisponible || '0.0.0',
  urlPlayStore: versionJsonActual.urlPlayStore || URL_PLAY_STORE_POR_DEFECTO,
  mostrarActualizacion:
    typeof versionJsonActual.mostrarActualizacion === 'boolean'
      ? versionJsonActual.mostrarActualizacion
      : false,
  cambios: cambiosPorIdioma,
}

writeFileSync(rutaVersionJson, `${JSON.stringify(versionJsonNuevo, null, 2)}\n`, 'utf8')
