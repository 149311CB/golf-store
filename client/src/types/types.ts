import React from "react";

export interface reactChild {
  children: React.ReactNode;
}

export interface productInterface {
  golf: golfInterface
  variants:[ VariantInterface ]
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

export interface VariantInterface{
  _id:string
  hand:string
  golf:string
  loft:Loft
  flex:Flex
  shaft:Shaft
}

export interface Shaft {
  _id:string
  name: string;
  image: string;
}

export interface Loft{
  _id:string
  type:number
}

export interface Flex{
  _id:string
  type:number
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
