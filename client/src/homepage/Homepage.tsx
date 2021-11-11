import React, { useEffect, useState } from "react";
import { Method, useFetch } from "../hooks/useFetch";
import Category from "./Category";

const Home = () => {
  const [isExecute, setIsExecute] = useState(true);
  const { data, loading, error } = useFetch(
    "/api/categories/list",
    {
      categoryList: ["top sale"],
    },
    Method.POST,
    isExecute
  );

  useEffect(() => {
    setIsExecute((value: boolean) => !value);
  }, []);

  if (error) {
    return <div className={"homepage"}>Uh oh! Something went wrong!</div>;
  }

  return (
    <div className={"homepage"}>
      <div className={"carousel"}></div>
      {data &&
        data.map((category: any) => (
          <Category products={category.products} key={category._id} />
        ))}
    </div>
  );
};

export default Home;
