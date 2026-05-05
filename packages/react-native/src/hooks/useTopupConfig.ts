import { useEffect, useState } from 'react';
import { RetailcodeApiClient, RetailcodeApiError, TopupApiConfig } from '@retailcode/core';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; cfg: TopupApiConfig };

export function useTopupConfig(
  client: RetailcodeApiClient,
  msisdn: string,
): State {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    client
      .fetchConfig(msisdn)
      .then(cfg => {
        if (!cancelled) setState({ status: 'ready', cfg });
      })
      .catch(err => {
        if (!cancelled) {
          const msg =
            err instanceof RetailcodeApiError
              ? err.message
              : 'Could not connect to the activation server.';
          setState({ status: 'error', message: msg });
        }
      });

    return () => { cancelled = true; };
  }, [client, msisdn]);

  return state;
}
