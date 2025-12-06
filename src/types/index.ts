export enum DamageType {
  DENT = 'Dent',
  SCRATCH = 'Scratch',
  CRACK = 'Crack',
  BROKEN_GLASS = 'Broken Glass',
  PAINT_DAMAGE = 'Paint Damage',
  MISSING_PART = 'Missing Part',
  OTHER = 'Other'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export type Currency = 'USD' | 'PKR' | 'EUR' | 'GBP';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currency: Currency;
  companyName?: string;
  credits: number;
  hasCompletedOnboarding: boolean;
}

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DamageItem {
  id: string;
  type: DamageType;
  severity: Severity;
  description: string;
  estimatedCost: number; // Always in USD from API
  box_2d: number[]; // [ymin, xmin, ymax, xmax] normalized 0-1000
}

export interface AssessmentResult {
  id?: string; // For history
  vehicleType: string;
  damages: DamageItem[];
  totalEstimatedCost: number; // Always in USD from API
  summary: string;
  confidenceScore: number;
  timestamp: string;
}

export interface SavedReport extends AssessmentResult {
  imageUrl: string; // Base64 or URL
  userId: string;
}

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
}
