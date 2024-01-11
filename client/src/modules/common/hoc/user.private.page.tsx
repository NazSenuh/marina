import React, { useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { APP_KEYS } from '../consts';
import { ELogin } from '../../types/marina.types';

export function UserProtectedPage<P extends RouteComponentProps>(Page: React.ComponentType<P>) {
  return function UserProtectedPageWrapper(props: P) {
    const history = useHistory();
    const token = localStorage.getItem(ELogin.TOKEN);

    useEffect(() => {
      if (!token) {
        history.push(APP_KEYS.ROUTER_KEYS.LOGIN);
      }
    }, [token]);

    if (!!token) {
      return <Page {...props} />;
    }

    return null;
  };
}
