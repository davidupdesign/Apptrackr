export enum Status {
  SAVED = "SAVED",
  APPLIED = "APPLIED",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  REJECTED = "REJECTED",
}

export interface User {
  id: String;
  email: String;
  name: String;
  createdAt: String;
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
}
