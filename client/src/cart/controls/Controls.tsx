import React, { useState } from "react";
import Button from "../../components/button/Button";
import { CartProduct } from "../Cart";

const Controls: React.FC<{
  cartProduct: CartProduct;
  removeProduct: Function;
}> = ({ cartProduct, removeProduct }) => {
  const { quantity, variant, _id } = cartProduct;
  const [qty, setQty] = useState<number>(quantity);

  const onChangeQuantity = (option: string) => {
    if (option === "minus" && qty > 1) {
      setQty((qty) => qty - 1);
    }
    if (option === "plus" && qty < variant.stock) {
      setQty((qty) => qty + 1);
    }
  };

  return (
    <div className={"cart-control"}>
      <div className={"quantity-control"}>
        <Button
          boxShadow={"none"}
          borderRadius={"left"}
          disabled={qty <= 1}
          onClick={() => {
            onChangeQuantity("minus");
          }}
        >
          <i className="fas fa-minus"></i>
        </Button>
        <input
          value={qty}
          type={"number"}
          min={0}
          onChange={() => {}}
        />
        <Button
          boxShadow={"none"}
          borderRadius={"right"}
          disabled={qty >= variant.stock}
          onClick={() => {
            onChangeQuantity("plus");
          }}
        >
          <i className="fas fa-plus"></i>
        </Button>
      </div>
      <Button
        className={"other-control change-item"}
        boxShadow={"x-small"}
        style={{ marginLeft: "1.2rem" }}
      >
        <p>Change item</p>
      </Button>
      <Button
        className={"other-control buy-later"}
        boxShadow={"x-small"}
        onClick={() => {
          removeProduct();
        }}
      >
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
