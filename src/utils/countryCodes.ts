export interface CountryCode {
  code: string;
  country: string;
  flag: string;
  iso: string;
}

export const countryCodes: CountryCode[] = [
  { code: "+244", country: "Angola", flag: "\u{1F1E6}\u{1F1F4}", iso: "AO" },
  { code: "+55", country: "Brasil", flag: "\u{1F1E7}\u{1F1F7}", iso: "BR" },
  { code: "+351", country: "Portugal", flag: "\u{1F1F5}\u{1F1F9}", iso: "PT" },
  { code: "+258", country: "Mo\u00E7ambique", flag: "\u{1F1F2}\u{1F1FF}", iso: "MZ" },
  { code: "+238", country: "Cabo Verde", flag: "\u{1F1E8}\u{1F1FB}", iso: "CV" },
  { code: "+239", country: "S\u00E3o Tom\u00E9 e Pr\u00EDncipe", flag: "\u{1F1F8}\u{1F1F9}", iso: "ST" },
  { code: "+245", country: "Guin\u00E9-Bissau", flag: "\u{1F1EC}\u{1F1FC}", iso: "GW" },
  { code: "+1", country: "Estados Unidos", flag: "\u{1F1FA}\u{1F1F8}", iso: "US" },
  { code: "+44", country: "Reino Unido", flag: "\u{1F1EC}\u{1F1E7}", iso: "GB" },
  { code: "+33", country: "Fran\u00E7a", flag: "\u{1F1EB}\u{1F1F7}", iso: "FR" },
  { code: "+49", country: "Alemanha", flag: "\u{1F1E9}\u{1F1EA}", iso: "DE" },
  { code: "+34", country: "Espanha", flag: "\u{1F1EA}\u{1F1F8}", iso: "ES" },
  { code: "+27", country: "\u00C1frica do Sul", flag: "\u{1F1FF}\u{1F1E6}", iso: "ZA" },
  { code: "+234", country: "Nig\u00E9ria", flag: "\u{1F1F3}\u{1F1EC}", iso: "NG" },
  { code: "+254", country: "Qu\u00E9nia", flag: "\u{1F1F0}\u{1F1EA}", iso: "KE" },
  { code: "+255", country: "Tanz\u00E2nia", flag: "\u{1F1F9}\u{1F1FF}", iso: "TZ" },
  { code: "+256", country: "Uganda", flag: "\u{1F1FA}\u{1F1EC}", iso: "UG" },
  { code: "+233", country: "Gana", flag: "\u{1F1EC}\u{1F1ED}", iso: "GH" },
  { code: "+237", country: "Camar\u00F5es", flag: "\u{1F1E8}\u{1F1F2}", iso: "CM" },
  { code: "+243", country: "RD Congo", flag: "\u{1F1E8}\u{1F1E9}", iso: "CD" },
  { code: "+242", country: "Congo", flag: "\u{1F1E8}\u{1F1EC}", iso: "CG" },
  { code: "+250", country: "Ruanda", flag: "\u{1F1F7}\u{1F1FC}", iso: "RW" },
  { code: "+39", country: "It\u00E1lia", flag: "\u{1F1EE}\u{1F1F9}", iso: "IT" },
  { code: "+86", country: "China", flag: "\u{1F1E8}\u{1F1F3}", iso: "CN" },
  { code: "+91", country: "\u00CDndia", flag: "\u{1F1EE}\u{1F1F3}", iso: "IN" },
  { code: "+81", country: "Jap\u00E3o", flag: "\u{1F1EF}\u{1F1F5}", iso: "JP" },
  { code: "+971", country: "Emirados \u00C1rabes", flag: "\u{1F1E6}\u{1F1EA}", iso: "AE" },
  { code: "+966", country: "Ar\u00E1bia Saudita", flag: "\u{1F1F8}\u{1F1E6}", iso: "SA" },
  { code: "+212", country: "Marrocos", flag: "\u{1F1F2}\u{1F1E6}", iso: "MA" },
  { code: "+20", country: "Egito", flag: "\u{1F1EA}\u{1F1EC}", iso: "EG" },
];

export function getCountryByIso(iso: string): CountryCode | undefined {
  return countryCodes.find((c) => c.iso === iso);
}

export function getCountryByCode(code: string): CountryCode | undefined {
  return countryCodes.find((c) => c.code === code);
}