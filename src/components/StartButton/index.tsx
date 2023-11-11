import React, {useCallback, useState, useRef, useEffect, useMemo} from 'react';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {TouchableOpacity, Animated, NativeModules} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';

import {useSoundDetectiong} from '../../hooks';
import {StyledView, StyledText} from '../../styles';
import I18n from '../../Localization/i18n';

import ICStart from '../../../assets/icons/start.svg';
import {useSelector} from 'react-redux';

const {ClapDetectorModule} = NativeModules;
PushNotification.createChannel(
  {
    channelId: 'channel-id', 
    channelName: 'My channel', 
  },
  created => console.log(`createChannel returned '${created}'`), 
);
const StartButton = ({setIsDetectingActive}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isActive, setIsActive] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const {startDetectiong, endDetectiong} = useSoundDetectiong();
  const settings = useSelector(
    ({mainFunctionalReduser}) => mainFunctionalReduser.settings,
  );
  const {isvibration, isflashlight, vibration, flash, sensetive} = useMemo(
    () => settings,
    [settings],
  );

  useEffect(() => {
    if (isActive) {
      ClapDetectorModule.Ewe(isflashlight, isvibration, flash, vibration, sensetive, res => {
        if (res) {
          startDetectiong();
          PushNotification.localNotification({
            id: '1',
            channelId: 'channel-id',
            message: I18n.t('pressForDeactivate'),
            allowWhileIdle: false,
            autoCancel: false,
            vibrate: false,
            ongoing: true,
            largeIcon: 'ic_app_round',
            bigLargeIcon: 'ic_app_round',
            smallIcon: 'ic_app_round',
          });
        }
      })
    }
  }, [startDetectiong, isActive, isflashlight, isvibration, flash, vibration]);
  
  useEffect(() => {
    if (!isFocused) {
      endDetectiong();
      setIsDetectingActive(false);
      ClapDetectorModule.declineDetecting &&
        ClapDetectorModule.declineDetecting();
      PushNotification.cancelLocalNotifications({id: '1'});
    }
  }, [isFocused]);
  useEffect(() => {
    PushNotification.configure({
      onNotification: function () {
        onPressButton();
      },
    });
  }, [isActive]);

  const onPressButton = useCallback(() => {
    check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
      switch (result) {
        case RESULTS.DENIED:
          navigation.navigate('MicroPermissionScreen');
          break;
        case RESULTS.GRANTED:
          if (isActive === true) {
            endDetectiong();
            setIsDetectingActive(false);
            ClapDetectorModule.declineDetecting();
            PushNotification.cancelLocalNotifications({id: '1'});
          } else {
            PushNotification.localNotification({
              id: '1',
              channelId: 'channel-id',
              message: I18n.t('pressFor'),
              allowWhileIdle: false,
              autoCancel: false,
              vibrate: false,
              playSound: false,
              ongoing: true,
              largeIcon: 'ic_app_round',
              bigLargeIcon: 'ic_app_round',
              smallIcon: 'ic_app_round',
            });
            setIsDetectingActive(true);
          }
          setTimeout(() => {
            setIsActive(!isActive);
          },1000)

          break;
      }
    });
  }, [isActive, endDetectiong, setIsDetectingActive]);

  useEffect(() => {
    const pulsAnim = [
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
      }),
      Animated.delay(500),
    ];
    const animaton = Animated.loop(Animated.sequence(pulsAnim));
    if (isActive) {
      animaton.start();
    } else {
      animaton.reset();
      animaton.stop();
    }
  }, [isActive]);

  return (
    <StyledView alignItems="center" mt="40px">
      <TouchableOpacity onPress={onPressButton}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: '#c1c5ff',
              height: 160,
              width: 160,
              borderRadius: 100,
              transform: [{scale: scaleAnim}],
            },
          ]}
        />
        <StyledView
          alignItems="center"
          justifyContent="center"
          height="160px"
          width="160px"
          br="100px"
          backgroundColor="#4D53B1">
          <ICStart />
        </StyledView>
      </TouchableOpacity>
      <StyledText
        color="white"
        mt="32px"
        fontFamily="Montserrat-Regular"
        mb="4px">
        {isActive ? I18n.t('deactivate') : I18n.t('activate')}
      </StyledText>
    </StyledView>
  );
};

export default StartButton;
