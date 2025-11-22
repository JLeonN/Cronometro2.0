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
        class="boton-eliminar"
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
        class="slide-marca"
        right-color="transparent"
        @right="({ reset }) => confirmarEliminarMarca(marca.id, reset)"
      >
        <template #right>
          <div class="slide-accion">
            <q-icon name="ti ti-trash-x" color="white" size="1.5rem" />
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
      <q-icon name="ti ti-stopwatch" size="4rem" class="icono-vacio" />
      <div class="sin-marcas-texto">{{ $t('cronometro.marcas.sinMarcas') }}</div>
    </div>
  </div>
</template>

<script setup>
import { useCronometroStore } from 'src/stores/cronometro'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

const cronometroStore = useCronometroStore()
const { t } = useI18n()
const $q = useQuasar()

// ... (TUS MISMAS FUNCIONES JS, NO HAN CAMBIADO) ...
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
    dark: true, // Dialogo oscuro
    persistent: true,
  }).onOk(() => {
    cronometroStore.eliminarTodasLasMarcas()
  })
}

function confirmarEliminarMarca(idMarca, reset) {
  // Pequeña vibración si es posible
  if (navigator.vibrate) navigator.vibrate(50)

  // Eliminación directa o con confirmación según prefieras
  cronometroStore.eliminarMarca(idMarca)
  reset()
}
</script>

<style scoped>
.cronometro-marcas {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Eliminado el fondo blanco y shadow del contenedor general */
  background: transparent;
  box-shadow: none;
  overflow: hidden;
}
.marcas-encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem 1rem 0.5rem;
}
.marcas-titulo {
  font-size: 0.9rem;
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
  /* Padding interno para que las cartas no toquen los bordes */
  padding: 0 4px 50px 4px;
}
/* --- ESTILO TIPO TARJETA (CARD) --- */
.slide-marca {
  margin-bottom: 0.75rem; /* Espacio entre tarjetas */
  border-radius: 16px;
  overflow: hidden;
  background: transparent;
}
.marca-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  /* ESTILO GLASSMORPHISM */
  background: rgba(255, 255, 255, 0.08); /* Fondo semi-transparente */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;

  transition: background 0.2s;
}
.marca-item:active {
  background: rgba(255, 255, 255, 0.15);
}
/* Columna Índice (Círculo) */
.marca-indice {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(43, 203, 254, 0.15); /* Azul claro muy suave */
  border-radius: 50%;
  color: var(--color-azul-claro);
  font-weight: 700;
  font-size: 0.9rem;
  margin-right: 1rem;
}
/* Tiempo Principal */
.marca-tiempo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-texto-blanco);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}
/* Intervalo (Derecha) */
.marca-info-der {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.marca-intervalo {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-azul-medio); /* Azul medio para diferencia */
  font-variant-numeric: tabular-nums;
}
.etiqueta-intervalo {
  font-size: 0.6rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
}
/* Acción de deslizar (Fondo Rojo) */
.slide-accion {
  background: var(--color-error);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1.5rem;
  border-radius: 16px; /* Para que coincida con la tarjeta */
}
/* Estado Vacío */
.sin-marcas {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0.5;
  margin-top: 2rem;
}
.icono-vacio {
  color: var(--color-texto-blanco);
}
.sin-marcas-texto {
  color: var(--color-texto-blanco);
  font-size: 0.9rem;
}
/* Scrollbar invisible pero funcional */
.lista-marcas::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
