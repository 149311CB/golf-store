export interface paymentMethodInterface {
  method: string;
  details: Object;
}

export interface orderInterface {
  cart: string;
  state: any;
  paymentMethod: paymentMethodInterface;
  paidAt: Date;
  cancelledAt: Date;
  stateHistory: any[];
  shipping: string;
}
