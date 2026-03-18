import { Brand } from "../brands/type";
export type Gear = {
    id: number;
    menu_id: number;
    product_name: string;
    review: string | null;
    brands: Brand;
    picture: string | null;
  };