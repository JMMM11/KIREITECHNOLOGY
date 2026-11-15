// Ícono de Aroma: la estela de una fragancia (una cinta en S y dos volutas). Es el único ícono propio:
// Bootstrap Icons no tiene uno de aroma. Misma firma que los de react-bootstrap-icons (size).
function Estela({ size = 20, grosor, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.4 1.9C5.6 5.4 5 9.2 8.3 12.6c2.9 3 6.6 4.9 5.4 9.5 4.7-3.5 5.3-7.3 2-10.7-2.9-3-6.6-4.9-5.3-9.5Z" />
      <path d="M14.3 3.2c-1.2 2 .5 3.4 2.4 4.9 1.5 1.2 2.4 2.1 2.2 3.3" />
      <path d="M5.1 12.8c-.5 1.3.5 2.2 2 3.4 1.9 1.5 3.6 2.9 2.4 4.9" />
    </svg>
  );
}
export const IconoAroma = (props) => <Estela grosor={1.5} {...props} />;
export const IconoAromaLleno = (props) => <Estela grosor={2.3} {...props} />;
