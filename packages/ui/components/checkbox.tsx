import * as ReactCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { type Dispatch, type SetStateAction } from 'react';

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export function Checkbox({
  label,
  isChecked,
  setIsChecked,
  className
}: CheckboxProps): JSX.Element {
  return (
    <div className={className}>
      <ReactCheckbox.Root
        checked={isChecked}
        defaultChecked
        id="c1"
        onCheckedChange={() => {
          setIsChecked((b) => !b);
        }}
      >
        <ReactCheckbox.Indicator>
          <CheckIcon />
        </ReactCheckbox.Indicator>
      </ReactCheckbox.Root>
      <label htmlFor="c1">{label}</label>
    </div>
  );
}
