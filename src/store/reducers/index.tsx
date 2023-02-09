import {
  GAME_DATA,
  FAV_GAMES,
  REMOVE_FAV_GAME,
  PROFILE_PIC,
  RESET_APP,
  CREATE_ID,
  POPULAR_MOVIES,
} from '../actions/types';

const initialState = {
  gameData: [],
  popularMoviesData: [],
  favGames: [],
  profilePic: {},
  id: '',
};

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GAME_DATA: {
      return {
        ...state,
        gameData: action.payload,
      };
    }
    case POPULAR_MOVIES: {
      return {
        ...state,
        popularMoviesData: action.payload,
      };
    }
    case FAV_GAMES: {
      return {
        ...state,
        favGames: [...state.favGames, action.payload],
      };
    }
    case REMOVE_FAV_GAME: {
      const filteredArray = state.favGames.filter(
        (game: any) => game.id !== action.payload.id,
      );
      return {
        favGames: filteredArray,
      };
    }
    case PROFILE_PIC: {
      return {
        profilePic: action.payload,
      };
    }
    case CREATE_ID: {
      return {
        id: action.payload,
      };
    }
    case RESET_APP: {
      return initialState;
    }
    default:
      return state;
  }
};

export default rootReducer;
