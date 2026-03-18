export type Gear = {
  id: number;
  menu_id: number;
  product_name: string;
  review: string | null;
  brands: { id: number, name: string };
};