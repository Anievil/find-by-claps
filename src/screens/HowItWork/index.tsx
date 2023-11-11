import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StatusBar, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import * as amplitude from '@amplitude/analytics-react-native';
import {useNetInfo} from "@react-native-community/netinfo";

import I18n from '../../Localization/i18n';
import {StyledView} from '../../styles';
import {Button} from '../../components';

import ClapInfo from './components/ClapInfo';
import Tabs from './components/Tabs';
import {interstitialBiddingId, isTest} from '../../constants/adConstants';
import useCheckAdRemove from '../../hooks/useCheckAdRemove';

const Claps = require('../../../assets/images/Claps.png');
const Flash = require('../../../assets/images/Flashlight.png');
const Find = require('../../../assets/images/Find.png');

const adUnitId = isTest ? TestIds.INTERSTITIAL : interstitialBiddingId;
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const windowWidth = Dimensions.get('window').width;

const HowItWork = () => {
  const navigation = useNavigation();
  const [carousel, setCarousel] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const netInfo = useNetInfo();

  useEffect(() => {
    interstitial.load();
  }, [interstitial]);

  const {wachedNoAdsVideo, blockAllAd} = useCheckAdRemove()

  const navigateOnMainMenu = useCallback(async () => {
    if (activeTab < 2) {
      carousel?.snapToNext();
      setActiveTab(tabIndex => tabIndex + 1);
    } else if (activeTab === 2) {
      const value = await AsyncStorage.getItem('IsTutorialEnd');
      if (!wachedNoAdsVideo && !blockAllAd && netInfo.isConnected) {
        interstitial.show();
        interstitial.addAdEventListener(AdEventType.ERROR, () => {
          if (value) {
            amplitude.track('Lets start button', {
              screen: 'Intro How it work',
              navigationOn: 'Go on "Main Menu" screen',
            });
            navigation.reset({
              index: 0,
              routes: [{name: 'MainMenu'}],
            });
          } else {
            amplitude.track('Lets start button', {
              screen: 'Intro How it work',
              navigationOn: 'Go on "Notification permission" screen',
            });
            navigation.navigate('NotifiPermissionScreen');
          }
          interstitial.removeAllListeners();
        });
        interstitial.addAdEventListener(AdEventType.CLOSED, () => {
          amplitude.track('Watch interstitial ad after How it work', {
            screen: 'Intro How it work',
          });
          if (value) {
            amplitude.track('Lets start button', {
              screen: 'Intro How it work',
              navigationOn: 'Go on "Main Menu" screen',
            });
            navigation.reset({
              index: 0,
              routes: [{name: 'MainMenu'}],
            });
          } else {
            amplitude.track('Lets start button', {
              screen: 'Intro How it work',
              navigationOn: 'Go on "Notification permission" screen',
            });
            navigation.navigate('NotifiPermissionScreen');
          }
          interstitial.removeAllListeners();
        });
      } else {
        if (value) {
          amplitude.track('Lets start button', {
            screen: 'Intro How it work',
            navigationOn: 'Go on "Main Menu" screen',
          });
          navigation.reset({
            index: 0,
            routes: [{name: 'MainMenu'}],
          });
        } else {
          amplitude.track('Lets start button', {
            screen: 'Intro How it work',
            navigationOn: 'Go on "Notification permission" screen',
          });
          navigation.navigate('NotifiPermissionScreen');
        }
      }
    }
  }, [activeTab, carousel, wachedNoAdsVideo, netInfo.isConnected, blockAllAd]);

  const renderSlides = useCallback(
    ({item: {icon, title, desc}}) => (
      <ClapInfo icon={icon} title={title} desc={desc} />
    ),
    [activeTab, carousel],
  );

  return (
    <StyledView mt="8px" mb="4px" flex={1}>
      <StatusBar backgroundColor={'#716BFA'} />
      <StyledView height="430px">
        <Carousel
          ref={ref => {
            setCarousel(ref);
          }}
          sliderWidth={windowWidth}
          showsVerticalScrollIndicator={false}
          itemWidth={windowWidth}
          itemHeight={430}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          sliderHeight={430}
          data={tutorialSlides}
          keyExtractor={() => Math.random().toString()}
          onSnapToItem={index => setActiveTab(index)}
          renderItem={renderSlides}
          hasParallaxImages={true}
        />
      </StyledView>

      <StyledView justifyContent="center" alignItems="center">
        <Tabs activeTab={activeTab || 0} />
        <Button
          onPress={navigateOnMainMenu}
          title={activeTab < 2 ? I18n.t('next') : I18n.t('letsTry')}
        />
      </StyledView>
    </StyledView>
  );
};

export default HowItWork;

const tutorialSlides = [
  {
    icon: Claps,
    title: 'howItWork_clapsTitle',
    desc: 'howItWork_clapsDesc',
  },
  {
    icon: Flash,
    title: 'howItWork_flashTitle',
    desc: 'howItWork_flashDesc',
  },
  {
    icon: Find,
    title: 'howItWork_findTitle',
    desc: 'howItWork_findDesc',
  },
];
