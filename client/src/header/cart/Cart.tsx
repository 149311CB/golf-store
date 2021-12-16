import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../App";
import { client } from "../../utils/client";

const Cart = () => {
  const [count, setCount] = useState(0);
  const { token } = useContext(GlobalContext);
  useEffect(() => {
    if (!token) return;
    const countItem = async () => {
      const { data } = await client.get("/api/carts/auth/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data && data.data) {
        setCount(data.data.count);
      }
    };
    countItem();
  }, [token]);

  return (
    <Link
      to={"/cart"}
      className={"cart pop"}
      style={{ textDecoration: "none" }}
    >
      <i className="fas fa-shopping-cart fa-sm"></i>
      {count > 0 && (
        <div
          className={"cart-item-count"}
          style={{ fontFamily: "brutal-regular" }}
        >
          {count}
        </div>
      )}
    </Link>
  );
};

export default Cart;
