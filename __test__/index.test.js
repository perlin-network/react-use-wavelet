import { renderHook, act } from '@testing-library/react-hooks';
import { useWavelet, useAccount, useContract } from '../src';

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

    test('throw when invalid host is passed', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useWavelet('https://testnet.perlin.net'));

      await waitForNextUpdate();

      expect(
        result.current[2]
      ).toBeFalsy();
    });
  });

  describe('useAccount', () => {
    test('throw when invalid key is passed', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAccount({}, 'break'));

      //await waitForNextUpdate();

      expect(
        result.current[1]
      ).toBeTruthy();
    });
  });

  describe('useContract', () => {
    test('throw when invalid address is passed', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useContract({}, 'break'));

      await waitForNextUpdate();

      expect(
        result.current[1]
      ).toBeTruthy();
    });
  });
});
