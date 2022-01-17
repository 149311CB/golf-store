import React from "react";
import { Link, useHistory } from "react-router-dom";
import Rating from "../components/Rating";

interface ICategoryProps {
  products: any[];
}

const Category: React.FC<ICategoryProps> = ({ products }) => {
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
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent:"space-between"
                    }}
                    key={product._id}
                    to={{
                      pathname: `/product/${product._id}`,
                      // ${product.golf.name
                      //   .replace(/\s+/g, "-")
                      //   .toLowerCase()}/${product.golf._id}`,
                      state: { id: product._id },
                    }}
                  >
                    <div style={{height:"95%"}}>
                      <div className={"image-container"} >
                        <img
                          src={product.images[0]}
                          alt={"product-main"}
                          style={{ objectFit: "fill" }}
                        />
                      </div>
                      <div className={"bottom"}>
                        <h3 className={"title"}>{product.name}</h3>
                        <div>${product.price}</div>
                      </div>
                    </div>
                    <div className={"rating"}>
                      <Rating value={5} text={1} />
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
