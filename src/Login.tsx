import * as React from 'react';
import * as firebase from 'firebase';
import TaskList from './TaskList';
import LoginForm from './LoginForm';

interface Props {
  usersCollection: firebase.firestore.CollectionReference;
  auth: firebase.auth.Auth;
  clearErrors: () => void;
  onError: (error: string) => void;
}

interface State {
  loggingIn: boolean;
  user?: firebase.User;
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loggingIn: false,
    };
    this.props.auth.onAuthStateChanged((user: firebase.User) => {
      this.setState({user});
      this.props.clearErrors();
    });
  }

  logout = () => {
    this.props.auth.signOut();
  }

  render() {
    if (this.state.user) {
      const user = this.state.user;
      const tasks = this.props.usersCollection
        .doc(user.uid)
        .collection('tasks');
      return (
        <div> 
          <TaskList 
            tasksCollection={tasks} 
            user={user}
            onError={this.props.onError}
          />
          <button onClick={this.logout}>Log out</button>
        </div>
      );
    } else {
      return (
        <LoginForm auth={this.props.auth} onError={this.props.onError} />
      );
    }
  }
}

export default Login;