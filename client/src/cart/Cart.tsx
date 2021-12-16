import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../App";
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
  const { setIsOpen, token } = useContext(GlobalContext);

  const removeProduct = async (_id: string) => {
    setLoading(true);

    const { data: newCart } = await client.post(
      "/api/carts/auth/remove",
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

    if (!newCart) {
      return;
    }
    const { products } = newCart.data;
    const fetchedData: CartProduct[] = initialized(products);
    setProducts(fetchedData);
  };

  const proceedToCheckout = () => {
    if (!token) {
      setIsOpen((current: boolean) => !current);
      return;
    }
    if (cartMeta) {
      history.push({
        pathname: `/checkout`,
        state: { id: cartMeta._id },
      });
    }
  };

  useEffect(() => {
    if (!token || loading) return;
    const fetchData = async () => {
      const { data } = await client.get("/api/carts/auth/active", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (data.data) {
        const { products: fetchProducts, _id, user, isActive } = data.data;
        if (!fetchProducts || fetchProducts === undefined) return;
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
          <div className={"shipping-address"}>
            <div>51/4 Thanh Thai</div>
          </div>
          <div className={"coupons"}>$10 off</div>
          <div className={"price-box"}>20000</div>
          <Button
            className={"checkout-btn"}
            border={"border"}
            disabled={cartMeta === null || loading}
            onClick={() => proceedToCheckout()}
          >
            Proceed to checkout <i className="fas fa-angle-double-right"></i>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Cart;
