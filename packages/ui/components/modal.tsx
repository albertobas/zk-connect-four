import { Cross1Icon } from '@radix-ui/react-icons';
import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction
} from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  handler?: () => void;
  setIsModalClosed?: Dispatch<SetStateAction<boolean>>;
}

export function Modal({
  isOpen,
  setIsModalClosed,
  handler,
  children,
  ...rest
}: PropsWithChildren<ReactModal.Props & ModalProps>): JSX.Element {
  function handleClose(): void {
    if (typeof setIsModalClosed !== 'undefined') {
      setIsModalClosed(true);
    }
  }

  return (
    <ReactModal isOpen={isOpen} {...rest}>
      <div>
        {(typeof setIsModalClosed !== 'undefined' ||
          typeof handler !== 'undefined') && (
          <button
            onClick={typeof handler !== 'undefined' ? handler : handleClose}
            type="button"
          >
            <Cross1Icon />
          </button>
        )}
        <div>{children}</div>
      </div>
    </ReactModal>
  );
}
