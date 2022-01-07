import {StateManager} from "./StateManager";

export abstract class OrderState {
  public abstract confirmOrder(context: StateManager): void;
  public abstract shipOrder(context: StateManager): void;
  public abstract completeOrder(context: StateManager): void;
  public abstract cancelOrder(context: StateManager): void;
  public abstract enterState(context: StateManager): void;
}

