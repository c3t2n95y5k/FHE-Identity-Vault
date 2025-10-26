export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "KR", name: "South Korea" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
] as const;

/**
 * Encode a country selection into the numeric code stored on-chain.
 * Matches the legacy behaviour used during identity creation.
 */
export const countryCodeToNumeric = (code: string): number => {
  if (!code) return 0;
  // Legacy encoding: first character charCode modulo 100
  return code.charCodeAt(0) % 100;
};

/**
 * Resolve the stored numeric domicile value back to a human friendly label.
 */
export const numericCodeToCountryLabel = (value: number | undefined): string => {
  if (value === undefined || Number.isNaN(value)) {
    return "Unknown";
  }

  const match = COUNTRIES.find(
    (country) => countryCodeToNumeric(country.code) === value
  );

  if (match) {
    return `${match.name} (${match.code})`;
  }

  return `Code ${value}`;
};
