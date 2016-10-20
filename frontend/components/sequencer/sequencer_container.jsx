import { connect } from 'react-redux';
import Sequencer from './sequencer';
import { startStop } from '../../actions/transport_actions';

const mapStateToProps = state => ({
  playing: state.transport.playing
});

const mapDispatchToProps = dispatch => ({
  startStop: playing => dispatch(startStop(playing))
});

const SequencerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sequencer);

export default SequencerContainer;
