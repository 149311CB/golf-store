export interface shaft {
  name: string;
  image: string;
}

export interface golfInterface {
  name: string;
  longName?: string;
  price: number;
  stock: number;
  loft: Object[];
  shaft: shaft[];
  flex: Object[];
  hand: string;
  sku: string;
  description: string;
  images: string[];
}
