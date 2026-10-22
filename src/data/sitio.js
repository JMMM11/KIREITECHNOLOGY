export const SITIO = {
  nombre: 'Kirei Technology',
  lema: 'POWER UP YOUR BEST SELF', // pendiente de confirmar
  telefono: '+507 6156 0839',
  whatsapp: '50761560839',
  correo: '', // [pendiente]: al definirlo, las citas también se pueden enviar por correo a la tienda
  instagram: ['kireitechnology'], // cuentas de Instagram, sin @
  ubicacion: 'Panamá Oeste, Montelimar, Calle Los Vientos',
  ubicacionPendiente: true,
  garantia: 'Garantía de 1 semana o según el daño, con revisión técnica.',
  cobertura: 'Envíos solo dentro de Panamá.',
  pagoEnLinea: 'Yappy', // se conecta cuando exista la cuenta de comercio
  // Mientras sea true se muestran los estados de ejemplo y un aviso. Al lanzar, poner en false.
  vistaPrevia: true,
};

// Montos en centavos. null = por confirmar.
export const TARIFAS = {
  envioDomicilio: 500,
  envioPuntoEncuentro: null,
  contraEntregaMinimo: 3000,
  contraEntregaCargo: 500,
};
