import * as React from 'react';
import * as firebase from 'firebase';
import TaskList from './TaskList';

interface Props {
  tasksCollection: firebase.firestore.CollectionReference;
  onError: (e: string) => void;
}

class MainContent extends React.Component<Props, {}> {
  render() {
    const { tasksCollection, onError } = this.props;
    return (
      <div>
        <TaskList tasksCollection={tasksCollection} onError={onError} done={false} />
        <hr />
        <TaskList tasksCollection={tasksCollection} onError={onError} done={true} />
      </div>
    );
  }
}

export default MainContent;