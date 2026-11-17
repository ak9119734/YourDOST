export type ServicePillar = 'counseling' | 'self_help' | 'assessment' | 'program';

export type UrgencyLevel = 'routine' | 'elevated' | 'urgent_human';

export type TimeAvailable = '5_min' | '15_min' | '30_plus';
export type EnergyLevel = 'low' | 'moderate' | 'steady';
export type SupportPreference = 'open' | 'self_guided' | 'talk_to_someone';

export interface UserContextInput {
  message: string;
  timeAvailable: TimeAvailable;
  energyLevel: EnergyLevel;
  supportPreference: SupportPreference;
  assessmentSummary?: string;
}

export interface CounselorProfile {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  languages: string[];
  nextAvailable: string;
  sessionFormats: ('Chat' | 'Audio' | 'Video')[];
  bio: string;
  imageUrl: string;
  availableSlots: string[];
}

export interface SelfHelpResource {
  id: string;
  title: string;
  durationLabel: string;
  category: string;
  summary: string;
  interactiveType: 'breathing' | 'worry_triage' | 'sleep_winddown';
}

export interface AssessmentItem {
  id: string;
  title: string;
  durationLabel: string;
  questionCount: number;
  summary: string;
  questions: {
    id: string;
    prompt: string;
    options: { label: string; score: number }[];
  }[];
}

export interface WellbeingProgram {
  id: string;
  title: string;
  durationLabel: string;
  cadence: string;
  summary: string;
  focusArea: string;
  modules: string[];
}

export interface RecommendedStep {
  id: string;
  pillar: ServicePillar;
  title: string;
  whyThisFits: string;
  expectedDuration: string;
  actionLabel: string;
  counselorId?: string;
}

export interface NavigatorRecommendationResponse {
  urgencyLevel: UrgencyLevel;
  safetyEscalationReason?: string;
  empatheticReflection: string;
  identifiedThemes: string[];
  primaryRecommendation: RecommendedStep;
  secondaryRecommendations: RecommendedStep[];
  clarifyingQuestion?: string;
  privacyNote: string;
}

export interface BookingConfirmation {
  referenceId: string;
  counselorName: string;
  format: 'Chat' | 'Audio' | 'Video';
  slot: string;
  alias: string;
  priorityCallback: boolean;
  createdAt: string;
}
