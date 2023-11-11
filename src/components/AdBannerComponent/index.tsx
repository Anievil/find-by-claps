import React from 'react';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';
import NativeAdView from 'react-native-admob-native-ads';

import {StyledView} from '../../styles';
import {bannerBiddingId, isTest} from '../../constants/adConstants';

const adUnitId = isTest ? TestIds.BANNER : bannerBiddingId;

const AdBannerComponent = ({isAdShow}) => {
  return (
    <>
      {isAdShow && (
        <>
          <StyledView height="50px" mt="10px" />
          {/* <StyledView position="absolute" bottom="0" height="50px">
            <BannerAd size={BannerAdSize.FULL_BANNER} unitId={adUnitId} />
          </StyledView> */}
          <StyledView position="absolute" bottom="0">
            <NativeAdView adUnitID="ca-app-pub-3940256099942544/2247696110">
              <StyledView height="50px" mt="10px" backgroundColor='green' />
            </NativeAdView>
          </StyledView>
        </>
      )}
    </>
  );
};

export default AdBannerComponent;
