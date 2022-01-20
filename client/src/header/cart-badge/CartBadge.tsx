import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { GlobalContext } from "../../App";
import Button from "../../components/button/Button";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { client } from "../../utils/client";

const CartBadge = () => {
  const [count, setCount] = useState(0);
  const value = useContext(GlobalContext);
  const addToCartMenuRef = useOnClickOutside();
  const { token } = value;
  const history = useHistory();

  const fetchCount = useCallback(
    async (display = false) => {
      if (display) addToCartMenuRef.current.style.display = "block";
      let route = "/api/carts/count";
      if (token && token !== "-1") {
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
    },
    [token, addToCartMenuRef]
  );

  useEffect(() => {
    value.fetchCount = fetchCount;
    if (!token) return;
    fetchCount();
  }, [token, fetchCount, value]);

  return (
    <Link
      to={"/cart-badge"}
      className={"cart pop"}
      style={{ textDecoration: "none", position: "relative" }}
    >
      <i className="fas fa-shopping-cart fa-sm"/>
      {count > 0 && (
        <div
          className={"cart-item-count"}
          style={{ fontFamily: "brutal-regular" }}
        >
          {count}
        </div>
      )}
      <div
        className={"add-to-cart-menu box-shadow-small border-radius-all"}
        ref={addToCartMenuRef}
      >
        <p>An item has been add to your cart</p>
        <Button
          type={"primary"}
          border={"border"}
          style={{ width: "100%", marginTop: "0.6rem" }}
          onClick={() => {
            addToCartMenuRef.current.style.display = "none";
            history.push("/cart");
          }}
        >
          View cart
        </Button>
      </div>
    </Link>
  );
};

export default CartBadge;
