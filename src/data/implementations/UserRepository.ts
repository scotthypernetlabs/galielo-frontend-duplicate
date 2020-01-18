import { IUserRepository } from '../interfaces/IUserRepository';
import { IRequestRepository } from '../interfaces/IRequestRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { IMachineRepository } from '../interfaces/IMachineRepository';
import { User, Wallet, UserFilterOptions, StationInvite } from '../../business/objects/user';
import { IUser } from '../../api/objects/user';
import { IStation } from '../../api/objects/station';
import { convertToBusinessStation } from './StationRepository';


export interface IGetUsersResponse {
  users: IUser[];
}

export interface IGetStationInviteResponse {
  stations: IStation[];
}

function convertToBusinessUser(users_list: IUser[]){
  return users_list.map(user => {
    let wallets = user.wallets.map(wallet => {
      return new Wallet(wallet.profilewalletid, wallet.wallet, wallet.public_key);
    })
    return new User(user.userid, user.username, user.mids, wallets);
  })
}

export class UserRepository implements IUserRepository {
  protected backend: string;
  constructor(
    protected requestRepository:IRequestRepository,
    protected settings: ISettingsRepository,
    protected machineRepository: IMachineRepository
    ){
    this.backend = `${this.settings.getSettings().backend}/galileo/user_interface/v1`;
  }

  async getCurrentUser(){
    console.log("get current user");
    let response:IUser = await this.requestRepository.requestWithAuth(`${this.backend}/users/self`, 'GET')
    return convertToBusinessUser([response])[0];
  }
  async getUsers(filterOptions:UserFilterOptions){
    let url = `${this.backend}/users`;
    if(filterOptions){
      let appendedUrl:string = `?`;
      if(filterOptions.userids){
        filterOptions.userids.forEach((user_id:string, idx:number) => {
          let filterString:string = '';
          if(idx > 0){
            filterString += '&';
          }
          filterString += `userids=${user_id}`;
          appendedUrl += filterString;
        })
        url += appendedUrl;
      }else if(filterOptions.partial_username){
        appendedUrl+=`partial_usernames=${filterOptions.partial_username}`;
        url += appendedUrl;
      }
    }
    let response:IGetUsersResponse = await this.requestRepository.requestWithAuth(url, 'GET')
    return convertToBusinessUser(response.users);
  }
  async getStationInvites(){
    let response:IGetStationInviteResponse = await this.requestRepository.requestWithAuth(`${this.backend}/users/invites`)
    return response.stations.map(station => {
      return convertToBusinessStation(station);
    })
  }
}
