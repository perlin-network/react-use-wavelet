(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('wavelet-client')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'wavelet-client'], factory) :
  (global = global || self, factory(global['react-use-wavelet'] = {}, global.react, global.wc));
}(this, function (exports, React, wc) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  wc = wc && wc.hasOwnProperty('default') ? wc['default'] : wc;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var Contract = wc.Contract,
      Wavelet = wc.Wavelet;
  /**
   * Connects to a Wavelet node
   *
   * @param {str} host Url of the host you wish to connect to
   * @returns {[ WaveletClient, WaveletNode, Error ]} The Wavelet Client, Node info, and any errors returned
   */

  var useWavelet = function useWavelet(host) {
    var _React$useState = React.useState(undefined),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        client = _React$useState2[0],
        setClient = _React$useState2[1];

    var _React$useState3 = React.useState(undefined),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        node = _React$useState4[0],
        setNodeInfo = _React$useState4[1];

    var _React$useState5 = React.useState(undefined),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        error = _React$useState6[0],
        setError = _React$useState6[1];

    React.useEffect(function () {
      var connect =
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var newClient;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  newClient = new Wavelet(host);
                  _context.t0 = setNodeInfo;
                  _context.next = 5;
                  return newClient.getNodeInfo();

                case 5:
                  _context.t1 = _context.sent;
                  (0, _context.t0)(_context.t1);
                  setClient(newClient);
                  setError(undefined);
                  _context.next = 16;
                  break;

                case 11:
                  _context.prev = 11;
                  _context.t2 = _context["catch"](0);
                  setNodeInfo(undefined);
                  setClient(undefined);
                  setError(_context.t2);

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 11]]);
        }));

        return function connect() {
          return _ref.apply(this, arguments);
        };
      }();

      if (host) {
        connect();
      }
    }, [host]); // TODO: Add single listener for consensus events

    return [client, node, error];
  };
  /**
   * Fetches info of a Wavelet Account and listens to updates
   *
   * @param {WaveletClient} client client used for querying
   * @param {string} privateKey 64 char hex encoded private key
   * @returns {[ Account, Error ]} A reactive Account, and any errors returned
   */

  var useAccount = function useAccount(client, privateKey) {
    var _React$useState7 = React.useState(undefined),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        account = _React$useState8[0],
        setAccount = _React$useState8[1];

    var _React$useState9 = React.useState(undefined),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        error = _React$useState10[0],
        setError = _React$useState10[1];

    var _React$useState11 = React.useState(undefined),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        accountSocket = _React$useState12[0],
        setAccountSocket = _React$useState12[1];

    var accountRef = React.useRef(account);
    React.useEffect(function () {
      accountRef.current = account;
    }, [account]);
    var accountSocketRef = React.useRef(accountSocket);
    React.useEffect(function () {
      accountSocketRef.current = accountSocket;
    }, [accountSocket]);
    React.useEffect(function () {
      var connect =
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2() {
          var wallet, walletAddress;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  wallet = Wavelet.loadWalletFromPrivateKey(privateKey);
                  walletAddress = Buffer.from(wallet.publicKey).toString('hex');
                  _context2.t0 = setAccount;
                  _context2.next = 6;
                  return client.getAccount(walletAddress);

                case 6:
                  _context2.t1 = _context2.sent;
                  (0, _context2.t0)(_context2.t1);
                  _context2.t2 = setAccountSocket;
                  _context2.next = 11;
                  return client.pollAccounts({
                    onAccountUpdated: function onAccountUpdated(msg) {
                      switch (msg.event) {
                        case 'balance_updated':
                          {
                            setAccount(_objectSpread2({}, accountRef.current, {
                              balance: msg.balance
                            }));
                            break;
                          }

                        default:
                          {
                            break;
                          }
                      }
                    }
                  }, {
                    id: walletAddress
                  });

                case 11:
                  _context2.t3 = _context2.sent;
                  (0, _context2.t2)(_context2.t3);
                  setError(undefined);
                  _context2.next = 22;
                  break;

                case 16:
                  _context2.prev = 16;
                  _context2.t4 = _context2["catch"](0);
                  // Cannot throw due to react hook limitations
                  setAccount(undefined);

                  if (accountSocketRef.current) {
                    accountSocketRef.current.close(1000, 'closing account connection');
                  }

                  setAccountSocket(undefined);
                  setError(_context2.t4);

                case 22:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 16]]);
        }));

        return function connect() {
          return _ref2.apply(this, arguments);
        };
      }();

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

  var useContract = function useContract(client, contractAddress, onUpdate, onLoad) {
    var _React$useState13 = React.useState(null),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        contract = _React$useState14[0],
        setContract = _React$useState14[1];

    var _React$useState15 = React.useState(null),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        setConsensusSocket = _React$useState16[1];

    var _React$useState17 = React.useState(undefined),
        _React$useState18 = _slicedToArray(_React$useState17, 2),
        error = _React$useState18[0],
        setError = _React$useState18[1];

    React.useEffect(function () {
      var fn =
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee4() {
          var newContract;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (client) {
                    _context4.next = 2;
                    break;
                  }

                  return _context4.abrupt("return", null);

                case 2:
                  newContract = new Contract(client, contractAddress); // Initialize

                  _context4.next = 5;
                  return newContract.init();

                case 5:
                  _context4.t0 = setConsensusSocket;
                  _context4.next = 8;
                  return client.pollConsensus({
                    onRoundEnded: function onRoundEnded(_) {
                      if (newContract === undefined) {
                        return;
                      }

                      _asyncToGenerator(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee3() {
                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                _context3.next = 2;
                                return newContract.fetchAndPopulateMemoryPages();

                              case 2:
                                onUpdate(newContract);

                              case 3:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        }, _callee3);
                      }))();
                    }
                  });

                case 8:
                  _context4.t1 = _context4.sent;
                  (0, _context4.t0)(_context4.t1);
                  onLoad(newContract);
                  setContract(newContract);
                  setError(undefined);
                  setConsensusSocket(undefined);
                  return _context4.abrupt("return", newContract);

                case 15:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        return function fn() {
          return _ref3.apply(this, arguments);
        };
      }();

      fn()["catch"](setError);
    }, [client, contractAddress]); //, onLoad, onUpdate]);

    return [contract, error];
  };

  exports.useAccount = useAccount;
  exports.useContract = useContract;
  exports.useWavelet = useWavelet;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
