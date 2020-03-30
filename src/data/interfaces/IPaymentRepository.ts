import { GetJobFilters, Job, JobStatus } from "../../business/objects/job";
import { GetUploadUrlResponse } from "../implementations/jobRepository";

export interface IPaymentRepository {
  getSaveCreditCardClientSecret(): Promise<string>;
  setStoredCard(paymentMethodId: string): Promise<void>;
}
