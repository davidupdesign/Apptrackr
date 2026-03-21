export enum Status {
  SAVED = "SAVED",
  APPLIED = "APPLIED",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: Status;
  appliedAt: string;
  notes?: string;
  salary?: number;
  url?: string;
  updatedAt: string;
  isFavorite: boolean;
}
