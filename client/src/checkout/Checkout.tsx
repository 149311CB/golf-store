import React from "react";
import { useFetch } from "../hooks/useFetch";
import Stripe from "./stripe/Stripe";

const products = "https://golf-company.herokuapp.com/api/golfs/";
const Checkout = () => {
  const { data, loading, error } = useFetch(products);
  return (
    <div className="checkout">
      <Stripe />
    </div>
  );
};

export default Checkout;
