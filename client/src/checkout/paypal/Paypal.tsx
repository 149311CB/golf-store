import React, { useContext, useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckoutContext } from "../Checkout";

const Paypal = () => {
  const { processing, handleProcessing, handleError, handleSuccess } =
    useContext(CheckoutContext);

  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    window
      .fetch("/api/payments/paypal?id=6144e51d4e255dd305a1ab43", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.clientId) {
          setClientId(data.clientId);
          setAmount(data.amount);
        }
      });
  }, []);

  if (!clientId) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"paypal"}>
      <PayPalScriptProvider options={{ "client-id": clientId }}>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={(_, actions) => {
            handleProcessing(true);
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                },
              ],
              application_context: {
                shipping_preference: "NO_SHIPPING",
              },
            });
          }}
          onApprove={async (_, actions) => {
            const order = await actions.order.capture();
            handleSuccess({
              cart: "6144e51d4e255dd305a1ab43",
              state: "success",
              paymentMethod: "paypal",
              details: "abc@gmail.com",
              paidAt: new Date(1632062268 * 1000),
            });
          }}
          onError={async (error) => {
            handleError(error.toString());
          }}
          disabled={processing && true}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Paypal;
