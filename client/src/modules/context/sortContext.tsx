import { createContext, useContext, useState } from 'react';
import { IReservationDisplay } from '../types/marina.types';

interface AppContextProps {
    orderBy: string;
    setOrderBy: React.Dispatch<React.SetStateAction<string>>;

  order: 'asc' | 'desc' | undefined;
  setOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc' | undefined>>;
}

const sortingContext = {
  orderBy:'fullName',
  setOrderBy: ()=> {} ,

  order: undefined,
  setOrder: ()=> {}
}

export const OrderContext = createContext<AppContextProps>(sortingContext);

export const SortingProvider= ({ children }:{children:React.ReactNode}) => {
  const [orderBy, setOrderBy] = useState<string>('fullName');
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>(undefined);


  return (
    <OrderContext.Provider value={{ orderBy, setOrderBy,order, setOrder  }}>
      {children}
    </OrderContext.Provider>
  );
};

