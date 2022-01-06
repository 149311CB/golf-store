import { NextFunction, Request, Response } from "express";
import { FlexRepository, GolfRepository, HandRepository, LoftRepository, ShaftRepository, VariantRepository } from "../../repositories/GolfRepository";
import Controller, { Methods } from "../../typings/Controller";

export default class ProductController extends Controller {
  public path = "/api/products";
  public routes = [
    {
      path: "/golfs/:id",
      method: Methods.GET,
      handler: this.findGolfById.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/golfs",
      method: Methods.GET,
      handler: this.findAllGolf.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/golfs/create",
      method: Methods.POST,
      handler: this.createGolf.bind(this),
      localMiddlewares: [],
    },
  ];

  constructor() {
    super();
  }

  async findGolfById(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> {
    try {
      const golf = await GolfRepository.getInstance().findById(req.params.id);
      if (!golf) {
        super.sendError(404, res, "not found");
      }

      const variants = await VariantRepository.getInstance().all(
        {
          golf: golf._id,
        },
        { path: "hand shaft flex loft" }
      );

      super.sendSuccess(200, res, { golf, variants });
    } catch (error: any) {
      console.log(error);
      super.sendError(500, error.message);
    }
  }

  async findAllGolf(
    _: Request,
    res: Response,
    __: NextFunction
  ): Promise<void> {
    try {
      const golfs = await GolfRepository.getInstance().all();

      super.sendSuccess(200, res, golfs);
    } catch (error: any) {
      super.sendError(500, error.message);
    }
  }

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
          const updatedLoft = await LoftRepository.getInstance().findOneAndUpdate(
            { type: loft.type },
            { ...loft },
            { new: true, upsert: true, useFindAndModify: false }
          );
          loftId = updatedLoft._id;
        }

        if (shaft) {
          const updatedShaft = await ShaftRepository.getInstance().findOneAndUpdate(
            {
              name: shaft.name,
            },
            { ...shaft },
            { new: true, upsert: true, useFindAndModify: false }
          );
          shaftId = updatedShaft._id;
        }

        if (flex) {
          const updatedFlex = await FlexRepository.getInstance().findOneAndUpdate(
            { type: flex.type },
            { ...shaft },
            { new: true, upsert: true, useFindAndModify: false }
          );
          flexId = updatedFlex._id;
        }
        const existHand = await HandRepository.getInstance().findOne({ side: hand.side });

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
}
