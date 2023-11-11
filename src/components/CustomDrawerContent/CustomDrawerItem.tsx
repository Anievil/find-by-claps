import React, {useCallback} from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as amplitude from '@amplitude/analytics-react-native';

import I18n from '../../Localization/i18n'
import {StyledView, StyledText} from '../../styles';

const CustomDrawerItem = ({Icon, title, keyItem, toggleModal}) => {
  const navigation = useNavigation();
  const onDrawerPress = useCallback(() => {
    amplitude.track(`Go on ${title} screen`, {screen: 'Main Menu'});
    if (keyItem === 'modal') {
      toggleModal();
    } else if (keyItem === 'policy') {
      Linking.openURL("https://drive.google.com/file/d/1GNAqw9pEjSYjBw3vtN1T7GVXI-3IB9pa/view");
    } else {
      navigation.navigate(keyItem)
    }
  }, [title]);

  return (
    <>
      {title ? (
        <TouchableOpacity onPress={onDrawerPress}>
          <StyledView
            ph="16px"
            flexDirection="row"
            alignItems="center"
            height="48px">
            <Icon />
            <StyledText
              fontFamily="Montserrat-Regular"
              color="white"
              ml="21px"
              fontSize="14px"
              lineHeight="17.07px">
              {I18n.t(title)}
            </StyledText>
          </StyledView>
        </TouchableOpacity>
      ) : (
        <StyledView
          mh="16px"
          mv="8px"
          borderBottomWidth="2px"
          borderBottomColor="#475C8D"
        />
      )}
    </>
  );
};

export default CustomDrawerItem;
