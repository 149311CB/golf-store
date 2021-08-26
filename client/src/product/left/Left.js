import React from "react";
import Rating from "../../components/Rating";
import { useSumReviews } from "../../hooks/useSumReviews";

const Left = ({ golf, reviews }) => {
  const reviewTotal = useSumReviews(golf._id, reviews);

  return (
    <div className={"left"}>
      <div className={"container"}>
        <div className={"sku"}>{golf.sku}</div>
        <div className={"name"}>{golf.name}</div>
        <Rating
          value={reviewTotal.average}
          text={`${reviewTotal.average} (${reviewTotal.sum})`}
        />
        <div className={"description"}>{golf.description}</div>
      </div>
    </div>
  );
};

export default Left;
