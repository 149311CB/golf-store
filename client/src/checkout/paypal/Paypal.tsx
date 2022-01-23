import { useContext, useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckoutContext } from "../Checkout";
import { client } from "../../utils/client";
import { OrderInterface } from "../../types/types";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../App";

const Paypal = () => {
  const {
    cartId,
    processing,
    success,
    cancelled,
    handleProcessing,
    handleError,
    handleSuccess,
    handleCancelled,
    shipping,
  } = useContext(CheckoutContext);

  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const history = useHistory();
  const { token } = useContext(GlobalContext);

  const generateOrder = (): OrderInterface => {
    return new OrderInterface({
      cart: cartId,
      state: null,
      paymentMethod: "paypal",
      details: null,
      paidAt: null,
      cancelledAt: null,
      shipping,
      total: amount,
    });
  };

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      const { data } = await client.get(
        `/api/payment/auth/paypal?cartId=${cartId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.status === 404) {
        history.push("/");
      }
      if (data.clientId) {
        setClientId(data.clientId);
        setAmount(data.amount);
      }
    };
    fetchData();
  }, [cartId, success, cancelled, history, token]);

  return (
    <div className={"paypal"}>
      {clientId && (
        <PayPalScriptProvider options={{ "client-id": clientId }}>
          <PayPalButtons
            style={{ layout: "horizontal" }}
            createOrder={(_, actions) => {
              handleProcessing(true);
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount.toString(),
                    },
                  },
                ],
                application_context: {
                  shipping_preference: "NO_SHIPPING",
                },
              });
            }}
            onApprove={async (_, actions) => {
              const payload = await actions.order?.capture();
              const order = generateOrder();
              order.details = {
                email: payload?.payer.email_address,
                name: payload?.payer.name,
              };
              order.paidAt = new Date(payload?.create_time || "");
              order.state = "succeeded";
              handleSuccess(order);
            }}
            onError={async (error) => {
              handleError(`payment failed: ${error.toString()}`);
            }}
            // onCancel={async () => {
            //   const order = generateOrder();
            //   order.state = "cancelled";
            //   order.cancelledAt = new Date(Date.now());
            //   handleCancelled(order);
            // }}
            disabled={processing && !clientId}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default Paypal;
