import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App";
import { CartProduct, initialized } from "../../cart/Cart";
import ProductContainer from "../../cart/product-container/ProductContainer";
import { client } from "../../utils/client";

const CartSummary = () => {
  const [cartMeta, setCartMeta] = useState<any>(null);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const { token } = useContext(GlobalContext);
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
  }, [token]);

  return (
    <div className={"cart-summary box-shadow-small border-radius-all"}>
      <ProductContainer
        products={products}
        removeProduct={() => {}}
        setLoading={() => {}}
        disableControl={true}
      />
    </div>
  );
};

export default CartSummary;
