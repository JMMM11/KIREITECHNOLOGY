# Frasco "AROMA" de Kirei para la portada de Aroma: exporta el modelo (public/modelos/frasco.glb) que three dibuja en vivo,
# y una imagen fija de alta calidad (public/aroma/frasco.webp) que se ve mientras carga o si el navegador no tiene WebGL.
# Es un frasco decorativo de Kirei, no un producto en venta. Paleta: marino, cobre, naranja.
# Uso: blender -b -P scripts/modelo3d/frasco.py -- <carpeta_del_proyecto>
import bpy, sys, math
from mathutils import Vector

RAIZ = sys.argv[sys.argv.index('--') + 1]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def hexa(h):  # sRGB -> lineal
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)

# Los nombres de material los usa three para poner sus materiales físicos (src/components/aroma/escenaFrasco.js).
def mat(nombre, color, metal=0.0, rugoso=0.5, trans=0.0, ior=1.45):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*hexa(color), 1)
    p.inputs['Metallic'].default_value = metal; p.inputs['Roughness'].default_value = rugoso
    p.inputs['Transmission Weight'].default_value = trans; p.inputs['IOR'].default_value = ior
    return m

VIDRIO = mat('Vidrio', '#FFFFFF', 0.0, 0.02, trans=1.0, ior=1.5)
LIQUIDO = mat('Liquido', '#E5850F', 0.0, 0.05, trans=1.0, ior=1.34)
COBRE = mat('Cobre', '#B8732A', 1.0, 0.25)
ETIQUETA = mat('Etiqueta', '#0B1F33', 0.0, 0.35)
BLANCO = mat('Blanco', '#FFFFFF', 0.0, 0.4)

def caja(nombre, tam, pos, material, bisel=0.0, seg=8):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    o = bpy.context.object; o.name = nombre; o.scale = tam
    bpy.ops.object.transform_apply(scale=True)
    if bisel:
        m = o.modifiers.new('b', 'BEVEL'); m.width = bisel; m.segments = seg; m.limit_method = 'ANGLE'
    o.data.materials.append(material)
    return o

def texto(nombre, cuerpo, tam, pos, material, grosor, espacio):
    bpy.ops.object.text_add(location=pos, rotation=(math.radians(90), 0, 0))
    t = bpy.context.object; t.name = nombre; t.data.body = cuerpo; t.data.size = tam; t.data.extrude = grosor
    t.data.align_x = 'CENTER'; t.data.align_y = 'CENTER'; t.data.space_character = espacio; t.data.resolution_u = 6
    t.data.materials.append(material)
    bpy.ops.object.convert(target='MESH')   # glTF no exporta texto: se pasa a malla
    return bpy.context.object

FW, FD, FH = 0.66, 0.4, 0.82
partes = [
    caja('Cuerpo', (FW, FD, FH), (0, 0, FH / 2), VIDRIO, 0.06, 10),
    caja('Liquido', (FW - 0.09, FD - 0.09, FH * 0.72), (0, 0, 0.05 + FH * 0.36), LIQUIDO, 0.035, 8),
    caja('Tapon', (0.36, 0.3, 0.28), (0, 0, FH + 0.08 + 0.14), COBRE, 0.03, 8),
    caja('Etiqueta', (FW * 0.62, 0.006, FH * 0.36), (0, -FD / 2 - 0.004, FH * 0.5), ETIQUETA, 0.004, 3),
    texto('TextoAroma', 'AROMA', 0.085, (0, -FD / 2 - 0.009, FH * 0.53), BLANCO, 0.0015, 1.25),
]
# Logo de Kirei (KIREI | TECHNOLOGY con la antena) pequeño en la etiqueta, debajo de AROMA. Imagen: scripts/modelo3d/logo-etiqueta.png.
import os
logo_img = bpy.data.images.load(os.path.join(os.path.dirname(bpy.data.filepath or __file__), 'logo-etiqueta.png'))
LOGO = bpy.data.materials.new('Logo'); LOGO.use_nodes = True
nodos = LOGO.node_tree.nodes; pbsdf = nodos['Principled BSDF']
tex = nodos.new('ShaderNodeTexImage'); tex.image = logo_img
LOGO.node_tree.links.new(tex.outputs['Color'], pbsdf.inputs['Base Color'])
LOGO.node_tree.links.new(tex.outputs['Alpha'], pbsdf.inputs['Alpha'])
pbsdf.inputs['Roughness'].default_value = 0.4
LOGO.surface_render_method = 'BLENDED'
ancho_logo = 0.3
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -FD / 2 - 0.0085, FH * 0.40), rotation=(math.radians(90), 0, 0))
logo = bpy.context.object; logo.name = 'LogoKirei'; logo.scale = (ancho_logo, ancho_logo * 408 / 1712, 1)
bpy.ops.object.transform_apply(scale=True)
logo.data.materials.append(LOGO); partes.append(logo)
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.085, depth=0.08, location=(0, 0, FH + 0.04))
cuello = bpy.context.object; cuello.name = 'Cuello'; cuello.data.materials.append(COBRE); partes.append(cuello)
for o in partes:
    for p in o.data.polygons: p.use_smooth = True

# Modelo para la web: piezas aplicadas, sin cámara ni luces.
bpy.ops.object.select_all(action='DESELECT')
for o in partes: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=f'{RAIZ}/public/modelos/frasco.glb', export_format='GLB', use_selection=True, export_apply=True,
                          export_yup=True, export_texcoords=True, export_materials='EXPORT', export_cameras=False, export_lights=False)

# Imagen fija: el mismo encuadre que la escena web, con luz de estudio.
def luz(nombre, pos, energia, tam, color):
    l = bpy.data.lights.new(nombre, 'AREA'); l.energy = energia; l.size = tam; l.color = hexa(color)
    o = bpy.data.objects.new(nombre, l); sc.collection.objects.link(o); o.location = pos
    o.rotation_euler = (Vector((0, 0, 0.6)) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
luz('Clave', (2.2, -2.6, 2.6), 380, 2.0, '#FFF1E0')
luz('Relleno', (-2.6, -1.6, 1.2), 120, 3.0, '#E4E9EF')
luz('Contra', (-0.8, 2.6, 2.2), 420, 1.6, '#FDEBD3')
luz('Naranja', (1.6, 1.4, 0.2), 160, 1.2, '#F7931E')
sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True
sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (*hexa('#071524'), 1)
sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.8
giro = bpy.data.objects.new('Giro', None); sc.collection.objects.link(giro)
for o in partes: o.parent = giro
giro.rotation_euler = (0, 0, math.radians(-18))   # se gira el conjunto, no cada pieza
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = 85; cam.location = (0, -5.2, 1.0)
cam.rotation_euler = (Vector((0, 0, 0.6)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
sc.render.engine = 'CYCLES'; sc.cycles.samples = 160; sc.cycles.use_denoising = True
sc.cycles.max_bounces = 12; sc.cycles.transmission_bounces = 12
sc.render.film_transparent = True; sc.render.resolution_x = 1000; sc.render.resolution_y = 1250
sc.view_settings.view_transform = 'AgX'
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
    for d in prefs.devices: d.use = True
    sc.cycles.device = 'GPU'
except Exception as e: print('sin GPU', e)
sc.render.filepath = f'{RAIZ}/public/aroma/frasco.png'
bpy.ops.render.render(write_still=True)
print('LISTO')
