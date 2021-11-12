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

export class IGolfInterface {
  name: string;
  longName: string;
  description: string;
  images: [];
  price: number;
  sku: string;
  constructor({
    name,
    longName,
    description,
    images,
    price,
    sku,
  }: IGolfInterface) {
    this.name = name;
    this.longName = longName;
    this.description = description;
    this.images = images;
    this.price = price;
    this.sku = sku;
  }
}
