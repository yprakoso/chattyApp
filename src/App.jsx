import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
  }

  onMessageReceive = (event) => {
      const newMessage = JSON.parse(event.data);
      const messages = this.state.messages.concat(newMessage);
      this.setState({messages: messages});
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket = new WebSocket("ws://0.0.0.0:4000");
    this.socket.onmessage = this.onMessageReceive;
  }

  getNewChat = (e) => {
    if (e.key === 'Enter') {
      let newMessage = { username: this.state.currentUser.name, content: e.target.value };
      this.socket.send(JSON.stringify(newMessage));
      e.target.value = "";
    }
  }

  getNewName = (e) => {
    this.state.currentUser.name = e.target.value;
    if (e.key === 'Enter') {
      document.getElementsByClassName('chatbar-message')[0].focus();
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages = {this.state.messages} />
        <ChatBar defaultName = {this.state.currentUser.name} currentUser = {this.getNewName} newMessage = {this.getNewChat}/>
      </div>
    );
  }
}
export default App;
