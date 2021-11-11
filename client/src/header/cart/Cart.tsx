import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../../utils/client";

const Cart = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const countItem = async () => {
      const data = await client.post("/api/carts/countItem", {
        user: "610844bf701a78827a321fa6",
      });
      // console.log(data.count);
      setCount(data.count);
    };
    countItem();
  }, []);

  return (
    <Link to={"/cart"} className={"cart pop"} style={{textDecoration:"none"}}>
      <i className="fas fa-shopping-cart fa-sm"></i>
      {count > 0 && <div className={"cart-item-count"}>{count}</div>}
    </Link>
  );
};

export default Cart;
