import React from "react";
import { useFetch } from "../hooks/useFetch";

const products = "https://golf-company.herokuapp.com/api/golfs/";
const Home = () => {
  const { data, loading, error } = useFetch(products);

  if (error) {
    return null;
  }
  return <div>Hello world</div>;
};

export default Home;
