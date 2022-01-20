import { NextFunction, Request, Response } from "express";
import { requestLog } from "../../middlewares/requestLog";
import { routeConfig } from "../../middlewares/routeConfig";
import {
  FlexRepository,
  GolfRepository,
  HandRepository,
  LoftRepository,
  ShaftRepository,
  VariantRepository,
} from "../../repositories/GolfRepository";
import { IVariant } from "../../types/productTypes";
import Controller from "../../typings/Controller";

export default class ProductController extends Controller {
  @requestLog()
  @routeConfig({ method: "get", path: "/api/products" + "/golfs/:id" })
  async findGolfById(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const golf = await GolfRepository.getInstance().findById(req.params.id);
    if (!golf) {
      return super.sendError(404, res, "not found");
    }

    const variants = await VariantRepository.getInstance().all(
      {
        golf: golf._id,
      },
      { path: "hand shaft flex loft" }
    );

    super.sendSuccess(200, res, { golf, variants });
  }

  @requestLog()
  @routeConfig({ method: "get", path: "/api/products" + "/golfs" })
  async findAllGolf(
    req: Request,
    res: Response,
    __: NextFunction
  ): Promise<any> {
    const { variant } = req.query;
    const populate =
      variant === "deep" ? { path: "flex shaft hand loft" } : { path: "" };
    const golfs = await GolfRepository.getInstance().all();
    const variants = await VariantRepository.getInstance().all(
      {
        golf: { $in: golfs },
      },
      populate
    );

    const result = golfs.map((golf) => {
      const v: IVariant[] = [];
      variants.forEach((variant) => {
        if (variant.golf.toString() == golf._id.toString()) {
          v.push(variant);
        }
      });
      return { variants: v, golf };
    });
    super.sendSuccess(200, res, result);
  }

  @requestLog()
  @routeConfig({ method: "get", path: "/api/products" + "/create" })
  async createGolf(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> {
    try {

      const { variants, golf } = req.body;

      const created = await GolfRepository.getInstance().create(golf);

      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        const { loft, shaft, flex, hand, ...variantRest } = variant;

        let loftId = null;
        let shaftId = null;
        let flexId = null;

        if (loft) {
          const updatedLoft =
            await LoftRepository.getInstance().findOneAndUpdate(
              { type: loft.type },
              { ...loft },
              { new: true, upsert: true, useFindAndModify: false }
            );
          loftId = updatedLoft._id;
        }

        if (shaft) {
          const updatedShaft =
            await ShaftRepository.getInstance().findOneAndUpdate(
              {
                name: shaft.name,
              },
              { ...shaft },
              { new: true, upsert: true, useFindAndModify: false }
            );
          shaftId = updatedShaft._id;
        }

        if (flex) {
          const updatedFlex =
            await FlexRepository.getInstance().findOneAndUpdate(
              { type: flex.type },
              { ...shaft },
              { new: true, upsert: true, useFindAndModify: false }
            );
          flexId = updatedFlex._id;
        }
        const existHand = await HandRepository.getInstance().findOne({
          side: hand.side,
        });

        await VariantRepository.getInstance().create({
          golf: created._id,
          loft: loftId,
          shaft: shaftId,
          flex: flexId,
          hand: existHand?._id || null,
          ...variantRest,
        });
      }
      super.sendSuccess(200, res, { golf: created._id });
    } catch (error: any) {
      console.log(error);
      super.sendError(500, error.message);
    }
  }

  @requestLog()
  @routeConfig({ method: "get", path: "/api/products" + "/golf/flex/all" })
  async getAllFlex(_: Request, res: Response, __: NextFunction): Promise<any> {
    try {
      // const flexs = await FlexRepository.getInstance().all();
      const flexs = await FlexRepository.getInstance().model.aggregate([
        {
          $group: {
            _id: "$type",
            flex: { $push: "$$ROOT" },
          },
        },
        { $unwind: "$flex" },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$$ROOT", "$flex"],
            },
          },
        },
        { $project: { flex: 0 } },
      ]);
      return super.sendSuccess(200, res, flexs);
    } catch (error) {
      return super.sendError(500, res);
    }
  }
}
