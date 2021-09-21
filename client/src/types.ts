import React from "react";

export interface reactChild {
  children: React.ReactNode;
}

export interface golfInterface {
  _id?: string;
  name: string;
  longName?: string;
  price: string;
  stock: string;
  loft: Object[];
  shaft: shaft[];
  flex: Object[];
  hand: string;
  sku: string;
  description: string;
  images: string[];
}

export interface shaft {
  name: string;
  image: string;
}

export interface reviewInterface {
  _id: string;
  golf: string;
  user: string;
  rating: number;
  comment: string;
}

export interface CheckoutInterface {
  processing: boolean;
  error: string;
  success: boolean;
  handleProcessing: (state: boolean) => void;
  handleError: (error: string) => void;
  handleSuccess: (order: OrderInterface) => void;
}

export interface OrderInterface {
  cart: string;
  state: string;
  paymentMethod: string;
  details: string;
  paidAt: Date;
}
