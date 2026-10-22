// Mapa único de íconos con su movimiento. Un solo set: Bootstrap Icons.
import {
  Headphones, Smartwatch, BatteryCharging, Mouse, Heart, HeartFill, Tag, ExclamationCircle, SlashCircle, Inbox, CheckCircle,
  CheckCircleFill, Truck, InfoCircle, House, HouseFill, Grid, GridFill, Search, Bag, BagFill, ThreeDots,
  ShieldCheck, Shop, CashCoin, Whatsapp, Envelope,
  GeoAlt, Clock, ArrowRight, ArrowLeft, XLg, PlusLg, DashLg, Trash3, ChevronDown, Funnel, Lightning, Sliders,
  QuestionCircle, CalendarEvent, Telephone, Laptop, Instagram, Check2,
} from 'react-bootstrap-icons';

export const ICONOS_CATEGORIA = {
  audifonos: { de: Headphones, mov: 'latido' },
  relojes: { de: Smartwatch, mov: 'sacudir' },
  cargadores: { de: BatteryCharging, mov: 'aparecer' },
  'accesorios-pc': { de: Mouse, mov: 'gota' },
  anime: { de: Heart, mov: 'latido' },
};

export const ICONOS_ESTADO = {
  nuevo: { de: Lightning, mov: 'latido', texto: 'Nuevo' },
  oferta: { de: Tag, mov: 'sacudir', texto: 'En oferta' },
  ultimas: { de: ExclamationCircle, mov: 'latido', texto: 'Últimas unidades' },
  agotado: { de: SlashCircle, mov: 'aparecer', texto: 'Agotado', lleno: true },
  recibido: { de: Inbox, mov: 'gota', texto: 'Recibido' },
  confirmado: { de: CheckCircle, mov: 'giro', texto: 'Confirmado' },
  enviado: { de: Truck, mov: 'empujar', texto: 'Enviado' },
  entregado: { de: CheckCircleFill, mov: 'giro', texto: 'Entregado', lleno: true },
  ejemplo: { de: InfoCircle, mov: 'aparecer', texto: 'Ejemplo' },
};

export const ICONOS_NAV = {
  inicio: { de: House, lleno: HouseFill, mov: 'gota' },
  tecnologia: { de: Grid, lleno: GridFill, mov: 'aparecer' },
  anime: { de: Heart, lleno: HeartFill, mov: 'latido' },
  carrito: { de: Bag, lleno: BagFill, mov: 'latido' },
  mas: { de: ThreeDots, lleno: ThreeDots, mov: 'aparecer' },
};

export const ICONOS = {
  garantia: { de: ShieldCheck, mov: 'giro' },
  retiro: { de: Shop, mov: 'gota' },
  envio: { de: Truck, mov: 'empujar' },
  pago: { de: CashCoin, mov: 'latido' },
  whatsapp: { de: Whatsapp, mov: 'sacudir' },
  instagram: { de: Instagram, mov: 'latido' },
  correo: { de: Envelope, mov: 'gota' },
  ubicacion: { de: GeoAlt, mov: 'gota' },
  telefono: { de: Telephone, mov: 'sacudir' },
  reloj: { de: Clock, mov: 'giro' },
  siguiente: { de: ArrowRight, mov: 'empujar' },
  anterior: { de: ArrowLeft, mov: 'atras' },
  cerrar: { de: XLg, mov: 'girar90' },
  mas: { de: PlusLg, mov: 'girar90' },
  menos: { de: DashLg, mov: 'aparecer' },
  quitar: { de: Trash3, mov: 'sacudir' },
  desplegar: { de: ChevronDown, mov: 'gota' },
  elegido: { de: Check2, mov: 'aparecer' },
  filtros: { de: Funnel, mov: 'gota' },
  rapido: { de: Lightning, mov: 'latido' },
  ajustes: { de: Sliders, mov: 'aparecer' },
  ayuda: { de: QuestionCircle, mov: 'latido' },
  cita: { de: CalendarEvent, mov: 'aparecer' },
  buscar: { de: Search, mov: 'latido' },
  bolsa: { de: Bag, mov: 'latido' },
  laptop: { de: Laptop, mov: 'aparecer' },
  info: { de: InfoCircle, mov: 'aparecer' },
};
