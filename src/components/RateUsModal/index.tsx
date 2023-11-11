import React, { useCallback, useState } from 'react';
import {Linking, Modal, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import * as amplitude from '@amplitude/analytics-react-native';

import {StyledView, StyledText} from '../../styles';
import I18n from '../../Localization/i18n';
import {Button, RateStar} from '..';

import ICClose from '../../../assets/icons/close.svg';
import ICRateUsArrow from '../../../assets/icons/rateUaArrow.svg';

const RateUsModal = ({isModalOpen, toggleModal}) => {
  const [activeStar, setActiveStar] = useState(0);

  const rateUsPressed = useCallback(() => {
    amplitude.track('Set rate', {screen: 'Rate us', rate: `${activeStar} stars`});
    if(activeStar <= 3) {
      toggleModal()
    } else {
      Linking.openURL("market://details?id=com.findbyclaps");
    }
  }, [activeStar])

  return (
    <StyledView position="absolute" zIndex="999" width={'250%'} height="100%">
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={toggleModal}>
        <TouchableOpacity onPress={toggleModal}>
          <StyledView
            width="100%"
            height="100%"
            backgroundColor="rgba(0,0,0,.5)"
            justifyContent="center"
            alignItems="center">
            <TouchableWithoutFeedback>
              <StyledView
                width="304px"
                br="8px"
                padding="12px"
                height="304px"
                backgroundColor="#23355F"
                alignItems="center">
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{alignSelf: 'flex-end'}}>
                  <ICClose />
                </TouchableOpacity>
                <StyledView mt="8px" mb="24px" alignItems="center">
                  <StyledText
                    color="#fff"
                    fontSize="32px"
                    fontFamily="Montserrat-SemiBold"
                    lineHeight="39.01px">
                    {I18n.t('rateUsCC')}
                  </StyledText>
                  <StyledText
                    mt="12px"
                    textAlign="center"
                    color="#fff"
                    fontSize="14px"
                    fontFamily="Montserrat-Regular"
                    lineHeight="17.07px">
                    {I18n.t('rateUsDesc')}
                  </StyledText>
                </StyledView>
                <RateStar activeStar={activeStar} setActiveStar={setActiveStar} />
                <StyledView flexDirection="row" justifyContent='center' width='100%' position='realative'>
                  <StyledView>
                    <Button
                      title={I18n.t('rateUs').toUpperCase()}
                      onPress={rateUsPressed}
                    />
                  </StyledView>
                  <StyledView position='absolute' right={10} top={-10}>
                    <ICRateUsArrow marginLeft={18} />
                  </StyledView>
                </StyledView>
              </StyledView>
            </TouchableWithoutFeedback>
          </StyledView>
        </TouchableOpacity>
      </Modal>
    </StyledView>
  );
};

export default RateUsModal;
