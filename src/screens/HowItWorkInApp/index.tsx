import React, {useCallback} from 'react';
import {FlatList} from 'react-native';

import I18n from '../../Localization/i18n';
import {StyledText, StyledView} from '../../styles';

import ICTernOn from '../../../assets/icons/ternOn.svg';
import ICClapsForTutorial from '../../../assets/icons/clapsForTutorial.svg';
import ICPhone from '../../../assets/icons/phone.svg';
import ICSettinsgForTutorial from '../../../assets/icons/settingsForTutorial.svg';

const tutorial = [
  {
    title: 'HIW_guide1',
    Icon: ICTernOn,
  },
  {
    title: 'HIW_guide2',
    Icon: ICClapsForTutorial,
  },
  {
    title: 'HIW_guide3',
    Icon: ICPhone,
  },
  {
    title: 'HIW_guide4',
    Icon: ICSettinsgForTutorial,
  },
];

const HowItWorkInApp = () => {
  const renderTutorial = useCallback(
    ({item: {title, Icon}}) => (
      <StyledView
        mh="16px"
        ph="16px"
        mt="8px"
        mb="4px"
        br="8px"
        flexDirection="row"
        alignItems="center"
        backgroundColor="#23355F">
        <Icon marginVertical={17} />
        <StyledText
          color="#fff"
          flexShrink={1}
          fontSize="14px"
          lainHeight="17.07px"
          fontFamily="Montserrat-Regular"
          ml="21px">
          {I18n.t(title)}
        </StyledText>
      </StyledView>
    ),
    [],
  );

  return (
    <StyledView>
      <FlatList
        data={tutorial}
        keyExtractor={item => item?.title + Math.random().toString()}
        renderItem={renderTutorial}
      />
    </StyledView>
  );
};

export default HowItWorkInApp;
