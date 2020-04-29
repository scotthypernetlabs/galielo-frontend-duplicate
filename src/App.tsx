import * as React from 'react';
import SideBar from './components/SideBar';
import Modal from './components/Modals/Modal';
import { logService } from './components/Logger';

import MainLayout from './layouts/MainLayout';

type Props = {

};

type State = {

}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    logService.log("Log App Render");
    return (
      <div className="app">
        <div className="main">
          <Modal />
          <SideBar />
          <MainLayout />
        </div>
      </div>
    )
  }
}

export default App;
