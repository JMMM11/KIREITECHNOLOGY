# Crea copias livianas (JPG) de las fotos de Productos/ y reparaciones/ en su subcarpeta web/.
# Los originales no se tocan. Correr después de agregar fotos: powershell -File scripts/fotos-web.ps1
# Anchos: 640 y 1280 para todas; 960 y 1920 para las de portada (principal*). Debe coincidir con src/components/ui/Foto.jsx.
Add-Type -AssemblyName System.Drawing
$raiz = Split-Path $PSScriptRoot -Parent
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$calidad = New-Object System.Drawing.Imaging.EncoderParameters 1
$calidad.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]80)
$hechas = 0

foreach ($carpeta in 'Productos', 'reparaciones') {
  $destino = Join-Path $raiz "$carpeta\web"
  New-Item -ItemType Directory -Force $destino | Out-Null
  Get-ChildItem (Join-Path $raiz $carpeta) -File | Where-Object { $_.Extension -match '^\.(jpe?g|png)$' } | ForEach-Object {
    $origen = $_
    $anchos = if ($origen.BaseName -like 'principal*') { 960, 1920 } else { 640, 1280 }
    $img = $null
    foreach ($w in $anchos) {
      $salida = Join-Path $destino "$($origen.BaseName)-$w.jpg"
      if ((Test-Path $salida) -and (Get-Item $salida).LastWriteTime -gt $origen.LastWriteTime) { continue }
      if (-not $img) { $img = [System.Drawing.Image]::FromFile($origen.FullName) }
      $ancho = [Math]::Min($w, $img.Width)
      $alto = [int][Math]::Round($img.Height * $ancho / $img.Width)
      $lienzo = New-Object System.Drawing.Bitmap $ancho, $alto
      $g = [System.Drawing.Graphics]::FromImage($lienzo)
      $g.Clear([System.Drawing.Color]::White)  # las PNG con fondo transparente quedan sobre blanco
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.DrawImage($img, 0, 0, $ancho, $alto)
      $lienzo.Save($salida, $codec, $calidad)
      $g.Dispose(); $lienzo.Dispose()
      $hechas++
    }
    if ($img) { $img.Dispose() }
  }
}
"Copias nuevas o actualizadas: $hechas"
