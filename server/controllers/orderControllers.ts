import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel";

const createOrder = expressAsyncHandler(async (req, res) => {
    const {cart, state, paymentMethod, details, paidAt} = req.body;

    const order = new Order({
        cart: cart,
        state: state,
        paymentMethod: {
            method: paymentMethod,
            details: details,
        },
        paidAt: paidAt,
    });

    const createOrder = await order.save();

    res.status(200).json(createOrder);
});

export {createOrder}