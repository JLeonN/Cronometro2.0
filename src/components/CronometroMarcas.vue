<template>
  <div class="cronometro-marcas">
    <!-- Encabezado con botón de eliminar todas -->
    <div v-if="cronometroStore.totalMarcas > 0" class="marcas-encabezado">
      <div class="marcas-titulo">{{ $t('cronometro.marcas.titulo') }}</div>
      <q-btn
        flat
        dense
        round
        icon="ti ti-trash"
        color="negative"
        size="sm"
        @click="confirmarEliminarTodas"
      >
        <q-tooltip>{{ $t('cronometro.marcas.eliminarTodas') }}</q-tooltip>
      </q-btn>
    </div>

    <!-- Lista de marcas -->
    <q-list v-if="cronometroStore.totalMarcas > 0" class="lista-marcas">
      <q-slide-item
        v-for="marca in cronometroStore.marcas"
        :key="marca.id"
        right-color="negative"
        @right="({ reset }) => confirmarEliminarMarca(marca.id, reset)"
      >
        <template #right>
          <div class="slide-accion">
            <q-icon name="ti ti-trash" />
          </div>
        </template>

        <q-item class="marca-item">
          <!-- Badge con número de marca -->
          <q-item-section avatar>
            <q-avatar color="positive" text-color="white" size="32px">
              {{ marca.numero }}
            </q-avatar>
          </q-item-section>

          <!-- Tiempo de la marca -->
          <q-item-section>
            <q-item-label class="marca-tiempo">
              {{ cronometroStore.formatearTiempo(marca.tiempoMarca) }}
            </q-item-label>
          </q-item-section>

          <!-- Intervalo entre marcas -->
          <q-item-section side>
            <q-item-label class="marca-intervalo">
              {{ cronometroStore.formatearTiempo(marca.intervalo) }}
            </q-item-label>
            <q-item-label caption class="marca-intervalo-label">
              {{ $t('cronometro.marcas.intervalo') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>

    <!-- Mensaje cuando no hay marcas -->
    <div v-else class="sin-marcas">
      <q-icon name="ti ti-clock-off" size="3rem" color="grey-5" />
      <div class="sin-marcas-texto">{{ $t('cronometro.marcas.sinMarcas') }}</div>
    </div>
  </div>
</template>

<script setup>
import { useCronometroStore } from 'src/stores/cronometro'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
// import { nextTick } from 'vue'

const cronometroStore = useCronometroStore()
const { t } = useI18n()
const $q = useQuasar()

// ========================================
// FUNCIONES
// ========================================
function confirmarEliminarTodas() {
  $q.dialog({
    title: t('cronometro.marcas.confirmarEliminarTodas.titulo'),
    message: t('cronometro.marcas.confirmarEliminarTodas.mensaje'),
    cancel: {
      flat: true,
      label: t('cronometro.marcas.confirmarEliminarTodas.cancelar'),
    },
    ok: {
      flat: true,
      label: t('cronometro.marcas.confirmarEliminarTodas.confirmar'),
      color: 'negative',
    },
    persistent: true,
  }).onOk(() => {
    cronometroStore.eliminarTodasLasMarcas()
    mostrarNotificacionEliminacion(t('cronometro.marcas.todasEliminadas'))
  })
}

function confirmarEliminarMarca(idMarca, reset) {
  $q.dialog({
    title: t('cronometro.marcas.confirmarEliminarMarca.titulo'),
    message: t('cronometro.marcas.confirmarEliminarMarca.mensaje'),
    cancel: {
      flat: true,
      label: t('cronometro.marcas.confirmarEliminarMarca.cancelar'),
    },
    ok: {
      flat: true,
      label: t('cronometro.marcas.confirmarEliminarMarca.confirmar'),
      color: 'negative',
    },
    persistent: true,
  })
    .onOk(() => {
      cronometroStore.eliminarMarca(idMarca)
      mostrarNotificacionEliminacion(t('cronometro.marcas.marcaEliminada'))
    })
    .onCancel(() => {
      reset()
    })
    .onDismiss(() => {
      reset()
    })
}

function mostrarNotificacionEliminacion(mensaje) {
  $q.notify({
    message: mensaje,
    color: 'negative',
    icon: 'ti ti-trash',
    position: 'top',
    timeout: 1500,
  })
}
</script>

<style scoped>
.cronometro-marcas {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-fondo-blanco);
  border-radius: 24px 24px 0 0;
  padding: 1.5rem 0 0.75rem 0;
  box-shadow: var(--sombra-fuerte);
  /* permitir que la tarjeta blanca se solape con la sección superior */
  overflow: visible;
}
.marcas-encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid var(--color-borde-suave);
}
.marcas-titulo {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-texto-principal);
}
.lista-marcas {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}
.marca-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-borde-suave);
  transition: background-color 0.2s ease;
}
.marca-item:hover {
  background-color: var(--color-hover-azul);
}
.marca-tiempo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-texto-principal);
  font-variant-numeric: tabular-nums;
}
.marca-intervalo {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-azul-medio);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.marca-intervalo-label {
  font-size: 0.75rem;
  color: var(--color-texto-terciario);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: right;
  margin-top: 0.125rem;
}
.slide-accion {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 1.5rem;
}
.sin-marcas {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1.5rem;
}
.sin-marcas-texto {
  font-size: 1rem;
  color: var(--color-texto-terciario);
  text-align: center;
}
/* Scroll suave */
.lista-marcas::-webkit-scrollbar {
  width: 4px;
}
.lista-marcas::-webkit-scrollbar-track {
  background: transparent;
}
.lista-marcas::-webkit-scrollbar-thumb {
  background: var(--color-borde-medio);
  border-radius: 2px;
}
</style>
