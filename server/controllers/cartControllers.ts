import expressAsyncHandler from "express-async-handler";
import { verifyToken } from "../middlewares/authMiddleware";
import Cart from "../models/cartModel";
import generateToken from "../utils/generateToken";

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
const authedAddToCart = expressAsyncHandler(async (req, res) => {
  const { user, product } = req.body;
  try {
    let exist;
    if (user) {
      exist = await Cart.findOne({
        user: user._id,
        isActive: true,
      });
    }

    if (exist) {
      const existItem = exist.products.find((item: any) => {
        return item.variant == product.variant;
      });

      if (existItem) {
        existItem.quantity = existItem.quantity + product.quantity;
      } else {
        exist.products.push({ ...product });
      }

      const cart = await exist.save();
      if (user) {
        return res.status(201).json(cart);
      } else if (cart) {
        return res.status(201).json({ cart });
      }
    } else {
      const newCart = new Cart({
        user: user._id,
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

const guestAddToCart = expressAsyncHandler(async (req, res) => {
  try {
    const result = verifyToken(req);
    if (result) {
      const { product } = req.body;
      // @ts-ignore
      const { cartId } = result;
      if (cartId) {
        const exist = await Cart.findOne({
          _id: cartId,
          isActive: true,
        });
        if (exist) {
          exist.products.push({ ...product });
          const cart = await exist.save();
          return res.status(201).json(cart);
        }
        res.status(401);
      } else {
        const newCart = new Cart({
          user: null,
          products: [product],
          isActive: true,
        });

        await newCart.save();
        return res
          .status(201)
          .json({ guestToken: generateToken({ cartId: newCart._id }) });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

const getActiveCart = expressAsyncHandler(async (req, res) => {
  const { user } = req.body;
  let exist;
  if (user) {
    exist = await Cart.findOne({
      isActive: true,
      user: user._id,
    }).populate({
      path: "products.variant products.product",
      populate: { path: "hand loft flex shaft" },
    });
  }

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

const guestGetActiveCart = expressAsyncHandler(async (req, res) => {});

const authCountItemInCart = expressAsyncHandler(async (req, res) => {
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

const countItemInCart = expressAsyncHandler(async (req, res) => {
  const { cartId } = req.body;
  try {
    const exist = await Cart.findOne({ _id: cartId, isActive: true });
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
  authedAddToCart,
  authCountItemInCart,
  countItemInCart,
  getActiveCart,
  removeProductFromCart,
  guestAddToCart,
};
