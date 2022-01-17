import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { GlobalContext } from "../../../App";
import Specs from "../../../cart/specs/Specs";
import Button from "../../../components/button/Button";
import { client } from "../../../utils/client";

const transform = (key: string) => {
  const letters = key.split(/(?=[A-Z])/);
  letters[0] = letters[0][0].toUpperCase() + letters[0].slice(1);
  return letters.join(" ");
};

const Details: React.FC<RouteComponentProps> = ({ match }) => {
  const {
    params: { id },
  }: any = match;
  const { token } = useContext(GlobalContext);
  const [state, setState] = useState<any>();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<any>();
  const [paymentMethod, setPaymentMethod] = useState<any>();
  const [products, setProducts] = useState<any[]>([]);
  const [shipping, setShippping] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.get(`/api/order/auth/user/detail/${id}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data);
    };
    fetchData();
  }, [id, token]);

  useEffect(() => {
    if (data && data.data) {
      const { paymentMethod } = data.data;
      setPaymentMethod(paymentMethod);
      const {
        cart: { products },
      } = data.data;
      setProducts(products);
      const { shipping } = data.data;
      setShippping(shipping);
      const { total } = data.data;
      setTotal(total);
    }
  }, [data]);
  return (
    <div className={"order-details"}>
      <h1>Orders Details</h1>
      <hr />
      <div className={"order-info"}>
        <div className={"payment-method box-shadow-small border-radius-all"}>
          <h2>Payment Method</h2>
          <hr style={{ margin: "0 -0.6rem 1.2rem -0.6rem" }} />
          <p>
            <strong>Method:</strong> {paymentMethod?.method}
          </p>
          {paymentMethod &&
            paymentMethod.details &&
            Object.keys(paymentMethod?.details).map((key) => (
              <p key={key}>
                <strong style={{ fontWeight: 600 }}>{transform(key)}: </strong>
                {paymentMethod?.details[key]}
              </p>
            ))}
          {state && (state.state !== "completed" || state.state !== "shipped") && (
            <Button
              border={"border"}
              type={"danger"}
              style={{ width: "100%", marginTop: "0.6rem", fontWeight: 600 }}
            >
              Cancel order
            </Button>
          )}
        </div>
        <div className={"shipping-address box-shadow-small border-radius-all"}>
          <h2>Shipping Address</h2>
          <hr style={{ margin: "0 -0.6rem 1.2rem -0.6rem" }} />
          <p>
            <strong>Shipping Address:</strong> {shipping}
          </p>
        </div>
      </div>
      <div
        className={"product-list-container box-shadow-small border-radius-all"}
      >
        <h2>Products</h2>
        <hr style={{ margin: "0rem -0.6rem 0.6rem -0.6rem" }} />
        <ul className={"product-list"}>
          {products &&
            products.map(
              (product: any, index: number) =>
                product && (
                  <div key={product._id}>
                    <li style={{ listStyle: "none" }}>
                      <div className={"product-container"}>
                        <div className={"image-container"}>
                          <img
                            src={product.product.images[0]}
                            alt={`${product.product.name} ${index}`}
                            style={{ width: "100%", borderRadius: "0.6rem" }}
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
                          </div>
                          <div
                            className={"price-container"}
                            style={{ fontSize: "16px", fontWeight: 600 }}
                          >
                            ${product.product.price}
                          </div>
                        </div>
                      </div>
                    </li>
                    {index < products.length - 1 && (
                      <hr style={{ margin: "0.6rem 0" }} />
                    )}
                  </div>
                )
            )}
        </ul>
        <hr style={{ margin: "0.6rem -0.6rem 0.6rem -0.6rem" }} />
        <p style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Total: </strong>
          <span>${total}</span>
        </p>
      </div>
    </div>
  );
};

export default withRouter(Details);
