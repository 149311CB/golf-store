import { Document } from "mongoose";
import { orderInterface } from "../../types/orderType";

enum states {
  pending = "pending",
  confirmed = "confirmed",
  shipped = "shipped",
  completed = "completed",
}

// cotext class
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

export abstract class OrderState {
  public abstract confirmOrder(context: StateManager): void;
  public abstract shipOrder(context: StateManager): void;
  public abstract completeOrder(context: StateManager): void;
  public abstract cancelOrder(context: StateManager): void;
  public abstract enterState(context: StateManager): void;
}

export class PendingState extends OrderState {
  public async enterState(context: StateManager): Promise<void> {
    const { order } = context;
    order.stateHistory = [...order.stateHistory, { state: "pending" }];
    order.state.state = "confirmed";
    await order.save();
  }
  public cancelOrder(context: StateManager): void {
    const cancelledState = new CancelledState()
    cancelledState.enterState(context)
  }
  public completeOrder(_: StateManager): void {
    throw new Error("Invalid operation");
  }
  public shipOrder(_: StateManager): void {
    throw new Error("Invalid operation");
  }
  public async confirmOrder(context: StateManager): Promise<void> {
    const confirmedState = new ConfirmedState();
    confirmedState.enterState(context);
  }
}

export class ConfirmedState extends OrderState {
  public async enterState(context: StateManager): Promise<void> {
    const { order } = context;
    order.stateHistory = [...order.stateHistory, { state: "confirmed" }];
    order.state.state = "confirmed";
    await order.save();
    context.transitionToState(this);
  }
  public async cancelOrder(context: StateManager): Promise<void> {
    const cancelledState = new CancelledState()
    cancelledState.enterState(context)
  }
  public completeOrder(_: StateManager): void {
    throw new Error("Invalid operation");
  }
  public async shipOrder(context: StateManager): Promise<void> {
    const shippedState = new ShippedState();
    shippedState.enterState(context);
  }
  public confirmOrder(_: StateManager): void {
    throw new Error("Invalid operation");
  }
}

export class ShippedState extends OrderState {
  public async enterState(context: StateManager): Promise<void> {
    const { order } = context;
    order.stateHistory = [...order.stateHistory, { state: "shipped" }];
    order.state.state = "shipped";
    await order.save();
    context.transitionToState(this);
  }
  public cancelOrder(_: StateManager): void {
    throw new Error("Invalid operation");
  }
  public async completeOrder(context: StateManager): Promise<void> {
    const completedState = new CompleteState();
    completedState.enterState(context);
  }
  public shipOrder(_: StateManager): void {
    throw new Error("Invalid operation");
  }
  public confirmOrder(_: StateManager): void {
    throw new Error("Invalid operation");
  }
}

export class CompleteState extends OrderState {
  public async enterState(context: StateManager): Promise<void> {
    const { order } = context;
    order.stateHistory = [...order.stateHistory, { state: "completed" }];
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

export class CancelledState extends OrderState {
  public async enterState(context: StateManager): Promise<void> {
    const { order } = context;
    order.stateHistory = [...order.stateHistory, { state: "cancelled" }];
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
