import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { conFirebase } from '../services/tienda.js';

const CuentaContext = createContext(null);
const cuenta = () => import('../services/cuenta.js');
const armar = (u, datos) => ({ nombre: u.displayName ?? '', telefono: '', direcciones: [], favoritos: [], ...datos });

// Sesión del cliente. Firebase Auth se descarga después de pintar la tienda, así no retrasa la primera vista.
// usuario: undefined = comprobando, null = sin sesión.
export function CuentaProvider({ children }) {
  const [usuario, setUsuario] = useState(conFirebase ? undefined : null);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    if (!conFirebase) return undefined;
    let vivo = true;
    let soltar = () => {};
    cuenta().then((m) => {
      if (!vivo) return;
      soltar = m.vigilar(async (u) => {
        setPerfil(u ? armar(u, await m.leerPerfil(u.uid).catch(() => null)) : null);
        setUsuario(u);
      });
    });
    return () => { vivo = false; soltar(); };
  }, []);

  // Al registrarse, la sesión llega antes que el perfil: se vuelve a leer al terminar.
  const recargarPerfil = useCallback(async () => {
    const m = await cuenta();
    const u = m.actual();
    if (u) setPerfil(armar(u, await m.leerPerfil(u.uid).catch(() => null)));
  }, []);

  const actualizarPerfil = useCallback(async (datos) => {
    await (await cuenta()).guardarPerfil(usuario.uid, datos);
    setPerfil((p) => ({ ...p, ...datos }));
  }, [usuario]);

  // Cambia al instante y deshace si Firebase falla. Sin sesión devuelve false para mandar a /cuenta.
  const alternarFavorito = useCallback(async (id) => {
    if (!usuario) return false;
    const poner = !perfil.favoritos.includes(id);
    const cambiar = (agregar) => setPerfil((p) => ({ ...p, favoritos: agregar ? [...p.favoritos, id] : p.favoritos.filter((x) => x !== id) }));
    cambiar(poner);
    try { await (await cuenta()).marcarFavorito(usuario.uid, id, poner); } catch { cambiar(!poner); }
    return true;
  }, [usuario, perfil]);

  const valor = useMemo(() => ({
    usuario, perfil, actualizarPerfil, recargarPerfil, alternarFavorito, cuenta,
    esFavorito: (id) => Boolean(perfil?.favoritos.includes(id)),
  }), [usuario, perfil, actualizarPerfil, recargarPerfil, alternarFavorito]);

  return <CuentaContext.Provider value={valor}>{children}</CuentaContext.Provider>;
}

export const useCuenta = () => useContext(CuentaContext);
