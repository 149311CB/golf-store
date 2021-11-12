import React, { createContext, useState } from "react";
import { RouterProps } from "react-router-dom";
import { CheckoutInterface, OrderInterface } from "../types/types";
import { client } from "../utils/client";
import Paypal from "./paypal/Paypal";
import Stripe from "./stripe/Stripe";

export const CheckoutContext = createContext<CheckoutInterface>({
  cartId: "",
  processing: false,
  error: "",
  success: false,
  cancelled: false,
  handleProcessing: () => {
    return "Unknown processing state";
  },
  handleError: () => {
    return "Unknown error";
  },
  handleSuccess: () => {
    return "Unknown success state";
  },
  handleCancelled: () => {
    return "Unknown cancelled state";
  },
});

const Checkout: React.FC<RouterProps> = ({ history }) => {
  const { location }: any = history;

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const createOrder = (order: OrderInterface) => {
    const fetchData = async () => {
      await client.post("/api/orders/create", order, {
        "Content-Type": "application/json",
      });
      if (order.state === "cancelled") {
        setCancelled(true);
      } else {
        history.push("/success");
      }
    };
    fetchData();
  };

  const handleProcessing = (state: boolean) => {
    setProcessing(state);
  };

  const handleError = (err: string) => {
    handleProcessing(false);
    setError(err);
  };

  const handleSuccess = (order: OrderInterface) => {
    handleError("");
    createOrder(order);
  };

  const handleCancelled = (order: OrderInterface) => {
    handleSuccess(order);
  };

  if (location.state === null || location.state === undefined) {
    history.push("/");
    return <></>;
  }
  const { id: cartId } = location.state;
  const value = {
    cartId,
    processing,
    error,
    success,
    cancelled,
    handleProcessing,
    handleError,
    handleSuccess,
    handleCancelled,
  };

  return (
    <CheckoutContext.Provider value={value}>
      <div className="checkout">
        {processing && <div>Processing...</div>}
        {error && <div>{error}</div>}
        {success && <div>Payment success</div>}
        <Stripe />
        <Paypal />
      </div>
    </CheckoutContext.Provider>
  );
};

export default Checkout;
