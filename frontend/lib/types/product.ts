export type ProductStatus = "DRAFT" | "PUBLISHED" | "SOLD" | "ARCHIVED";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  status: ProductStatus;
  gameTitle: string;
  accountLevel?: number | null;
  rank?: string | null;
  serverRegion?: string | null;
  loginMethod?: string | null;
  thumbnailUrl?: string | null;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
};