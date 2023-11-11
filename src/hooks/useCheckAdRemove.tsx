import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCheckAdRemove = () => {
  const [wachedNoAdsVideo, setWachedNoAdsVideo] = useState<boolean>();
  const [blockAllAd, setBlockAllAd] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const wachedNoAdsVideoDate = await AsyncStorage.getItem(
        'wachedNoAdsVideoDate',
      );
      if (wachedNoAdsVideoDate) {
        const date = new Date(JSON.parse(wachedNoAdsVideoDate));
        const newDate = new Date();
        const isExpired =
          date.getDate() === newDate.getDate() ||
          (date.getDate() + 1 === newDate.getDate() &&
            date.getHours() > newDate.getDate());
        if (isExpired) {
          setWachedNoAdsVideo(isExpired);
        } else {
          await AsyncStorage.setItem('wachedNoAdsVideoDate', '');
          setWachedNoAdsVideo(false);
        }
      } else {
        setWachedNoAdsVideo(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const blackAd = await AsyncStorage.getItem('blockAllAd');
      if (blackAd === 'true') {
        setBlockAllAd(true);
      } else {
        setBlockAllAd(false);
      }
    };
    fetchData();
  }, []);

  return {wachedNoAdsVideo, blockAllAd};
};

export default useCheckAdRemove;
