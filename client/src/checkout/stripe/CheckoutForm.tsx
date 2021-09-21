import React, { useContext, useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CheckoutContext } from "../Checkout";

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const CheckoutForm = () => {
  const { processing, handleProcessing, handleError, handleSuccess } =
    useContext(CheckoutContext);

  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // fetch stripe client secret using to process payment
    window
      .fetch("/api/payments/stripe?id=6144e51d4e255dd305a1ab43", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    handleProcessing(true);

    const paymentMethod = await stripe!.createPaymentMethod({
      type: "card",
      //@ts-ignore
      card: elements.getElement(CardElement),
    });

    const payload = await stripe!.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.paymentMethod!.id,
    });

    if (payload.error) {
      handleError(`payment failed ${payload.error.message}`);
    } else {
      // S5
      handleSuccess({
        cart: "6144e51d4e255dd305a1ab43",
        state: "success",
        paymentMethod: "stripe",
        details: "4242",
        paidAt: new Date(1632062268 * 1000),
      });
    }
  };

  return (
    <form
      id={"stripe-checkout-form"}
      onSubmit={handleSubmit}
      style={{ color: "white" }}
    >
      <CardElement id="card-element" options={cardStyle} />
      <button type="submit" disabled={!stripe || processing}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
