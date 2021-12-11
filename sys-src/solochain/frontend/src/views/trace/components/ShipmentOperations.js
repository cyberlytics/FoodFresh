import React, { useState } from 'react';
import { Dropdown, TextInput, Form } from 'carbon-components-react';
import { TxButton } from '../../../substrate-lib/components';
import { hexToString } from '@polkadot/util';

export default function Main(props) {
  const { accountPair, shipment } = props;
  const [status, setStatus] = useState(null);
  const [state, setState] = useState({
    latitude: 0.0,
    longitude: 0.0,
    deviceId: '',
    sensorType: '',
    sensorValue: 0.0
  });

  const sensorTypes = [
    'Humidity', 'Pressure', 'Shock', 'Tilt',
    'Temperature', 'Vibration'].map(v => ({value: v, text: v}));

  const handleChange = (_, data) => {
    setState({...state, [data.state]: data.value});
  }

  if (!shipment) return null;

  return (
    <div>
      <TxButton
        accountPair={accountPair}
        label='Pickup'
        type='SIGNED-TX'
        setStatus={setStatus}
        style={{display: shipment.status.isPending ? 'inline-block' : 'none'}}
        attrs={{
          palletRpc: 'productTracking',
          callable: 'trackShipment',
          inputParams: [hexToString(shipment.id.toString()), 'Pickup', Date.now().toString(), null, null],
          paramFields: [{optional: false}, {optional: false}, {optional: false}, {optional: true}, {optional: true}]
        }}
      />
      <Form style={{display: shipment.status.isInTransit ? 'inline-block' : 'none'}}>
        <TextInput
          id="latitude"
          labelText="Latitude"
          placeholder="Enter a value"
          type='text'
          state='latitude'
          value={state.latitude}
          onChange={handleChange}
        />
        <br/>
        <TextInput
          id="longitude"
          labelText="Longitude"
          placeholder="Enter a value"
          type='text'
          state='longitude'
          value={state.longitude}
          onChange={handleChange}
        />
        <br/>
        <TextInput
          id="deviceId"
          labelText="Device ID"
          placeholder="Enter an id"
          type='text'
          state='deviceId'
          value={state.deviceId}
          onChange={handleChange}
        />
        <br/>
        <Dropdown
          id="default"
          titleText="Sensor type"
          label="Select a sensor type"
          items={sensorTypes}
          itemToString={(item) => (item ? item.text : '')}
          onChange={event => setState({...state, sensorType: event.selectedItem})}
        />
        <br/>
        <TxButton
          accountPair={accountPair}
          label='Scan'
          type='SIGNED-TX'
          setStatus={setStatus}
          attrs={{
            palletRpc: 'productTracking',
            callable: 'trackShipment',
            inputParams: [shipment.id, 'Scan', Date.now(),
              (state.latitude !== 0.0 && state.longitude !== 0.0 ? {
                latitude: state.latitude,
                longitude: state.longitude
              } : null),
              (state.deviceId !== '' && state.sensorType !== '' && state.sensorValue !== 0.0
                ? [{
                  deviceId: state.deviceId,
                  readingType: state.sensorType,
                  timestamp: Date.now(),
                  value: state.sensorValue
                }]
                : null)
            ],
            paramFields: [{optional: false}, {optional: false}, {optional: false}, {optional: true}, {optional: true}]
          }}
        />
        <TxButton
          accountPair={accountPair}
          label='Deliver'
          type='SIGNED-TX'
          setStatus={setStatus}
          attrs={{
            palletRpc: 'productTracking',
            callable: 'trackShipment',
            inputParams: [shipment.id, 'Deliver', Date.now(), null, null],
            paramFields: [{optional: false}, {optional: false}, {optional: false}, {optional: true}, {optional: true}]
          }}
        />
      </Form>
      <p style={{display: shipment.status.isDelivered ? 'inline-block' : 'none'}}>
        No operation available: Shipment has been delivered.
      </p>
    </div>
  );
}
