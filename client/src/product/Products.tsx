import Left from "./left/Left";
import Center from "./center/Center";
import Right from "./right/Right";
import { Method, useFetch } from "../hooks/useFetch";
import { RouterProps } from "react-router-dom";

const Products: React.FC<RouterProps> = ({ history }) => {
  const { location }: any = history;
  const { id } = location.state;
  console.log(id)
  const products = `/api/golfs/${id}`;
  const { data, loading, error } = useFetch(products, null, Method.GET);

  if (error) {
    console.log(error);
  }

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className={"product"}>
          <Left data={data} reviews={[]} />
          <div className={"other-side"}>
            <Center data={data} />
            <Right data={data} />
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
