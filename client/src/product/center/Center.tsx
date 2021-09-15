import React, { useState } from "react";
import Preview from "./Preview";
import { golfInterface } from "../../types";

interface Props {
  golf: golfInterface;
}

const Center: React.FC<Props> = (props) => {
  const { golf } = props;
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
