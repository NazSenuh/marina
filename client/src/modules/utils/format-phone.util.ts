import { validateNumeric } from "./validate-input.util"

const validatePhone = (value: string) => {
    const signsToRemove = ['+', '(', ')', '-', ' ']
    for (const elem of signsToRemove) {
        value = value.split(elem).join('');
    }

    return validateNumeric(value)
}

export const formatPhone = (currentNumber: string, prevNumber: string) => {
    if (!validatePhone(currentNumber)) {
        return
    }
   
    if (currentNumber.length === 1 && prevNumber.length < currentNumber.length) {
      
        const arr = currentNumber.split('')
        arr.splice(0, 0, '(')
        currentNumber = arr.join('')
    }
    else if (currentNumber.length === 4 && prevNumber.length < currentNumber.length) {
        currentNumber+=') '
    } else if (currentNumber.length === 9 && prevNumber.length < currentNumber.length ) {
        currentNumber+='-'
    } else if (currentNumber.length === 15 && prevNumber.length < currentNumber.length) {
        return
    }
    return currentNumber
}