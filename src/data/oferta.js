export const img = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;
export const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export const TIPOS = [
  { id: 'rio', label: 'Río' },
  { id: 'senderismo', label: 'Senderismo' },
  { id: 'ecologico', label: 'Ecoturismo' },
  { id: 'cafetero', label: 'Café' },
  { id: 'aventura', label: 'Aventura' },
  { id: 'gastronomico', label: 'Gastronomía' },
  { id: 'cultural', label: 'Música vallenata' },
];

// precio en COP; unidad: 'persona' | 'noche'. Precios sugeridos: confirma con cada operador.
export const LUGARES = [
  { id: 1, titulo: 'Pozo de la Paz y Balneario Río Manaure', tipos: ['rio', 'ecologico', 'gastronomico'], atractivo: true, precio: 15000, unidad: 'persona',
    foto: 'photo-1544551763-46a013bb70d5', alt: 'Río de aguas cristalinas entre rocas y vegetación',
    desc: 'Aguas cristalinas y frías descendientes de la Serranía del Perijá. Ideal para pasadías en familia y disfrutar de la gastronomía ribereña.',
    actividades: ['Baño de río', 'Sendero ecológico', 'Almuerzo típico tradicional'] },
  { id: 2, titulo: 'Ruta del Café Perijá y fincas agroturísticas', tipos: ['cafetero', 'gastronomico'], precio: 65000, unidad: 'persona',
    foto: 'photo-1501339847302-ac426a4a7cbb', alt: 'Laderas de montaña con cultivos de café',
    desc: 'Descubre el aroma del café de alta montaña cultivado en las laderas de Manaure. Recorrido por cultivos, molienda artesanal y degustación.',
    actividades: ['Cata de café especial', 'Recorrido por cafetales', 'Taller de tostión artesanal'] },
  { id: 3, titulo: 'Senderismo Cerro de la Cruz y miradores', tipos: ['senderismo', 'ecologico'], atractivo: true, precio: 35000, unidad: 'persona',
    foto: 'photo-1464822759023-fed622ff2c3b', alt: 'Montañas con vista panorámica al valle',
    desc: 'Caminata de montaña con vistas panorámicas del valle del Cesar. Clima fresco y avistamiento de aves endémicas.',
    actividades: ['Fotografía de mirador', 'Avistamiento de aves', 'Senderismo de montaña'] },
  { id: 4, titulo: 'Experiencia vallenata y tertulia folclórica', tipos: ['cultural', 'gastronomico'], atractivo: true, precio: 45000, unidad: 'persona',
    foto: 'photo-1511671782779-c97d3d27a1d4', alt: 'Músicos en escenario durante un concierto',
    desc: 'Manaure es cuna de compositores y acordeones. Disfruta de un atardecer montañés con relatos, mitos e historias del folclor vallenato.',
    actividades: ['Música en vivo', 'Noche de fogata', 'Gastronomía típica del Cesar'] },
  { id: 5, titulo: 'Pasadía extremo: canopy y torrentismo', tipos: ['aventura', 'rio'], precio: 80000, unidad: 'persona',
    foto: 'photo-1533587851505-d119e13fa0d7', alt: 'Persona practicando aventura en cascada',
    desc: 'Descenso por cascadas cristalinas y tirolesa sobre la vegetación de la Serranía del Perijá con equipos certificados de seguridad.',
    actividades: ['Torrentismo en cascada', 'Canopy entre árboles', 'Guías de aventura'] },
  { id: 6, titulo: 'Cabañas de montaña Balcón del Cesar', tipos: ['ecologico'], precio: 140000, unidad: 'noche',
    foto: 'photo-1587061949409-02df41d5e562', alt: 'Cabaña de madera rodeada de naturaleza',
    desc: 'Alojamiento rodeado de naturaleza con clima templado, vista hacia el valle y desayunos con ingredientes campesinos locales.',
    actividades: ['Hospedaje ecológico', 'Desayuno campesino', 'Fogata nocturna'] },
];
