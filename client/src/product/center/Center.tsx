import React, { useState } from "react";
import Preview from "./Preview";
import { golfInterface, productInterface } from "../../types";

interface Props {
  data: productInterface;
}

const Center: React.FC<Props> = ({ data }) => {
  const { golf } = data;
  const [bigImage, setBigImage] = useState(0);
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
