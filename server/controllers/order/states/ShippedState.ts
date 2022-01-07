import {StateManager} from "./StateManager";
import {OrderState} from "./OrderState";
import {CompleteState} from "./CompleteState";

export class ShippedState extends OrderState {
    public async enterState(context: StateManager): Promise<void> {
        const {order} = context;
        order.stateHistory = [...order.stateHistory, {state: "shipped"}];
        order.state.state = "shipped";
        await order.save();
        context.transitionToState(this);
    }

    public cancelOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public async completeOrder(context: StateManager): Promise<void> {
        const completedState = new CompleteState();
        await completedState.enterState(context);
    }

    public shipOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public confirmOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }
}