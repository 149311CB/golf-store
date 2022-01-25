import { useEffect, useState } from "react";
import { client } from "../utils/client";
import Category from "./Category";

const Home = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.post("/api/category/list", {
        categoryList: ["top sale"],
      });
      setData(data.data)
    };
    fetchData();
  }, []);

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
