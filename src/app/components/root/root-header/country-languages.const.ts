export interface LanguageOption {
    id: number;
    name: string;
    code: string;
}

export interface CountryLanguage {
    id: number;
    countryName: string;
    countryCode: string;
    flagUrl: string;
    languages: LanguageOption[];
}

export const COUNTRY_LANGUAGE_LIST: CountryLanguage[] = [
    {
        id: 1,
        countryName: 'भारत',
        countryCode: 'IN',
        flagUrl: 'https://flagcdn.com/24x18/in.png',
        languages: [
            { id: 4, name: 'English', code: 'en' }
        ]
    },
    {
        id: 2,
        countryName: 'United States',
        countryCode: 'US',
        flagUrl: 'https://flagcdn.com/24x18/us.png',
        languages: [
            { id: 1, name: 'English', code: 'en' },
            { id: 2, name: 'Español', code: 'es' }
        ]
    },
    {
        id: 3,
        countryName: 'United Kingdom',
        countryCode: 'GB',
        flagUrl: 'https://flagcdn.com/24x18/gb.png',
        languages: [
            { id: 1, name: 'English', code: 'en' }
        ]
    },
    {
        id: 4,
        countryName: 'Canada',
        countryCode: 'CA',
        flagUrl: 'https://flagcdn.com/24x18/ca.png',
        languages: [
            { id: 1, name: 'English', code: 'en' },
            { id: 2, name: 'Français', code: 'fr' }
        ]
    },
    {
        id: 5,
        countryName: 'Australia',
        countryCode: 'AU',
        flagUrl: 'https://flagcdn.com/24x18/au.png',
        languages: [
            { id: 1, name: 'English', code: 'en' }
        ]
    },
    {
        id: 6,
        countryName: 'Singapore',
        countryCode: 'SG',
        flagUrl: 'https://flagcdn.com/24x18/sg.png',
        languages: [
            { id: 1, name: 'English', code: 'en' },
            { id: 2, name: '中文', code: 'zh' }
        ]
    },
    {
        id: 7,
        countryName: 'France',
        countryCode: 'FR',
        flagUrl: 'https://flagcdn.com/24x18/fr.png',
        languages: [
            { id: 1, name: 'Français', code: 'fr' }
        ]
    },
    {
        id: 8,
        countryName: 'Georgia',
        countryCode: 'GE',
        flagUrl: 'https://flagcdn.com/24x18/ge.png',
        languages: [
            { id: 1, name: 'English', code: 'en' },
            { id: 2, name: 'Georgia', code: 'ka' }
        ]
    },
    {
        id: 9,
        countryName: 'España',
        countryCode: 'ES',
        flagUrl: 'https://flagcdn.com/24x18/es.png',
        languages: [
            { id: 1, name: 'Español', code: 'es' }
        ]
    },
    {
        id: 10,
        countryName: 'Italia',
        countryCode: 'IT',
        flagUrl: 'https://flagcdn.com/24x18/it.png',
        languages: [
            { id: 1, name: 'Italiano', code: 'it' }
        ]
    },
    {
        id: 11,
        countryName: 'België',
        countryCode: 'BE',
        flagUrl: 'https://flagcdn.com/24x18/be.png',
        languages: [
            { id: 1, name: 'Nederlands', code: 'nl' },
            { id: 2, name: 'Français', code: 'fr' }
        ]
    },
    {
        id: 12,
        countryName: 'México',
        countryCode: 'MX',
        flagUrl: 'https://flagcdn.com/24x18/mx.png',
        languages: [
            { id: 1, name: 'Español', code: 'es' }
        ]
    },
    {
        id: 13,
        countryName: 'Brasil',
        countryCode: 'BR',
        flagUrl: 'https://flagcdn.com/24x18/br.png',
        languages: [
            { id: 1, name: 'Português', code: 'pt' }
        ]
    },
    {
        id: 14,
        countryName: 'New Zealand',
        countryCode: 'NZ',
        flagUrl: 'https://flagcdn.com/24x18/nz.png',
        languages: [
            { id: 1, name: 'English', code: 'en' }
        ]
    },
    {
        id: 15,
        countryName: 'Malaysia',
        countryCode: 'MY',
        flagUrl: 'https://flagcdn.com/24x18/my.png',
        languages: [
            { id: 1, name: 'English', code: 'en' },
            { id: 2, name: 'Bahasa Melayu', code: 'ms' }
        ]
    }
];
