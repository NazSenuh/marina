import { useState } from "react"

interface SortArrowProps {
    onSort:Function;
    order?:'asc'|'desc'
} 
export const SortArrow = ({onSort, order}:SortArrowProps) => {
    const [active, setActive] = useState<string |undefined>(order)

    const calculateSort = (param?: "asc"|"desc")=>{
        if(!param){
            return "asc"
        }
        if(param === "asc"){
            return "desc"
        }
        return undefined
        
    }

    const handleClick = (param?: "asc"|"desc") => {
        setActive(calculateSort(param))
        onSort(calculateSort(param))
    }
    

    return (
        <div onClick={handleClick.bind(this, order)}>
            <svg width="15" height="22" viewBox="0 0 11 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path  d="M9.46854 12.9382H1.53146C1.2934 12.9382 1.16047 13.1896 1.3079 13.3612L5.27644 17.963C5.39003 18.0947 5.60876 18.0947 5.72356 17.963L9.6921 13.3612C9.83953 13.1896 9.7066 12.9382 9.46854 12.9382Z" fill={active ==='asc' ? '#000' : "#D9D9D9"} />
                <path d="M9.6921 9.63879L5.72356 5.03702C5.60997 4.9053 5.39124 4.9053 5.27644 5.03702L1.3079 9.63879C1.16047 9.81039 1.2934 10.0617 1.53146 10.0617H9.46854C9.7066 10.0617 9.83953 9.81039 9.6921 9.63879Z" fill={active ==='desc' ? '#000' : "#D9D9D9"} />
            </svg>
        </div>
    )
}