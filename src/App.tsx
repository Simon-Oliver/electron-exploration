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
          setClosed(true);
          console.log('Closed');
        });

        console.log(e.path);
      }
    });
  };

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  if (closed) {
    useInterval(function () {
      console.log('RECONNECTING TO ARDUINO');
      connect();
    }, 1000);
  }

  useEffect(() => {
    // //called automatically by bindings.list()
    // function list(ports) {
    //   listOfPorts = ports;
    //   // now listOfPorts will be the port Objects
    //   listOfPorts.forEach((e) => {
    //     if (e.manufacturer === 'SparkFun') {
    //       console.log(e.path);
    //       var sp = new serialPort(e.path, {
    //         baudRate: 9600,
    //       });
    //       //parse incoming data line-by-line from serial port.
    //       const parser = sp.pipe(new Readline({ delimiter: '\r\n' }));
    //       parser.on('open', () => console.log('====== Open ======'));
    //       parser.on('data', function (data) {
    //         console.log('Data:', data);
    //       });
    //       parser.on('close', function () {
    //         console.log('---- Disconnected ------');
    //       });
    //     }
    //   });
    // }
    // bindings.list().then(list, (err) => {
    //   process.exit(1);
    // });
  }, [closed]);

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
