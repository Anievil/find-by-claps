import React, {useCallback, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';

import {StyledView} from '../../styles';

import ICFillStar from '../../../assets/icons/fillStar.svg';
import ICEmptyStar from '../../../assets/icons/emptyRate.svg';

const RateStar = ({activeStar, setActiveStar}) => {
  const renderStarItem = useCallback(
    ({item}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            setActiveStar(item);
          }}>
          {item <= activeStar ? <ICFillStar /> : <ICEmptyStar />}
        </TouchableOpacity>
      );
    },
    [activeStar],
  );

  return (
    <StyledView height="30px" mb="24px">
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={renderStarItem}
        keyExtractor={item => item + Math.random().toString()}
        horizontal
      />
    </StyledView>
  );
};

export default RateStar;
