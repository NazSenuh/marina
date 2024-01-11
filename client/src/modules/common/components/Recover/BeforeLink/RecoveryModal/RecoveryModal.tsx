import { useHistory } from "react-router-dom";
import { APP_KEYS } from "../../../../consts";

import arrow from "../../../../../../assets/arrow.svg"
import './RecoveryModal.css'

export const RecoveryModal = ({email}:{email: string}) => {
    const history = useHistory();

  return (
    <div className="signInWrapper">
      <div className="marina">

      </div>
            <div className="form">
                <p className="heading">Password Recovery</p>

                <div className="recovery-modal-message">
                     An email with a recovery link has been sent to your
                     address <div className="email-name">"{email}”</div>. Click the link in the email to 
                     proceed. If you don't see the email in your inbox, please 
                     check your spam folder.
                </div>

                <div className="back-home">
                    <button
                        className='home-button-disabled'
                        onClick={()=>history.push(APP_KEYS.ROUTER_KEYS.LOGIN)}
                       >
                        <img src={arrow} alt="home"/>

                        Back to Home
                    </button>
                </div>

            </div>
      </div>
);
}