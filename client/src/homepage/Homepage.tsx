import React, { useEffect, useState } from "react";
import { Method, useFetch } from "../hooks/useFetch";
import { client } from "../utils/client";
import Category from "./Category";

const Home = () => {
  // const [isExecute, setIsExecute] = useState(true);
  const [data, setData] = useState<any>(null);
  console.log(data)

  // const { data, loading, error } = useFetch(
  //   "/api/category/list",
  //   {
  //     categoryList: ["top sale"],
  //   },
  //   Method.POST,
  //   isExecute
  // );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.post("/api/category/list", {
        categoryList: ["top sale"],
      });
      setData(data)
    };
    fetchData();
  }, []);

  // if (error) {
  //   return <div className={"homepage"}>Uh oh! Something went wrong!</div>;
  // }

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
