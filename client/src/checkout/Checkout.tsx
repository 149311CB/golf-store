import React, { createContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { CheckoutInterface, OrderInterface } from "../types/types";
import Paypal from "./paypal/Paypal";
import Stripe from "./stripe/Stripe";

export const CheckoutContext = createContext<CheckoutInterface>({
  processing: false,
  error: "",
  success: false,
  handleProcessing: () => {
    return "Unknown processing state";
  },
  handleError: () => {
    return "Unknown error";
  },
  handleSuccess: () => {
    return "Unknown success state";
  },
});

const Checkout = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // const history = useHistory();

  const createOrder = ({
    cart,
    state,
    paymentMethod,
    details,
    paidAt,
  }: OrderInterface) => {
    window
      .fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          state,
          paymentMethod,
          details,
          paidAt,
        }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSuccess((success) => !success);
        // history.push("#");
      });
  };

  const handleProcessing = (state: boolean) => {
    setProcessing(state);
  };

  // TODO: Remember to clear everything on fail
  const handleError = (err: string) => {
    handleProcessing(false);
    setError(err);
  };

  // TODO: Remember to clear everything on success
  const handleSuccess = (order: OrderInterface) => {
    handleError("");
    createOrder(order);
  };

  const value = {
    processing: processing,
    error: error,
    success: success,
    // TODO: Should I split this?
    handleProcessing: handleProcessing,
    handleError: handleError,
    handleSuccess: handleSuccess,
  };

  return (
    <CheckoutContext.Provider value={value}>
      <div className="checkout">
        {processing && <div>Processing...</div>}
        {error && <div>{error}</div>}
        {success && <div>Payment success</div>}
        <Stripe />
        {/* <Paypal /> */}
      </div>
    </CheckoutContext.Provider>
  );
};

export default Checkout;
