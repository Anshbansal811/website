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

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company?: string;
    phonenumber: String;
  }) => Promise<void>;
  logout: () => void;
  canAccessUserData: (targetUserId: string) => boolean;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  phonenumber: string;
}
