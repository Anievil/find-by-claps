import React from 'react';

import {StyledText, StyledImage, StyledView} from '../../../styles';
import I18n from '../../../Localization/i18n';

const FlashInfo = () => {
  return (
    <StyledView mt="28px" mb="46px" alignItems="center">
      <StyledImage
        source={require('../../../../assets/images/Flashlight.png')}
        height={280}
        width={280}
      />
      <StyledText
        mt="40px"
        mb="20px"
        alignText="center"
        fontSize="32px"
        fontFamily="Montserrat-SemiBold"
        color="white">
        {I18n.t('howItWork_flashTitle')}
      </StyledText>
      <StyledText
        alignText="center"
        fontSize="14px"
        fontFamily="Montserrat-Regular"
        color="white">
        {I18n.t('howItWork_flashDesc')}
      </StyledText>
    </StyledView>
  );
};

export default FlashInfo;
