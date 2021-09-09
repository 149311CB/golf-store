import Header from "./header/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Product from "./product/Products";
import Homepage from "./homepage/Homepage";
import Checkout from "./checkout/Checkout";

function App() {
  return (
    <>
      <Header />
      <Router>
        <main>
          {/* <Route path={"/"} component={Homepage} exact /> */}
          {/* <Route path={"/"} component={Product} exact /> */}
          <Route path={"/"} component={Checkout} exact />
          {/* <Product /> */}
        </main>
      </Router>
    </>
  );
}

export default App;
