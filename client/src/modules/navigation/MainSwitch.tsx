import {  Route, Switch, useHistory } from "react-router-dom";
import { APP_KEYS } from "../common/consts";
import Login from "../common/components/Login/Login";
import { UserProtectedPage } from "../common/hoc/user.private.page";
import { RecoveryStart } from "../common/components/Recover/BeforeLink/RecoveryStart/RecoveryStart";
import { SetNewPassword } from "../common/components/Recover/AfterLink/RecoverPassword/RecoverPassword";
import Home from "../common/components/Home/Home";
import { LinkExpiredModal } from "../common/components/Recover/AfterLink/LinkExpired/LinkExpired";
import Reporting from "../common/components/Reporting/Reporting";
import InfoModal from "../common/components/Modals/InfoModals/InfoModalFree/Modal";
import { UserProtectedPageLink } from "../common/hoc/link.verification.page";
import { EQueryKeys } from "../types/marina.types";
import { useQuery } from "react-query";
import reservationService from "../services/reservation.service";
import { useEffect, useContext} from "react";
import { ReportingContext } from "../context/reportingContext";

export const MainSwitch = () => {
  const data = useContext(ReportingContext)
  const { data: reportingData, isLoading, refetch} = useQuery(
    EQueryKeys.ALL_REPORTS, 
    reservationService.getAllReservations.bind(reservationService)
  )

  useEffect(()=>{
    if(reportingData){
      data.setData(reportingData)
    }
  },[reportingData])

  return (
    <Switch>
      <>
        <Route
          component={UserProtectedPage(()=> <Home 
            refetch={refetch}
            />)}
          exact path={APP_KEYS.ROUTER_KEYS.HOME}
        />
        <Route component={Login} path={APP_KEYS.ROUTER_KEYS.LOGIN} />
        <Route
          component={RecoveryStart}
          path={APP_KEYS.ROUTER_KEYS.CHANGE_PASS}
        />
        <Route

          component={UserProtectedPageLink(SetNewPassword)}
          path={APP_KEYS.ROUTER_KEYS.SET_NEW_PASSWORD}
        />
        <Route component={LinkExpiredModal} path={APP_KEYS.ROUTER_KEYS.EXPIRED} />
        <Route component={()=> <Reporting reportingData={reportingData} isLoading={isLoading} refetch={refetch} />} path={APP_KEYS.ROUTER_KEYS.REPORTING} />
        <Route component={InfoModal} path={APP_KEYS.ROUTER_KEYS.MODAL} />
      </>
    </Switch>
  )
}