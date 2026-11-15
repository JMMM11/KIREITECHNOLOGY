import SeccionTienda from './SeccionTienda.jsx';

const DATOS = {
  categoriaId: 'aroma',
  tema: 'tema-aroma',
  titulo: 'Aroma',
  descripcion: 'Perfumes y fragancias en Panamá con Kirei Technology. Envío a domicilio o retiro gratis.',
  vacio: {
    titulo: 'Aroma: próximamente.',
    texto: 'Perfumes y fragancias para ti o para regalar. Estamos preparando la sección.',
    mensaje: 'Hola Kirei, avísenme cuando abran la sección Aroma.',
  },
  cabecera: { titulo: 'Aroma.', texto: 'Perfumes y fragancias.' },
};

export default function Aroma() {
  return <SeccionTienda datos={DATOS} />;
}
