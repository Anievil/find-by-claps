import React, {useState, useCallback} from 'react';
import Slider from 'react-native-slider';

import I18n from '../../../Localization/i18n';
import {StyledText, StyledView} from '../../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { setSettings } from '../../../actions/actions';

const DropDownListItemSlider = ({title}) => {
  const dispatch = useDispatch()
  const settings = useSelector(({mainFunctionalReduser}) => mainFunctionalReduser.settings)
  const {sensetive, volume} = settings
  const [value, setValue] = useState(title ? volume : sensetive)

  const changeValue = useCallback((val) => {
    const settingTitle = title || 'sensetive'
    dispatch(setSettings({title: settingTitle, value: val}))
    setValue(val)
  }, [dispatch, value, title])

  return (
    <StyledView justifyContent="center" pl="68px" pr="16px" pv="8px">
      {title && (
        <StyledText
          color="#fff"
          fontFamily="Inter-Regular"
          fontSize="20px"
          mb="14px"
          lineHeight="24.2px">
          {I18n.t(title)}
        </StyledText>
      )}
      <Slider
        style={{padding: 0, height: 16}}
        minimumValue={0}
        value={value}
        onValueChange={changeValue}
        maximumValue={1}
        minimumTrackTintColor="#888FFB"
        maximumTrackTintColor="#5C6A94"
        thumbTintColor="#888FFB"
        trackStyle={{width: 300, height: 4, padding: 0}}
        thumbStyle={{width: 16, height: 16, padding: 0}}
      />
    </StyledView>
  );
};

export default DropDownListItemSlider;
