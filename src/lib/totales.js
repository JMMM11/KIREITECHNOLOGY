// Totales del pedido en centavos. El backend debe recalcularlos: el navegador solo los muestra.
// entrega: 'retiro' | 'punto_encuentro' | 'domicilio'. pago: 'linea' | 'contra_entrega'.
// Una tarifa en null significa "por confirmar" y no se suma.
export function calcularTotales(lineas, entrega, pago, tarifas) {
  const subtotal = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);
  const envio = entrega === 'domicilio' ? tarifas.envioDomicilio
    : entrega === 'punto_encuentro' ? tarifas.envioPuntoEncuentro
    : 0;
  const contraEntregaPermitida = subtotal >= tarifas.contraEntregaMinimo;
  const cargoContraEntrega = pago === 'contra_entrega' ? tarifas.contraEntregaCargo : 0;
  return {
    subtotal,
    envio,
    envioPorConfirmar: envio == null,
    cargoContraEntrega,
    contraEntregaPermitida,
    faltaParaContraEntrega: Math.max(0, tarifas.contraEntregaMinimo - subtotal),
    total: subtotal + (envio ?? 0) + cargoContraEntrega,
  };
}

export const contarArticulos = (lineas) => lineas.reduce((n, l) => n + l.cantidad, 0);
