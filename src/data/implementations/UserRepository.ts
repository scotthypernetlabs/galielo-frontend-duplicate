import { IMachineRepository } from "../interfaces/IMachineRepository";
import { IRequestRepository } from "../interfaces/IRequestRepository";
import { ISettingsRepository } from "../interfaces/ISettingsRepository";
import { IStation, StationFilters } from "../../api/objects/station";
import { IUser } from "../../api/objects/user";
import { IUserRepository } from "../interfaces/IUserRepository";
import {
  StationInvite,
  User,
  UserFilterOptions,
  Wallet
} from "../../business/objects/user";
import { convertToBusinessStation } from "./StationRepository";

export interface IGetUsersResponse {
  users: IUser[];
}

export interface IGetStationInviteResponse {
  stations: IStation[];
}

const generateUserUrl = (
  backend_url: string,
  filterOptions?: UserFilterOptions
) => {
  const baseUrl = `${backend_url}/users`;
  if (filterOptions == undefined) {
    return baseUrl;
  }
  const json = JSON.parse(JSON.stringify(filterOptions));
  let appendedUrl: string = "?";
  Object.keys(json).forEach((key: keyof UserFilterOptions) => {
    if (json[key] == null) return;
    if (appendedUrl[appendedUrl.length - 1] != "?") {
      appendedUrl += "&";
    }
    switch (key) {
      case "page":
        appendedUrl += `${key}=${filterOptions[key]}`;
        break;
      case "items":
        appendedUrl += `${key}=${filterOptions[key]}`;
        break;
      default:
        // handles all instances where the key is a string[]
        filterOptions[key].forEach((value, idx) => {
          if (idx > 0) {
            appendedUrl += "&";
          }
          appendedUrl += `${key}=${value}`;
        });
        break;
    }
  });
  if (appendedUrl.length > 1) {
    return baseUrl + appendedUrl;
  }
  return baseUrl;
};

function convertToBusinessUser(users_list: IUser[]) {
  return users_list.map(user => {
    const wallets = user.wallets.map(wallet => {
      return new Wallet(
        wallet.profilewalletid,
        wallet.wallet,
        wallet.public_key
      );
    });
    return new User(user.userid, user.username, user.mids, wallets);
  });
}

export class UserRepository implements IUserRepository {
  protected backend: string;
  constructor(
    protected requestRepository: IRequestRepository,
    protected settings: ISettingsRepository,
    protected machineRepository: IMachineRepository
  ) {
    this.backend = `${
      this.settings.getSettings().backend
    }/galileo/user_interface/v1`;
  }

  async getCurrentUser() {
    const response: IUser = await this.requestRepository.requestWithAuth(
      `${this.backend}/users/self`,
      "GET"
    );
    return convertToBusinessUser([response])[0];
  }
  async getUsers(filterOptions: UserFilterOptions) {
    const url = generateUserUrl(this.backend, filterOptions);
    const response: IGetUsersResponse = await this.requestRepository.requestWithAuth(
      url,
      "GET"
    );
    return convertToBusinessUser(response.users);
  }
  async getStationInvites() {
    const response: IGetStationInviteResponse = await this.requestRepository.requestWithAuth(
      `${this.backend}/users/invites`
    );
    return response.stations.map(station => {
      return convertToBusinessStation(station);
    });
  }
}
