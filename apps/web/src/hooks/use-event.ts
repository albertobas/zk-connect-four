import type { Log } from 'viem';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import type { EventsProps } from '../types/connect-four';

/**
 * Hook that retrieves contract events periodically every `pollInterval` until
 * `shouldStopPolling`.
 * @param param0 - An object of type EventsProps.
 * @returns A list with the events that have been fetched and a setter of this state
 */
export function useEvent({
  abi,
  address,
  eventName,
  fromBlock,
  toBlock,
  pollInterval,
  shouldStopPolling,
  txHash
}: EventsProps): {
  event: Log | null;
  setEvent: Dispatch<SetStateAction<Log | null>>;
} {
  const [event, setEvent] = useState<Log | null>(null);
  const publicClient = usePublicClient();

  // create a callback function with the use case
  const fetchData = useCallback(async () => {
    // get contract events
    const logs = await publicClient.getContractEvents({
      address,
      abi,
      eventName,
      fromBlock,
      toBlock
    });

    for (const log of logs) {
      if (log.transactionHash === txHash) setEvent(log);
    }
    // set events in a state
  }, [abi, address, eventName, fromBlock, publicClient, toBlock, txHash]);

  // effect to fetch data every `pollInterval` until `shouldStopPolling`
  useEffect(() => {
    let t: NodeJS.Timeout | null = null; // eslint-disable-line -- allow undef
    if (!shouldStopPolling) {
      if (pollInterval) {
        // eslint-disable-next-line -- allow misused promise
        t = setInterval(fetchData, pollInterval);
      } else {
        fetchData(); // eslint-disable-line -- allow floating promise
      }
    }
    // cleanup function
    return () => {
      t && clearInterval(t);
    };
  }, [fetchData, pollInterval, shouldStopPolling]);

  return { event, setEvent };
}
