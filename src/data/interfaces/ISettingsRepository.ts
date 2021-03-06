export interface ISettingsRepository {
  getSettings(): Settings;
}

export class Settings {
  public backend: string;
  public auth0Audience: string;
  public auth0Domain: string;
  public auth0ClientId: string;
  public auth0Protocol: string;
  public auth0RedirectUri: string;
}
