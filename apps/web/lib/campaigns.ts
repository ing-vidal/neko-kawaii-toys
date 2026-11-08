export const CAMPAIGN_THEMES = [
  {
    id: 'black-friday',
    name: 'Black Friday',
    emoji: '🖤',
    headline: 'Black Friday kawaii',
    message: 'Encuentra tus favoritos con un toque especial de temporada.',
    accent: '#b91c1c',
    border: '#ef4444',
    surface: '#fff5f5',
    tagBackground: '#b91c1c',
    tagColor: '#ffffff',
  },
  {
    id: 'buen-fin',
    name: 'El Buen Fin',
    emoji: '🇲🇽',
    headline: 'El Buen Fin llegó a Neko',
    message: 'Explora el catálogo con los colores de esta temporada de ofertas.',
    accent: '#be123c',
    border: '#f43f5e',
    surface: '#fff1f2',
    tagBackground: '#be123c',
    tagColor: '#ffffff',
  },
  {
    id: 'navidad',
    name: 'Navidad',
    emoji: '🎄',
    headline: 'Una Navidad muy kawaii',
    message: 'Ideas adorables para regalar y compartir esta Navidad.',
    accent: '#15803d',
    border: '#22c55e',
    surface: '#f0fdf4',
    tagBackground: '#166534',
    tagColor: '#ffffff',
  },
  {
    id: 'reyes',
    name: 'Día de Reyes',
    emoji: '👑',
    headline: 'Celebra el Día de Reyes',
    message: 'Descubre una sorpresa especial para empezar el año.',
    accent: '#a16207',
    border: '#f59e0b',
    surface: '#fffbeb',
    tagBackground: '#92400e',
    tagColor: '#ffffff',
  },
  {
    id: 'dia-del-nino',
    name: 'Día del Niño',
    emoji: '🎈',
    headline: 'Un día para jugar y sonreír',
    message: 'Celebra a los peques con un catálogo lleno de color.',
    accent: '#0e7490',
    border: '#67e8f9',
    surface: '#ecfeff',
    tagBackground: '#0e7490',
    tagColor: '#ffffff',
  },
] as const;

export type CampaignId = (typeof CAMPAIGN_THEMES)[number]['id'];

export interface CampaignSchedule {
  enabled: boolean;
  startDate: string;
  endDate: string;
}

export type CampaignSettings = Record<CampaignId, CampaignSchedule>;

function dateFor(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function blackFridayFor(year: number): number {
  const firstDay = new Date(Date.UTC(year, 10, 1)).getUTCDay();
  return 1 + ((5 - firstDay + 7) % 7) + 21;
}

export function createDefaultCampaignSettings(year = new Date().getFullYear()): CampaignSettings {
  const blackFriday = blackFridayFor(year);
  return {
    'black-friday': {
      enabled: false,
      startDate: dateFor(year, 11, blackFriday),
      endDate: dateFor(year, 11, blackFriday + 2),
    },
    'buen-fin': {
      enabled: false,
      startDate: dateFor(year, 11, 13),
      endDate: dateFor(year, 11, 17),
    },
    navidad: {
      enabled: false,
      startDate: dateFor(year, 12, 1),
      endDate: dateFor(year, 12, 25),
    },
    reyes: {
      enabled: false,
      startDate: dateFor(year, 1, 1),
      endDate: dateFor(year, 1, 6),
    },
    'dia-del-nino': {
      enabled: false,
      startDate: dateFor(year, 4, 20),
      endDate: dateFor(year, 4, 30),
    },
  };
}

function monthDay(date: string): string {
  return date.slice(5, 10);
}

export function isWithinCampaignDates(
  date: string,
  startDate: string,
  endDate: string
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return false;
  }

  const current = monthDay(date);
  const start = monthDay(startDate);
  const end = monthDay(endDate);
  return start <= end ? current >= start && current <= end : current >= start || current <= end;
}

export function getActiveCampaignId(
  campaigns: CampaignSettings,
  date: string
): CampaignId | null {
  for (const theme of CAMPAIGN_THEMES) {
    const schedule = campaigns[theme.id];
    if (
      schedule?.enabled &&
      isWithinCampaignDates(date, schedule.startDate, schedule.endDate)
    ) {
      return theme.id;
    }
  }
  return null;
}
