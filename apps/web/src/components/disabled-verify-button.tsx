import { Button } from 'ui';

export function DisabledVerifyButton({
  title
}: {
  title: string;
}): JSX.Element {
  return (
    <Button disabled title={title}>
      Verify
    </Button>
  );
}
