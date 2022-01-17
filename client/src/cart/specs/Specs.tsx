import { Golf, Variant } from "../../types/Golfs";

const Specs: React.FC<{ variant: Variant; product: Golf }> = ({
  variant,
  product,
}) => {
  return (
    <div className={"variant-specs"}>
      <h3 className={"product-name"}>{product.name}</h3>
      <p>
        <strong>Hand:</strong> {variant.hand?.side}
      </p>
      <p>
        <strong>Loft:</strong> {variant.loft?.type}
      </p>
      <p>
        <strong>Shaft:</strong> {variant.shaft?.name}
      </p>
      <p>
        <strong>Flex:</strong> {variant.flex?.type}
      </p>
      {/* <div> */}
      {/*   <strong>SKU:</strong> {product.sku} */}
      {/* </div> */}
    </div>
  );
};

export default Specs;
