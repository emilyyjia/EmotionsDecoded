/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {RNCamera} from 'react-native-camera';

var Camera = require("react-native-camera");

AppRegistry.registerComponent(appName, () => App);
