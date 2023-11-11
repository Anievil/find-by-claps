import React, {useCallback, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as amplitude from '@amplitude/analytics-react-native';

import I18n from '../../Localization/i18n';
import {StyledImage, StyledText, StyledView} from '../../styles';
import {LongButtonWithSwitch, Button} from '../../components';

import {usePermission} from '../../hooks';

const PermissionScreen = ({navigation, route}) => {
  const IsNotification = useMemo(
    () => route.name === 'NotifiPermissionScreen',
    [route.name],
  );

  const redirect = useCallback(async () => {
    const screenName = IsNotification ? 'Notification permission' : 'microphone permission'
    amplitude.track(`Access ${screenName} permissions`, {screen: screenName, navigationOn: 'Go on "Main Menu" screen'});
    if (IsNotification) {
      await AsyncStorage.setItem('IsTutorialEnd', 'true');
      navigation.reset({
        index: 0,
        routes: [{name: 'MainMenu'}],
      });
    } else {
      navigation.navigate('MainMenu', {isMicroPermissionsGranded: true});
    }
  }, [IsNotification]);

  const {isPermissionsGranded, getPermissions} = usePermission(IsNotification, redirect);

  return (
    <StyledView flex={1}>
      <StyledText
        mt="28px"
        mb="20px"
        color="#fff"
        fontFamily={'Montserrat-SemiBold'}
        lineLeight="39.01px"
        fontSize="32px"
        textAlign="center">
        {I18n.t(IsNotification ? 'notifiPermission' : 'microPermission')}
      </StyledText>
      {IsNotification && (
        <StyledImage
          height={161}
          width={161}
          alignSelf="center"
          source={require('../../../assets/images/Dindon.png')}
          mt="113.5px"
          mb="24px"
        />
      )}
      <StyledText
        mb="60px"
        color="#fff"
        fontFamily={'Montserrat-Regular'}
        fontSize="14px"
        lineLeight="17.07px"
        textAlign="center">
        {I18n.t(
          IsNotification ? 'notifiPermissionDesc' : 'microPermissionDesc',
        )}
      </StyledText>
      <LongButtonWithSwitch
        isSwitch
        title={IsNotification ? 'notifiPermission' : 'access'}
        onPress={getPermissions}
        isBtnActive={isPermissionsGranded}
      />
      <StyledView justifyContent="flex-end" flex={1} alignItems='center' pb='32px'>
        <Button
          title={I18n.t('next')}
          onPress={redirect}
          isDisabled={!isPermissionsGranded}
        />
      </StyledView>
    </StyledView>
  );
};

export default PermissionScreen;
