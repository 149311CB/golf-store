import { NextFunction, Request, Response } from "express";
import { Category } from "../models/categoryModel";
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
      console.log(categoryList);

      const categories = await Category.getInstance().all(
        {
          name: { $in: categoryList },
        },
        { path: "products.golf" }
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
