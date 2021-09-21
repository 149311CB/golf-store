import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel";

// @ts-ignore
const calculatePrice = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ _id: req.query.id }).populate({
    path: "products.product",
    select: "price stock",
  });

  let total = 0;

  if (cart) {
    // const outStockProduct = cart.products.filter((item) => {
    //   if (item.quantity < item.product.stock) {
    //     total = item.product.price * item.quantity;
    //     return false;
    //   }
    //   return true;
    // });

    cart.products.map(item=>{
      total = item.quantity * item.product.price
    })

    // if (outStockProduct.length < cart.products.length) {
    //   return res.json({ outStockProduct, message: "out of stock" });
    // }

    req.body.total = total;
    return next();
  }

  return res.status(404).json({message: "cart not found" });

});

export { calculatePrice };
