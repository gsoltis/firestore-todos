import * as React from 'react';

interface Props {
  errors: string[];
  clearError: (i: Number) => void;
}

class Error extends React.Component<Props, {}> {

  render() {
    if (this.props.errors.length) {
      return (
        <ul>
          {this.props.errors.map((e, i) => 
            <li 
              onClick={() => this.props.clearError(i)} 
              key={i}
            >
              {e}
            </li>
          )}
        </ul>
      );
    } else {
      return null;
    }
  }
}

export default Error;