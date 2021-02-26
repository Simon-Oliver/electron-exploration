import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import styles from './styleApp.module.css';
const path = require('path');
import { createInvoice } from './utils/createInvoice';
const pdf = require('html-pdf');
import Settings from './components/Settings';

const { remote } = require('electron');
const serialPort = remote.require('serialport');
const BrowserWindow = remote.BrowserWindow;
// const list = remote.require('@serialport/list');
//const bindings = remote.require('@serialport/bindings');

// Importing dialog module using remote
const dialog = remote.dialog;

import './App.global.css';

const Readline = serialPort.parsers.Readline;

//-------------- Test Data -----------------
const invoice = [
  {
    name: 'John Doe',
    invoiceNumber: 1234,
  },
  {
    name: 'Max Muster',
    invoiceNumber: 888888,
  },
  {
    name: 'Thomas Tester',
    invoiceNumber: 999999,
  },
];

//-------------- Test Data -----------------

const Hello = () => {
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

    setState({ data: 0 });
    // let filename = dialog
    //   .showSaveDialog({})
    //   .then((result) => {
    //     filename = result.filePath + '.txt';
    //     if (filename === undefined) {
    //       alert("the user clicked the btn but didn't created a file");
    //       return;
    //     }
    //     fs.writeFile(filename, 'test 123', (err) => {
    //       if (err) {
    //         alert('an error ocurred with file creation ' + err.message);
    //         return;
    //       }
    //       alert('WE CREATED YOUR FILE SUCCESFULLY');
    //     });
    //     alert('we End');
    //   })
    //   .catch((err) => {
    //     alert(err);
    //   });
  };

  useEffect(() => {
    console.log(openPorts);
  }, [openPorts]);

  const print = () => {
    // console.log('Before: ', openPorts);
    // openPorts.forEach((e) => {
    //   e.port.close();
    // });
    // setOpenPorts([]);
    // setDevices([]);
    // app.relaunch();
    // let win = BrowserWindow.getFocusedWindow();
    // let win = BrowserWindow.getAllWindows()[0];

    let win = new BrowserWindow({
      show: false,
      webPreferences: {
        // You need this options to load pdfs
        plugins: true, // this will enable you to use pdfs as source and not just download it.
      },
    });

    var options = {
      marginsType: 0,
      pageSize: 'A4',
      printBackground: true,
      printSelectionOnly: false,
      landscape: false,
    };

    // createInvoice(invoice, __dirname + '/pdfs/testNEW.pdf');
    // var options = { format: 'Letter' };
    // pdf
    //   .create(template, options)
    //   .toFile('./pdfs/testNEW.pdf', function (err, res) {
    //     if (err) return console.log(err);
    //     console.log(res); // { filename: '/app/businesscard.pdf' }
    //   });
    const fileID = uuidv4();
    const filePath = __dirname + `/pdfs/temp/${fileID}.pdf`;
    //win.loadURL('file://' + filePath);
    // win.webContents.on('did-frame-finish-load', () => {
    //   win.webContents.print({ printBackground: true });
    // });
    //win.webContents.print();
    // win.webContents.print((success, failureReason) => {
    //   if (!success) console.log(failureReason);

    //   console.log('Print Initiated');
    // });

    let html = '';

    invoice.forEach((e) => {
      html += createInvoice(e);
    });

    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    win.webContents.on('did-frame-finish-load', () => {
      // win.webContents.print({ printBackground: true });
      win.webContents
        .printToPDF(options)
        .then((data) => {
          fs.writeFile(filePath, data, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('PDF Generated Successfully');
              let winPDF = new BrowserWindow({
                webPreferences: {
                  // You need this options to load pdfs
                  plugins: true, // this will enable you to use pdfs as source and not just download it.
                },
              });
              winPDF.loadURL(`file://${filePath}`).then(() => {
                fs.unlink(filePath, (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }

                  //file removed
                });
              });
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    //win.loadURL(`file://${filePath}`);
    // win.webContents.on('did-frame-finish-load', () => {
    //   win.webContents.print({ printBackground: true });
    // });

    console.log(createInvoice(invoice));
    // win.webContents.print((success, failureReason) => {
    //   if (!success) console.log(failureReason);

    //   console.log('Print Initiated');
    // });
  };

  const ble = () => {
    console.log(
      `>>>> navigator.bluetooth.requestDevice: ${navigator.bluetooth.requestDevice}`
    );
    try {
      const filters = [];
      filters.push({ namePrefix: 'MOB' });
      console.log(`Using filters: ${JSON.stringify(filters)}`);
      navigator.bluetooth
        .requestDevice({ acceptAllDevices: true })
        .then((device) => {
          console.log('> Name:             ' + device);
          // console.log('> Id:               ' + device.id);
          // console.log(
          //   '> UUIDs:            ' + device.uuids.join('\n' + ' '.repeat(20))
          // );
          //console.log('> Connected:        ' + device.gatt.connected);
        })
        .catch((error) => {
          console.error('Argh! ' + error);
        });
    } catch (e) {
      console.log('EXCEPTION> ' + e);
    }
  };

  const renderList = (el) => {
    const paths = openPorts.map((e) => e.port.path);

    return el.map((port, i) => (
      <div key={port.path} className={styles.item}>
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
    <div className={styles.gridContainer}>
      <div className={styles.navContainer}>
        <Link to="/settings">
          <img className={styles.navItem} src={'./icons/bluetooth-24px.svg'} />
        </Link>
        <div className={styles.navItem}>tt</div>
        <div className={styles.navItem}>tt</div>
        <div className={styles.navItem}>tt</div>
        <div className={styles.navItem}>tt</div>
      </div>
      <div className={styles.mainContainer}>
        <div>{state.data}</div>
        <div>{renderList(devices)}</div>
        <button onClick={() => print()}>Print</button>
        <button onClick={() => ble()}>Bluethooth</button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/settings" component={Settings} />
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
