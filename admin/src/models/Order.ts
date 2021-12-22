export interface IPaymentMethod {
  method: string;
  details: Object;
}

// incompatible type
export interface IOrder {
  _id: string;
  cart: any;
  state: any;
  paymentMethod: IPaymentMethod;
  paidAt: string | null;
  cancelledAt: string | null;
  stateHistory: any[];
  createdAt: string;
  updatedAt: string;
}

// type want to use by order table
export class OrderRow {
  id: string;
  items: string;
  date: string;
  total: number;
  status: string;
  constructor(
    id: string,
    items: string,
    date: string,
    total: number,
    status: string
  ) {
    this.id = id;
    this.items = items;
    this.date = date;
    this.total = total;
    this.status = status;
  }
}
