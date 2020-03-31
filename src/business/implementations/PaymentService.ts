import { CardElement } from "@stripe/react-stripe-js";
import {
  ConfirmCardSetupData,
  Stripe,
  StripeElements
} from "@stripe/stripe-js";
import { IPaymentRepository } from "../../data/interfaces/IPaymentRepository";
import { IPaymentService } from "../interfaces/IPaymentService";
import { ISettingsRepository } from "../../data/interfaces/ISettingsRepository";

export class PaymentService implements IPaymentService {
  constructor(
    protected paymentRepository: IPaymentRepository,
    protected settingsRepository: ISettingsRepository,
    protected stripe: Stripe
  ) {}

  public async saveCard(elements: StripeElements): Promise<void> {
    // First, get the client secret
    const client_secret = await this.paymentRepository.getSaveCreditCardClientSecret();

    console.log(`received client secret: ${client_secret}`);

    const setup_data: ConfirmCardSetupData = {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Jenny Rosen" // TODO: We need a name on card input form
        }
      }
    };

    const result = await this.stripe.confirmCardSetup(
      client_secret,
      setup_data
    );

    if (result.error) {
      // Display result.error.message in your UI.
      throw new Error(result.error.message);
    } else {
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
      await this.paymentRepository.setStoredCard(
        result.setupIntent.payment_method
      );
      alert(
        `Set a stored card, payment id ${result.setupIntent.payment_method}`
      );
    }
  }
}
