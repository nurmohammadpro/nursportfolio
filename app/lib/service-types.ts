export interface ServiceRequest {
  id: string;
  clientId: string;
  clientEmail: string;
  serviceName: string;
  packageType: "basic" | "standard" | "premium";
  price: number;
  status: "pending_payment" | "in_progress" | "completed" | "cancelled";
  progress: number; // 0-100
  milestones: {
    label: string;
    completed: boolean;
  }[];
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
}
