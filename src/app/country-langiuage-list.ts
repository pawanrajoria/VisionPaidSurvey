export const LOCALE_COUNTRY_MAP: Record<string, string> = {
  // English
  'en': 'us',
  'en-us': 'us',
  'en-gb': 'gb',
  'en-ca': 'ca',
  'en-au': 'au',
  'en-nz': 'nz',
  'en-ie': 'ie',
  'en-in': 'in',
  'en-sg': 'sg',
  'en-za': 'za',
  'en-ph': 'ph',
  'en-hk': 'hk',
  'en-my': 'my',

  // Spanish
  'es': 'es',
  'es-es': 'es',
  'es-mx': 'mx',
  'es-ar': 'ar',
  'es-cl': 'cl',
  'es-co': 'co',
  'es-pe': 'pe',
  'es-ve': 've',
  'es-uy': 'uy',
  'es-py': 'py',
  'es-bo': 'bo',
  'es-cr': 'cr',
  'es-pa': 'pa',
  'es-gt': 'gt',
  'es-hn': 'hn',
  'es-ni': 'ni',
  'es-sv': 'sv',
  'es-do': 'do',
  'es-pr': 'pr',
  'es-ec': 'ec',

  // French
  'fr': 'fr',
  'fr-fr': 'fr',
  'fr-ca': 'ca',
  'fr-be': 'be',
  'fr-ch': 'ch',
  'fr-lu': 'lu',

  // German
  'de': 'de',
  'de-de': 'de',
  'de-at': 'at',
  'de-ch': 'ch',
  'de-lu': 'lu',

  // Italian
  'it': 'it',
  'it-it': 'it',
  'it-ch': 'ch',

  // Portuguese
  'pt': 'pt',
  'pt-pt': 'pt',
  'pt-br': 'br',

  // Dutch
  'nl': 'nl',
  'nl-nl': 'nl',
  'nl-be': 'be',

  // Scandinavian
  'da': 'dk',
  'da-dk': 'dk',
  'sv': 'se',
  'sv-se': 'se',
  'sv-fi': 'fi',
  'no': 'no',
  'nb-no': 'no',
  'nn-no': 'no',
  'fi': 'fi',
  'fi-fi': 'fi',
  'is': 'is',
  'is-is': 'is',

  // Eastern Europe
  'pl': 'pl',
  'pl-pl': 'pl',
  'cs': 'cz',
  'cs-cz': 'cz',
  'sk': 'sk',
  'sk-sk': 'sk',
  'hu': 'hu',
  'hu-hu': 'hu',
  'ro': 'ro',
  'ro-ro': 'ro',
  'bg': 'bg',
  'bg-bg': 'bg',
  'hr': 'hr',
  'hr-hr': 'hr',
  'sl': 'si',
  'sl-si': 'si',
  'sr': 'rs',
  'sr-rs': 'rs',
  'lt': 'lt',
  'lt-lt': 'lt',
  'lv': 'lv',
  'lv-lv': 'lv',
  'et': 'ee',
  'et-ee': 'ee',

  // Russian & CIS
  'ru': 'ru',
  'ru-ru': 'ru',
  'uk': 'ua',
  'uk-ua': 'ua',
  'be': 'by',
  'be-by': 'by',
  'kk': 'kz',
  'kk-kz': 'kz',

  // Asian
  'zh': 'cn',
  'zh-cn': 'cn',
  'zh-sg': 'sg',
  'zh-hk': 'hk',
  'zh-mo': 'mo',
  'zh-tw': 'tw',

  'ja': 'jp',
  'ja-jp': 'jp',

  'ko': 'kr',
  'ko-kr': 'kr',

  'hi': 'in',
  'hi-in': 'in',

  'bn': 'bd',
  'bn-bd': 'bd',

  'ta': 'in',
  'ta-in': 'in',

  'te': 'in',
  'te-in': 'in',

  'ml': 'in',
  'ml-in': 'in',

  'mr': 'in',
  'mr-in': 'in',

  'gu': 'in',
  'gu-in': 'in',

  'pa': 'in',
  'pa-in': 'in',

  'ur': 'pk',
  'ur-pk': 'pk',

  'th': 'th',
  'th-th': 'th',

  'vi': 'vn',
  'vi-vn': 'vn',

  'id': 'id',
  'id-id': 'id',

  'ms': 'my',
  'ms-my': 'my',

  'tl': 'ph',
  'fil': 'ph',
  'fil-ph': 'ph',

  // Middle East
  'ar': 'sa',
  'ar-sa': 'sa',
  'ar-ae': 'ae',
  'ar-eg': 'eg',
  'ar-kw': 'kw',
  'ar-qa': 'qa',
  'ar-bh': 'bh',
  'ar-om': 'om',
  'ar-jo': 'jo',
  'ar-lb': 'lb',
  'ar-ma': 'ma',
  'ar-dz': 'dz',
  'ar-tn': 'tn',
  'ar-iq': 'iq',

  'he': 'il',
  'he-il': 'il',

  'fa': 'ir',
  'fa-ir': 'ir',

  'tr': 'tr',
  'tr-tr': 'tr',

  // Africa
  'af': 'za',
  'af-za': 'za',
  'sw': 'ke',
  'sw-ke': 'ke',

  // Default fallback
  'default': 'us'
};


export const SUPPORTED_LOCALES: { hreflang: string; urlPrefix: string }[] = [
  // English
  { hreflang: 'en-US', urlPrefix: 'en-us' },
  { hreflang: 'en-GB', urlPrefix: 'en-gb' },
  { hreflang: 'en-CA', urlPrefix: 'en-ca' },
  { hreflang: 'en-AU', urlPrefix: 'en-au' },
  { hreflang: 'en-NZ', urlPrefix: 'en-nz' },
  { hreflang: 'en-IE', urlPrefix: 'en-ie' },
  { hreflang: 'en-IN', urlPrefix: 'en-in' },
  { hreflang: 'en-SG', urlPrefix: 'en-sg' },
  { hreflang: 'en-PH', urlPrefix: 'en-ph' },
  { hreflang: 'en-MY', urlPrefix: 'en-my' },
  { hreflang: 'en-HK', urlPrefix: 'en-hk' },
  { hreflang: 'en-ZA', urlPrefix: 'en-za' },
  { hreflang: 'en-NG', urlPrefix: 'en-ng' },
  
  // Potential additions for global reach
  { hreflang: 'en-AE', urlPrefix: 'en-ae' }, // UAE
  { hreflang: 'en-PK', urlPrefix: 'en-pk' }, // Pakistan
  { hreflang: 'en-KE', urlPrefix: 'en-ke' }, // Kenya
  { hreflang: 'en-GH', urlPrefix: 'en-gh' }, // Ghana
  { hreflang: 'en-JM', urlPrefix: 'en-jm' }, // Jamaica
  { hreflang: 'en-TT', urlPrefix: 'en-tt' }, // Trinidad and Tobago
  { hreflang: 'en-MT', urlPrefix: 'en-mt' }, // Malta
  { hreflang: 'en-CY', urlPrefix: 'en-cy' }, // Cyprus
  { hreflang: 'en-CH', urlPrefix: 'en-ch' },  // Switzerland (English commonly used)

  // Spanish
  { hreflang: 'es-ES', urlPrefix: 'es-es' },
  { hreflang: 'es-MX', urlPrefix: 'es-mx' },
  { hreflang: 'es-AR', urlPrefix: 'es-ar' },
  { hreflang: 'es-CL', urlPrefix: 'es-cl' },
  { hreflang: 'es-CO', urlPrefix: 'es-co' },
  { hreflang: 'es-PE', urlPrefix: 'es-pe' },
  { hreflang: 'es-VE', urlPrefix: 'es-ve' },
  { hreflang: 'es-EC', urlPrefix: 'es-ec' },
  { hreflang: 'es-UY', urlPrefix: 'es-uy' },
  { hreflang: 'es-PY', urlPrefix: 'es-py' },
  { hreflang: 'es-BO', urlPrefix: 'es-bo' },
  { hreflang: 'es-CR', urlPrefix: 'es-cr' },
  { hreflang: 'es-PA', urlPrefix: 'es-pa' },
  { hreflang: 'es-GT', urlPrefix: 'es-gt' },
  { hreflang: 'es-HN', urlPrefix: 'es-hn' },
  { hreflang: 'es-NI', urlPrefix: 'es-ni' },
  { hreflang: 'es-SV', urlPrefix: 'es-sv' },
  { hreflang: 'es-DO', urlPrefix: 'es-do' },
  { hreflang: 'es-PR', urlPrefix: 'es-pr' },
  { hreflang: 'es-US', urlPrefix: 'es-us' }, // US Spanish speakers
  { hreflang: 'es-GQ', urlPrefix: 'es-gq' }, // Equatorial Guinea
  { hreflang: 'es-CU', urlPrefix: 'es-cu' }, // Cuba
  { hreflang: 'es-PH', urlPrefix: 'es-ph' },  // Philippines (Historical Spanish presence)

  // Portuguese
  { hreflang: 'pt-BR', urlPrefix: 'pt-br' },
  { hreflang: 'pt-PT', urlPrefix: 'pt-pt' },
  { hreflang: 'pt-AO', urlPrefix: 'pt-ao' }, // Angola
  { hreflang: 'pt-MZ', urlPrefix: 'pt-mz' }, // Mozambique
  { hreflang: 'pt-CV', urlPrefix: 'pt-cv' }, // Cape Verde
  { hreflang: 'pt-ST', urlPrefix: 'pt-st' }, // São Tomé and Príncipe
  { hreflang: 'pt-GW', urlPrefix: 'pt-gw' }, // Guinea-Bissau
  { hreflang: 'pt-TL', urlPrefix: 'pt-tl' },  // Timor-Leste

  // French
  { hreflang: 'fr-FR', urlPrefix: 'fr-fr' },
  { hreflang: 'fr-CA', urlPrefix: 'fr-ca' },
  { hreflang: 'fr-BE', urlPrefix: 'fr-be' },
  { hreflang: 'fr-CH', urlPrefix: 'fr-ch' },
  { hreflang: 'fr-LU', urlPrefix: 'fr-lu' }, // Luxembourg
  { hreflang: 'fr-MC', urlPrefix: 'fr-mc' }, // Monaco
  { hreflang: 'fr-DZ', urlPrefix: 'fr-dz' }, // Algeria
  { hreflang: 'fr-MA', urlPrefix: 'fr-ma' }, // Morocco
  { hreflang: 'fr-TN', urlPrefix: 'fr-tn' }, // Tunisia
  { hreflang: 'fr-SN', urlPrefix: 'fr-sn' }, // Senegal
  { hreflang: 'fr-CI', urlPrefix: 'fr-ci' },  // Ivory Coast

  // German
  { hreflang: 'de-DE', urlPrefix: 'de-de' },
  { hreflang: 'de-AT', urlPrefix: 'de-at' },
  { hreflang: 'de-CH', urlPrefix: 'de-ch' },
  { hreflang: 'de-LU', urlPrefix: 'de-lu' }, // Luxembourg
  { hreflang: 'de-LI', urlPrefix: 'de-li' }, // Liechtenstein
  { hreflang: 'de-BE', urlPrefix: 'de-be' },  // Belgium (German-speaking community)

  // Italian
  { hreflang: 'it-IT', urlPrefix: 'it-it' },
  { hreflang: 'it-CH', urlPrefix: 'it-ch' },
  { hreflang: 'it-SM', urlPrefix: 'it-sm' }, // San Marino
  { hreflang: 'it-VA', urlPrefix: 'it-va' },  // Vatican City

  // Dutch
  { hreflang: 'nl-NL', urlPrefix: 'nl-nl' },
  { hreflang: 'nl-BE', urlPrefix: 'nl-be' },
  { hreflang: 'nl-AW', urlPrefix: 'nl-aw' }, // Aruba
  { hreflang: 'nl-CW', urlPrefix: 'nl-cw' }, // Curaçao
  { hreflang: 'nl-SX', urlPrefix: 'nl-sx' },  // Sint Maarten

  // Nordic
  { hreflang: 'da-DK', urlPrefix: 'da-dk' },
  { hreflang: 'sv-SE', urlPrefix: 'sv-se' },
  { hreflang: 'fi-FI', urlPrefix: 'fi-fi' },
  { hreflang: 'nb-NO', urlPrefix: 'nb-no' },

  // Eastern Europe
  { hreflang: 'pl-PL', urlPrefix: 'pl-pl' },
  { hreflang: 'cs-CZ', urlPrefix: 'cs-cz' },
  { hreflang: 'sk-SK', urlPrefix: 'sk-sk' },
  { hreflang: 'hu-HU', urlPrefix: 'hu-hu' },
  { hreflang: 'ro-RO', urlPrefix: 'ro-ro' },
  { hreflang: 'bg-BG', urlPrefix: 'bg-bg' },
  { hreflang: 'hr-HR', urlPrefix: 'hr-hr' },
  { hreflang: 'sl-SI', urlPrefix: 'sl-si' },
  { hreflang: 'sr-RS', urlPrefix: 'sr-rs' },
  { hreflang: 'lt-LT', urlPrefix: 'lt-lt' },
  { hreflang: 'lv-LV', urlPrefix: 'lv-lv' },
  { hreflang: 'et-EE', urlPrefix: 'et-ee' },

  // Russian / CIS
  { hreflang: 'ru-RU', urlPrefix: 'ru-ru' },
  { hreflang: 'uk-UA', urlPrefix: 'uk-ua' },
  { hreflang: 'kk-KZ', urlPrefix: 'kk-kz' },

  // Asian
  { hreflang: 'zh-CN', urlPrefix: 'zh-cn' },
  { hreflang: 'zh-TW', urlPrefix: 'zh-tw' },
  { hreflang: 'zh-HK', urlPrefix: 'zh-hk' },
  { hreflang: 'ja-JP', urlPrefix: 'ja-jp' },
  { hreflang: 'ko-KR', urlPrefix: 'ko-kr' },
  { hreflang: 'th-TH', urlPrefix: 'th-th' },
  { hreflang: 'vi-VN', urlPrefix: 'vi-vn' },
  { hreflang: 'id-ID', urlPrefix: 'id-id' },
  { hreflang: 'ms-MY', urlPrefix: 'ms-my' },

  // Indian Languages
  { hreflang: 'hi-IN', urlPrefix: 'hi-in' },
  { hreflang: 'ta-IN', urlPrefix: 'ta-in' },
  { hreflang: 'te-IN', urlPrefix: 'te-in' },
  { hreflang: 'ml-IN', urlPrefix: 'ml-in' },
  { hreflang: 'mr-IN', urlPrefix: 'mr-in' },
  { hreflang: 'gu-IN', urlPrefix: 'gu-in' },
  { hreflang: 'pa-IN', urlPrefix: 'pa-in' },
  { hreflang: 'bn-IN', urlPrefix: 'bn-in' },

  // Middle East
  { hreflang: 'ar-SA', urlPrefix: 'ar-sa' },
  { hreflang: 'ar-AE', urlPrefix: 'ar-ae' },
  { hreflang: 'ar-EG', urlPrefix: 'ar-eg' },
  { hreflang: 'ar-KW', urlPrefix: 'ar-kw' },
  { hreflang: 'ar-QA', urlPrefix: 'ar-qa' },
  { hreflang: 'ar-BH', urlPrefix: 'ar-bh' },
  { hreflang: 'ar-OM', urlPrefix: 'ar-om' },
  { hreflang: 'he-IL', urlPrefix: 'he-il' },
  { hreflang: 'tr-TR', urlPrefix: 'tr-tr' },

  // Africa
  { hreflang: 'af-ZA', urlPrefix: 'af-za' },
  { hreflang: 'sw-KE', urlPrefix: 'sw-ke' },

  // Fallback
  { hreflang: 'x-default', urlPrefix: 'en-us' }
];

export const SUPPORTED_LOCALE_CODES = new Set(
  SUPPORTED_LOCALES
    .filter(x => x.hreflang !== 'x-default')
    .map(x => x.urlPrefix.toLowerCase())
);