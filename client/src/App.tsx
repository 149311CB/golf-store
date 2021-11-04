import Header from "./header/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Product from "./product/Products";
import Homepage from "./homepage/Homepage";
import Checkout from "./checkout/Checkout";
import { client } from "./utils/client";
import { useEffect } from "react";

function App() {
  return (
    <>
      <Header />
      <Router>
        <main>
          <Route path={"/"} component={Homepage} exact />
          <Route path={"/product/:name"} component={Product} exact />
          {/* <Route path={"/"} component={Checkout} exact /> */}
          {/*<Route path={"/"} component={NewModels} exact />*/}
          {/*<Route path={"/"} component={TestRenderAlgo} exact />*/}
          {/* <Route path={"/"} component={TestNewComponent} exact />*/}
          {/* <Product /> */}
        </main>
      </Router>
    </>
  );
}

export default App;
