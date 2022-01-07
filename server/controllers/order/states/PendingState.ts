import {StateManager} from "./StateManager";
import {OrderState} from "./OrderState";
import {ConfirmedState} from "./ConfirmedState";
import {CancelledState} from "./CancelledState";

export class PendingState extends OrderState {
    public async enterState(context: StateManager): Promise<void> {
        const {order} = context;
        order.stateHistory = [...order.stateHistory, {state: "pending"}];
        order.state.state = "confirmed";
        await order.save();
    }

    public async cancelOrder(context: StateManager): Promise<void> {
        const cancelledState = new CancelledState()
        await cancelledState.enterState(context)
    }

    public completeOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public shipOrder(_: StateManager): void {
        throw new Error("Invalid operation");
    }

    public async confirmOrder(context: StateManager): Promise<void> {
        const confirmedState = new ConfirmedState();
        await confirmedState.enterState(context);
    }
}