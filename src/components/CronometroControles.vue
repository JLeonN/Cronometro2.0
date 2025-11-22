<template>
  <div class="cronometro-controles">
    <!-- Botón Izquierdo (Play/Pausa/Reanudar) -->
    <q-btn
      :icon="iconoBotonIzquierdo"
      :color="colorBotonIzquierdo"
      size="xl"
      round
      unelevated
      class="boton-control boton-izquierdo"
      @click="accionBotonIzquierdo"
    />

    <!-- Botón Derecho (Marca/Stop) -->
    <q-btn
      :icon="iconoBotonDerecho"
      :color="colorBotonDerecho"
      :disable="botonDerechoDeshabilitado"
      size="xl"
      round
      unelevated
      class="boton-control boton-derecho"
      @click="accionBotonDerecho"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCronometroStore } from 'src/stores/cronometro'

const cronometroStore = useCronometroStore()

// ========================================
// COMPUTED - BOTÓN IZQUIERDO
// ========================================
const iconoBotonIzquierdo = computed(() => {
  switch (cronometroStore.estadoCronometro) {
    case 'detenido':
      return 'ti ti-player-play-filled'
    case 'corriendo':
      return 'ti ti-player-pause-filled'
    case 'pausado':
      return 'ti ti-player-play-filled'
    default:
      return 'ti ti-player-play-filled'
  }
})

const colorBotonIzquierdo = computed(() => {
  return 'primary'
})

// ========================================
// COMPUTED - BOTÓN DERECHO
// ========================================
const iconoBotonDerecho = computed(() => {
  switch (cronometroStore.estadoCronometro) {
    case 'detenido':
      return ''
    case 'corriendo':
      return 'ti ti-flag-filled'
    case 'pausado':
      return 'ti ti-square-rounded-filled'
    default:
      return ''
  }
})

const colorBotonDerecho = computed(() => {
  if (cronometroStore.estadoCronometro === 'corriendo') {
    return 'warning'
  }
  if (cronometroStore.estadoCronometro === 'pausado') {
    return 'negative'
  }
  return 'grey-5'
})

const botonDerechoDeshabilitado = computed(() => {
  return cronometroStore.estadoCronometro === 'detenido'
})

// ========================================
// ACCIONES
// ========================================
function accionBotonIzquierdo() {
  switch (cronometroStore.estadoCronometro) {
    case 'detenido':
      cronometroStore.iniciar()
      break
    case 'corriendo':
      cronometroStore.pausar()
      break
    case 'pausado':
      cronometroStore.reanudar()
      break
  }
}

function accionBotonDerecho() {
  switch (cronometroStore.estadoCronometro) {
    case 'corriendo':
      cronometroStore.guardarMarca()
      break
    case 'pausado':
      cronometroStore.detener()
      break
  }
}
</script>

<style scoped>
.cronometro-controles {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 1rem 2rem 1rem;
}

.boton-control {
  min-width: 64px;
  min-height: 64px;
  padding: 0;
  font-size: 1.6rem;
  box-shadow: var(--sombra-fuerte);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boton-control:active {
  transform: scale(0.94);
  box-shadow: var(--sombra-media);
}

/* Cuando el botón derecho está deshabilitado */
.boton-control.q-btn--disabled,
.boton-control[disabled] {
  opacity: 0.55;
  filter: grayscale(0.25);
}

/* Responsive */
@media (max-width: 360px) {
  .boton-control {
    min-width: 56px;
    min-height: 56px;
    font-size: 1.4rem;
  }

  .cronometro-controles {
    gap: 1.5rem;
  }
}
</style>
