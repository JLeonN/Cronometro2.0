export default {
  // Mensajes generales del sistema
  failed: 'La acción falló',
  success: 'Acción exitosa',

  // Layout principal
  layout: {
    appName: 'Cronómetro',
    menu: 'Menú',
    version: 'Versión',
  },

  // Drawer de configuración
  configuracion: {
    titulo: 'Configuración',
    idioma: {
      titulo: 'Idioma',
      descripcion: 'Selecciona el idioma de la aplicación',
      espanol: 'Español',
      ingles: 'Inglés',
    },
    sonido: {
      titulo: 'Sonido',
      descripcion: 'Activa o desactiva los sonidos',
    },
  },

  // Mensajes de notificación
  notificaciones: {
    idiomaCambiado: 'Idioma cambiado exitosamente',
  },

  // Cronómetro
  cronometro: {
    titulo: 'CRONÓMETRO',
    totalMarcas: 'Total',
    promedioMarcas: 'Promedio',
    botones: {
      iniciar: 'Iniciar',
      pausar: 'Pausar',
      reanudar: 'Reanudar',
      detener: 'Detener',
      marca: 'Marca',
    },
    marcas: {
      titulo: 'Marcas',
      intervalo: 'Intervalo',
      sinMarcas: 'No hay marcas registradas',
      eliminarTodas: 'Eliminar todas',
      todasEliminadas: 'Todas las marcas fueron eliminadas',
      marcaEliminada: 'Marca eliminada',
      confirmarEliminarTodas: {
        titulo: '¿Eliminar todas las marcas?',
        mensaje: 'Esta acción no se puede deshacer',
        confirmar: 'Eliminar',
        cancelar: 'Cancelar',
      },
      confirmarEliminarMarca: {
        titulo: '¿Eliminar esta marca?',
        mensaje: 'Esta acción no se puede deshacer',
        confirmar: 'Eliminar',
        cancelar: 'Cancelar',
      },
    },
  },
}
