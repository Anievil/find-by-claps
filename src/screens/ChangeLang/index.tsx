import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {FlatList} from 'react-native-gesture-handler';
import * as amplitude from '@amplitude/analytics-react-native';
import {useNetInfo} from "@react-native-community/netinfo";

import {StyledView, StyledText} from '../../styles';
import {LangButton} from '../../components';
import I18n from '../../Localization/i18n';
import {interstitialBiddingId, isTest} from '../../constants/adConstants';

import ICRightArrow from '../../../assets/icons/rightArrow.svg';
import IcEng from '../../../assets/icons/eng.svg';
import IcRu from '../../../assets/icons/ru.svg';
import IcAr from '../../../assets/icons/ar.svg';
import IcEs from '../../../assets/icons/es.svg';
import IcFr from '../../../assets/icons/fr.svg';
import IcDe from '../../../assets/icons/de.svg';
import IcHi from '../../../assets/icons/hi.svg';
import IcId from '../../../assets/icons/id.svg';
import IcKo from '../../../assets/icons/ko.svg';
import IcPt from '../../../assets/icons/pt.svg';
import useCheckAdRemove from '../../hooks/useCheckAdRemove';

const countryFlag = {
  en: IcEng,
  ru: IcRu,
  ar: IcAr,
  es: IcEs,
  fr: IcFr,
  de: IcDe,
  hi: IcHi,
  id: IcId,
  ko: IcKo,
  pt: IcPt,
};

const adUnitId = isTest ? TestIds.INTERSTITIAL : interstitialBiddingId;
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const ChangeLang = () => {
  const [currentLang, setCurrentLang] = useState(I18n.locale);
  const netInfo = useNetInfo();

  useEffect(() => {
    interstitial.load();
  }, [interstitial]);

  const {wachedNoAdsVideo, blockAllAd} = useCheckAdRemove()


  const langList = useMemo(() => {
    return Object.keys(I18n.translations);
  }, []);
  const navigation = useNavigation();
  const setLang = useCallback(async langCode => {
    setCurrentLang(langCode);
    I18n.locale = langCode;
    await AsyncStorage.setItem('@lang', langCode);
  }, []);

  const onPressButtonNext = useCallback(async () => {
    const value = await AsyncStorage.getItem('IsTutorialEnd');
    if (value) {
      if(!wachedNoAdsVideo && !blockAllAd && netInfo.isConnected){
        interstitial.show();
        
        interstitial.addAdEventListener(AdEventType.ERROR, () => {

          amplitude.track('Go back', {
            screen: 'Language',
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
            screen: 'Language',
          });
          amplitude.track('Go back', {
            screen: 'Language',
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
          screen: 'Language',
          navigationOn: 'Go back on "Main Menu" screen',
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'MainMenu'}],
        });
      }
    } else {
      amplitude.track('Set language in first open', {
        screen: 'Language',
        navigationOn: 'Go on intro "How it work" screen',
      });
      navigation.navigate('HowItWork');
    }
  }, [wachedNoAdsVideo, netInfo.isConnected, blockAllAd]);

  const renderLang = useCallback(
    ({item}) => (
      <LangButton
        onPress={setLang}
        Icon={countryFlag[item]}
        LangName={I18n.t(item)}
        langCode={item}
        currentLang={currentLang}
      />
    ),
    [currentLang],
  );

  return (
    <StyledView mt="8px" mb="4px" ph={'16px'} flex={1}>
      <StatusBar backgroundColor={'#716BFA'} />
      <StyledView
        height="56px"
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between">
        <StyledText
          fontSize={'20px'}
          fontFamily="Montserrat-Medium"
          color="white">
          {I18n.t('selectLang')}
        </StyledText>
        <TouchableOpacity onPress={onPressButtonNext}>
          <ICRightArrow />
        </TouchableOpacity>
      </StyledView>
      {langList && (
        <FlatList
          keyExtractor={item => item}
          data={langList}
          renderItem={renderLang}
        />
      )}
    </StyledView>
  );
};

export default ChangeLang;
