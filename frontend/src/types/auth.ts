export enum UserRole {
  RETAILER = "retailer",
  CORPORATE = "corporate",
  SELLER = "seller",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
  role: UserRole;
  company?: string;
}
