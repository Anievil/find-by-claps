import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as amplitude from '@amplitude/analytics-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';

import {StyledView, StyledText} from '../../styles';
import {TouchableOpacity, Switch} from 'react-native';
import I18n from '../../Localization/i18n';

import ICAD from '../../../assets/icons/AD.svg';
import {useDispatch} from 'react-redux';
import {removeBlocked, setSettings} from '../../actions/actions';
import {isTest, rewardBiddingId} from '../../constants/adConstants';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

const adUnitId = isTest ? TestIds.REWARDED : rewardBiddingId;
const rewarded = RewardedAd.createForAdRequest(adUnitId);

const LongButtonWithSwitch = ({
  Icon,
  title,
  isSwitch,
  isAddBtn,
  isBtnActive,
  isLink,
  onPress,
  isBlocked,
  blockAllAd,
}) => {
  const [isActive, setIsActive] = useState(isBtnActive);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const isPermissions = useMemo(
    () => route.name.includes('Permission'),
    [route.name],
  );
  useEffect(() => {
    rewarded.removeAllListeners();
    rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      rewarded.load();
    });
  }, [rewarded]);

  rewarded.load();

  const onPressButton = useCallback(() => {
    if (title === 'soundForSearch' || title === 'soundOfFrolic') {
      navigation.navigate(title);
      const screenName =
        title === 'soundOfFrolic' ? 'Prank sounds' : 'Sound For Search';
      amplitude.track(`Go on ${screenName}`, {
        screen: 'Main Menu',
        navigationOn: `Go on "${screenName}" screen`,
      });
    }
    if (!isAddBtn && !isPermissions) {
      dispatch(setSettings({title: 'is' + title, value: !isActive}));
      setIsActive(!isActive);
    } else {
      if (rewarded.loaded && !blockAllAd) {
        rewarded.show();
        rewarded.load();
      }
      const rewardedEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          dispatch(removeBlocked(title));
          dispatch(setSettings({title: 'is' + title, value: !isActive}));
          setIsActive(!isActive);

          rewardedEarned();
        },
      );
      const rewardedClosed = rewarded.addAdEventListener(
        AdEventType.CLOSED,
        e => {
          amplitude.track(`Watch rewarded ad`, {
            screen: 'Main Menu',
            more: `Watched rewarded ad after press ${title}`,
          });

          rewardedClosed();
        },
      );
    }
  }, [isActive, isBtnActive, rewarded.loaded]);

  return (
    <TouchableOpacity onPress={onPress || onPressButton} disabled={isBlocked}>
      <StyledView
        mt="20px"
        br="8px"
        ph="16px"
        mh="16px"
        height="56px"
        backgroundColor={
          (isBtnActive && !isSwitch) || isLink ? '#4D53B1' : '#23355F'
        }
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <StyledView flexDirection="row" alignItems="center">
          {Icon && <Icon marginRight={21} style={{color: '#fff'}} />}
          <StyledText
            fontFamily="Montserrat-Medium"
            fontSize="20px"
            lineHeight="24.38px"
            color="white">
            {I18n.t(title)}
          </StyledText>
        </StyledView>
        {isSwitch && (!isAddBtn || blockAllAd) && (
          <Switch
            trackColor={{false: '#5C6A94', true: '#4D53B1'}}
            thumbColor={'#D8E2FF'}
            onValueChange={onPressButton}
            value={isPermissions ? isBtnActive : isActive}
            disabled
          />
        )}
        {(isAddBtn && !blockAllAd) && <ICAD />}
      </StyledView>
    </TouchableOpacity>
  );
};

export default LongButtonWithSwitch;
