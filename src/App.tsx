import * as React from 'react';
import './App.css';
import * as firebase from 'firebase';
require('firebase/firestore');
import Login from './Login';
import Error from './Error';

const config = {
  apiKey: 'AIzaSyCjfk3xda-w-G9NsSzVmRBU8w9Wt8-Urzc',
  authDomain: 'livelist.firebaseapp.com',
  databaseURL: 'https://livelist.firebaseio.com',
  projectId: 'firebase-livelist',
  storageBucket: 'firebase-livelist.appspot.com',
  messagingSenderId: '241612301660'
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const auth = firebase.auth();

interface State {
  errors: string[];
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      errors: []
    };
  }

  onError = (e: string) => {
    const errors = this.state.errors;
    errors.push(e);
    this.setState({errors});
  }

  clearError = (i: number) => {
    const errors = this.state.errors;
    errors.splice(i, 1);
    this.setState({errors});
  }

  clearErrors = () => {
    this.setState({errors: []});
  }

  render() {
    const users = firestore.collection('users');
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Firestore Todos</h2>
        </div>
        <Error errors={this.state.errors} clearError={this.clearError} />
        <Login 
          clearErrors={this.clearErrors}
          onError={this.onError}
          usersCollection={users} 
          auth={auth} 
        />
      </div>
    );
  }
}

export default App;
