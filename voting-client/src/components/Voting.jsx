import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Winner from './Winner';
import Vote from './Vote';
import * as actionCreators from '../action_creators';

export const Voting = React.createClass({
  mixins: [PureRenderMixin],
  contextTypes: {
    router: React.PropTypes.object
  },
  render: function() {
    if (!this.props.currentUser || this.props.currentUser == '-1') {
      //if the user is not set then redirect to login
      this.context.router.push('/login');
      return null;
    } else {
      return <div>
        { this.props.winner ?
          <Winner ref="winner" winner={this.props.winner} /> : <Vote {...this.props} /> }
      </div>;
    }
  }
});

function mapStateToProps(state) {
  return {
    pair: state.getIn(['vote', 'pair']),
    hasVoted: state.getIn(['vote', 'voters', state.get('currentUser')], false),
    winner: state.get('winner'),
    currentUser: state.get('currentUser')
  };
}

export const VotingContainer = connect(
    mapStateToProps,
    actionCreators
)(Voting);