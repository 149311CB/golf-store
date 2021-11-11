import React, { useEffect, useState } from "react";
import { Golf, Variant } from "../types/Golfs";
import { client } from "../utils/client";
import Controls from "./controls/Controls";
import Specs from "./specs/Specs";

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
  console.log(products);

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
          <div className={"product-list left-col"}>
            {products &&
              products.map(
                (product: CartProduct, index: number) =>
                  product && (
                    <div key={product._id}>
                      <div className={"product-container"}>
                        <div className={"image-container"}>
                          <img
                            src={product.product.images[0]}
                            alt={`${product.product.name} ${index}`}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div className={"specs"}>
                            <Specs
                              variant={product.variant}
                              product={product.product}
                            />
                            <Controls
                              cartProduct={product}
                              removeProduct={removeProduct}
                            />
                          </div>
                          <div
                            className={"price-container"}
                            style={{ fontSize: "16px", fontWeight: 600 }}
                          >
                            ${product.product.price}
                          </div>
                        </div>
                      </div>
                      {index < products.length - 1 && (
                        <div className={"divider"} />
                      )}
                    </div>
                  )
              )}
          </div>
          <div className={"right-col"}>
            <div className={"shipping-address"}>
              <div>51/4 Thanh Thai</div>
            </div>
            <div className={"coupons"}>$10 off</div>
            <div className={"price-box"}>20000</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
