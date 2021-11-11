export interface IHand {
  name: string;
}

export interface ILoftInterface {
  type: number;
  stock: number;
}

export interface IFlexInterface {
  name: string;
  stock: number;
}

export interface IShaftInterface {
  name: string;
  image: string;
  stock: number;
  lofts: string[];
  flexs: string[];
}

export interface IGolfInterface {
  name: string;
  longName: string;
  description: string;
  images: [];
  price: number;
  sku: string;
}
