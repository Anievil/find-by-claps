import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {
  RewardedAd,
  TestIds,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import * as amplitude from '@amplitude/analytics-react-native';
import {useRoute} from '@react-navigation/native';

import {StyledView, StyledText} from '../../styles';
import {isTest, rewardBiddingId} from '../../constants/adConstants';

import ICCheck from '../../../assets/icons/check.svg';
import I18n from '../../Localization/i18n';
import ICAd from '../../../assets/icons/AD.svg';

const adUnitId = isTest ? TestIds.REWARDED : rewardBiddingId;
const rewarded = RewardedAd.createForAdRequest(adUnitId);

const LongBurronWithCheck = ({
  onPress,
  Icon,
  url,
  title,
  isActive,
  isBlocked,
  stopMusic,
  name,
  blockAllAd
}) => {
  useEffect(() => {
    rewarded.removeAllListeners();
    rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      rewarded.load();
    });
  }, [rewarded, title, name, onPress]);

  rewarded.load();

  const route = useRoute();
  const onPressBtn = useCallback(() => {
    stopMusic();
    if (isBlocked && !blockAllAd) {
      if (rewarded.loaded) {
        rewarded.show();
        const rewardedEarned = rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            rewarded.load();
            setTimeout(() => onPress(name || title, url), 1000);

            rewardedEarned();
          },
        );
        const rewardedClosed = rewarded.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            amplitude.track(`Watch rewarded ad`, {
              screen: 'Main Menu',
              more: `Watched rewarded ad after press ${name || title}`,
            });

            rewardedClosed();
          },
        );
      }
    } else {
      onPress(name || title, url);
    }
  }, [rewarded, name, url, title, route.name, isBlocked, rewarded.loaded]);

  return (
    <TouchableOpacity onPress={onPressBtn}>
      <StyledView
        flexDirection="row"
        mt="8px"
        mp="4px"
        backgroundColor="#23355F"
        height="56px"
        ph="16"
        br="8px"
        justifyContent="space-between"
        alignItems="center">
        <StyledView flexDirection="row">
          {Icon && <Icon />}
          <StyledText
            ml="21px"
            color="white"
            fontfamily="Montserrat-Medium"
            fontSize="20px"
            numberOfLines={1}
            lineHeight="24.38px">
            {name || I18n.t(title)}
          </StyledText>
        </StyledView>
        {isActive && <ICCheck />}
        {!isActive && isBlocked && !blockAllAd && <ICAd />}
      </StyledView>
    </TouchableOpacity>
  );
};

export default LongBurronWithCheck;
