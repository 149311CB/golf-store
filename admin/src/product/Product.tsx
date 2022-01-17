import { Box, Typography, darken } from "@mui/material";
import { Link, Switch, Route, useRouteMatch } from "react-router-dom";
import React from "react";
import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";

const Product = () => {
  const { url } = useRouteMatch();
  return (
    <Box>
      <Switch>
        <Route path={`${url}/:id`} exact>
          <ProductDetails />
        </Route>
        <Route path={`${url}`} exact={true}>
          <Link to={"/products/create"} style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                bgcolor: "primary.main",
                display: "inline-flex",
                p: 1,
                borderRadius: "0.3rem",
                color: "primary.contrastText",
                transition: "background 150ms ease-in-out",
                "&:hover": {
                  bgcolor: (theme) => darken(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Create Product
            </Typography>
          </Link>
          <ProductList />
        </Route>
      </Switch>
    </Box>
  );
};

export default Product;
