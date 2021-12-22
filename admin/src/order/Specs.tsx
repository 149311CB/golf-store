import { Box } from "@mui/material";
import React from "react";

const Specs: React.FC<{ variant: any; product: any }> = ({
  variant,
  product,
}) => {
  return (
    <Box
      className={"variant-specs"}
      sx={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
    >
      <h3 className={"product-name"}>{product.name}</h3>
      <Box>
        <strong>Hand:</strong> {variant.hand?.side}
      </Box>
      <Box>
        <strong>Loft:</strong> {variant.loft?.type}
      </Box>
      <Box>
        <strong>Shaft:</strong> {variant.shaft?.name}
      </Box>
      <Box>
        <strong>Flex:</strong> {variant.flex?.type}
      </Box>
    </Box>
  );
};

export default Specs;
