// Servicios de reparación tomados de los diseños de la tienda. Precio de referencia: [precio].
export const GRUPOS_SERVICIO = [
  {
    id: 'piezas', nombre: 'Piezas y reparación',
    servicios: [
      { id: 'diagnostico', nombre: 'Diagnóstico avanzado', detalle: 'Revisamos tu equipo y te decimos qué tiene.' },
      { id: 'hardware-software', nombre: 'Reparación de hardware y software', detalle: 'Fallas de piezas o del sistema.' },
      { id: 'pantalla', nombre: 'Cambio de pantalla', detalle: 'Pantallas rotas o con fallas.' },
      { id: 'bateria', nombre: 'Cambio de batería', detalle: 'Cuando ya no aguanta la carga.' },
      { id: 'teclado', nombre: 'Cambio de teclado', detalle: 'Teclas que no responden.' },
    ],
  },
  {
    id: 'sistema', nombre: 'Sistema y mantenimiento',
    servicios: [
      { id: 'windows', nombre: 'Instalación de Windows 10 / 11', detalle: 'Instalación rápida y segura para laptops y PCs.' },
      { id: 'actualizacion', nombre: 'Actualización de computadoras', detalle: 'Ponemos al día tu sistema Windows.' },
      { id: 'antivirus', nombre: 'Eliminación de virus y antivirus', detalle: 'Limpieza e instalación de antivirus.' },
      { id: 'mantenimiento', nombre: 'Mantenimiento preventivo', detalle: 'Limpieza interna para que no se caliente.' },
    ],
  },
];

export const SERVICIOS = GRUPOS_SERVICIO.flatMap((g) => g.servicios);
