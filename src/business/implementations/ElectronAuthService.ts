import { ISettingsRepository, Settings } from '../../data/interfaces/ISettingsRepository';
import crypto from 'crypto';
import requestPromise from 'request-promise';
import request from 'request'
import URL from 'url';
import qs from 'querystring';
import { logService } from '../../components/Logger';
import { IAuthService } from '../interfaces/IAuthService';
import createAuth0Client from '@auth0/auth0-spa-js'


class RequestPromise {
  constructor(){
  }
  makeRequest(options: request.RequiredUriUrl & request.CoreOptions): requestPromise.RequestPromise{
    return requestPromise(options);
  }
}

export class ElectronAuthService implements IAuthService {
  protected settings: Settings;
  protected auth0Audience: string;
  protected auth0ClientId: string;
  protected auth0Domain: string;
  protected auth0Protocol: string;
  protected auth0RedirectUri: string;
  protected backend: string;
  protected verifier: string;
  protected challenge: string;
  protected token: string;
  protected userName: string;
  protected refreshToken: string;
  protected expiresIn: number;

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
    return this.auth0Domain + '/authorize?' +
      'response_type=token&' +
      'scope=openid%20email%20profile%20offline_access&' +
      `client_id=${this.auth0ClientId}&` +
      `redirect_uri=${this.auth0RedirectUri}&` +
      `state="blahblahblah"&` +
      `nonce=${this.challenge}&` +
      `audience=${this.auth0Audience}`;
  }
  public async getToken() {
    const auth0 = await createAuth0Client({
      domain: "galileoapp.auth0.com",
      client_id: "LMejYDIPpYEDsOApRkbeAsC8B3G3SM8F"
    })
    const response = await auth0.getTokenSilently();
    return response
  }
  public handleAuthorizationResponse(code: string) {
    logService.log("Received code", code);
    const options = {
      method: 'POST',
      url: `${this.auth0Domain}/oauth/token`,
      json: true,
      body: {
        audience: this.auth0Audience,
        grant_type: 'authorization_code',
        client_id: this.auth0ClientId,
        code_verifier: this.verifier,
        redirect_uri: this.auth0RedirectUri,
        code,
      },
    } as request.RequiredUriUrl;
    logService.log("Verifier", this.verifier);
    const requestPromise = new RequestPromise();
    requestPromise.makeRequest(options)
      .then((response: any) => {
        this.token = response.access_token;
        this.refreshToken = response.refresh_token;
        this.expiresIn = response.expires_in;
        const innerOptions = {
          method: 'GET',
          url: `${this.auth0Domain}/userinfo`,
          headers: { Authorization: `bearer ${this.token}` },
          json: true,
        } as request.RequiredUriUrl;

        requestPromise.makeRequest(innerOptions)
          .then((innerResponse: any) => {
            this.userName = innerResponse.name;
          })
          .catch((error: Error) => {
            logService.log(error);
          })
      })
      .catch((error: Error) => {
        logService.log(error);
      })
  }
  protected base64URLEncode(str: Buffer) {
    return str
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  protected sha256(buffer: string) {
    return crypto
      .createHash('sha256')
      .update(buffer)
      .digest();
  }
}
