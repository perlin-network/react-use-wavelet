import { renderHook, act } from '@testing-library/react-hooks';
import { useWavelet, useAccount, useContract } from '../src';

import wc from 'wavelet-client';

jest.mock('wavelet-client');
// import { Contract } from 'wavelet-client';
wc.Wavelet = jest.requireActual('wavelet-client').Wavelet;

const mockInit = jest.fn(() => new Promise((resolve) => resolve()));

describe('react-use-wavelet', () => {
  test('export 3 hooks', () => {
    expect(typeof useWavelet).toBe('function');
    expect(typeof useAccount).toBe('function');
    expect(typeof useContract).toBe('function');
  });

  describe('useWavelet', () => {
    test('throw when invalid host is passed', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useWavelet('break'));

      await waitForNextUpdate();

      expect(
        result.current[2]
      ).toBeTruthy();
    });

    test('pass when valid host is passed', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useWavelet('https://testnet.perlin.net'));

      await waitForNextUpdate();

      expect(
        result.current[2]
      ).toBeFalsy();
    });
  });

  describe('useAccount', () => {
    test('throw when invalid key is passed', async () => {
      const { result } = renderHook(() => useAccount({}, 'invalid'));
      expect(
        result.current[1]
      ).toBeTruthy();
    });
  });

  describe('useContract', () => {
    test('throw when invalid address is passed', async () => {
      wc.Contract = jest.requireActual('wavelet-client').Contract;
      const { result, waitForNextUpdate } = renderHook(() => useContract({}, 'break'));

      await waitForNextUpdate();

      expect(
        result.current[1]
      ).toBeTruthy();
    });

    test('call init contract when an address is provided', () => {
      //jest.mock('wavelet-client');

      wc.Contract = jest.fn().mockImplementation(() => {
        return {
          init: mockInit
        };
      });

      const { waitForNextUpdate } = renderHook(() => useContract({ }, 'break', () => {}));

      expect(
        mockInit
      ).toHaveBeenCalled();
    });
  });
});
