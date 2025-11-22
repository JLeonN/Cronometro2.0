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
  padding: 1rem;
  gap: 1rem;
  width: 100%;
}
.tiempo-principal {
  /* Tamaño dinámico grande */
  font-size: clamp(3.5rem, 12vw, 5rem);
  font-weight: 700;
  color: var(--color-texto-blanco);
  font-variant-numeric: tabular-nums;
  /* Sombra sutil azulada para dar profundidad */
  text-shadow: 0 4px 12px rgba(0, 63, 131, 0.3);
  line-height: 1;
  letter-spacing: -1px;
}
.estadisticas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.5rem 1.25rem;
  /* Efecto cristal sutil */
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
}
.estadistica-item {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.5rem;
}
.estadistica-label {
  font-size: 0.7rem;
  color: var(--color-azul-claro); /* Contraste sobre oscuro */
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}
.estadistica-valor {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-texto-blanco);
  font-variant-numeric: tabular-nums;
}
.estadistica-separador {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
}
@media (max-width: 360px) {
  .tiempo-principal {
    font-size: 3rem;
  }
}
</style>
