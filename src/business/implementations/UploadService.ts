// TODO: Finish refactor with redux. This file is currently not in use.

import { IUploadService } from "../interfaces/IUploadQueue";
import { Dictionary } from "../objects/dictionary";

export class UploadService implements IUploadService {
  public queue: Function[] = [];
  public totalQueued: number = 0;
  public totalFinished: number = 0;
  public running: boolean = false;
  // public componentsToUpdate: Dictionary<React.Component> = {};
  constructor(){

  }
  // Components that need to re-render based on changes in the Queue
  // bindComponent(component: React.Component, identity: string){
  //   this.componentsToUpdate[identity] = component;
  // }
  // Function to call the re-render on the components that need to be updated.
  // updateComponents(){
  //   Object.keys(this.componentsToUpdate).forEach((identity: string) => {
  //     this.componentsToUpdate[identity].forceUpdate();
  //   })
  // }
  // Component that was listening for updates to the queue will unmount
  // removeComponent(identity: string){
  //   delete this.componentsToUpdate[identity]
  // }
  addToQueue(callback: Function){
    this.queue.push(callback);
    this.totalQueued += 1;
    // this.updateComponents();
  }
  startQueue(){
    if(!this.running){
      this.running = true;
      this.startNext();
    }
  }
  async startNext(){
    if(this.length() > 0){
      let next = this.queue.shift();
      await next();
      this.totalFinished += 1;
      this.startNext();
      // this.updateComponents();
    }else{
      setTimeout(() => {
        this.totalQueued = 0;
        this.totalFinished = 0;
        this.running = false;
        // this.updateComponents();
      }, 3000);
    }
  }
  length(){
    return this.queue.length;
  }
}
