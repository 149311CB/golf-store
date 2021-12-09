import React, { useState } from "react";
import Preview from "./Preview";
import { productInterface } from "../../types/types";

interface Props {
  data: productInterface;
}

const Center: React.FC<Props> = ({ data }) => {
  const [bigImage, setBigImage] = useState(0);
  if (!data) return <></>;
  const { golf } = data;
  return (
    <div className={"center"}>
      <div className={"main-image"}>
        <img
          src={golf.images[bigImage]}
          alt="big"
          style={{ backgroundColor: "black" }}
        />
      </div>
      <Preview images={golf.images} setBigImage={setBigImage} />
    </div>
  );
};

export default Center;
