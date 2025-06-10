export interface FormData {
  quantity: string;
  productType: string;
  color: string;
  mrp?: string;
  productName: string;
  description: string;
  existingProductId?: string;
}

export interface ExistingProduct {
  _id: string;
  name: string;
  type: string;
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
