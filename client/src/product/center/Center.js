import React, { useState } from "react";
import Preview from "./Preview";

const Center = ({ golf }) => {
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
