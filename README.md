# `react-use-wavelet`
[![npmjs.com](https://img.shields.io/npm/v/react-use-wavelet.svg)](https://www.npmjs.com/package/react-use-wavelet)
[![codecov](https://codecov.io/gh/perlin-network/react-use-wavelet/branch/master/graph/badge.svg)](https://codecov.io/gh/perlin-network/react-use-wavelet)
[![Discord Chat](https://img.shields.io/discord/458332417909063682.svg)](https://discord.gg/dMYfDPM)

React hooks to easily integrate [Wavelet](https://wavelet.perlin.net) smart contracts into your React application. 

## Setup

```shell
yarn add react-use-wavelet
```

## Usage

```jsx
import React, {useCallback, useState} from "react";
import { useWavelet, useAccount, useContract } from 'react-use-wavelet';
import { Wavelet } from 'wavelet-client';
import JSBI from "jsbi";
const BigInt = JSBI.BigInt;

const MyAccount = () => {
  // First get a working client
  const [client, node, clientErr] = useWavelet('https://testnet.perlin.net');
  // To get a Wavelet Account
  const [account, accountErr] = useAccount(client, 'yourprivatekey');
  
  const [chatLogs, setChatLogs] = useState([]);
  // callback to set chat logs  to results of contract 'get_messages' function
  const loadLogs = useCallback((contract) => {
    const wallet = Wavelet.loadWalletFromPrivateKey('yourprivatekey');
    setChatLogs(contract.test(wallet, 'get_messages', BigInt(0)).logs);
  }, []);
  // load logs every time wavelet reaches consensus;
  const onUpdate = loadLogs;
  
  // load logs after contract loads
  const onLoad = loadLogs;
  
  // To get a Wavelet Contract, and register callbacks
  const [contract] = useContract(client, 'contract addr', onUpdate, onLoad);

  // To call a contract function
  const sendMessage = (message) => {
    const wallet = Wavelet.loadWalletFromPrivateKey('yourprivatekey');
    contract.call(wallet, 'send_message', BigInt(0), BigInt(250000), BigInt(0),  {
      type: 'string',
      value: message
    });
  }

  return (
  <div>
    Balance: {account ? account.balance : 'account not loaded'}
    Public Key: {account ? account.pulic_key : 'account not loaded'}
    <button onClick={() => sendMessage('Yo')} />
    <textarea
        rows={35}
        readOnly
        value={chatLogs.length === 1 ? chatLogs[0] : ''}
    />
  </div>
  )
}
```

You can use `contract` and `client` objects in the same way as documented in the [wavelet-client-js docs](https://github.com/perlin-network/wavelet-client-js)
