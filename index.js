/**
 * @format
 */
import './src/app/extensions/number.extension';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import AnalyticsManager from './src/app/services/AnalyticsManager';
import initializeDb from './src/database';
AnalyticsManager.initialize();
AnalyticsManager.startTimeTrack('TimeToInteract');
const App = require('./App'); //this is needed here.

initializeDb();

require('@/src/app/startup');

AppRegistry.registerComponent(appName, () => App.default);
