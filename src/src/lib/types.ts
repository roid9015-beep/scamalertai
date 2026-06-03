export type RiskLevel = "safe" | "suspicious" | "dangerous";

export type AnalysisResult = {
  id?: string;
  riskLevel: RiskLevel;
  scamProbability: number;
  language: "es" | "en" | "pt";
  probableCountry: string;
  scamType: string;
  summary: string;
  redFlags: string[];
  emotionalManipulation: string[];
  suspiciousLinks: string[];
  recommendations: string[];
  extractedText?: string;
  createdAt?: string;
};

export type Plan = "free" | "premium";
