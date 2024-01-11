import { createContext, useState } from 'react';
import { IReservationDisplay } from '../types/marina.types';

interface AppContextProps {
    data: IReservationDisplay[];
    setData: React.Dispatch<React.SetStateAction<IReservationDisplay[]>>;
}

const dataContext = {
    data:[],
    setData: ()=> {} ,
}

export const ReportingContext = createContext<AppContextProps>(dataContext);

export const ReportingProvider= ({ children }:{children:React.ReactNode}) => {
  const [data, setData] = useState<IReservationDisplay[]>([]);

  return (
    <ReportingContext.Provider value={{ data, setData }}>
      {children}
    </ReportingContext.Provider>
  );
};

