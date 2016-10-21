import { START_STOP } from '../actions/transport_actions';
import merge from 'lodash/merge';

const _defaultState = {
  playing: false
};

const TransportReducer = (state = _defaultState, action) => {
  let newState;
  switch (action.type) {
    case START_STOP:
      newState = merge({}, state, { playing: action.playing });
      return newState;

    default:
      return state;
  }
};

export default TransportReducer;
