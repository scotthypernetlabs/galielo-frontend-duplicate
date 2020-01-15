// import { IOffer } from '../business/objects/offers';
// import { IFilterState } from '../business/objects/filter';
// import { Dictionary } from '../business/objects/dictionary';
// import { IMachine } from '../business/objects/machine';
// import { logService } from '../components/Logger';
//
// export const filterOfferSelector = (offers: IndividualOffer[], machines: Dictionary<IMachine>, filters: IFilterState):IndividualOffer[] => {
//   let results = manualFilters(offers, filters);
//   return results;
// }
//
// const serverFilters = (offers: IndividualOffer[], filters: IFilterState) => {
//   return new Promise((resolve, reject) => {
//     // make request to backend to get offers with all filters, then resolve
//
//   })
// }
//
// const manualFilters = (offers: IndividualOffer[], filters: IFilterState) => {
//   // return new Promise((resolve, reject) => {
//       return offers.filter(offer => parseInt(offer.machine.memory) >= filters.ram * 1e9);
//       // resolve(offers);
//   // })
// }
//
// export const convertOffersToIndividualMachines = (offers: IOffer[], machines: Dictionary<IMachine>):IndividualOffer[] => {
//   let results:IndividualOffer[] = [];
//   logService.log(offers);
//   offers.forEach(offer => {
//     if(!offer.offer_machines){
//       return;
//     }
//     offer.offer_machines.forEach(mid => {
//       let machine = machines[mid];
//       if(machine){
//         let individualOffer = new IndividualOffer(machine, offer);
//         results.push(individualOffer);
//       }
//     })
//   })
//   return results;
// }
//
// export class IndividualOffer {
//   constructor(public machine: IMachine, public offer: IOffer){
//
//   }
// }
