import React from 'react';

import {StyledView, StyledText} from '../../styles';
import I18n from '../../Localization/i18n';

import IcCheck from '../../../assets/icons/check.svg';

const TextWithCheck = ({title}) => {
  return (
    <StyledView flexDirection="row" pl="12px">
      <IcCheck />
      <StyledText
        color="#fff"
        ml="20px"
        fontsize="14px"
        fontFamily="Montserrat-Regular"
        lineHeight="17.07px">
        {I18n.t(title)}
      </StyledText>
    </StyledView>
  );
};

export default TextWithCheck;
