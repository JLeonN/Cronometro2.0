<template>
  <div class="cronometro-display">
    <!-- Tiempo principal -->
    <div class="tiempo-principal">{{ cronometroStore.tiempoFormateado }}</div>

    <!-- Estadísticas -->
    <div v-if="cronometroStore.totalMarcas > 0" class="estadisticas">
      <div class="estadistica-item">
        <div class="estadistica-label">{{ $t('cronometro.totalMarcas') }}</div>
        <div class="estadistica-valor">{{ cronometroStore.totalMarcas }}</div>
      </div>

      <div class="estadistica-separador"></div>

      <div class="estadistica-item">
        <div class="estadistica-label">{{ $t('cronometro.promedioMarcas') }}</div>
        <div class="estadistica-valor">{{ cronometroStore.promedioFormateado }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCronometroStore } from 'src/stores/cronometro'

const cronometroStore = useCronometroStore()
</script>

<style scoped>
.cronometro-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.25rem 1rem 1.25rem 1rem;
  gap: 1.25rem;
}
.tiempo-principal {
  font-size: clamp(2.8rem, 8vw, 4.5rem);
  font-weight: 700;
  color: var(--color-texto-blanco);
  font-variant-numeric: tabular-nums;
  text-shadow: var(--sombra-media);
  line-height: 1;
}
.estadisticas {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: var(--sombra-suave);
}
.estadistica-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.estadistica-label {
  font-size: 0.75rem;
  color: var(--color-texto-blanco);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}
.estadistica-valor {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-texto-blanco);
  font-variant-numeric: tabular-nums;
}
.estadistica-separador {
  width: 1px;
  height: 2rem;
  background: rgba(255, 255, 255, 0.3);
}
/* Responsive */
@media (max-width: 360px) {
  .tiempo-principal {
    font-size: 3.5rem;
  }
  .estadisticas {
    gap: 1rem;
    padding: 0.75rem 1rem;
  }
  .estadistica-valor {
    font-size: 1rem;
  }
}
</style>
