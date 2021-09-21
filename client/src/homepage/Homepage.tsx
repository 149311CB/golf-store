import React, { useEffect } from "react";
import { client } from "../utils/client";

const Home = () => {
  useEffect(() => {
    const getGolf = async () => {
      const data = await client.post("/api/carts/archived?id=123", {});
      console.log(data);
    };
    getGolf();
  });

  return <div>Hello world</div>;
};

export default Home;
