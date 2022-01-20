import { NextFunction, Request, Response } from "express";
import AddressRepository from "../../repositories/ShippingRepository";
import Controller from "../../typings/Controller";
import { routeConfig } from "../../middlewares/routeConfig";
import { userProtected } from "../../middlewares/authMiddleware";
import { requestLog } from "../../middlewares/requestLog";

export default class AddressController extends Controller {
  @requestLog()
  @routeConfig({ method: "post", path: "/api/address" + "/user/create", middlewares: [userProtected] })
  async createAddress(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { user } = req;
      console.log(user)
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

  @requestLog()
  @routeConfig({ method: "get", path: "/api/address" + "/user/primary", middlewares: [userProtected] })
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
