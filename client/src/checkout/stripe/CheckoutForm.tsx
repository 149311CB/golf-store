import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useFetch } from "../../hooks/useFetch";

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

const products = "https://golf-company.herokuapp.com/api/golfs/";
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");

  // TODO: These can be use globally
  const [proccessing, setProccessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { data, loading, error: fetchError } = useFetch(products);
  //====================================================================

  useEffect(() => {
    if (loading || fetchError) return;
    const { price } = data![0];
    // fetch stripe client secret using to proccess payment
    window
      .fetch("/api/payments/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: [{ price, amount: 3 }] }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [data, loading, fetchError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setProccessing(true);

    const paymentMethod = await stripe!.createPaymentMethod({
      type: "card",
      //@ts-ignore
      card: elements.getElement(CardElement),
    });

    console.log(paymentMethod);
    const payload = await stripe!.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.paymentMethod!.id,
    });

    // TODO: These can be use globally
    if (payload.error) {
      setError(`payment failed ${payload.error.message}`);
      setProccessing(false);
    } else {
      setError("");
      setProccessing(false);
      setSuccess(true);
      console.log(payload);
    }
    //===================================================================
  };

  return (
    <form
      id={"stripe-checkout-form"}
      onSubmit={handleSubmit}
      style={{ color: "white" }}
    >
      {success && <div>Payment success!</div>}
      {error && <div>Payment failed! {error}</div>}
      <CardElement id="card-element" options={cardStyle}></CardElement>
      <button type="submit" disabled={!stripe || proccessing}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
