import {CartController} from "../CartController";
import ConfigureLogging from "../../../utils/logger/ConfigureLogging";
import {NextFunction, Request, Response} from "express";
import {ParamsDictionary} from "express-serve-static-core";
import {ParsedQs} from "qs";

export abstract class CartDecorator extends CartController {
    cartController: CartController;

    constructor(cartController: CartController, logger: ConfigureLogging) {
        super(logger);
        this.cartController = cartController;
    }

    async getActiveCart(
        req: Request<ParamsDictionary, any, any, ParsedQs>,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        await this.cartController.getActiveCart(req, res, next);
    }

    async addToCart(
        req: Request<ParamsDictionary, any, any, ParsedQs>,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        await this.cartController.addToCart(req, res, next);
    }

    async removeProduct(
        req: Request<ParamsDictionary, any, any, ParsedQs>,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        await this.cartController.removeProduct(req, res, next);
    }

    async updateQty(
        req: Request<ParamsDictionary, any, any, ParsedQs>,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        await this.cartController.updateQty(req, res, next);
    }

    async countItem(
        req: Request<ParamsDictionary, any, any, ParsedQs>,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        await this.cartController.countItem(req, res, next);
    }
}
