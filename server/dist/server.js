"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var db_1 = __importDefault(require("./config/db"));
var cors_1 = __importDefault(require("cors"));
var golfRoutes_js_1 = __importDefault(require("./routes/golfRoutes.js"));
var paymentRroutes_js_1 = __importDefault(require("./routes/paymentRroutes.js"));
dotenv_1.default.config();
(0, db_1.default)();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.get("/", function (req, res) {
    res.send("API is running...");
});
app.use("/api/golfs", golfRoutes_js_1.default);
app.use("/api/payments", paymentRroutes_js_1.default);
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () { return console.log("Server running on port " + PORT); });
