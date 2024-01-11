import validator from 'validator'

export const isValidEmail = (email: string): Boolean => {
    return validator.isEmail(email)
}
