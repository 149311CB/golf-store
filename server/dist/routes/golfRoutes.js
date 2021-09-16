"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var golfControllers_1 = require("../controllers/golfControllers");
var reviewControllers_1 = require("../controllers/reviewControllers");
var router = express_1.default.Router();
router.route("/").get(golfControllers_1.getAllGolf);
router.route("/:id/reviews").get(reviewControllers_1.getAllProductReviewById);
router.route("/:id").get(golfControllers_1.getGolfById);
exports.default = router;
