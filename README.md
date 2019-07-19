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

// To get a Wavelet Contract
const [contract] = useContract(client, 'contract addr');
}
```

You can use `contract` and `client` objects in the same way as documented in the [wavelet-client-js docs](https://github.com/perlin-network/wavelet-client-js)
