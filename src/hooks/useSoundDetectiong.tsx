import {useCallback, useMemo, useRef} from 'react';
import Torch from 'react-native-torch';
import {useSelector} from 'react-redux';
import Sound from 'react-native-sound';
import SoundPlayer from 'react-native-sound-player';

const useSoundDetectiong = () => {
  const settings = useSelector(
    ({mainFunctionalReduser}) => mainFunctionalReduser.settings,
  );
  const currentSong = useSelector(
    ({mainFunctionalReduser}) => mainFunctionalReduser.currentSong,
  );
  const repeatSound = useRef()
  const {volume, flash, ismelody} =
    useMemo(() => settings, [settings]);
  const sound = useMemo(
    () => {
      return new Sound(currentSong + '.mp3', Sound.MAIN_BUNDLE)
    } ,[currentSong],
  );

  const playMelody = useCallback(() => {
    if(currentSong?.url) {
      SoundPlayer.playUrl(currentSong.url);
      SoundPlayer.setVolume(1);
      repeatSound.current = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
        SoundPlayer.playUrl(currentSong.url);
        SoundPlayer.setVolume(1);
      })
    } else {
      sound.setVolume(volume);
      sound.setNumberOfLoops(-1);
  
      sound.play();
    }

  }, [currentSong, volume, sound, currentSong?.url]);

  const startDetectiong = useCallback(() => {
    if (ismelody) {
      playMelody();
    }
  }, [ismelody, volume]);

  const endDetectiong = useCallback(() => {
    sound.stop();
    repeatSound.current?.remove && repeatSound.current.remove()
    SoundPlayer.stop()
    Torch.switchState(false);
  }, [sound, flash]);

  return {startDetectiong, endDetectiong};
};

export default useSoundDetectiong;
