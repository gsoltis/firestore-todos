import * as React from 'react';
import * as firebase from 'firebase';
import TaskList from './TaskList';

const userId = 'dMoHrmwhVLuG95J1VhA0';

type User = {
  id: string,
  name: string;
  tasks: firebase.firestore.CollectionReference;
};

interface Props {
  usersCollection: firebase.firestore.CollectionReference;
}

interface State {
  loggingIn: boolean;
  user?: User;
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loggingIn: false,
    };
  }

  login = () => {
    if (!this.state.loggingIn && !this.state.user) {
      this.setState({loggingIn: true});
      const users = this.props.usersCollection;
      users
        .doc(userId)
        .get()
        .then((doc) => {
          const data = doc.data();
          const user: User = {
            id: doc.id,
            name: data.name,
            tasks: users.doc(doc.id).collection('tasks')
          };
          this.setState({
            user,
            loggingIn: false
          });
        })
        .catch((e: Error) => {
          this.setState({loggingIn: false});
          console.error('failed to log in', e);
        });
    }
  }

  logout = () => {
    if (this.state.user) {
      this.setState({
        user: undefined
      });
    }
  }

  render() {
    return (
      <div>
        Login (user id: {userId})
        <button onClick={this.login}>Do it</button>
        {this.state.user && 
          <div>
            <TaskList 
              tasksCollection={this.state.user.tasks} 
            />
            <button onClick={this.logout}>Log out</button>
          </div>
        }
      </div>
    );
  }
}

export default Login;