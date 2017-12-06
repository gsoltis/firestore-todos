import * as React from 'react';
import * as firebase from 'firebase';

interface Props {
  tasksCollection: firebase.firestore.CollectionReference;
  onError: (e: string) => void;
}

interface State {
  newTask: string;
  savingTask: boolean;
}

class AddTask extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newTask: '',
      savingTask: false
    };
  }

  addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.newTask) {
      this.setState({
        savingTask: true
      });
      this.props.tasksCollection.add({
        title: this.state.newTask,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        done: false
      }).then((docRef) => {
        this.setState({
          newTask: '',
          savingTask: false
        });
      }).catch((err) => {
        this.props.onError(err.toString());
        this.setState({savingTask: false});
      });
    }
  }

  updateNewTask = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      newTask: e.currentTarget.value
    });
  }

  render() {
    return (
      <form onSubmit={this.addTask}>
        <fieldset disabled={this.state.savingTask}>
          <input 
            disabled={this.state.savingTask} 
            type="text" 
            onChange={this.updateNewTask} 
            value={this.state.newTask} 
          />
          <input type="submit" value="Add Task" />
        </fieldset>
      </form>
    );
  }
}

export default AddTask;