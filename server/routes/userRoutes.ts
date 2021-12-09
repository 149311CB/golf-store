import express from "express";
import { authUser, registerUser } from "../controllers/userController";

const router = express.Router();

router.route("/login").post(authUser)
router.route("/register").post(registerUser)

export default router
