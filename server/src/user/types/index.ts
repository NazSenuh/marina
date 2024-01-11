export interface IRecoveryLink {
    link: string,
    expiredAt: string
}

export interface IUser {
    email: string,
    password: string,
    recoveryLink?: IRecoveryLink,
}