export interface IPaymentRepository {
  getSaveCreditCardClientSecret(): Promise<string>;
  setStoredCard(paymentMethodId: string): Promise<void>;
  testPayment(): Promise<void>;
}
