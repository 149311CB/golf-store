import { Response, Router } from "express";

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export default abstract class Controller {
  public  router: Router = Router();

  protected sendSuccess(
    status: number,
    res: Response,
    data: object | null,
    message?: string
  ): Response {
    return res.status(status).json({
      message: message || "success",
      data,
    });
  }

  protected sendError(
    status: number,
    res: Response,
    message?: string
  ): Response {
    return res
      .status(status)
      .json({ message: message || "internal server error" });
  }

  protected sendRedirect(res: Response, url: string) {
    res.redirect(url);
  }
}
