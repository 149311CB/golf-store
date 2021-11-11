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
  product: number;
  // stock: number;
  variant: any;
  quantity: number;
}

export interface ICartInterface {
  _id: string;
  products: IItemInterface[];
  user: string;
  isActive: boolean;
}
