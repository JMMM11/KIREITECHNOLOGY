import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDatos } from './DatosContext.jsx';
import { contarArticulos } from '../lib/totales.js';

const CarritoContext = createContext(null);
const CLAVE = 'kirei-carrito';

const leer = () => {
  try { return JSON.parse(localStorage.getItem(CLAVE)) ?? []; } catch { return []; }
};

export const variantesDe = (p) => p.variantes ?? [{ id: 'unica', nombre: '', stock: p.stock ?? null }];
// shortcut: tope de 10 por línea mientras no haya stock real; cambiar cuando el panel cargue existencias
export const topeCantidad = (stock) => (stock == null ? 10 : stock);

export function CarritoProvider({ children }) {
  const { productos } = useDatos();
  const [lineas, setLineas] = useState(leer);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(CLAVE, JSON.stringify(lineas)); } catch { /* modo privado: el carrito dura mientras la pestaña esté abierta */ }
  }, [lineas]);

  // Detalle con precio actual del catálogo; se ignoran productos que ya no se venden o sin precio.
  const detalle = useMemo(() => lineas.flatMap((l) => {
    const p = productos.find((x) => x.id === l.productoId);
    if (!p || p.precioCentavos == null) return [];
    const v = variantesDe(p).find((x) => x.id === l.variante);
    if (!v) return [];
    const foto = p.fotos[v.foto ?? 0] ?? null;
    return [{
      clave: `${p.id}:${v.id}`, productoId: p.id, variante: v.id, varianteNombre: v.nombre,
      nombre: p.nombre, precio: p.precioCentavos, cantidad: l.cantidad, foto, tono: p.tono,
      tope: topeCantidad(v.stock ?? p.stock), ejemplo: !!p.ejemplo,
    }];
  }), [lineas, productos]);

  const agregar = useCallback((productoId, variante, cantidad = 1) => {
    setLineas((ls) => {
      const p = productos.find((x) => x.id === productoId);
      const v = variantesDe(p).find((x) => x.id === variante);
      const tope = topeCantidad(v?.stock ?? p?.stock);
      const existente = ls.find((l) => l.productoId === productoId && l.variante === variante);
      if (existente) return ls.map((l) => (l === existente ? { ...l, cantidad: Math.min(tope, l.cantidad + cantidad) } : l));
      return [...ls, { productoId, variante, cantidad: Math.min(tope, cantidad) }];
    });
  }, [productos]);

  const cambiarCantidad = useCallback((clave, cantidad) => {
    setLineas((ls) => ls
      .map((l) => (`${l.productoId}:${l.variante}` === clave ? { ...l, cantidad } : l))
      .filter((l) => l.cantidad > 0));
  }, []);

  const quitar = useCallback((clave) => cambiarCantidad(clave, 0), [cambiarCantidad]);
  const vaciar = useCallback(() => setLineas([]), []);

  const valor = useMemo(() => ({
    lineas: detalle,
    articulos: contarArticulos(detalle),
    subtotal: detalle.reduce((s, l) => s + l.precio * l.cantidad, 0),
    agregar, cambiarCantidad, quitar, vaciar,
    abierto, abrir: () => setAbierto(true), cerrar: () => setAbierto(false),
  }), [detalle, agregar, cambiarCantidad, quitar, vaciar, abierto]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export const useCarrito = () => useContext(CarritoContext);
