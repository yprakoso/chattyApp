import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    let m = [];
    for (let i = 0 ; i < this.props.messages.length; i++) {
      m.push(
      <Message message = {this.props.messages[i]} key = {this.props.messages[i].id} />)
    }
    return (
      <main className="messages" >
        {m}
      </main>
    );
  }
}
export default MessageList;