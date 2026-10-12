<template>
  <q-page class="pagina-listas">
    <div class="contenido-listas">
      <header class="encabezado-listas">
        <q-btn flat round icon="arrow_back" :aria-label="$t('listas.volverCronometro')" to="/" />
        <h1>{{ $t('listas.menu') }}</h1>
      </header>

      <div v-if="listasStore.cargando" class="estado-listas">
        <q-spinner size="32px" />
        <span>{{ $t('listas.cargando') }}</span>
      </div>
      <div v-else-if="listasStore.errorCarga" class="estado-listas">
        <p>{{ $t('listas.mensajes.errorCargar') }}</p>
        <q-btn unelevated class="boton-principal" :label="$t('listas.reintentar')" @click="listasStore.cargarListas()" />
      </div>
      <div v-else-if="listasStore.totalListas === 0" class="estado-vacio">
        <h2>{{ $t('listas.vacio.titulo') }}</h2>
        <p>{{ $t('listas.vacio.descripcion') }}</p>
        <q-btn unelevated class="boton-principal" :label="$t('listas.volverCronometro')" to="/" />
        <div class="tutorial-listas">
          <h3>{{ $t('listas.vacio.tutorialTitulo') }}</h3>
          <p>{{ $t('listas.vacio.tutorialPasos') }}</p>
          <p>{{ $t('listas.vacio.ejemploGimnasio') }}</p>
          <p>{{ $t('listas.vacio.ejemploDistancias') }}</p>
        </div>
      </div>
      <q-list v-else class="listado-listas">
        <q-slide-item
          v-for="lista in listasStore.listas"
          :key="lista.id"
          right-color="transparent"
          class="lista-deslizable"
          @right="({ reset }) => eliminarLista(lista.id, reset)"
        >
          <template #right>
            <div class="accion-deslizar">
              <IconTrashX :size="26" :stroke="2" />
            </div>
          </template>
          <div class="tarjeta-lista">
            <router-link class="enlace-lista" :to="`/listas/${lista.id}`">
              <strong>{{ lista.titulo }}</strong>
              <span class="metadatos-lista">
                {{ formatearFecha(lista.fechaCreacion) }} · {{ $t(lista.marcas.length === 1 ? 'listas.unaMarca' : 'listas.cantidadMarcas', { cantidad: lista.marcas.length }) }}
              </span>
              <span v-if="lista.descripcion" class="descripcion-lista">{{ lista.descripcion }}</span>
            </router-link>
            <q-btn
              flat
              round
              class="boton-borrar"
              :aria-label="$t('listas.eliminarLista', { titulo: lista.titulo })"
              :disable="eliminandoId === lista.id"
              @click="eliminarLista(lista.id)"
            >
              <IconTrashX :size="22" :stroke="2" />
            </q-btn>
          </div>
        </q-slide-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { IconTrashX } from '@tabler/icons-vue'
import { useListasGuardadasStore } from 'src/stores/ListasGuardadas'

const quasar = useQuasar()
const { t, locale } = useI18n()
const listasStore = useListasGuardadasStore()
const eliminandoId = ref(null)

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(new Date(fecha))
}

async function eliminarLista(idLista, reset) {
  if (eliminandoId.value) {
    reset?.()
    return
  }
  eliminandoId.value = idLista
  try {
    await listasStore.eliminarLista(idLista)
    quasar.notify({ type: 'positive', message: t('listas.mensajes.eliminada') })
  } catch (error) {
    console.error('Error al eliminar la lista:', error)
    reset?.()
    quasar.notify({ type: 'negative', message: t('listas.mensajes.errorEliminar') })
  } finally {
    eliminandoId.value = null
  }
}
</script>

<style scoped>
.pagina-listas {
  background: var(--fondo-cronometro-principal);
  color: var(--color-texto-blanco);
  min-height: 0 !important;
  height: 100%;
  overflow-y: auto;
}
.contenido-listas {
  width: min(100%, 600px);
  margin: 0 auto;
  padding: 1rem 1rem calc(1rem + var(--safe-area-inferior));
}
.encabezado-listas {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.encabezado-listas h1 {
  font-size: 1.35rem;
  line-height: 1.3;
  margin: 0;
  font-weight: 700;
}
.estado-listas,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 0.25rem;
}
.estado-vacio h2,
.tutorial-listas h3 {
  margin: 0;
  font-size: 1.1rem;
}
.estado-vacio p,
.tutorial-listas p {
  margin: 0;
}
.boton-principal {
  background: var(--color-amarillo);
  color: var(--color-texto-sobre-amarillo);
  min-height: 44px;
}
.tutorial-listas {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--color-azul-claro);
  border-radius: 12px;
}
.listado-listas {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.lista-deslizable {
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
}
.tarjeta-lista {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-azul-claro);
  border-radius: 12px;
  background: var(--color-azul-oscuro);
}
.enlace-lista {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.85rem;
  color: var(--color-texto-blanco);
  text-decoration: none;
}
.enlace-lista strong,
.descripcion-lista {
  overflow-wrap: anywhere;
}
.metadatos-lista {
  color: var(--color-azul-claro);
  font-size: 0.8rem;
}
.descripcion-lista {
  font-size: 0.85rem;
}
.boton-borrar {
  color: var(--color-error);
  margin-right: 0.35rem;
}
.accion-deslizar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1.5rem;
  background: var(--color-error);
  color: var(--color-texto-blanco);
}
</style>
