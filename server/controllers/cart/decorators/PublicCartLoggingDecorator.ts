import {IRoute, Methods} from "../../../typings/Controller";
import CartLoggingDecorator from "./CartLoggingDecorator";

export class PublicCartLoggingDecorator extends CartLoggingDecorator {
    public routes: IRoute[] = [
        {
            path: "/active",
            method: Methods.GET,
            handler: this.getActiveCart,
            localMiddlewares: [],
        },
        {
            path: "/add",
            method: Methods.POST,
            handler: this.addToCart,
            localMiddlewares: [],
        },
        {
            path: "/remove",
            method: Methods.POST,
            handler: this.removeProduct,
            localMiddlewares: [],
        },
        {
            path: "/quantity/update",
            method: Methods.POST,
            handler: this.updateQty,
            localMiddlewares: [],
        },
        {
            path: "/count",
            method: Methods.GET,
            handler: this.countItem,
            localMiddlewares: [],
        },
    ];
}