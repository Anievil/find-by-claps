import React, {useCallback, useState} from 'react';
import {FlatList} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {StyledView} from '../../../styles';
import DropDownListItemRatio from './DropDownListItemRadio';
import DropDownListItemSlider from './DropDownListItemSlider';
import { setSettings } from '../../../actions/actions';

const DropDownOpendItem = ({title, childrenItemsType, childrenItems}) => {
  const settings = useSelector(({mainFunctionalReduser}) => mainFunctionalReduser.settings)
  const {vibration, flash} = settings
  const [currentRadioVariant, setCurrentRadioVariant] = useState(
    childrenItemsType === 'radio' ? title === 'vibration' ? vibration : flash : null,
  );

  const dispatch = useDispatch()
  const changeRatio = useCallback(value => {
    if (value === 'default' || value === 'disco' || value === 'sos'){
      dispatch(setSettings({title: 'flash', value}))
    } else {
      dispatch(setSettings({title: 'vibration', value}))
    }
    setCurrentRadioVariant(value)
  }, [vibration, flash]);

  const renderSettingsItems = useCallback(
    ({item}) => {
      switch (childrenItemsType) {
        case 'radio':
          const isChecked =
         currentRadioVariant === item ? 'checked' : 'unchecked';
          return (
            <DropDownListItemRatio
              title={item}
              changeRatio={changeRatio}
              isCheckied={isChecked}
            />
          );
        case 'swipe':
          return <DropDownListItemSlider title={item} />;

        default:
          return <StyledView />;
      }
    },
    [currentRadioVariant],
  );

  return (
    <StyledView backgroundColor="#23355F" justifyContent="center" pv={childrenItemsType === 'radio' ? '0px' : '8px'}>
      <FlatList
        data={childrenItems}
        keyExtractor={item => item}
        renderItem={renderSettingsItems}
        scrollEnabled={false}
      />
    </StyledView>
  );
};

export default DropDownOpendItem;
