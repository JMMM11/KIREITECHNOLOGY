// Frasco dibujado: lo que se muestra mientras un perfume no tiene foto. Tres siluetas, solo con colores de la paleta Kirei.
const FORMAS = [
  { cuerpo: 'M26 58h68a6 6 0 0 1 6 6v82a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V64a6 6 0 0 1 6-6Z', nivel: 84, tapa: [44, 20, 32, 26] },
  { cuerpo: 'M60 54c26 0 44 20 44 48s-18 50-44 50-44-22-44-50 18-48 44-48Z', nivel: 88, tapa: [47, 14, 26, 28] },
  { cuerpo: 'M38 50h44a5 5 0 0 1 5 5v92a5 5 0 0 1-5 5H38a5 5 0 0 1-5-5V55a5 5 0 0 1 5-5Z', nivel: 76, tapa: [48, 10, 24, 28] },
];

export default function Frasco({ forma = 0, iniciales = '', className }) {
  const f = FORMAS[forma % FORMAS.length], id = `fr-${forma}`;
  const [tx, ty, tw, th] = f.tapa;
  return (
    <svg className={className} viewBox="0 0 120 160" role="img" aria-label="Frasco de perfume" preserveAspectRatio="xMidYMid meet">
      <defs><clipPath id={id}><path d={f.cuerpo} /></clipPath></defs>
      <ellipse cx="60" cy="154" rx="40" ry="4" fill="#DDD8CF" />
      <rect x={tx + 5} y={ty + th - 2} width={tw - 10} height="14" fill="#9A5200" />
      <rect x={tx} y={ty} width={tw} height={th} rx="3" fill="#0B1F33" />
      <path d={f.cuerpo} fill="#FFFFFF" />
      <g clipPath={`url(#${id})`}><rect x="0" y={f.nivel} width="120" height="90" fill="#FDEBD3" /></g>
      <path d={f.cuerpo} fill="none" stroke="#9A5200" strokeWidth="1.2" />
      {iniciales && <text x="60" y="118" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="22" fontWeight="300" fill="#0B1F33">{iniciales}</text>}
    </svg>
  );
}
