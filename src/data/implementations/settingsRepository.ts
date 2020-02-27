import { ISettingsRepository, Settings } from '../interfaces/ISettingsRepository';

export class SettingsRepository implements ISettingsRepository {
  protected settings: Settings;
  constructor(){
    const url = window.location.hostname;
    let config = "development";

    switch(url){
      case 'localhost':
        config = "local";
        break;
      case 'app-dev.galileoapp.io':
        config = "development";
        break;
      case 'pubngrub.galileoapp.io':
        config = "kubernetes";
        break;
      case 'app.galileoapp.io':
        config = "production";
        break;
      default:
        config = "local";
        break;
    }
    const configFile = require(`../../config/config.${config}.json`);
    const settings = new Settings();

    // Replace the string $LOCALIP if the backend with the value of the
    // LOCALIP environment variable. This is used for dockerized configs
    // like test
    settings.backend = configFile.BACKEND.replace("$LOCALIP", process.env.LOCALIP);
    settings.auth0Audience = configFile.AUTH0_AUDIENCE;
    settings.auth0ClientId = configFile.AUTH0_CLIENT_ID;
    settings.auth0Domain = configFile.AUTH0_DOMAIN;
    settings.auth0Protocol = configFile.AUTH0_PROTOCOL;
    settings.auth0RedirectUri = configFile.AUTH0_REDIRECT_URI;
    this.settings = settings;
  }

  getSettings(): Settings {
    return this.settings;
  }
}
