import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import * as amplitude from '@amplitude/analytics-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';

import {StyledView, StyledText} from '../../styles';
import I18n from '../../Localization/i18n';
import {interstitialBiddingId, isTest} from '../../constants/adConstants';

import ICNoAdd from '../../../assets/icons/noAdd.svg';
import IcMenu from '../../../assets/icons/menu.svg';
import ICBack from '../../../assets/icons/back.svg';
import useCheckAdRemove from '../../hooks/useCheckAdRemove';

const adUnitId = isTest ? TestIds.INTERSTITIAL : interstitialBiddingId;
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const CustomMainMenuHeader = ({navigation, route, options, stopMusic}) => {
  const netInfo = useNetInfo();

  useEffect(() => {
    interstitial.load();
  }, [interstitial]);

  const {wachedNoAdsVideo, blockAllAd} = useCheckAdRemove();

  const isMainMenu = useMemo(() => {
    return route.name === 'MainMenu';
  }, [route?.name]);

  const onMenuPress = useCallback(() => {
    if (isMainMenu) {
      navigation.openDrawer();
    } else {
      if (stopMusic) {
        stopMusic();
      }
      if (!wachedNoAdsVideo && !blockAllAd && netInfo.isConnected) {
        interstitial.show();

        interstitial.addAdEventListener(AdEventType.ERROR, () => {
          amplitude.track('Go back', {
            screen: route.name,
            navigationOn: 'Go back on "Main Menu" screen',
          });
          navigation.reset({
            index: 0,
            routes: [{name: 'MainMenu'}],
          });
          interstitial.removeAllListeners();
        });
        interstitial.addAdEventListener(AdEventType.CLOSED, () => {
          amplitude.track('Watch interstitial', {
            action: 'go back button press',
            screen: route.name,
          });
          amplitude.track('Go back', {
            screen: route.name,
            navigationOn: 'Go back on "Main Menu" screen',
          });
          navigation.reset({
            index: 0,
            routes: [{name: 'MainMenu'}],
          });
          interstitial.removeAllListeners();
        });
      } else {
        amplitude.track('Go back', {
          screen: route.name,
          navigationOn: 'Go back on "Main Menu" screen',
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'MainMenu'}],
        });
      }
    }
  }, [
    isMainMenu,
    stopMusic,
    interstitial,
    wachedNoAdsVideo,
    blockAllAd,
    netInfo.isConnected,
  ]);
  const onNoAddPress = useCallback(() => {
    navigation.navigate('VIP', {backRoute: route.name});
  }, [route.name]);

  return (
    <StyledView
      padding="16px"
      flexDirection="row"
      justifyContent="space-between">
      <StyledView flexDirection="row">
        <TouchableOpacity onPress={onMenuPress}>
          {isMainMenu ? <IcMenu /> : <ICBack />}
        </TouchableOpacity>
        <StyledText
          ml="32px"
          fontSize="20px"
          color="white"
          lineHeight="24.38px"
          fontFamily="Montserrat-Medium">
          {I18n.t(options?.title || route.name)}
        </StyledText>
      </StyledView>
      {!blockAllAd && (
        <TouchableOpacity onPress={onNoAddPress}>
          <ICNoAdd />
        </TouchableOpacity>
      )}
    </StyledView>
  );
};

export default CustomMainMenuHeader;
