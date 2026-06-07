import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const carpetaScript = dirname(fileURLToPath(import.meta.url))
const raizProyecto = resolve(carpetaScript, '..')
const rutaPackageJson = resolve(raizProyecto, 'package.json')
const rutaVersionJson = resolve(raizProyecto, 'public', 'version.json')
const URL_PLAY_STORE_POR_DEFECTO =
  'https://play.google.com/store/apps/details?id=com.yojorge.Nombredemiproyecto'

function leerJson(rutaArchivo, valorPorDefecto) {
  try {
    return JSON.parse(readFileSync(rutaArchivo, 'utf8'))
  } catch {
    return valorPorDefecto
  }
}

const packageJson = leerJson(rutaPackageJson, {})
const versionJsonActual = leerJson(rutaVersionJson, {})
const cambiosActuales = Array.isArray(versionJsonActual.cambios) ? versionJsonActual.cambios : []

const versionJsonNuevo = {
  ...versionJsonActual,
  versionDisponible: packageJson.version || versionJsonActual.versionDisponible || '0.0.0',
  urlPlayStore: versionJsonActual.urlPlayStore || URL_PLAY_STORE_POR_DEFECTO,
  mostrarActualizacion:
    typeof versionJsonActual.mostrarActualizacion === 'boolean'
      ? versionJsonActual.mostrarActualizacion
      : false,
  cambios: cambiosActuales,
}

writeFileSync(rutaVersionJson, `${JSON.stringify(versionJsonNuevo, null, 2)}\n`, 'utf8')
