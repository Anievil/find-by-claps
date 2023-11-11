import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {FlatList, StatusBar} from 'react-native';
import Sound from 'react-native-sound';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, {types} from 'react-native-document-picker';
import SoundPlayer from 'react-native-sound-player';
import {ScrollView} from 'react-native-gesture-handler';

import {
  AdBannerComponent,
  CustomMainMenuHeader,
  LongBurronWithCheck,
} from '../../components';
import {listForSearch, listOfFrolic} from './constants';
import {
  removeBlocked,
  setCurrentMusic,
  setCustomSong,
} from '../../actions/actions';
import ICFolder from '../../../assets/icons/folder.svg';
import useCheckAdRemove from '../../hooks/useCheckAdRemove';


Sound.setCategory('PlayAndRecord', true);
Sound.setActive(true);

const SoundFor = ({route, options}) => {
  const navigation = useNavigation();
  const {wachedNoAdsVideo, blockAllAd} = useCheckAdRemove()

  const dispatch = useDispatch();
  const currentActiveSong = useSelector(
    ({mainFunctionalReduser}) => mainFunctionalReduser?.currentSong,
  );
  const blocked = useSelector(
    ({mainFunctionalReduser}) => mainFunctionalReduser?.blocked,
  );
  const customSongsList = useSelector(
    ({mainFunctionalReduser}) => mainFunctionalReduser?.customSongsList,
  );
  const [activeSound, setActiveSound] = useState(currentActiveSong?.value || currentActiveSong);
  const [playingSong, setPlayingSong] = useState<object | null>(null);

  const dataList = useMemo(() => {
    return route.name === 'soundForSearch' ? listForSearch : listOfFrolic;
  }, []);

  const stopMusic = useCallback(() => {
    SoundPlayer.stop();
    playingSong && playingSong.stop();
  }, [playingSong]);

  const addMusikFromDevice = useCallback(() => {
    stopMusic()
    if (playingSong) {
      playingSong.stop();
    }
    DocumentPicker.pick({
      allowMultiSelection: false,
      type: [types.audio],
      copyTo: 'documentDirectory',
    })
      .then(res => {
        if (res[0]?.fileCopyUri && res[0].name) {
          try {
            dispatch(
              setCustomSong({
                name: res[0].name,
                url: res[0]?.fileCopyUri,
              }),
            );
            SoundPlayer.playUrl(res[0]?.fileCopyUri);
            SoundPlayer.setVolume(1);
            setActiveSound(res[0].name);
            dispatch(setCurrentMusic({value: res[0].name, url: res[0].fileCopyUri}));
          } catch (e) {
            console.log(`cannot play the sound file`, e);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [playingSong]);

  const onChouseSound = useCallback(
    (value, url) => {
      navigation.setParams({stopMusic});
      dispatch(setCurrentMusic(url ? {value, url} : value));
      dispatch(removeBlocked(value));
      stopMusic()
      if (playingSong) {
        playingSong.stop();
      }
      if (url) {
        SoundPlayer.playUrl(url);
        SoundPlayer.setVolume(1);
      } else {
        const sound = new Sound(value + '.mp3', Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          sound.setVolume(1);

          sound.play();
        });
        setPlayingSong(sound);
      }

      setActiveSound(value);
    },
    [playingSong],
  );

  const renderSoundList = useCallback(
    ({item: {Icon, title}}) => (
      <LongBurronWithCheck
        stopMusic={stopMusic}
        Icon={Icon}
        title={title}
        onPress={onChouseSound}
        isBlocked={blocked[title]}
        isActive={activeSound === title}
        blockAllAd={blockAllAd}
      />
    ),
    [activeSound, blocked, blockAllAd],
  );
  
  const renderCustomSoundList = useCallback(
    ({item: {name, url}}) => {
      return (
        <LongBurronWithCheck
          stopMusic={stopMusic}
          name={name}
          url={url}
          Icon={ICFolder}
          onPress={onChouseSound}
          isBlocked={false}
          isActive={activeSound === name}
        />
      );
    },
    [activeSound, customSongsList],
  );

  return (
    <>
      <ScrollView>
        <CustomMainMenuHeader
          navigation={navigation}
          route={route}
          options={options}
          stopMusic={stopMusic}
        />
        <StatusBar backgroundColor={'#716BFA'} />
        {dataList && (
          <FlatList
            data={dataList}
            scrollEnabled={false}
            renderItem={renderSoundList}
            keyExtractor={({title}) => title}
          />
        )}
        {route.name === 'soundForSearch' && (
          <FlatList
            data={customSongsList}
            scrollEnabled={false}
            renderItem={renderCustomSoundList}
            keyExtractor={({name}) => name}
            ListFooterComponent={() => (
              <>
                <LongBurronWithCheck
                  stopMusic={stopMusic}
                  Icon={ICFolder}
                  title={'fromDevice'}
                  onPress={addMusikFromDevice}
                  isBlocked={true}
                  isActive={activeSound === 'fromDevice'}
                />
              </>
            )}
          />
        )}
      </ScrollView>
      <AdBannerComponent isAdShow={!wachedNoAdsVideo && !blockAllAd} />
    </>
  );
};

export default SoundFor;
