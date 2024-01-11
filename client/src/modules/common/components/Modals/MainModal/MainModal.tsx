import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close'
import Modal from '@mui/material/Modal';
import { Stack } from '@mui/material';

import { EBoatModal } from '../../../../types/marina.types';
import BlockModal from '../BlockModal/BlockModal';
import InfoModalFree from '../InfoModals/InfoModalFree/Modal';
import InfoModalHeader from '../ModalHeaders/infoModal/InfoModalHeader';
import InfoModalBlocked from '../InfoModals/InfoModalBlocked/InfoBlocked';
import ReserveModal from '../ReserveModal/ReserveModal';
import ActionModalHeader from '../ModalHeaders/ActionModal/ActionModalHeader';
import InfoReserved from '../InfoModals/InfoModalReserved/InfoReserved';
import ConfirmationModals from '../ConfirmationModals/ConfirmationModals';

import  './MainModal.styles.css';

interface IModalProps {
  type: EBoatModal
  code: string
  isOpenModal: boolean
  finger_pier: string
  width: string
  max_size: string
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  setIsRefetch: React.Dispatch<React.SetStateAction<boolean>>
}


export default function MainModal({ type, code, isOpenModal, finger_pier, width, max_size, setIsOpenModal, setIsRefetch }: IModalProps) {
  const [modalView, setModalView] = React.useState<EBoatModal>(type);


  const handleClose = () => {
    setIsOpenModal(false);
  };
  const handleCancel = () => {
    setModalView(EBoatModal.FREE);
  };

  const handleReservationCancel = () => {
    setModalView(EBoatModal.RECERVED);
  };
  const handleBlockCancel = () => {
    setModalView(EBoatModal.BLOCKED);
  };

  const onAction = () => {
    setIsRefetch(true);
    handleClose();
  }


  const headers = {
    [EBoatModal.FREE]: <InfoModalHeader type={type} code={code} />,
    [EBoatModal.BLOCKED]: <InfoModalHeader type={type} code={code} />,
    [EBoatModal.RECERVED]: <InfoModalHeader type={type} code={code} />,
    [EBoatModal.BLOCKED_ACTION]: <ActionModalHeader text='Slip blocking' />,
    [EBoatModal.RESERVED_ACTION]: <ActionModalHeader text='Reservation' />,
    [EBoatModal.CANCEL_RESERVATION_ACTION]: <ActionModalHeader text='Cancel reservation' />,
    [EBoatModal.CANCEL_BLOCK_ACTION]: <ActionModalHeader text='Cancel blocking' />,
  };

  const modals = {
    [EBoatModal.FREE]: <InfoModalFree code={code} type={type} finger_pier={finger_pier} width={width} max_size={max_size} setModalView={setModalView} />,
    [EBoatModal.BLOCKED]: <InfoModalBlocked code={code} type={type} onClose={onAction} setModalView={setModalView} />,
    [EBoatModal.RECERVED]: <InfoReserved code={code} type={type} onClose={onAction} setModalView={setModalView} />,
    [EBoatModal.BLOCKED_ACTION]: <BlockModal code={code} onCancel={handleCancel} onClose={onAction} />,
    [EBoatModal.RESERVED_ACTION]: <ReserveModal code={code} onClose={onAction} onCancel={handleCancel} />,
    [EBoatModal.CANCEL_RESERVATION_ACTION]:<ConfirmationModals
        text="Are you sure you want to cancel reservation?"
        code={code}
        onClose={onAction}
        onCancel={handleReservationCancel}
        toasterMsg={'Reservation was successfully canceled'}
      />,
    [EBoatModal.CANCEL_BLOCK_ACTION]: <ConfirmationModals
      text="Are you sure you want to unblock the slip?"
      code={code}
      onClose={onAction}
      onCancel={handleBlockCancel}
      toasterMsg={'Blocking was successfully canceled'}
     />
  };

  return (

    <div  >
      <Modal
        open={isOpenModal}
        onClose={handleClose}
        style={{
          overflowY:"scroll"
        }}
      >
        <div className='mainModal-style'>
          <Stack direction="row" className='titleStyle' >
            {headers[modalView]}
            <div onClick={handleClose}>
              <CloseIcon style={{ float: "right" }} ></CloseIcon>
            </div>
          </Stack>
          {modals[modalView]}
        </div>
      </Modal>
    </div>
  );
}