import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import moment from 'moment';
import fs from 'fs';

const { remote } = require('electron');
const serialPort = remote.require('serialport');
// const list = remote.require('@serialport/list');
//const bindings = remote.require('@serialport/bindings');

// Importing dialog module using remote
const dialog = remote.dialog;

import './App.global.css';

const Readline = serialPort.parsers.Readline;

const Hello = () => {
  const [state, setState] = useState({ data: 'test' });
  const [searching, setSearching] = useState(true);
  const [devices, setDevices] = useState([]);
  const [openPorts, setOpenPorts] = useState([]);

  const intervalId = useRef();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (searching) {
        console.log('RECONNECTING TO ARDUINO');
        getDevices();
      }
    }, 1000);
    return () => clearInterval(intervalId.current);
  }, [searching]);

  const getDevices = async () => {
    const list = await serialPort.list();
    const newList = list.filter((e) => e.manufacturer != undefined);
    setDevices(newList);
  };

  const connectDevice = (path) => {
    const item = openPorts.filter((e) => e.port.path === path);
    if (item.length === 0) {
      var sp = new serialPort(path, {
        baudRate: 9600,
      });

      setOpenPorts([...openPorts, { port: sp, connected: true }]);
      sp.open(() => {
        //setClosed(false);
        console.log('Opened');
      });
      const parser = sp.pipe(new Readline({ delimiter: '\r\n' }));
      parser.on('data', function (data) {
        setState({ data });
        console.log('Data:', data);
      });

      sp.on('close', () => {
        sp.close(() => console.log('Closed'));
        const items = openPorts.filter((e) => e.port.path != path);
        setOpenPorts([...items]);
      });
    } else {
      item[0].port.close(() => console.log('Closed'));
      const items = openPorts.filter((e) => e.port.path != path);
      setOpenPorts([...items]);
      console.log(`Device at ${path} is alread connected`);
    }
  };

  const changeHandler = (e) => {
    e.preventDefault();
    const data = e.target.value;
    setState({ data });
  };

  const onClickHandler = (e) => {
    // e.stopPropagation();
    console.log(e.target.dataset.path);
    connectDevice(e.target.dataset.path);
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

  const renderList = (el) => {
    const paths = openPorts.map((e) => e.port.path);

    return el.map((e, i) => (
      <div
        onClick={(e) => onClickHandler(e)}
        data-index={i}
        data-path={e.path}
        key={e.path}
      >
        {e.manufacturer}
        <span onClick={(e) => e.stopPropagation()}>
          {paths.indexOf(e.path) !== -1 ? 'Connected' : 'Not Connected'}
        </span>
      </div>
    ));
  };

  return (
    <div>
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
      <div>{renderList(devices)}</div>
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
