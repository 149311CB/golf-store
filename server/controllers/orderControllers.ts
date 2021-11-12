import expressAsyncHandler from "express-async-handler";
import Cart from "../models/cartModel";
import Order from "../models/orderModel";

const createOrder = expressAsyncHandler(async (req, res) => {
  const { cart, state, paymentMethod, details, paidAt, cancelledAt } = req.body;

  const order = new Order({
    cart: cart,
    state: state,
    paymentMethod: {
      method: paymentMethod,
      details: details,
    },
    paidAt: paidAt,
    cancelledAt: cancelledAt,
  });

  try {
    const createOrder = await order.save();
    const exist = await Cart.findOne({ _id: cart });
    if (exist) {
      exist.isActive = false;
      await exist.save();
    }
    return res.status(200).json(createOrder);
  } catch (error) {
    return res.status(500);
  }
});

export { createOrder };
