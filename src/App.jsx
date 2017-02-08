import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
    messages: [
        {
          id: 1,
          username: "Bob",
          content: "Has anyone seen my marbles?",
        },
        {
          id: 2,
          username: "Anonymous",
          content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    };
    this.socket = new WebSocket("ws://0.0.0.0:4000");
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket.onopen = function()
               {
                  console.log("Connected to server");
               };
    setTimeout(() => {
      console.log("Simulating incoming message");
      // Add a new message to the list of messages in the data store
      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage)
      // Update the state of the app component.
      // Calling setState will trigger a call to render() in App and all child components.
      this.setState({messages: messages})
    }, 3000);
  }

  getNewChat = (e) => {
    if (e.key === 'Enter') {
      let idForKey = this.state.messages.length + 1;
      let newMessage = {id: idForKey, username: this.state.currentUser.name, content: e.target.value };
      let messages = this.state.messages.concat(newMessage);
      this.setState({messages: messages});
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
