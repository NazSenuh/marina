import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";

import { ECheckboxCash, ECheckboxType, EEngineSource, IReservation } from '../../../../types/marina.types';
import { EValidateError } from '../../../../types/error.types';
import reservationService from '../../../../services/reservation.service';
import { CircularProgress } from '@mui/material';
import { ReservationSchema } from '../../../validation/reservationValidation';
import { formatPhone } from '../../../../utils';
import { validateNumeric } from '../../../../utils/validate-input.util';
import { isValidEmail } from '../../../../utils/validate-email';
import { toastError, toastSuccess } from '../../Toasts/Toasts';

import LineSeparator from "../../../../../assets/Picker-Separator.svg";
import Star from "../../../../../assets/Star.svg";
import Separator from "../../../../../assets/Separator.svg";
import seasonService from "../../../../services/season.service";
import { Input as AntInput } from 'antd';
import { ConfigProvider, DatePicker, DatePickerProps } from 'antd';
import { RangePickerProps } from "antd/es/date-picker";

import './ReserveModal.styles.css'

interface IPropsInput {
    label: string;
    type?: string;
    stateHandler: (value: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    value: string  | undefined;
    error?: string;
    errosMessage?: TErrors;
    defVaue?: string;
    number?: boolean
    required?:boolean
}


export const DefaultInput = ({ label, type, stateHandler, value, onBlur, errosMessage, number, required }: IPropsInput) => (
    <div className='defaultInputWrapper'>
       
            <div className='labelWrapper'>
            {required ?
                <img src={Star} alt='*' style={{ width: '5px', height: '5px' }} />
                :<div style={{ marginTop: '5px'}}></div>
            }
            <label className='labelStyle'>{label}</label>
        </div> 

        <AntInput
            type={type}
            value={value}
            placeholder={label}
            onChange={stateHandler}
            onBlur={onBlur}
            size="large"
            style={{ borderRadius: "0" }}
            prefix={!number ? <></> : <div>+1</div>}
        />
        {errosMessage?.isError ?
            <div className='errorText'>
                {errosMessage.message}
            </div>
            : null
        }
    </div>
)

interface IPropsDoubleInput {
    label: string;
    type: string;
    labelFirst: string;
    labelSecond?: string;
    firstImg?: string;
    secondImg?: string;
    firstState: string;
    secondState: string;
    setFirstState: (value: string) => void;
    setSecondState: (value: string) => void;
    width: string;
    secondInputWidth: string;
    defaultValue?: string;
}

const DoubleInput = ({ label, type, labelFirst, labelSecond, firstImg, secondImg, firstState, secondState, setFirstState, setSecondState, width, secondInputWidth, defaultValue }: IPropsDoubleInput) => (
    <div className='defaultInputWrapper'>
        <div className='labelWrapper'>
            <img src={Star} alt='*' style={{ width: '5px', height: '5px' }} />
            <label className='labelStyle'>{label}</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', flex: '1', minWidth: '100%' }}>
            <div style={{ display: 'flex', position: 'relative', width: width }}>
                <input
                    type={type}
                    className='inputStyle'
                    value={firstState}
                    placeholder={labelFirst}
                    defaultValue={defaultValue}
                    onChange={(e) => (setFirstState(e.target.value))}
                />
                {firstImg ? <img
                    className='separatorImg'
                    src={firstImg}
                /> :
                    null}
            </div>
            <div style={{ display: 'flex', position: 'relative', width: secondInputWidth }}>

                <input
                    type={type}
                    className='inputStyle'
                    value={secondState}
                    placeholder={labelSecond}
                    onChange={(e) => setSecondState(e.target.value)}
                />
                {secondImg ?
                    <img
                        className='secondImg'
                        src={secondImg}
                    /> : null
                }
            </div>
        </div>
    </div>
)

interface IRadioButtonsProps {
    radio1: boolean;
    radio2: boolean;
    radio3?: boolean;

    handleRadio1: () => void;
    handleRadio2: () => void;
    handleRadio3?: () => void;

    title: string;
    label1: string;
    label2: string;
    label3?: string;

    required?:boolean;
}

const RadioButtons = ({
    radio1,
    radio2,
    radio3,
    handleRadio1,
    handleRadio2,
    handleRadio3,
    title,
    label1,
    label2,
    label3,
    required
}: IRadioButtonsProps) => (
    <div className="checkboxWrapper">
        <div>
            <div className="labelWrapper">
                {required ?
                <img src={Star} alt="*" style={{ width: "5px", height: "5px" }} />
                :
                <div style={{ marginTop: '5px'}}></div>
                }
                
                <label className="labelStyle">{title}</label>
            </div>
            <div className="radio-buttons">
                <div className="radio-element">
                    <div>
                        <input
                            type="radio"
                            checked={radio1}
                            className="checkbox-round"
                            onChange={handleRadio1}
                        />
                    </div>
                    <label>{label1}</label>
                </div>
                <div className="radio-element">
                    <div>
                        <input
                            type="radio"
                            checked={radio2}
                            className="checkbox-round"
                            onChange={handleRadio2}
                        />
                    </div>
                    <label>{label2}</label>
                </div>
                {label3 ? <div className="radio-element">
                    <div>
                        <input
                            type="radio"
                            checked={radio3}
                            className="checkbox-round"
                            onChange={handleRadio3}
                        />
                    </div>
                    <label>{label3}</label>
                </div>: null}
            </div>
        </div>
    </div>
)


interface IModalProps {
    onClose: () => void;
    code: string;
    onCancel: () => void;
}
type TErrors = {
    isError: boolean
    message: string
}
const { RangePicker } = DatePicker;

<ConfigProvider
    theme={{
        components: {
            DatePicker: {
                activeBorderColor: '#000000',
                borderRadius: 1000,
                activeBg: "#000000",
                colorBgContainer: "#000000",
                activeShadow: "#000000",
                addonBg: "#FFFFFF",
                fontSize: 90,
            },
        },
    }}
>
</ConfigProvider>


export default function ReserveModal({ onClose, code, onCancel }: IModalProps) {

    const [name, setName] = useState<string>('')
    const [number, setNumber] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [boatName, setBoatName] = useState<string | undefined>(undefined)

    const [boatHeight, setBoatHeight] = useState<string>('')
    const [boatWidth, setBoatWidth] = useState<string>('')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [paidType, setPaidType] = useState<ECheckboxCash>(ECheckboxCash.CARD)
    const [engineType, setEngineType] = useState<EEngineSource>(EEngineSource.ENGINE)

    const [paymentStatus, setPaymentStatus] = useState<ECheckboxType>(ECheckboxType.PAID)
    const [price, setPrice] = useState<string>('')
    const [draft, setDraft] = useState<string | undefined>(undefined)

    

    const [error, setError] = useState<Record<string, string>>({})
    const [errorName, setErrorName] = useState<TErrors>({ isError: false, message: '' })
    const [errorBoatName, setErrorBoatName] = useState<TErrors>({ isError: false, message: '' })
    const [errorPhone, setErrorPhone] = useState<TErrors>({ isError: false, message: '' })
    const [errorEmail, setErrorEmail] = useState<TErrors>({ isError: false, message: '' })
    const [dataEmpty, setDataEmpty] = useState<boolean>(true)


    const handleSuccessClose = () => {
        toastSuccess('Reservation was successfully created')
        onClose()
    };
    const handleErrorClose = () => {
        toastError('Oops! Something went wrong.')
        onClose()
    };


    const { mutate: createReservation, isLoading } = useMutation((data: IReservation) => reservationService.createReservation(code, data), {
        onSuccess: handleSuccessClose,
        onError: handleErrorClose
    })

    const validate = async (data: IReservation) => {
        try {
            await ReservationSchema.validate(data)
            return null

        } catch (e: any) {
            return { [e.path]: e.message }
        }

    }
    useEffect(() => {
        setDataEmpty(!!(name.length >= 2 && number && email && boatHeight && boatWidth && startDate && endDate && paidType && paymentStatus && price))
    }, [name, number, email, boatHeight, boatWidth, startDate, endDate, paidType, paymentStatus, price])

    const handleReservate = async () => {
        const season = await seasonService.getCurrent();

        const data = {
            fullName: name,
            phoneNumber: '+1' + number,
            email,
            boatLength: boatHeight,
            boatWidth,
            startDate,
            endDate,
            paymentMethod: paidType,
            status: paymentStatus,
            price,
            season,
            boatName,
            draft,
            powerSource: engineType
        }

        const err = await validate(data)
        if (err) {
            setError(err)
            return
        }
        createReservation(data)
    }

    //PhoneNumber
    const handleChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const phone = formatPhone(event.target.value, number)
        if (phone) {
            setNumber(phone)
        }
        if (event.target.value.length >= 11 && errorPhone.isError) {
            const errorMsg = { isError: false, message: '' }
            setErrorPhone(errorMsg)

        }
    }
    const BlurChangePhone = () => {
        if (number.length < 14) {
            const errorMsg = { isError: true, message: EValidateError.PHONE_MESSAGE }
            setErrorPhone(errorMsg)
        } else {
            const errorMsg = { isError: false, message: '' }
            setErrorPhone(errorMsg)
        }
    }
    //boatName
    
    const handleChangeBoatName = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 50) {
            setBoatName(event.target.value)
        }
        if (event.target.value.length >= 2 && errorBoatName.isError) {
            const errorMsg = { isError: false, message: '' }
            setErrorBoatName(errorMsg)
        }
    }


    //Email
    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
        if (isValidEmail(email)) {
            const errorMsg = { isError: false, message: '' }
            setErrorEmail(errorMsg)
        }
    }

    const BlurChangeEmail = () => {
        const isEmail = isValidEmail(email)

        if (!isEmail) {
            const errorMsg = { isError: true, message: EValidateError.EMAIL_MESSAGE }
            setErrorEmail(errorMsg)
        } else {
            const errorMsg = { isError: false, message: '' }
            setErrorEmail(errorMsg)
        }
    }


    const handleChangeNumber = (event: string, setState: React.Dispatch<React.SetStateAction<string>>, size?: number) => {
        const isValid = validateNumeric(event)
        if (size && event.length <= size) {
            setState(event)
        }
    }
    //Name
    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 50) {
            setName(event.target.value)
        }
        if (event.target.value.length >= 2 && errorName.isError) {
            const errorMsg = { isError: false, message: '' }
            setErrorName(errorMsg)
        }
    }
    const BlurChangeName = () => {
        if (name.length < 2) {
            const errorMsg = { isError: true, message: EValidateError.NAME_MESSAGE }
            setErrorName(errorMsg)
        } else {
            const errorMsg = { isError: false, message: '' }
            setErrorName(errorMsg)
        }
    }

    //Draft

    const handleChangeDraft = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 100) {
            setDraft(event.target.value)
        }
       
    }

    //Price
    const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currprice = validateNumeric(event.target.value)
        if (event.target.value.length <= 6 && currprice && !(event.target.value.length === 1 && event.target.value[0] === '0')) {
            setPrice(event.target.value)
        }
    }
    //
    const onChangeData = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        if (dateString) {
            setStartDate(dateString[0])
            setEndDate(dateString[1])
        }
    };


    return (
        <div>
            <form className='formStyle' >
                <DefaultInput
                    onBlur={BlurChangeName}
                    error={error.name}
                    value={name}
                    label='Full name'
                    type='text'
                    stateHandler={handleChangeName}
                    errosMessage={errorName}
                    required={true}
                />

                <DefaultInput
                    error={error.number}
                    value={number}
                    label='Phone number'
                    type='text'
                    stateHandler={handleChangePhoneNumber}
                    onBlur={BlurChangePhone}
                    errosMessage={errorPhone}
                    defVaue="+1"
                    number={true}
                    required={true}

                />

                <DefaultInput
                    error={error.email}
                    value={email}
                    label='Email'
                    type='text'
                    stateHandler={handleChangeEmail}
                    onBlur={BlurChangeEmail}
                    errosMessage={errorEmail}
                    required={true}
                />
                 <DefaultInput
                    error={error.name}
                    value={boatName}
                    label='Boat name'
                    type='text'
                    stateHandler={handleChangeBoatName}
                    errosMessage={errorBoatName}
                    required={false}
                />
                <DoubleInput
                    label='Boat size'
                    type='text'
                    labelFirst='Boat length'
                    labelSecond='Boat width'
                    firstImg={Separator}
                    firstState={boatHeight}
                    secondState={boatWidth}
                    setFirstState={(len) => handleChangeNumber(len, setBoatHeight, 50)}
                    setSecondState={(len) => handleChangeNumber(len, setBoatWidth, 50)}
                    width='50%'
                    secondInputWidth='50%'
                />
                 <DefaultInput
                    error={error.name}
                    value={draft}
                    label='Draft'
                    type='text'
                    stateHandler={handleChangeDraft}
                    errosMessage={errorBoatName}
                    required={false}
                />

                <RadioButtons
                    radio1={engineType === EEngineSource.ENGINE}
                    radio2={engineType === EEngineSource.SAIL}
                    handleRadio1={() => setEngineType(EEngineSource.ENGINE)}
                    handleRadio2={() => setEngineType(EEngineSource.SAIL)}
                    label1='Engine'
                    label2='Sail'
                    title='Power source'
                />

                <div className="defaultInputWrapper">
                    <div className='labelWrapper'>
                        <img src={Star} alt='*' style={{ width: '5px', height: '5px' }} />
                        <label className='labelStyle'>{'Parking duration'}</label>
                    </div>

                    <RangePicker
                        className="datePicker"
                        popupStyle={{ zIndex: 9999 }}
                        separator={<img
                            width={"80px"} src={LineSeparator}
                        />}
                        inputReadOnly={true}
                        onChange={onChangeData}
                    />
                </div>

                <RadioButtons
                    radio1={paidType === ECheckboxCash.CASH}
                    radio2={paidType === ECheckboxCash.CARD}
                    radio3={paidType === ECheckboxCash.CHECK}

                    handleRadio1={() => setPaidType(ECheckboxCash.CASH)}
                    handleRadio2={() => setPaidType(ECheckboxCash.CARD)}
                    handleRadio3={() => setPaidType(ECheckboxCash.CHECK)}

                    label1='cash'
                    label2='card'
                    label3='check'

                    title='Payment method'
                    required={true}
                />
                <DefaultInput
                    error={error.price}
                    value={price}
                    label='Price'
                    type='text'
                    stateHandler={handleChangePrice}
                    required={true}
                />

                <RadioButtons
                    radio1={paymentStatus === ECheckboxType.PAID}
                    radio2={paymentStatus === ECheckboxType.UNPAID}
                    radio3={paymentStatus === ECheckboxType.PARTIALLY_PAID}

                    handleRadio1={() => setPaymentStatus(ECheckboxType.PAID)}
                    handleRadio2={() => setPaymentStatus(ECheckboxType.UNPAID)}
                    handleRadio3={() => setPaymentStatus(ECheckboxType.PARTIALLY_PAID)}

                    label1='paid'
                    label2='unpaid'
                    label3='partially paid'

                    title='Status'
                    required={true}
                />

            </form>
            <div className='buttonWrapper'>
                <button
                    className='cancelButtonStyle'
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className={!dataEmpty ? 'reservebuttonDisable' : 'reservebuttonStyle'}
                    disabled={!dataEmpty}
                    onClick={handleReservate}
                >
                    {isLoading ? <CircularProgress /> :
                        <p >Create reservation</p>}
                </button>
            </div>
        </div>
    )
}
