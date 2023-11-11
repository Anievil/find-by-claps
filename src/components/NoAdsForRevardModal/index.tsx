import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import {
  RewardedAd,
  TestIds,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import * as amplitude from '@amplitude/analytics-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import I18n from '../../Localization/i18n';
import Button from '../Button';
import {StyledText, StyledView} from '../../styles';
import {isTest, rewardBiddingId} from '../../constants/adConstants';

import ICWatch from '../../../assets/icons/watchADS.svg';
import ICClose from '../../../assets/icons/close.svg';
import ICNoASD from '../../../assets/icons/blockAD.svg';
import {useNavigation} from '@react-navigation/native';
import useCheckAdRemove from '../../hooks/useCheckAdRemove';

const adUnitId = isTest ? TestIds.REWARDED : rewardBiddingId;

const NoAdsForRevardModal = ({isModalOpen, toggleModal, ad, countOfRewards}) => {
  const {wachedNoAdsVideo, blockAllAd} = useCheckAdRemove();

  const navigation = useNavigation();
  const watchBtnText = useMemo(
    () =>
      I18n.t('watch') +
      ' (' +
      (wachedNoAdsVideo ? 2 : 0) +
      `/${countOfRewards})`,
    [wachedNoAdsVideo],
  );

  const onPressWatch = useCallback(() => {
    if (ad[0].loaded) {
      ad[0].show();
    }
    for (let i = 0; i <= ad.length - 1; i++) {
      ad[i].addAdEventListener(RewardedAdEventType.EARNED_REWARD, async() => {
        if (ad[i + 1]) {
          ad[i + 1].show();
        } else {
          amplitude.track('Watch 2 rewarded ad');
          await AsyncStorage.setItem(
            'wachedNoAdsVideoDate',
            JSON.stringify(new Date()),
          );
          toggleModal(true);
          navigation.reset({
            index: 0,
            routes: [{name: 'MainMenu'}],
          });
        }
        ad[i].removeAllListeners();
      });
    }
  }, [
    toggleModal,
    wachedNoAdsVideo,
    blockAllAd,
    ad[0]?.loaded,
  ]);

  return (
    <StyledView position="absolute" zIndex="999" width={'250%'} height="100%">
      <Modal
        animationType="slide"
        transparent={true}
        visible={!wachedNoAdsVideo && isModalOpen}
        onRequestClose={toggleModal}>
        <StyledView
          width="100%"
          height="100%"
          backgroundColor="rgba(0,0,0,.5)"
          ph="16"
          justifyContent="center">
          <StyledView
            br="28px"
            pr="8px"
            pl="16px"
            pt="12px"
            pb="20px"
            mixHeight="306px"
            maxHeight="346px"
            backgroundColor="#23355F"
            alignItems="center">
            <TouchableOpacity
              onPress={toggleModal}
              style={{alignSelf: 'flex-end'}}>
              <ICClose />
            </TouchableOpacity>
            <ICNoASD />
            <StyledText
              mv="32px"
              color="#fff"
              width="70%"
              textAlign="center"
              fonsFamily="Montserrat-Regular"
              fontSize="14px"
              lineHeight="17.07px">
              {I18n.t('noAds')}
            </StyledText>
            <Button
              title={watchBtnText}
              onPress={onPressWatch}
              Icon={ICWatch}
            />
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default NoAdsForRevardModal;
