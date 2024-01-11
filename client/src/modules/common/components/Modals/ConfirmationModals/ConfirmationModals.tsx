import React from 'react'
//import './ConfirmationModals.css'
import { Button, FormControl, FormLabel, Stack } from '@mui/material'
import { ReservebuttonStyle, CancelbuttonStyle, BlockedReasionText, contentStyle, formWrapper, ReserveDisablebuttonStyle } from './ConfirmationModals.styles'
import { useMutation } from 'react-query'
import slipService from '../../../../services/slip.service'
import { toastError, toastSuccess } from '../../Toasts/Toasts'
import reservationService from '../../../../services/reservation.service'

interface IModalProps {
    text:string
    onClose: () => void
    onCancel: () => void
    code:string
    toasterMsg:string
}

export default function ConfirmationModals({text, onClose, code, onCancel, toasterMsg}: IModalProps) {
   
    const handleSuccessClose = () => {
        toastSuccess(toasterMsg)
        onClose();
    };
    const handleErrorClose = () => {
        toastError('Cancellation was failed')
        onClose();
    };
    const {mutate: unBlockSlip } = useMutation((req:string) => slipService.unBlockSlip(req),{
        onSuccess: handleSuccessClose,
        onError: handleErrorClose
    })

    const {mutate: cancelReservation } = useMutation((req:string) => reservationService.cancelReservation(req))

    const clickHandler = (code:string)=>{
        unBlockSlip(code)
        cancelReservation(code)
    }

  return (
    <div>
    <FormControl style={contentStyle}>
        <FormControl>
            <div>{text}</div>
        </FormControl>

    </FormControl>
    <Stack direction="row" spacing={2} justifyContent={"flex-end"} marginRight={'16px'} marginTop={'10px'}>
        <Button
            variant="outlined"
            disableRipple
            style={CancelbuttonStyle}
            onClick={onCancel}
        >
            No
        </Button>

        <Button
            variant="contained"
            disableRipple
            disableElevation
            disableTouchRipple
            onClick={()=>clickHandler(code)}
            style={ReservebuttonStyle}
        >
            Yes, cancel
        </Button>
    </Stack>
</div >

  )
}
