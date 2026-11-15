// STEP -> OBJ con un objeto por pieza (nombre del CAD). Uso: node step2obj.cjs entrada.stp salida.obj [deflexion]
const fs = require('fs');
const occt = require('occt-import-js');
const [,, entrada, salida, defl = '0.1'] = process.argv;
(async () => {
  const o = await occt();
  const r = o.ReadStepFile(new Uint8Array(fs.readFileSync(entrada)), { linearUnit: 'millimeter', linearDeflectionType: 'absolute_value', linearDeflection: +defl, angularDeflection: 0.35 });
  if (!r.success) throw new Error('no se pudo leer');
  const nombres = new Map();
  (function rec(n, ruta) { for (const m of n.meshes) nombres.set(m, [...ruta, n.name].filter(Boolean).join('/')); for (const c of n.children) rec(c, [...ruta, n.name]); })(r.root, []);
  const out = fs.createWriteStream(salida); let base = 1, tri = 0; const resumen = [];
  r.meshes.forEach((m, i) => {
    const p = m.attributes.position.array, n = m.attributes.normal?.array, idx = m.index.array;
    const nombre = (nombres.get(i) || m.name || 'pieza').replace(/\s+/g, '_') + '#' + i;
    let s = `o ${nombre}\n`;
    for (let k = 0; k < p.length; k += 3) s += `v ${p[k]} ${p[k + 1]} ${p[k + 2]}\n`;
    if (n) for (let k = 0; k < n.length; k += 3) s += `vn ${n[k]} ${n[k + 1]} ${n[k + 2]}\n`;
    for (let k = 0; k < idx.length; k += 3) { const [a, b, c] = [idx[k] + base, idx[k + 1] + base, idx[k + 2] + base]; s += n ? `f ${a}//${a} ${b}//${b} ${c}//${c}\n` : `f ${a} ${b} ${c}\n`; }
    out.write(s); base += p.length / 3; tri += idx.length / 3;
    let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (let k = 0; k < p.length; k += 3) for (let a = 0; a < 3; a++) { mn[a] = Math.min(mn[a], p[k + a]); mx[a] = Math.max(mx[a], p[k + a]); }
    resumen.push({ nombre, tri: idx.length / 3, min: mn.map((v) => +v.toFixed(1)), max: mx.map((v) => +v.toFixed(1)), color: m.color });
  });
  out.end();
  fs.writeFileSync(salida + '.json', JSON.stringify(resumen));
  console.log('piezas', r.meshes.length, 'triangulos', tri);
})();
