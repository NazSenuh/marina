import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface IFilter {
    selectedSeasons: string[];
    setSelectedSeasons: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterContextDefaultValue: IFilter ={
    selectedSeasons: [],
    setSelectedSeasons: ()=> {}
}

type Props ={
    children: ReactNode;
}

export const FilterContext = createContext<IFilter>(FilterContextDefaultValue);


export const FilterProvider = ({children}: Props) =>{
    const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
    
    return (
        <FilterContext.Provider value={{selectedSeasons, setSelectedSeasons}}>{children}</FilterContext.Provider>
    )
}


