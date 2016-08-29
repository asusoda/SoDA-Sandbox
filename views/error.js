'use strict';

var React = require('react');

class ErrorMessage extends React.Component {
    render() {
        return (
            <div>
                <h1> {this.props.status} - {this.props.message} </h1>
                <pre> {this.props.stack} </pre>
            </div>
        )
    }
}

module.exports = ErrorMessage;
