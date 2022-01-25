import { useContext, useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CheckoutContext } from "../Checkout";
import { client } from "../../utils/client";
import { OrderInterface } from "../../types/types";
import { GlobalContext } from "../../App";
import Button from "../../components/button/Button";
import { StripeCardElementOptions } from "@stripe/stripe-js";

const cardStyle: StripeCardElementOptions = {
  style: {
    base: {
      "::placeholder": {
        color: "white",
      },
      color:"white",
      backgroundColor: "#2e2e2e",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const CheckoutForm = () => {
  const {
    cartId,
    processing,
    error,
    // success,
    // cancelled,
    handleProcessing,
    handleError,
    handleSuccess,
    handleCancelled,
    shipping,
  } = useContext(CheckoutContext);

  const stripe = useStripe();
  const elements = useElements();
  const { token } = useContext(GlobalContext);

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!token) return;
    // fetch stripe client secret using to process payment
    const fetchData = async () => {
      const { data } = await client.get(
        `/api/payment/auth/stripe?cartId=${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    };
    fetchData();
  }, [cartId, error, token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    handleProcessing(true);

    if (!elements) {
      return handleError("something went wrong");
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return handleError("something went wrong");
    }

    const paymentMethod = await stripe!.createPaymentMethod({
      type: "card",
      card: card,
    });

    if (!paymentMethod || !paymentMethod.paymentMethod) {
      return handleError("invalid card");
    }

    const payload = await stripe!.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.paymentMethod!.id,
    });

    if (payload.error) {
      handleError(`payment failed: ${payload.error.message}`);
    } else {
      const order = new OrderInterface({
        cart: cartId,
        state: payload.paymentIntent.status,
        paymentMethod: "stripe",
        details: null,
        paidAt: null,
        cancelledAt: null,
        shipping,
        total: payload.paymentIntent.amount,
      });
      if (payload.paymentIntent.status === "canceled") {
        order.cancelledAt = new Date(payload.paymentIntent.created);
        handleCancelled(order);
      } else {
        order.details = {
          exprMonth: paymentMethod.paymentMethod?.card?.exp_month,
          exprYear: paymentMethod.paymentMethod?.card?.exp_year,
          type: paymentMethod.paymentMethod?.card?.funding,
          brand: paymentMethod.paymentMethod?.card?.brand,
          last4: paymentMethod.paymentMethod?.card?.last4,
        };
        order.paidAt = new Date(payload.paymentIntent.created);
        handleSuccess(order);
      }
    }
  };

  return (
    <form
      id={"stripe-checkout-form"}
      onSubmit={handleSubmit}
      style={{ color: "white" }}
    >
      <CardElement id="card-element" options={cardStyle} />
      <Button
        type={"primary"}
        disabled={!stripe || processing}
        style={{ width: "100%", fontWeight: 600, marginTop: "1.2rem" }}
        border={"border"}
      >
        Pay
      </Button>
    </form>
  );
};

export default CheckoutForm;
