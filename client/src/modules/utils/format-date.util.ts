import { validateNumeric } from "./validate-input.util"

export const formatDate = (currentDate: string, prevDate: string) => {
    if (!currentDate) {
        return currentDate
    }
    if (!validateNumeric(currentDate.split('-').join(''))) {
        return
    }
    if (currentDate.length === 11) {
        return
    }
    if ((currentDate.length === 4 || currentDate.length === 7) && prevDate.length < currentDate.length) {
       currentDate+='-'   
    }
    return currentDate
}