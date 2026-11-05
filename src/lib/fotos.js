// Copias livianas de las fotos locales, hechas con scripts/fotos-web.ps1 en la subcarpeta web/ de cada carpeta.
// Las de portada (principal*) tienen anchos más grandes. Los anchos deben coincidir con el script.
export const anchosWeb = (src) => (/(^|\/)principal[^/]*$/.test(src) ? [960, 1920] : [640, 1280]);
export const rutaWeb = (src, ancho) => src.replace(/^(.*\/)?([^/]+)\.[a-z]+$/i, (_, carpeta = '', nombre) => `${carpeta}web/${nombre}-${ancho}.jpg`);
