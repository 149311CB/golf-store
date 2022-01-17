import { useEffect, useState } from "react";
import { client } from "../utils/client";
import Category from "./Category";

const Home = () => {
  // const [isExecute, setIsExecute] = useState(true);
  const [data, setData] = useState<any>(null);

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
      setData(data.data)
    };
    fetchData();
  }, []);

  // if (error) {
  //   return <div className={"homepage"}>Uh oh! Something went wrong!</div>;
  // }

  return (
    <div className={"homepage"}>
      <div className={"carousel box-shadow-small"}>
        <p id={"carousel-text"}>TaylorMade</p>
      </div>
      {data &&
        data.map((category: any) => (
          <Category products={category.products} key={category._id} />
        ))}
    </div>
  );
};

export default Home;
