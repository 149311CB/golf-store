import { NextFunction, Request, Response } from "express";
import { requestLog } from "../middlewares/requestLog";
import { routeConfig } from "../middlewares/routeConfig";
import { CategoryRepository } from "../repositories/CategoryRepository";
import Controller from "../typings/Controller";

export default class CategoryController extends Controller {
  @requestLog()
  @routeConfig({ method: "post", path: "/api/category" + "/list" })
  async getCategoryList(req: Request, res: Response, _: NextFunction) {
    try {
      const { categoryList } = req.body;

      const categories = await CategoryRepository.find({
        name: { $in: categoryList }
      }).populate({ path: "products" });

      if (!categories) {
        super.sendError(404, res, "not found");
      }

      super.sendSuccess(200, res, categories);
    } catch (error: any) {
      console.log(error.message);
      super.sendError(500, error.message);
    }
  }
}
