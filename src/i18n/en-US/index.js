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

  // Available update
  actualizacion: {
    titulo: 'An update is available',
    versionInstalada: 'Your version',
    versionDisponible: 'New version',
    avisoPlayStore: 'Play Store can take a little while to show the latest version.',
    novedades: 'What is new in this version',
    cancelar: 'Cancel',
    actualizar: 'Update',
    indicador: 'Update available',
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
