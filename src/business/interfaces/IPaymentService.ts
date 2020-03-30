import { GetMachinesFilter } from "../objects/machine";
import { StripeElements } from "@stripe/stripe-js";

export interface IPaymentService {
  saveCard(elements: StripeElements): Promise<void>;
}
