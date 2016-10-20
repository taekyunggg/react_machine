import { START_STOP } from '../actions/transport_actions';
import merge from 'lodash/merge';

const _defaultState = {
  bpm: 120,
  playing: false
};

const TransportReducer = (state = _defaultState, action) => {
  switch (action.type) {
    case START_STOP:
      const newState = merge({}, state, { playing: action.playing });
      return newState;
    default:
      return state;
  }
};

export default TransportReducer;
