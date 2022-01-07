import {StateManager} from "./StateManager";
import {OrderState} from "./OrderState";

export class CancelledState extends OrderState {
    public async enterState(context: StateManager): Promise<void> {
        const {order} = context;
        order.stateHistory = [...order.stateHistory, {state: "cancelled"}];
        order.state.state = "cancelled";
        await order.save();
        context.transitionToState(this);
    }

    public confirmOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public shipOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public completeOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public cancelOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }
}