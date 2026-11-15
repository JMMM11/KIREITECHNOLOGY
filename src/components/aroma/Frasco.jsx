// Frasco dibujado: lo que se muestra mientras un perfume no tiene foto. Tres siluetas; el color del líquido sale de la familia.
const LIQUIDO = { floral: '#E3A9B4', amaderada: '#9C6B3F', citrica: '#E2C84B', oriental: '#8A3A66', fresca: '#8FC2BA', gourmand: '#C98F4E' };
const FORMAS = [
  { cuerpo: 'M26 58h68a6 6 0 0 1 6 6v82a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V64a6 6 0 0 1 6-6Z', nivel: 84, tapa: [44, 20, 32, 26] },
  { cuerpo: 'M60 54c26 0 44 20 44 48s-18 50-44 50-44-22-44-50 18-48 44-48Z', nivel: 88, tapa: [47, 14, 26, 28] },
  { cuerpo: 'M38 50h44a5 5 0 0 1 5 5v92a5 5 0 0 1-5 5H38a5 5 0 0 1-5-5V55a5 5 0 0 1 5-5Z', nivel: 76, tapa: [48, 10, 24, 28] },
];

export default function Frasco({ familia, forma = 0, iniciales = '', className }) {
  const f = FORMAS[forma % FORMAS.length], id = `fr-${familia}-${forma}`;
  const [tx, ty, tw, th] = f.tapa;
  return (
    <svg className={className} viewBox="0 0 120 160" role="img" aria-label="Frasco de perfume" preserveAspectRatio="xMidYMid meet">
      <defs><clipPath id={id}><path d={f.cuerpo} /></clipPath></defs>
      <ellipse cx="60" cy="154" rx="40" ry="4" fill="rgb(20 16 20 / 0.14)" />
      <rect x={tx + 5} y={ty + th - 2} width={tw - 10} height="14" fill="#A8853A" />
      <rect x={tx} y={ty} width={tw} height={th} rx="3" fill="#141014" />
      <rect x={tx + 3} y={ty + 3} width="3" height={th - 6} rx="1.5" fill="rgb(255 255 255 / 0.28)" />
      <path d={f.cuerpo} fill="rgb(255 255 255 / 0.5)" />
      <g clipPath={`url(#${id})`}>
        <rect x="0" y={f.nivel} width="120" height="90" fill={LIQUIDO[familia] ?? '#C9B48A'} opacity="0.86" />
        <rect x="24" y="52" width="9" height="104" fill="rgb(255 255 255 / 0.5)" />
      </g>
      <path d={f.cuerpo} fill="none" stroke="rgb(20 16 20 / 0.5)" strokeWidth="1.2" />
      {iniciales && <text x="60" y="118" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="26" fontWeight="500" fill="#141014">{iniciales}</text>}
    </svg>
  );
}
