// La tienda tiene dos secciones. Cada categoría pertenece a una. El ícono se resuelve en components/iconos.js por id.
export const SECCIONES = [
  { id: 'tecnologia', nombre: 'Tecnología', frase: 'Audífonos, relojes, cargadores y accesorios de PC', ruta: '/tecnologia' },
  { id: 'anime', nombre: 'Anime', frase: 'Llaveros, peluches, pines y más', ruta: '/anime' },
];

export const CATEGORIAS = [
  { id: 'audifonos', seccion: 'tecnologia', nombre: 'Audífonos', frase: 'Inalámbricos, gaming y ediciones especiales', orden: 1, visible: true },
  { id: 'relojes', seccion: 'tecnologia', nombre: 'Relojes inteligentes', frase: 'Acero, malla milanesa y oro rosa', orden: 2, visible: true },
  { id: 'cargadores', seccion: 'tecnologia', nombre: 'Cargadores y power banks', frase: 'Energía para llevar', orden: 3, visible: true },
  { id: 'accesorios-pc', seccion: 'tecnologia', nombre: 'Accesorios de PC', frase: 'Mousepads e iluminación para tu escritorio', orden: 4, visible: true },
  { id: 'anime', seccion: 'anime', nombre: 'Anime', frase: 'Llaveros, peluches y pines', orden: 5, visible: true },
];

// Marcas que vende la tienda. "logo" es el archivo en public/marcas (Simple Icons, licencia CC0).
// Cada producto lleva su campo "marca"; la búsqueda también mira ese campo.
export const MARCAS = [
  { nombre: 'Lenovo', logo: 'lenovo' },
  { nombre: 'Xiaomi', logo: 'xiaomi' },
  { nombre: 'Razer', logo: 'razer' },
];

export const ORDENES = [
  { id: 'relevancia', nombre: 'Destacados primero' },
  { id: 'precio-asc', nombre: 'Precio: menor a mayor' },
  { id: 'precio-desc', nombre: 'Precio: mayor a menor' },
  { id: 'nombre', nombre: 'Nombre: A a Z' },
];

export const DISPOSITIVOS = ['Laptop', 'PC de escritorio', 'Otro'];
