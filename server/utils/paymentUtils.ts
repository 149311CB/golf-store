import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel";

const calculatePrice = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ _id: req.query.id }).populate({
    path: "products.product",
    select: "price stock",
  });

  let total = 0;

  if (cart) {
    cart.products.map((item) => {
      total = item.quantity * item.product.price;
    });

    req.body.total = total;
    return next();
  }

  return res.status(404).json({ message: "cart not found" });
});

export { calculatePrice };
