"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var golfSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    loft: {
        type: Array,
        required: true,
    },
    shaft: {
        type: Array,
        required: true,
    },
    flex: {
        type: Array,
        required: true,
    },
    sku: {
        type: String,
    },
    description: {
        type: String,
    },
    images: {
        type: Array,
    },
});
var Golf = (0, mongoose_1.model)("Golf", golfSchema, "golf");
exports.default = Golf;
