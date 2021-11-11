export interface IItemInterface {
  product: {
    _id: string;
    price: number;
    stock: number;
  };
  variant: any;
  quantity: number;
}

export interface ICart{
  products: IItemInterface[];
  user: string;
  isActive: boolean;
}
