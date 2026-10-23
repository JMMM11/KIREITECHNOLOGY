// Servicios de reparación tomados de los diseños de la tienda. Precio de referencia: [precio].
// Fotos: originales del dueño en la carpeta reparaciones/. Cada grupo tiene la suya; un servicio puede tener una propia.
const r = (archivo, ancho, alto) => ({ src: `reparaciones/${archivo}`, ancho, alto });
export const FOTOS_REPARACION = {
  portada: r('reparación.jpg', 1024, 1024),
  inicio: r('1_Foto.1742718335.jpg', 861, 646),
};

export const GRUPOS_SERVICIO = [
  {
    id: 'piezas', nombre: 'Piezas y reparación', foto: r('imgi_1_reparacion-ordenadores-madrid.png', 1000, 600),
    servicios: [
      { id: 'diagnostico', nombre: 'Diagnóstico avanzado', detalle: 'Revisamos tu equipo y te decimos qué tiene.', foto: FOTOS_REPARACION.inicio },
      { id: 'hardware-software', nombre: 'Reparación de hardware y software', detalle: 'Fallas de piezas o del sistema.' },
      { id: 'pantalla', nombre: 'Cambio de pantalla', detalle: 'Pantallas rotas o con fallas.' },
      { id: 'bateria', nombre: 'Cambio de batería', detalle: 'Cuando ya no aguanta la carga.' },
      { id: 'teclado', nombre: 'Cambio de teclado', detalle: 'Teclas que no responden.' },
    ],
  },
  {
    id: 'sistema', nombre: 'Sistema y mantenimiento', foto: r('w10 y 11.jpg', 1024, 683),
    servicios: [
      { id: 'windows', nombre: 'Instalación de Windows 10 / 11', detalle: 'Instalación rápida y segura para laptops y PCs.' },
      { id: 'actualizacion', nombre: 'Actualización de computadoras', detalle: 'Ponemos al día tu sistema Windows.' },
      { id: 'antivirus', nombre: 'Eliminación de virus y antivirus', detalle: 'Limpieza e instalación de antivirus.', foto: r('virus.png', 1200, 1200) },
      { id: 'mantenimiento', nombre: 'Mantenimiento preventivo', detalle: 'Limpieza interna para que no se caliente.', foto: r('limpieza.jpg', 638, 481) },
    ],
  },
];

export const SERVICIOS = GRUPOS_SERVICIO.flatMap((g) => g.servicios);
