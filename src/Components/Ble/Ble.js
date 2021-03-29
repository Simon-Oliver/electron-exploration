import React, {useState, useEffect} from 'react'

const { ipcRenderer, remote } = require('electron');
const serialPort = remote.require('serialport');
const BrowserWindow = remote.BrowserWindow;
// const list = remote.require('@serialport/list');
//const bindings = remote.require('@serialport/bindings');

// Importing dialog module using remote
const dialog = remote.dialog;

export default function Ble() {
  const [temp,setTemp] = useState(null)
  const [myCharacteristic, setCharacteristic] = useState()

  const handleValueChange = (event) => {
    const tempValue = event.target.value.getUint8(0);
    setTemp(tempValue)
  }

const onStopButtonClick = () => {
    if (myCharacteristic) {
      myCharacteristic.stopNotifications()
      .then(_ => {
        console.log('> Notifications stopped');
        myCharacteristic.removeEventListener('characteristicvaluechanged',
        handleValueChange);
      })
      .catch(error => {
        console.log('Argh! ' + error);
      });
    }
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
          setCharacteristic(characteristic)
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

  return (
    <div>
      {temp ? temp : ""}
      <button onClick={() => ble()}>Bluethooth</button>
        <button onClick={() => bleConnect()}>Connect</button>
        <button onClick={() => onStopButtonClick()}>Stop</button>
    </div>
  )
}
