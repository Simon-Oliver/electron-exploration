import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import moment from 'moment';
import fs from 'fs';

const { remote } = require('electron');
const serialPort = remote.require('serialport');
// const list = remote.require('@serialport/list');
const bindings = remote.require('@serialport/bindings');

var listOfPorts = [];

// Importing dialog module using remote
const dialog = remote.dialog;

import './App.global.css';

const Readline = serialPort.parsers.Readline;

const Hello = () => {
  const [state, setState] = useState({ data: 'test' });
  const [closed, setClosed] = useState(true);

  const intervalId = useRef();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (closed) {
        console.log('RECONNECTING TO ARDUINO');
        connect();
      }
    }, 1000);
    return () => clearInterval(intervalId.current);
  }, [closed]);

  const connect = async () => {
    const list = await serialPort.list();

    list.forEach((e) => {
      if (e.manufacturer === 'SparkFun') {
        var sp = new serialPort(e.path, {
          baudRate: 9600,
        });
        sp.open(() => {
          setClosed(false);
          console.log('Opened');
        });
        const parser = sp.pipe(new Readline({ delimiter: '\r\n' }));
        parser.on('data', function (data) {
          console.log('Data:', data);
        });

        sp.on('close', () => {
          sp.close(() => console.log('Closed'));
          setClosed(true);
        });

        console.log(e.path);
      }
    });
  };

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
