import { useCallback, useEffect, useState } from 'react';
import { type Id, toast } from 'react-toastify';

export interface Toast {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  loadingText: string;
  successText: string;
  errorText: string;
}

/**
 * Hook to render a set of toasts notifications in loading, success and error
 * contexts.
 * @param param0 - A Toast object.
 * @returns An object with an id of type ID or null.
 */
export function useToast({
  isLoading,
  isSuccess,
  isError,
  loadingText,
  successText,
  errorText
}: Toast): {
  id: Id | null;
} {
  const [toastId, setToastId] = useState<Id | null>(null);

  const renderToast = useCallback(
    (id: Id, content: string) => {
      toast.update(id, {
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true,
        delay: 100,
        draggable: true,
        isLoading: false,
        render: content,
        type: isError ? 'error' : 'success'
      });
    },
    [isError]
  );

  useEffect(() => {
    if (isLoading) {
      setToastId(toast.loading(loadingText));
    }
  }, [isLoading, loadingText]);

  useEffect(() => {
    if (isSuccess) {
      if (toastId !== null) {
        renderToast(toastId, successText);
      }
    }
  }, [isSuccess, toastId, successText, renderToast]);

  useEffect(() => {
    if (typeof isError !== 'undefined' && isError && toastId !== null) {
      renderToast(toastId, errorText);
    }
  }, [isError, toastId, errorText, renderToast]);

  return { id: toastId };
}
