import React from 'react';
import {StatusBar} from 'react-native';
import {Bar} from 'react-native-progress';

import {StyledImage, StyledText, StyledView} from '../../styles';
import I18n from '../../Localization/i18n';

const LoadScreen = () => {
  return (
    <StyledView flex={1} backgroundColor="#1B242D" alignItems="center">
      <StatusBar backgroundColor={'#716BFA'} />
      <StyledImage
        source={require('../../../assets/images/LoadLogo.png')}
        height={426}
        width={280}
      />
      <StyledText
        mt="54px"
        mb="4px"
        color="#fff"
        fontFamily="Montserrat-SemiBold"
        fontSize="32px"
        textAlign="center"
        lineHeight="39.01px">
        {I18n.t('phoneFinder')}
      </StyledText>
      <StyledText
        mb="32px"
        color="#fff"
        fontFamily="Montserrat-Regular"
        fontSize="14px"
        textAlign="center"
        lineHeight="17.07px">
        {I18n.t('phoneSearch')}
      </StyledText>
      <Bar
        indeterminate
        indeterminateAnimationDuration={2000}
        width={260}
        borderWidth={0}
        color="#4E48EC"
        unfilledColor="#D9D9D9"
        height={4}
        borderRadius={2}
      />
      <StyledView justifyContent="flex-end" flex={1}>
        <StyledText
          color="#fff"
          mb="32px"
          textAlign="center"
          fontFamily="Montserrat-Regular"
          fontSize="10px"
          lineHeight="12.19px">
          {I18n.t('advertising')}
        </StyledText>
      </StyledView>
    </StyledView>
  );
};

export default LoadScreen;
