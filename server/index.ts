import { logger, server } from "./app";
server.loadMiddlewares();

import CategoryController from "./controllers/CategoryController";
import ProductController from "./controllers/product/ProductController";
import PublicCartController from "./controllers/cart/PublicCartController";
import AuthController from "./controllers/user/UserController";
import PaymentController from "./controllers/PaymentController";
import AddressController from "./controllers/address/AddressController";
import UserOrderController from "./controllers/order/UserOrderController";
import UserCartController from "./controllers/cart/UserCartController";

new ProductController();
new CategoryController();
new PublicCartController(logger);
new UserCartController(logger);
new AuthController();
new PaymentController();
new AddressController();
new UserOrderController(logger);
server.run()
