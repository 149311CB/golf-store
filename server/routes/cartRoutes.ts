import express from "express";
import {archiveCart} from "../controllers/cartControllers";

const router = express.Router()

router.route("/archived").post(archiveCart)

export default router
