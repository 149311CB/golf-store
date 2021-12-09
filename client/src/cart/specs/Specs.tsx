import { Golf, Variant } from "../../types/Golfs";

const Specs: React.FC<{ variant: Variant; product: Golf }> = ({
  variant,
  product,
}) => {
  return (
    <div className={"variant-specs"}>
      <h3 className={"product-name"}>{product.name}</h3>
      <div>
        <strong>Hand:</strong> {variant.hand?.side}
      </div>
      <div>
        <strong>Loft:</strong> {variant.loft?.type}
      </div>
      <div>
        <strong>Shaft:</strong> {variant.shaft?.name}
      </div>
      <div>
        <strong>Flex:</strong> {variant.flex?.type}
      </div>
      {/* <div> */}
      {/*   <strong>SKU:</strong> {product.sku} */}
      {/* </div> */}
    </div>
  );
};

export default Specs;
