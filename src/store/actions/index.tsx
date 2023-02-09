import {
  GAME_DATA,
  FAV_GAMES,
  REMOVE_FAV_GAME,
  RESET_APP,
  PROFILE_PIC,
  CREATE_ID,
  POPULAR_MOVIES,
} from './types';

export const getGameData = (data: any) => ({
  type: GAME_DATA,
  payload: data,
});
export const getPopularMoviesData = (data: any) => ({
  type: POPULAR_MOVIES,
  payload: data,
});
export const saveFavGames = (data: any) => ({
  type: FAV_GAMES,
  payload: data,
});
export const removeFavGames = (data: any) => ({
  type: REMOVE_FAV_GAME,
  payload: data,
});
export const saveProfilePic = (data: any) => ({
  type: PROFILE_PIC,
  payload: data,
});
export const createId = (data: any) => ({
  type: CREATE_ID,
  payload: data,
});
export const resetApp = () => ({
  type: RESET_APP,
});
