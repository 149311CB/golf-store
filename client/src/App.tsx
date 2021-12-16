import { createContext, useCallback, useEffect, useState } from "react";
import Header from "./header/Header";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import Product from "./product/Products";
import Homepage from "./homepage/Homepage";
import Checkout from "./checkout/Checkout";
import Cart from "./cart/Cart";
import Error from "./error/Error";
import PaymentSuccess from "./checkout/success/PaymentSuccess";
import { client } from "./utils/client";

export const GlobalContext = createContext<any>({});
const refreshToken = async () => {
  const { data } = await client.get("/api/user/auth/token/refresh", {
    credentials: "include",
  });
  return data.data;
};

function App() {
  const [token, setToken] = useState<string | null>(null);

  const getToken = useCallback(() => {
    refreshToken().then((data) => {
      if(!data) return
      const { token } = data
      setToken(token);
    });
  }, []);

  useEffect(() => {
    getToken();
    setTimeout(() => {
      getToken();
    }, 5 * 60 * 1000);
  }, [getToken]);

  return (
    <>
      <Router>
        <GlobalContext.Provider value={{ token }}>
          <Header />
          <main>
            <Route path={"/"} component={Homepage} exact />
            <Route path={"/product/:id"} component={Product} exact />
            <Route path={"/cart/"} component={Cart} exact />
            <Route path={"/checkout"} component={Checkout} exact />
            {/* <Route path={"/error"} component={Error} exact /> */}
            <Route path={"/success"} component={PaymentSuccess} exact />

            {/* <Redirect to={"/error"}/> */}
            {/*<Route path={"/"} component={NewModels} exact />*/}
            {/*<Route path={"/"} component={TestRenderAlgo} exact />*/}
            {/* <Route path={"/"} component={TestNewComponent} exact />*/}
            {/* <Product /> */}
          </main>
        </GlobalContext.Provider>
      </Router>
    </>
  );
}

export default App;
