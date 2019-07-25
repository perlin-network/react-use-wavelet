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
