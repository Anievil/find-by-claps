import React, {useEffect, useRef, useState} from 'react';
import {StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import NativeAdView from 'react-native-admob-native-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StartButton,
  LongButtonWithSwitch,
  AdBannerComponent,
} from '../../components';
import {StyledView} from '../../styles/index';
import {isTest, nativeBannerBiddingId} from '../../constants/adConstants';

import ICFlash from '../../../assets/icons/flash.svg';
import ICSound from '../../../assets/icons/sound.svg';
import ICSmile from '../../../assets/icons/smile.svg';
import ICMelody from '../../../assets/icons/melody.svg';
import ICVibration from '../../../assets/icons/vibration.svg';
import useCheckAdRemove from '../../hooks/useCheckAdRemove';

const MainMenu = () => {
  const [isDetectingActive, setIsDetectingActive] = useState(false);
  const {wachedNoAdsVideo, blockAllAd} = useCheckAdRemove();
  const nativeAdViewRef = useRef();
  React.useEffect(() => {
    nativeAdViewRef.current?.loadAd();
  }, []);
  console.log(nativeAdViewRef.current)
  const settings = useSelector(
    ({mainFunctionalReduser}) => mainFunctionalReduser.settings,
  );
  const blocked = useSelector(
    ({mainFunctionalReduser}) => mainFunctionalReduser.blocked,
  );
  const {isvibration, isflashlight, ismelody} = settings;

  return (
    <StyledView flex={1}>
      <NativeAdView
        ref={nativeAdViewRef}
        adUnitID={nativeBannerBiddingId}>
        <StyledView height="50px" mt="10px" backgroundColor='green' />
      </NativeAdView>
      {/* <ScrollView>
      <StatusBar backgroundColor={'#716BFA'} />
      <StartButton setIsDetectingActive={setIsDetectingActive} />
      <LongButtonWithSwitch
        Icon={ICSound}
        title={'soundForSearch'}
        isSwitch={false}
        isAddBtn={false}
        isBtnActive={true}
        isLink={true}
      />
      <LongButtonWithSwitch
        Icon={ICSmile}
        title={'soundOfFrolic'}
        isSwitch={false}
        isAddBtn={false}
        isBtnActive={true}
        isLink={true}
      />
      <LongButtonWithSwitch
        Icon={ICMelody}
        title={'melody'}
        isSwitch={true}
        isAddBtn={false}
        isBtnActive={ismelody}
        isBlocked={isDetectingActive}
      />
      <LongButtonWithSwitch
        Icon={ICVibration}
        title={'vibration'}
        isSwitch={true}
        isAddBtn={blocked.vibration}
        isBtnActive={isvibration}
        isBlocked={isDetectingActive}
        blockAllAd={blockAllAd}
      />
      <LongButtonWithSwitch
        Icon={ICFlash}
        title={'flashlight'}
        isSwitch={true}
        isAddBtn={blocked.flashlight}
        isBtnActive={isflashlight}
        isBlocked={isDetectingActive}
        blockAllAd={blockAllAd}
      />
      </ScrollView>
      <AdBannerComponent isAdShow={!wachedNoAdsVideo && !blockAllAd} /> */}
    </StyledView>
  );
};

export default MainMenu;
