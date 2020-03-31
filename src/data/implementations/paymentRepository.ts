import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";

interface IBeginStoreCreditCardResponse {
  client_secret: string;
}

export class PaymentRepository implements IPaymentRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }
  public async getSaveCreditCardClientSecret(): Promise<string> {
    const response = await this.requestRepository.requestWithAuth<
      IBeginStoreCreditCardResponse
    >(`${this.backend}/users/self/cards/new`, "GET", {});
    return response.client_secret;
  }

  public async setStoredCard(paymentMethodId: string): Promise<void> {
    const response = await this.requestRepository.requestWithAuth<boolean>(
      `${this.backend}/users/self/cards`,
      "POST",
      { payment_method_id: paymentMethodId }
    );
  }
}
