
export interface IAuth0User extends Omit<IdToken, '__raw'> {}

export interface IAuth0Context {
  user: IAuth0User
  isAuthenticated: boolean
  isInitializing: boolean
  isPopupOpen: boolean
  loginWithPopup(o?: PopupLoginOptions): Promise<void>
  handleRedirectCallback(): Promise<RedirectLoginResult>
  getIdTokenClaims(o?: getIdTokenClaimsOptions): Promise<IdToken>
  loginWithRedirect(o?: RedirectLoginOptions): Promise<void>
  getTokenSilently(o?: GetTokenSilentlyOptions): Promise<string | undefined>
  getTokenWithPopup(o?: GetTokenWithPopupOptions): Promise<string | undefined>
  logout(o?: LogoutOptions): void
}
export interface IAuth0ProviderOptions {
  children: React.ReactElement
}
