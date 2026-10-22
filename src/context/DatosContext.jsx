import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { datosIniciales, listarCategorias, listarProductos } from '../services/tienda.js';

const DatosContext = createContext(null);

export function DatosProvider({ children }) {
  const [estado, setEstado] = useState(() => {
    const iniciales = datosIniciales();
    return iniciales ? { ...iniciales, cargando: false, error: null } : { productos: [], categorias: [], cargando: true, error: null };
  });

  const cargar = useCallback(async () => {
    setEstado((e) => ({ ...e, cargando: e.productos.length === 0, error: null }));
    try {
      const [productos, categorias] = await Promise.all([listarProductos(), listarCategorias()]);
      setEstado({ productos, categorias, cargando: false, error: null });
    } catch {
      setEstado((e) => ({ ...e, cargando: false, error: 'No pudimos cargar los productos. Revisa tu conexión y vuelve a intentarlo.' }));
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const valor = useMemo(() => ({
    ...estado,
    reintentar: cargar,
    productoPorId: (id) => estado.productos.find((p) => p.id === id),
    categoriaPorId: (id) => estado.categorias.find((c) => c.id === id),
  }), [estado, cargar]);

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

export const useDatos = () => useContext(DatosContext);
