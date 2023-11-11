import React, {useCallback, useState} from 'react';
import {FlatList} from 'react-native';

import {StyledView} from '../../styles';
import DropDownListItem from './components/DropDownListItem';

const DropDownList = ({settindsItems}) => {
  const [openedDropDown, setOpenedDropDown] = useState(-1);
  const renderList = useCallback(
    ({item: {title, Icon, childrenItemsType, childrenItems}, index}) => (
      <DropDownListItem
        title={title}
        Icon={Icon}
        childrenItemsType={childrenItemsType}
        childrenItems={childrenItems}
        openedDropDown={openedDropDown}
        setOpenedDropDown={setOpenedDropDown}
        index={index}
      />
    ),
    [openedDropDown],
  );
  return (
    <StyledView>
      <FlatList
        data={settindsItems}
        keyExtractor={item => item?.title + Math.random().toString()}
        renderItem={renderList}
      />
    </StyledView>
  );
};

export default DropDownList;
