"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var reviewSchema = new mongoose_1.Schema({
    golf: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Golf",
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
    },
});
var Review = (0, mongoose_1.model)("Review", reviewSchema, "reviews");
exports.default = Review;
