export interface IUploadService {
  addToQueue(callback: Function): void;
  startQueue(): void;
  startNext(): void;
  length(): number;
}
