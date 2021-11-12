export interface paymentMethodInterface {
  method: string;
  details: Object;
}

export interface orderInterface {
  cart: string;
  state: string;
  paymentMethod: paymentMethodInterface;
  paidAt: Date;
  cancelledAt: Date;
}

/* [
  {
    "cart": {
      "$oid": "6144e51d4e255dd305a1ab43"
    },
    "state": "success",
    "paymentMethod": [
      {
        "method": "stripe",
        "detail": "4242"
      }
    ],
    "date": "2020-07-06T20:36:59.414Z",
    "timestamps": ""
  }
] */
