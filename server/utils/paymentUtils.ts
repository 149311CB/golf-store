import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel";

const calculatePrice = asyncHandler(async (req, res, next) => {
  const { cartId } = req.query;
  if (!cartId) return res.status(400).json({ message: "required user id" });
  if (Array.isArray(cartId))
    return res.status(400).json({ message: "user id must be a string" });

  const cart = await Cart.getInstance().findOne(
    { _id: cartId, isActive: true },
    {
      path: "products.product",
      select: "price",
    }
  );

  let total = 0;

  if (cart) {
    cart.products.forEach((item) => {
      total = total + item.quantity * item.product.price;
    });

    req.body.total = total;
    return next();
  }

  return res.status(404).json({ message: "cart not found" });
});

export { calculatePrice };
