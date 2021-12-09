import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../../utils/client";
import { isLogin } from "../../utils/verifyUser";

const Cart = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const countItem = async () => {
      const loginToken = isLogin();
      if (loginToken) {
        const data = await client.post(
          "/api/carts/authCountItem",
          // {
          //   user: user._id,
          // },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer loginToken`,
            },
          }
        );
        setCount(data.count);
        return;
      }
      const cartId = localStorage.getItem("cartId");
      const data = await client.post("/api/carts/countItem", {
        cartId: cartId,
      });
      setCount(data.count);
      return;
    };
    countItem();
  }, []);

  return (
    <Link
      to={"/cart"}
      className={"cart pop"}
      style={{ textDecoration: "none" }}
    >
      <i className="fas fa-shopping-cart fa-sm"></i>
      {count > 0 && <div className={"cart-item-count"}>{count}</div>}
    </Link>
  );
};

export default Cart;
