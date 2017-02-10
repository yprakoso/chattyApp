import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      userOnline: 1
    };
  }

  getImageUrl(text) {
    let re = /(https?:\/\/.*\.(?:png|jpg|gif))/g;
    if (text.match(re)) {
      return text.match(re)[0];
    } else {
      return null;
    };
  }

  onMessageReceive = (event) => {
    const newMessage = JSON.parse(event.data);
    if (newMessage.type) {
      newMessage.imgurl = this.getImageUrl(newMessage.content);
      newMessage.content = newMessage.content.replace(newMessage.imgurl, '');
      const messages = this.state.messages.concat(newMessage);
      this.setState({messages: messages});
    } else if (newMessage.userOnline !== this.state.userOnline) {
      this.setState({userOnline: newMessage.userOnline});
    }
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket = new WebSocket("ws://0.0.0.0:4000");
    this.socket.onmessage = this.onMessageReceive;
  }

  getNewChat = (e) => {
    if (e.key === 'Enter') {
      let newMessage = { type: "postMessage", username: this.state.currentUser.name, content: e.target.value };
      this.socket.send(JSON.stringify(newMessage));
      e.target.value = "";
    }
  }

  getNewName = (e) => {
    if (e.key === 'Enter') {
      let content = this.state.currentUser.name + " has changed their name to " + e.target.value + ".";
      this.state.currentUser.name = e.target.value;
      let newNotif = { type: "postNotification", username: e.target.value, content:content };
      this.socket.send(JSON.stringify(newNotif));
      document.getElementsByClassName('chatbar-message')[0].focus();
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="userOnline">{this.state.userOnline} User Online</div>
        </nav>
        <MessageList messages = {this.state.messages} />
        <ChatBar defaultName = {this.state.currentUser.name} currentUser = {this.getNewName} newMessage = {this.getNewChat}/>
      </div>
    );
  }
}
export default App;
