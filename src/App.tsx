import * as React from 'react';
import './App.css';
const firebase = require('firebase');
require('firebase/firestore');
import Login from './Login';

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

class App extends React.Component<{}, {}> {

  render() {
    const users = firestore.collection('users');
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <Login usersCollection={users} />
      </div>
    );
  }
}

export default App;
