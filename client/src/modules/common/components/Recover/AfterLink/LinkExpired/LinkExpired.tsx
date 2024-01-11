import { useHistory } from "react-router-dom";
import { APP_KEYS } from "../../../../consts";

import './LinkExpired.css'

export const LinkExpiredModal = () => {
    const history = useHistory();

  return (
    <div className="signInWrapper">
      <div className="marina">
      </div>
            <div className="form">
                <p className="heading">Email verification link expired</p>

                <div className="recovery-modal-message">
                    Looks like verification link has expired. Do not worry, we can send the link again.
                </div>

               
                <button
                    className='recover-button-active'
                    onClick={()=>history.push(APP_KEYS.ROUTER_KEYS.CHANGE_PASS)}
                     >
                    Recend verification link
                </button>


            </div>
      </div>
);
}