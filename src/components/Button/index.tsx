import React, { useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native';

import {StyledView, StyledText} from '../../styles';

const Button = ({onPress, title, Icon, isDisabled}) => {
  return (
    <TouchableOpacity disabled={isDisabled} onPress={onPress}>
      <LinearGradient colors={isDisabled ? ['#5C6A94', '#5C6A94'] : ['#7F79FF', '#4E48EC']} style={{borderRadius: 8}}>
        <StyledView
          width={'160px'}
          height="36px"
          br="4px"
          justifyContent="center"
          flexDirection="row"
          alignItems="center">
          {Icon && <Icon marginRight={8} />}
          <StyledText
            fontSize={'14px'}
            fontFamily="Montserrat-Medium"
            color={isDisabled ? '#2B3965' : "white"}
            textAlign="center"
            lineHeight="17.07px">
            {title}
          </StyledText>
        </StyledView>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
