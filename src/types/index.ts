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

export type Currency = 'PKR';

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

export interface PartOption {
  type: 'Genuine' | 'Aftermarket' | 'Used';
  price: number;
  availability?: string; // e.g. "Low stock", "Common"
}

export interface RepairCosts {
  labor: number;
  parts: PartOption[];
  bestOptionTotal: number; // The logic-selected "best" total (e.g. usually Aftermarket or Kabli)
}

export interface DamageItem {
  id: string;
  type: DamageType;
  severity: Severity;
  description: string;
  estimatedCost: number; // Keep for backward compatibility/summary, map to bestOptionTotal
  repairCosts?: RepairCosts; // Optional for backward compatibility
  box_2d: number[]; // [ymin, xmin, ymax, xmax] normalized 0-1000
}

export interface AssessmentResult {
  id: string; // Report ID
  vehicleType: string;
  damages: DamageItem[];
  totalEstimatedCost: number; // Always in PKR from API
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
