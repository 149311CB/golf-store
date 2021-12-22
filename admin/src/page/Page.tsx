import { Box } from "@mui/material";
import { Switch, Route } from "react-router-dom";
import React from "react";
import Header from "../components/header/Header";
import Sidebar from "../sidebar/Sidebar";
import Product from "../product/Product";
import EnhancedTable from "../order/EnhancedTable";
import Order from "../order/Order";

const Page = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar sx={{ width: "23%" }} />
      <Box sx={{ width: "77%" }}>
        <Header />
        <Switch>
          <Route path={"/products"}>
            <Product />
          </Route>
          <Route path={"/users"}>
            <EnhancedTable />
          </Route>
          <Route path={"/orders"}>
            <Order />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export default Page;
