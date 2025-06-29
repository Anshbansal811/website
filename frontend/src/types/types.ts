export enum UserRole {
  RETAILER = "RETAILER",
  CORPORATE = "CORPORATE",
  SELLER = "SELLER",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  phonenumber: string;
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
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company?: string;
    phonenumber: string;
  }) => Promise<any>;
  logout: () => void;
  canAccessUserData: (targetUserId: string) => boolean;
  clearError: () => void; // Add this line
}

export interface Contact {
  id: number;
  name: string;
  phonenumber: string;
  company: String;
  createdAt: string;
  city: String;
  state: String;
  gstPan: String;
  message: string;
}
export interface ProductImage {
  url: string;
  imageType: { name: string }; // Only 'FRONT' images will be present from all-product API
}

export interface ProductVariationImageGroup {
  images: ProductImage[];
}

export interface ProductVariation {
  color: string;
  mrp: number;
  stock: number;
  images: ProductVariationImageGroup[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  type: { name: string }; // 💡 tightened
  variations: ProductVariation[];
}
