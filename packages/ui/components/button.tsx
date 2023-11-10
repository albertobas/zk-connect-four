import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren
} from 'react';

type ButtonProps = PropsWithChildren<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> & { wrapperClassname?: string };

export function Button({
  children,
  wrapperClassname,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <div className={wrapperClassname} style={{ overflow: 'hidden' }}>
      <button type="button" {...rest}>
        {children}
      </button>
    </div>
  );
}
