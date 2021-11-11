import expressAsyncHandler from "express-async-handler";
import Cart from "../models/cartModel";

const archivedCart = expressAsyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.query.id });
    if (cart) {
      cart.isActive = false;
      await cart.save();
      return res.json({ message: "cart updated" });
    }
  } catch (error) {
    console.log(error);
  }
  return res.status(404).json({ message: "cart not found" });
});

// will update to have authentication before doing this
const addToCart = expressAsyncHandler(async (req, res) => {
  const { user, product } = req.body;
  try {
    const exist = await Cart.findOne({
      user: user,
      isActive: true,
    });
    if (exist) {
      exist.products.push({ ...product });
      const cart = await exist.save();
      res.status(201).json(cart);
    } else {
      const newCart = new Cart({
        user: user,
        products: [product],
        isActive: true,
      });

      const cart = await newCart.save();
      res.status(201).json(cart);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const getActiveCart = expressAsyncHandler(async (req, res) => {
  const exist = await Cart.findOne({
    isActive: true,
    user: req.body.user,
  }).populate({
    path: "products.variant products.product",
    populate: { path: "hand loft flex shaft" },
  });
  if (!exist) {
    return res.status(404).json({ message: "not found" });
  }

  return res.status(201).json({
    _id: exist._id,
    products: exist.products,
    isActive: exist.isActive,
    user: exist.user,
  });
});

const countItemInCart = expressAsyncHandler(async (req, res) => {
  const { user } = req.body;
  try {
    const exist = await Cart.findOne({ user: user, isActive: true });
    if (exist) {
      res.json({ count: exist.products.length });
    }
    res.status(404);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const removeProductFromCart = expressAsyncHandler(async (req, res) => {
  const { cartId, removedItemId } = req.body;
  try {
    const exist = await Cart.findOne({ _id: cartId }).populate({
      path: "products.variant products.product",
      populate: { path: "hand loft flex shaft" },
    });
    if (exist) {
      exist.products = exist.products.filter((product) => {
        if (product._id == removedItemId) {
          return false;
        }
        return true;
      });

      await exist.save();
      return res.status(201).json(exist);
    }
    return res.status(404);
  } catch (error) {
    return res.json(500).json({ message: error });
  }
});

export {
  archivedCart,
  addToCart,
  countItemInCart,
  getActiveCart,
  removeProductFromCart,
};
