import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";

import {
  ECheckboxCash,
  ECheckboxType,
  EEngineSource,
  IReservation,
} from "../../../../types/marina.types";
import { EValidateError } from "../../../../types/error.types";
import reservationService from "../../../../services/reservation.service";
import { CircularProgress } from "@mui/material";
import { ReservationSchema } from "../../../validation/reservationValidation";
import { formatPhone } from "../../../../utils";
import { validateNumeric } from "../../../../utils/validate-input.util";
import { isValidEmail } from "../../../../utils/validate-email";
import { toastError, toastSuccess } from "../../Toasts/Toasts";
import { Button, TimePicker } from "antd";
import LineSeparator from "../../../../../assets/Picker-Separator.svg";
import Star from "../../../../../assets/Star.svg";
import Separator from "../../../../../assets/Separator.svg";
import seasonService from "../../../../services/season.service";
import { Input as AntInput } from "antd";
import { ConfigProvider, DatePicker, DatePickerProps } from "antd";
import { RangePickerProps } from "antd/es/date-picker";

import "./ReserveModal.styles.css";

interface IPropsInput {
  label: string;
  type?: string;
  stateHandler?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  value: string | undefined;
  error?: string;
  errosMessage?: TErrors;
  defVaue?: string;
  number?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export const DefaultInput = ({
  label,
  type,
  stateHandler,
  value,
  onBlur,
  errosMessage,
  number,
  required,
  disabled,
}: IPropsInput) => (
  <div className="defaultInputWrapper">
    <div className="labelWrapper">
      {required ? (
        <img src={Star} alt="*" style={{ width: "5px", height: "5px" }} />
      ) : (
        <div style={{ marginTop: "5px" }}></div>
      )}
      <label className="labelStyle">{label}</label>
    </div>

    <AntInput
      type={type}
      value={value}
      placeholder={label}
      onChange={stateHandler}
      onBlur={onBlur}
      size="large"
      disabled={disabled}
      prefix={!number ? <></> : <div>+38</div>}
    />
    {errosMessage?.isError ? (
      <div className="errorText">{errosMessage.message}</div>
    ) : null}
  </div>
);

interface IModalProps {
  onClose: () => void;
  code: string;
  onCancel: () => void;
}
type TErrors = {
  isError: boolean;
  message: string;
};

<ConfigProvider
  theme={{
    components: {
      DatePicker: {
        activeBorderColor: "#000000",
        borderRadius: 1000,
        activeBg: "#000000",
        colorBgContainer: "#000000",
        activeShadow: "#000000",
        addonBg: "#FFFFFF",
        fontSize: 90,
      },
    },
  }}
></ConfigProvider>;

export default function ReserveModal({ onClose, code, onCancel }: IModalProps) {
  const { RangePicker } = DatePicker;
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [price, setPrice] = useState<string>("");

  const [error, setError] = useState<Record<string, string>>({});
  const [errorName, setErrorName] = useState<TErrors>({
    isError: false,
    message: "",
  });
  const [errorPhone, setErrorPhone] = useState<TErrors>({
    isError: false,
    message: "",
  });
  const [dataEmpty, setDataEmpty] = useState<boolean>(true);

  const handleSuccessClose = () => {
    toastSuccess("Reservation was successfully created");
    onClose();
  };
  const handleErrorClose = () => {
    console.log("error");
    toastError("Oops! Something went wrong.");
    onClose();
  };

  const { mutate: createReservation, isLoading } = useMutation(
    (data: IReservation) => reservationService.createReservation(code, data),
    {
      onSuccess: handleSuccessClose,
      onError: handleErrorClose,
    }
  );

  const validate = async (data: IReservation) => {
    try {
      await ReservationSchema.validate(data);
      return null;
    } catch (e: any) {
      return { [e.path]: e.message };
    }
  };
  useEffect(() => {
    setDataEmpty(
      !!(name.length >= 2 && number && startDate && endDate)
    );
  }, [name, number, startDate, endDate]);

  const handleReservate = async () => {
    const data = {
      fullName: name,
      phoneNumber: "+38" + number,
      startDate,
      endDate,
      price,
    };

    // const err = await validate(data);
    // if (err) {
    //   setError(err);
    //   return;
    // }
    createReservation(data);
  };

  //PhoneNumber
  const handleChangePhoneNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const phone = formatPhone(event.target.value, number);
    if (phone) {
      setNumber(phone);
    }
    if (event.target.value.length >= 11 && errorPhone.isError) {
      const errorMsg = { isError: false, message: "" };
      setErrorPhone(errorMsg);
    }
  };
  const BlurChangePhone = () => {
    if (number.length < 14) {
      const errorMsg = { isError: true, message: EValidateError.PHONE_MESSAGE };
      setErrorPhone(errorMsg);
    } else {
      const errorMsg = { isError: false, message: "" };
      setErrorPhone(errorMsg);
    }
  };
  //boatName

  //Email

  //Name
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 50) {
      setName(event.target.value);
    }
    if (event.target.value.length >= 2 && errorName.isError) {
      const errorMsg = { isError: false, message: "" };
      setErrorName(errorMsg);
    }
  };
  const BlurChangeName = () => {
    if (name.length < 2) {
      const errorMsg = { isError: true, message: EValidateError.NAME_MESSAGE };
      setErrorName(errorMsg);
    } else {
      const errorMsg = { isError: false, message: "" };
      setErrorName(errorMsg);
    }
  };

  //Draft

  //Price
  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currprice = validateNumeric(event.target.value);
    if (
      event.target.value.length <= 6 &&
      currprice &&
      !(event.target.value.length === 1 && event.target.value[0] === "0")
    ) {
      setPrice(event.target.value);
    }
  };
  //

  const onChangeTime = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    if (dateString) {
      setStartDate(dateString[0]);
      setEndDate(dateString[1]);
      setPrice(calculatePrice(dateString[0], dateString[1]));
    }
  };

  const calculatePrice = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) {
      return "";
    }
    const parseDateTime = (dateTime: string): Date => {
      return new Date(dateTime.replace(' ', 'T')); 
  };

    const startDate = parseDateTime(startTime);
    const endDate = parseDateTime(endTime);


    let differenceInMilliseconds = endDate.getTime() - startDate.getTime();


    if (differenceInMilliseconds < 0) {
      differenceInMilliseconds += 24 * 3600;
    }

    const price = Math.round(differenceInMilliseconds * 0.00002777);

    return price.toString();
  };


  return (
    <div>
      <form className="formStyle">
        <DefaultInput
          onBlur={BlurChangeName}
          error={error.name}
          value={name}
          label="Full name"
          type="text"
          stateHandler={handleChangeName}
          errosMessage={errorName}
          required={true}
        />

        <DefaultInput
          error={error.number}
          value={number}
          label="Phone number"
          type="text"
          stateHandler={handleChangePhoneNumber}
          onBlur={BlurChangePhone}
          errosMessage={errorPhone}
          defVaue="+38"
          number={true}
          required={true}
        />

        <div className="defaultInputWrapper">
          <div className="labelWrapper">
            <img src={Star} alt="*" style={{ width: "5px", height: "5px" }} />
            <label className="labelStyle">{"Parking duration"}</label>
          </div>

          {/* <TimePicker.RangePicker
            className="datePicker"
            onChange={onChangeTime}
            popupStyle={{ zIndex: 9999 }}
          /> */}
            <RangePicker
              className="datePicker"
              showTime
              onChange={onChangeTime}

              popupStyle={{ zIndex: 9999 }}

             />
          {/* <RangePicker
                        className="datePicker"
                        popupStyle={{ zIndex: 9999 }}
                        separator={<img
                            width={"80px"} src={LineSeparator}
                        />}
                        inputReadOnly={true}
                        onChange={onChangeData}
                    /> */}
        </div>

        {/* <Button
           style={{ width: '100%', textAlign: 'left' }}

        >
          Focus at first
        </Button> */}
        <DefaultInput
          error={error.price}
          value={calculatePrice(startDate, endDate)}
          label="Price"
          type="text"
          stateHandler={handleChangePrice}
          required={true}
          disabled={true}
        />
      </form>
      <div className="buttonWrapper">
        <button className="cancelButtonStyle" onClick={onCancel}>
          Cancel
        </button>
        <button
          className={!dataEmpty ? "reservebuttonDisable" : "reservebuttonStyle"}
          disabled={!dataEmpty}
          onClick={handleReservate}
        >
          {isLoading ? <CircularProgress /> : <p>Create reservation</p>}
        </button>
      </div>
    </div>
  );
}
