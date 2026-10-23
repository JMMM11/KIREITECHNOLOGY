import { useState } from 'react';
import Campo from '../ui/Campo.jsx';
import Foto from '../ui/Foto.jsx';
import { CATEGORIAS } from '../../data/catalogos.js';
import { borrarProducto, guardarProducto, subirFoto } from '../../services/admin.js';
import { aCentavos, idDesdeNombre, reordenarFotos } from './editor.js';
import s from './Admin.module.css';

export const NUEVO = {
  nombre: '', categoriaId: CATEGORIAS[0].id, precioCentavos: null, precioAntesCentavos: null, stock: null,
  estado: 'borrador', destacado: false, nuevo: true, descripcion: '', fotos: [], tono: 'foto', licencia: null,
};

const aTexto = (c) => (c == null ? '' : (c / 100).toFixed(2));

export default function EditorProducto({ producto, existentes, alTerminar }) {
  const esNuevo = producto === NUEVO;
  const [f, setF] = useState(() => ({
    nombre: producto.nombre, categoriaId: producto.categoriaId, marca: producto.marca ?? '',
    precio: aTexto(producto.precioCentavos), antes: aTexto(producto.precioAntesCentavos), stock: producto.stock == null ? '' : String(producto.stock),
    estado: producto.estado, destacado: Boolean(producto.destacado), nuevo: Boolean(producto.nuevo), descripcion: producto.descripcion ?? '',
    fotos: producto.fotos ?? [], variantes: producto.variantes ?? [],
  }));
  const [err, setErr] = useState({});
  const [subiendo, setSubiendo] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (e) => setF({ ...f, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const cambiarVariante = (i, campo, valor) => setF((x) => ({ ...x, variantes: x.variantes.map((v, j) => (j === i ? { ...v, [campo]: valor } : v)) }));
  const ordenar = (orden) => setF((x) => ({ ...x, ...reordenarFotos(x, orden) }));
  const indices = f.fotos.map((_, i) => i);

  async function subir(e) {
    const archivos = [...e.target.files];
    e.target.value = '';
    setErr((x) => ({ ...x, fotos: undefined }));
    for (const [n, archivo] of archivos.entries()) {
      setSubiendo(`Subiendo ${n + 1} de ${archivos.length}...`);
      try {
        const foto = await subirFoto(archivo);
        setF((x) => ({ ...x, fotos: [...x.fotos, foto] }));
      } catch (error) {
        setErr((x) => ({ ...x, fotos: error.message }));
        break;
      }
    }
    setSubiendo('');
  }

  async function guardar(e) {
    e.preventDefault();
    const precio = aCentavos(f.precio);
    const antes = aCentavos(f.antes);
    const stock = f.stock.trim() === '' ? null : Number(f.stock);
    const id = esNuevo ? idDesdeNombre(f.nombre) : producto.id;
    const nuevoErr = {};
    if (!f.nombre.trim()) nuevoErr.nombre = 'Escribe el nombre.';
    else if (esNuevo && (!id || existentes.includes(id))) nuevoErr.nombre = 'Ya existe un producto con ese nombre.';
    if (Number.isNaN(precio)) nuevoErr.precio = 'Escribe un monto como 20.00.';
    if (Number.isNaN(antes)) nuevoErr.antes = 'Escribe un monto como 25.00.';
    if (stock !== null && !(Number.isInteger(stock) && stock >= 0)) nuevoErr.stock = 'Escribe un número entero, 0 o más.';
    setErr(nuevoErr);
    if (Object.keys(nuevoErr).length) return;

    const variantes = f.variantes.filter((v) => v.nombre.trim()).map((v) => ({ ...v, id: idDesdeNombre(v.nombre), nombre: v.nombre.trim(), stock: v.stock ?? null }));
    setGuardando(true);
    try {
      // ...producto conserva los campos que el panel no edita (licencia, tono, proveedorUrl).
      await guardarProducto({
        ...producto, id,
        nombre: f.nombre.trim(), categoriaId: f.categoriaId, marca: f.marca.trim() || undefined,
        precioCentavos: precio, precioAntesCentavos: antes, stock,
        estado: f.estado, destacado: f.destacado, nuevo: f.nuevo, descripcion: f.descripcion.trim(), fotos: f.fotos,
        variantes: variantes.length ? variantes : undefined,
        opcion: variantes.length ? (producto.opcion ?? 'Color') : undefined,
      });
      alTerminar(true);
    } catch {
      setErr({ general: 'No se pudo guardar. Revisa tu conexión y vuelve a intentarlo.' });
      setGuardando(false);
    }
  }

  async function eliminar() {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? No se puede deshacer.`)) return;
    try { await borrarProducto(producto.id); alTerminar(true); } catch { setErr({ general: 'No se pudo eliminar.' }); }
  }

  return (
    <form className={s.editor} onSubmit={guardar} noValidate>
      <div className={s.cabecera}>
        <h1 className="titulo">{esNuevo ? 'Nuevo producto' : 'Editar producto'}</h1>
        <button type="button" className="btn btn-fantasma" onClick={() => alTerminar(false)}>Volver</button>
      </div>

      <div className={s.rejilla}>
        <Campo etiqueta="Nombre" value={f.nombre} onChange={cambiar('nombre')} error={err.nombre} />
        <Campo etiqueta="Categoría" como="select" value={f.categoriaId} onChange={cambiar('categoriaId')}>
          {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </Campo>
        <Campo etiqueta="Marca" opcional value={f.marca} onChange={cambiar('marca')} />
        <Campo etiqueta="Estado" como="select" value={f.estado} onChange={cambiar('estado')} ayuda="Borrador: no sale en la tienda.">
          <option value="publicado">Publicado</option>
          <option value="borrador">Borrador</option>
        </Campo>
        <Campo etiqueta="Precio (US$)" inputMode="decimal" placeholder="20.00" value={f.precio} onChange={cambiar('precio')} error={err.precio} ayuda="Vacío: sale como precio pendiente." />
        <Campo etiqueta="Precio antes (US$)" opcional inputMode="decimal" value={f.antes} onChange={cambiar('antes')} error={err.antes} ayuda="Si es mayor que el precio, sale como oferta." />
        <Campo etiqueta="Unidades disponibles" opcional inputMode="numeric" value={f.stock} onChange={cambiar('stock')} error={err.stock} ayuda="0 = agotado. Vacío = sin contar." />
        <div className={s.casillas}>
          <label><input type="checkbox" checked={f.destacado} onChange={cambiar('destacado')} /> Destacado en el inicio</label>
          <label><input type="checkbox" checked={f.nuevo} onChange={cambiar('nuevo')} /> Marcar como nuevo</label>
        </div>
      </div>

      <Campo etiqueta="Descripción" como="textarea" rows={4} value={f.descripcion} onChange={cambiar('descripcion')} />

      <fieldset className={s.grupo}>
        <legend className="leyenda">Fotos</legend>
        <p className="ayuda">La primera es la principal. Se suben a Cloudinary y se entregan livianas.</p>
        {f.fotos.length > 0 && (
          <ul className={s.fotos}>
            {f.fotos.map((foto, i) => (
              <li key={foto.src ?? foto.base ?? i} className={s.foto}>
                <span className={s.fotoMarco}><Foto foto={foto} sizes="120px" /></span>
                <span className="chico">{i === 0 ? 'Principal' : `Foto ${i + 1}`}</span>
                {i > 0 && <button type="button" className={s.enlaceBoton} onClick={() => ordenar([i, ...indices.filter((j) => j !== i)])}>Hacer principal</button>}
                <button type="button" className={s.enlaceBoton} onClick={() => ordenar(indices.filter((j) => j !== i))}>Quitar</button>
              </li>
            ))}
          </ul>
        )}
        <label className={`btn btn-fantasma ${s.subir}`}>
          {subiendo || 'Agregar fotos'}
          <input type="file" accept="image/*" multiple onChange={subir} disabled={Boolean(subiendo)} className="sr-only" />
        </label>
        {err.fotos && <p className="error-campo" role="alert">{err.fotos}</p>}
      </fieldset>

      <fieldset className={s.grupo}>
        <legend className="leyenda">Colores</legend>
        <p className="ayuda">Opcional. Cada color puede abrir con una de las fotos.</p>
        {f.variantes.map((v, i) => (
          <div key={i} className={s.variante}>
            <Campo etiqueta="Color" value={v.nombre} onChange={(e) => cambiarVariante(i, 'nombre', e.target.value)} />
            <label className={s.muestra}>
              Muestra
              <input type="color" value={v.muestra ?? '#1E1E1E'} onChange={(e) => cambiarVariante(i, 'muestra', e.target.value)} />
            </label>
            <Campo etiqueta="Foto" como="select" value={v.foto ?? ''} onChange={(e) => cambiarVariante(i, 'foto', e.target.value === '' ? null : Number(e.target.value))}>
              <option value="">Sin foto</option>
              {indices.map((j) => <option key={j} value={j}>Foto {j + 1}</option>)}
            </Campo>
            <button type="button" className={s.enlaceBoton} onClick={() => setF((x) => ({ ...x, variantes: x.variantes.filter((_, j) => j !== i) }))}>Quitar</button>
          </div>
        ))}
        <button type="button" className="btn btn-fantasma" onClick={() => setF((x) => ({ ...x, variantes: [...x.variantes, { nombre: '', muestra: '#1E1E1E', foto: null }] }))}>
          Agregar color
        </button>
      </fieldset>

      {err.general && <p className="error-campo" role="alert">{err.general}</p>}
      <div className={s.acciones}>
        <button className="btn btn-marca" disabled={guardando || Boolean(subiendo)}>{guardando ? 'Guardando...' : 'Guardar'}</button>
        {!esNuevo && <button type="button" className={`btn btn-fantasma ${s.peligro}`} onClick={eliminar}>Eliminar producto</button>}
      </div>
    </form>
  );
}
