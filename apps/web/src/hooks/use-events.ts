import type { Log } from 'viem';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { usePublicClient, useWebSocketPublicClient } from 'wagmi';
import type { EventsProps } from '../types/connect-four';

/**
 * Hook that retrieves contract events periodically every `pollInterval` until
 * `shouldStopPolling`.
 * @param param0 - An object of type EventsProps.
 * @returns A list with the events that have been fetched and a setter of this state
 */
export function useEvents({
  abi,
  address,
  eventName,
  fromBlock,
  toBlock,
  pollInterval,
  shouldStopPolling
}: EventsProps): {
  events: Log[] | null;
  setEvents: Dispatch<SetStateAction<Log[] | null>>;
} {
  const [events, setEvents] = useState<Log[] | null>(null);
  const client = usePublicClient();
  const wsClient = useWebSocketPublicClient();
  const publicClient = wsClient || client;
  // create a callback function with the use case
  const fetchData = useCallback(async () => {
    // get contract events
    const events_ = await publicClient.getContractEvents({
      address,
      abi,
      eventName,
      fromBlock,
      toBlock
    });
    // set events in a state
    setEvents(events_);
  }, [abi, address, eventName, fromBlock, publicClient, toBlock]);
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

  return { events, setEvents };
}
