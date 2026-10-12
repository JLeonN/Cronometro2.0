<template>
  <q-page class="pagina-principal">
    <div class="seccion-superior">
      <CronometroDisplay />
      <CronometroControles :bloqueado="cronometroStore.cargandoMarcas || guardando || listaYaGuardada" />
    </div>
    <div class="seccion-inferior">
      <div v-if="continuacionActiva" class="aviso-continuacion" role="status">
        <strong>{{ $t('listas.continuacion.titulo', { titulo: tituloListaContinuada }) }}</strong>
        <span v-if="cronometroStore.marcasNuevas.length > 0">
          {{ $t(claveAvisoPendiente, { cantidad: cronometroStore.marcasNuevas.length }) }}
        </span>
        <span v-else>{{ $t('listas.continuacion.sinCambios') }}</span>
      </div>
      <div
        v-if="cronometroStore.totalMarcas > 0"
        class="pestanas-marcas"
        role="tablist"
        :aria-label="$t('listas.pestanas.etiqueta')"
      >
        <button
          id="pestana-marcas"
          type="button"
          class="pestana"
          role="tab"
          aria-controls="panel-marcas"
          :aria-selected="pestanaActiva === 'marcas'"
          :disabled="guardando || listaYaGuardada"
          @click="pestanaActiva = 'marcas'"
        >
          {{ $t('cronometro.marcas.titulo') }}
        </button>
        <button
          id="pestana-guardar"
          type="button"
          class="pestana"
          role="tab"
          aria-controls="panel-guardar"
          :aria-selected="pestanaActiva === 'guardar'"
          :disabled="(!puedeGuardarLista && !listaYaGuardada) || guardando"
          @click="pestanaActiva = 'guardar'"
        >
          {{ $t(continuacionActiva ? 'listas.pestanas.actualizar' : 'listas.pestanas.guardar') }}
        </button>
      </div>
      <div
        v-show="pestanaActiva === 'marcas'"
        id="panel-marcas"
        class="panel-marcas"
        :role="cronometroStore.totalMarcas > 0 ? 'tabpanel' : undefined"
        :aria-labelledby="cronometroStore.totalMarcas > 0 ? 'pestana-marcas' : undefined"
      >
        <CronometroMarcas />
      </div>
      <form
        v-if="pestanaActiva === 'guardar'"
        id="panel-guardar"
        class="formulario-lista"
        role="tabpanel"
        aria-labelledby="pestana-guardar"
        @submit.prevent="guardarListaActual"
      >
        <p v-if="continuacionActiva" class="titulo-continuacion">{{ tituloListaContinuada }}</p>
        <q-input
          v-else
          v-model="tituloLista"
          dark
          outlined
          maxlength="80"
          :disable="guardando || listaYaGuardada"
          :label="$t('listas.formulario.titulo')"
          :error="errorTitulo"
          :error-message="$t('listas.formulario.tituloObligatorio')"
          @update:model-value="errorTitulo = false"
        />
        <q-input
          v-if="!continuacionActiva"
          v-model="descripcionLista"
          dark
          outlined
          type="textarea"
          autogrow
          maxlength="500"
          :disable="guardando || listaYaGuardada"
          :label="$t('listas.formulario.descripcion')"
        />
        <p class="formulario-ayuda">{{ $t(continuacionActiva ? 'listas.formulario.ayudaActualizacion' : 'listas.formulario.ayuda') }}</p>
        <p v-if="errorLimpieza" class="formulario-error">{{ $t('listas.mensajes.errorLimpieza') }}</p>
        <div class="formulario-acciones">
          <button
            type="submit"
            class="boton-formulario boton-guardar"
            :disabled="guardando"
            :aria-label="listaYaGuardada ? $t('listas.formulario.reintentarLimpieza') : $t(continuacionActiva ? 'listas.formulario.actualizar' : 'listas.formulario.confirmar')"
          >
            <IconCheck :size="24" :stroke="2" />
            <span>{{ listaYaGuardada ? $t('listas.formulario.reintentarLimpieza') : $t(continuacionActiva ? 'listas.formulario.actualizar' : 'listas.formulario.confirmar') }}</span>
          </button>
          <button
            type="button"
            class="boton-formulario boton-cancelar"
            :disabled="guardando || listaYaGuardada"
            :aria-label="$t('listas.formulario.cancelar')"
            @click="cancelarFormulario"
          >
            <IconX :size="24" :stroke="2" />
            <span>{{ $t('listas.formulario.cancelar') }}</span>
          </button>
        </div>
      </form>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { IconCheck, IconX } from '@tabler/icons-vue'
import { useCronometroStore } from 'src/stores/cronometro'
import { useListasGuardadasStore } from 'src/stores/ListasGuardadas'
import CronometroDisplay from 'src/components/CronometroDisplay.vue'
import CronometroControles from 'src/components/CronometroControles.vue'
import CronometroMarcas from 'src/components/CronometroMarcas.vue'

const quasar = useQuasar()
const { t } = useI18n()
const cronometroStore = useCronometroStore()
const listasStore = useListasGuardadasStore()
const pestanaActiva = ref('marcas')
const tituloLista = ref('')
const descripcionLista = ref('')
const errorTitulo = ref(false)
const guardando = ref(false)
const listaYaGuardada = ref(false)
const errorLimpieza = ref(false)
const continuacionActiva = computed(() => Boolean(cronometroStore.listaEnContinuacion))
const tituloListaContinuada = computed(() =>
  listasStore.listas.find((lista) => lista.id === cronometroStore.listaEnContinuacion?.idLista)?.titulo ?? '',
)
const claveAvisoPendiente = computed(() => {
  const sufijo = cronometroStore.marcasNuevas.length === 1 ? 'pendiente' : 'pendientes'
  return `listas.continuacion.${sufijo}${cronometroStore.estadoCronometro === 'detenido' ? 'Detenidas' : ''}`
})

const puedeGuardarLista = computed(
  () =>
    !cronometroStore.cargandoMarcas &&
    cronometroStore.estadoCronometro === 'detenido' &&
    (continuacionActiva.value
      ? cronometroStore.marcasNuevas.length > 0
      : cronometroStore.totalMarcas > 0),
)

function limpiarFormulario() {
  tituloLista.value = ''
  descripcionLista.value = ''
  errorTitulo.value = false
}

function cancelarFormulario() {
  if (listaYaGuardada.value) return
  limpiarFormulario()
  pestanaActiva.value = 'marcas'
}

async function guardarListaActual() {
  if (guardando.value || (!puedeGuardarLista.value && !listaYaGuardada.value)) return
  if (!listaYaGuardada.value && !continuacionActiva.value && !tituloLista.value.trim()) {
    errorTitulo.value = true
    return
  }

  const actualizandoLista = continuacionActiva.value
  guardando.value = true
  try {
    if (!listaYaGuardada.value) {
      if (continuacionActiva.value) {
        await listasStore.agregarMarcasALista(
          cronometroStore.listaEnContinuacion.idLista,
          cronometroStore.marcasNuevas,
        )
      } else {
        await listasStore.guardarLista({
          titulo: tituloLista.value,
          descripcion: descripcionLista.value,
          marcas: cronometroStore.marcas,
        })
      }
      listaYaGuardada.value = true
    }
    await cronometroStore.reiniciarSesion()
    listaYaGuardada.value = false
    errorLimpieza.value = false
    limpiarFormulario()
    pestanaActiva.value = 'marcas'
    quasar.notify({ type: 'positive', message: t(actualizandoLista ? 'listas.mensajes.actualizada' : 'listas.mensajes.guardada') })
  } catch (error) {
    console.error('Error al guardar la lista:', error)
    errorLimpieza.value = listaYaGuardada.value
    quasar.notify({
      type: 'negative',
      message: t(listaYaGuardada.value ? 'listas.mensajes.errorLimpieza' : 'listas.mensajes.errorGuardar'),
    })
  } finally {
    guardando.value = false
  }
}

watch(puedeGuardarLista, (permitido) => {
  if (!permitido && !listaYaGuardada.value) pestanaActiva.value = 'marcas'
})
watch(
  () => cronometroStore.totalMarcas,
  (total) => {
    if (total === 0 && !listaYaGuardada.value) limpiarFormulario()
  },
)
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
  padding: 3rem 1.5rem 1rem;
  flex-shrink: 0;
  z-index: 10;
}
.seccion-inferior {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 1rem calc(1rem + var(--safe-area-inferior)) 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.aviso-continuacion {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--color-azul-claro);
  border-radius: 10px;
  color: var(--color-texto-blanco);
  font-size: 0.8rem;
}
.aviso-continuacion span {
  color: var(--color-azul-claro);
}
.pestanas-marcas {
  display: flex;
  gap: 0.35rem;
  align-items: flex-end;
  padding: 0 0.25rem 0.5rem;
}
.pestana {
  border: 0;
  border-radius: 10px 10px 0 0;
  padding: 0.55rem 0.75rem;
  background: transparent;
  color: var(--color-texto-blanco);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}
.pestana[aria-selected='true'] {
  background: var(--color-azul-medio);
  box-shadow: inset 0 -2px var(--color-azul-claro);
}
.pestana:disabled {
  color: var(--color-deshabilitado);
  cursor: not-allowed;
}
.panel-marcas {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.formulario-lista {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 0.25rem 1rem;
}
.formulario-ayuda {
  margin: 0;
  color: var(--color-azul-claro);
  font-size: 0.85rem;
}
.titulo-continuacion {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}
.formulario-error {
  margin: 0;
  color: var(--color-error-claro);
  font-size: 0.85rem;
}
.formulario-acciones {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.boton-formulario {
  min-height: 48px;
  border: 0;
  border-radius: 10px;
  padding: 0.5rem 0.85rem;
  color: var(--color-texto-blanco);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
.boton-formulario:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.boton-guardar {
  background: var(--color-exito);
}
.boton-cancelar {
  background: var(--color-error);
}
@media (max-width: 360px) {
  .seccion-superior {
    padding-top: 1.5rem;
  }
  .boton-formulario {
    flex: 1;
  }
}
</style>
