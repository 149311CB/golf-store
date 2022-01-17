import React from "react";
import { CartProduct } from "../Cart";
import Controls from "../controls/Controls";
import Specs from "../specs/Specs";

const ProductContainer: React.FC<{
  products: CartProduct[];
  removeProduct: Function;
  setLoading: Function;
  disableControl?: boolean;
}> = ({ products, removeProduct, setLoading, disableControl = false }) => {
  return (
    <div className={"product-list left-col"}>
      {products &&
        products.map(
          (product: CartProduct, index: number) =>
            product && (
              <div key={product._id} className={"product-wrapper"}>
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
                      {!disableControl && (
                        <Controls
                          cartProduct={product}
                          removeProduct={removeProduct}
                          setLoading={setLoading}
                        />
                      )}
                    </div>
                    <div
                      className={"price-container"}
                      style={{ fontSize: "16px", fontWeight: 600 }}
                    >
                      ${product.product.price}
                    </div>
                  </div>
                </div>
                <hr style={{ marginTop: "0.6rem", marginBottom: "0.6rem" }} />
              </div>
            )
        )}
    </div>
  );
};

export default ProductContainer;
