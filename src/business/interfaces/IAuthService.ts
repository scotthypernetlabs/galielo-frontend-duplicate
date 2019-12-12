export interface IAuthService {
    getToken(): string;
    getAuthenticationUrl(): string;
}