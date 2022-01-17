import React from "react";

export interface reactChild {
  children: React.ReactNode;
}

export interface productInterface {
  golf: golfInterface;
  variants: [VariantInterface];
}

export interface golfInterface {
  _id?: string;
  images: string[];
  name: string;
  longName?: string;
  price: string;
  sku: string;
  description: string;
}

export interface VariantInterface {
  _id: string;
  hand: string;
  golf: string;
  loft: Loft;
  flex: Flex;
  shaft: Shaft;
}

export interface Shaft {
  _id: string;
  name: string;
  image: string;
}

export interface Loft {
  _id: string;
  type: number;
}

export interface Flex {
  _id: string;
  type: number;
}

export interface reviewInterface {
  _id: string;
  golf: string;
  user: string;
  rating: number;
  comment: string;
}

export interface CheckoutInterface {
  cartId: string;
  processing: boolean;
  error: string;
  success: boolean;
  cancelled: boolean;
  handleProcessing: (state: boolean) => void;
  handleError: (error: string) => void;
  handleSuccess: (order: OrderInterface) => void;
  handleCancelled: (order: OrderInterface) => void;
  shipping: string;
}

export class OrderInterface {
  cart: string | null;
  state: string | null;
  paymentMethod: string;
  details: Object | null;
  paidAt: Date | null;
  cancelledAt: Date | null;
  shipping: string | null;
  total:number
  constructor({
    cart,
    state,
    paymentMethod,
    details,
    paidAt,
    cancelledAt,
    shipping,
    total
  }: OrderInterface) {
    this.cart = cart;
    this.state = state;
    this.paymentMethod = paymentMethod;
    this.details = details;
    this.paidAt = paidAt;
    this.cancelledAt = cancelledAt;
    this.shipping = shipping;
    this.total = total
  }
}
