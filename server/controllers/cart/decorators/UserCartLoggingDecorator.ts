import {IRoute, Methods} from "../../../typings/Controller";
import CartLoggingDecorator from "./CartLoggingDecorator";

export class UserCartLoggingDecorator extends CartLoggingDecorator {
    public routes: IRoute[] = [
        {
            path: "/auth/active",
            method: Methods.GET,
            handler: this.getActiveCart,
            localMiddlewares: [],
        },
        {
            path: "/auth/add",
            method: Methods.POST,
            handler: this.addToCart,
            localMiddlewares: [],
        },
        {
            path: "/auth/remove",
            method: Methods.POST,
            handler: this.removeProduct,
            localMiddlewares: [],
        },
        {
            path: "/auth/quantity/update",
            method: Methods.POST,
            handler: this.updateQty,
            localMiddlewares: [],
        },
        {
            path: "/auth/count",
            method: Methods.GET,
            handler: this.countItem,
            localMiddlewares: [],
        },
    ];
}