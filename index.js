/**
 * @format
 */

import {AppRegistry} from 'react-native';
import * as amplitude from '@amplitude/analytics-react-native';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { Settings } from 'react-native-fbsdk-next';

import App from './App';
import {name as appName} from './app.json';

// Ask for consent first if necessary
// Possibly only do this for iOS if no need to handle a GDPR-type flow
Settings.setAppID('2463371540509941');
Settings.initializeSDK();
Settings.setAutoLogAppEventsEnabled(true)

OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize("ba74ef6d-d62d-4abb-b97c-bea17e545862");
OneSignal.login("1");


amplitude.init('86723344e9f759a0c7c2789c4660de33');

AppRegistry.registerComponent(appName, () => App);
