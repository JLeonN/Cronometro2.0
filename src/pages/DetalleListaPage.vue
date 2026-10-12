<template>
  <q-page class="pagina-detalle">
    <div class="contenido-detalle">
      <header class="encabezado-detalle">
        <q-btn flat round icon="arrow_back" :aria-label="$t('listas.volverListas')" to="/listas" />
        <span>{{ $t('listas.volverListas') }}</span>
      </header>

      <div v-if="listasStore.cargando" class="estado-detalle">
        <q-spinner size="32px" />
        <span>{{ $t('listas.cargando') }}</span>
      </div>
      <div v-else-if="listasStore.errorCarga" class="estado-detalle">
        <p>{{ $t('listas.mensajes.errorCargar') }}</p>
        <q-btn unelevated class="boton-principal" :label="$t('listas.reintentar')" @click="listasStore.cargarListas()" />
      </div>
      <div v-else-if="!lista" class="estado-detalle">
        <p>{{ $t('listas.detalle.noEncontrada') }}</p>
        <q-btn unelevated class="boton-principal" :label="$t('listas.volverListas')" to="/listas" />
      </div>
      <template v-else>
        <div class="resumen-lista">
          <h1>{{ lista.titulo }}</h1>
          <p class="fecha-lista">{{ formatearFecha(lista.fechaCreacion) }}</p>
          <p v-if="lista.descripcion" class="descripcion-lista">{{ lista.descripcion }}</p>
          <p class="cantidad-marcas">{{ $t(lista.marcas.length === 1 ? 'listas.unaMarca' : 'listas.cantidadMarcas', { cantidad: lista.marcas.length }) }}</p>
        </div>

        <div class="marcas-guardadas">
          <div v-for="marca in lista.marcas" :key="marca.id" class="marca-guardada">
            <div class="tiempos-marca">
              <span class="numero-marca">{{ marca.numero }}</span>
              <strong>{{ cronometroStore.formatearTiempo(marca.tiempoMarca) }}</strong>
              <span class="intervalo-marca">+{{ cronometroStore.formatearTiempo(marca.intervalo) }}</span>
            </div>
            <q-input
              v-model="borradoresNotas[marca.id]"
              dark
              outlined
              autogrow
              type="textarea"
              maxlength="300"
              :label="$t('listas.detalle.notaMarca', { numero: marca.numero })"
              :loading="Boolean(guardandoNotas[marca.id])"
              @blur="guardarNota(marca.id)"
            />
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useCronometroStore } from 'src/stores/cronometro'
import { useListasGuardadasStore } from 'src/stores/ListasGuardadas'

const route = useRoute()
const quasar = useQuasar()
const { t, locale } = useI18n()
const cronometroStore = useCronometroStore()
const listasStore = useListasGuardadasStore()
const borradoresNotas = reactive({})
const guardandoNotas = reactive({})
const promesasGuardado = new Map()

const lista = computed(() => listasStore.listas.find((elemento) => elemento.id === route.params.id))

watch(
  () => lista.value?.id,
  () => {
    for (const clave of Object.keys(borradoresNotas)) delete borradoresNotas[clave]
    for (const marca of lista.value?.marcas ?? []) {
      borradoresNotas[marca.id] = marca.nota ?? ''
    }
  },
  { immediate: true },
)

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(new Date(fecha))
}

async function guardarNota(idMarca) {
  if (promesasGuardado.has(idMarca)) {
    const guardadoAnterior = await promesasGuardado.get(idMarca)
    return guardadoAnterior ? guardarNota(idMarca) : false
  }
  const marca = lista.value?.marcas.find((elemento) => elemento.id === idMarca)
  if (!marca) return false
  const nota = (borradoresNotas[idMarca] ?? '').trim()
  if (nota === (marca.nota ?? '')) return true

  guardandoNotas[idMarca] = true
  const promesa = listasStore
    .guardarNotaMarca(lista.value.id, idMarca, nota)
    .then(() => true)
    .catch((error) => {
      console.error('Error al guardar la nota:', error)
      quasar.notify({ type: 'negative', message: t('listas.mensajes.errorNota') })
      return false
    })
    .finally(() => {
      guardandoNotas[idMarca] = false
      promesasGuardado.delete(idMarca)
    })
  promesasGuardado.set(idMarca, promesa)
  return promesa
}

onBeforeRouteLeave(async () => {
  if (!lista.value) return true
  const resultados = await Promise.all(lista.value.marcas.map((marca) => guardarNota(marca.id)))
  return resultados.every(Boolean)
})
</script>

<style scoped>
.pagina-detalle {
  background: var(--fondo-cronometro-principal);
  color: var(--color-texto-blanco);
  min-height: 0 !important;
  height: 100%;
  overflow-y: auto;
}
.contenido-detalle {
  width: min(100%, 600px);
  margin: 0 auto;
  padding: 1rem 1rem calc(1rem + var(--safe-area-inferior));
}
.encabezado-detalle {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1rem;
}
.estado-detalle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 0;
}
.boton-principal {
  background: var(--color-amarillo);
  color: var(--color-texto-sobre-amarillo);
  min-height: 44px;
}
.resumen-lista {
  margin-bottom: 1.25rem;
}
.resumen-lista h1 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.resumen-lista p {
  margin: 0.3rem 0;
  overflow-wrap: anywhere;
}
.fecha-lista,
.cantidad-marcas {
  color: var(--color-azul-claro);
}
.marcas-guardadas {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.marca-guardada {
  border: 1px solid var(--color-azul-claro);
  border-radius: 12px;
  padding: 0.85rem;
  background: var(--color-azul-oscuro);
}
.tiempos-marca {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-variant-numeric: tabular-nums;
}
.tiempos-marca strong {
  font-size: 1.2rem;
}
.numero-marca {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-azul-medio);
}
.intervalo-marca {
  color: var(--color-azul-claro);
  font-weight: 700;
}
</style>
