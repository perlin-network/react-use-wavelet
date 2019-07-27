'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var waveletClient = require('wavelet-client');

/**
 * Connects to a Wavelet node
 *
 * @param {str} host Url of the host you wish to connect to
 * @returns {[ WaveletClient, WaveletNode, Error ]} The Wavelet Client, Node info, and any errors returned
 */
const useWavelet = host => {
  const [client, setClient] = React.useState(undefined);
  const [node, setNodeInfo] = React.useState(undefined);
  const [error, setError] = React.useState(undefined);

  React.useEffect(() => {
    const connect = async () => {
      try {
        const newClient = new waveletClient.Wavelet(host);
        setNodeInfo(await newClient.getNodeInfo());
        setClient(newClient);
        setError(undefined);
      } catch (e) {
        setNodeInfo(undefined);
        setClient(undefined);
        setError(e);
      }
    };
    if (host) {
      connect();
    }
  }, [host]);

  // TODO: Add single listener for consensus events

  return [client, node, error];
};

/**
 * Fetches info of a Wavelet Account and listens to updates
 *
 * @param {WaveletClient} client client used for querying
 * @param {string} privateKey 64 char hex encoded private key
 * @returns {[ Account, Error ]} A reactive Account, and any errors returned
 */
const useAccount = (client, privateKey) => {
  const [account, setAccount] = React.useState(undefined);
  const [error, setError] = React.useState(undefined);
  const [accountSocket, setAccountSocket] = React.useState(undefined);

  const accountRef = React.useRef(account);
  React.useEffect(() => {
    accountRef.current = account;
  }, [account]);

  const accountSocketRef = React.useRef(accountSocket);
  React.useEffect(() => {
    accountSocketRef.current = accountSocket;
  }, [accountSocket]);

  React.useEffect(() => {
    const reset = () => {
      setAccount(undefined);
      if (accountSocketRef.current) {
        accountSocketRef.current.close(1000, 'closing account connection');
      }
      setAccountSocket(undefined);
    };

    const connect = async () => {
      try {
        const wallet = waveletClient.Wavelet.loadWalletFromPrivateKey(privateKey);
        const walletAddress = Buffer.from(wallet.publicKey).toString('hex');
        setAccount(await client.getAccount(walletAddress));

        setAccountSocket(
          await client.pollAccounts(
            {
              onAccountUpdated: msg => {
                switch (msg.event) {
                  case 'balance_updated': {
                    setAccount({
                      ...accountRef.current,
                      balance: msg.balance
                    });
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }
            },
            { id: walletAddress }
          )
        );
        setError(undefined);
      } catch (error) {
        reset();
        // Cannot throw due to react hook limitations
        setError(error);
      }
    };

    if (privateKey && client) {
      connect();
    } else {
      reset();
    }
    return reset;
  }, [client, privateKey]);

  return [account, error];
};

/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback contractCallback
 * @param {Contract} contract Contract that can be interacted wit
 */

/**
 * Fetches and instantiates a Wavelet contract for interaction
 *
 * @param {WaveletClient} client client used for interacting with contract
 * @param {string} contractAddress 64 char hex encoded contract address
 * @param {contractCallback} onUpdate 64 char hex encoded contract address
 * @param {contractCallback} onLoad 64 char hex encoded contract address
 * @returns {[ Contract, Error ]} A reactive Contract, and any errors returned
 */
const useContract = (client, contractAddress, onUpdate, onLoad) => {
  const [contract, setContract] = React.useState(null);
  const [consensusSocket, setConsensusSocket] = React.useState(null);
  const [error, setError] = React.useState(undefined);

  const consensusSocketRef = React.useRef(consensusSocket);
  React.useEffect(() => {
    consensusSocketRef.current = consensusSocket;
  }, [consensusSocket]);

  React.useEffect(() => {
    const reset = () => {
      if (consensusSocketRef.current) {
        consensusSocketRef.current.close(1000, 'closing consensusSocket');
      }
      setConsensusSocket(undefined);
      setContract(undefined);
    };

    const init = async () => {
      try {
        const newContract = new waveletClient.Contract(client, contractAddress);
        // Initialize
        await newContract.init();
        await newContract.fetchAndPopulateMemoryPages();

        setContract(newContract);
        setError(undefined);
      } catch (e) {
        reset();
        setError(e);
      }
    };

    if (!client) {
      reset();
    } else {
      init();
    }
    return reset;
  }, [client, contractAddress]);

  React.useEffect(() => {
    onLoad && contract && onLoad(contract);
  }, [contract, onLoad]);

  React.useEffect(() => {
    const listen = async () => {
      if (!client || !contract || !onUpdate) return;
      try {
        setConsensusSocket(
          // Every single time consensus happens on Wavelet, query for the latest memory and call update
          await client.pollConsensus({
            onRoundEnded: _ => {
              if (contract === undefined) {
                return;
              }

              (async () => {
                await contract.fetchAndPopulateMemoryPages();
                onUpdate(contract);
              })();
            }
          })
        );
      } catch (e) {
        setError(e);
      }
    };
    listen();
    return () => {
      if (consensusSocketRef.current) {
        consensusSocketRef.current.close(1000, 'closing consensusSocket');
      }
      setConsensusSocket(undefined);
    };
  }, [client, contract, onUpdate]);

  return [contract, error];
};

exports.useAccount = useAccount;
exports.useContract = useContract;
exports.useWavelet = useWavelet;
