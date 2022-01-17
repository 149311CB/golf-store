import {IRoute} from "../../typings/Controller";
import {NextFunction, Request, Response} from "express";
import CartRepository from "../../repositories/CatRepository";
import {COOKIES_OPTIONS, generateRefreshToken,} from "../../utils/generateToken";
import {CartController} from "./CartController";

// @access: guest
export default class PublicCartController extends CartController {
    public routes: IRoute[] = [];

    async getActiveCart(
        req: Request,
        res: Response,
        _: NextFunction
    ): Promise<any> {
        const {cartId} = req;
        const exist = await CartRepository.getInstance().findById(cartId, {
            path: "products.variant products.product",
            populate: {path: "hand loft flex shaft"},
        });

        if (!exist) {
            super.sendSuccess(200, res, null, "not found");
        } else {
            const result = {
                _id: exist._id,
                products: exist.products,
                isActive: exist.isActive,
                user: exist.user,
            };
            super.sendSuccess(200, res, result);
        }
    }

    async addToCart(req: Request, res: Response, _: NextFunction): Promise<any> {
        const {cartId} = req;

        const cart = await CartRepository.getInstance().findOne({
            _id: cartId,
            isActive: true,
        });

        const {product} = req.body;
        if (cart) {
            return await this.add(cart, product, res);
        } else {
            const cart = await CartRepository.getInstance().create({
                user: null,
                products: [product],
                isActive: true,
            });
            const cartToken = generateRefreshToken({cartId: cart._id});
            res.cookie("cart_token", cartToken, COOKIES_OPTIONS);
            return super.sendSuccess(200, res, null);
        }
    }

    async removeProduct(
        req: Request,
        res: Response,
        _: NextFunction
    ): Promise<any> {
        const {cartId} = req;
        const {productId} = req.body;
        const exist = await CartRepository.getInstance().findById(cartId, {
            path: "products.variant products.product",
        });

        if (exist) {
            exist.products = exist.products.filter((product) => {
                return product._id != productId;
            });

            const newCart = await exist.save();
            super.sendSuccess(200, res, newCart);
        } else {
            super.sendError(404, res, "cart-badge not found");
        }
    }

    async updateQty(req: Request, res: Response, _: NextFunction): Promise<any> {
        const {cartId} = req;
        const {lineItemId, quantity} = req.body;
        if (!lineItemId || !quantity) {
            return super.sendError(400, res, "required line item id and quantity");
        }
        const cart = await CartRepository.getInstance().findById(cartId);
        return await this.updateQuantity(cart, res, lineItemId, quantity);
    }

    async countItem(req: Request, res: Response, _: NextFunction): Promise<any> {
        const {cartId} = req;
        const cart = await CartRepository.getInstance().findById(cartId);
        if (!cart) {
            return super.sendSuccess(200, res, {count: 0});
        }
        return super.sendSuccess(200, res, {count: cart.products.length});
    }
}
