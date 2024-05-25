import { ChangeEvent, useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ELogin } from "../../../types/marina.types";
import { APP_KEYS } from "../../consts";
import LogOutImg from "../../../../assets/LogOutImg.svg";
import Send from "../../../../assets/Send.svg";
import Logo from "../../../../assets/Logo.svg";

import NavigationTabs from "../NavigationTabs/NavigationTabs";
import ModalTrigger from "../ModalTrigger/ModalTrigger";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import seasonService from "../../../services/season.service";
import AnnouncementModal from "../Modals/AnnouncementModal/AnnouncementModal";

import "./Header.scss";
import { TimePicker } from "antd";

export const Header = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("home");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [classNames, setClassNames] = useState<string>('')

  const handleOpen = () => {
    setIsOpenModal(true);
  };

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const [state, setState] = useState(
    history.location
  );

  useLayoutEffect(() => history.listen(setState), [history]);

  const Logout = () => {
    localStorage.removeItem(ELogin.TOKEN);
    history.push(APP_KEYS.ROUTER_KEYS.LOGIN);
  };

  const toInclude = {
    [APP_KEYS.ROUTER_KEYS.LOGIN]: 'login',
    [APP_KEYS.ROUTER_KEYS.CHANGE_PASS]: 'recover',
    [APP_KEYS.ROUTER_KEYS.EXPIRED]: 'expired',
    [APP_KEYS.ROUTER_KEYS.SET_NEW_PASSWORD]: 'newpass',
  }
  const { mutate: closeActiveSeasonAndCreateNew } = useMutation<string, AxiosError<any>, void>(() => {
    handleClose();
    return seasonService.closeActiveSeasonAndCreateNew();
  });

  const handleYes = async () => {
    closeActiveSeasonAndCreateNew();
  };


  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setOpenMenu(event.target.checked)
    if (openMenu) {
      return setClassNames('input-not-checked')
    }
    setClassNames('input-checked-header')
  }


  const shouldNotInclude = !Object.values(toInclude).some(item => history.location.pathname.includes(item));
  return (
    <>
      {shouldNotInclude ?
        <header className="nav-bar" >
          <div className="logoWrapper">
            {/* <img src={Logo} /> */}

          </div>
          <div className='burger-menu'>
            <input type="checkbox" onChange={inputHandler} checked={openMenu} />
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`buttons-container ${classNames}`} >
            <div className="buttons-wrapper">
              <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} handleClick={()=>{setClassNames('input-not-checked'); setOpenMenu(false)}} />
              <div className="modal-buttons">
                {/* <ModalTrigger
                  isOpenModal={isOpenModal}
                  setIsOpenModal={setIsOpenModal}
                  handleSuccess={handleYes}
                  modalTrigger={
                    <div onClick={() => handleOpen()} className="announcement">
                      <img src={Send} alt="logOut" />
                      Send Announcement
                    </div>
                  }
                >
                  <AnnouncementModal onClose={handleClose} />
                </ModalTrigger> */}
                <div onClick={Logout} className="logOut">
                  <img src={LogOutImg} alt="logOut" />
                  Вихід
                </div>
              </div>
            </div>
          </div>
        </header > :
        null
      }
    </>
  );
};


export default Header;
