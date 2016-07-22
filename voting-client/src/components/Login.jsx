import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../action_creators';

export const Login = React.createClass({
    mixins: [PureRenderMixin],
    contextTypes: {
        router: React.PropTypes.object
    },

    handleSubmit: function (event) {
        event.preventDefault();
        this.props.setCurrentUser(this._username.value);
    },

    handleCurrentUser: function (currentUser) {
        if (currentUser == '-1') {
          return <label className="error">Invalid username. Please enter it again.</label>;
        }

        return '';
    },

    render: function() {
        if (this.props.currentUser && this.props.currentUser != '-1') {
            //if the user is set then redirect to home
            this.context.router.push('/');
            return null;
        } else {
            return <div className="login-form">
                <form onSubmit={this.handleSubmit}>
                    <h1>Who are you?</h1>
                    { this.handleCurrentUser(this.props.currentUser) }
                    <input placeholder="username:" ref={(input) => this._username = input}></input>
                    <button type="submit">Sign in</button>
                </form>
            </div>;
        }
    }
});

function mapStateToProps(state) {
    return {
        currentUser: state.get('currentUser')
    };
}

export const LoginContainer = connect(
  mapStateToProps,
  actionCreators
)(Login);