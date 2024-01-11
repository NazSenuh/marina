import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

import { emailSchema } from '../../../../validation/emailValidation'
import { APP_KEYS } from "../../../../consts";
import authService from "../../../../../services/auth.service";
import { IEmail } from "../../../../../types/marina.types";

import mailIcon from "../../../../../../assets/mailIcon.svg"
import arrow from "../../../../../../assets/arrow.svg"
import { RecoveryModal } from "../RecoveryModal/RecoveryModal";

import './RecoveryStart.css'
import { EValidateError } from "../../../../../types/error.types";
import { isValidEmail } from "../../../../../utils/validate-email";

type TErrors = {
  isError: boolean
  message: string
}

export const RecoveryStart = () => {
  const [email, setEmail] = useState<string>("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [credEmpty, setCredEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState<TErrors>({ isError: false, message: '' })

  const history = useHistory();

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    if (isValidEmail(email)) {
      const errorMsg = { isError: false, message: '' }
      setErrorEmail(errorMsg)
    }
  }
  const BlurChangeEmail = () => {
    setEmailFocus(false)
    const isEmail = isValidEmail(email)

    if (!isEmail) {
      const errorMsg = { isError: true, message: EValidateError.EMAIL_MESSAGE }
      setErrorEmail(errorMsg)
    } else {
      const errorMsg = { isError: false, message: '' }
      setErrorEmail(errorMsg)
    }
  }

  useEffect(() => {
    if (email) {
      setCredEmpty(!!email);
      setError(false)

    } else {
      setCredEmpty(!!email);
    }
  }, [email]);

  const toggleStyle = () => {
    if (error) {
      return "error-email-wrapper email-body";
    } else if (emailFocus) {
      return "active-email-body email-body";
    }
    return "email-body";
  };

  const { mutate: recover } = useMutation<string, AxiosError<any>, IEmail>(
    (req) => authService.sendEmail(req),
    {
      onError: (error) => {
        setError(true);
        setSendEmail(false);
      },
      onSuccess: (data) => {
        setError(false);
        setSendEmail(true);
      },
    }
  );

  const submitEmail = async (event: React.ChangeEvent<any>) => {

    event.preventDefault()
    let formData = {
      email: event?.target[0].value,
    }

    const isValid = await emailSchema.isValid(formData)

    if (!isValid) {
      return setError(true)
    }
    return setError(false)
  }


  const sendEmailHandler = async () => {

    const isValid = await emailSchema.isValid({ email })
    if (!isValid) {
      return setError(true)
    }
    recover({ email })
  }




  return (
    <div className="start-signInWrapper">
      <div className="marina">

      </div>


      {sendEmail ?
        <RecoveryModal email={email} />
        :
        <>
          <form className="start-form" onSubmit={submitEmail}>
            <p className="heading">Password Recovery</p>

            <div className="start-email-wrapper">
              <label>Email</label>
              <div className={toggleStyle()}>
                <img src={mailIcon} alt="mail" />
                <input
                  placeholder="Email"
                  onFocus={setEmailFocus.bind(this, true)}
                  onBlur={BlurChangeEmail}
                  type="text"
                  value={email}
                  onChange={handleChangeEmail}
                />
              </div>
              {errorEmail?.isError ?
                <span >
                  {errorEmail.message}
                </span>
                : null
              }
              { !errorEmail?.isError && error ? <span >Email not found</span> : null}

            </div>
            <button
              className={credEmpty ? "send-button-active" : "send-button-disabled"}
              disabled={!credEmpty}
              onClick={sendEmailHandler}
            >
              Send
            </button>

            <div className="back-home">
              <button onClick={() => history.push(APP_KEYS.ROUTER_KEYS.LOGIN)}>
                <img src={arrow} alt="home" />
                Back to Home
              </button>
            </div>
          </form>
        </>
      }
    </div>
  );
};
