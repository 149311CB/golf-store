import {StateManager} from "./StateManager";
import {OrderState} from "./OrderState";
import {ShippedState} from "./ShippedState";
import {CancelledState} from "./CancelledState";

export class ConfirmedState extends OrderState {
    public async enterState(context: StateManager): Promise<void> {
        const {order} = context;
        order.stateHistory = [...order.stateHistory, {state: "confirmed"}];
        order.state.state = "confirmed";
        await order.save();
        context.transitionToState(this);
    }

    public async cancelOrder(context: StateManager): Promise<void> {
        const cancelledState = new CancelledState()
        await cancelledState.enterState(context)
    }

    public completeOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public async shipOrder(context: StateManager): Promise<void> {
        const shippedState = new ShippedState();
        await shippedState.enterState(context);
    }

    public confirmOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }
}