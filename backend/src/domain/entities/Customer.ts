export interface Customer {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  company?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
