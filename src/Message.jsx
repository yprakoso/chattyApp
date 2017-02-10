import React, {Component} from 'react';

class Message extends Component {
  _buildIncomingMessage() {
    return (
      <div className="message">
        <span className="message-username" style={{color: this.props.message.userColor}}>{this.props.message.username}</span>
        <span className="message-content">{this.props.message.content}
          <div className="img">
            <img src={this.props.message.imgurl} />
          </div>
        </span>
     </div>
    );
  }
  _buildIncomingNotification() {
    return (
      <div className="message system">
        {this.props.message.content}
      </div>
    );
  }
  render() {
    if (this.props.message.type === "incomingMessage") {
      return this._buildIncomingMessage();
    } else if (this.props.message.type === "incomingNotification") {
      return this._buildIncomingNotification();
    }
  }
}
export default Message;