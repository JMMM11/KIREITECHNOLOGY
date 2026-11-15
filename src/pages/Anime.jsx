import SeccionTienda from './SeccionTienda.jsx';

const DATOS = {
  categoriaId: 'anime',
  titulo: 'Anime',
  descripcion: 'Accesorios anime en Panamá, como relojes de bolsillo de One Piece. Envío a domicilio o retiro gratis.',
  vacio: {
    titulo: 'Zona Anime: próximamente.',
    texto: 'Llaveros, peluches, pines y más de tus series favoritas. Estamos preparando la sección.',
    mensaje: 'Hola Kirei, avísenme cuando abran la Zona Anime.',
  },
  cabecera: { titulo: 'Zona Anime.', texto: 'Accesorios de tus series favoritas.' },
};

export default function Anime() {
  return <SeccionTienda datos={DATOS} />;
}
