# Frasco y caja de la portada de Aroma: 120 cuadros con fondo transparente (la caja se abre y el frasco sube flotando).
# Es un frasco decorativo de Kirei, no un producto en venta. Colores de la paleta: marino, cobre, naranja.
# Uso: blender -b -P scripts/modelo3d/perfume.py -- <carpeta_salida> [ancho] [cuadros: todos | 0,60,119]
import bpy, bmesh, sys, math
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:]
SALIDA = args[0]
ANCHO = int(args[1]) if len(args) > 1 else 1280
CUADROS = None if len(args) < 3 or args[2] == 'todos' else [int(x) for x in args[2].split(',')]

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.frame_start, sc.frame_end = 0, 119

def hexa(h):  # sRGB -> lineal
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)

def mat(nombre, color, metal=0.0, rugoso=0.5, trans=0.0, ior=1.45, emision=None, alfa=1.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*hexa(color), 1)
    p.inputs['Metallic'].default_value = metal; p.inputs['Roughness'].default_value = rugoso
    p.inputs['Transmission Weight'].default_value = trans; p.inputs['IOR'].default_value = ior
    p.inputs['Alpha'].default_value = alfa
    if emision: p.inputs['Emission Color'].default_value = (*hexa(emision[0]), 1); p.inputs['Emission Strength'].default_value = emision[1]
    return m

MARINO = mat('Marino', '#0B1F33', 0.0, 0.42)
MARINO_INT = mat('MarinoInterior', '#16324F', 0.0, 0.6)
COBRE = mat('Cobre', '#B8732A', 1.0, 0.28)
VIDRIO = mat('Vidrio', '#FFFFFF', 0.0, 0.02, trans=1.0, ior=1.5)
LIQUIDO = mat('Liquido', '#E5850F', 0.0, 0.05, trans=1.0, ior=1.34)
ETIQUETA = mat('Etiqueta', '#0B1F33', 0.0, 0.35)
BLANCO = mat('Blanco', '#FFFFFF', 0.0, 0.4)

def caja(nombre, tam, pos, material, bisel=0.0, seg=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    o = bpy.context.object; o.name = nombre; o.scale = tam
    bpy.ops.object.transform_apply(scale=True)
    if bisel:
        m = o.modifiers.new('b', 'BEVEL'); m.width = bisel; m.segments = seg; m.limit_method = 'ANGLE'
    o.data.materials.append(material)
    for p in o.data.polygons: p.use_smooth = True
    return o

def texto(cuerpo, tam, pos, rot, material, grosor=0.004, espacio=1.0):
    bpy.ops.object.text_add(location=pos, rotation=rot)
    t = bpy.context.object; t.data.body = cuerpo; t.data.size = tam; t.data.extrude = grosor
    t.data.align_x = 'CENTER'; t.data.align_y = 'CENTER'; t.data.space_character = espacio
    t.data.materials.append(material)
    return t

def padre(hijos, p):
    for h in hijos:
        h.parent = p; h.matrix_parent_inverse = p.matrix_world.inverted()

# ---------- Caja: base hueca y tapa con bisagra atrás ----------
W, D, H = 1.7, 1.2, 1.36
base = caja('CajaBase', (W, D, H), (0, 0, H / 2), MARINO, 0.012)
hueco = caja('Hueco', (W - 0.1, D - 0.1, H), (0, 0, H / 2 + 0.06), MARINO)
b = base.modifiers.new('hueco', 'BOOLEAN'); b.object = hueco; b.operation = 'DIFFERENCE'
base.modifiers.move(len(base.modifiers) - 1, 0)
hueco.hide_render = hueco.hide_viewport = True
interior = caja('Interior', (W - 0.1, D - 0.1, 0.02), (0, 0, 0.07), MARINO_INT)
frente = -D / 2 - 0.002
texto('KIREI', 0.26, (0, frente, H * 0.56), (math.radians(90), 0, 0), COBRE, 0.003, 1.5)
texto('EAU DE PARFUM', 0.075, (0, frente, H * 0.38), (math.radians(90), 0, 0), COBRE, 0.002, 1.6)

bisagra = bpy.data.objects.new('Bisagra', None); sc.collection.objects.link(bisagra); bisagra.location = (0, D / 2 + 0.02, H)
tapa = caja('Tapa', (W + 0.06, D + 0.06, 0.1), (0, 0.0, H + 0.05), MARINO, 0.012)
logo_tapa = texto('K I R E I', 0.16, (0, -0.05, H + 0.102), (0, 0, 0), COBRE, 0.002, 1.2)
padre([tapa, logo_tapa], bisagra)

# ---------- Frasco: vidrio, líquido ámbar, cuello y tapa de cobre, etiqueta marino ----------
frasco = bpy.data.objects.new('Frasco', None); sc.collection.objects.link(frasco)
FW, FD, FH = 0.66, 0.4, 0.82
cuerpo = caja('Cuerpo', (FW, FD, FH), (0, 0, FH / 2), VIDRIO, 0.06, 6)
liquido = caja('Liquidov', (FW - 0.09, FD - 0.09, FH * 0.72), (0, 0, 0.05 + FH * 0.36), LIQUIDO, 0.035, 4)
bpy.ops.mesh.primitive_cylinder_add(radius=0.085, depth=0.08, location=(0, 0, FH + 0.04)); cuello = bpy.context.object; cuello.data.materials.append(COBRE)
tapon = caja('Tapon', (0.36, 0.3, 0.28), (0, 0, FH + 0.08 + 0.14), COBRE, 0.03, 4)
eti = caja('Etiqueta', (FW * 0.62, 0.006, FH * 0.36), (0, -FD / 2 - 0.004, FH * 0.5), ETIQUETA, 0.004, 2)
t1 = texto('AROMA', 0.085, (0, -FD / 2 - 0.009, FH * 0.53), (math.radians(90), 0, 0), BLANCO, 0.0015, 1.25)
t2 = texto('KIREI', 0.04, (0, -FD / 2 - 0.009, FH * 0.43), (math.radians(90), 0, 0), COBRE, 0.0012, 1.6)
padre([cuerpo, liquido, cuello, tapon, eti, t1, t2], frasco)

# ---------- Animación (120 cuadros) ----------
def clave(o, prop, cuadro, valor, i=None):
    if i is None: setattr(o, prop, valor); o.keyframe_insert(prop, frame=cuadro)
    else: getattr(o, prop)[i] = valor; o.keyframe_insert(prop, index=i, frame=cuadro)

clave(bisagra, 'rotation_euler', 0, 0.0, 0); clave(bisagra, 'rotation_euler', 8, 0.0, 0)
clave(bisagra, 'rotation_euler', 46, math.radians(-112), 0)
frasco.location = (0, 0.02, 0.08)
clave(frasco, 'location', 0, 0.08, 2); clave(frasco, 'location', 30, 0.08, 2)
clave(frasco, 'location', 96, H + 0.42, 2); clave(frasco, 'location', 119, H + 0.5, 2)
clave(frasco, 'rotation_euler', 30, 0.0, 2); clave(frasco, 'rotation_euler', 119, math.radians(-24), 2)
clave(frasco, 'rotation_euler', 30, 0.0, 0); clave(frasco, 'rotation_euler', 80, math.radians(6), 0); clave(frasco, 'rotation_euler', 119, math.radians(2), 0)
for o in (bisagra, frasco):
    for fc in o.animation_data.action.fcurves if hasattr(o.animation_data.action, 'fcurves') else []:
        for k in fc.keyframe_points: k.interpolation = 'BEZIER'; k.easing = 'AUTO'

# ---------- Luz, cámara y render ----------
def luz(nombre, pos, energia, tam, color='#FFFFFF'):
    l = bpy.data.lights.new(nombre, 'AREA'); l.energy = energia; l.size = tam; l.color = hexa(color)
    o = bpy.data.objects.new(nombre, l); sc.collection.objects.link(o); o.location = pos
    o.rotation_euler = (Vector((0, 0, 1.0)) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
luz('Clave', (3.5, -3.5, 4.5), 900, 3.0, '#FFF1E0')
luz('Relleno', (-4, -2.5, 2.2), 260, 4.0, '#E4E9EF')
luz('Contra', (-1.5, 4, 3.5), 700, 2.0, '#FDEBD3')
luz('Bajo', (0, -3, -1), 120, 3.0, '#F7931E')

sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True
sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (*hexa('#071524'), 1)
sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6

cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = 50; cam.location = (3.6, -5.4, 3.3)
cam.rotation_euler = (Vector((0, 0, 1.3)) - cam.location).to_track_quat('-Z', 'Y').to_euler()

sc.render.engine = 'CYCLES'
sc.cycles.samples = 24; sc.cycles.use_denoising = True
sc.cycles.max_bounces = 10; sc.cycles.transmission_bounces = 10
sc.render.film_transparent = True
sc.render.resolution_x = ANCHO; sc.render.resolution_y = int(ANCHO * 0.75)
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
sc.view_settings.view_transform = 'AgX'
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for tipo in ('OPTIX', 'CUDA', 'HIP', 'ONEAPI', 'METAL'):
        try:
            prefs.compute_device_type = tipo; prefs.get_devices()
            if any(d.type == tipo for d in prefs.devices):
                for d in prefs.devices: d.use = True
                sc.cycles.device = 'GPU'; print('GPU', tipo); break
        except TypeError: pass
except Exception as e: print('sin GPU', e)

for f in (CUADROS if CUADROS is not None else range(120)):
    sc.frame_set(f)
    sc.render.filepath = f'{SALIDA}/{f:03d}.png'
    bpy.ops.render.render(write_still=True)
print('LISTO')
