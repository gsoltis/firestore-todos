import * as React from 'react';
import * as firebase from 'firebase';
import TaskItem, { Task } from './TaskItem';
import AddTask from './AddTask';
import './TaskList.css';

interface Props {
  tasksCollection: firebase.firestore.CollectionReference;
  onError: (e: string) => void;
  done: boolean;
}

interface State {
  tasks: Task[];
  unsubscribe: () => void;
}

class TaskList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    const unsubscribe = this.props.tasksCollection
      .where('done', '==', this.props.done)
      .orderBy('created', 'asc')
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
              tasks.splice(change.newIndex, 0, task);
            } else if (change.type === 'modified') {
              const i = tasks.findIndex((t) => (t.ref.id === change.doc.id));
              if (i !== -1) {
                tasks[i] = task;
              }
              if (change.newIndex !== change.oldIndex) {
                console.log('need to shuffle');
              }
            } else if (change.type === 'removed') {
              const i = change.oldIndex;
              tasks.splice(i, 1);
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
      unsubscribe: unsubscribe,
    };
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  render() {
    const { done, tasksCollection, onError } = this.props;
    const className = done ? 'done' : '';
    return (
      <div>
        <ul className={className}>
          {this.state.tasks.map((task) =>
            <TaskItem key={task.ref.id} task={task} onError={onError} />
          )}
        </ul>
        {!done && <AddTask tasksCollection={tasksCollection} onError={onError} />}
      </div>
    );
  }
}

export default TaskList;