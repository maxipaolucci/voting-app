import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],

  renderRestartBtn: function () {
    return this.props.restart ? <div className="management">
          <button ref="restart"
                  className="restart"
                  onClick={this.props.restart}>
            Restart
          </button>
        </div> : '';
  },

  render: function() {
    return <div className="winner">
      { this.renderRestartBtn() }
      Winner is {this.props.winner}!
    </div>;
  }
});