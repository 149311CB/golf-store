"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrice = void 0;
var calculatePrice = function (items) {
    var total = items.length;
    for (var i = 0; i < items.length; i++) {
        total = total + items[i].price * items[i].amount;
    }
    return total * 100;
};
exports.calculatePrice = calculatePrice;
