import { Box } from "@mui/material";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import OrderDetails from "./OrderDetails";
import OrderList from "./OrderList";

const Order = () => {
  const {url} = useRouteMatch();
  return (
    <Box>
      <Switch>
        <Route path={`${url}/:id`} exact>
          <OrderDetails />
        </Route>
        <OrderList />
      </Switch>
    </Box>
  );
};

export default Order;
