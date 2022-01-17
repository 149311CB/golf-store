import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../App";
import Button from "../components/button/Button";
import { Golf, Variant } from "../types/Golfs";
import { client } from "../utils/client";
import Address from "./address/Address";
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

export const initialized = (products: any) => {
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
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [cartMeta, setCartMeta] = useState<any>(null);
  const [shipping, setShipping] = useState<any>(null);
  const history = useHistory();
  const { setIsOpen, token } = useContext(GlobalContext);

  const removeProduct = async (_id: string) => {
    setLoading(true);

    let route = "/api/carts/remove";
    if (token !== "-1") {
      route = "/api/carts/auth/remove";
    }
    await client.post(
      route,
      {
        productId: _id,
      },
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);
  };

  const proceedToCheckout = () => {
    if (!token) {
      setIsOpen((current: boolean) => !current);
      return;
    }
    if (cartMeta) {
      history.push({
        pathname: `/checkout`,
        state: {
          cartId: cartMeta._id,
          shipping:
            (shipping.apt && shipping.apt + ",") +
            shipping.street +
            "," +
            shipping.city +
            ", " +
            shipping.state +
            ", " +
            shipping.zip,
        },
      });
    }
  };

  useEffect(() => {
    if (!token) return;
    let route = "/api/carts/active";
    if (token !== "-1") {
      route = "/api/carts/auth/active";
    }
    const fetchData = async () => {
      const { data } = await client.get(route, {
        credentials: "include",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (data.data) {
        const { products: fetchProducts, _id, user, isActive } = data.data;
        if (!fetchProducts) return;
        if (user) {
          setCartMeta({ _id, user, isActive });
        } else {
          setCartMeta({ _id, isActive });
        }

        const fetchedData: CartProduct[] = initialized(fetchProducts);

        setProducts(fetchedData);
      }
    };
    fetchData();
  }, [token, loading]);

  return (
    <>
      <div className={"cart"}>
        <ProductContainer
          products={products}
          removeProduct={removeProduct}
          setLoading={setLoading}
        />
        <div className={"right-col"}>
          <Address
            shipping={shipping}
            setShipping={setShipping}
            setDisabled={setDisabled}
          />
          <Button
            className={"checkout-btn"}
            border={"border"}
            disabled={cartMeta === null || loading || disabled}
            onClick={() => proceedToCheckout()}
          >
            Proceed to checkout <i className="fas fa-angle-double-right" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Cart;
