import { TypedEvent } from "../../business/objects/TypedEvent";
import React from "react";

export class Subscription {
  constructor(
    public eventEmitter: TypedEvent<any>,
    public func: (e: any) => void
  ) {}
}

class Base<Props, State> extends React.Component<Props, State> {
  protected subscriptions: Array<Subscription>;
  subscribe(subscription: Subscription) {
    this.subscriptions = new Array<Subscription>();
    this.subscriptions.push(subscription);
    subscription.eventEmitter.on(subscription.func);
  }

  componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      const { eventEmitter, func } = subscription;
      eventEmitter.off(func);
    }
  }
}

export default Base;
