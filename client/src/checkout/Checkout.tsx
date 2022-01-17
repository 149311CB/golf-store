import React, { createContext, useContext, useState } from "react";
import { RouterProps } from "react-router-dom";
import { GlobalContext } from "../App";
import Modal from "../components/modal/Modal";
import { CheckoutInterface, OrderInterface } from "../types/types";
import { client } from "../utils/client";
import CartSummary from "./cart-summary/CartSummary";
import Paypal from "./paypal/Paypal";
import Stripe from "./stripe/Stripe";

export const CheckoutContext = createContext<CheckoutInterface>({
  cartId: "",
  processing: false,
  error: "",
  success: false,
  cancelled: false,
  handleProcessing: () => {
    return "Unknown processing states";
  },
  handleError: () => {
    return "Unknown error";
  },
  handleSuccess: () => {
    return "Unknown success states";
  },
  handleCancelled: () => {
    return "Unknown cancelled states";
  },
  shipping: "",
});

const Checkout: React.FC<RouterProps> = ({ history }) => {
  const { location }: any = history;

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const { token } = useContext(GlobalContext);

  const createOrder = async (order: OrderInterface) => {
    if (order.state === "cancelled") {
      history.push("/cancelled");
    }
    await client
      .post("/api/order/auth/create", order, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data, status }) => {
        if (data && status === 201) {
          return history.push({
            pathname: "/success",
            state: { orderId: data._id },
          });
        } else {
          return setError("something has went wrong");
        }
      });
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
  const { cartId, shipping } = location.state;
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
    shipping,
  };

  return (
    <CheckoutContext.Provider value={value}>
      <div className="checkout">
        <Modal
          isOpen={processing}
          setIsOpen={setProcessing}
          styles={{
            backgroundColor: "transparent",
            padding: "1.2rem",
            borderRadius: "0.3rem",
            width: "30%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100px" }}>
            <svg
              version="1.1"
              id="L7"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              enable-background="new 0 0 100 100"
              xmlSpace="preserve"
            >
              <path
                fill="#2e2e2e"
                d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
  c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  dur="2s"
                  from="0 50 50"
                  to="360 50 50"
                  repeatCount="indefinite"
                />
              </path>
              <path
                fill="#2e2e2e"
                d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
  c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  dur="1s"
                  from="0 50 50"
                  to="-360 50 50"
                  repeatCount="indefinite"
                />
              </path>
              <path
                fill="#2e2e2e"
                d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
  L82,35.7z"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  dur="2s"
                  from="0 50 50"
                  to="360 50 50"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        </Modal>
        {error && <div>{error}</div>}
        {success && <div>Payment success</div>}
        <CartSummary />
        <div
          className={
            "payment-methods-container box-shadow-small border-radius-all"
          }
        >
          <Stripe />
          <hr style={{ marginTop: "1.2rem" }} />
          <Paypal />
        </div>
      </div>
    </CheckoutContext.Provider>
  );
};

export default Checkout;
