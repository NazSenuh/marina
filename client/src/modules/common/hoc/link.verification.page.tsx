import React from 'react'
import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import { EQueryKeys, ResetPasswordRouteParams } from '../../types/marina.types';
import { useQuery } from 'react-query';
import userService from '../../services/user.service';
import { ROUTER_KEYS } from '../consts/app-keys.const';

export function UserProtectedPageLink<P extends RouteComponentProps>(Page: React.ComponentType<P>) {
  return function UserProtectedPageWrapper(props: P) {
    const history = useHistory();
    const { link  } = useParams<ResetPasswordRouteParams>();
    const email = props.location.search

    const handleError = ()=>{
        history.push(ROUTER_KEYS.EXPIRED)
    }
    const handleSuccess = ()=>{
        history.push(`${ROUTER_KEYS.SET_NEW_PASSWORD.split(':')[0]}${link}${email}`)
    }    
    const { data: userInfo} = useQuery(EQueryKeys.GET_LINK, ()=>userService.getUser(link, email),{
        retry:false,
        onError: handleError,
        onSuccess: handleSuccess,
    });
   
    if (!!userInfo) {
      return <Page {...props} />;
    }

    return null;
  };
}
