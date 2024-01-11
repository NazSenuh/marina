import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface IStatus {
    selectedStatus: string;
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
}

const StatusContextDefaultValue: IStatus ={
    selectedStatus: '',
    setSelectedStatus: ()=> {}
}

type Props ={
    children: ReactNode;
}

export const StatusContext = createContext<IStatus>(StatusContextDefaultValue);


export const StatusProvider = ({children}: Props) =>{
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    
    return (
        <StatusContext.Provider value={{selectedStatus, setSelectedStatus}}>{children}</StatusContext.Provider>
    )
}


