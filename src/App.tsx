import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import fs from 'fs';
import Nav from './Components/Nav';
import Ble from './Components/Ble';
import Serial from './Components/Serial';

const { ipcRenderer, remote } = require('electron');
const serialPort = remote.require('serialport');
const BrowserWindow = remote.BrowserWindow;
// const list = remote.require('@serialport/list');
//const bindings = remote.require('@serialport/bindings');

// Importing dialog module using remote
const dialog = remote.dialog;

import './App.global.css';

const Readline = serialPort.parsers.Readline;

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

  function handleValueChange(event) {
    const batteryLevel = event.target.value.getUint8(0);
    console.log('Battery percentage is ' + batteryLevel);
  }

  const ble = () => {
    ipcRenderer.invoke('perform-action', { test: 'test ble' });

    ipcRenderer.on('channelForBluetoothDeviceList', (event, list) => {
      let newList = list.filter((e) => !e.deviceName.includes('Unknown'));
      console.log(newList);
    });

    try {
      const filters = [];
      filters.push({ namePrefix: 'MOB' });
      console.log(`Using filters: ${JSON.stringify(filters)}`);
      navigator.bluetooth
        .requestDevice({
          acceptAllDevices: true,
          optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'],
        })
        .then((device) => device.gatt.connect())
        .then((server) => {
          // Note that we could also get all services that match a specific UUID by
          // passing it to getPrimaryServices().
          console.log('Getting Services...');
          return server.getPrimaryServices(
            '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
          );
        })
        .then((service) => {
          // Getting custom Characteristic from ESP32
          console.log(service);
          return service[0].getCharacteristic(
            'beb5483e-36e1-4688-b7f5-ea07361b26a8'
          );
        })
        .then((characteristic) => {
          // Reading ESP32
          characteristic.addEventListener(
            'characteristicvaluechanged',
            handleValueChange
          );
          // Reading ESP32
          return characteristic.startNotifications();
        });

      // .then((services) => {
      //   function getSupportedProperties(characteristic) {
      //     let supportedProperties = [];
      //     for (const p in characteristic.properties) {
      //       if (characteristic.properties[p] === true) {
      //         supportedProperties.push(p.toUpperCase());
      //       }
      //     }
      //     return '[' + supportedProperties.join(', ') + ']';
      //   }

      //   console.log('Getting Characteristics...');
      //   let queue = Promise.resolve();
      //   services.forEach((service) => {
      //     queue = queue.then((_) =>
      //       service.getCharacteristics().then((characteristics) => {
      //         console.log('> Service: ' + service.uuid);
      //         characteristics.forEach((characteristic) => {
      //           console.log(
      //             '>> Characteristic: ' +
      //               characteristic.uuid +
      //               ' ' +
      //               getSupportedProperties(characteristic)
      //           );
      //         });
      //       })
      //     );
      //   });
      //   return queue;
      // })
      // .catch((error) => {
      //   console.error('Argh! ' + error);
      // });
    } catch (e) {
      console.log('EXCEPTION> ' + e);
    }
  };

  const bleConnect = () => {
    ipcRenderer.send('channelForSelectingDevice', 'E7:D3:34:E2:11:75');
  };

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
        <button onClick={() => print()}>Print</button>
        <button onClick={() => ble()}>Bluethooth</button>
        <button onClick={() => bleConnect()}>Connect</button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <div className="container">
        <Nav></Nav>

        <div className="main">
          <Switch>
            <Route exact path="/" component={Hello} />
            <Route exact path="/serial" component={Serial} />
            <Route exact path="/ble" component={Ble} />
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
}
