import {orderInterface} from "../../../types/orderType";
import {Document} from "mongoose";
import {OrderState} from "./OrderState";
import {PendingState} from "./PendingState";
import {ConfirmedState} from "./ConfirmedState";
import {ShippedState} from "./ShippedState";
import {CompleteState} from "./CompleteState";

export enum states {
    pending = "pending",
    confirmed = "confirmed",
    shipped = "shipped",
    completed = "completed",
}

// context class
export class StateManager {
    currentState: OrderState;
    order: orderInterface & Document<any, any, orderInterface>;

    constructor(order: orderInterface) {
        this.order = order as orderInterface & Document<any, any, orderInterface>;
        if (order.state.state === states.confirmed) {
            this.currentState = new ConfirmedState();
        } else if (order.state.state === states.shipped) {
            this.currentState = new ShippedState();
        } else if (order.state.state === states.completed) {
            this.currentState = new CompleteState();
        } else {
            this.currentState = new PendingState();
        }
    }

    confirmOrder() {
        this.currentState.confirmOrder(this);
    }

    shipOrder() {
        this.currentState.shipOrder(this);
    }

    completeOrder() {
        this.currentState.completeOrder(this);
    }

    cancelOrder() {
        this.currentState.cancelOrder(this);
    }

    transitionToState(newState: OrderState) {
        this.currentState = newState;
    }
}