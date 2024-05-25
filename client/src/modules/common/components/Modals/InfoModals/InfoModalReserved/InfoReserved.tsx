import { Stack } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query';

import { EBoatModal, ECheckboxCash, ECheckboxType, EQueryKeys } from '../../../../../types/marina.types';
import slipService from '../../../../../services/slip.service';

import './InfoReserved.css'

interface IModalProps {
    code: string
    type: EBoatModal
    onClose: () => void
    setModalView: React.Dispatch<React.SetStateAction<EBoatModal>>
}

export default function InfoReserved({ code, type, onClose, setModalView }: IModalProps) {
    const [fullName, setFullName] = useState<string>()


    const [phoneNumber, setPhoneNumber] = useState<string>()

    const [duration, setDuration] = useState<string>()
    const [price, setPrice] = useState<string>()
    const [reservations, setReservations] = useState<any>()
    const [currentBoat, setCurrentBoat] = useState<any>();


    const { data: blockedSlip } = useQuery(
        EQueryKeys.ONE_SLIP,
        () => slipService.getOne(code), {
    });

    useEffect(() => {
        if (blockedSlip) {
            setCurrentBoat(blockedSlip)
        }
    }, [blockedSlip])

    useEffect(() => {
        if (currentBoat) {
            setReservations(currentBoat.reservations[currentBoat.reservations.length - 1])
        }
    }, [currentBoat]);


    useEffect(() => {
        if (reservations) {
            setFullName(reservations.fullName)
            setPhoneNumber(reservations.phoneNumber)
            setDuration(reservations.startDate + '  ' + reservations.endDate)
            setPrice(reservations.price)
        }
    }, [reservations]);


    return (
        <div>
            <div className='testGridLayout'>
                <div className='contentTitle'>Full name:</div>
                <div className='contentValue'>{fullName}</div>

                <div className='contentTitle'>Phone number:</div>
                <div className='contentValue'>{phoneNumber}</div>



                <div className='contentTitle'>Parking duration:</div>
                <div className='contentValue'>{duration}</div>

        
                <div className='contentTitle'>Price:</div>
                <div className='contentValue'>{price}</div>

                
            </div>

            <Stack direction="row" spacing={2} justifyContent={"flex-end"} marginRight={'16px'} marginTop={'10px'}>
                <button
                    className={"cancelReservation"}
                    onClick={() => setModalView(EBoatModal.CANCEL_RESERVATION_ACTION)}
                >
                    Cancel Reservation
                </button>
            </Stack>

        </div>
    )
}
