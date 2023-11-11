import React, {useCallback} from 'react';
import {RadioButton} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';

import I18n from '../../../Localization/i18n';
import {StyledText, StyledView} from '../../../styles';

const DropDownListItemRatio = ({title, changeRatio, isCheckied}) => {
  const onPress = useCallback(() => {
    changeRatio(title);
  }, [title, changeRatio]);

  return (
    <TouchableOpacity onPress={onPress}>
      <StyledView
        flexDirection="row"
        alignItems="center"
        pl="68px"
        pr="10px"
        height='56px'
        justifyContent="space-between">
        <StyledText
          color="#fff"
          fontFamily="Montserrat-Medium"
          fontSize="20px"
          leinHeight="24.38px">
          {I18n.t(title)}
        </StyledText>
        <RadioButton
          value={title}
          status={isCheckied}
          onPress={onPress}
          color="#888FFB"
          uncheckedColor="#888FFB"
        />
      </StyledView>
    </TouchableOpacity>
  );
};

export default DropDownListItemRatio;
