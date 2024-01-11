import mongoose from "mongoose"

import { IRecoveryLink, IUser } from "../types";


const recoveryLinkSchema = new mongoose.Schema<IRecoveryLink>({
    link: { type: String, require },
    expiredAt: { type: String, require }
});

export const User = new mongoose.Schema<IUser>({
    email: { type: String, require },
    password: { type: String, require},
    recoveryLink: { type: recoveryLinkSchema, default: null}
})

export const UserModel =  mongoose.model('Users', User)