// La tienda tiene dos secciones. Cada categoría pertenece a una. El ícono se resuelve en components/iconos.js por id.
export const SECCIONES = [
  { id: 'tecnologia', nombre: 'Tecnología', frase: 'Audífonos, relojes, cargadores y accesorios de PC', ruta: '/tecnologia' },
  { id: 'anime', nombre: 'Anime', frase: 'Accesorios de tus series favoritas', ruta: '/anime' },
];

export const CATEGORIAS = [
  { id: 'audifonos', seccion: 'tecnologia', nombre: 'Audífonos', frase: 'Inalámbricos, gaming y ediciones especiales', orden: 1, visible: true },
  { id: 'relojes', seccion: 'tecnologia', nombre: 'Relojes', frase: 'Inteligentes y de bolsillo, con correas de malla y metal', orden: 2, visible: true },
  { id: 'cargadores', seccion: 'tecnologia', nombre: 'Cargadores y power banks', frase: 'Energía para llevar', orden: 3, visible: false },
  { id: 'accesorios-pc', seccion: 'tecnologia', nombre: 'Accesorios', frase: 'Soportes y más para tu escritorio', orden: 4, visible: true },
  { id: 'anime', seccion: 'anime', nombre: 'Anime', frase: 'Accesorios de tus series favoritas', orden: 5, visible: true },
];

export const ORDENES = [
  { id: 'relevancia', nombre: 'Destacados primero' },
  { id: 'precio-asc', nombre: 'Precio: menor a mayor' },
  { id: 'precio-desc', nombre: 'Precio: mayor a menor' },
  { id: 'nombre', nombre: 'Nombre: A a Z' },
];

export const DISPOSITIVOS = ['Laptop', 'PC de escritorio', 'Otro'];
