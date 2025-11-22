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
  background: linear-gradient(
    to bottom,
    var(--fondo-degradado-intenso-top),
    var(--fondo-degradado-intenso-bottom)
  );
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.seccion-superior {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem 2rem;
  min-height: 40vh;
  position: relative;
  padding-bottom: 2.5rem;
}
.seccion-inferior {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: visible;
  /* Solapar ligeramente la tarjeta blanca sobre el fondo degradado */
  margin-top: -28px;
  padding-top: 28px;
}
</style>
