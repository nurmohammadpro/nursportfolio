export type ServiceType =
  | "web-development"
  | "web-automation"
  | "wordpress-design"
  | "wordpress-security"
  | "seo"
  | "digital-marketing";

export interface Service {
  id: ServiceType;
  name: string;
  description: string;
  startingPrice: number;
  duration: string;
  icon: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  source: "contact-form" | "referral" | "manual-entry";
  createdAt: string;
  updatedAt: string;
}

export type PaymentModel = "milestone" | "advance";

export type ProjectStatus =
  | "new_inquiry"
  | "contacted"
  | "proposal_sent"
  | "deposit_paid" // This can now mean "advance paid"
  | "in_progress"
  | "in_review"
  | "completed"
  | "on_hold"
  | "cancelled";

export interface Milestone {
  label: string;
  completed: boolean;
  completedAt?: string;
  price?: number;
}

export interface Project {
  id: string;
  clientId: string;
  serviceType: ServiceType;
  title: string;
  description: string;

  tottalPrice?: number;
  paymentModel: PaymentModel;
  advancePercentage?: number;

  status: ProjectStatus;
  progress: number;
  milestones: Milestone[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
}

export interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType: ServiceType;
  projectDescription: string;
  budget?: string;
}
