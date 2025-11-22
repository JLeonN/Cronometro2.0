export default {
  // General system messages
  failed: 'Action failed',
  success: 'Action was successful',

  // Main layout
  layout: {
    appName: 'Stopwatch',
    menu: 'Menu',
    version: 'Version',
  },

  // Settings drawer
  configuracion: {
    titulo: 'Settings',
    idioma: {
      titulo: 'Language',
      descripcion: 'Select the application language',
      espanol: 'Spanish',
      ingles: 'English',
    },
    sonido: {
      titulo: 'Sound',
      descripcion: 'Enable or disable sounds',
    },
  },

  // Notification messages
  notificaciones: {
    idiomaCambiado: 'Language changed successfully',
  },

  // Stopwatch
  cronometro: {
    titulo: 'STOPWATCH',
    totalMarcas: 'Total',
    promedioMarcas: 'Average',
    botones: {
      iniciar: 'Start',
      pausar: 'Pause',
      reanudar: 'Resume',
      detener: 'Stop',
      marca: 'Lap',
    },
    marcas: {
      titulo: 'Laps',
      intervalo: 'Interval',
      sinMarcas: 'No laps recorded',
      eliminarTodas: 'Delete all',
      todasEliminadas: 'All laps were deleted',
      marcaEliminada: 'Lap deleted',
      confirmarEliminarTodas: {
        titulo: 'Delete all laps?',
        mensaje: 'This action cannot be undone',
        confirmar: 'Delete',
        cancelar: 'Cancel',
      },
      confirmarEliminarMarca: {
        titulo: 'Delete this lap?',
        mensaje: 'This action cannot be undone',
        confirmar: 'Delete',
        cancelar: 'Cancel',
      },
    },
  },
}
