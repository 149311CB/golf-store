import { Box } from "@mui/material";
import { Switch, Route } from "react-router-dom";
import Header from "../components/header/Header";
import Sidebar from "../sidebar/Sidebar";
import Product from "../product/Product";
import Order from "../order/Order";
import Logs from "../logs/Logs";

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
          <Route path={"/orders"}>
            <Order />
          </Route>
          <Route path={"/logs"}>
            <Logs/>
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export default Page;
