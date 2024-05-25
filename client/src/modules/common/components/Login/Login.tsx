import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { ELogin, ILoginUser } from "../../../types/marina.types";
import authServices from "../../../services/auth.service"
import { ROUTER_KEYS } from "../../consts/app-keys.const";

import mailIcon from "../../../../assets/mailIcon.svg"
import passwordIcon from "../../../../assets/input-prefix.svg";
import eyeIcon from "../../../../assets/input-suffix.svg";

import './Login.css'
import { LoginSchema } from "../../validation/loginValidation";
import { isValidEmail } from "../../../utils/validate-email";
import { EValidateError } from "../../../types/error.types";

type TErrors = {
    isError: boolean
    message: string
}
export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [credEmpty, setCredEmpty] = useState(false);
  const [error, setError] = useState(false);
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
  const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const { mutate: Login } = useMutation<string, AxiosError<any>, ILoginUser>((req) => authServices.login(req),
    {
      onSuccess: data => successLogin(data),
      onError: error => setError(true)
    })

  const signHandler = async () => {
    const isValid = await LoginSchema.isValid({ email, password })
    if (!isValid) {
      return setError(true)
    }
    const user = { email, password }
    Login(user)
  }

  const successLogin = (data: string) => {
    localStorage.setItem(ELogin.TOKEN, data)
    const token = localStorage.getItem(ELogin.TOKEN)
    if (token) {
      history.push(ROUTER_KEYS.HOME)
    } else {
      setError(true)
    }
  }

  const togglePassword = () => {
    setPasswordShown(prev => !prev);
  }

  useEffect(() => {
    if (email && password) {
      setCredEmpty(true)
      setError(false)
    } else {
      setCredEmpty(false)

    }
  }, [email, password])


  const toggleInputStyle = (inputType: string) => {
    if (error) {
      return "error-password-wrapper password-body";
    } else if (inputType === 'text' && emailFocus) {
      return "active-email-body email-body";
    } else if (inputType === 'password' && passwordFocus) {
      return "active-password-body password-body";
    } else {
      return "email-body";
    }
  }

  return (
    <div className="signInWrapper">
      <div className="marinaLogIn">

      </div>
      <div className="formLogIn">
        <p className="heading">Логін</p>

        <div className="email-wrapper">
          <label>Електронна пошта</label>
          <div className={toggleInputStyle('text')}>
            <img src={mailIcon} alt="mail" />
            <input
              placeholder="Електронна пошта"
              onFocus={() => setEmailFocus(true)}
              onBlur={BlurChangeEmail}
              type="text"
              value={email}
              onChange={handleChangeEmail} />
          </div>
          {errorEmail?.isError ?
            <div className='errorText'>
                {errorEmail.message}
            </div>
            : null
          }
        </div>

        <div className="password-wrapper">
          <label>Пароль</label>
          <div className={toggleInputStyle('password')}>
            <img src={passwordIcon} alt="password" />
            <input
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              placeholder="Пароль"
              type={passwordShown ? "text" : "password"}
              value={password} onChange={passwordHandler}
            />
            <img src={eyeIcon} onClick={togglePassword} alt="show" />
          </div>
          {error ? <span> Неправильна адреса електронної пошти або пароль</span> : null}
        </div>


        <a href="/recover" className="forgot_password">
          Забули пароль?
        </a>

        <button
          className={credEmpty ? 'sign-in-button-active' : 'sign-in-button-disabled'}
          disabled={!credEmpty}
          onClick={signHandler}  >
          Увійти
        </button>
      </div>
    </div>
  );
}