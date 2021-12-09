import { createContext } from "react";
import Header from "./header/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Product from "./product/Products";
import Homepage from "./homepage/Homepage";
import Checkout from "./checkout/Checkout";
import Cart from "./cart/Cart";
import Error from "./error/Error";
import PaymentSuccess from "./checkout/success/PaymentSuccess";

export const GlobalContext = createContext<any>({})
function App() {
  return (
    <>
      <Router>
        <GlobalContext.Provider value={{}}>
          <Header />
          <main>
            <Route path={"/"} component={Homepage} exact />
            <Route path={"/product/:id"} component={Product} exact />
            <Route path={"/cart/"} component={Cart} exact />
            <Route path={"/checkout"} component={Checkout} exact />
            <Route path={"/error"} component={Error} exact />
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
