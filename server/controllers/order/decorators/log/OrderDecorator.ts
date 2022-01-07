import OrderController from "../../OrderController";
import ConfigureLogging from "../../../../utils/logger/ConfigureLogging";
import {NextFunction, Request, Response} from "express";
import {ParamsDictionary} from "express-serve-static-core";
import {ParsedQs} from "qs";

export abstract class OrderDecorator extends OrderController {
    protected orderController: OrderController

    protected constructor(orderController: OrderController, logger: ConfigureLogging) {
        super(logger)
        this.orderController = orderController
    }

    async createOrder(
        req: Request<ParamsDictionary, any, any, ParsedQs>,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        await this.orderController.createOrder(req, res, next)
    }

    async getOrderById(
        req: Request<ParamsDictionary, any, any, ParsedQs>,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        await this.orderController.getOrderById(req, res, next);
    }
}