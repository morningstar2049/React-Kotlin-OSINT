import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import CloseIcon from "../assets/close-icon.svg";

interface IModalProps {
  children: ReactNode;
  open: boolean;
  closeModal: () => void;
  blockClose?: boolean;
}

interface IAdditionalModalProps {
  ModalHeader: FC<PropsWithChildren>;
  ModalBody: FC<PropsWithChildren>;
  ModalFooter: FC<PropsWithChildren>;
}

const modalParentNode = document.getElementById("modal")!;

const ModalContext = createContext<{
  closeModal: () => void;
  blockClose?: boolean;
}>({ closeModal: () => {} });

const ModalHeader: FC<PropsWithChildren> = ({ children }) => {
  const { closeModal, blockClose } = useContext(ModalContext);
  return (
    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {children}
      </h3>
      <button
        disabled={!!blockClose}
        type="button"
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-fit h-fit ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        onClick={closeModal}
      >
        <img className="w-5 h-5" src={CloseIcon} alt="close" />
        <span className="sr-only">Close modal</span>
      </button>
    </div>
  );
};

const ModalBody: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="p-4 md:p-5 space-y-4">
      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        {children}
      </p>
    </div>
  );
};

const ModalFooter: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
      {children}
    </div>
  );
};

const Modal: FC<IModalProps> & IAdditionalModalProps = ({
  children,
  open,
  closeModal,
  blockClose,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function detectOutsideClick(e: MouseEvent) {
      if (blockClose) return;
      if (modalRef.current?.contains(e.target as Node)) {
        return;
      }
      closeModal();
    }
    modalParentNode.addEventListener("click", detectOutsideClick);

    return () => {
      modalParentNode.removeEventListener("click", detectOutsideClick);
    };
  }, [blockClose, closeModal]);

  if (!open) return null;

  return createPortal(
    <ModalContext.Provider value={{ closeModal, blockClose }}>
      <div className="animate-appear flex overflow-y-auto overflow-x-hidden fixed z-[50] justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div
          ref={modalRef}
          id="modal-content"
          className="relative p-4 w-full max-w-2xl max-h-full"
        >
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {children}
          </div>
        </div>
      </div>
      {/* Backdrop */}
      <div className="bg-[rgba(0,0,0,.5)] fixed h-[100vh] w-full z-20 animate-appear" />
    </ModalContext.Provider>,
    modalParentNode
  );
};

Modal.ModalHeader = ModalHeader;
Modal.ModalBody = ModalBody;
Modal.ModalFooter = ModalFooter;

export default Modal;
