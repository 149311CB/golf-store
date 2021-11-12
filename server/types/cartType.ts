import {
  IGolfInterface,
  IHand,
  ILoftInterface,
  IFlexInterface,
  IShaftInterface,
} from "./golfType";

interface IVariant {
  golf: IGolfInterface;
  hand: IHand;
  stock: number;
  loft: ILoftInterface;
  shaft: IShaftInterface;
  flex: IFlexInterface;
}

export interface IItemInterface {
  _id: string;
  product: any;
  // stock: number;
  variant: string;
  quantity: number;
}

export interface ICartInterface {
  _id: string;
  products: IItemInterface[];
  user: string;
  isActive: boolean;
}
