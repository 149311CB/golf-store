export interface itemInterface {
  product: {
    _id: string;
    price: number;
    stock: number;
  };
  quantity: number;
}

export interface cartInterface {
  products: itemInterface[];
  user: string;
  isActive:boolean
}
