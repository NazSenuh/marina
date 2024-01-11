import { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from "react-query";
import { AxiosError } from "axios";

import { NewPasswordSchema } from '../../../../validation/newPassword'
import passwordIcon from "../../../../../../assets/input-prefix.svg";
import eyeIcon from "../../../../../../assets/input-suffix.svg";

import { INewPass, ResetPasswordRouteParams } from "../../../../../types/marina.types";
import authService from "../../../../../services/auth.service";
import { APP_KEYS } from "../../../../consts";

import './RecoverPassword.css'

export const SetNewPassword = () => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const [passwordShown, setPasswordShown] = useState(false);
  const [repeadPasswordShown, setRepeadPasswordShown] = useState(false);

  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [matchPassError, setMatchPassError] = useState(false);

  const [credEmpty, setCredEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);



  const { link } = useParams<ResetPasswordRouteParams>();

  const searchParams = new URLSearchParams(document.location.search)
  const email = searchParams.get('email')
  const history = useHistory()

  const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }
  const confirmPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
  }
  const togglePassword = () => {
    setPasswordShown(prev => !prev);
  }
  const toggleConfirmPassword = () => {
    setRepeadPasswordShown(prev => !prev);
  }


  useEffect(() => {
    if (password && confirmPassword) {
      setCredEmpty(true)
      setError(false)
      setMatchPassError(false)
    } else {

      setCredEmpty(false)
    }
  }, [password, confirmPassword])


  const toggleInputStyle = (inputType: string) => {
    if (error) {
      return "error-password-wrapper password-body";
    } else if (inputType === 'password' && passwordFocus) {
      return "active-password-body password-body";
    } else if (inputType === 'confirmPassword' && confirmPasswordFocus) {
      return "active-password-body password-body";
    } else {
      return "password-body";
    }
  }
  
  
  const submitCredentials =  (event: React.ChangeEvent<any>) => {
    try {
      event.preventDefault()
      let formData = {
        password: password,
        confirmPassword: confirmPassword,
      }
      
      const isValid =  NewPasswordSchema.isValidSync(formData)
      
      setError(!isValid)

      if (!email) {
        throw new Error('Unable to detect email')
      }
      if(isValid){
        return  setNewPass({ password, confirmPassword, email })
      }
      
    } catch (e: any) {
      if (e.message === 'Passwords must match') {
        setMatchPassError(true)
      }
      return setError(true)
    }
  }
  const errorSend = () => {
    history.push(APP_KEYS.ROUTER_KEYS.EXPIRED)
  }

  const successSend = () => {
    history.push(APP_KEYS.ROUTER_KEYS.LOGIN)
  }

  const { mutate: setNewPass } = useMutation<string, AxiosError<any>, INewPass, string>((req) => authService.setNewPassword(req, link),
    { onSuccess: successSend, onError: errorSend })


  return (
    <form className="signInWrapper" >
      <div className="marina"></div>
      <div className="recover-form">
        <p className="heading">Password Recovery</p>

        <div className="password-wrapper">
          <label>New Password</label>
          <div className={toggleInputStyle('password')}>
            <img src={passwordIcon} alt="password"/>
            <input
              onFocus={setPasswordFocus.bind(this, true)}
              onBlur={setPasswordFocus.bind(this, false)}
              placeholder="Password"
              type={passwordShown ? "text" : "password"}
              value={password}
              onChange={passwordHandler}

            />
            <img src={eyeIcon} onClick={togglePassword} alt="show"/>
          </div>
          <div className={error ? "error-password-requirements" : "password-requirements"}>
            <p>Your Password should contain:</p>
            <ul>
              <li>8 characters</li>
              <li>upper & lowercase letters</li>
              <li>at least one number or symbol</li>
            </ul>
          </div>
        </div>


        <div className={matchPassError ? "password-wrapper-error" : "password-wrapper"}>
          <label>Confirm Password</label>
          <div className={toggleInputStyle('confirmPassword')}>
            <img src={passwordIcon} alt="pass"/>
            <input
              onFocus={setConfirmPasswordFocus.bind(this, true)}
              onBlur={setConfirmPasswordFocus.bind(this, false)}
              placeholder="Password"
              type={repeadPasswordShown ? "text" : "password"}
              value={confirmPassword}
              onChange={confirmPasswordHandler}
            />
            <img src={eyeIcon} onClick={toggleConfirmPassword} alt="show"/>
          </div>
          {matchPassError ? <span>Passwords must match</span> : null}

        </div>

        <button
          className={
            credEmpty ? "sign-in-button-active" : "submit-button-disabled"
          }
          onClick={submitCredentials}
          disabled={!credEmpty}
        >
          Submit
        </button>
      </div>
    </form>
  );
}