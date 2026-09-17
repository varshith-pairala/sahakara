export type Language = 'en' | 'te' | 'hi' | 'ta';

export type UserRole = 'citizen' | 'worker' | 'federation';

export type SkillBadge = 'Master Artisan' | 'Certified Craftsman' | 'Verified Specialist' | 'Apprentice';

export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  trade: string;
  experienceYears: number;
  societyId: string;
  societyName: string;
  district: string;
  state: string;
  eShramId: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  hourlyRate: number;
  isVerified: boolean;
  kycStatus: 'verified' | 'pending' | 'rejected';
  skillBadge: SkillBadge;
  policeVerified: boolean;
  insuranceActive: boolean;
  available: boolean;
  avatar: string;
  skills: string[];
  lat: number;
  lng: number;
  exactLocality?: string;
  aadhaarMasked?: string;
  nsqfLevel?: string;
  policeCertNumber?: string;
  policeCertDate?: string;
  coopMemberId?: string;
  isSample?: boolean;
}

export interface SocietyInfo {
  id: string;
  name: string;
  regNumber: string;
  district: string;
  state: string;
  presidentName: string;
  contactNumber: string;
  workersCount: number;
  activeJobsCount: number;
  welfareCorpusFund: number;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  workerId: string;
  workerName: string;
  workerPhone?: string;
  workerTrade: string;
  societyName: string;
  serviceCategory: string;
  serviceDescription: string;
  scheduledTime: string;
  isEmergency: boolean;
  status: 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  workerPayout: number;
  welfareCess: number;
  cooperativeFee: number;
  paymentMethod: 'UPI' | 'RuPay' | 'Cash' | 'Escrow';
  paymentStatus: 'paid' | 'pending' | 'escrowed';
  rating?: number;
  review?: string;
  createdAt: string;
  etaMinutes?: number;
}

export interface WelfareClaimRecord {
  id: string;
  workerId: string;
  workerName: string;
  claimType: 'Ayushman Health Cover' | 'Accident Insurance' | 'Emergency Medical Grant' | 'Maternity / Child Support' | 'Tool Kit Upgrade Subsidy';
  amount: number;
  status: 'Approved & Disbursed' | 'Under Verification' | 'Submitted';
  dateSubmitted: string;
  societyName: string;
  description: string;
}

export interface PlatformOverview {
  federationsCount: number;
  primarySocietiesCount: number;
  registeredWorkersCount: number;
  activeWorkersCount: number;
  totalCompletedGigs: number;
  totalWorkerWagesDisbursed: number;
  totalWelfarePool: number;
  verifiedWorkersPercentage: number;
  avgWorkerFairSharePercentage: number;
  privateCommissionSavings: number;
}

export interface DemandSurgeCategory {
  trade: string;
  demandSurge: string;
  reason: string;
  recommendedAllocation: string;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  district: string;
  workerTrade?: string;
  societyName?: string;
  workerId?: string;
}

export interface WorkerJobNotification {
  id: string;
  bookingId: string;
  workerId: string;
  workerName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceCategory: string;
  serviceDescription: string;
  scheduledTime: string;
  totalAmount: number;
  workerPayout: number;
  welfareCess: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  isEmergency?: boolean;
}

export interface AIDemandForecastResult {
  summary: string;
  peakCategories: DemandSurgeCategory[];
  cooperativeFederationActionPlan: string[];
  projectedFederationTurnover: string;
  projectedWorkerFairWages: string;
  mode?: string;
}

