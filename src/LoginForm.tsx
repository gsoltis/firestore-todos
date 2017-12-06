import * as React from 'react';
import * as firebase from 'firebase';

interface CredentialProps {
  label: string;
  onSubmit: (username: string, password: string) => void;
}

interface CredentialState {
  username: string;
  password: string;
}

class CredentialForm 
    extends React.Component<CredentialProps, CredentialState> {

  constructor(props: CredentialProps) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  usernameChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({username: e.currentTarget.value});
  }

  passwordChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({password: e.currentTarget.value});
  }

  formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (username && password) {
      this.props.onSubmit(username, password);
    }
  }

  render() {
    return (
      <form onSubmit={this.formSubmit}>
        <label>
          Username
          <input
            type="text"
            value={this.state.username}
            onChange={this.usernameChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={this.state.password}
            onChange={this.passwordChange}
          />
        </label>
        <input type="submit" value={this.props.label} />
      </form>
    );
  }
}

interface Props {
  auth: firebase.auth.Auth;
  onError: (e: string) => void;
}

interface State {
  inProgress: boolean;
}

class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inProgress: false
    };
  }

  handleUserPromise(p: Promise<firebase.User>) {
    p.then((user) => {
      this.setState({inProgress: false});
    })
    .catch((e: Error) => {
      this.setState({inProgress: false});
      this.props.onError(e.toString());
    });
  }
  
  login = (username: string, password: string) => {
    this.setState({inProgress: true});
    const auth = this.props.auth;
    this.handleUserPromise(auth.signInWithEmailAndPassword(username, password));
  }

  signup = (username: string, password: string) => {
    this.setState({inProgress: true});
    const auth = this.props.auth;
    this.handleUserPromise(auth.createUserWithEmailAndPassword(username, password));
  }

  render() {
    return (
      <div>
        <CredentialForm label={'Signup'} onSubmit={this.signup} />
        <CredentialForm label={'Login'} onSubmit={this.login} />
      </div>
    );
  }
}

export default LoginForm;