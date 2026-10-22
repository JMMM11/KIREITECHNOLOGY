import { useEffect } from 'react';

const BASE = 'Kirei Technology';

export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | ${BASE}` : `${BASE} | Tecnología en Panamá`;
  }, [titulo]);
}
