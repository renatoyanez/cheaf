import { Product } from "./products";

export type Package = {
  packageId: string;
  email: string;
  products: Product[];
  packageName?: string;
};
