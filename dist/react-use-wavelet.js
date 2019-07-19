'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var wc = _interopDefault(require('wavelet-client'));

const { Contract, Wavelet } = wc;

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
        const newClient = new Wavelet(host);
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
    const connect = async () => {
      try {
        const wallet = Wavelet.loadWalletFromPrivateKey(privateKey);
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
        // Cannot throw due to react hook limitations
        setAccount(undefined);
        if (accountSocketRef.current) {
          accountSocketRef.current.close(1000, 'closing account connection');
        }
        setAccountSocket(undefined);
        setError(error);
      }
    };

    if (privateKey) {
      connect();
    }
  }, [client, privateKey]);

  return [account, error];
};

/**
 * Fetches and instantiates a Wavelet contract for interaction
 *
 * @param {WaveletClient} client client used for interacting with contract
 * @param {string} contractAddress 64 char hex encoded contract address
 * @returns {[ Contract, Error ]} A reactive Contract, and any errors returned
 */
const useContract = (client, contractAddress, onUpdate, onLoad) => {
  const [contract, setContract] = React.useState(null);
  const [, setConsensusSocket] = React.useState(null);
  const [error, setError] = React.useState(undefined);

  React.useEffect(() => {
    const fn = async () => {
      if (!client) return null;
      const newContract = new Contract(client, contractAddress);

      // Initialize
      await newContract.init();

      // Every single time consensus happens on Wavelet, query for the latest memory and call update
      setConsensusSocket(
        await client.pollConsensus({
          onRoundEnded: _ => {
            if (newContract === undefined) {
              return;
            }

            (async () => {
              await newContract.fetchAndPopulateMemoryPages();
              onUpdate(newContract);
            })();
          }
        })
      );

      onLoad(newContract);
      setContract(newContract);
      setError(undefined);
      setConsensusSocket(undefined);
      return newContract;
    };
    fn().catch(setError);
  }, [client, contractAddress]); //, onLoad, onUpdate]);

  return [contract, error];
};

exports.useAccount = useAccount;
exports.useContract = useContract;
exports.useWavelet = useWavelet;
