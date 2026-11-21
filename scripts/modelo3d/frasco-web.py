# Convierte los 120 PNG del render (scripts/modelo3d/perfume.py) en WebP con transparencia para la portada de Aroma.
# Uso: python scripts/modelo3d/frasco-web.py <carpeta_png>   ->   public/aroma/frasco/000.webp ... 119.webp
import sys, os
from PIL import Image

origen = sys.argv[1]
destino = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'aroma', 'frasco')
os.makedirs(destino, exist_ok=True)
total = 0
for i in range(120):
    im = Image.open(os.path.join(origen, f'{i:03d}.png')).convert('RGBA')
    salida = os.path.join(destino, f'{i:03d}.webp')
    im.save(salida, 'WEBP', quality=78, method=6)
    total += os.path.getsize(salida)
print(f'120 cuadros, {total / 1e6:.1f} MB')
