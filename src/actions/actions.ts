import actionsTypes from "./actionsTypes"

export const setCurrentMusic = (value: string) => ({
    type: actionsTypes.SET_CURRENT_MUSIC,
    payload: value
})

export const removeBlocked = (value: string) => ({
    type: actionsTypes.REMOVE_BLOCKED,
    payload: value
})

export const setSettings = (value: {title: string, value: string | number | boolean}) => ({
    type: actionsTypes.SET_SETTINGS,
    payload: value,
})

export const blockAddOn24H = (value: {date: Date, value: number}) => ({
    type: actionsTypes.BLOCK_ADS_ON_24H,
    payload: value,
})

export const setCustomSong = (value: {name: string, url: string}) => ({
    type: actionsTypes.SET_CUSTOM_SONGS_LIST,
    payload: value,
})

export const setCountOfReward = (value: number) => ({
    type: actionsTypes.SET_COUNT_OF_REWARDS,
    payload: value,
})