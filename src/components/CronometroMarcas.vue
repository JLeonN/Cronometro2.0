<template>
  <div class="cronometro-marcas">
    <!-- Encabezado con botón de eliminar todas -->
    <div v-if="cronometroStore.totalMarcas > 0" class="marcas-encabezado">
      <div class="marcas-titulo">{{ $t('cronometro.marcas.titulo') }}</div>

      <q-btn flat dense round class="boton-eliminar" size="sm" @click="confirmarEliminarTodas">
        <component :is="IconTrash" :stroke="2" size="20" />
        <q-tooltip>{{ $t('cronometro.marcas.eliminarTodas') }}</q-tooltip>
      </q-btn>
    </div>

    <!-- Lista de marcas -->
    <q-list v-if="cronometroStore.totalMarcas > 0" class="lista-marcas">
      <q-slide-item
        v-for="marca in cronometroStore.marcas"
        :key="marca.id"
        class="slide-marca"
        right-color="transparent"
        @right="({ reset }) => confirmarEliminarMarca(marca.id, reset)"
      >
        <template #right>
          <div class="slide-accion">
            <component :is="IconTrashX" color="white" :stroke="2" size="24" />
          </div>
        </template>

        <div class="marca-item">
          <div class="marca-indice">
            <span class="numero">{{ marca.numero }}</span>
          </div>

          <div class="marca-info-central">
            <div class="marca-tiempo">
              {{ cronometroStore.formatearTiempo(marca.tiempoMarca) }}
            </div>
          </div>

          <div class="marca-info-der">
            <div class="marca-intervalo">
              +{{ cronometroStore.formatearTiempo(marca.intervalo) }}
            </div>
            <div class="etiqueta-intervalo">{{ $t('cronometro.marcas.intervalo') }}</div>
          </div>
        </div>
      </q-slide-item>
    </q-list>

    <!-- Mensaje cuando no hay marcas -->
    <div v-else class="sin-marcas">
      <component :is="IconStopwatch" :stroke="1.5" size="64" class="icono-vacio" />
      <div class="sin-marcas-texto">{{ $t('cronometro.marcas.sinMarcas') }}</div>
    </div>
  </div>
</template>

<script setup>
import { useCronometroStore } from 'src/stores/cronometro'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
// Importamos los iconos necesarios para evitar las "figuras rotas"
import { IconTrash, IconTrashX, IconStopwatch } from '@tabler/icons-vue'

const cronometroStore = useCronometroStore()
const { t } = useI18n()
const $q = useQuasar()

function confirmarEliminarTodas() {
  $q.dialog({
    title: t('cronometro.marcas.confirmarEliminarTodas.titulo'),
    message: t('cronometro.marcas.confirmarEliminarTodas.mensaje'),
    cancel: {
      flat: true,
      label: t('cronometro.marcas.confirmarEliminarTodas.cancelar'),
      color: 'white',
    },
    ok: {
      flat: true,
      label: t('cronometro.marcas.confirmarEliminarTodas.confirmar'),
      color: 'negative',
    },
    dark: true,
    persistent: true,
  }).onOk(() => {
    cronometroStore.eliminarTodasLasMarcas()
  })
}

function confirmarEliminarMarca(idMarca, reset) {
  if (navigator.vibrate) navigator.vibrate(50)
  cronometroStore.eliminarMarca(idMarca)
  reset()
}
</script>

<style scoped>
.cronometro-marcas {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent;
  width: 100%;
  overflow: hidden;
}

.marcas-encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem 0.5rem 0.5rem;
}

.marcas-titulo {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-azul-claro);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.boton-eliminar {
  color: var(--color-error);
  opacity: 0.8;
}

.lista-marcas {
  flex: 1;
  overflow-y: auto;
  padding: 0 4px 50px 4px;
}

/* --- ESTILO TIPO TARJETA --- */
.slide-marca {
  margin-bottom: 0.5rem;
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
}

.marca-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  /* Glassmorphism */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: background 0.2s;
}

.marca-item:active {
  background: rgba(255, 255, 255, 0.15);
}

.marca-indice {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(43, 203, 254, 0.15);
  border-radius: 50%;
  color: var(--color-azul-claro);
  font-weight: 700;
  font-size: 0.85rem;
  margin-right: 0.75rem;
}

.marca-tiempo {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-texto-blanco);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.marca-info-der {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.marca-intervalo {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-azul-medio);
  font-variant-numeric: tabular-nums;
}

.etiqueta-intervalo {
  font-size: 0.55rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
}

.slide-accion {
  background: var(--color-error);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1.5rem;
  border-radius: 12px;
}

/* --- ESTADO VACÍO (Limpiado y Subido) --- */
.sin-marcas {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Alineamos al inicio (arriba) */
  justify-content: flex-start;
  align-items: center;
  padding-top: 1.5rem; /* Ajusta este valor si quieres subirlo más o menos */
  gap: 0.75rem;
  opacity: 0.4;
}

.icono-vacio {
  color: var(--color-texto-blanco);
  /* Aseguramos que no tenga márgenes raros */
  margin: 0;
  line-height: 1;
}

.sin-marcas-texto {
  color: var(--color-texto-blanco);
  font-size: 0.9rem;
  text-align: center;
}

.lista-marcas::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
