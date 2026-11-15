# Arma la laptop del taller para la web. Uso: blender -b -P construir.py -- <scratchpad> <salida.glb> [previas]
# Fuente del chasis, la pantalla, el teclado, las tarjetas, las bisagras y la batería: CAD oficial de Framework Laptop 13
# (github.com/FrameworkComputer/Framework-Laptop-13, CC BY 4.0), convertido de STEP con occt-import-js.
# Modelado aquí (el CAD publicado no lo trae): placa base, CPU, disipador, ventilador, RAM (SO-DIMM 69,6 x 30 mm),
# SSD (M.2 2280), WiFi (M.2 2230), altavoces y tornillos. Medidas de los estándares; la distribución sigue la del equipo real.
# Coordenadas de autor = las del CAD, en mm: x derecha, y arriba, z desde la bisagra (0) hacia el frente (229).
import bpy, bmesh, sys, math, re
from mathutils import Vector, Matrix

args = sys.argv[sys.argv.index('--') + 1:]
S, SALIDA = args[0], args[1]
PREVIAS = len(args) > 2

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
B = lambda x, y, z: Vector((x, -z, y))  # CAD -> Blender (Z arriba)

# ---------- materiales ----------
def mat(nombre, color, metal=0.0, rugoso=0.5, emision=None):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*color, 1); p.inputs['Metallic'].default_value = metal; p.inputs['Roughness'].default_value = rugoso
    if emision: p.inputs['Emission Color'].default_value = (*emision, 1); p.inputs['Emission Strength'].default_value = 1
    m.diffuse_color = (*color, 1); m.metallic = metal; m.roughness = rugoso
    return m

M = dict(
    aluminio=mat('Aluminio', (0.66, 0.67, 0.69), 1, 0.38),
    aluminio_osc=mat('AluminioOscuro', (0.2, 0.21, 0.23), 1, 0.45),
    tecla=mat('Tecla', (0.018, 0.019, 0.021), 0, 0.62),
    plastico=mat('PlasticoNegro', (0.025, 0.027, 0.03), 0, 0.5),
    vidrio=mat('VidrioPantalla', (0.01, 0.011, 0.013), 0, 0.08),
    lcd=mat('PanelLCD', (0.006, 0.007, 0.009), 0, 0.12),
    trackpad=mat('Trackpad', (0.6, 0.61, 0.63), 0.6, 0.3),
    pcb=mat('PCB', (0.022, 0.03, 0.034), 0, 0.5),
    chip=mat('Chip', (0.012, 0.012, 0.014), 0, 0.32),
    dado=mat('DadoCPU', (0.3, 0.32, 0.36), 1, 0.12),
    oro=mat('Oro', (1.0, 0.72, 0.3), 1, 0.3),
    cobre=mat('Cobre', (0.86, 0.45, 0.26), 1, 0.34),
    acero=mat('Acero', (0.55, 0.56, 0.58), 1, 0.3),
    celda=mat('CeldaBateria', (0.05, 0.052, 0.058), 0.2, 0.42),
    etiqueta=mat('Etiqueta', (0.78, 0.79, 0.8), 0, 0.6),
    goma=mat('Goma', (0.035, 0.035, 0.038), 0, 0.85),
)

# ---------- utilidades de malla ----------
def nuevo(nombre, bm, material=None):
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(nombre, me); sc.collection.objects.link(o)
    if material: me.materials.append(material)
    return o

def caja(nombre, centro, tam, material, bisel=0.0):
    """centro y tam en coordenadas CAD (x, y, z)."""
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1)
    sx, sy, sz = tam
    bmesh.ops.scale(bm, vec=(sx, sz, sy), verts=bm.verts)
    if bisel: bmesh.ops.bevel(bm, geom=bm.edges[:], offset=bisel, segments=2, affect='EDGES', profile=0.5)
    bmesh.ops.translate(bm, vec=B(*centro), verts=bm.verts)
    return nuevo(nombre, bm, material)

def cilindro(nombre, centro, r, alto, material, seg=28, r2=None):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=alto)
    bmesh.ops.translate(bm, vec=B(*centro), verts=bm.verts)
    return nuevo(nombre, bm, material)

def anillo(nombre, centro, r_ext, r_int, alto, material, seg=48):
    bm = bmesh.new(); cap = []
    for r, z in ((r_ext, -alto / 2), (r_ext, alto / 2), (r_int, alto / 2), (r_int, -alto / 2)):
        cap.append([bm.verts.new((r * math.cos(2 * math.pi * i / seg), r * math.sin(2 * math.pi * i / seg), z)) for i in range(seg)])
    for a in range(4):
        u, v = cap[a], cap[(a + 1) % 4]
        for i in range(seg): bm.faces.new((u[i], u[(i + 1) % seg], v[(i + 1) % seg], v[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.translate(bm, vec=B(*centro), verts=bm.verts)
    return nuevo(nombre, bm, material)

def prisma(nombre, poligono, y0, alto, material):
    """poligono: lista de (x, z) CAD; se extruye de y0 a y0 + alto."""
    bm = bmesh.new(); vs = [bm.verts.new(B(x, y0, z)) for x, z in poligono]
    f = bm.faces.new(vs); r = bmesh.ops.extrude_face_region(bm, geom=[f])
    bmesh.ops.translate(bm, vec=(0, 0, alto), verts=[e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return nuevo(nombre, bm, material)

def redondear(puntos, radio, pasos=6):
    """Polilínea (x, z) con las esquinas en arco."""
    out = [Vector(puntos[0])]
    for i in range(1, len(puntos) - 1):
        a, b, c = Vector(puntos[i - 1]), Vector(puntos[i]), Vector(puntos[i + 1])
        d1, d2 = (a - b).normalized(), (c - b).normalized()
        r = min(radio, (a - b).length / 2, (c - b).length / 2)
        p1, p2 = b + d1 * r, b + d2 * r
        for k in range(pasos + 1):
            t = k / pasos; out.append((1 - t) ** 2 * p1 + 2 * (1 - t) * t * b + t ** 2 * p2)
    out.append(Vector(puntos[-1])); return out

def cinta(nombre, puntos, ancho, y0, alto, material, radio=6):
    """Tira plana (heat pipe, cable flex) que sigue una polilínea (x, z) CAD."""
    pts = redondear(puntos, radio); bm = bmesh.new(); secc = []
    for i, p in enumerate(pts):
        t = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized(); n = Vector((-t.y, t.x)) * ancho / 2
        l, r = p + n, p - n
        secc.append([bm.verts.new(B(l.x, y0, l.y)), bm.verts.new(B(r.x, y0, r.y)), bm.verts.new(B(r.x, y0 + alto, r.y)), bm.verts.new(B(l.x, y0 + alto, l.y))])
    for a, b in zip(secc, secc[1:]):
        for k in range(4): bm.faces.new((a[k], a[(k + 1) % 4], b[(k + 1) % 4], b[k]))
    bm.faces.new(secc[0]); bm.faces.new(secc[-1][::-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return nuevo(nombre, bm, material)

def activar(objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]

def unir(objs, nombre):
    objs = [o for o in objs if o]
    activar(objs)
    if len(objs) > 1: bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active; o.name = nombre; o.data.name = nombre
    return o

def centrar(o):
    activar([o]); bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS'); return o

def aligerar(o, angulo=1.2):
    """El CAD viene muy teselado en los redondeos: suelda, disuelve lo coplanar y suaviza."""
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.003)
    bmesh.ops.dissolve_limit(bm, angle_limit=math.radians(angulo), verts=bm.verts, edges=bm.edges, delimit={'NORMAL'})
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(o.data); bm.free()

def reducir(o, proporcion):
    m = o.modifiers.new('d', 'DECIMATE'); m.ratio = proporcion
    activar([o]); bpy.ops.object.modifier_apply(modifier='d')

def suavizar(o, angulo=32):
    for p in o.data.polygons: p.use_smooth = True
    o.data.set_sharp_from_angle(angle=math.radians(angulo))

def pintar(o, material):
    o.data.materials.clear(); o.data.materials.append(material); return o

def vacio(nombre, pos_cad):
    e = bpy.data.objects.new(nombre, None); e.empty_display_size = 10; e.location = B(*pos_cad); sc.collection.objects.link(e); return e

def adoptar(padre, hijos):
    bpy.context.view_layer.update()
    for h in hijos: h.parent = padre; h.matrix_parent_inverse = padre.matrix_world.inverted()

# ---------- 1. CAD oficial ----------
for f in ['fw13', 'battery', 'hinge_l', 'hinge_r']:
    antes = set(bpy.data.objects)
    bpy.ops.wm.obj_import(filepath=f'{S}/fw_cad/{f}.obj')
    for o in set(bpy.data.objects) - antes: o['origen'] = f
num = lambda o: int(re.search(r'#(\d+)', o.name).group(1))
de = lambda origen: {num(o): o for o in bpy.data.objects if o.get('origen') == origen}
fw, bat, hl, hr = de('fw13'), de('battery'), de('hinge_l'), de('hinge_r')
for o in list(bpy.data.objects): o.data.materials.clear(); aligerar(o)

toma = lambda d, ids: [d.pop(i) for i in ids if i in d]
# Base: carcasa inferior con su marco, tapa de bisagra, pestillos y testigos de las tarjetas.
base = pintar(unir(toma(fw, [88, 4, 91, 97, 5, 6, 89, 90]), 'Base'), M['aluminio'])
tarjetas = [pintar(o, M['aluminio']) for o in toma(fw, [2, 0, 1, 3])]
for i, o in enumerate(tarjetas): o.name = o.data.name = f'TarjetaExpansion{i + 1}'
# Cubierta del teclado (lo que Framework llama Input Cover): placa, 78 teclas, trackpad y botón de encendido.
cubierta = pintar(toma(fw, [85])[0], M['aluminio']); cubierta.name = cubierta.data.name = 'CubiertaTeclado'
teclas = pintar(unir(toma(fw, list(range(7, 85))), 'Teclas'), M['tecla'])
trackpad = pintar(toma(fw, [86])[0], M['trackpad']); trackpad.name = trackpad.data.name = 'Trackpad'
boton = pintar(toma(fw, [87])[0], M['aluminio_osc']); boton.name = boton.data.name = 'BotonEncendido'
# Pantalla: tapa, bisel con sus piezas, panel y logo; los soportes de bisagra giran con ella.
tapa = pintar(unir(toma(fw, [92, 98, 99]) + toma(hl, [0, 1, 2]) + toma(hr, [0, 1, 2]), 'TapaPantalla'), M['aluminio'])
logo = pintar(toma(fw, [104])[0], M['aluminio_osc']); logo.name = logo.data.name = 'Logo'
bisel = pintar(unir(toma(fw, [95, 96, 100, 101, 102, 103, 105, 106]), 'Bisel'), M['plastico'])
panel = pintar(unir(toma(fw, [94, 93]), 'PanelLCD'), M['lcd'])
# Batería oficial (4 celdas, marco, placa de protección, cable y tornillos cautivos).
celdas = pintar(unir(toma(bat, [2, 3, 4, 5]), 'celdas'), M['celda'])
marco = pintar(unir(toma(bat, [0, 7]), 'marco'), M['plastico'])
etiq = pintar(toma(bat, [6])[0], M['celda'])
placa_bat = pintar(unir(toma(bat, [1, 16, 42]), 'pcm'), M['pcb'])
cable_bat = pintar(unir(toma(bat, [8, 9, 10, 14]), 'cable'), M['plastico'])
torn_bat = pintar(unir(toma(bat, [11, 12, 13, 39, 40, 41]), 'tb'), M['acero'])
for d in (fw, bat, hl, hr):
    for o in d.values(): bpy.data.objects.remove(o, do_unlink=True)  # piezas diminutas o de pose distinta (bisagra abierta)
bateria = unir([celdas, marco, etiq, placa_bat, cable_bat, torn_bat], 'Bateria')

# ---------- 2. Piezas modeladas ----------
Y_PCB = -9.2      # cara superior de la placa
T_PCB = 0.9

# Placa base: contorno entre las bahías de las tarjetas, con el entrante del conector de batería.
placa = prisma('placa', [(-116, 16), (116, 16), (116, 112), (58, 112), (58, 123), (-116, 123)], Y_PCB - T_PCB, T_PCB, M['pcb'])
partes = [placa]
def comp(centro_xz, tam_xz, alto, material, bisel=0.15, y=Y_PCB):
    (x, z), (sx, sz) = centro_xz, tam_xz
    o = caja('c', (x, y + alto / 2, z), (sx, alto, sz), material, bisel); partes.append(o); return o
# CPU: sustrato y dado (queda a la vista cuando sale el disipador).
comp((0, 50), (40, 24), 0.7, M['pcb']); comp((0, 50), (15, 10), 1.3, M['dado'], 0.08)
# Integrados, bobinas y condensadores alrededor del CPU.
for x, z, sx, sz, h in [(-22, 82, 9, 9, 0.9), (-8, 84, 7, 7, 0.9), (8, 86, 12, 8, 1.0), (26, 80, 6, 6, 0.9), (38, 96, 10, 10, 1.0), (-30, 100, 5, 5, 0.8),
                        (20, 100, 14, 6, 0.9), (-104, 60, 6, 9, 0.9), (104, 24, 6, 6, 0.9), (48, 104, 8, 5, 0.8)]:
    comp((x, z), (sx, sz), h, M['chip'])
for i in range(6): comp((-24 + i * 9.6, 70), (7, 7), 3.0, M['chip'], 0.5)             # bobinas de la fase de potencia
for i in range(7): partes.append(cilindro('cap', (-28 + i * 9.3, Y_PCB + 0.9, 24), 1.9, 1.8, M['aluminio_osc'], 14))
# Receptáculos USB-C donde enchufan las tarjetas de expansión (uno por bahía).
for x in (-113.5, 113.5):
    for z in (42.8, 83.4): comp((x, z), (7.5, 9), 3.2, M['acero'], 0.6)
# Zócalos: dos SO-DIMM, M.2 del SSD, M.2 del WiFi y conector de batería.
comp((34.5, 56), (5, 71), 4.2, M['plastico'], 0.3); comp((70.5, 56), (5, 71), 4.2, M['plastico'], 0.3)
comp((-111, 100), (5, 23), 3.6, M['plastico'], 0.3); comp((111, 104), (5, 23), 3.6, M['plastico'], 0.3)
comp((-78, 119.5), (22, 5), 2.2, M['plastico'], 0.2)
partes += [cilindro('sep', (-28.5, Y_PCB + 1.0, 100), 2.4, 2.0, M['oro'], 16), cilindro('sep', (79, Y_PCB + 1.0, 104), 2.4, 2.0, M['oro'], 16)]
placa = unir(partes, 'PlacaBase')

def modulo(nombre, centro, largo_x, ancho_z, chips, contacto='izq', etiqueta=None):
    """Módulo de borde dorado (SO-DIMM o M.2): tarjeta, contactos, chips y etiqueta."""
    x, z = centro; y = Y_PCB + 2.2; p = [caja('m', (x, y, z), (largo_x, 1.0, ancho_z), M['pcb'], 0.1)]
    if contacto == 'izq': p.append(caja('m', (x - largo_x / 2 + 1.2, y, z), (2.4, 1.08, ancho_z - 3), M['oro']))
    for cx, cz, sx, sz in chips: p.append(caja('m', (x + cx, y + 0.95, z + cz), (sx, 0.9, sz), M['chip'], 0.12))
    if etiqueta: cx, cz, sx, sz = etiqueta; p.append(caja('m', (x + cx, y + 0.56, z + cz), (sx, 0.1, sz), M['etiqueta']))
    return unir(p, nombre)
# SO-DIMM: 69,6 x 30 mm, contactos en el lado largo. Aquí el lado largo va en z y los contactos miran al zócalo (x menor).
def sodimm(nombre, x0, z=56):
    x = x0 + 15; y = Y_PCB + 2.2
    p = [caja('m', (x, y, z), (30, 1.0, 69.6), M['pcb'], 0.1), caja('m', (x - 13.8, y, z), (2.4, 1.08, 66), M['oro'])]
    for i in range(4): p.append(caja('m', (x + 2, y + 0.95, z - 25.5 + i * 17), (11, 0.9, 9.5), M['chip'], 0.12))
    p.append(caja('m', (x + 11.5, y + 0.56, z), (5.5, 0.1, 40), M['etiqueta']))
    return unir(p, nombre)
ram1, ram2 = sodimm('RAM1', 37), sodimm('RAM2', 73)
# Clips metálicos de los zócalos de RAM (se quedan en la placa).
clips = [caja('clip', (x + 15, Y_PCB + 1.4, 56 + s * 35.6), (30, 2.4, 1.0), M['acero'], 0.2) for x in (37, 73) for s in (-1, 1)]
placa = unir([placa] + clips, 'PlacaBase')
ssd = modulo('SSD', (-68.5, 100), 80, 22, [(-22, 0, 12, 12), (2, 0, 13, 17), (20, 0, 13, 17)], etiqueta=(31, 0, 9, 16))
wifi = modulo('WiFi', (94, 104), 30, 22, [(1, 0, 19, 16)], etiqueta=None)
wifi = unir([wifi, cilindro('w', (106, Y_PCB + 3.4, 99), 1.0, 0.9, M['oro'], 12), cilindro('w', (106, Y_PCB + 3.4, 109), 1.0, 0.9, M['oro'], 12)], 'WiFi')

# Disipador: placa fría sobre el CPU, dos heat pipes y el bloque de aletas junto a la salida de aire de la bisagra.
Y_D = Y_PCB + 1.45
dis = [caja('d', (0, Y_D + 0.6, 50), (36, 1.2, 30), M['cobre'], 0.25)]
dis += [cilindro('d', (sx * 15.5, Y_D + 1.5, 50 + sz * 12.5), 1.7, 1.0, M['acero'], 14) for sx in (-1, 1) for sz in (-1, 1)]
dis += [cinta('d', [(14, 44), (-22, 44), (-34, 22), (-92, 22)], 6.5, Y_D + 1.2, 1.7, M['cobre'], 9),
        cinta('d', [(14, 55), (-18, 55), (-27, 30.5), (-92, 30.5)], 6.5, Y_D + 1.2, 1.7, M['cobre'], 9)]
dis += [caja('d', (-92 + i * 2.05, Y_PCB + 3.4, 26), (0.35, 6.4, 19), M['aluminio']) for i in range(30)]
disipador = unir(dis, 'Disipador')
# Ventilador: carcasa de turbina con toma circular y rotor aparte para que gire.
FX, FZ, Y_F = -62, 64, Y_PCB + 0.3
vent = [anillo('v', (FX, Y_F + 2.9, FZ), 28.5, 27.3, 5.8, M['plastico'], 56), cilindro('v', (FX, Y_F + 0.25, FZ), 28.5, 0.5, M['plastico'], 56),
        anillo('v', (FX, Y_F + 5.55, FZ), 28.5, 19.5, 0.5, M['aluminio_osc'], 56), caja('v', (FX, Y_F + 2.9, FZ - 26), (50, 5.8, 9), M['plastico'], 0.3)]
vent += [cilindro('v', (FX + sx * 27, Y_F + 2.9, FZ + sz * 27), 2.3, 5.8, M['plastico'], 14) for sx, sz in ((-1, 1), (1, 1), (1, -1))]
ventilador = unir(vent, 'Ventilador')
rot = [cilindro('r', (FX, Y_F + 3.0, FZ), 8.5, 4.6, M['plastico'], 32), cilindro('r', (FX, Y_F + 5.35, FZ), 5.5, 0.12, M['etiqueta'], 24)]
for i in range(37):
    a = 2 * math.pi * i / 37
    b = caja('r', (0, 0, 0), (9.5, 4.2, 0.45), M['plastico'])
    b.matrix_world = Matrix.Translation(B(FX + 13.6 * math.cos(a), Y_F + 2.9, FZ + 13.6 * math.sin(a))) @ Matrix.Rotation(-a + math.radians(28), 4, 'Z')
    rot.append(b)
rot.append(anillo('r', (FX, Y_F + 4.9, FZ), 18.6, 17.4, 0.5, M['plastico'], 48))
bpy.context.view_layer.update()
rotor = unir(rot, 'VentiladorRotor')

# Altavoces a los lados de la batería.
def altavoz(nombre, x):
    return unir([caja('a', (x, -7.4, 182), (21, 5.6, 64), M['plastico'], 0.9), caja('a', (x, -4.5, 182), (15, 0.25, 50), M['goma'], 0.1)], nombre)
alt_i, alt_d = altavoz('AltavozIzq', -134.5), altavoz('AltavozDer', 134.5)

# Los cinco tornillos cautivos de la base (Torx T5 en el equipo real).
def tornillo(nombre, x, z):
    return unir([cilindro('t', (x, -13.0, z), 2.3, 0.9, M['acero'], 18), cilindro('t', (x, -10.8, z), 0.95, 3.6, M['acero'], 12)], nombre)
tornillos = [tornillo(f'Tornillo{i + 1}', x, z) for i, (x, z) in enumerate([(-136, 17), (136, 17), (-136, 212), (136, 212), (0, 131)])]

# ---------- 3. Acabado, jerarquía y exportación ----------
piezas = [base, *tarjetas, cubierta, teclas, trackpad, boton, tapa, logo, bisel, panel, bateria, placa, ram1, ram2, ssd, wifi,
          disipador, ventilador, rotor, alt_i, alt_d, *tornillos]
for o, r in ((base, 0.3), (teclas, 0.34), (bateria, 0.16), (tapa, 0.3), (cubierta, 0.55), (bisel, 0.4)): reducir(o, r); aligerar(o, 0.6)   # vuelve a aplanar: sin esto el piso de la carcasa sombrea en abanico
for o in piezas: suavizar(o, 14 if o is base else 32); centrar(o)   # carcasa: ángulo bajo, o el piso reducido sombrea en abanico

raiz = vacio('Laptop', (0, 0, 0))
teclado = vacio('Teclado', (0, -0.9, 114.5)); adoptar(teclado, [cubierta, teclas, trackpad, boton])
pantalla = vacio('Pantalla', (0, -2.6, 5.4)); adoptar(pantalla, [tapa, logo, bisel, panel])   # origen = eje de la bisagra
adoptar(ventilador, [rotor])
adoptar(raiz, [o for o in bpy.data.objects if o.parent is None and o is not raiz])

tri = sum(len(o.data.polygons) for o in piezas)
print('PIEZAS', len(piezas), 'TRIANGULOS', tri)
for o in sorted(piezas, key=lambda o: -len(o.data.polygons))[:8]: print('  ', o.name, len(o.data.polygons))

if PREVIAS:
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
    cam.data.lens = 55; cam.data.clip_end = 9000
    sc.render.engine = 'BLENDER_WORKBENCH'; sh = sc.display.shading
    sh.light = 'STUDIO'; sh.color_type = 'MATERIAL'; sh.show_cavity = True; sh.show_shadows = True; sh.show_specular_highlight = True
    sc.render.resolution_x, sc.render.resolution_y = 1500, 1000
    sc.world = bpy.data.worlds.new('w'); sc.world.color = (0.02, 0.022, 0.026)
    def foto(nombre, pos, objetivo):
        cam.location = B(*pos); cam.rotation_euler = (B(*objetivo) - B(*pos)).to_track_quat('-Z', 'Y').to_euler()
        sc.render.filepath = f'{S}/blend/{nombre}.png'; bpy.ops.render.render(write_still=True)
    pantalla.rotation_euler = (math.radians(-108), 0, 0)
    foto('p_armada', (420, 420, 900), (0, 60, 60))
    # interior: sin la cubierta del teclado
    for o in (cubierta, teclas, trackpad, boton): o.hide_render = True
    foto('p_interior', (0, 560, 330), (0, -6, 112))
    foto('p_interior2', (-260, 230, 300), (-30, -6, 80))
    for o in (cubierta, teclas, trackpad, boton): o.hide_render = False
    foto('p_bisagra', (420, 60, -160), (60, 30, 40))
    pantalla.rotation_euler = (0, 0, 0)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=SALIDA, export_format='GLB', export_apply=True, export_yup=True, export_cameras=False, export_lights=False,
                          export_animations=False, export_texcoords=False, export_materials='EXPORT')
print('GLB', SALIDA)
