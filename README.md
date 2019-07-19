# `react-use-wavelet`

React hooks to easily integrate [Wavelet](https://wavelet.perlin.net) smart contracts into your React application. 

## Setup

```shell
yarn add react-use-wavelet
```

## Usage

```javascript
import React, { useState } from "react";
import { useWavelet, useAccount, useContract } from 'react-use-wavelet';

const MyAccount = () => {
// First get a working client
const [client, node, clientErr] = useWavelet('https://testnet.perlin.net');

// To get a Wavelet Account
const [account, accountErr] = useAccount(client, 'yourprivatekey');

// callback to console log results of contract 'log' function every time contract updates;
const onUpdate = (contract) => {
  const results = contract.test('logs', BigInt(0)).logs[0].split('\n');
  console.log(results);
};

// callback to console log results of contract 'log' function after contract loads
const onLoad = (contract) => {
  const results = contract.test('logs', BigInt(0)).logs[0].split('\n');
  console.log(results);
};

// To get a Wavelet Contract, and register callbacks
const [contract] = useContract(client, 'contract addr', onUpdate, onLoad);
}
```

You can use `contract` and `client` objects in the same way as documented in the [wavelet-client-js docs](https://github.com/perlin-network/wavelet-client-js)
