import * as React from 'react';
import * as firebase from 'firebase';

export type Task = {
  title: string,
  done: boolean,
  ref: firebase.firestore.DocumentReference
};

interface Props {
  task: Task;
}

interface State {
  updating: boolean;
}

class TaskItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      updating: false
    };
  }

  updateTask = (e: React.FormEvent<HTMLInputElement>) => {
    if (!this.state.updating) {
      this.setState({updating: true});
      this.props.task.ref.set(
        {
          done: e.currentTarget.checked
        }, 
        {
          merge: true
        }
      ).then(() => {
        this.setState({updating: false});
      }).catch((err: Error) => {
        console.error('failed to set', err);
      });
    }
  }
  
  render() {
    const task = this.props.task;
    return (
      <li key={task.ref.id}>
        <input
          disabled={this.state.updating}
          onChange={this.updateTask}
          type="checkbox" 
          checked={task.done} 
        />
        {task.title}
    </li>
    );
  }
}

export default TaskItem;