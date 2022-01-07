import {StateManager} from "./StateManager";
import {OrderState} from "./OrderState";

export class CompleteState extends OrderState {
    public async enterState(context: StateManager): Promise<void> {
        const {order} = context;
        order.stateHistory = [...order.stateHistory, {state: "completed"}];
        order.state.state = "completed";
        await order.save();
        context.transitionToState(this);
    }

    public cancelOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public completeOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public confirmOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public shipOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }
}