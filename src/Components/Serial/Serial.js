import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import fs from 'fs';

const { ipcRenderer, remote } = require('electron');

const serialPort = remote.require('serialport');
const Readline = serialPort.parsers.Readline;

export default function Serial() {
  const [state, setState] = useState({ data: 0 });
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
    openPorts.filter((port) => port.port.path === e.target.dataset.path);
    console.log(openPorts);
    console.log("'''''''''''''''''''''", e.target.dataset.path);
    console.log(
      openPorts.filter((port) => port.port.path === e.target.dataset.path)[0]
    );
    openPorts
      .filter((port) => port.port.path === e.target.dataset.path)[0]
      .port.write(state.data, function (err) {
        if (err) {
          console.log('err: ' + err);
        }
      });
    }

    const renderList = (el) => {
      const paths = openPorts.map((e) => e.port.path);

      return el.map((port, i) => (
        <div key={port.path}>
          <div
            onClick={(e) => onClickHandler(e)}
            data-index={i}
            data-path={port.path}
          >
            {port.manufacturer}
            <span onClick={(e) => e.stopPropagation()}>
              {paths.indexOf(port.path) !== -1 ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          {paths.indexOf(port.path) !== -1 ? (
            <form
              data-path={port.path}
              onChange={(e) => changeHandler(e)}
              onSubmit={(e) => submitHandler(e)}
            >
              <label>
                Your data:
                <input
                  onClick={(e) => e.stopPropagation()}
                  data-path={port.path}
                  type="text"
                  name="name"
                  value={state.data}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          ) : (
            ''
          )}
        </div>
      ));
    };


  return (
    <div>
      <div>
        <div>{state.data}</div>
        <div>{renderList(devices)}</div>
      </div>
    </div>
  )
}
