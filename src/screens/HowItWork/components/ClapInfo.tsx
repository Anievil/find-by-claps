import React from 'react';

import {StyledText, StyledImage, StyledView} from '../../../styles';
import I18n from '../../../Localization/i18n';

const ClapInfo = ({icon, title, desc}) => {
  return (
    <StyledView mt="28px" mb="46px" alignItems="center">
      <StyledImage
        source={icon}
        height={280}
        width={280}
      />
      <StyledText
        mt="40px"
        mb="20px"
        alignText="center"
        textAlign='center'
        fontFamily="Montserrat-SemiBold"
        fontSize="32px"
        color="white">
        {I18n.t(title)}
      </StyledText>
      <StyledText
        alignText="center"
        fontFamily="Montserrat-Regular"
        fontSize="14px"
        textAlign='center'
        color="white">
        {I18n.t(desc)}
      </StyledText>
    </StyledView>
  );
};

export default ClapInfo;
