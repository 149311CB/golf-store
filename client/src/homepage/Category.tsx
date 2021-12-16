import React from "react";
import { Link, useHistory } from "react-router-dom";

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
                index < 5 && (
                  <Link
                    className={"card product-card"}
                    style={{ textDecoration: "none" }}
                    key={product.golf._id}
                    to={{
                      pathname: `/product/${product.golf._id}`,
                      // ${product.golf.name
                      //   .replace(/\s+/g, "-")
                      //   .toLowerCase()}/${product.golf._id}`,
                      state: { id: product.golf._id },
                    }}
                  >
                    <div className={"image-container"}>
                      <img src={product.golf.images[0]} alt={"product-main"} style={{objectFit:"cover"}}/>
                    </div>
                    <div className={"bottom"}>
                      <h3 className={"title"}>{product.golf.name}</h3>
                      <div>${product.golf.price}</div>
                    </div>
                  </Link>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Category;
