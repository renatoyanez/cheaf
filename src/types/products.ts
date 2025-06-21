export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[] | string;
  tags: string[];
  rating?: number;
  thumbnail?: string
};
