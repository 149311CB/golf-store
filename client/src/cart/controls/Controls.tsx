import React, { useContext } from "react";
import { GlobalContext } from "../../App";
import Button from "../../components/button/Button";
import { client } from "../../utils/client";
import { CartProduct } from "../Cart";

const Controls: React.FC<{
  cartProduct: CartProduct;
  removeProduct: Function;
  setLoading: Function;
}> = ({ cartProduct, removeProduct, setLoading }) => {
  const { quantity, variant, _id } = cartProduct;
  const { token } = useContext(GlobalContext);

  const onChangeQuantity = async (option: string) => {
    let newQty = quantity;
    if (option === "minus" && quantity > 1) {
      newQty -= 1;
    }
    if (option === "plus" && quantity < variant.stock) {
      newQty += 1;
    }
    let route = "/api/carts/quantity/update";
    if (token !== "-1") {
      route = "/api/carts/auth/quantity/update";
    }
    await client.post(
      route,
      {
        lineItemId: cartProduct._id,
        quantity: newQty,
      },
      {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return (
    <div className={"cart-control"}>
      <div className={"quantity-control"}>
        <Button
          boxShadow={"none"}
          borderRadius={"left"}
          disabled={quantity <= 1}
          onClick={() => {
            setLoading(true);
            onChangeQuantity("minus").then(() => {
              setLoading(false);
            });
          }}
        >
          <i className="fas fa-minus"/>
        </Button>
        <input value={quantity} type={"number"} min={0} onChange={() => {}} />
        <Button
          boxShadow={"none"}
          borderRadius={"right"}
          disabled={quantity >= variant.stock}
          onClick={() => {
            setLoading(true);
            onChangeQuantity("plus").then(() => {
              setLoading(false);
            });
          }}
        >
          <i className="fas fa-plus"/>
        </Button>
      </div>
      <Button
        className={"other-control change-item"}
        boxShadow={"x-small"}
        style={{ marginLeft: "1.2rem" }}
      >
        <p>Change item</p>
      </Button>
      <Button className={"other-control buy-later"} boxShadow={"x-small"}>
        <p>Buy later</p>
      </Button>
      <Button
        className={"other-control remove"}
        boxShadow={"x-small"}
        onClick={() => {
          removeProduct(_id);
        }}
      >
        <p>Remove</p>
      </Button>
    </div>
  );
};

export default Controls;
