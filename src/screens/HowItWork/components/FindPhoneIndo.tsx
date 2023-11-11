import React from 'react';

import {StyledText, StyledImage, StyledView} from '../../../styles';
import I18n from '../../../Localization/i18n';

const FindPhoneInfo = () => {
  return (
    <StyledView mt="28px" mb="46px" alignItems="center">
      <StyledImage
        source={require('../../../../assets/images/Find.png')}
        height={280}
        width={280}
      />
      <StyledText
        mt="40px"
        mb="20px"
        alignText="center"
        fontFamily="Montserrat-SemiBold"
        fontSize="32px"
        color="white">
        {I18n.t('howItWork_findTitle')}
      </StyledText>
      <StyledText
        alignText="center"
        fontSize="14px"
        fontFamily="Montserrat-Regular"
        color="white">
        {I18n.t('howItWork_findDesc')}
      </StyledText>
    </StyledView>
  );
};

export default FindPhoneInfo;
