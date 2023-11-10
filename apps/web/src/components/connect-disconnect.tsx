import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { Button, useIsMounted, useToast, type Toast } from 'ui';

export function ConnectDisconnect({
  className
}: {
  className?: string;
}): JSX.Element {
  const isMounted = useIsMounted();
  const { isConnected, connector } = useAccount();
  const connect = useConnect();
  const disconnect = useDisconnect();

  const connectToast: Toast = {
    isLoading: connect.isLoading,
    isSuccess: connect.isSuccess,
    isError: connect.isError,
    loadingText: 'Connecting...',
    successText: 'You have connected succesfully.',
    errorText: `The connection has failed.${
      connect.error ? ` ${connect.error.message}` : ''
    }`
  };
  const disconnectToast: Toast = {
    isLoading: disconnect.isLoading,
    isSuccess: disconnect.isSuccess,
    isError: disconnect.isError,
    loadingText: 'Disconnecting...',
    successText: 'You have disconnected succesfully.',
    errorText: `The disconnection has failed.${
      disconnect.error ? ` ${disconnect.error.message}` : ''
    }`
  };

  useToast(connectToast);
  useToast(disconnectToast);

  if (isConnected) {
    if (isMounted) {
      return (
        <Button
          className={className}
          onClick={(): void => {
            disconnect.disconnect();
          }}
        >
          {`Disconnect ${
            typeof connector !== 'undefined' ? `from ${connector.name}` : ''
          }`}
        </Button>
      );
    }

    return (
      <Button className={className} disabled>
        Loading...
      </Button>
    );
  }

  if (isMounted) {
    return (
      <>
        {connect.connectors.map((connector_) => (
          <Button
            className={className}
            disabled={!connector_.ready}
            key={connector_.id}
            onClick={() => {
              connect.connect({ connector: connector_ });
            }}
            title={
              !connector_.ready
                ? 'Unsupported: you need to install and sign in to your Metamask wallet in order to use this connector.'
                : undefined
            }
          >
            {`Connect to ${connector_.name}`}
          </Button>
        ))}
      </>
    );
  }

  return (
    <Button className={className} disabled>
      Loading...
    </Button>
  );
}
