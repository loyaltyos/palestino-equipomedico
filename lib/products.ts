export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

export const categories = [
  "Camas hospitalarias",
  "Movilidad y apoyo",
  "Oxigenoterapia",
  "Diagnóstico",
  "Mobiliario médico",
  "Exploración clínica",
  "Rehabilitación",
  "Insumos médicos"
];

export const products: Product[] = [
  {
    id: "cama-hospitalaria-electrica",
    name: "Cama hospitalaria eléctrica de 3 posiciones",
    category: "Camas hospitalarias",
    price: 38900,
    image: "/products/photos/cama-hospitalaria.webp",
    description: "Cama articulada con barandales, cabecera ajustable y estructura reforzada para uso clínico."
  },
  {
    id: "silla-ruedas-aluminio",
    name: "Silla de ruedas plegable de aluminio",
    category: "Movilidad y apoyo",
    price: 5490,
    image: "/products/photos/silla-ruedas.webp",
    description: "Silla ligera con descansabrazos, descansapiés abatibles y sistema plegable para traslado."
  },
  {
    id: "andadera-adulto",
    name: "Andadera de aluminio para adulto",
    category: "Movilidad y apoyo",
    price: 1290,
    image: "/products/photos/andadera.webp",
    description: "Apoyo estable para rehabilitación y movilidad diaria, con altura ajustable y regatones antideslizantes."
  },
  {
    id: "baston-cuatro-puntos",
    name: "Bastón cuadrípode ajustable",
    category: "Movilidad y apoyo",
    price: 690,
    image: "/products/photos/baston.webp",
    description: "Bastón de cuatro puntos con empuñadura ergonómica para mayor soporte y seguridad."
  },
  {
    id: "concentrador-oxigeno-5l",
    name: "Concentrador de oxígeno 5 LPM",
    category: "Oxigenoterapia",
    price: 16900,
    image: "/products/photos/concentrador.webp",
    description: "Equipo de oxigenoterapia con flujo regulable, bajo ruido y panel de operación intuitivo."
  },
  {
    id: "nebulizador-compresor",
    name: "Nebulizador de compresor",
    category: "Oxigenoterapia",
    price: 890,
    image: "/products/photos/nebulizador.webp",
    description: "Nebulizador compacto para tratamientos respiratorios en consultorio o cuidado en casa."
  },
  {
    id: "tensiometro-digital-brazo",
    name: "Tensiómetro digital de brazo",
    category: "Diagnóstico",
    price: 980,
    image: "/products/photos/tensiometro.webp",
    description: "Medición automática de presión arterial con memoria, pantalla amplia y brazalete ajustable."
  },
  {
    id: "glucometro-kit",
    name: "Glucómetro con kit inicial",
    category: "Diagnóstico",
    price: 760,
    image: "/products/photos/glucometro-producto.jpg",
    description: "Equipo portátil para monitoreo de glucosa con lancetas, tiras de prueba y estuche."
  },
  {
    id: "camilla-medica",
    name: "Camilla médica plegable",
    category: "Mobiliario médico",
    price: 8900,
    image: "/products/photos/camilla.webp",
    description: "Camilla plegable con estructura reforzada, cubierta resistente y diseño portátil para traslados."
  },
  {
    id: "bascula-medica",
    name: "Báscula médica con estadímetro",
    category: "Diagnóstico",
    price: 5200,
    image: "/products/photos/bascula.webp",
    description: "Báscula mecánica de consultorio con estadímetro integrado y plataforma antiderrapante."
  },
  {
    id: "mesa-exploracion",
    name: "Mesa de exploración con gabinete",
    category: "Mobiliario médico",
    price: 14200,
    image: "/products/photos/mesa-exploracion.webp",
    description: "Mesa clínica con cajonera, escalón deslizable y superficie acolchada de fácil limpieza."
  },
  {
    id: "lampara-exploracion",
    name: "Lámpara de exploración LED",
    category: "Exploración clínica",
    price: 2450,
    image: "/products/photos/lampara.webp",
    description: "Lámpara flexible de luz fría para consultorio, procedimientos menores y valoración clínica."
  },
  {
    id: "baumanometro-aneroide",
    name: "Baumanómetro aneroide profesional",
    category: "Diagnóstico",
    price: 720,
    image: "/products/photos/baumanometro.webp",
    description: "Baumanómetro con brazalete adulto, manómetro de lectura clara y estuche de transporte."
  },
  {
    id: "oximetro-pulso",
    name: "Oxímetro de pulso digital",
    category: "Diagnóstico",
    price: 520,
    image: "/products/photos/oximetro.webp",
    description: "Lectura rápida de SpO2 y frecuencia cardiaca con pantalla OLED y diseño portátil."
  },
  {
    id: "pedalera-rehabilitacion",
    name: "Mesa inclinable de rehabilitación",
    category: "Rehabilitación",
    price: 1190,
    image: "/products/photos/rehabilitacion.webp",
    description: "Mesa terapéutica ajustable para movilización, valoración y programas de rehabilitación física."
  },
  {
    id: "kit-insumos-clinicos",
    name: "Kit de protección clínica desechable",
    category: "Insumos médicos",
    price: 1450,
    image: "/products/photos/insumos.webp",
    description: "Protección clínica con overol, cubrebocas y guantes para áreas de atención y procedimientos."
  }
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
