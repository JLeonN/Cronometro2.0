<template>
  <div class="cronometro-marcas">
    <!-- Encabezado -->
    <div v-if="cronometroStore.totalMarcas > 0" class="marcas-encabezado">
      <div class="marcas-titulo">{{ $t('cronometro.marcas.titulo') }}</div>
    </div>

    <!-- Lista de marcas -->
    <q-list v-if="cronometroStore.totalMarcas > 0" class="lista-marcas">
      <transition-group name="marca-expand" tag="div" class="marcas-contenido">
        <q-slide-item
          v-for="marca in cronometroStore.marcas"
          :key="marca.id"
          class="slide-marca"
          right-color="transparent"
          @right="({ reset }) => confirmarEliminarMarca(marca.id, reset)"
        >
          <template #right>
            <div class="slide-accion">
              <IconTrashX color="white" :stroke="2" :size="24" />
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
            </div>
          </div>
        </q-slide-item>
      </transition-group>
    </q-list>

    <!-- Mensaje cuando no hay marcas -->
    <div v-else class="sin-marcas">
      <IconStopwatch :stroke="1.5" :size="64" class="icono-vacio" />
      <div class="sin-marcas-texto">{{ $t('cronometro.marcas.sinMarcas') }}</div>
    </div>
  </div>
</template>

<script setup>
import { IconTrashX, IconStopwatch } from '@tabler/icons-vue'
import { useCronometroStore } from 'src/stores/cronometro'

const cronometroStore = useCronometroStore()

function confirmarEliminarMarca(idMarca, reset) {
  if (navigator.vibrate) {
    navigator.vibrate(50)
  }
  cronometroStore.eliminarMarca(idMarca)
  reset()
}
</script>

<style scoped>
.cronometro-marcas {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
  width: 100%;
  overflow: hidden;
}
.marcas-encabezado {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0.5rem 0.5rem 0.5rem;
}
.marcas-titulo {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-texto-blanco);
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}
.lista-marcas {
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 4px 50px 4px;
}
.marcas-contenido {
  min-height: min-content;
}
.marca-expand-enter-active {
  transition: transform 0.25s ease-out, opacity 0.2s ease-out;
}
.marca-expand-enter-from {
  transform: scaleX(0);
  opacity: 0;
}
.marca-expand-enter-to {
  transform: scaleX(1);
  opacity: 1;
}
.marca-expand-leave-active {
  transition: transform 0.2s ease-in, opacity 0.15s ease-in;
}
.marca-expand-leave-to {
  transform: scaleX(0);
  opacity: 0;
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
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-azul-claro);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 8px rgba(0, 63, 131, 0.35);
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
/* --- ESTADO VACÍO --- */
.sin-marcas {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 1.5rem;
  gap: 0.75rem;
  opacity: 0.4;
}
.icono-vacio {
  color: var(--color-texto-blanco);
  margin: 0;
  line-height: 1;
}
.sin-marcas-texto {
  color: var(--color-texto-blanco);
  font-size: 0.9rem;
  text-align: center;
}
.lista-marcas::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
</style>
