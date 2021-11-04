import Left from "./left/Left";
import Center from "./center/Center";
import Right from "./right/Right";
import { useFetch } from "../hooks/useFetch";
import { RouterProps } from "react-router-dom";

const Products: React.FC<RouterProps> = ({ history }) => {
  const { location }: any = history;
  const { id } = location.state;
  const products = `/api/golfs/${id}`;
  const { data, loading, error } = useFetch(products, null, "GET");
  // const {
  //   data: reviews,
  //   loading: reviewsLoading,
  //   error: reviewsError,
  // } = useFetch(
  //   `http://localhost:5000/api/golfs/61060298c028fee312e937f2/reviews`,
  //   "GET"
  // );

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
          <Center data={data} />
          <Right data={data} />
        </div>
      )}
    </>
  );
};

export default Products;
