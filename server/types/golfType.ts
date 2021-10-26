export interface hand {
  name: string;
}

export interface loftInterface {
  type: number;
  stock: number;
}

export interface flexInterface {
  name: string;
  stock: number;
}

export interface shaftInterface {
  name: string;
  image: string;
  stock: number;
  lofts: string[];
  flexs: string[];
}

export interface golfInterface {
  name: string;
  longName?: string;
  price: number;
  stock: number;
  loft: loftInterface[];
  shaft: shaftInterface[];
  flex: flexInterface[];
  hand: hand[];
  sku: string;
  description: string;
  images: string[];
}
