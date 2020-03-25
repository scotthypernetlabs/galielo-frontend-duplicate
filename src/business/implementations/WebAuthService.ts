import { IAuthService } from "../interfaces/IAuthService";
import {
  ISettingsRepository,
  Settings
} from "../../data/interfaces/ISettingsRepository";
import { logService } from "../../components/Logger";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import URL from "url";
import createAuth0Client from "@auth0/auth0-spa-js";
import crypto from "crypto";
import qs from "querystring";
import request from "request";
import requestPromise from "request-promise";
class RequestPromise {
  constructor() {}
  makeRequest(
    options: request.RequiredUriUrl & request.CoreOptions
  ): requestPromise.RequestPromise {
    return requestPromise(options);
  }
}

export class WebAuthService implements IAuthService {
  protected settings: Settings;
  protected auth0Audience: string;
  protected auth0ClientId: string;
  protected auth0Domain: string;
  protected auth0Protocol: string;
  protected auth0RedirectUri: string;
  protected backend: string;
  protected verifier: string;
  protected challenge: string;
  // protected token: string;
  protected userName: string;
  protected refreshToken: string;
  protected expiresIn: number;
  protected auth0: Auth0Client;

  constructor(protected settingsRepo: ISettingsRepository) {
    this.settings = settingsRepo.getSettings();
    this.auth0Audience = this.settings.auth0Audience;
    this.auth0ClientId = this.settings.auth0ClientId;
    this.auth0Domain = this.settings.auth0Domain;
    this.auth0Protocol = this.settings.auth0Protocol;
    this.auth0RedirectUri = this.settings.auth0RedirectUri;
    this.backend = this.settings.backend;
    this.verifier = this.base64URLEncode(crypto.randomBytes(32));
    this.challenge = this.base64URLEncode(this.sha256(this.verifier));
  }

  public getAuthenticationUrl() {
    return (
      this.auth0Domain +
      "/authorize?" +
      "response_type=token&" +
      "scope=openid%20email%20profile%20offline_access&" +
      `client_id=${this.auth0ClientId}&` +
      `redirect_uri=${this.auth0RedirectUri}&` +
      `state="blahblahblah"&` +
      `nonce=${this.challenge}&` +
      `audience=${this.auth0Audience}`
    );
  }

  public async getToken() {
    // token not in cookie
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) {
      return token;
    }
    if (this.auth0 == null) {
      this.auth0 = await createAuth0Client({
        domain: "galileoapp.auth0.com",
        client_id: "LMejYDIPpYEDsOApRkbeAsC8B3G3SM8F",
        audience: this.auth0Audience
      });
    }

    const response = await this.auth0.getTokenSilently();
    document.cookie = `token=${response};Max-Age=86400` as string;
    return response;
  }
  protected base64URLEncode(str: Buffer) {
    return str
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }
  protected sha256(buffer: string) {
    return crypto
      .createHash("sha256")
      .update(buffer)
      .digest();
  }
}
