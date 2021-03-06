import React from 'react';
import ReactDOM from 'react-dom';
import GalileoFrontend from '../src/galileo';
import { SettingsRepository } from '../src/data/implementations/settingsRepository';
import 'antd/dist/antd.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { WebAuthService } from '../src/business/implementations/WebAuthService';

export const settings = new SettingsRepository();
export const auth_service = new WebAuthService(settings);

ReactDOM.render(<GalileoFrontend router={Router} auth={auth_service} settings={settings}/>,document.getElementById("root"));
