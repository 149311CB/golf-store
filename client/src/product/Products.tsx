import Left from "./left/Left";
import Center from "./center/Center";
import Right from "./right/Right";
import { useFetch } from "../hooks/useFetch";

const products = "http://localhost:5000/api/golfs/614e1c69b264f70c58db3a44";
const Products = () => {
  const { data, loading, error } = useFetch(products);
  const {
    data: reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useFetch(
    `http://localhost:5000/api/golfs/61060298c028fee312e937f2/reviews`
  );

  if (error || reviewsError) {
    return null;
  }

  return (
    <>
      {loading || reviewsLoading ? (
        <div>loading...</div>
      ) : (
        <div className={"product"}>
          <Left data={data} reviews={reviews} />
          <Center data={data} />
          <Right data={data} />
        </div>
      )}
    </>
  );
};

export default Products;
