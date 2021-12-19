import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Flex, Golf, Hand, Loft, Shaft, Variant } from "../../models/golfModel";
import Controller, { Methods } from "../../typings/Controller";

export default class ProductController extends Controller {
  public path = "/api/products";
  protected routes = [
    {
      path: "/golfs/:id",
      method: Methods.GET,
      handler: this.findGolfById,
      localMiddlewares: [],
    },
    {
      path: "/golfs",
      method: Methods.GET,
      handler: this.findAllGolf,
      localMiddlewares: [],
    },
    {
      path: "/golfs/create",
      method: Methods.POST,
      handler: this.createGolf,
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
      const golf = await Golf.findById(mongoose.Types.ObjectId(req.params.id));
      if (!golf) {
        super.sendError(404, res, "not found");
      }

      const variants = await Variant.find({
        golf: golf._id,
      }).populate("hand shaft flex loft");

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
      const golfs = await Golf.find({});

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

      const created = await Golf.create(golf);

      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        const { loft, shaft, flex, hand, ...variantRest } = variant;

        let loftId = null;
        let shaftId = null;
        let flexId = null;

        if (loft) {
          const updatedLoft = await Loft.findOneAndUpdate(
            { type: loft.type },
            { ...loft },
            { new: true, upsert: true, useFindAndModify: false }
          );
          loftId = updatedLoft._id;
        }

        if (shaft) {
          const updatedShaft = await Shaft.findOneAndUpdate(
            {
              name: shaft.name,
            },
            { ...shaft },
            { new: true, upsert: true, useFindAndModify: false }
          );
          shaftId = updatedShaft._id;
        }

        if (flex) {
          const updatedFlex = await Flex.findOneAndUpdate(
            { type: flex.type },
            { ...shaft },
            { new: true, upsert: true, useFindAndModify: false }
          );
          flexId = updatedFlex._id;
        }
        const existHand = await Hand.findOne({ side: hand.side });

        await Variant.create({
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
