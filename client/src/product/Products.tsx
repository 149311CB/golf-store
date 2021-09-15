import Left from "./left/Left";
import Center from "./center/Center";
import Right from "./right/Right";
import { useFetch } from "../hooks/useFetch";

const products = "https://golf-company.herokuapp.com/api/golfs/";
const Products = () => {
  const { data, loading, error } = useFetch(products);
  const {
    data: reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useFetch(
    `https://golf-company.herokuapp.com/api/golfs/61060298c028fee312e937f2/reviews`
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
          <Left golf={data![0]} reviews={reviews} />
          <Center golf={data![0]} />
          <Right golf={data![0]} />
        </div>
      )}
    </>
  );
};

export default Products;
