/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {NetworkProvider} from 'react-native-offline';

AppRegistry.registerComponent(appName, () => App);
