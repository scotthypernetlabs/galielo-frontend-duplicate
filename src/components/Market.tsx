import * as React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../business/objects/store';
import { IMachineState } from '../business/objects/machine';
import { IUser } from '../business/objects/user';
import { Dispatch } from 'redux';
import { openModal, openNotificationModal, IOpenNotificationModal, IOpenModal } from '../actions/modalActions';
import OfferFilter from './Filters/OfferFilter';
import { convertOffersToIndividualMachines, IndividualOffer, filterOfferSelector } from '../reducers/filterSelector';
import { context } from '../context';
import { MyContext } from '../MyContext';
import { History } from 'history';

type Props = {
  history: History;
  state: IStore;
  offers: IndividualOffer[];
  machines: IMachineState;
  currentUser: IUser;
  openNotificationModal: (text: string) => IOpenNotificationModal;
  openOfferModal: () => IOpenModal;
  openStakeModal: () => IOpenModal;
  openBuyModal: (offerid: string) => IOpenNotificationModal;
}

type State = {

}

class Market extends React.Component<Props, State>{
  context!: MyContext;
  constructor(props: Props) {
    super(props);
    this.stakeTokens = this.stakeTokens.bind(this);
    this.createOffer = this.createOffer.bind(this);
  }
  public componentDidMount() {
    this.context.offerService.updateOffers();
  }
  public async checkLogin(){
    let loggedIn = await this.context.userStateRepository.loggedIn();
    let hasWallet = await this.context.userStateRepository.hasWallet();
    if(!loggedIn){
      this.props.history.push('./login');
      return false;
    }else if(!hasWallet){
      this.props.openNotificationModal("Please install the Hypernet Agent and set up a wallet to use this function.")
      return false;
    }else{
      return true;
    }
  }

  public async stakeTokens(){
    if(this.checkLogin()){
      this.props.openStakeModal();
    }
  }

  public async createOffer(){
    if(this.checkLogin()){
      this.props.openOfferModal();
    }
  }
  public openBuyModal(offer_id: string, machine_id: string){
    return(e:any) => {
      if(this.checkLogin()){
        this.props.openBuyModal(`${offer_id},${machine_id}`)
      }
    }
  }
  public deleteOffer(offer_id:string){
    return(e:any) => {
      this.context.providerRepository.deleteOffer(offer_id);
    }
  }
  public render() {
    const { offers, currentUser } = this.props;
    return (
      <div className="marketplace-container">
        <div className="stations-header">
          <h3>Marketplace</h3>
        </div>
        <div>
        <button className="user-search">
            <div className="user-search-inner">
            <input
              className="user-search-input"
              type="text"
              placeholder="Search goes here"
              />
            </div>
          </button>
          <OfferFilter />
        </div>
        <div className="market-list">
          {
            offers.map((offer:IndividualOffer, idx: number) => {
              return (
                <div key={idx} className="offer-container flex-column">
                  <div> {offer.offer.username} </div>
                  <div className="machine-name">{offer.machine.machine_name}</div>
                  <div className="flex-row">
                    <div>{(parseInt(offer.machine.memory) / 1e9).toFixed(1)} GB</div>
                  </div>
                  <div className="flex-row space-between">
                    <div>{offer.offer.rate} tokens / {offer.offer.pay_interval} seconds</div>
                    <div>Status: {offer.offer.status}</div>
                    {
                      offer.offer.username === currentUser.username ?
                      <div>
                        <button className="primary-btn" onClick={this.deleteOffer(offer.offer.offerid)}> Delete </button>
                      </div>
                      :
                      <div className="flex-row">
                      <button className="primary-btn" onClick={this.openBuyModal(offer.offer.offerid, offer.machine.mid)}>Buy</button>
                      </div>
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <button onClick={this.stakeTokens}>
          Stake Tokens
        </button>
        <button onClick={this.createOffer}>
          Create Offer
        </button>
      </div>
    )
  }
}

Market.contextType = context;

const mapStateToProps = (state: IStore) => ({
  state: state,
  offers: filterOfferSelector(convertOffersToIndividualMachines(state.offers.offers, state.machines.machines), state.machines.machines, state.filter),
  machines: state.machines,
  currentUser: state.users.currentUser
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openStakeModal: () => dispatch(openModal("Stake")),
  openOfferModal: () => dispatch(openModal("Offer")),
  openBuyModal: (offerid: string) => dispatch(openNotificationModal("Buy", offerid)),
  openNotificationModal: (text: string) => dispatch(openNotificationModal("Notifications", text))
})

export default connect(mapStateToProps, mapDispatchToProps)(Market);
