import { NextFunction, Request, Response } from "express";
import { CategoryRepository } from "../repositories/CategoryRepository";
import Controller, { Methods } from "../typings/Controller";

export default class CategoryController extends Controller {
  public path = "/api/category";
  public routes = [
    {
      path: "/list",
      method: Methods.POST,
      handler: this.getCategoryList,
      localMiddlewares: [],
    },
  ];
  constructor() {
    super();
  }
  async getCategoryList(req: Request, res: Response, _: NextFunction) {
    try {
      const { categoryList } = req.body;

      const categories = await CategoryRepository.getInstance().all(
        {
          name: { $in: categoryList },
        },
        { path: "products" }
      );

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
