// Datos estructurados de un producto (schema.org/Product): Google puede mostrar precio y disponibilidad en los resultados.
import { SITIO } from '../data/sitio.js';
import { rutaWeb } from './fotos.js';
import { precioDe } from './catalogo.js';

const dinero = (centavos) => (centavos / 100).toFixed(2);

export function datosProducto(p) {
  const url = `${SITIO.url}/producto/${p.slug ?? p.id}`;
  const imagenes = (p.fotos ?? []).map((f) => (/^https?:/.test(f.src) ? f.src : `${SITIO.url}/${encodeURI(rutaWeb(f.src, 1280))}`));
  const precios = (p.variantes?.length ? p.variantes.map((v) => precioDe(p, v)) : [p.precioCentavos]).filter((x) => x != null);
  // Agotado; por pedido (más de SITIO.porPedidoDesde, llega en días); o en existencia.
  const disponibilidad = p.stock === 0 ? 'OutOfStock' : Math.min(...precios) > SITIO.porPedidoDesde ? 'BackOrder' : 'InStock';
  const oferta = { priceCurrency: 'USD', availability: `https://schema.org/${disponibilidad}`, url, seller: { '@type': 'Organization', name: SITIO.nombre } };
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    description: p.descripcion,
    sku: p.id,
    ...(imagenes.length && { image: imagenes }),
    ...(p.marca && { brand: { '@type': 'Brand', name: p.marca } }),
    ...(precios.length && {
      offers: new Set(precios).size > 1
        ? { '@type': 'AggregateOffer', lowPrice: dinero(Math.min(...precios)), highPrice: dinero(Math.max(...precios)), offerCount: precios.length, ...oferta }
        : { '@type': 'Offer', price: dinero(precios[0]), ...oferta },
    }),
  };
}
