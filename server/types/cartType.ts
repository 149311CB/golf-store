export interface IItemInterface {
  _id?: string;
  product: any;
  // stock: number;
  variant: string;
  quantity: number;
}

export interface ICartInterface {
  _id?: string;
  products: IItemInterface[];
  user: string | null;
  isActive: boolean;
}
