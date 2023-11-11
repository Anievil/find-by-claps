import types from '../actions/actionsTypes';

const initialState = {
  currentSong: 'standard',
  count_of_rewards: 2,
  blockAddOn24h: {date: null, wachedVideo: 0},
  settings: {
    sensetive: 1,
    volume: 1,
    vibration: 'default',
    flash: 'default',
    isvibration: false,
    isflashlight: false,
    ismelody: true,
  },
  customSongsList: [],
  blocked: {
    standard: false,
    laugh: false,
    bell: true,
    call: true,
    space: true,
    bit: true,
    fromDevice: true,
    fart: true,
    monster: true,
    siren: true,
    belching: true,
    cry: true,
    meow: true,
    woof: true,
    flashlight: true,
    vibration: true,
  },
};

const mainFunctionalReduser = (state = initialState, actions) => {
  switch (actions.type) {
    case types.SET_CURRENT_MUSIC:
      return {...state, currentSong: actions.payload};
    case types.REMOVE_BLOCKED:
      return {...state, blocked: {...state.blocked, [actions.payload]: false}};
    case types.SET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          [actions.payload.title]: actions.payload.value,
        },
      };
    case types.BLOCK_ADS_ON_24H:
      return {
        ...state,
        blockAddOn24h: {
          date: actions.payload.date,
          wachedVideo: actions.payload.wachedVideo,
        },
      };

      case types.SET_CUSTOM_SONGS_LIST:
      return {
        ...state,
        customSongsList: [...state.customSongsList, actions.payload],
      };

      case types.SET_COUNT_OF_REWARDS:
      return {
        ...state,
        count_of_rewards: actions.payload,
      };

    default:
      return state;
  }
};

export default mainFunctionalReduser;
