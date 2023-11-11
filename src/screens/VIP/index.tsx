import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, StatusBar} from 'react-native';
import {getProducts, requestPurchase} from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as amplitude from '@amplitude/analytics-react-native';

import {TextWithCheck, Button} from '../../components';
import {StyledView, StyledText} from '../../styles';
import I18n from '../../Localization/i18n';

import ICClose from '../../../assets/icons/close.svg';
import ICBolckAD from '../../../assets/icons/blockAD.svg';

const VIP = ({navigation, route}) => {
  const [price, setPrice] = useState('')
  const params = useMemo(() => route?.params, [route?.params]);
  const closeVip = useCallback(() => {
    if (params?.backRoute) {
      navigation.navigate(params?.backRoute);
    }
  }, [params?.backRoute]);

  useEffect(() => {
    const getPrice =async () => {
      const result = await getProducts({skus: ['no_ads']});
      setPrice(result[0].localizedPrice)
    }
    getPrice()
  }, [])

  const buyNoAds = useCallback(async () => {
    try {
      amplitude.track('Press on buy button');
      await requestPurchase({
        skus: ['no_ads'],
      })
      .then(async () => {
        amplitude.track('Success payment');
        await AsyncStorage.setItem('blockAllAd', 'true');
        navigation.reset({
          index: 0,
          routes: [{name: 'MainMenu'}],
        });
      })
      .catch(async(error) => {
        amplitude.track('Close or error with payment', {
          error: error?.message,
          error_code: error?.code,
        });
      });
    } catch (err) {
      console.warn(err, err.message);
    }
  }, []);

  return (
    <StyledView justifyContent="center" alignItems="center" flex={1}>
      <StatusBar backgroundColor={'#716BFA'} />
      <StyledView
        mh="16px"
        pt="12px"
        pr="12px"
        pb="20px"
        pl="20px"
        br="28px"
        width="328px"
        backgroundColor="#23355F">
        <TouchableOpacity onPress={closeVip} style={{alignSelf: 'flex-end'}}>
          <ICClose />
        </TouchableOpacity>
        <StyledText
          color="#fff"
          mr="24px"
          alignSelf={'flex-end'}
          fontSize="32px"
          lineHeight="39.01px"
          fontFamily="Montserrat-SemiBold">
          {I18n.t('findMyPhone')}
        </StyledText>
        <ICBolckAD marginTop={38} marginBottom={32} alignSelf="center" />
        <TextWithCheck title="noAdvertising" />
        <TextWithCheck title="unlimitedContent" />
        <TextWithCheck title="rangeOfVisual" />
        <StyledView alignItems="center" mt="32px">
          <Button title={price} onPress={buyNoAds} />
        </StyledView>
      </StyledView>
      <StyledView mt="32px" ph="30px">
        <StyledText
          textAlign="center"
          fontFamily="Montserrat-Regular"
          fontSize="10px"
          lineHeight="12.19px"
          color="#F2DD2D">
          {I18n.t('warning')}
        </StyledText>
        <StyledText
          textAlign="center"
          fontFamily="Montserrat-Regular"
          fontSize="10px"
          lineHeight="12.19px"
          color="#fff"
          mt="12px">
          {I18n.t('warning2')}
        </StyledText>
      </StyledView>
    </StyledView>
  );
};

export default VIP;
