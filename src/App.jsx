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
      console.log(event.data);
      const newMessage = JSON.parse(event.data);
      console.log(newMessage);
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
      // let messages = this.state.messages.concat(newMessage);
      // this.setState({messages: messages});
      this.socket.send(JSON.stringify(newMessage));
      e.target.value = "";
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages = {this.state.messages} />
        <ChatBar currentUser = {this.state.currentUser} newMessage = {this.getNewChat}/>
      </div>
    );
  }
}
export default App;
