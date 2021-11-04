import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

interface ICategoryProps {
  products: any[];
}

const Category: React.FC<ICategoryProps> = ({ products }) => {
  const history = useHistory();

  return (
    <div className={"category"}>
      <div className={"container category"}>
        <h2>Top sale</h2>
        <div className={"item-list"}>
          {products &&
            products.map(
              (product: any, index: any) =>
                index < 4 && (
                  <div
                    className={"card product-card"}
                    key={product.golf._id}
                    onClick={() =>
                      history.push({
                        pathname: `/product/${product.golf.name
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`,
                        state: { id: product.golf._id },
                      })
                    }
                  >
                    <div className={"image-container"}>
                      <img src={product.golf.images[0]} alt={"product-main"} />
                    </div>
                    <div className={"bottom"}>
                      <h3 className={"title"}>{product.golf.name}</h3>
                      <div>${product.golf.price}</div>
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Category;
