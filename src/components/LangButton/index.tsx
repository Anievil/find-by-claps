import React, {useCallback} from 'react';

import {StyledView, StyledText} from '../../styles';
import {TouchableOpacity} from 'react-native';

const LangButton = ({Icon, LangName, onPress, langCode, currentLang}) => {
  const onPressButton = useCallback(() => {
    onPress(langCode);
  }, [langCode]);
  return (
    <TouchableOpacity onPress={onPressButton}>
      <StyledView
        mb='12px'
        alignItems="center"
        ph="16px"
        width={'100%'}
        height="56px"
        br="8px"
        backgroundColor={currentLang.includes(langCode) ? '#4D53B1' : '#23355F'}
        flexDirection="row">
        <Icon />
        <StyledText
          fontFamily="Montserrat-Medium"
          fontSize={'20px'}
          pl="21px"
          color="white">
          {LangName}
        </StyledText>
      </StyledView>
    </TouchableOpacity>
  );
};

export default LangButton;
