import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {currentUser} from '../index';

export default React.createClass({
    mixins: [PureRenderMixin],
    getPair: function() {
        return this.props.pair || [];
    },
    isDisabled: function() {
        return !!this.props.hasVoted;
    },
    hasVotedFor: function(entry) {
        return this.props.hasVoted === entry;
    },
    render: function() {
        return <div className="voting">
            {this.getPair().map(entry =>
                <button className={this.hasVotedFor(entry) ? 'voted' : ''}
                        key={entry}
                        disabled={this.isDisabled()}
                        onClick={() => this.props.vote(entry, currentUser)}>
                    <h1>{entry}</h1>
                    {this.hasVotedFor(entry) ?
                        <div className="label">Voted</div> :
                        null}
                </button>
            )}
        </div>;
    }
});