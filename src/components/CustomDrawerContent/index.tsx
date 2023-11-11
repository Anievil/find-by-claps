import React, {useCallback, useEffect, useRef, useState} from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import * as amplitude from '@amplitude/analytics-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RewardedAd,
  TestIds,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

import {RateUsModal} from '..';
import {StyledText, StyledView} from '../../styles';
import I18n from '../../Localization/i18n';
import CustomDrawerItem from './CustomDrawerItem';
import {useNetInfo} from "@react-native-community/netinfo";

import ICSound from '../../../assets/icons/sound.svg';
import ICSmile from '../../../assets/icons/smile.svg';
import ICSetting from '../../../assets/icons/settings.svg';
import ICLang from '../../../assets/icons/lang.svg';
import ICInfo from '../../../assets/icons/info.svg';
import ICStar from '../../../assets/icons/star.svg';
import ICPolicy from '../../../assets/icons/policy.svg';
import NoAdsForRevardModal from '../NoAdsForRevardModal';
import useCheckAdRemove from '../../hooks/useCheckAdRemove';
import {isTest, rewardBiddingId} from '../../constants/adConstants';

const adUnitId = isTest ? TestIds.REWARDED : rewardBiddingId;

const CustomDrawerContent = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoAdsModalOpen, setIsNoAdsModalOpen] = useState(false);
  const [countOfRewards, setCountOfReward] = useState(2);
  const [ad, setAD] = useState([]);

  const netInfo = useNetInfo();
  const {blockAllAd, wachedNoAdsVideo} = useCheckAdRemove()

  useEffect(() => {
    const fetchData = async () => {
      const count = await AsyncStorage.getItem('countOfREwards');
      setCountOfReward(count);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (countOfRewards > ad.length) {
      setAD([])
      for (let i = 0; i < countOfRewards; i++) {
        if (countOfRewards > ad.length) {
          setAD(adArr => {
            const revardedAd = RewardedAd.createForAdRequest(adUnitId);
            revardedAd.load();
            adArr.push(revardedAd);
            return adArr;
          });
        }
      }
    }
  }, [countOfRewards]);

  useEffect(() => {
    if(ad?.length !== 0) {
      ad[0].addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('ewe')
        ad[0].removeAllListeners()
      })
    }
  }, [ad?.length])

  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
    props.navigation.closeDrawer();
  }, [isModalOpen]);

  useEffect(() => {
    if (netInfo.isConnected && !blockAllAd && !wachedNoAdsVideo) {
      setTimeout(() => {
        setIsNoAdsModalOpen(true);
      }, 60000);
    }
  }, [netInfo.isConnected, blockAllAd, wachedNoAdsVideo]);

  const toggleNoAdsModal = useCallback((isWached?: boolean) => {
    if (isNoAdsModalOpen) {
      setTimeout(() => {
        setIsNoAdsModalOpen(true);
      }, 120000);
    }
    if(!isWached){
      amplitude.track('Close "2 rewarded ad" modal');
    }
    setIsNoAdsModalOpen(false);
  }, [isNoAdsModalOpen]);

  const renderListItem = useCallback(
    ({title, Icon, key}) => (
      <StyledView key={key + Math.random().toString()}>
        <CustomDrawerItem
          title={title}
          Icon={Icon}
          keyItem={key}
          toggleModal={toggleModal}
        />
      </StyledView>
    ),
    [],
  );

  return (
    <>
      <DrawerContentScrollView {...props} style={{backgroundColor: '#23355F'}}>
        <StyledText
          color="white"
          fontFamily="Montserrat-Medium"
          fontSize="20px"
          lineHeight="24.38px"
          ph="16px"
          borderBottomWidth="1px"
          borderBottomColor="#475C8D"
          pb="20px"
          pt="36px"
          mb="8px">
          {I18n.t('findMyPhone')}
        </StyledText>
        {drawerItemsList.map(renderListItem)}
      </DrawerContentScrollView>
      {isModalOpen && (
        <RateUsModal isModalOpen={isModalOpen} toggleModal={toggleModal} />
      )}
      {isNoAdsModalOpen && !wachedNoAdsVideo && !blockAllAd && (
        <NoAdsForRevardModal
          isModalOpen={isNoAdsModalOpen}
          toggleModal={toggleNoAdsModal}
          ad={ad}
          countOfRewards={countOfRewards}
        />
      )}
    </>
  );
};

const drawerItemsList = [
  {
    title: 'soundForSearch',
    Icon: ICSound,
    key: 'soundForSearch',
  },
  {
    title: 'soundOfFrolic',
    Icon: ICSmile,
    key: 'soundOfFrolic',
  },
  {
    title: 'settings',
    Icon: ICSetting,
    key: 'Settings',
  },
  {
    title: 'language',
    Icon: ICLang,
    key: 'ChangeLang',
  },
  {},
  {
    title: 'howItWork',
    Icon: ICInfo,
    key: 'HowItWorkInApp',
  },
  {
    title: 'rateUs',
    Icon: ICStar,
    key: 'modal',
  },
  {
    title: 'policy',
    Icon: ICPolicy,
    key: 'policy',
  },
];

export default CustomDrawerContent;
