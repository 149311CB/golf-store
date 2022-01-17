import { Route, Switch, useRouteMatch } from "react-router-dom";
import Details from "./orders/Details";
import Orders from "./orders/Orders";
import Sidebar from "./Sidebar";

const AccountManager = () => {
  const { path } = useRouteMatch();
  return (
    <div id={"account-page"}>
      <Sidebar path={path} />
      <div id={"main-page"} className={"box-shadow-small border-radius-all"}>
        <Switch>
          <Route path={`${path}/orders`} exact>
            <Orders />
          </Route>
          <Route path={`${path}/orders/:id`} exact>
            <Details />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default AccountManager;
