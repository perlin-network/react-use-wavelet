import { renderHook, act } from '@testing-library/react-hooks';
import { useWavelet, useAccount, useContract } from '../src';

import wc from 'wavelet-client';

jest.mock('wavelet-client');
// import { Contract } from 'wavelet-client';
wc.Wavelet = jest.requireActual('wavelet-client').Wavelet;

const mockInit = jest.fn(() => new Promise(resolve => resolve()));

describe('react-use-wavelet', () => {
  test('export 3 hooks', () => {
    expect(typeof useWavelet).toBe('function');
    expect(typeof useAccount).toBe('function');
    expect(typeof useContract).toBe('function');
  });

  describe('useWavelet', () => {
    test('throw when invalid host is passed', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useWavelet('break')
      );

      await waitForNextUpdate();

      expect(result.current[2]).toBeTruthy();
    });

    test('pass when valid host is passed', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useWavelet('https://testnet.perlin.net')
      );

      await waitForNextUpdate();

      expect(result.current[2]).toBeFalsy();
    });
  });

  describe('useAccount', () => {
    test('throw when invalid key is passed', async () => {
      const { result } = renderHook(() => useAccount({}, 'invalid'));
      expect(result.current[1]).toBeTruthy();
    });

    test('pass when valid key is passed', async () => {
      const getAccount = jest.fn();
      const pollAccounts = jest.fn();
      const { result } = renderHook(() =>
        useAccount(
          { getAccount, pollAccounts },
          '08fc05c15e6500923f3809e04dea2de94db3aac21dcf3ab0d9e4e606d8d17f63254c85e023e7122819c1dad047fdfec9f16b72cd8e7972bf1099b2fcd07a8e18'
        )
      );
      expect(result.current[1]).toBeFalsy();
    });
  });

  describe('useContract', () => {
    test('throw when invalid address is passed', async () => {
      wc.Contract = jest.requireActual('wavelet-client').Contract;
      const { result, unmount, waitForNextUpdate } = renderHook(() =>
        useContract({}, 'break')
      );

      await waitForNextUpdate();

      unmount();
      expect(result.current[1]).toBeTruthy();
    });

    test('call init contract when an address is provided', () => {
      //jest.mock('wavelet-client');

      wc.Contract = jest.fn().mockImplementation(() => {
        return {
          init: mockInit
        };
      });

      const { waitForNextUpdate, unmount } = renderHook(() =>
        useContract({}, 'not checked ')
      );

      unmount();
      expect(mockInit).toHaveBeenCalled();
    });

    test('call onLoad when contract is loaded', async () => {
      wc.Contract = jest.fn().mockImplementation(() => {
        return {
          init: mockInit,
          fetchAndPopulateMemoryPages: jest.fn()
        };
      });

      const onLoad = jest.fn();

      const { waitForNextUpdate, unmount } = renderHook(() =>
                                               useContract({}, 'not checked', false, onLoad)
      );
      await waitForNextUpdate();
      await waitForNextUpdate();

      unmount();
      expect(onLoad).toHaveBeenCalled();
    });

    test('call onUpdate when consensus happens', async () => {
      const close = jest.fn();
      let callbacks;
      const pollConsensus = jest.fn((cb) => {
        callbacks = cb;
        return new Promise(resolve => resolve({
          close
        }));
      });
      wc.Contract = jest.fn().mockImplementation(() => {
        return {
          init: mockInit,
          fetchAndPopulateMemoryPages: () => new Promise((resolve) => { resolve({})}),
        };
      });

      const onUpdate = jest.fn();

      const { waitForNextUpdate, unmount } = renderHook(
        () =>
          useContract({
           pollConsensus
          }, 'not checked', onUpdate)
      );
      await waitForNextUpdate();

      callbacks.onRoundEnded();

      await waitForNextUpdate();

      unmount();
      expect(pollConsensus).toHaveBeenCalled();
      expect(onUpdate).toHaveBeenCalled();
    });

    test('call close when client is unset', async () => {
      const close = jest.fn();

      const pollConsensus = jest.fn((cb) => {
        return new Promise(resolve => resolve({
          close
        }));
      });
      wc.Contract = jest.fn().mockImplementation(() => {
        return {
          init: mockInit,
          fetchAndPopulateMemoryPages: () => new Promise((resolve) => { resolve({}); })
        };
      });

      const { waitForNextUpdate, unmount, rerender } = renderHook(
        ({ client }) =>
          useContract(client, 'not checked', jest.fn()),
        { initialProps: { client: { pollConsensus } } }
      );
      await waitForNextUpdate();
      rerender({ client: false });
      await waitForNextUpdate();

      unmount();

      expect(pollConsensus).toHaveBeenCalled();
      expect(close).toHaveBeenCalled();
    });
  });
});
