import {useCallback, useEffect, useState, useMemo} from 'react';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import * as amplitude from '@amplitude/analytics-react-native';

const usePermission = (IsNotification: boolean, redirect: () => {}) => {
  const [isPermissionsGranded, setIsPermissionsGranded] = useState(false);
  const permission = useMemo(
    () =>
      IsNotification
        ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    [IsNotification],
  );
  useEffect(() => {
    if (isPermissionsGranded) {
      check(permission).then(result => {
        setIsPermissionsGranded(result === RESULTS.GRANTED);
      });
    }
  }, [isPermissionsGranded]);

  const getPermissions = useCallback(() => {
    request(permission).then(result => {
      switch (result) {
        case RESULTS.DENIED:
          amplitude.track(`${IsNotification ? 'NOtifications' : 'Microphone'} permission denied`);
          break;
        case RESULTS.UNAVAILABLE:
          redirect();
          break;
        case RESULTS.GRANTED:
          setIsPermissionsGranded(true);
          break;
      }
    });
  }, [isPermissionsGranded]);

  return {isPermissionsGranded, getPermissions};
};

export default usePermission;
