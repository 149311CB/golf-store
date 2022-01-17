import { NextFunction, Request, Response } from "express";
import AddressRepository from "../../repositories/ShippingRepository";
import Controller, { IRoute, Methods } from "../../typings/Controller";

export default class AddressController extends Controller {
  public path = "/api/address";
  public routes: IRoute[] = [
    {
      path: "/user/create",
      method: Methods.POST,
      handler: this.createAddress,
      localMiddlewares: [],
    },
    {
      path: "/user/primary",
      method: Methods.GET,
      handler: this.getPrimaryAddress,
      localMiddlewares: [],
    },
  ];

  async createAddress(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { user } = req;
      const { city, street, state, zip, apt, isPrimary = false } = req.body;
      if (isPrimary) {
        const exist = await AddressRepository.getInstance().findOne({
          isPrimary: true,
        });
        if (exist) {
          exist.isPrimary = false;
          await exist.save();
        }
      }
      const address = await AddressRepository.getInstance().create({
        user: user._id,
        street,
        city,
        state,
        zip,
        apt,
        isPrimary,
      });
      return super.sendSuccess(201, res, address);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async getPrimaryAddress(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { user } = req;
      const exist = await AddressRepository.getInstance().findOne({
        user: user._id,
      });
      return super.sendSuccess(200, res, exist);
    } catch (error) {
      return super.sendError(500, res);
    }
  }
}
