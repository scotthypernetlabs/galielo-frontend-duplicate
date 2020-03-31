import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import React from "react";

import { MyContext } from "../../../MyContext";
import { StripeElements } from "@stripe/stripe-js";
import { context } from "../../../context";
import CardSection from "../CardSection/CardSection";

interface Props {
  elements: StripeElements;
}

class CardSetupForm extends React.Component<Props> {
  context!: MyContext;
  public async handleSubmit(event: React.FormEvent): Promise<void> {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const { elements } = this.props;

    const stripe = this.context.stripe;

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }

    await this.context.paymentService.saveCard(elements);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <CardSection />
        <button disabled={!this.context.stripe}>Save Card</button>
      </form>
    );
  }
}

CardSetupForm.contextType = context;

export default function InjectedCardSetupForm() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => <CardSetupForm elements={elements} />}
    </ElementsConsumer>
  );
}
