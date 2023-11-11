import 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {AppOpenAd, TestIds, AdEventType} from 'react-native-google-mobile-ads';
import * as amplitude from '@amplitude/analytics-react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import Tenjin from 'react-native-tenjin';
import {
  initConnection,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';

import {Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {persistor, store} from './src/redux/persistor';
import {
  MainMenu,
  ChangeLang,
  HowItWork,
  VIP,
  SoundFor,
  PermissionScreen,
  LoadScreen,
  Settings,
  HowItWorkInApp,
} from './src/screens';
import {CustomDrawerContent, CustomMainMenuHeader} from './src/components';
import {openAppId, isTest} from './src/constants/adConstants';
import useCheckAdRemove from './src/hooks/useCheckAdRemove';

const Drawer = createDrawerNavigator();

const adUnitId = isTest ? TestIds.APP_OPEN : openAppId;
const appOpenAd = AppOpenAd.createForAdRequest(adUnitId);

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#1B242D',
    text: '#fff',
  },
};

function App() {
  const [initialised, setInitialised] = useState(false);
  const [initialRoute, setInitialRoute] = useState('AuthChoice');
  const {wachedNoAdsVideo, blockAllAd} = useCheckAdRemove();
  const netInfo = useNetInfo();

  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = await firestore()
        .collection('two_rewards_ad')
        .doc('ads')
        .get();
      await AsyncStorage.setItem(
        'countOfREwards',
        usersCollection.data()?.count_of_rewards.toString(),
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    Tenjin.initialize('6C8CHBXN2X2AJCIZRMMNAXGH8YA6JY87');
    Tenjin.connect();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        initConnection().then(() => {
          // we make sure that "ghost" pending payment are removed
          // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
          flushFailedPurchasesCachedAsPendingAndroid();
        });
      } catch (error) {
        console.error('Error occurred during initilization', error.message);
      }
    };
    init();
    return () => {
      endConnection();
    };
  }, []);

  useEffect(() => {
    if (
      !blockAllAd &&
      blockAllAd != undefined &&
      !wachedNoAdsVideo &&
      wachedNoAdsVideo != undefined &&
      typeof wachedNoAdsVideo !== typeof null
    ) {
      appOpenAd.load();
      appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        appOpenAd.show();
        setInitialised(true);
      });
      appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
        setInitialised(true);
        appOpenAd.removeAllListeners();
      });
      appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
        const navigationOnText =
          initialRoute === 'HowItWork'
            ? 'Go on intro "How it work" screen'
            : 'Go on set "Language" screen';
        amplitude.track('Watch Open-app ad', {
          ads: 'Open-app ad',
          screen: 'Open-app ad loader',
          navigationOn: navigationOnText,
        });
        appOpenAd.removeAllListeners();
      });
    } else if (wachedNoAdsVideo === true || blockAllAd === true) {
      setInitialised(true);
    }
  }, [wachedNoAdsVideo, netInfo.isConnected, blockAllAd]);

  useEffect(() => {
    async function getStorageValue() {
      let value;
      try {
        value = await AsyncStorage.getItem('IsTutorialEnd');
      } catch (e) {
        // handle here
      } finally {
        if (value === 'true') {
          setInitialRoute('HowItWork');
        } else {
          setInitialRoute('ChangeLang');
        }
      }
    }
    getStorageValue();
  }, []);

  return initialised ? <Router initialRoute={initialRoute} /> : <LoadScreen />;
}

const Router = ({initialRoute}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer theme={MyTheme}>
          <Drawer.Navigator
            screenOptions={{
              swipeEnabled: false,
              headerShown: false,
              headerStyle: {
                backgroundColor: '#1B242D',
                elevation: 0,
                height: 56,
              },
              headerTintColor: '#fff',
              drawerStyle: {
                width: Dimensions.get('window').width / 1.18,
              },
              header: ({navigation, route, options}) => (
                <CustomMainMenuHeader
                  navigation={navigation}
                  route={route}
                  options={options}
                />
              ),
            }}
            initialRouteName={"MainMenu"}
            drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen
              name="MainMenu"
              component={MainMenu}
              options={{headerShown: true, title: 'findMyPhone'}}
            />
            <Drawer.Screen name="ChangeLang" component={ChangeLang} />
            <Drawer.Screen name="HowItWork" component={HowItWork} />
            <Drawer.Screen name="VIP" component={VIP} />
            <Drawer.Screen
              name="MicroPermissionScreen"
              component={PermissionScreen}
            />
            <Drawer.Screen
              name="NotifiPermissionScreen"
              component={PermissionScreen}
            />
            <Drawer.Screen
              name="HowItWorkInApp"
              component={HowItWorkInApp}
              options={{headerShown: true, title: 'howItWork'}}
            />
            <Drawer.Screen
              name="soundForSearch"
              component={SoundFor}
              options={{title: 'soundForSearch'}}
            />
            <Drawer.Screen
              name="Settings"
              component={Settings}
              options={{headerShown: true, title: 'settings'}}
            />
            <Drawer.Screen
              name="soundOfFrolic"
              component={SoundFor}
              options={{title: 'soundOfFrolic'}}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
