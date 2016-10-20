import { connect } from 'react-redux';
import Effects from './effects';

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
});


const EffectsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Effects);

export default EffectsContainer;
