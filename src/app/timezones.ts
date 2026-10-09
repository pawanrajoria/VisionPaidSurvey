/**
 * Time zones per country (ISO 3166 alpha-2 -> IANA zones), used by the
 * "Change time zone" setting. Countries not listed here fall back to the full list the
 * browser knows (Intl.supportedValuesOf('timeZone')).
 */
export const COUNTRY_TIME_ZONES: Record<string, string[]> = {
    US: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu'],
    CA: ['America/St_Johns', 'America/Halifax', 'America/Toronto', 'America/Winnipeg', 'America/Regina', 'America/Edmonton', 'America/Vancouver'],
    MX: ['America/Mexico_City', 'America/Cancun', 'America/Monterrey', 'America/Chihuahua', 'America/Hermosillo', 'America/Tijuana'],
    BR: ['America/Sao_Paulo', 'America/Bahia', 'America/Fortaleza', 'America/Manaus', 'America/Cuiaba', 'America/Rio_Branco', 'America/Noronha'],
    AR: ['America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Argentina/Mendoza'],
    CL: ['America/Santiago', 'America/Punta_Arenas', 'Pacific/Easter'],
    CO: ['America/Bogota'],
    PE: ['America/Lima'],
    GB: ['Europe/London'],
    IE: ['Europe/Dublin'],
    FR: ['Europe/Paris'],
    DE: ['Europe/Berlin'],
    ES: ['Europe/Madrid', 'Atlantic/Canary'],
    PT: ['Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores'],
    IT: ['Europe/Rome'],
    NL: ['Europe/Amsterdam'],
    BE: ['Europe/Brussels'],
    CH: ['Europe/Zurich'],
    AT: ['Europe/Vienna'],
    SE: ['Europe/Stockholm'],
    NO: ['Europe/Oslo'],
    DK: ['Europe/Copenhagen'],
    FI: ['Europe/Helsinki'],
    PL: ['Europe/Warsaw'],
    GR: ['Europe/Athens'],
    TR: ['Europe/Istanbul'],
    UA: ['Europe/Kyiv'],
    RU: ['Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Yakutsk', 'Asia/Vladivostok', 'Asia/Magadan', 'Asia/Kamchatka'],
    IN: ['Asia/Kolkata'],
    PK: ['Asia/Karachi'],
    BD: ['Asia/Dhaka'],
    LK: ['Asia/Colombo'],
    NP: ['Asia/Kathmandu'],
    AE: ['Asia/Dubai'],
    SA: ['Asia/Riyadh'],
    IL: ['Asia/Jerusalem'],
    CN: ['Asia/Shanghai', 'Asia/Urumqi'],
    HK: ['Asia/Hong_Kong'],
    JP: ['Asia/Tokyo'],
    KR: ['Asia/Seoul'],
    SG: ['Asia/Singapore'],
    MY: ['Asia/Kuala_Lumpur', 'Asia/Kuching'],
    TH: ['Asia/Bangkok'],
    VN: ['Asia/Ho_Chi_Minh'],
    PH: ['Asia/Manila'],
    ID: ['Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura'],
    KZ: ['Asia/Almaty', 'Asia/Aqtobe'],
    AU: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Perth', 'Australia/Hobart'],
    NZ: ['Pacific/Auckland', 'Pacific/Chatham'],
    ZA: ['Africa/Johannesburg'],
    NG: ['Africa/Lagos'],
    KE: ['Africa/Nairobi'],
    GH: ['Africa/Accra'],
    EG: ['Africa/Cairo'],
    MA: ['Africa/Casablanca']
};

export const USER_TIME_ZONE_KEY = 'userTimeZone';

/** Every zone this browser knows; empty on very old browsers. */
export function allTimeZones(): string[] {
    try {
        return (Intl as any).supportedValuesOf('timeZone') as string[];
    } catch {
        return [];
    }
}

export function zonesForCountry(countryCode: string | null | undefined): string[] {
    return COUNTRY_TIME_ZONES[(countryCode ?? '').toUpperCase()] ?? [];
}

export function browserTimeZone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
        return 'UTC';
    }
}

/**
 * Current UTC offset of an IANA zone in the "+0530" form Angular's DatePipe accepts.
 * Returns undefined when the zone is unknown, so the pipe falls back to the browser zone.
 */
export function offsetFor(timeZone: string | null | undefined): string | undefined {
    if (!timeZone) return undefined;
    try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' }).formatToParts(new Date());
        const name = parts.find(p => p.type === 'timeZoneName')?.value ?? '';
        if (name === 'GMT') return '+0000';
        const match = name.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
        if (!match) return undefined;
        return `${match[1]}${match[2].padStart(2, '0')}${match[3] ?? '00'}`;
    } catch {
        return undefined;
    }
}

/** "Asia/Kolkata" -> "Asia/Kolkata (UTC+05:30)". */
export function zoneLabel(timeZone: string): string {
    const offset = offsetFor(timeZone);
    return offset ? `${timeZone.replace(/_/g, ' ')} (UTC${offset.slice(0, 3)}:${offset.slice(3)})` : timeZone.replace(/_/g, ' ');
}
