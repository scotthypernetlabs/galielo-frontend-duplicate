import React from 'react';
import ReactDOM from 'react-dom';
import GalileoFrontend from './galileo';
import { SettingsRepository } from './implementations/settingsRepository';
import { AuthService } from './utils/auth-service';
import store from './store/store';
import './index.scss';
import 'antd/dist/antd.css';
import { BrowserRouter as Router } from 'react-router-dom';

export const settings = new SettingsRepository();
export const auth_service = new AuthService(settings);

ReactDOM.render(<GalileoFrontend router={Router} auth={auth_service} settings={settings}/>,document.getElementById("root"));
