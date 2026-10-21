export interface GlossaryEntry {
  id: string;
  term: string;
  amharicTerm?: string;
  phonetic: string;
  definition: string;
  category: 'physics' | 'chemistry' | 'astronomy' | 'investigation';
  unitId: string;
  curriculumRef: string;
  relatedTerms?: string[];
}

const GLOSSARY_DATABASE: GlossaryEntry[] = [
  // Unit 1: Investigation & Measurement
  {
    id: 'density',
    term: 'Density',
    amharicTerm: 'እፍጋት (Efgat)',
    phonetic: 'DEN-si-tee',
    definition: 'The mass per unit volume of a substance (ρ = m / V). Expressed in SI units as kg/m³ or g/cm³.',
    category: 'investigation',
    unitId: 'unit-01',
    curriculumRef: 'Grade 8 Science • Unit 1.1',
    relatedTerms: ['mass', 'volume', 'archimedes-principle'],
  },
  {
    id: 'meniscus',
    term: 'Meniscus',
    amharicTerm: 'ሚኒስከስ',
    phonetic: 'muh-NIS-kuhs',
    definition: 'The curved upper surface of a liquid column in a graduated cylinder. For water, always read the lowest point at eye level.',
    category: 'investigation',
    unitId: 'unit-01',
    curriculumRef: 'Grade 8 Science • Unit 1.1',
    relatedTerms: ['density', 'volume'],
  },
  {
    id: 'archimedes-principle',
    term: "Archimedes' Principle",
    amharicTerm: 'የአርኪሜዲስ ሕግ',
    phonetic: 'ar-kuh-MEE-deez',
    definition: 'Any object submerged in a fluid experiences an upward buoyant force equal to the weight of fluid displaced.',
    category: 'investigation',
    unitId: 'unit-01',
    curriculumRef: 'Grade 8 Science • Unit 1.1',
    relatedTerms: ['density', 'buoyancy'],
  },

  // Unit 2: Chemistry & Atoms
  {
    id: 'atomic-number',
    term: 'Atomic Number (Z)',
    amharicTerm: 'የአቶሚክ ቁጥር',
    phonetic: 'uh-TOM-ik NUM-ber',
    definition: 'The total number of protons in the nucleus of an atom, uniquely defining its chemical identity.',
    category: 'chemistry',
    unitId: 'unit-02',
    curriculumRef: 'Grade 8 Science • Unit 2.1',
    relatedTerms: ['mass-number', 'proton', 'isotope'],
  },
  {
    id: 'mass-number',
    term: 'Mass Number (A)',
    amharicTerm: 'የመጠነ-ቁስ ቁጥር',
    phonetic: 'MASS NUM-ber',
    definition: 'The total count of nucleons (protons plus neutrons) inside the atomic nucleus.',
    category: 'chemistry',
    unitId: 'unit-02',
    curriculumRef: 'Grade 8 Science • Unit 2.1',
    relatedTerms: ['atomic-number', 'neutron', 'isotope'],
  },
  {
    id: 'isotope',
    term: 'Isotope',
    amharicTerm: 'አይሶቶፕ',
    phonetic: 'EYE-suh-tohp',
    definition: 'Atoms of the same element with identical proton count (Z) but differing numbers of neutrons, resulting in different mass numbers (A).',
    category: 'chemistry',
    unitId: 'unit-02',
    curriculumRef: 'Grade 8 Science • Unit 2.1',
    relatedTerms: ['atomic-number', 'mass-number'],
  },
  {
    id: 'valence-electron',
    term: 'Valence Electron',
    amharicTerm: 'የቫለንስ ኤሌክትሮን',
    phonetic: 'VEY-luhns ih-LEK-tron',
    definition: 'Electrons located in the outermost Bohr energy shell that determine chemical bonding and reactivity.',
    category: 'chemistry',
    unitId: 'unit-02',
    curriculumRef: 'Grade 8 Science • Unit 2.1',
    relatedTerms: ['atomic-number', 'ion'],
  },

  // Unit 6: Astronomy
  {
    id: 'astronomical-unit',
    term: 'Astronomical Unit (AU)',
    amharicTerm: 'የአስትሮኖሚ አሃድ',
    phonetic: 'as-truh-NOM-i-kuhl YOO-nit',
    definition: 'The mean distance from the center of Earth to the center of the Sun, approximately 149.6 million kilometers (1.496 × 10¹¹ m).',
    category: 'astronomy',
    unitId: 'unit-06',
    curriculumRef: 'Grade 8 Science • Unit 6.1',
    relatedTerms: ['habitable-zone', 'kepler-law'],
  },
  {
    id: 'habitable-zone',
    term: 'Habitable (Goldilocks) Zone',
    amharicTerm: 'ለመኖር ተስማሚ ቀጣና',
    phonetic: 'HAB-i-tuh-buhl ZOHN',
    definition: 'The circumstellar orbital range where stellar radiance allows liquid water to remain stable on a planetary surface.',
    category: 'astronomy',
    unitId: 'unit-06',
    curriculumRef: 'Grade 8 Science • Unit 6.1',
    relatedTerms: ['astronomical-unit'],
  },

  // Unit 7: Physics
  {
    id: 'ohms-law',
    term: "Ohm's Law",
    amharicTerm: 'የኦህም ሕግ',
    phonetic: 'OHMZ LAW',
    definition: 'The electric current (I) through a conductor between two points is directly proportional to voltage (V) and inversely proportional to resistance (R): V = I × R.',
    category: 'physics',
    unitId: 'unit-07',
    curriculumRef: 'Grade 8 Science • Unit 7.3',
    relatedTerms: ['voltage', 'resistance'],
  },
  {
    id: 'law-of-reflection',
    term: 'Law of Reflection',
    amharicTerm: 'የብርሃን ነጸብራቅ ሕግ',
    phonetic: 'LAW uhv ri-FLEK-shuhn',
    definition: 'When a ray of light strikes a smooth reflective surface, the angle of incidence (θi) equals the angle of reflection (θr), and all rays lie in the same plane.',
    category: 'physics',
    unitId: 'unit-07',
    curriculumRef: 'Grade 8 Science • Unit 7.1A',
    relatedTerms: ['snells-law', 'refraction'],
  },
  {
    id: 'snells-law',
    term: "Snell's Law of Refraction",
    amharicTerm: 'የስኔል የስብረት ሕግ',
    phonetic: 'SNELZ LAW',
    definition: 'The ratio of the sines of the angles of incidence and refraction equals the ratio of phase velocities: n₁ sin(θ₁) = n₂ sin(θ₂).',
    category: 'physics',
    unitId: 'unit-07',
    curriculumRef: 'Grade 8 Science • Unit 7.1B',
    relatedTerms: ['law-of-reflection'],
  },
  {
    id: 'thermal-conduction',
    term: 'Thermal Conduction',
    amharicTerm: 'የሙቀት ስርጸት',
    phonetic: 'THUR-muhl kuhn-DUHK-shuhn',
    definition: 'The transfer of internal kinetic energy between adjacent molecules through microscopic collisions down a temperature gradient.',
    category: 'physics',
    unitId: 'unit-07',
    curriculumRef: 'Grade 8 Science • Unit 7.2',
    relatedTerms: ['density'],
  },
  {
    id: 'sound-wave',
    term: 'Sound Wave (Longitudinal)',
    amharicTerm: 'የድምፅ ሞገድ',
    phonetic: 'SOWND WAYV',
    definition: 'A mechanical wave that propagates through compressions and rarefactions of medium particles; cannot travel through a vacuum.',
    category: 'physics',
    unitId: 'unit-07',
    curriculumRef: 'Grade 8 Science • Unit 7.4',
    relatedTerms: ['frequency', 'wavelength'],
  },
  {
    id: 'magnetic-dipole',
    term: 'Magnetic Dipole',
    amharicTerm: 'መግነጢሳዊ ዳይፖል',
    phonetic: 'mag-NET-ik DIE-pohl',
    definition: 'A closed magnetic system with inseparable North and South poles; breaking a magnet produces two smaller dipoles.',
    category: 'physics',
    unitId: 'unit-07',
    curriculumRef: 'Grade 8 Science • Unit 7.6',
    relatedTerms: ['law-of-reflection'],
  },
];

export const glossaryService = {
  getAllTerms(): GlossaryEntry[] {
    return GLOSSARY_DATABASE;
  },

  getTermById(id: string): GlossaryEntry | undefined {
    return GLOSSARY_DATABASE.find((e) => e.id === id);
  },

  getTermsByUnit(unitId: string): GlossaryEntry[] {
    return GLOSSARY_DATABASE.filter((e) => e.unitId === unitId);
  },

  getTermsByCategory(category: string): GlossaryEntry[] {
    return GLOSSARY_DATABASE.filter((e) => e.category === category);
  },

  search(query: string): GlossaryEntry[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return GLOSSARY_DATABASE.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        (e.amharicTerm && e.amharicTerm.toLowerCase().includes(q)) ||
        e.definition.toLowerCase().includes(q)
    );
  },
};
