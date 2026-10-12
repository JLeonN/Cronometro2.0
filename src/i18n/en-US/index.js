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
  listas: {
    menu: 'Saved lists',
    volverCronometro: 'Go to stopwatch',
    volverListas: 'Back to lists',
    cargando: 'Loading lists…',
    reintentar: 'Retry',
    cantidadMarcas: '{cantidad} laps',
    unaMarca: '{cantidad} lap',
    eliminarLista: 'Delete list {titulo}',
    pestanas: {
      etiqueta: 'Laps and saving',
      guardar: 'Save list',
    },
    formulario: {
      titulo: 'List title *',
      tituloObligatorio: 'Enter a title to save the list',
      descripcion: 'Description (optional)',
      ayuda: 'All current laps will be saved. The stopwatch will then reset to zero.',
      confirmar: 'Save',
      cancelar: 'Cancel',
      reintentarLimpieza: 'Finish saving',
    },
    vacio: {
      titulo: 'No saved lists yet',
      descripcion: 'Save your laps to review them later.',
      tutorialTitulo: 'What are lists for?',
      tutorialPasos: 'Record laps, stop the stopwatch, open “Save list”, and enter a title.',
      ejemploGimnasio: 'At the gym, save the laps in a workout and compare your times.',
      ejemploDistancias: 'You can also measure how long it takes to cover different distances.',
    },
    detalle: {
      noEncontrada: 'We could not find this list.',
      notaMarca: 'Note for lap {numero}',
    },
    mensajes: {
      guardada: 'List saved',
      eliminada: 'List deleted',
      errorCargar: 'Saved lists could not be loaded.',
      errorGuardar: 'The list could not be saved. Your laps are still available.',
      errorLimpieza: 'The list was saved, but the stopwatch could not be cleared. Tap “Finish saving”.',
      errorEliminar: 'The list could not be deleted.',
      errorNota: 'The note could not be saved. Please try again.',
    },
  },
}
