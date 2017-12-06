import * as React from 'react';
import * as firebase from 'firebase';
import TaskItem, { Task } from './TaskItem';

interface Props {
  tasksCollection: firebase.firestore.CollectionReference;
  user: firebase.User;
  onError: (e: string) => void;
}

interface State {
  tasks: Task[];
  newTask: string;
  savingTask: boolean;
  unsubscribe: () => void;
}

class TaskList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    const unsubscribe = this.props.tasksCollection
      .onSnapshot(
        (snap) => {
          const tasks = this.state.tasks;
          for (const change of snap.docChanges) {
            const data = change.doc.data();
            const task = {
              title: data.title,
              done: data.done,
              ref: change.doc.ref
            };
            if (change.type === 'added') {
              tasks.push(task);
            } else if (change.type === 'modified') {
              const i = tasks.findIndex((t) => (t.ref.id === change.doc.id));
              if (i !== -1) {
                tasks[i] = task;
              }
            }
          }
          this.setState({tasks});
        }, 
        (e: Error) => {
          this.props.onError(e.toString());
        }
    );

    this.state = {
      tasks: [],
      newTask: '',
      savingTask: false,
      unsubscribe: unsubscribe,
    };
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  addTask = () => {
    if (this.state.newTask) {
      this.setState({
        savingTask: true
      });
      this.props.tasksCollection.add({
        title: this.state.newTask,
        done: false
      }).then((docRef) => {
        this.setState({
          newTask: '',
          savingTask: false
        });
      }).catch((e) => {
        this.props.onError(e.toString());
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
      <div>
        <p>
          this is the task list, it has 
          {this.state.tasks.length} items
        </p>
        <ul>
          {this.state.tasks.map((task) =>
            <TaskItem key={task.ref.id} task={task} onError={this.props.onError} />
          )}
        </ul>
        <input 
          disabled={this.state.savingTask} 
          type="text" 
          onChange={this.updateNewTask} 
          value={this.state.newTask} 
        />
        <button onClick={this.addTask}>Add Task</button>
      </div>
    );
  }
}

export default TaskList;