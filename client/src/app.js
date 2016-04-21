import React from 'react';
import {Navbar} from 'react-bootstrap';

const App = ({children}) => {
  return (
    <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Github Analyzer</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
      {children}
    </div>
  )
};

export default App;
