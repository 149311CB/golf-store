export interface IProduct {
  name: string;
  short_name: string;
  price: number;
  description: string;
  images: string[];
}

export interface IVariant {
  golf: string;
  hand: string;
  loft: string;
  shaft: string;
  flex: string;
  stock: number;
}

export interface IGolfProperties {}

export interface IShaft extends IGolfProperties {
  name: string;
  image: string;
}

export interface IFlex extends IGolfProperties {
  type: number;
}

export interface ILoft extends IGolfProperties {
  type: number;
}

export interface IHand extends IGolfProperties {
  side: string;
}
