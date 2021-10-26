import React, { useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { client } from "../utils/client";

const Home = () => {
  const { data, loading, error } = useFetch("/api/golfs/");
  console.log(data);

  return (
    <div className={"homepage"}>
      <div className={"container"}>
        {data &&
          data.map((golf: any) => (
            <div className={"card"}>
              <div className={"image-container"}>
                <img src={golf.images[0]} alt={"product-main"} />
              </div>
              <div>
                <h3>{golf.name}</h3>
                <div>${golf.price}</div>
                <div>{golf.description}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
