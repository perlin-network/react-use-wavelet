import React, { useState, useCallback } from 'react';
import { useWavelet, useAccount, useContract } from 'react-use-wavelet';
import { Wavelet } from 'wavelet-client';
import './App.css';

import JSBI from "jsbi";
const BigInt = JSBI.BigInt;

const Yo = () => {
  // First get a working client
  const [client, node, clientErr] = useWavelet('http://localhost:9000');
//https://testnet.perlin.net');

  // To get a Wavelet Account
  const [account, accountErr] = useAccount(client, '87a6813c3b4cf534b6ae82db9b1409fa7dbd5c13dba5858970b56084c4a930eb400056ee68a7cc2695222df05ea76875bc27ec6e61e8e62317c336157019c405');
  const [chatLogs, setChatLogs] = useState([]);

  // callback to console log results of contract 'get_messages' function every time wavelet reaches consensus;

  const onUpdate = useCallback((contract) => {
    const wallet = Wavelet.loadWalletFromPrivateKey('87a6813c3b4cf534b6ae82db9b1409fa7dbd5c13dba5858970b56084c4a930eb400056ee68a7cc2695222df05ea76875bc27ec6e61e8e62317c336157019c405');
    setChatLogs(contract.test(wallet, 'get_messages', BigInt(0)).logs);
  }, []);

  // callback to console log results of contract 'get_messages' function after contract loads
  const onLoad = useCallback((contract) => {
    const wallet = Wavelet.loadWalletFromPrivateKey('87a6813c3b4cf534b6ae82db9b1409fa7dbd5c13dba5858970b56084c4a930eb400056ee68a7cc2695222df05ea76875bc27ec6e61e8e62317c336157019c405');
    setChatLogs(contract.test(wallet, 'get_messages', BigInt(0)).logs);
  }, []);

  // To get a Wavelet Contract, and register callbacks
  const [contract] = useContract(client, '8b951261c83b5213330ac97c683cc3f4415ba02d621760f897ef6991652219ba', onUpdate, onLoad);

  // To call a contract function
  const sendMessage = (message) => {
    const wallet = Wavelet.loadWalletFromPrivateKey('87a6813c3b4cf534b6ae82db9b1409fa7dbd5c13dba5858970b56084c4a930eb400056ee68a7cc2695222df05ea76875bc27ec6e61e8e62317c336157019c405');
    contract && contract.call(wallet, 'send_message', BigInt(0), BigInt(25000), BigInt(0), {
      type: 'string',
      value: message
    });
  };

  return (
  <div>
    Balance: {account ? account.balance : 'account not loaded'}
    Public Key: {account ? account.pulic_key : 'account not loaded'}
    <button onClick={() => sendMessage('Yo')}>Yo</button>
    <textarea
        rows={35}
        readOnly
        value={chatLogs.length === 1 ? chatLogs[0] : ''}
    />
  </div>
  );
};

function App() {
  return (
    <div className="App">
      <Yo/>
    </div>
  );
}

export default App;
