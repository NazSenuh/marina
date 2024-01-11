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
    const [boatName, setBoatName] = useState<string>()
    const [powerSource, setPowerSource] = useState<string>()
    const [draft, setDraft] = useState<string>()

    const [phoneNumber, setPhoneNumber] = useState<string>()
    const [email, setEmail] = useState<string>();
    const [boatSize, setBoatSize] = useState<string>()
    const [paymendMethod, setPaymendMethod] = useState<string>()
    const [duration, setDuration] = useState<string>()
    const [price, setPrice] = useState<string>()
    const [status, setStatus] = useState<string>()
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

    const removeUnderscore =  (str: string | undefined): string | undefined=>  {
        if(str){
            const words = str.split('_');
            const result = words.join('');
            return result;
        }
        return str
    }

    const removeUnderscoreAndSplit =  (str: string | undefined): string | undefined=>  {
        if(str){
            const words = str.split('_');
            const result = words.join(' ');
            return result;
        }
        return str
    }

    useEffect(() => {
        if (reservations) {
            setFullName(reservations.fullName)
            setBoatName(reservations.boatName)
            setDraft(reservations.draft)
            setPowerSource(reservations.powerSource)
            setPhoneNumber(reservations.phoneNumber)
            setEmail(reservations.email)
            setBoatSize(reservations.boatLength + 'x' + reservations.boatWidth)
            setPaymendMethod(reservations.paymentMethod)
            setDuration(reservations.startDate + '  ' + reservations.endDate)
            setPrice(reservations.price)
            setStatus(reservations.status)
        }
    }, [reservations]);


    return (
        <div>
            <div className='testGridLayout'>
                <div className='contentTitle'>Full name:</div>
                <div className='contentValue'>{fullName}</div>

                <div className='contentTitle'>Phone number:</div>
                <div className='contentValue'>{phoneNumber}</div>

                <div className='contentTitle'>Email:</div>
                <div className='contentValue'>{email}</div>

                {boatName ? <div className='contentTitle'>Boat name:</div>:null}
                {boatName ? <div className='contentValue'>{boatName}</div>:null}

                <div className='contentTitle'>Boat size:</div>
                <div className='contentValue'>{boatSize}</div>

                { draft ? <div className='contentTitle'>Draft:</div>:null}
                {draft ? <div className='contentValue'>{draft}</div>:null}

                {powerSource ? <div className='contentTitle'>Power source:</div>:null}
                {powerSource ? <div className='contentValue'>{powerSource}</div>:null}

                <div className='contentTitle'>Parking duration:</div>
                <div className='contentValue'>{duration}</div>

                <div className='contentTitle'>Paymend method:</div>
                <div className='contentValue'>
                    <span className={`paymendMethod${paymendMethod}`}>
                        {paymendMethod}
                    </span>
                </div>
                <div className='contentTitle'>Price:</div>
                <div className='contentValue'>{price}</div>

                <div className='contentTitle'>Status:</div>
                

                
                <div className='contentValue'>
                    <span className={`paymendStatus${removeUnderscore(status)}`}>
                        {removeUnderscoreAndSplit(status)}
                    </span>
                </div>
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
