import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { GlobalContext } from "../../App";
import { client } from "../../utils/client";

const PaymentSuccess = () => {
  const history = useHistory();

  const { token } = useContext(GlobalContext);
  const [email, setEmail] = useState("your email");
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!history.location.state) {
      return history.push("/");
    }
    const { orderId } = history.location.state as any;
    if (!orderId) {
      return history.push("/");
    }
    setOrderId(orderId);
    if (!token) return;
    const fetchData = async () => {
      const { data } = await client.get("/api/user/auth/details?email", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmail(data.email);
    };
    fetchData();
  }, [token, history]);

  return (
    <div className={"payment-success"}>
      <p>Thank you for purchasing!</p>
      <p>We had sent an email with invoice to {email}</p>
      <Link to={{ pathname: "/account/manage/orders", state: { orderId } }}>
        View your order
      </Link>
    </div>
  );
};

export default PaymentSuccess;
