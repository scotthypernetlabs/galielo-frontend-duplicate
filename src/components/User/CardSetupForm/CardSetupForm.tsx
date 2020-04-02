import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import React from "react";

import { Button } from "@material-ui/core";
import { MyContext } from "../../../MyContext";
import { StripeElements } from "@stripe/stripe-js";
import { context } from "../../../context";
import CardSection from "../CardSection/CardSection";

interface Props {
  elements: StripeElements;
}

class CardSetupForm extends React.Component<Props> {
  context!: MyContext;

  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.testPayment = this.testPayment.bind(this);
  }
  public async handleSubmit(event: React.MouseEvent): Promise<void> {
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

  public async testPayment(event: React.MouseEvent): Promise<void> {
    await this.context.paymentService.testPayment();
  }

  render() {
    return (
      <div>
        <CardSection />
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
          disabled={!this.context.stripe}
        >
          Save Card
        </Button>
        <Button variant="contained" color="primary" onClick={this.testPayment}>
          Test Payment
        </Button>
      </div>
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
