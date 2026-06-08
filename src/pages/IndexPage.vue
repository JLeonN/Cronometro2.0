<template>
  <q-page class="pagina-principal">
    <!-- Display del cronómetro -->
    <div class="seccion-superior">
      <CronometroDisplay />
      <CronometroControles />
    </div>

    <!-- Lista de marcas -->
    <div class="seccion-inferior">
      <CronometroMarcas />
    </div>
  </q-page>
</template>

<script setup>
import CronometroDisplay from 'src/components/CronometroDisplay.vue'
import CronometroControles from 'src/components/CronometroControles.vue'
import CronometroMarcas from 'src/components/CronometroMarcas.vue'
</script>

<style scoped>
.pagina-principal {
  background: var(--fondo-cronometro-principal);
  display: flex;
  flex-direction: column;
  min-height: 0 !important;
  height: 100%;
  overflow: hidden;
  color: var(--color-texto-blanco);
}
.seccion-superior {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  /* Reducimos padding para dar más espacio a la lista */
  padding: 3rem 1.5rem 1rem;
  flex-shrink: 0;
  z-index: 10;
}
.seccion-inferior {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* El scroll lo maneja el componente hijo */
  padding: 0 1rem calc(1rem + var(--safe-area-inferior)) 1rem;
  width: 100%;
  max-width: 600px; /* Evita que se estire demasiado en tablets */
  margin: 0 auto;
}
</style>
