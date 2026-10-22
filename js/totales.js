// Cálculos de dinero. Todo en centavos enteros. Se usa en el navegador y en tests/ con Node.
(function (root) {
  'use strict';

  function formatearDinero(centavos) {
    if (!Number.isInteger(centavos)) throw new TypeError('El monto debe ser un entero en centavos');
    const signo = centavos < 0 ? '-' : '';
    const abs = Math.abs(centavos);
    return `${signo}$${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
  }

  // entrega: 'retiro' | 'punto' | 'domicilio'. pago: 'yappy' | 'contra_entrega'.
  // Una tarifa en null significa "por confirmar" y no se suma al total.
  function calcularTotales(lineas, entrega, pago, tarifas) {
    const subtotal = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);
    const envio = entrega === 'domicilio' ? tarifas.envioDomicilio
      : entrega === 'punto' ? tarifas.envioPuntoEncuentro
      : 0;
    const contraEntregaPermitida = subtotal >= tarifas.contraEntregaMinimo;
    const cargoContraEntrega = pago === 'contra_entrega' ? tarifas.contraEntregaCargo : 0;
    return {
      subtotal,
      envio,
      envioPorConfirmar: envio == null,
      cargoContraEntrega,
      contraEntregaPermitida,
      total: subtotal + (envio || 0) + cargoContraEntrega,
    };
  }

  const api = { formatearDinero, calcularTotales };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KireiTotales = api;
})(this);
