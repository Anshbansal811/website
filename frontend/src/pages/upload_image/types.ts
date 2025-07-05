export interface FormData {
  productType: string;
  color: string;
  mrp?: string;
  productName: string;
  description: string;
  existingProductId?: string;
  sizes: SizeQuantity[];
}

export interface SizeQuantity {
  sizeId: string;
  sizeName: string;
  quantity: number;
}

export interface ExistingProduct {
  id: string;
  name: string;
  type: {
    name: string;
  };
}

export interface ProductType {
  id: string;
  name: string;
}

export interface Size {
  id: string;
  name: string;
}

export interface ImageFiles {
  front: File | null;
  back: File | null;
  left: File | null;
  right: File | null;
  top: File | null;
  bottom: File | null;
  details: File[];
  others: File[];
}

export interface ImagePreview {
  id: string;
  url: string;
  type: keyof ImageFiles;
  file: File;
}
