import * as React from "react";
import Modal from "@mui/material/Modal";



interface IModalTriggerProps {
  modalTrigger: JSX.Element;
  handleSuccess: () => void;
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
  children: React.ReactNode
}

export default function ModalTrigger({
  modalTrigger,
  isOpenModal,
  setIsOpenModal,
  children,
}: IModalTriggerProps) {

  const handleModalClose = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      {modalTrigger}
      <Modal
        open={isOpenModal}
        onClose={handleModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <React.Fragment>
          {children}
        </React.Fragment>

      </Modal>
    </>
  );
}



