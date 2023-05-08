import { type ReactFCC } from "~/types/types";
import { Portal } from "./Portal";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
};

export const Modal: ReactFCC<ModalProps> = ({ children, isOpen, close }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Portal wrapperId="portal-modal">
      <>
        <div
          onClick={close}
          className="fixed bottom-0 left-0 right-0 top-0 z-40 h-screen bg-black opacity-10 dark:bg-white"
        />

        <div
          className={`fixed left-1/2 top-1/2 z-50 flex w-64 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded border border-black bg-white px-4 py-2 dark:border-white dark:bg-black`}
        >
          {children}
        </div>
      </>
    </Portal>
  );
};
