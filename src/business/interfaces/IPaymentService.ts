import { StripeElements } from "@stripe/stripe-js";

export interface IPaymentService {
  saveCard(elements: StripeElements): Promise<void>;
}
