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
    <div className={"payment-success box-shadow-small border-radius-all"}>
      <p>Thank you for purchasing!</p>
      <p>We had sent an email with invoice to {email}</p>
      <img
        src={
          "https://firebasestorage.googleapis.com/v0/b/images-b3099.appspot.com/o/animation_500_ky754ms9.gif?alt=media&token=5457cb9b-f71d-42cc-8d47-9daf771a201c"
        }
        alt=""
        style={{ width: "250px", height: "150px", objectFit:"cover" }}
      />
      <Link to={{ pathname: `/account/orders/${orderId}` }} className={"box-shadow-small border-radius-all"}>
        View your order
      </Link>
    </div>
  );
};

export default PaymentSuccess;
