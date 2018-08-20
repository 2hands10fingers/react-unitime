import React from 'react';
import DateClock from './DateClock'
import Copyright from './Copyright';
import ReactComponent from './ReactComponent';

class ReactApp extends React.Component {
  render() {
    return (
      <div className="app-container">
        <DateClock />
        {/* <ReactComponent /> */}
        {/* <Copyright /> */}
      </div>
    );
  }
}

export default ReactApp;