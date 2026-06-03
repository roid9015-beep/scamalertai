export const regionalScams = {
  CR: ["SINPE falso", "BAC", "Banco Nacional", "BCR", "correos falsos de aduana"],
  MX: ["BBVA", "MercadoPago", "paquetería falsa", "CFE"],
  CO: ["Nequi", "Daviplata", "Bancolombia", "giro falso"],
  AR: ["MercadoPago", "cuenta DNI", "transferencia retenida"],
  US: ["PayPal", "IRS", "Amazon", "gift cards", "delivery phishing"],
  BR: ["Pix falso", "Nubank", "Mercado Pago", "boleto falso"],
  GLOBAL: ["WhatsApp", "suplantación", "phishing", "inversión falsa", "romance scam"]
};

export function regionalHint(country?: string) {
  const key = (country || "").toUpperCase();
  if (key.includes("COSTA") || key === "CR") return regionalScams.CR;
  if (key.includes("MEX") || key === "MX") return regionalScams.MX;
  if (key.includes("COLOM") || key === "CO") return regionalScams.CO;
  if (key.includes("ARG") || key === "AR") return regionalScams.AR;
  if (key.includes("UNITED STATES") || key === "US" || key === "USA") return regionalScams.US;
  if (key.includes("BRA") || key === "BR") return regionalScams.BR;
  return regionalScams.GLOBAL;
}

export function linkHeuristics(input: string) {
  const links = input.match(/https?:\/\/[^\s)]+|www\.[^\s)]+/gi) || [];
  const suspicious = links.filter((link) => {
    const normalized = link.toLowerCase();
    return (
      normalized.includes("@") ||
      normalized.includes("bit.ly") ||
      normalized.includes("tinyurl") ||
      normalized.includes("wa.me") ||
      normalized.includes("login") ||
      normalized.includes("verify") ||
      normalized.includes("secure") ||
      normalized.includes("account") ||
      /[a-z0-9-]+\.(zip|mov|click|top|xyz|rest)\b/.test(normalized)
    );
  });
  return { links, suspicious };
}
