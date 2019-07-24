import React, { useState } from 'react';
import { useWavelet, useAccount, useContract } from 'react-use-wavelet';
import { Wavelet } from 'wavelet-client';

import logo from './logo.svg';
import './App.css';

import JSBI from "jsbi";
const BigInt = JSBI.BigInt;


function Account({client}) {
  const [key, setKey] = useState(Buffer.from(Wavelet.generateNewWallet().secretKey, "binary").toString("hex"));
  const [account, error] = useAccount(client, key);
  const onKeyChange = (e) => setKey(e.target.value);
  return (
    <div className="box">
      <div>
      <label>
        Key:
        <input value={key} onChange={onKeyChange}/>
      </label>
      </div>
      <div>
      Balance: {account ? account.balance : "disconnected"}
      </div>
      <div>
      PubKey: {account && account.public_key}
      </div>
    </div>
  );
}

function Contract({ client}) {
  const [addr, setAddr] = useState("");
  const [contract, error] = useContract(client, addr);
  const onKeyChange = (e) => setAddr(e.target.value);
  return (
    <div className="box">
      <div>
        <label>
          Key:
          <input value={addr} onChange={onKeyChange}/>
        </label>
      </div>
      <div>
        ID: {contract ? contract.contract_id: "not loaded"}
      </div>
    </div>
  );
}

function Client() {
  const [host, setHost] = useState("https://testnet.perlin.net");
  const [client, node, error] = useWavelet(host);
  console.log(node);
  const [accounts, setAccounts] = useState([1]);
  const [contracts, setContracts] = useState([1]);
  const onHostChange = (e) => setHost(e.target.value);
  return (
    <div className="box">
      <div>
        Connected: {(client && true) ? "connected": "disconnected"}
      </div>
      <div>
      <label>
        Host:
        <input value={host} onChange={onHostChange}/>
      </label>
      </div>
      <div className="box">
      Accounts:
      {accounts.map(x => <Account client={client} key={x}/>)}
      <button onClick={() => setAccounts(accounts.concat(accounts.length + 1))}>Add Account</button>
      <button onClick={() => setAccounts(accounts.slice(1))}>Remove Account</button>
      </div>
      <div>
        Contracts:
        {contracts.map(x => <Contract client={client} key={x}/>)}
        <button onClick={() => setContracts(contracts.concat(contracts.length + 1))}>Add Contract</button>
        <button onClick={() => setContracts(contracts.slice(1))}>Remove Contract</button>
      </div>
    </div>
  );
}

function App() {
  const [clients, setClients] = useState([1]);
  return (
    <div className="App">
      <MyAccount/>
      <div>
        <button onClick={() => setClients(clients.concat(clients.length + 1))}>Add Client</button>
        <button onClick={() => setClients(clients.slice(1))}>Remove Client</button>
      </div>
      {clients.map(x => (
        <Client key={x}/>
      ))}
    </div>
  );
}

export default App;


const MyAccount = () => {
  // First get a working client
  const [client, node, clientErr] = useWavelet('https://testnet.perlin.net');

  // To get a Wavelet Account
  const [account, accountErr] = useAccount(client, 'd1bb4967e56a51127cfadd08b13ed801ab58a66e8b7244ca5482e2b640c4de42bcd756c4823a651640ed0e2045195d43ff851784aaa262321f921bd9bcac8be8');
  const [chatLogs, setChatLogs] = useState([]);

  // callback to console log results of contract 'get_messages' function every time wavelet reaches consensus;
  const onUpdate = (contract) => {
    setChatLogs(contract.test('get_messages', BigInt(0)).logs);
  };

  // callback to console log results of contract 'get_messages' function after contract loads
  const onLoad = (contract) => {
    setChatLogs(contract.test('get_messages', BigInt(0)).logs);
  };

  // To get a Wavelet Contract, and register callbacks
  const [contract] = useContract(client, '9f549686e464b2addfdcd5061deeeb7c622ea430c5f93ddaf5cf8a8f114f8b65', onUpdate, onLoad);

  // To call a contract function
  const sendMessage = (message) => {
    const wallet = Wavelet.loadWalletFromPrivateKey('d1bb4967e56a51127cfadd08b13ed801ab58a66e8b7244ca5482e2b640c4de42bcd756c4823a651640ed0e2045195d43ff851784aaa262321f921bd9bcac8be8');
    contract.call(wallet, 'send_message', BigInt(0), BigInt(250000), {
      type: 'string',
      value: message
    });
  };

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
