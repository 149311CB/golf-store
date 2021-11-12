import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../components/button/Button";
import { Golf, Variant } from "../types/Golfs";
import { client } from "../utils/client";
import ProductContainer from "./product-container/ProductContainer";

export class CartProduct {
  _id: string;
  quantity: number;
  product: Golf;
  variant: Variant;
  constructor({ _id, quantity, product, variant }: CartProduct) {
    this._id = _id;
    this.quantity = quantity;
    this.product = product;
    this.variant = variant;
  }
}

const initialized = (products: any) => {
  return products.map((item: any) => {
    const product = new Golf(item.product);
    const variant = new Variant(item.variant);
    return new CartProduct({
      _id: item._id,
      quantity: item.quantity,
      product,
      variant,
    });
  });
};

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [cartMeta, setCartMeta] = useState<any>(null);
  const history = useHistory();

  const removeProduct = async (_id: string) => {
    setLoading(true);
    const newCart = await client.post("/api/carts/removeItem", {
      cartId: cartMeta._id,
      removedItemId: _id,
    });
    setLoading(false);
    const { products } = newCart;
    const fetchedData: CartProduct[] = initialized(products);
    setProducts(fetchedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await client.post("/api/carts/activeCart", {
        user: "610844bf701a78827a321fa6",
      });
      setLoading(false);
      const { products, _id, user, isActive } = data;
      if (!products || products === undefined) return;
      setCartMeta({ _id, user, isActive });

      const fetchedData: CartProduct[] = initialized(products);

      setProducts(fetchedData);
    };
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className={"cart"}>
          <ProductContainer products={products} removeProduct={removeProduct} />
          <div className={"right-col"}>
            <div className={"shipping-address"}>
              <div>51/4 Thanh Thai</div>
            </div>
            <div className={"coupons"}>$10 off</div>
            <div className={"price-box"}>20000</div>
            <Button
              className={"checkout-btn"}
              border={"border"}
              disabled={cartMeta === null}
              onClick={() =>
                cartMeta &&
                history.push({
                  pathname: `/checkout`,
                  state: { id: cartMeta._id },
                })
              }
            >
              Proceed to checkout <i className="fas fa-angle-double-right"></i>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
