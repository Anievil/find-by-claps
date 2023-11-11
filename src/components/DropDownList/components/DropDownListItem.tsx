import React, {useRef, useCallback, useMemo, useEffect} from 'react';
import {TouchableOpacity, Animated} from 'react-native';

import {StyledText, StyledView} from '../../../styles';
import I18n from '../../../Localization/i18n';

import ICArrowDown from '../../../../assets/icons/arrowDown.svg';
import DropDownOpendItem from './DropDownOpendItem';

const DropDownListItem = ({
  Icon,
  title,
  childrenItems,
  childrenItemsType,
  setOpenedDropDown,
  openedDropDown,
  index,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

  const toggle = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000],
  });
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const color = useMemo(
    () => (openedDropDown !== index ? '#fff' : '#888FFB'),
    [openedDropDown],
  );

  const toggleDropDown = useCallback(() => {
    const settedIndex = openedDropDown === index ? -1 : index;
    setOpenedDropDown(settedIndex);
  }, [openedDropDown, setOpenedDropDown]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: openedDropDown !== index ? 0 : 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(toggleAnim, {
        toValue: openedDropDown !== index ? 0 : 1,
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start();
  }, [openedDropDown]);

  return (
    <StyledView>
      <StyledView height="56px" justifyContent="center">
        <TouchableOpacity onPress={toggleDropDown}>
          <StyledView
            flexDirection="row"
            justifyContent="space-between"
            ph="16px">
            <StyledView flexDirection="row">
              <Icon style={{color}} />
              <StyledText
                ml="21px"
                color={color}
                fontFamily="Montserrat-Medium"
                fontSize="20px"
                lineHeight="24.38px">
                {I18n.t(title)}
              </StyledText>
            </StyledView>
            <Animated.View style={{transform: [{rotate: spin}]}}>
              <ICArrowDown />
            </Animated.View>
          </StyledView>
        </TouchableOpacity>
      </StyledView>
      <Animated.View style={{maxHeight: toggle, overflow: 'hidden'}}>
        <DropDownOpendItem
          title={title}
          childrenItems={childrenItems}
          childrenItemsType={childrenItemsType}
        />
      </Animated.View>
    </StyledView>
  );
};

export default DropDownListItem;
