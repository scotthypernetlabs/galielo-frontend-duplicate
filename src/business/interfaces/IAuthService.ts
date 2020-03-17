export interface IAuthService {
  getToken(): Promise<string>;
  getAuthenticationUrl(): string;
}
