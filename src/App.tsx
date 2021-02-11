import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import moment from 'moment';
import fs from 'fs';

const { remote } = require('electron');

// Importing dialog module using remote
const dialog = remote.dialog;

import './App.global.css';

const Hello = () => {
  const [state, setState] = useState({ data: 'test' });

  const changeHandler = (e) => {
    e.preventDefault();
    const data = e.target.value;
    setState({ data });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    let filename = dialog
      .showSaveDialog({})
      .then((result) => {
        filename = result.filePath + '.txt';
        if (filename === undefined) {
          alert("the user clicked the btn but didn't created a file");
          return;
        }
        fs.writeFile(filename, 'test 123', (err) => {
          if (err) {
            alert('an error ocurred with file creation ' + err.message);
            return;
          }
          alert('WE CREATED YOUR FILE SUCCESFULLY');
        });
        alert('we End');
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <span>{moment().format()}</span>
      <form
        onChange={(e) => changeHandler(e)}
        onSubmit={(e) => submitHandler(e)}
      >
        <label>
          Your data:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>{state.data}</div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
