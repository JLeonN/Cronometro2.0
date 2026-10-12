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

  // Actualización disponible
  actualizacion: {
    titulo: 'Hay una actualización disponible',
    versionInstalada: 'Tu versión',
    versionDisponible: 'Nueva versión',
    avisoPlayStore: 'Play Store puede demorar un poco en mostrar la última versión.',
    novedades: 'Novedades de esta versión',
    cancelar: 'Cancelar',
    actualizar: 'Actualizar',
    indicador: 'Actualización disponible',
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
  listas: {
    menu: 'Listas guardadas',
    volverCronometro: 'Ir al cronómetro',
    volverListas: 'Volver a las listas',
    cargando: 'Cargando listas…',
    reintentar: 'Reintentar',
    cantidadMarcas: '{cantidad} marcas',
    unaMarca: '{cantidad} marca',
    eliminarLista: 'Eliminar la lista {titulo}',
    pestanas: {
      etiqueta: 'Marcas y guardado',
      guardar: 'Guardar lista',
      actualizar: 'Actualizar lista',
    },
    continuacion: {
      titulo: 'Continuando «{titulo}»',
      sinCambios: 'Aún no hay marcas nuevas.',
      pendiente: '1 marca nueva sin guardar. Detén el cronómetro y abre «Actualizar lista».',
      pendientes: '{cantidad} marcas nuevas sin guardar. Detén el cronómetro y abre «Actualizar lista».',
      pendienteDetenidas: '1 marca nueva sin guardar. Abre «Actualizar lista».',
      pendientesDetenidas: '{cantidad} marcas nuevas sin guardar. Abre «Actualizar lista».',
    },
    formulario: {
      titulo: 'Título de la lista *',
      tituloObligatorio: 'Escribe un título para guardar la lista',
      descripcion: 'Descripción (opcional)',
      ayuda: 'Se guardarán todas las marcas actuales. Después, el cronómetro quedará en cero.',
      ayudaActualizacion: 'Las marcas nuevas se añadirán a esta lista. El cronómetro quedará en cero.',
      confirmar: 'Guardar',
      actualizar: 'Actualizar',
      cancelar: 'Cancelar',
      reintentarLimpieza: 'Terminar guardado',
    },
    vacio: {
      titulo: 'Todavía no hay listas guardadas',
      descripcion: 'Guarda tus marcas para consultarlas más adelante.',
      tutorialTitulo: '¿Para qué sirven las listas?',
      tutorialPasos: 'Registra marcas, detén el cronómetro, abre «Guardar lista» y escribe un título.',
      ejemploGimnasio: 'En el gimnasio, puedes guardar las vueltas de una rutina y comparar tus tiempos.',
      ejemploDistancias: 'También puedes medir cuánto tardas en recorrer distintas distancias.',
    },
    detalle: {
      noEncontrada: 'No encontramos esta lista.',
      notaMarca: 'Nota para la marca {numero}',
      continuarMarcas: 'Continuar marcas',
    },
    mensajes: {
      guardada: 'Lista guardada',
      actualizada: 'Lista actualizada',
      eliminada: 'Lista eliminada',
      errorCargar: 'No se pudieron cargar las listas guardadas.',
      errorGuardar: 'No se pudo guardar la lista. Tus marcas siguen disponibles.',
      errorLimpieza: 'La lista se guardó, pero no se pudo limpiar el cronómetro. Toca «Terminar guardado».',
      errorEliminar: 'No se pudo eliminar la lista.',
      errorNota: 'No se pudo guardar la nota. Inténtalo de nuevo.',
      errorContinuar: 'No se pudo continuar esta lista. Inténtalo de nuevo.',
    },
  },
}
