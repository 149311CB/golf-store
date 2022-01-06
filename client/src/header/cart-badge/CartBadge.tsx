import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../App";
import { client } from "../../utils/client";

const CartBadge = () => {
  const [count, setCount] = useState(0);
  const value = useContext(GlobalContext);
  const { token } = value;

  const fetchCount = useCallback(async () => {
    let route = "/api/carts/count";
    if (token !== "-1") {
      route = "/api/carts/auth/count";
    }
    const { data } = await client.get(route, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data && data.data) {
      setCount(data.data.count);
    }
  }, [token]);

  useEffect(() => {
    value.fetchCount = fetchCount;
    if (!token) return;
    fetchCount();
  }, [token, fetchCount, value]);

  return (
    <Link
      to={"/cart-badge"}
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

export default CartBadge;
