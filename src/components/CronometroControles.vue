<template>
  <div class="cronometro-controles">
    <!-- Botón Izquierdo (Play/Pausa/Reanudar) -->
    <q-btn
      unelevated
      class="boton-control boton-izquierdo"
      :class="claseBotonIzquierdo"
      @click="accionBotonIzquierdo"
    >
      <component :is="componenteIconoIzquierdo" :stroke="2" :size="28" />
    </q-btn>

    <!-- Botón Derecho (Marca/Stop) -->
    <q-btn
      :disable="botonDerechoDeshabilitado"
      unelevated
      class="boton-control boton-derecho"
      :class="claseBotonDerecho"
      @click="accionBotonDerecho"
    >
      <component
        v-if="componenteIconoDerecho"
        :is="componenteIconoDerecho"
        :stroke="2"
        :size="28"
      />
    </q-btn>
  </div>
</template>

<script setup>
import { computed, markRaw } from 'vue'
import { useCronometroStore } from 'src/stores/cronometro'
import { IconPlayerPlay, IconPlayerPause, IconPlayerStop, IconFlag } from '@tabler/icons-vue'

const cronometroStore = useCronometroStore()

// ========================================
// ICONOS (Usando markRaw para evitar errores de reactividad)
// ========================================

const componenteIconoIzquierdo = computed(() => {
  switch (cronometroStore.estadoCronometro) {
    case 'detenido':
      return markRaw(IconPlayerPlay)
    case 'corriendo':
      return markRaw(IconPlayerPause)
    case 'pausado':
      return markRaw(IconPlayerPlay)
    default:
      return markRaw(IconPlayerPlay)
  }
})

const componenteIconoDerecho = computed(() => {
  switch (cronometroStore.estadoCronometro) {
    case 'corriendo':
      return markRaw(IconFlag)
    case 'pausado':
      return markRaw(IconPlayerStop)
    default:
      return null
  }
})

// ========================================
// ESTILOS
// ========================================

const claseBotonIzquierdo = computed(() => {
  return 'btn-amarillo'
})

const claseBotonDerecho = computed(() => {
  if (cronometroStore.estadoCronometro === 'corriendo') return 'btn-azul-claro'
  if (cronometroStore.estadoCronometro === 'pausado') return 'btn-rojo'
  return 'btn-deshabilitado'
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
  gap: 1rem;
  width: 100%;
  padding: 0.5rem 0;
}
.boton-control {
  width: 70px;
  height: 48px;
  border-radius: 12px;
  transition: all 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.boton-control:active {
  transform: scale(0.95);
}
/* --- COLORES --- */
.btn-amarillo {
  background-color: var(--color-amarillo) !important;
  color: var(--color-texto-sobre-amarillo) !important;
  box-shadow: 0 4px 12px rgba(255, 214, 0, 0.2);
}
.btn-azul-claro {
  background-color: rgba(43, 203, 254, 0.15) !important;
  color: var(--color-azul-claro) !important;
  border: 1px solid rgba(43, 203, 254, 0.2);
}
.btn-rojo {
  background-color: rgba(214, 52, 71, 0.15) !important;
  color: var(--color-error) !important;
  border: 1px solid rgba(214, 52, 71, 0.2);
}
.btn-deshabilitado {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid transparent;
}
</style>
