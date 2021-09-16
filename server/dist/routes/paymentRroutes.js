"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var paymentControllers_1 = require("../controllers/paymentControllers");
var router = express_1.default.Router();
router.route("/stripe").post(paymentControllers_1.orderUsingStripe);
exports.default = router;
